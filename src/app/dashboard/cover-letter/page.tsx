'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sparkles, Layers, FileText, ChevronRight, Loader2, Copy, CheckCircle2, Download, Save, FolderOpen, Edit3, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface SavedLetter {
  id: string;
  name: string;
  date: string;
  body: string;
  params: {
    jobTitle: string;
    companyName: string;
    hiringManager: string;
    senderName: string;
  };
}

export default function CoverLetterPage() {
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // Creation Mode toggle matching FlowCV flexibility
  const [mode, setMode] = useState<'prompt' | 'manual' | 'history'>('prompt');
  
  const [params, setParams] = useState({
    jobTitle: 'Senior Infrastructure Engineer',
    companyName: 'Stripe',
    hiringManager: 'Engineering Team',
    senderName: 'Sarah Jenkins',
    tone: 'analytical',
    customNotes: 'Emphasize scaling REST/gRPC API barriers and reducing connection overhead.'
  });

  // Manual draft string body
  const [manualText, setManualText] = useState<string>(
    `Dear Hiring Team,\n\nI am writing to express my strong interest in the open position at your organization. Having developed distributed core system platforms and managed resilient web infrastructure previously, I am highly confident in my capacity to add quantifiable value to your immediate delivery roadmaps.\n\nThank you for considering my formal application.\n\nBest regards,\nSarah Jenkins`
  );

  const [variants, setVariants] = useState<string[]>([]);
  const [savedLetters, setSavedLetters] = useState<SavedLetter[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('flowcv_saved_letters');
        if (stored) {
          setSavedLetters(JSON.parse(stored));
        }
      } catch (err) {}
    }
  }, []);

  const handleSnapshotSave = (textToSave: string, titleSuffix = 'Generated Variant') => {
    const entryName = `${params.companyName || 'Corporate'} — ${titleSuffix} (${new Date().toLocaleDateString()})`;
    const newEntry: SavedLetter = {
      id: Date.now().toString(),
      name: entryName,
      date: new Date().toLocaleString(),
      body: textToSave,
      params: {
        jobTitle: params.jobTitle,
        companyName: params.companyName,
        hiringManager: params.hiringManager,
        senderName: params.senderName,
      }
    };

    const updated = [newEntry, ...savedLetters];
    setSavedLetters(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('flowcv_saved_letters', JSON.stringify(updated));
    }
    toast.success(`Archived Cover Letter Snapshot: "${entryName}"`);
  };

  const loadArchivedLetter = (item: SavedLetter) => {
    setParams(prev => ({
      ...prev,
      jobTitle: item.params?.jobTitle || prev.jobTitle,
      companyName: item.params?.companyName || prev.companyName,
      hiringManager: item.params?.hiringManager || prev.hiringManager,
      senderName: item.params?.senderName || prev.senderName,
    }));
    setManualText(item.body);
    setMode('manual');
    toast.success(`Loaded archived text into Studio for manual re-formatting`);
  };

  const deleteArchivedLetter = (id: string) => {
    const filter = savedLetters.filter(l => l.id !== id);
    setSavedLetters(filter);
    if (typeof window !== 'undefined') {
      localStorage.setItem('flowcv_saved_letters', JSON.stringify(filter));
    }
    toast.info('Removed stored layout from cache');
  };

  const generateCoverLetters = () => {
    if (!params.jobTitle.trim() || !params.companyName.trim()) {
      toast.warning('Please enter the target Job Title and Company Name');
      return;
    }

    setLoading(true);
    setVariants([]);

    const fullTexts = [
      `Dear ${params.hiringManager || 'Hiring Manager'},\n\nI am writing to express my strong interest in the ${params.jobTitle} position at ${params.companyName}. With deep engineering expertise in scaling high-concurrency microservices and optimizing data persistence layers, I am excited about the opportunity to drive concrete reliability metrics for your core continuous delivery pipelines.\n\nThroughout my professional career, I have focused heavily on designing highly available REST and gRPC API boundaries capable of supporting complex transaction throughput safely. My recent contributions directly resolve continuous integration bottlenecks, leveraging distributed message queues to streamline continuous deployment payloads.\n\nI would welcome the opportunity to connect briefly to discuss how my systems engineering fundamentals directly align with ${params.companyName}'s upcoming technical roadmap.\n\nSincerely,\n${params.senderName || '[Your Name]'}`,
      
      `Dear ${params.hiringManager || 'Hiring Manager'},\n\nWhen evaluating architectural choices for high-performance distributed systems, engineering teams must balance absolute latency bounds with reliable fault isolation. As a targeted systems builder with direct experience optimizing continuous delivery networks, I am eager to contribute my technical rigor to the ${params.jobTitle} opening at ${params.companyName}.\n\nIn my recent engineering initiatives, I successfully migrated distributed processing layers onto multi-region server clusters, dropping target execution overhead significantly. By establishing robust connection pooling patterns and unified authorization middleware, I ensure secure data broadcast continuity under extreme traffic constraints.\n\nI look forward to discussing how my targeted cloud architecture expertise can directly accelerate your engineering execution schedules.\n\nBest regards,\n${params.senderName || '[Your Name]'}`,

      `Dear ${params.hiringManager || 'Hiring Manager'},\n\nI am reaching out to submit my professional background for the ${params.jobTitle} vacancy at ${params.companyName}. Combining rigorous distributed programming fundamentals with proactive cross-functional leadership, I am confident in my capacity to deliver immediate positive impact across your core platform topologies.\n\nMy core competencies revolve around designing automated deployment manifests, monitoring persistent storage layers, and deploying memory-mapped caching frameworks safely. I am highly motivated by ${params.companyName}'s continuous pursuit of technical excellence.\n\nThank you for considering my application. I would welcome a brief exploratory screen.\n\nSincerely,\n${params.senderName || '[Your Name]'}`
    ];

    // Simulate progressive character streaming generation variant by variant
    let v1 = "";
    let v2 = "";
    let v3 = "";
    
    // First variant stream
    let i1 = 0;
    const timer1 = setInterval(() => {
      if (i1 < fullTexts[0].length) {
        v1 += fullTexts[0][i1];
        setVariants([v1]);
        i1++;
      } else {
        clearInterval(timer1);
        // Start variant 2 stream
        let i2 = 0;
        const timer2 = setInterval(() => {
          if (i2 < fullTexts[1].length) {
            v2 += fullTexts[1][i2];
            setVariants([v1, v2]);
            i2++;
          } else {
            clearInterval(timer2);
            // Start variant 3 stream
            let i3 = 0;
            const timer3 = setInterval(() => {
              if (i3 < fullTexts[2].length) {
                v3 += fullTexts[2][i3];
                setVariants([v1, v2, v3]);
                i3++;
              } else {
                clearInterval(timer3);
                setLoading(false);
                toast.success('Generated 3 Tailored Cover Letter Variants');
              }
            }, 3);
          }
        }, 3);
      }
    }, 3);
  };

  const highlightKeywords = (text: string) => {
    const keywords = ['scaling', 'microservices', 'REST', 'gRPC', 'continuous delivery', 'pipelines', 'distributed', 'latency', 'clusters', 'middleware', 'architecture', 'caching'];
    let highlighted = text;
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      highlighted = highlighted.replace(regex, `<mark class="bg-emerald-500/20 text-emerald-300 rounded px-1 py-0.5 font-mono text-[11px] border border-emerald-500/30">$&</mark>`);
    });
    return highlighted;
  };

  const copyVariant = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success(`Copied Variant ${index + 1} to clipboard`);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="flex flex-col h-full gap-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center text-xs text-text-muted gap-2 font-jetbrains uppercase tracking-widest mb-2">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Workspace</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-bold">Cover Letters Studio</span>
          </div>
          <h1 className="text-3xl font-bold font-hanken">Cover Letters Studio</h1>
          <p className="text-text-sub text-sm">International standard layouts supporting manual live editing, AI progressive streaming, offline snapshots, and printable A4 layouts.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => {
              toast.success('Compiling FlowCV standard printable A4 layout...');
              window.print();
            }} 
            variant="outline" 
            className="rounded-xl gap-2 border-white/10 hover:bg-surface-2 text-xs h-10"
          >
            <Download className="w-3.5 h-3.5" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Mode selectors */}
      <div className="flex bg-surface-2 p-1 rounded-2xl border border-white/5 max-w-md">
        <button 
          onClick={() => setMode('prompt')}
          className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            mode === 'prompt' ? 'bg-primary text-background shadow-md' : 'text-text-sub hover:text-text-main'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> AI Generator
        </button>
        <button 
          onClick={() => setMode('manual')}
          className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            mode === 'manual' ? 'bg-primary text-background shadow-md' : 'text-text-sub hover:text-text-main'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" /> Studio Editor
        </button>
        <button 
          onClick={() => setMode('history')}
          className={`flex-1 py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
            mode === 'history' ? 'bg-primary text-background shadow-md' : 'text-text-sub hover:text-text-main'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> History ({savedLetters.length})
        </button>
      </div>

      {/* Layout Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Dynamic Controllers based on selected mode */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {mode === 'prompt' && (
            <Card className="bg-surface/50 border-white/5 backdrop-blur-md rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold font-hanken text-primary">Prompt Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-xs text-text-sub mb-1.5 block">Target Role Title</Label>
                  <Input 
                    value={params.jobTitle}
                    onChange={e => setParams({...params, jobTitle: e.target.value})}
                    className="bg-surface border-white/10 rounded-xl text-xs h-10"
                  />
                </div>

                <div>
                  <Label className="text-xs text-text-sub mb-1.5 block">Company Destination</Label>
                  <Input 
                    value={params.companyName}
                    onChange={e => setParams({...params, companyName: e.target.value})}
                    className="bg-surface border-white/10 rounded-xl text-xs h-10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-text-sub mb-1.5 block">Recipient</Label>
                    <Input 
                      value={params.hiringManager}
                      onChange={e => setParams({...params, hiringManager: e.target.value})}
                      className="bg-surface border-white/10 rounded-xl text-xs h-10"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-text-sub mb-1.5 block">Sender Name</Label>
                    <Input 
                      value={params.senderName}
                      onChange={e => setParams({...params, senderName: e.target.value})}
                      className="bg-surface border-white/10 rounded-xl text-xs h-10"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-text-sub mb-1.5 block">Narrative Tone Focus</Label>
                  <div className="grid grid-cols-3 gap-1.5 mt-1">
                    {(['analytical', 'enthusiastic', 'executive'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setParams({...params, tone: t})}
                        className={`py-1.5 rounded-lg text-[11px] font-bold capitalize border transition-all ${
                          params.tone === t ? 'bg-primary/20 border-primary text-primary' : 'bg-surface border-white/5 text-text-muted hover:border-white/20'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-text-sub mb-1.5 block">Custom Guidance Parameters</Label>
                  <textarea 
                    value={params.customNotes}
                    onChange={e => setParams({...params, customNotes: e.target.value})}
                    rows={3}
                    placeholder="Specific technologies or key impact areas..."
                    className="w-full bg-surface border border-white/10 rounded-xl p-2.5 text-xs text-text-sub focus:outline-none focus:border-primary/50 resize-none font-sans"
                  />
                </div>

                <Button 
                  onClick={generateCoverLetters}
                  disabled={loading}
                  className="w-full rounded-xl py-5 font-bold text-xs shadow-lg shadow-primary/20 border-none mt-2 gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {loading ? 'Streaming Streams...' : 'Stream 3 Tailored Variants'}
                </Button>
              </CardContent>
            </Card>
          )}

          {mode === 'manual' && (
            <Card className="bg-surface/50 border-white/5 backdrop-blur-md rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold font-hanken text-primary">Live Text Studio</CardTitle>
                <CardDescription className="text-xs">Type or modify document lines. Updates reflect instantly on the printable canvas layout.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Input 
                    placeholder="Company Target"
                    value={params.companyName}
                    onChange={e => setParams({...params, companyName: e.target.value})}
                    className="text-xs bg-surface border-white/10"
                  />
                  <Input 
                    placeholder="Sender Signature"
                    value={params.senderName}
                    onChange={e => setParams({...params, senderName: e.target.value})}
                    className="text-xs bg-surface border-white/10"
                  />
                </div>

                <div>
                  <Label className="text-xs text-text-sub mb-1 block">Letter Narrative Body</Label>
                  <textarea 
                    value={manualText}
                    onChange={e => setManualText(e.target.value)}
                    rows={12}
                    placeholder="Write standard letter paragraphs here..."
                    className="w-full bg-surface border border-white/10 rounded-xl p-3 text-xs text-text-sub focus:outline-none focus:border-primary/50 resize-none font-sans leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <Button 
                    onClick={() => {
                      navigator.clipboard.writeText(manualText);
                      toast.success('Copied studio layout contents to local clipboard');
                    }}
                    variant="secondary"
                    className="flex-1 text-xs h-9 rounded-lg"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy Text
                  </Button>
                  <Button 
                    onClick={() => handleSnapshotSave(manualText, 'Manual Studio Edit')}
                    className="flex-1 text-xs h-9 rounded-lg border-none font-bold"
                  >
                    <Save className="w-3.5 h-3.5 mr-1.5" /> Store Version
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {mode === 'history' && (
            <div className="flex flex-col gap-4">
              <span className="text-xs font-jetbrains uppercase text-text-muted tracking-wider block">Historical Offline Letters</span>
              {savedLetters.length === 0 ? (
                <div className="p-8 text-center bg-surface/20 rounded-xl border border-white/5">
                  <p className="text-xs text-text-muted">No stored snapshot files preserved yet.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {savedLetters.map(item => (
                    <div key={item.id} className="p-3 bg-surface-2 rounded-xl border border-white/5 flex items-center justify-between group">
                      <div className="truncate pr-3">
                        <span className="text-xs font-bold text-text-main block truncate">{item.name}</span>
                        <span className="text-[10px] text-text-muted block mt-0.5">{item.date}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button 
                          onClick={() => loadArchivedLetter(item)} 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 text-[11px] px-2 gap-1 text-primary hover:bg-surface rounded-lg"
                        >
                          <FolderOpen className="w-3 h-3" /> Load
                        </Button>
                        <Button 
                          onClick={() => deleteArchivedLetter(item.id)} 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 w-7 p-0 text-text-muted hover:text-red-400 hover:bg-surface rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Side: Render dynamically viewable target layout canvas */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {mode === 'prompt' ? (
            // Multi-variant AI Generation Streams list
            variants.length === 0 && !loading ? (
              <Card className="bg-surface/20 border-white/5 rounded-2xl h-[450px] flex flex-col items-center justify-center p-8 text-center">
                <Layers className="w-12 h-12 text-text-muted mb-4 opacity-40" />
                <h3 className="text-sm font-bold text-text-sub font-jetbrains uppercase tracking-wider mb-2">No Generation Triggered</h3>
                <p className="text-xs text-text-muted max-w-sm">Provide your application specifications on the left to stream 3 customized international cover letter variations progressively.</p>
              </Card>
            ) : (
              variants.map((vText, idx) => (
                <Card key={idx} className="bg-surface/50 border-white/5 backdrop-blur-md rounded-2xl overflow-hidden relative">
                  <div className="bg-surface-2 px-5 py-3 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-xs font-bold font-jetbrains text-text-main uppercase tracking-wider">
                        Variant {idx + 1} <span className="text-text-muted capitalize font-normal">({idx === 0 ? 'Technical Core' : idx === 1 ? 'Architecture Balance' : 'Leadership Pitch'})</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button 
                        onClick={() => handleSnapshotSave(vText, `AI Stream V${idx + 1}`)} 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs px-2 gap-1 text-primary hover:bg-surface rounded-lg"
                      >
                        <Save className="w-3 h-3" /> Archive
                      </Button>
                      <Button 
                        onClick={() => copyVariant(vText, idx)} 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs px-2 gap-1 text-text-sub hover:text-text-main hover:bg-surface rounded-lg"
                      >
                        {copiedIndex === idx ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedIndex === idx ? 'Copied' : 'Copy'}
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div 
                      dangerouslySetInnerHTML={{ __html: highlightKeywords(vText).replace(/\n/g, '<br/>') }}
                      className="text-xs text-text-sub leading-relaxed font-sans text-justify selection:bg-primary/20"
                    />
                  </CardContent>
                </Card>
              ))
            )
          ) : (
            // Real Printable A4 ratio live rendering preview mapping international cover letter requirements
            <div className="flex justify-center overflow-x-auto pb-6">
              <div 
                className="bg-white text-black p-10 rounded-xl shadow-2xl transition-all select-text shrink-0 printable-resume flowcv-a4-canvas border border-neutral-300 font-sans"
                style={{
                  width: '210mm',
                  minHeight: '297mm',
                  color: '#1a1a1a',
                  fontSize: '13px',
                  lineHeight: 1.6
                }}
              >
                
                {/* Formal header sender block */}
                <div className="border-b border-neutral-200 pb-6 mb-6">
                  <h1 className="text-xl font-bold font-serif text-neutral-900 m-0">
                    {params.senderName || 'Sender Full Name'}
                  </h1>
                  <div className="text-xs text-neutral-600 mt-1 font-medium">
                    <span>Professional Core Application Document</span>
                    {params.companyName && <span className="text-blue-800"> • Targeting: {params.companyName}</span>}
                  </div>
                </div>

                {/* Formal international date and recipient standard block */}
                <div className="mb-6 text-xs text-neutral-800 space-y-1">
                  <div>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  <div className="pt-2 font-bold text-neutral-900">{params.hiringManager || 'Hiring Committee'}</div>
                  <div className="text-neutral-700">{params.companyName || 'Target Organization'}</div>
                </div>

                {/* Letter Body paragraphs rendered gracefully */}
                <div className="text-xs text-neutral-800 leading-relaxed text-justify space-y-4">
                  {manualText.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx} className="m-0 leading-relaxed">
                      {paragraph.split('\n').map((line, lIdx, arr) => (
                        <React.Fragment key={lIdx}>
                          {line}
                          {lIdx < arr.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </p>
                  ))}
                </div>

              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
