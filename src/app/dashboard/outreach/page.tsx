'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Send, Copy, CheckCircle2, Loader2, Sparkles, ChevronRight, Mail, RefreshCw, User } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import api from '@/lib/api';

interface EmailResult {
  subject_lines: string[];
  body: string;
  tone?: string;
  word_count?: number;
}

const OUTREACH_TYPES = [
  { id: 'COLD_OUTREACH', label: 'Cold Outreach', desc: 'Introduce yourself to a recruiter or hiring manager' },
  { id: 'FOLLOW_UP', label: 'Follow-Up', desc: 'Follow up on a submitted application' },
  { id: 'THANK_YOU', label: 'Thank You', desc: 'Send a post-interview thank you note' },
  { id: 'REFERRAL_REQUEST', label: 'Referral Request', desc: 'Ask a connection for a referral' },
];

export default function OutreachPage() {
  const { status } = useSession();
  const [loading, setLoading] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState<number | null>(null);
  const [copiedBody, setCopiedBody] = useState(false);

  const [params, setParams] = useState({
    outreachType: 'COLD_OUTREACH',
    jobTitle: '',
    companyName: '',
    recipientName: '',
    context: '',
  });

  const [result, setResult] = useState<EmailResult & { selectedSubjectIndex: number } | null>(null);

  const handleGenerate = async () => {
    if (!params.jobTitle.trim() || !params.companyName.trim()) {
      toast.warning('Please enter the target role and company name');
      return;
    }
    if (status === 'unauthenticated') {
      toast.error('Please sign in to generate emails');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await api.post('/api/ai/generate-email', {
        type: params.outreachType,
        jobTitle: params.jobTitle,
        company: params.companyName,
        context: [
          params.recipientName ? `Recipient: ${params.recipientName}` : '',
          params.context || '',
        ].filter(Boolean).join('\n'),
      });

      if (res.data?.data) {
        const data: EmailResult = res.data.data;
        setResult({
          subject_lines: data.subject_lines || [],
          body: data.body || '',
          tone: data.tone,
          word_count: data.word_count,
          selectedSubjectIndex: 0,
        });
        toast.success('Email draft generated successfully');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copySubject = (txt: string, idx: number) => {
    navigator.clipboard.writeText(txt);
    setCopiedSubject(idx);
    toast.success('Subject line copied');
    setTimeout(() => setCopiedSubject(null), 2000);
  };

  const copyBody = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.body);
    setCopiedBody(true);
    toast.success('Email body copied to clipboard');
    setTimeout(() => setCopiedBody(false), 2000);
  };

  return (
    <div className="flex flex-col h-full gap-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center text-xs text-text-muted gap-2 font-jetbrains uppercase tracking-widest mb-2">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Workspace</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-bold">Email Outreach</span>
          </div>
          <h1 className="text-3xl font-bold font-hanken">Email Outreach</h1>
          <p className="text-text-sub text-sm">AI-crafted professional emails with 3 subject line options to maximize recruiter response rates.</p>
        </div>
        {result && (
          <Button
            onClick={() => setResult(null)}
            variant="outline"
            className="rounded-xl gap-2 border-white/10 text-xs h-9"
          >
            <RefreshCw className="w-3.5 h-3.5" /> New Draft
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Form */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <Card className="bg-surface/50 border-white/5 rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold font-hanken text-primary">Email Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {OUTREACH_TYPES.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setParams({ ...params, outreachType: opt.id })}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                    params.outreachType === opt.id
                      ? 'border-primary bg-primary/10'
                      : 'border-white/5 bg-surface/30 hover:border-white/15'
                  }`}
                >
                  <span className="text-xs font-bold text-text-main block">{opt.label}</span>
                  <span className="text-[11px] text-text-muted block mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-surface/50 border-white/5 rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold font-hanken text-primary">Target Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains mb-1.5 block">Target Role *</Label>
                <Input
                  value={params.jobTitle}
                  onChange={e => setParams({ ...params, jobTitle: e.target.value })}
                  placeholder="e.g. Senior Software Engineer"
                  className="bg-surface border-white/10 rounded-xl text-xs h-10"
                />
              </div>

              <div>
                <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains mb-1.5 block">Company *</Label>
                <Input
                  value={params.companyName}
                  onChange={e => setParams({ ...params, companyName: e.target.value })}
                  placeholder="e.g. Stripe"
                  className="bg-surface border-white/10 rounded-xl text-xs h-10"
                />
              </div>

              <div>
                <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains mb-1.5 block">Recipient Name (optional)</Label>
                <Input
                  value={params.recipientName}
                  onChange={e => setParams({ ...params, recipientName: e.target.value })}
                  placeholder="e.g. Alex Chen"
                  className="bg-surface border-white/10 rounded-xl text-xs h-10"
                />
              </div>

              <div>
                <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains mb-1.5 block">Additional Context</Label>
                <textarea
                  value={params.context}
                  onChange={e => setParams({ ...params, context: e.target.value })}
                  rows={3}
                  placeholder="e.g. I applied 3 days ago via LinkedIn. Key skills: Node.js, React, 5 years exp."
                  className="w-full bg-surface border border-white/10 rounded-xl p-2.5 text-xs text-text-sub focus:outline-none focus:border-primary/50 resize-none font-sans"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full rounded-xl py-5 font-bold text-xs shadow-lg shadow-primary/20 border-none gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? 'Generating...' : 'Generate Email Draft'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {loading ? (
            <Card className="bg-surface/30 border-white/5 rounded-2xl h-[450px] flex flex-col items-center justify-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                <Mail className="absolute inset-0 m-auto w-5 h-5 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold font-hanken animate-pulse">Crafting your email...</p>
                <p className="text-xs text-text-muted mt-1">Generating 3 subject lines and personalized body</p>
              </div>
            </Card>
          ) : result ? (
            <div className="flex flex-col gap-5">
              {/* Subject lines */}
              <Card className="bg-surface/50 border-white/5 rounded-2xl">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold font-hanken flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" /> Subject Lines
                    </CardTitle>
                    <span className="text-[10px] text-text-muted font-jetbrains">Click to select & copy</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {(result.subject_lines || []).map((subj, sIdx) => (
                    <div
                      key={sIdx}
                      onClick={() => {
                        setResult({ ...result, selectedSubjectIndex: sIdx });
                        copySubject(subj, sIdx);
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                        result.selectedSubjectIndex === sIdx
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-white/5 bg-surface-2 hover:border-white/20 text-text-sub'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 ${result.selectedSubjectIndex === sIdx ? 'border-primary text-primary bg-primary/20' : 'border-white/20 text-text-muted'}`}>
                          {sIdx + 1}
                        </div>
                        <span className="text-xs font-medium truncate">{subj}</span>
                      </div>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 shrink-0 ml-2">
                        {copiedSubject === sIdx ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Email body */}
              <Card className="bg-surface/50 border-white/5 rounded-2xl overflow-hidden">
                <div className="bg-surface-2 px-5 py-3 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold text-text-main">Email Body</span>
                    <div className="flex items-center gap-2">
                      {result.tone && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-text-muted font-jetbrains border border-white/5 capitalize">
                          {result.tone}
                        </span>
                      )}
                      {result.word_count && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-text-muted font-jetbrains border border-white/5">
                          {result.word_count} words
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={copyBody}
                    size="sm"
                    className="h-7 text-xs px-3 rounded-lg gap-1.5 shadow-md shadow-primary/10 border-none"
                  >
                    {copiedBody ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedBody ? 'Copied' : 'Copy Body'}
                  </Button>
                </div>
                <CardContent className="p-6">
                  <textarea
                    value={result.body}
                    onChange={e => setResult({ ...result, body: e.target.value })}
                    rows={12}
                    className="w-full bg-transparent border-none p-0 text-xs text-text-sub focus:outline-none resize-none font-sans leading-relaxed selection:bg-primary/20"
                  />
                  <div className="pt-4 border-t border-white/5 mt-2 flex items-center justify-between text-[10px] text-text-muted font-jetbrains">
                    <span>Body is fully editable — personalize before sending</span>
                    <span>{result.body.split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-surface/20 border-white/5 rounded-2xl h-[450px] flex flex-col items-center justify-center p-8 text-center">
              <Send className="w-14 h-14 text-text-muted mb-5 opacity-30" />
              <h3 className="text-sm font-bold font-hanken text-text-sub mb-2">Ready to Draft</h3>
              <p className="text-xs text-text-muted max-w-xs leading-relaxed">
                Select an email type, fill in the target details, and get a personalized email with 3 subject line options in seconds.
              </p>
              <div className="mt-5 flex flex-col gap-2 w-full max-w-xs">
                {OUTREACH_TYPES.map(t => (
                  <div key={t.id} className="flex items-center gap-2 text-[11px] text-text-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                    <span className="font-bold text-text-sub">{t.label}</span>
                    <span>— {t.desc}</span>
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
