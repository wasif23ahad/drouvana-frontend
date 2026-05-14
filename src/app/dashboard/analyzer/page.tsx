'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart3, Sparkles, CheckCircle2, Loader2, ChevronRight,
  AlertTriangle, TrendingUp, Target, ArrowRight, XCircle,
  Zap, BookOpen, Award, RefreshCw, Upload, FileText,
  Layers, X, Copy, Check, UploadCloud, File, Eye, EyeOff, Building2
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useSession, getSession } from 'next-auth/react';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

interface ATSResult {
  ats_score: number;
  keyword_match_rate: number;
  missing_keywords: string[];
  present_keywords: string[];
  suggested_summary: string;
  suggested_bullet_rewrites: Array<{
    original: string;
    improved: string;
    reason: string;
    impact_score: number;
    applied?: boolean;
    copied?: boolean;
  }>;
  section_scores: {
    summary: number;
    experience: number;
    skills: number;
    education: number;
  };
  overall_suggestions: string[];
  strengths: string[];
  breakdown?: {
    keyword: number;
    sections: number;
    action_verbs: number;
    quantification: number;
    length: number;
    formatting: number;
    alignment: number;
  };
}

type ResumeSource = 'upload' | 'builder' | 'paste';

// ─── Score Gauge ─────────────────────────────────────────────────────────────
function ScoreGauge({ score }: { score: number }) {
  const safeScore = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
  const color = safeScore >= 85 ? '#10b981' : safeScore >= 70 ? '#22d3ee' : safeScore >= 55 ? '#f59e0b' : '#ef4444';
  const label = safeScore >= 85 ? 'Excellent' : safeScore >= 70 ? 'Strong' : safeScore >= 55 ? 'Good' : safeScore >= 40 ? 'Needs Work' : 'Low Match';
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12" />
          <circle
            cx="60" cy="60" r="50" fill="none"
            stroke={color} strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 50}`}
            strokeDashoffset={`${2 * Math.PI * 50 * (1 - safeScore / 100)}`}
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold font-hanken" style={{ color }}>{safeScore}</span>
          <span className="text-[10px] text-text-muted font-jetbrains">/100</span>
        </div>
      </div>
      <span className="text-xs font-bold font-jetbrains uppercase tracking-wider" style={{ color }}>{label}</span>
    </div>
  );
}

function SectionScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[11px]">
        <span className="text-text-sub capitalize">{label}</span>
        <span className="font-bold text-text-main">{score}%</span>
      </div>
      <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

// ─── File Drop Zone ───────────────────────────────────────────────────────────
function FileDropZone({ onTextExtracted }: { onTextExtracted: (text: string, filename: string) => void }) {
  const [dragging, setDragging] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [fileName, setFileName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const extractTextRef = useRef<((file: File) => Promise<void>) | null>(null);

  extractTextRef.current = async (file: File) => {
    setExtracting(true);
    setFileName(file.name);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase();

      if (ext === 'txt') {
        const text = await file.text();
        onTextExtracted(text, file.name);
        toast.success(`Loaded: ${file.name}`);
      } else if (ext === 'pdf') {
        const pdfjsLib = await import('pdfjs-dist');
        // Use locally served worker — avoids CDN version mismatch
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          fullText += content.items.map((item: any) => item.str).join(' ') + '\n';
        }
        const extracted = fullText.trim();
        if (!extracted) throw new Error('No text found — the PDF may be image-based. Try a text-based PDF or use DOCX/TXT.');
        onTextExtracted(extracted, file.name);
        toast.success(`PDF extracted: ${file.name}`);
      } else if (ext === 'docx') {
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        if (!result.value.trim()) throw new Error('Could not extract text from this DOCX file.');
        onTextExtracted(result.value, file.name);
        toast.success(`DOCX extracted: ${file.name}`);
      } else {
        toast.error('Unsupported file type. Please use PDF, DOCX, or TXT.');
        setFileName('');
        return;
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to extract text from file. Please try a different format.');
      setFileName('');
    } finally {
      setExtracting(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) extractTextRef.current?.(file);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) extractTextRef.current?.(file);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={cn(
        'relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all min-h-[200px] p-8 text-center',
        dragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-white/10 bg-surface/30 hover:border-primary/40 hover:bg-surface/50'
      )}
    >
      <input ref={inputRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={onFileChange} />

      {extracting ? (
        <>
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <div>
            <p className="text-sm font-bold text-text-main">Extracting text...</p>
            <p className="text-xs text-text-muted mt-1">{fileName}</p>
          </div>
        </>
      ) : fileName ? (
        <>
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <File className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-400 flex items-center gap-2 justify-center">
              <CheckCircle2 className="w-4 h-4" /> Loaded
            </p>
            <p className="text-xs text-text-muted mt-1 font-mono">{fileName}</p>
            <p className="text-[10px] text-text-muted mt-2">Click to replace</p>
          </div>
        </>
      ) : (
        <>
          <div className="w-14 h-14 rounded-2xl bg-surface-2 border border-white/10 flex items-center justify-center">
            <UploadCloud className="w-7 h-7 text-text-muted" />
          </div>
          <div>
            <p className="text-sm font-bold text-text-main">Drop your resume here</p>
            <p className="text-xs text-text-muted mt-1">or click to browse</p>
          </div>
          <div className="flex gap-2">
            {['PDF', 'DOCX', 'TXT'].map(fmt => (
              <span key={fmt} className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-surface-2 border border-white/10 text-text-muted">
                {fmt}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AtsAnalyzerPage() {
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [resumeSource, setResumeSource] = useState<ResumeSource>('upload');
  const [resumeText, setResumeText] = useState('');
  const [resumePreviewOpen, setResumePreviewOpen] = useState(false);
  const [builderLoading, setBuilderLoading] = useState(false);
  const [builderLoaded, setBuilderLoaded] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [result, setResult] = useState<ATSResult | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const getAPIBase = () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  const loadBuilderResume = async () => {
    setBuilderLoading(true);
    try {
      const res = await api.get('/api/resume/master');
      const d = res.data?.data;
      if (!d) { toast.error('No saved resume found. Build one in the Resume Builder first.'); return; }

      const parts: string[] = [];
      if (d.personalInfo?.name) parts.push(d.personalInfo.name);
      if (d.personalInfo?.email) parts.push(d.personalInfo.email);
      if (d.personalInfo?.phone) parts.push(d.personalInfo.phone);
      if (d.summary) parts.push(`\nSUMMARY\n${d.summary}`);
      if (d.experience?.length) {
        parts.push('\nEXPERIENCE');
        d.experience.forEach((e: any) => parts.push(`${e.role} at ${e.company} (${e.startDate || ''}–${e.endDate || 'Present'})\n${e.description || ''}`));
      }
      if (d.education?.length) {
        parts.push('\nEDUCATION');
        d.education.forEach((e: any) => parts.push(`${e.degree} — ${e.institution} (${e.endDate || ''})`));
      }
      if (d.skills?.length) {
        parts.push('\nSKILLS');
        d.skills.forEach((s: any) => parts.push(`${s.category}: ${s.items}`));
      }
      if (d.projects?.length) {
        parts.push('\nPROJECTS');
        d.projects.forEach((p: any) => parts.push(`${p.name}: ${p.description || ''}`));
      }
      if (d.certifications?.length) {
        parts.push('\nCERTIFICATIONS');
        d.certifications.forEach((c: any) => parts.push(`${c.name} — ${c.issuer || ''}`));
      }

      setResumeText(parts.join('\n'));
      setBuilderLoaded(true);
      toast.success('Resume loaded from your Builder profile');
    } catch {
      toast.error('Could not load resume. Make sure you have saved your builder resume.');
    } finally {
      setBuilderLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast.warning(resumeSource === 'upload' ? 'Please upload a resume file first' : resumeSource === 'builder' ? 'Please load your builder resume first' : 'Please paste your resume content');
      return;
    }
    if (!jobDescription.trim()) {
      toast.warning('Please paste the job description');
      return;
    }
    if (status === 'unauthenticated') {
      toast.error('Please sign in to use ATS Analyzer');
      return;
    }

    setLoading(true);
    setResult(null);
    setStreamingText('');
    abortRef.current = new AbortController();

    try {
      // Ensure we have a fresh token — mirrors the api.ts interceptor
      let token = localStorage.getItem('drouvana_cached_token');
      try {
        const session = await getSession();
        const sessionToken = (session?.user as any)?.accessToken || (session as any)?.accessToken;
        if (sessionToken) {
          token = sessionToken;
          localStorage.setItem('drouvana_cached_token', sessionToken);
        }
      } catch (_) { /* fall back to cached token */ }

      if (!token) {
        toast.error('Session expired — please sign in again.');
        setLoading(false);
        return;
      }

      const doFetch = (t: string) => fetch(`${getAPIBase()}/api/ai/analyze-resume/direct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
        body: JSON.stringify({ resumeContent: resumeText, jobDescription, jobTitle: jobTitle || undefined, companyName: companyName || undefined }),
        signal: abortRef.current!.signal,
      });

      let response = await doFetch(token);

      // If token was stale (cached), clear it and force a fresh session fetch then retry once
      if (response.status === 401) {
        localStorage.removeItem('drouvana_cached_token');
        const freshSession = await getSession();
        const freshToken = (freshSession?.user as any)?.accessToken || (freshSession as any)?.accessToken;
        if (!freshToken) {
          toast.error('Session expired — please sign in again.');
          setLoading(false);
          return;
        }
        localStorage.setItem('drouvana_cached_token', freshToken);
        response = await doFetch(freshToken);
      }

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';
      let parsed: ATSResult | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;
          try {
            const event = JSON.parse(raw);
            if (event.type === 'progress') {
              setStreamingText(event.message || '');
            } else if (event.type === 'delta') {
              fullContent += event.content || '';
              setStreamingText(fullContent.slice(-120));
            } else if (event.type === 'complete') {
              if (event.result) {
                // New path: backend already parsed the JSON
                parsed = event.result;
                setResult(parsed);
                toast.success('Analysis complete!');
              } else {
                // Legacy path: result is raw text that needs JSON extraction
                const src = event.fullContent || fullContent;
                const m = src.match(/\{[\s\S]*\}/);
                if (m) { parsed = JSON.parse(m[0]); setResult(parsed); toast.success('Analysis complete!'); }
              }
            } else if (event.type === 'error') {
              throw new Error(event.message || 'Analysis failed');
            }
          } catch (parseErr: any) {
            if (parseErr.name !== 'SyntaxError') throw parseErr; // re-throw non-parse errors
          }
        }
      }

      if (!parsed) {
        toast.error('Analysis returned no result. Please try again.');
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') toast.error(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
      setStreamingText('');
    }
  };

  const handleCopyRewrite = (idx: number, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setResult(prev => {
        if (!prev) return prev;
        const rewrites = [...prev.suggested_bullet_rewrites];
        rewrites[idx] = { ...rewrites[idx], copied: true };
        return { ...prev, suggested_bullet_rewrites: rewrites };
      });
      toast.success('Copied to clipboard');
      setTimeout(() => {
        setResult(prev => {
          if (!prev) return prev;
          const rewrites = [...prev.suggested_bullet_rewrites];
          rewrites[idx] = { ...rewrites[idx], copied: false };
          return { ...prev, suggested_bullet_rewrites: rewrites };
        });
      }, 2000);
    });
  };

  const handleApplyRewrite = async (idx: number) => {
    if (!result) return;
    const item = result.suggested_bullet_rewrites[idx];

    // Replace in local resumeText view
    const updated = resumeText.replace(item.original, item.improved);
    if (updated !== resumeText) setResumeText(updated);

    // Mark applied
    const rewrites = [...result.suggested_bullet_rewrites];
    rewrites[idx] = { ...rewrites[idx], applied: true };
    setResult({ ...result, suggested_bullet_rewrites: rewrites });
    toast.success('Rewrite applied to your resume draft');
  };

  const SOURCE_TABS: { id: ResumeSource; label: string; icon: React.ElementType }[] = [
    { id: 'upload', label: 'Upload File', icon: Upload },
    { id: 'builder', label: 'Builder Resume', icon: Layers },
    { id: 'paste', label: 'Paste Text', icon: FileText },
  ];

  return (
    <div className="flex flex-col gap-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center text-xs text-text-muted gap-2 font-jetbrains uppercase tracking-widest mb-2">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Workspace</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-bold">ATS Analyzer</span>
          </div>
          <h1 className="text-3xl font-bold font-hanken">ATS Analyzer</h1>
          <p className="text-text-sub text-sm">Score your resume against a job description and get AI-powered improvement suggestions.</p>
        </div>
        {result && (
          <Button
            onClick={() => { setResult(null); setResumeText(''); setJobDescription(''); setJobTitle(''); setCompanyName(''); setBuilderLoaded(false); setResumePreviewOpen(false); }}
            variant="outline"
            className="rounded-xl gap-2 border-white/10 text-xs h-9"
          >
            <RefreshCw className="w-3.5 h-3.5" /> New Analysis
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.1fr] gap-8 items-start">
        {/* ── LEFT: Inputs ── */}
        <div className="flex flex-col gap-5">

          {/* Resume Source */}
          <Card className="bg-surface/50 border-white/5 rounded-2xl overflow-hidden">
            <CardHeader className="pb-0 pt-5 px-5">
              <CardTitle className="text-sm font-bold font-hanken text-text-main flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" /> Resume Source
              </CardTitle>
              <p className="text-xs text-text-muted mt-1">Choose where to pull your resume from.</p>
            </CardHeader>

            {/* Source tabs */}
            <div className="flex gap-1 mx-5 mt-4 bg-surface-2 rounded-xl p-1">
              {SOURCE_TABS.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setResumeSource(tab.id); setBuilderLoaded(false); if (tab.id !== 'paste') setResumeText(''); }}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all',
                      resumeSource === tab.id
                        ? 'bg-surface text-primary shadow-sm border border-white/10'
                        : 'text-text-muted hover:text-text-sub'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <CardContent className="px-5 pb-5 pt-4">
              {/* Upload mode */}
              {resumeSource === 'upload' && (
                <div className="space-y-3">
                  <FileDropZone onTextExtracted={(text, _name) => { setResumeText(text); setResumePreviewOpen(false); }} />
                  {resumeText && (
                    <>
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="text-xs text-emerald-400 font-semibold">{resumeText.split(/\s+/).filter(Boolean).length} words extracted</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setResumePreviewOpen(p => !p)}
                            className="p-1.5 text-text-muted hover:text-primary rounded-lg transition-colors"
                            title={resumePreviewOpen ? 'Hide preview' : 'Preview text'}
                          >
                            {resumePreviewOpen ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button onClick={() => { setResumeText(''); setResumePreviewOpen(false); }} className="p-1.5 text-text-muted hover:text-red-400 rounded-lg transition-colors">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      {resumePreviewOpen && (
                        <div className="rounded-xl bg-surface border border-white/8 p-3 max-h-48 overflow-y-auto">
                          <p className="text-[10px] text-text-muted font-jetbrains uppercase tracking-wider mb-2">Extracted Content Preview</p>
                          <pre className="text-[11px] text-text-sub font-mono whitespace-pre-wrap leading-relaxed">{resumeText.slice(0, 1200)}{resumeText.length > 1200 ? '\n…' : ''}</pre>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Builder mode */}
              {resumeSource === 'builder' && (
                <div className="space-y-4">
                  {builderLoaded ? (
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-emerald-400">Builder resume loaded</p>
                        <p className="text-xs text-text-muted mt-0.5">{resumeText.split(/\s+/).filter(Boolean).length} words from your saved profile</p>
                      </div>
                      <button onClick={() => { setBuilderLoaded(false); setResumeText(''); }} className="p-1 text-text-muted hover:text-error rounded transition-colors shrink-0">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 py-8 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Layers className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text-main">Use your Builder Resume</p>
                        <p className="text-xs text-text-muted mt-1 max-w-xs">Load the resume you've built in the Resume Builder. Make sure it's saved to your profile first.</p>
                      </div>
                      <Button onClick={loadBuilderResume} disabled={builderLoading} className="gap-2 rounded-xl">
                        {builderLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
                        {builderLoading ? 'Loading...' : 'Load Builder Resume'}
                      </Button>
                      <Link href="/dashboard/builder" className="text-xs text-primary hover:underline font-jetbrains">
                        Go to Resume Builder →
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Paste mode */}
              {resumeSource === 'paste' && (
                <div className="space-y-2">
                  <textarea
                    value={resumeText}
                    onChange={e => setResumeText(e.target.value)}
                    rows={9}
                    placeholder="Paste your resume content here — summary, experience, skills, education..."
                    className="w-full bg-surface border border-white/10 rounded-xl p-3 text-xs text-text-sub focus:outline-none focus:border-primary/50 resize-none font-sans leading-relaxed"
                  />
                  <span className="text-[10px] text-text-muted font-jetbrains">{resumeText.split(/\s+/).filter(Boolean).length} words</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card className="bg-surface/50 border-white/5 rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold font-hanken text-text-main flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Target Job
              </CardTitle>
              <p className="text-xs text-text-muted">Add the role details and paste the full job listing.</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-text-muted font-jetbrains uppercase tracking-wider block mb-1.5">Job Title</label>
                  <input
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full h-9 bg-surface border border-white/10 rounded-xl px-3 text-xs text-text-sub focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-text-muted font-jetbrains uppercase tracking-wider flex items-center gap-1 mb-1.5">
                    <Building2 className="w-3 h-3" /> Company
                  </label>
                  <input
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Corp"
                    className="w-full h-9 bg-surface border border-white/10 rounded-xl px-3 text-xs text-text-sub focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
              <textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                rows={9}
                placeholder="Paste the full job description — requirements, responsibilities, qualifications, tech stack..."
                className="w-full bg-surface border border-white/10 rounded-xl p-3 text-xs text-text-sub focus:outline-none focus:border-primary/50 resize-none font-sans leading-relaxed"
              />
              <span className="text-[10px] text-text-muted font-jetbrains">{jobDescription.split(/\s+/).filter(Boolean).length} words</span>
            </CardContent>
          </Card>

          <Button
            onClick={handleAnalyze}
            disabled={loading || !resumeText.trim() || !jobDescription.trim()}
            className="w-full rounded-xl py-6 font-bold text-sm shadow-xl shadow-primary/20 border border-primary/20 gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? 'Running ATS Analysis…' : 'Analyze ATS Compatibility'}
          </Button>
          {!resumeText.trim() && (
            <p className="text-center text-[10px] text-text-muted font-jetbrains">
              {resumeSource === 'upload' ? '↑ Upload a resume file to enable analysis' : resumeSource === 'builder' ? '↑ Load your builder resume to enable analysis' : '↑ Paste your resume content to enable analysis'}
            </p>
          )}
        </div>

        {/* ── RIGHT: Results ── */}
        <div className="flex flex-col gap-5">
          {loading && !result ? (
            <Card className="bg-surface/30 border-white/5 rounded-2xl min-h-[500px] flex flex-col items-center justify-center gap-6 p-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm font-bold font-hanken text-text-main">
                  {streamingText || 'Analyzing your resume…'}
                </p>
                <p className="text-xs text-text-muted font-jetbrains">Matching keywords · Scoring sections · Generating rewrites</p>
              </div>
            </Card>
          ) : result ? (
            <>
              {/* Score Card */}
              <Card className="bg-surface/50 border-white/5 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-8">
                    <ScoreGauge score={result.ats_score} />
                    <div className="flex-1 w-full space-y-3.5">
                      <p className="text-[10px] text-text-muted font-jetbrains uppercase tracking-wider">Section Scores</p>
                      {Object.entries(result.section_scores || {}).map(([k, v]) => (
                        <SectionScoreBar key={k} label={k} score={v} />
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 pt-5 border-t border-white/5 grid grid-cols-3 gap-3">
                    <div className="bg-surface-2 rounded-xl p-3 text-center">
                      <p className="text-[10px] text-text-muted mb-1 font-jetbrains">Keyword Match</p>
                      <p className="text-xl font-bold text-primary">{Math.round((result.keyword_match_rate || 0) * 100)}%</p>
                    </div>
                    <div className="bg-surface-2 rounded-xl p-3 text-center">
                      <p className="text-[10px] text-text-muted mb-1 font-jetbrains">Present</p>
                      <p className="text-xl font-bold text-emerald-400">{result.present_keywords?.length || 0}</p>
                    </div>
                    <div className="bg-surface-2 rounded-xl p-3 text-center">
                      <p className="text-[10px] text-text-muted mb-1 font-jetbrains">Missing</p>
                      <p className="text-xl font-bold text-amber-400">{result.missing_keywords?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Score Breakdown */}
              {result.breakdown && (
                <Card className="bg-surface/50 border-white/5 rounded-2xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold font-hanken flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-primary" /> Score Breakdown
                    </CardTitle>
                    <p className="text-xs text-text-muted">How each scoring dimension contributes to your overall ATS rating.</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: 'keyword', label: 'Keyword Coverage', weight: 40, value: result.breakdown.keyword },
                        { key: 'sections', label: 'Section Completeness', weight: 15, value: result.breakdown.sections },
                        { key: 'action_verbs', label: 'Action Verbs', weight: 10, value: result.breakdown.action_verbs },
                        { key: 'quantification', label: 'Quantified Impact', weight: 10, value: result.breakdown.quantification },
                        { key: 'length', label: 'Length & Density', weight: 10, value: result.breakdown.length },
                        { key: 'formatting', label: 'ATS Formatting', weight: 10, value: result.breakdown.formatting },
                        { key: 'alignment', label: 'Role Alignment', weight: 5, value: result.breakdown.alignment },
                      ].map(item => {
                        const v = Math.max(0, Math.min(100, Math.round(item.value || 0)));
                        const c = v >= 80 ? 'bg-emerald-500' : v >= 60 ? 'bg-cyan-500' : v >= 40 ? 'bg-amber-500' : 'bg-red-500';
                        return (
                          <div key={item.key} className="bg-surface-2 rounded-xl p-3 space-y-1.5">
                            <div className="flex justify-between items-baseline">
                              <span className="text-[10px] text-text-sub">{item.label}</span>
                              <span className="text-[9px] text-text-muted font-jetbrains">{item.weight} pts</span>
                            </div>
                            <div className="flex justify-between items-baseline">
                              <div className="h-1.5 flex-1 bg-surface rounded-full overflow-hidden mr-2">
                                <div className={`h-full ${c} rounded-full transition-all duration-700`} style={{ width: `${v}%` }} />
                              </div>
                              <span className="text-xs font-bold text-text-main">{v}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Strengths */}
              {result.strengths?.length > 0 && (
                <Card className="bg-surface/50 border-white/5 rounded-2xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold font-hanken flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-400" /> Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2.5">
                    {result.strengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-text-sub leading-relaxed">{s}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Missing Keywords */}
              {result.missing_keywords?.length > 0 && (
                <Card className="bg-surface/50 border-white/5 rounded-2xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold font-hanken flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" /> Missing Keywords
                    </CardTitle>
                    <p className="text-xs text-text-muted">Add these to your resume to improve the match rate.</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.missing_keywords.map((kw, i) => (
                        <button
                          key={i}
                          onClick={() => { navigator.clipboard.writeText(kw); toast.success(`Copied: ${kw}`); }}
                          className="text-xs px-3 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono hover:bg-amber-500/20 transition-colors"
                          title="Click to copy"
                        >
                          {kw}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AI Suggested Summary */}
              {result.suggested_summary && (
                <Card className="bg-surface/50 border-white/5 rounded-2xl">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-bold font-hanken flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" /> Suggested Summary
                      </CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs gap-1.5 text-primary"
                        onClick={() => { navigator.clipboard.writeText(result.suggested_summary); toast.success('Summary copied'); }}
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </Button>
                    </div>
                    <p className="text-xs text-text-muted">AI-rewritten summary optimized for this role.</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-text-sub leading-relaxed bg-surface-2 p-4 rounded-xl border border-white/5 italic">
                      {result.suggested_summary}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Bullet Rewrites */}
              {result.suggested_bullet_rewrites?.length > 0 && (
                <Card className="bg-surface/50 border-white/5 rounded-2xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold font-hanken flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" /> AI Bullet Rewrites
                    </CardTitle>
                    <p className="text-xs text-text-muted">AI-suggested improvements — copy or apply each one.</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.suggested_bullet_rewrites.map((item, idx) => (
                      <div key={idx} className={cn(
                        'p-4 rounded-xl border space-y-3 transition-all',
                        item.applied ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-surface-2 border-white/5'
                      )}>
                        {/* Impact badge */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                            Impact: {item.impact_score}/10
                          </span>
                          {item.applied && (
                            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Applied
                            </span>
                          )}
                        </div>

                        {/* Original */}
                        <div className="flex items-start gap-2">
                          <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] text-text-muted font-jetbrains uppercase mb-1">Original</p>
                            <p className="text-xs text-text-muted line-through leading-relaxed">{item.original}</p>
                          </div>
                        </div>

                        {/* Improved */}
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] text-emerald-400 font-jetbrains uppercase mb-1">AI Suggestion</p>
                            <p className="text-xs text-text-main font-medium leading-relaxed">{item.improved}</p>
                          </div>
                        </div>

                        {/* Reason */}
                        {item.reason && (
                          <p className="text-[10px] text-text-muted italic border-l-2 border-white/10 pl-3 leading-relaxed">{item.reason}</p>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs rounded-lg gap-1.5 border-white/10 flex-1"
                            onClick={() => handleCopyRewrite(idx, item.improved)}
                          >
                            {item.copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            {item.copied ? 'Copied!' : 'Copy'}
                          </Button>
                          <Button
                            size="sm"
                            variant={item.applied ? 'ghost' : 'default'}
                            disabled={item.applied}
                            className="h-7 text-xs rounded-lg gap-1.5 flex-1"
                            onClick={() => handleApplyRewrite(idx)}
                          >
                            {item.applied ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <ArrowRight className="w-3 h-3" />}
                            {item.applied ? 'Applied' : 'Apply to Draft'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Improvement Tips */}
              {result.overall_suggestions?.length > 0 && (
                <Card className="bg-surface/50 border-white/5 rounded-2xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold font-hanken flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-secondary" /> Improvement Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2.5">
                    {result.overall_suggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface-2 border border-white/5">
                        <span className="text-[10px] font-bold text-primary font-jetbrains w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                        <p className="text-xs text-text-sub leading-relaxed">{s}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="bg-surface/20 border-white/5 rounded-2xl min-h-[500px] flex flex-col items-center justify-center p-10 text-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-surface-2 border border-white/5 flex items-center justify-center">
                <BarChart3 className="w-10 h-10 text-text-muted opacity-40" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-text-sub font-hanken">Ready to Analyze</h3>
                <p className="text-xs text-text-muted max-w-xs leading-relaxed">
                  Upload a resume or load your Builder profile, add the job description, then click Analyze to get your ATS score, missing keywords, and AI bullet rewrites.
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full max-w-xs">
                {[
                  { icon: Upload, text: 'Upload PDF, DOCX, or TXT' },
                  { icon: Layers, text: 'Load from Resume Builder' },
                  { icon: Sparkles, text: 'Get AI-powered rewrites' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-xs text-text-muted">
                    <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    {text}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
