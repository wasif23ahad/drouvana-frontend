'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Send, Copy, CheckCircle2, Loader2, Sparkles, ChevronRight, Mail } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function OutreachPage() {
  const [loading, setLoading] = useState(false);
  const [copiedSubject, setCopiedSubject] = useState<number | null>(null);
  const [copiedBody, setCopiedBody] = useState(false);

  const [params, setParams] = useState({
    outreachType: 'direct_intro',
    targetRole: 'Senior Platform Engineer',
    companyName: 'Datadog',
    recipientName: 'Alex Mercer',
    candidateSummary: '7+ years scaling high-throughput Kubernetes telemetry and optimizing Go microservice latency.'
  });

  const [result, setResult] = useState<{
    subjects: string[];
    body: string;
    selectedSubjectIndex: number;
  } | null>(null);

  const handleGenerate = () => {
    if (!params.targetRole.trim() || !params.companyName.trim()) {
      toast.warning('Please complete the core role and company criteria');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      let subjects: string[] = [];
      let bodyText = "";

      if (params.outreachType === 'direct_intro') {
        subjects = [
          `Engineering Application: ${params.targetRole} — [Your Name]`,
          `Driving platform reliability at ${params.companyName} — Experienced Candidate`,
          `High-throughput Go architecture expertise for ${params.companyName}`
        ];
        bodyText = `Hi ${params.recipientName || 'Alex'},\n\nI recently submitted my formal application for the ${params.targetRole} opening and wanted to reach out to you directly. \n\nWith extensive background architecting distributed data streaming collectors and optimizing production connection boundaries, I am confident my technical rigor directly aligns with ${params.companyName}'s continuous metrics tracking goals.\n\nI would welcome the opportunity to connect briefly to discuss how my systems design fundamentals can accelerate your upcoming engineering deliverables.\n\nBest regards,\n[Your Name]`;
      } else if (params.outreachType === 'follow_up') {
        subjects = [
          `Application Follow-up: ${params.targetRole} — [Your Name]`,
          `Strong professional interest: ${params.targetRole} opening`,
          `Following up: Distributed systems candidate for ${params.companyName}`
        ];
        bodyText = `Hi ${params.recipientName || 'Alex'},\n\nI hope you are having a productive week.\n\nI am following up on my application for the ${params.targetRole} position submitted recently. Having led complex container infrastructure scale and reduced continuous delivery blockages previously, I remain highly enthusiastic about driving immediate reliability impact for your team.\n\nPlease let me know if you require any supplementary design documents or technical repositories.\n\nSincerely,\n[Your Name]`;
      } else {
        subjects = [
          `Connecting: Senior systems builder interested in ${params.companyName}`,
          `Collaborating on cloud scale engineering tasks`,
          `Experienced backend specialist reaching out`
        ];
        bodyText = `Hi ${params.recipientName || 'Alex'},\n\nI have been following ${params.companyName}'s exceptional engineering contributions closely. As a targeted systems builder specializing in multi-region message persistence layers, I wanted to send a quick connection intro.\n\nI would love to keep in touch regarding potential platform engineering alignment.\n\nThanks,\n[Your Name]`;
      }

      setResult({
        subjects,
        body: bodyText,
        selectedSubjectIndex: 0
      });
      setLoading(false);
      toast.success('Generated 3 Subject Lines & Optimized Email Core');
    }, 600);
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
    toast.success('Email draft copied to clipboard');
    setTimeout(() => setCopiedBody(false), 2000);
  };

  return (
    <div className="flex flex-col h-full gap-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center text-xs text-text-muted gap-2 font-jetbrains uppercase tracking-widest mb-2">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Workspace</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-bold">Cold Outreach</span>
          </div>
          <h1 className="text-3xl font-bold font-hanken">Cold Outreach</h1>
          <p className="text-text-sub text-sm">Draft optimized professional emails with clickable subject options to maximize recruiter conversion.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Drawer */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="bg-surface/50 border-white/5 backdrop-blur-md rounded-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold font-hanken text-primary">Outreach Objectives</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs text-text-sub mb-1.5 block">Outreach Scenario</Label>
                <div className="space-y-2">
                  {[
                    { id: 'direct_intro', label: 'Direct Application Intro', desc: 'Reach out right after applying' },
                    { id: 'follow_up', label: 'Stale Application Follow-up', desc: 'Prompt timeline updates politely' },
                    { id: 'connection', label: 'Networking Intro', desc: 'Establish preliminary connections' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setParams({...params, outreachType: opt.id})}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        params.outreachType === opt.id ? 'border-primary bg-primary/10' : 'border-white/5 hover:bg-surface-2'
                      }`}
                    >
                      <span className="text-xs font-bold block text-text-main">{opt.label}</span>
                      <span className="text-[11px] text-text-muted block mt-0.5">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs text-text-sub mb-1.5 block">Target Role</Label>
                <Input 
                  value={params.targetRole}
                  onChange={e => setParams({...params, targetRole: e.target.value})}
                  className="bg-surface border-white/10 rounded-xl text-xs h-10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-text-sub mb-1.5 block">Company</Label>
                  <Input 
                    value={params.companyName}
                    onChange={e => setParams({...params, companyName: e.target.value})}
                    className="bg-surface border-white/10 rounded-xl text-xs h-10"
                  />
                </div>
                <div>
                  <Label className="text-xs text-text-sub mb-1.5 block">Recipient Name</Label>
                  <Input 
                    value={params.recipientName}
                    onChange={e => setParams({...params, recipientName: e.target.value})}
                    placeholder="e.g. Alex Mercer"
                    className="bg-surface border-white/10 rounded-xl text-xs h-10"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs text-text-sub mb-1.5 block">Candidate Domain Signature</Label>
                <textarea 
                  value={params.candidateSummary}
                  onChange={e => setParams({...params, candidateSummary: e.target.value})}
                  rows={2}
                  className="w-full bg-surface border border-white/10 rounded-xl p-2.5 text-xs text-text-sub focus:outline-none focus:border-primary/50 resize-none font-sans"
                />
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={loading}
                className="w-full rounded-xl py-5 font-bold text-xs shadow-lg shadow-primary/20 border-none mt-2 gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {loading ? 'Synthesizing Drafts...' : 'Draft Optimized Email'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Output Layout */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {loading ? (
            <Card className="bg-surface/30 border-white/5 rounded-2xl h-[450px] flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-xs font-jetbrains text-text-sub uppercase tracking-widest">Optimizing Subject Tokenization...</p>
            </Card>
          ) : result ? (
            <div className="flex flex-col gap-6">
              
              {/* Clickable subject options */}
              <Card className="bg-surface/50 border-white/5 backdrop-blur-md rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xs uppercase font-jetbrains text-text-sub tracking-wider">3 Clickable Subject Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2.5">
                  {result.subjects.map((subj, sIdx) => (
                    <div 
                      key={sIdx}
                      onClick={() => {
                        setResult({...result, selectedSubjectIndex: sIdx});
                        copySubject(subj, sIdx);
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                        result.selectedSubjectIndex === sIdx ? 'border-primary bg-primary/10 text-primary font-medium' : 'border-white/5 bg-surface-2 hover:border-white/20 text-text-sub hover:text-text-main'
                      }`}
                    >
                      <span className="text-xs font-sans tracking-tight">{subj}</span>
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px] group-hover:bg-surface opacity-0 group-hover:opacity-100 transition-opacity">
                        {copiedSubject === sIdx ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Editable Body Draft */}
              <Card className="bg-surface/50 border-white/5 backdrop-blur-md rounded-2xl overflow-hidden relative">
                <div className="bg-surface-2 px-5 py-3 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold font-jetbrains text-text-main">Optimized Email Core</span>
                  </div>
                  <Button 
                    onClick={copyBody} 
                    size="sm" 
                    className="h-7 text-xs px-3 rounded-lg gap-1.5 shadow-md shadow-primary/10 border-none"
                  >
                    {copiedBody ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedBody ? 'Copied Body' : 'Copy Email Body'}
                  </Button>
                </div>
                <CardContent className="p-6">
                  <textarea 
                    value={result.body}
                    onChange={e => setResult({...result, body: e.target.value})}
                    rows={11}
                    className="w-full bg-transparent border-none p-0 text-xs text-text-sub focus:outline-none resize-none font-sans leading-relaxed selection:bg-primary/20"
                  />
                  <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between text-[10px] text-text-muted font-jetbrains">
                    <span>* Content is fully user-modifiable</span>
                    <span>Tokens: ~400 bounds</span>
                  </div>
                </CardContent>
              </Card>

            </div>
          ) : (
            <Card className="bg-surface/20 border-white/5 rounded-2xl h-[450px] flex flex-col items-center justify-center p-8 text-center">
              <Send className="w-12 h-12 text-text-muted mb-4 opacity-40" />
              <h3 className="text-sm font-bold text-text-sub font-jetbrains uppercase tracking-wider mb-2">No Subject Drafts Created</h3>
              <p className="text-xs text-text-muted max-w-sm">Select your scenario and provide recipient metadata on the left to extract professional subject structures instantly.</p>
            </Card>
          )}
        </div>

      </div>
    </div>
  );
}
