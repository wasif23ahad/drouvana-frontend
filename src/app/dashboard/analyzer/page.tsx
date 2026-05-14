'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BarChart3, Sparkles, CheckCircle2, Loader2, ChevronRight,
  AlertTriangle, TrendingUp, Target, ArrowRight, XCircle,
  Zap, BookOpen, Award, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';

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
  }>;
  section_scores: {
    summary: number;
    experience: number;
    skills: number;
    education: number;
  };
  overall_suggestions: string[];
  strengths: string[];
}

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work';
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="12" />
          <circle
            cx="60" cy="60" r="50" fill="none"
            stroke={color} strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 50}`}
            strokeDashoffset={`${2 * Math.PI * 50 * (1 - score / 100)}`}
            style={{ transition: 'stroke-dashoffset 1.2s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold font-hanken" style={{ color }}>{score}</span>
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
    <div className="space-y-1">
      <div className="flex justify-between text-[11px]">
        <span className="text-text-sub capitalize">{label}</span>
        <span className="font-bold text-text-main">{score}%</span>
      </div>
      <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-1000`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function AtsAnalyzerPage() {
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<ATSResult | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const getAPIBase = () => {
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      const configured = process.env.NEXT_PUBLIC_API_URL || '';
      if (!configured || configured.includes('localhost')) return 'https://douvana-backend.vercel.app';
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      toast.warning('Please provide both your resume content and target job description');
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
      const token = localStorage.getItem('drouvana_cached_token');
      const response = await fetch(`${getAPIBase()}/api/ai/analyze-resume/direct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ resumeContent: resumeText, jobDescription }),
        signal: abortRef.current.signal,
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
              setStreamingText(fullContent);
            } else if (event.type === 'complete') {
              const rawJson = event.fullContent || fullContent;
              const jsonMatch = rawJson.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const parsed: ATSResult = JSON.parse(jsonMatch[0]);
                setResult(parsed);
                toast.success('ATS analysis complete!');
              }
            } else if (event.type === 'error') {
              throw new Error(event.message);
            }
          } catch (e) {
            // partial JSON delta — continue accumulating
          }
        }
      }

      // Final parse attempt if complete event never fired
      if (!result && fullContent) {
        try {
          const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed: ATSResult = JSON.parse(jsonMatch[0]);
            setResult(parsed);
            toast.success('ATS analysis complete!');
          }
        } catch (_) { /* silent */ }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        toast.error(err.message || 'Analysis failed. Please try again.');
      }
    } finally {
      setLoading(false);
      setStreamingText('');
    }
  };

  const handleApplyRewrite = async (index: number) => {
    if (!result) return;
    const updated = [...result.suggested_bullet_rewrites];
    updated[index] = { ...updated[index], applied: true };
    setResult({ ...result, suggested_bullet_rewrites: updated });
    toast.success('Rewrite marked — update your resume profile to apply it');
  };

  return (
    <div className="flex flex-col h-full gap-8 pb-20">
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
            onClick={() => { setResult(null); setResumeText(''); setJobDescription(''); }}
            variant="outline"
            className="rounded-xl gap-2 border-white/10 text-xs h-9"
          >
            <RefreshCw className="w-3.5 h-3.5" /> New Analysis
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="flex flex-col gap-5">
          <Card className="bg-surface/50 border-white/5 rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold font-hanken text-primary flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Your Resume Content
              </CardTitle>
              <p className="text-xs text-text-muted">Paste your full resume text or just the relevant sections.</p>
            </CardHeader>
            <CardContent>
              <textarea
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                rows={8}
                placeholder="Paste your resume content here — summary, experience, skills, education..."
                className="w-full bg-surface border border-white/10 rounded-xl p-3 text-xs text-text-sub focus:outline-none focus:border-primary/50 resize-none font-sans leading-relaxed"
              />
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-text-muted font-jetbrains">{resumeText.split(/\s+/).filter(Boolean).length} words</span>
                <button
                  className="text-[10px] text-primary hover:underline font-jetbrains"
                  onClick={async () => {
                    try {
                      const res = await api.get('/api/resume/master');
                      if (res.data?.data) {
                        const d = res.data.data;
                        const parts = [
                          d.personalInfo?.name, d.personalInfo?.email,
                          d.summary,
                          ...(d.experience || []).map((e: any) => `${e.role} at ${e.company}\n${e.description}`),
                          d.skills ? `Skills: ${d.skills}` : '',
                          ...(d.education || []).map((e: any) => `${e.degree} — ${e.institution}`),
                        ].filter(Boolean);
                        setResumeText(parts.join('\n\n'));
                        toast.success('Resume loaded from your profile');
                      }
                    } catch { toast.error('Could not load resume'); }
                  }}
                >
                  Load from my profile →
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-surface/50 border-white/5 rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold font-hanken text-primary flex items-center gap-2">
                <Target className="w-4 h-4" /> Target Job Description
              </CardTitle>
              <p className="text-xs text-text-muted">Paste the full job listing text to extract missing keyword signals.</p>
            </CardHeader>
            <CardContent>
              <textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                rows={8}
                placeholder="Paste the job description including requirements, responsibilities, and qualifications..."
                className="w-full bg-surface border border-white/10 rounded-xl p-3 text-xs text-text-sub focus:outline-none focus:border-primary/50 resize-none font-sans leading-relaxed"
              />
              <span className="text-[10px] text-text-muted font-jetbrains mt-1.5 block">{jobDescription.split(/\s+/).filter(Boolean).length} words</span>
            </CardContent>
          </Card>

          <Button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full rounded-xl py-6 font-bold text-sm shadow-xl shadow-primary/10 border-none gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? 'Analyzing...' : 'Analyze ATS Compatibility'}
          </Button>
        </div>

        {/* Results */}
        <div>
          {loading && !result ? (
            <Card className="bg-surface/30 border-white/5 rounded-2xl h-full min-h-[500px] flex flex-col items-center justify-center gap-6 p-8">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm font-bold font-hanken text-text-main animate-pulse">Analyzing your resume...</p>
                <p className="text-xs text-text-muted font-jetbrains">Comparing keywords, scoring sections, generating suggestions</p>
              </div>
              {streamingText && (
                <div className="w-full max-w-sm bg-surface-2 rounded-xl p-3 border border-white/5">
                  <p className="text-[10px] text-text-muted font-jetbrains mb-1 uppercase tracking-wider">AI Processing</p>
                  <p className="text-xs text-text-sub font-mono truncate">{streamingText.slice(-80)}</p>
                </div>
              )}
            </Card>
          ) : result ? (
            <div className="flex flex-col gap-5">
              {/* Score + section breakdown */}
              <Card className="bg-surface/50 border-white/5 rounded-2xl overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <ScoreGauge score={result.ats_score} />
                    <div className="flex-1 w-full space-y-3">
                      <p className="text-xs text-text-muted font-jetbrains uppercase tracking-wider mb-4">Section Breakdown</p>
                      {Object.entries(result.section_scores || {}).map(([k, v]) => (
                        <SectionScoreBar key={k} label={k} score={v} />
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-3">
                    <div className="bg-surface-2 rounded-xl p-3 text-center">
                      <p className="text-xs text-text-muted mb-1">Keyword Match</p>
                      <p className="text-xl font-bold text-primary">{Math.round((result.keyword_match_rate || 0) * 100)}%</p>
                    </div>
                    <div className="bg-surface-2 rounded-xl p-3 text-center">
                      <p className="text-xs text-text-muted mb-1">Present Keywords</p>
                      <p className="text-xl font-bold text-emerald-400">{result.present_keywords?.length || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Strengths */}
              {result.strengths?.length > 0 && (
                <Card className="bg-surface/50 border-white/5 rounded-2xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold font-hanken flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-400" /> Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {result.strengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-text-sub">{s}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Missing keywords */}
              {result.missing_keywords?.length > 0 && (
                <Card className="bg-surface/50 border-white/5 rounded-2xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold font-hanken flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" /> Missing Keywords
                    </CardTitle>
                    <p className="text-xs text-text-muted">Add these to your resume to improve your score.</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.missing_keywords.map((kw, i) => (
                        <span key={i} className="text-xs px-3 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Bullet rewrites */}
              {result.suggested_bullet_rewrites?.length > 0 && (
                <Card className="bg-surface/50 border-white/5 rounded-2xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold font-hanken flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" /> Bullet Rewrites
                    </CardTitle>
                    <p className="text-xs text-text-muted">AI-suggested improvements for your experience bullets.</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {result.suggested_bullet_rewrites.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-surface-2 border border-white/5 space-y-3">
                        <div className="flex items-start gap-2">
                          <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] text-text-muted font-jetbrains uppercase mb-1">Original</p>
                            <p className="text-xs text-text-muted line-through">{item.original}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] text-primary font-jetbrains uppercase mb-1">Improved (Impact: {item.impact_score}/10)</p>
                            <p className="text-xs text-text-main font-medium leading-relaxed">{item.improved}</p>
                          </div>
                        </div>
                        {item.reason && (
                          <p className="text-[10px] text-text-muted italic pl-6">{item.reason}</p>
                        )}
                        <div className="flex justify-end pt-1">
                          <Button
                            onClick={() => handleApplyRewrite(idx)}
                            size="sm"
                            variant={item.applied ? 'ghost' : 'default'}
                            disabled={item.applied}
                            className="h-7 text-xs rounded-lg gap-1.5"
                          >
                            {item.applied ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <ArrowRight className="w-3 h-3" />}
                            {item.applied ? 'Noted' : 'Apply Rewrite'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Overall suggestions */}
              {result.overall_suggestions?.length > 0 && (
                <Card className="bg-surface/50 border-white/5 rounded-2xl">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-bold font-hanken flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-secondary" /> Improvement Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {result.overall_suggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="text-[10px] font-bold text-primary mt-1 font-jetbrains">{i + 1}.</span>
                        <p className="text-xs text-text-sub">{s}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card className="bg-surface/20 border-white/5 rounded-2xl h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center">
              <BarChart3 className="w-14 h-14 text-text-muted mb-5 opacity-30" />
              <h3 className="text-sm font-bold text-text-sub font-hanken mb-2">Ready to Analyze</h3>
              <p className="text-xs text-text-muted max-w-xs leading-relaxed">
                Paste your resume and a job description on the left, then click Analyze to get your ATS score, missing keywords, and AI-powered bullet rewrites.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
