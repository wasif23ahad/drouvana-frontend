'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sparkles, Layers, ChevronRight, Loader2, Copy, CheckCircle2, Download, FileText, RefreshCw, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';

interface CoverLetterVariant {
  type: string;
  label: string;
  content: string;
  word_count: number;
  keyword_score: number;
  opening_line?: string;
}

const TONE_OPTIONS = [
  { id: 'professional', label: 'Professional' },
  { id: 'enthusiastic', label: 'Enthusiastic' },
  { id: 'analytical', label: 'Analytical' },
  { id: 'executive', label: 'Executive' },
];

export default function CoverLetterPage() {
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeVariant, setActiveVariant] = useState(0);
  const [streamingText, setStreamingText] = useState('');

  const [params, setParams] = useState({
    jobTitle: '',
    companyName: '',
    hiringManager: '',
    jobDescription: '',
    tone: 'professional',
    customInstructions: '',
  });

  const [variants, setVariants] = useState<CoverLetterVariant[]>([]);
  const [savedVariants, setSavedVariants] = useState<Set<number>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  const getAPIBase = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const generateCoverLetters = async () => {
    if (!params.jobTitle.trim() || !params.companyName.trim()) {
      toast.warning('Please enter the target Job Title and Company Name');
      return;
    }
    if (status === 'unauthenticated') {
      toast.error('Please sign in to generate cover letters');
      return;
    }

    setLoading(true);
    setVariants([]);
    setStreamingText('');

    try {
      const token = localStorage.getItem('drouvana_cached_token');
      const response = await fetch(`${getAPIBase()}/api/ai/generate-cover-letter/direct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (!data) continue;

          try {
            const event = JSON.parse(data);
            if (event.type === 'delta') {
              fullContent += event.content || '';
              setStreamingText(fullContent.slice(-120));
            } else if (event.type === 'complete') {
              const rawJson = event.fullContent || fullContent;
              const jsonMatch = rawJson.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (parsed.variants && Array.isArray(parsed.variants)) {
                  setVariants(parsed.variants);
                  setActiveVariant(0);
                  toast.success('Generated 3 tailored cover letter variants');
                }
              }
            } else if (event.type === 'error') {
              throw new Error(event.message);
            }
          } catch (_) {
            // partial delta
          }
        }
      }

      // Final parse attempt
      if (!variants.length && fullContent) {
        try {
          const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.variants) {
              setVariants(parsed.variants);
              setActiveVariant(0);
              toast.success('Generated 3 tailored cover letter variants');
            }
          }
        } catch (_) { /* silent */ }
      }
    } catch (err: any) {
      toast.error(err.message || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
      setStreamingText('');
    }
  };

  const copyVariant = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('Cover letter copied to clipboard');
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const highlightKeywords = (text: string) => {
    if (!params.jobTitle && !params.companyName) return text;
    const base = [params.companyName, params.jobTitle].filter(Boolean);
    let highlighted = text;
    base.forEach(kw => {
      if (kw.length < 3) return;
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      highlighted = highlighted.replace(regex, `<mark class="bg-primary/20 text-primary rounded px-0.5">$&</mark>`);
    });
    return highlighted;
  };

  const saveVariant = async (variant: CoverLetterVariant, index: number) => {
    setIsSaving(true);
    try {
      await api.post('/api/documents/cover-letter', {
        content: variant.content,
        variant: variant.type,
        tone: params.tone,
        wordCount: variant.word_count,
        keywordScore: variant.keyword_score,
      });
      setSavedVariants(prev => new Set(prev).add(index));
      toast.success('Cover letter saved to your documents');
    } catch {
      toast.error('Failed to save cover letter');
    } finally {
      setIsSaving(false);
    }
  };

  const currentVariant = variants[activeVariant];

  return (
    <div className="flex flex-col h-full gap-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center text-xs text-text-muted gap-2 font-jetbrains uppercase tracking-widest mb-2">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Workspace</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-bold">Cover Letter Studio</span>
          </div>
          <h1 className="text-3xl font-bold font-hanken">Cover Letter Studio</h1>
          <p className="text-text-sub text-sm">Generate 3 tailored cover letter variants powered by your resume profile and job requirements.</p>
        </div>
        {variants.length > 0 && (
          <Button
            onClick={() => { setVariants([]); }}
            variant="outline"
            className="rounded-xl gap-2 border-[var(--color-border-subtle)] text-xs h-9"
          >
            <RefreshCw className="w-3.5 h-3.5" /> New Generation
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Form */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <Card className="bg-surface/50 border-[var(--color-border-subtle)] rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold font-hanken text-primary">Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains mb-1.5 block">Job Title *</Label>
                <Input
                  value={params.jobTitle}
                  onChange={e => setParams({ ...params, jobTitle: e.target.value })}
                  placeholder="e.g. Senior Backend Engineer"
                  className="bg-surface border-[var(--color-border-subtle)] rounded-xl text-xs h-10"
                />
              </div>

              <div>
                <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains mb-1.5 block">Company *</Label>
                <Input
                  value={params.companyName}
                  onChange={e => setParams({ ...params, companyName: e.target.value })}
                  placeholder="e.g. Stripe"
                  className="bg-surface border-[var(--color-border-subtle)] rounded-xl text-xs h-10"
                />
              </div>

              <div>
                <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains mb-1.5 block">Hiring Manager (optional)</Label>
                <Input
                  value={params.hiringManager}
                  onChange={e => setParams({ ...params, hiringManager: e.target.value })}
                  placeholder="e.g. Sarah Chen"
                  className="bg-surface border-[var(--color-border-subtle)] rounded-xl text-xs h-10"
                />
              </div>

              <div>
                <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains mb-1.5 block">Tone</Label>
                <div className="grid grid-cols-2 gap-1.5">
                  {TONE_OPTIONS.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setParams({ ...params, tone: t.id })}
                      className={`py-1.5 rounded-lg text-[11px] font-bold capitalize border transition-all ${params.tone === t.id ? 'bg-primary/20 border-primary text-primary' : 'bg-surface border-[var(--color-border-subtle)] text-text-muted hover:border-[var(--color-border-strong)]'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface/50 border-[var(--color-border-subtle)] rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold font-hanken text-primary">Job Description</CardTitle>
              <p className="text-xs text-text-muted">Optional but improves tailoring significantly.</p>
            </CardHeader>
            <CardContent>
              <textarea
                value={params.jobDescription}
                onChange={e => setParams({ ...params, jobDescription: e.target.value })}
                rows={4}
                placeholder="Paste the job description here..."
                className="w-full bg-surface border border-[var(--color-border-subtle)] rounded-xl p-3 text-xs text-text-sub focus:outline-none focus:border-primary/50 resize-none font-sans"
              />
            </CardContent>
          </Card>

          <Card className="bg-surface/50 border-[var(--color-border-subtle)] rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold font-hanken text-primary">Custom Instructions</CardTitle>
              <p className="text-xs text-text-muted">Any specific points to emphasize.</p>
            </CardHeader>
            <CardContent>
              <textarea
                value={params.customInstructions}
                onChange={e => setParams({ ...params, customInstructions: e.target.value })}
                rows={3}
                placeholder="e.g. Emphasize my experience with distributed systems and team leadership..."
                className="w-full bg-surface border border-[var(--color-border-subtle)] rounded-xl p-3 text-xs text-text-sub focus:outline-none focus:border-primary/50 resize-none font-sans"
              />
            </CardContent>
          </Card>

          <Button
            onClick={generateCoverLetters}
            disabled={loading}
            className="w-full rounded-xl py-5 font-bold text-xs shadow-lg shadow-primary/20 border-none gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Generating...' : 'Generate 3 Variants'}
          </Button>

          <p className="text-[10px] text-text-muted text-center font-jetbrains">
            Your resume profile is automatically used as context.{' '}
            <Link href="/dashboard/resume" className="text-primary hover:underline">Update profile →</Link>
          </p>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {loading && !variants.length ? (
            <Card className="bg-surface/30 border-[var(--color-border-subtle)] rounded-2xl h-[500px] flex flex-col items-center justify-center gap-5 p-8">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                <FileText className="absolute inset-0 m-auto w-6 h-6 text-primary" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-bold font-hanken animate-pulse">Crafting your cover letters...</p>
                <p className="text-xs text-text-muted">Tailoring 3 distinct variants to match the role</p>
              </div>
              {streamingText && (
                <div className="w-full max-w-sm bg-surface-2 rounded-xl p-3 border border-[var(--color-border-subtle)]">
                  <p className="text-[10px] text-text-muted font-jetbrains mb-1 uppercase">Writing</p>
                  <p className="text-xs text-text-sub font-mono leading-relaxed">{streamingText}</p>
                </div>
              )}
            </Card>
          ) : variants.length > 0 ? (
            <div className="flex flex-col gap-5">
              {/* Variant selector tabs */}
              <div className="flex gap-2 flex-wrap">
                {variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveVariant(i)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${activeVariant === i ? 'bg-primary/20 border-primary text-primary' : 'bg-surface border-[var(--color-border-subtle)] text-text-muted hover:border-[var(--color-border-strong)]'}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">{i + 1}</span>
                    {v.label || v.type || `Variant ${i + 1}`}
                  </button>
                ))}
              </div>

              {currentVariant && (
                <Card className="bg-surface/50 border-[var(--color-border-subtle)] rounded-2xl overflow-hidden">
                  {/* Header */}
                  <div className="bg-surface-2 px-5 py-3 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-text-main">{currentVariant.label || currentVariant.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {currentVariant.word_count > 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-text-muted font-jetbrains border border-[var(--color-border-subtle)]">
                            {currentVariant.word_count} words
                          </span>
                        )}
                        {currentVariant.keyword_score > 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-jetbrains border border-emerald-500/20">
                            {currentVariant.keyword_score}% keyword match
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        onClick={() => copyVariant(currentVariant.content, activeVariant)}
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs px-2.5 gap-1 rounded-lg"
                      >
                        {copiedIndex === activeVariant ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedIndex === activeVariant ? 'Copied' : 'Copy'}
                      </Button>
                      <Button
                        onClick={() => { toast.info('Preparing PDF...'); window.print(); }}
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs px-2.5 gap-1 rounded-lg"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </Button>
                      <Button
                        onClick={() => saveVariant(currentVariant, activeVariant)}
                        disabled={isSaving || savedVariants.has(activeVariant)}
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs px-2.5 gap-1 rounded-lg text-emerald-400 hover:text-emerald-300"
                      >
                        {savedVariants.has(activeVariant) ? <CheckCircle2 className="w-3.5 h-3.5" /> : isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                        {savedVariants.has(activeVariant) ? 'Saved' : 'Save'}
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div
                      className="text-xs text-text-sub leading-relaxed font-sans text-justify selection:bg-primary/20 whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: highlightKeywords(currentVariant.content) }}
                    />
                  </CardContent>
                </Card>
              )}

              {/* All variants quick nav */}
              <div className="grid grid-cols-3 gap-3">
                {variants.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveVariant(i)}
                    className={`p-3 rounded-xl border text-left transition-all ${activeVariant === i ? 'border-primary/50 bg-primary/5' : 'border-[var(--color-border-subtle)] bg-surface/30 hover:border-[var(--color-border-strong)]'}`}
                  >
                    <p className="text-[11px] font-bold text-text-main mb-1">{v.label || `Variant ${i + 1}`}</p>
                    <p className="text-[10px] text-text-muted line-clamp-2 leading-relaxed">{v.opening_line || v.content?.slice(0, 80)}...</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <Card className="bg-surface/20 border-[var(--color-border-subtle)] rounded-2xl h-[500px] flex flex-col items-center justify-center p-8 text-center">
              <Layers className="w-14 h-14 text-text-muted mb-5 opacity-30" />
              <h3 className="text-sm font-bold font-hanken text-text-sub mb-2">3 Variants Ready to Generate</h3>
              <p className="text-xs text-text-muted max-w-xs leading-relaxed">
                Fill in the job details on the left. Your resume profile is automatically used to personalize each variant.
              </p>
              <div className="mt-5 flex flex-col gap-2 text-[11px] text-text-muted">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[9px] font-bold">1</span>
                  ATS-Optimized — keyword-dense for Applicant Tracking Systems
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-[9px] font-bold">2</span>
                  Narrative — story-driven with strong opening hook
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-accent/20 text-accent flex items-center justify-center text-[9px] font-bold">3</span>
                  Results-First — achievement-led, quantified impact
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
