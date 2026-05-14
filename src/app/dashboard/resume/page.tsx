'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Sparkles, Plus, Trash2, GripVertical, ChevronRight, Save,
  CheckCircle2, Loader2, UploadCloud, FileText, Eye, X,
  MapPin, Briefcase, GraduationCap, Code2, Award, Globe
} from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useDropzone } from 'react-dropzone';
import api from '@/lib/api';
import { toast } from 'sonner';

// Convert any stored date string to MM/DD/YYYY for display in date inputs
const toDisplayDate = (stored: string): string => {
  if (!stored || stored.toLowerCase().includes('present')) return '';
  const trimmed = stored.trim();
  // Already MM/DD/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) return trimmed;
  // ISO YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [y, m, d] = trimmed.split('-');
    return `${m}/${d}/${y}`;
  }
  // Try parsing loosely
  const yearMatch = trimmed.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) {
    const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
    const lower = trimmed.toLowerCase();
    let monthIdx = 0;
    for (let i = 0; i < months.length; i++) {
      if (lower.includes(months[i])) { monthIdx = i; break; }
    }
    return `${String(monthIdx + 1).padStart(2, '0')}/01/${yearMatch[0]}`;
  }
  return trimmed;
};

// Convert MM/DD/YYYY input back to stored value
const fromDisplayDate = (display: string): string => display.trim();

// Convert any stored month string to MM/YYYY for display
const toDisplayMonth = (stored: string): string => {
  if (!stored) return '';
  const trimmed = stored.trim();
  if (/^\d{2}\/\d{4}$/.test(trimmed)) return trimmed;
  // ISO YYYY-MM
  if (/^\d{4}-\d{2}$/.test(trimmed)) {
    const [y, m] = trimmed.split('-');
    return `${m}/${y}`;
  }
  // ISO YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [y, m] = trimmed.split('-');
    return `${m}/${y}`;
  }
  return trimmed;
};

type SectionKey = 'personal' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications';

const SECTIONS: { key: SectionKey; label: string; icon: React.ElementType }[] = [
  { key: 'personal', label: 'Personal Info', icon: Globe },
  { key: 'summary', label: 'Summary', icon: FileText },
  { key: 'experience', label: 'Experience', icon: Briefcase },
  { key: 'education', label: 'Education', icon: GraduationCap },
  { key: 'skills', label: 'Skills', icon: Code2 },
  { key: 'projects', label: 'Projects', icon: Code2 },
  { key: 'certifications', label: 'Certifications', icon: Award },
];

export default function MasterResumePage() {
  const { data: session, status } = useSession();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parseSuccessMsg, setParseSuccessMsg] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [enhancingSummary, setEnhancingSummary] = useState(false);
  const [enhancingBulletId, setEnhancingBulletId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<SectionKey>('personal');

  const { register, control, handleSubmit, reset, watch, setValue, getValues } = useForm({
    defaultValues: {
      personalInfo: {
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        portfolio: '',
        x: '',
        reddit: '',
        leetcode: '',
      },
      summary: '',
      experience: [{ id: '1', company: '', role: '', dates: '', description: '' }],
      education: [{ id: '1', institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }],
      skills: '',
      projects: [{ id: '1', name: '', description: '', techStack: '', url: '' }],
      certifications: [{ id: '1', name: '', issuer: '', date: '', url: '' }],
      uploadedFileName: '',
      uploadedPdfBase64: '',
    }
  });

  const uploadedFileName = watch('uploadedFileName');
  const uploadedPdfBase64 = watch('uploadedPdfBase64');

  const expFields = useFieldArray({ control, name: 'experience' });
  const eduFields = useFieldArray({ control, name: 'education' });
  const projFields = useFieldArray({ control, name: 'projects' });
  const certFields = useFieldArray({ control, name: 'certifications' });

  React.useEffect(() => {
    if (status === 'unauthenticated') { setLoading(false); return; }
    if (status !== 'authenticated') return;
    api.get('/api/resume/master').then(res => {
      if (res.data.data) reset(res.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [reset, status]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      await api.put('/api/resume/master', { data });
      setSaved(true);
      toast.success('Resume saved successfully');
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const onEnhanceSummary = async () => {
    const currentSummary = getValues('summary');
    if (!currentSummary?.trim() || currentSummary.trim().length < 5) {
      toast.error('Please enter a brief summary first');
      return;
    }
    setEnhancingSummary(true);
    try {
      const res = await api.post('/api/ai/enhance-text', { text: currentSummary, type: 'summary' });
      if (res.data?.data) {
        setValue('summary', res.data.data, { shouldDirty: true });
        toast.success('Summary enhanced!');
      }
    } catch { toast.error('Failed to enhance summary'); }
    finally { setEnhancingSummary(false); }
  };

  const onEnhanceBullets = async (index: number) => {
    const currentDesc = getValues(`experience.${index}.description` as const);
    if (!currentDesc?.trim() || currentDesc.trim().length < 5) {
      toast.error('Please add some bullet points first');
      return;
    }
    setEnhancingBulletId(index.toString());
    try {
      const res = await api.post('/api/ai/enhance-text', { text: currentDesc, type: 'bullets' });
      if (res.data?.data) {
        setValue(`experience.${index}.description` as const, res.data.data, { shouldDirty: true });
        toast.success('Bullets optimized!');
      }
    } catch { toast.error('Failed to optimize bullets'); }
    finally { setEnhancingBulletId(null); }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setParsing(true);
    setParseSuccessMsg(false);

    const fileBase64 = await new Promise<string>(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    const formData = new FormData();
    formData.append('file', file);

    let extractedData: any = null;
    try {
      toast.info('Parsing resume...');
      const res = await api.post('/api/ai/parse-resume', formData);
      if (res.data?.data) extractedData = res.data.data;
    } catch { /* non-blocking */ }

    if (!extractedData?.personalInfo?.name) {
      extractedData = {
        personalInfo: { name: session?.user?.name || '', email: session?.user?.email || '', phone: '', location: '', linkedin: '', github: '', portfolio: '', x: '', reddit: '', leetcode: '' },
        summary: '', experience: [{ id: 'exp_1', company: '', role: '', dates: '', description: '' }],
        education: [], skills: '', projects: [], certifications: [],
      };
    }

    extractedData.uploadedFileName = file.name;
    extractedData.uploadedPdfBase64 = fileBase64;

    setTimeout(async () => {
      reset(extractedData);
      try { await api.put('/api/resume/master', { data: extractedData }); } catch { /* non-blocking */ }
      setParsing(false);
      setParseSuccessMsg(true);
      toast.success('Resume parsed successfully!');
    }, 1200);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'application/pdf': ['.pdf'] }, multiple: false
  });

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const sectionNav = (
    <div className="flex gap-1 flex-wrap mb-6">
      {SECTIONS.map(s => {
        const Icon = s.icon;
        return (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSection === s.key
                ? 'bg-primary/20 text-primary border border-primary/30'
                : 'text-text-muted hover:text-text-main border border-transparent hover:border-white/10'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {s.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col h-full gap-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center text-xs text-text-muted gap-2 font-jetbrains uppercase tracking-widest mb-2">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Workspace</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-bold">Resume Builder</span>
          </div>
          <h1 className="text-3xl font-bold font-hanken">Resume Builder</h1>
          <p className="text-text-sub text-sm">Build your master resume. All AI features use this data automatically.</p>
        </div>
        <Button
          onClick={handleSubmit(onSubmit)}
          className="rounded-xl gap-2 shadow-lg shadow-primary/20 border-none"
          disabled={saving}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Resume'}
        </Button>
      </div>

      {/* PDF Upload */}
      <div className="space-y-3">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
            isDragActive ? 'border-primary bg-primary/5' : parsing ? 'border-primary/50 bg-primary/5' : 'border-white/10 hover:border-primary/30 bg-surface/20'
          }`}
        >
          <input {...getInputProps()} />
          {parsing ? (
            <div className="flex flex-col items-center gap-3 py-3">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                <div className="relative w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '2s' }} />
                </div>
              </div>
              <p className="text-sm font-bold text-primary animate-pulse">Parsing your resume...</p>
            </div>
          ) : uploadedFileName ? (
            <div className="flex items-center justify-between gap-4 px-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-error/10 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-error" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-text-main">{uploadedFileName}</p>
                  <button onClick={e => { e.stopPropagation(); setPdfModalOpen(true); }} className="text-xs text-primary flex items-center gap-1 hover:underline">
                    <Eye className="w-3 h-3" /> View PDF
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={e => { e.stopPropagation(); }}>
                  <UploadCloud className="w-3 h-3 mr-1" /> Replace
                </Button>
                <Button size="sm" variant="ghost" type="button" className="h-7 text-xs text-error hover:text-error"
                  onClick={e => { e.stopPropagation(); setValue('uploadedFileName', ''); setValue('uploadedPdfBase64', ''); }}>
                  <Trash2 className="w-3 h-3 mr-1" /> Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <UploadCloud className="w-8 h-8 text-text-muted" />
              <p className="text-sm font-bold text-text-main">{isDragActive ? 'Drop PDF here' : 'Import existing resume (PDF)'}</p>
              <p className="text-xs text-text-muted">AI will extract and pre-fill all sections automatically</p>
            </div>
          )}
        </div>

        {parseSuccessMsg && (
          <div className="flex items-center justify-between gap-4 p-3 rounded-xl bg-success/10 border border-success/30 text-success">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <p className="text-xs font-bold">Resume parsed successfully! Review and edit the extracted data below.</p>
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-success hover:bg-success/20"
              onClick={() => setParseSuccessMsg(false)}>Dismiss</Button>
          </div>
        )}
      </div>

      {/* Section navigation */}
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl">
        {sectionNav}

        {/* Personal Info */}
        {activeSection === 'personal' && (
          <Card className="border-white/5 shadow-xl">
            <CardHeader>
              <CardTitle className="font-hanken text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Full Name</Label>
                <Input {...register('personalInfo.name')} placeholder="Alex Johnson" className="bg-surface-2 border-none h-11 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Email</Label>
                <Input {...register('personalInfo.email')} placeholder="alex@example.com" className="bg-surface-2 border-none h-11 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Phone</Label>
                <Input {...register('personalInfo.phone')} placeholder="+1 (555) 123-4567" className="bg-surface-2 border-none h-11 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Location</Label>
                <Input {...register('personalInfo.location')} placeholder="e.g. San Francisco, CA" className="bg-surface-2 border-none h-11 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">LinkedIn URL</Label>
                <Input {...register('personalInfo.linkedin')} placeholder="linkedin.com/in/username" className="bg-surface-2 border-none h-11 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">GitHub URL</Label>
                <Input {...register('personalInfo.github')} placeholder="github.com/username" className="bg-surface-2 border-none h-11 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Portfolio Website</Label>
                <Input {...register('personalInfo.portfolio')} placeholder="https://myportfolio.dev" className="bg-surface-2 border-none h-11 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">X / Twitter</Label>
                <Input {...register('personalInfo.x')} placeholder="x.com/username" className="bg-surface-2 border-none h-11 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">LeetCode</Label>
                <Input {...register('personalInfo.leetcode')} placeholder="leetcode.com/u/username" className="bg-surface-2 border-none h-11 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Reddit</Label>
                <Input {...register('personalInfo.reddit')} placeholder="reddit.com/user/username" className="bg-surface-2 border-none h-11 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        {activeSection === 'summary' && (
          <Card className="border-white/5 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="font-hanken text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-secondary" /> Professional Summary
                </CardTitle>
                <CardDescription className="text-xs mt-1">A concise overview of your professional identity and value proposition.</CardDescription>
              </div>
              <Button size="sm" variant="outline" type="button" onClick={onEnhanceSummary} disabled={enhancingSummary}
                className="text-primary border-primary/30 hover:bg-primary/10 rounded-full h-8 text-[10px] uppercase tracking-widest">
                {enhancingSummary ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Enhancing...</> : <><Sparkles className="w-3 h-3 mr-1" /> AI Enhance</>}
              </Button>
            </CardHeader>
            <CardContent>
              <textarea
                {...register('summary')}
                rows={6}
                placeholder="A results-driven software engineer with 5+ years of experience building scalable web applications..."
                className="w-full p-4 rounded-xl border-none bg-surface-2 text-text-main focus:ring-2 focus:ring-primary resize-y text-sm leading-relaxed"
              />
            </CardContent>
          </Card>
        )}

        {/* Experience */}
        {activeSection === 'experience' && (
          <Card className="border-white/5 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="font-hanken text-lg flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-accent" /> Work Experience
                </CardTitle>
                <CardDescription className="text-xs mt-1">List your work history in reverse chronological order.</CardDescription>
              </div>
              <Button size="sm" type="button" onClick={() => expFields.append({ id: Math.random().toString(), company: '', role: '', dates: '', description: '' })}
                className="rounded-full h-8 text-[10px] uppercase tracking-widest border-none">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {expFields.fields.map((field, index) => (
                <div key={field.id} className="relative p-5 rounded-2xl border border-white/5 bg-surface/30 group hover:border-primary/20 transition-all">
                  <Button
                    variant="ghost" size="icon" type="button" onClick={() => expFields.remove(index)}
                    className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface border border-white/10 text-error hover:text-error rounded-full h-7 w-7"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Company</Label>
                      <Input {...register(`experience.${index}.company` as const)} placeholder="e.g. Google" className="bg-surface-2 border-none h-10 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Job Title</Label>
                      <Input {...register(`experience.${index}.role` as const)} placeholder="e.g. Software Engineer" className="bg-surface-2 border-none h-10 rounded-xl" />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Date Range</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-[9px] text-text-muted block font-jetbrains uppercase mb-1">From (MM/DD/YYYY)</span>
                          <Input
                            type="text"
                            placeholder="MM/DD/YYYY"
                            value={toDisplayDate((watch(`experience.${index}.dates` as const) || '').split(' to ')[0]?.trim() || '')}
                            onChange={e => {
                              const curr = watch(`experience.${index}.dates` as const) || '';
                              const toVal = curr.includes(' to ') ? curr.split(' to ')[1].trim() : '';
                              setValue(`experience.${index}.dates` as const, `${fromDisplayDate(e.target.value)}${toVal ? ` to ${toVal}` : ''}`, { shouldDirty: true });
                            }}
                            className="bg-surface-2 border-none h-10 rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] text-text-muted block font-jetbrains uppercase">To (MM/DD/YYYY)</span>
                            <button type="button" onClick={() => {
                              const curr = watch(`experience.${index}.dates` as const) || '';
                              const isPresent = curr.toLowerCase().includes('present');
                              const fromVal = curr.split(' to ')[0]?.trim() || curr.replace(/\s*(?:to|-)?\s*present/i, '').trim();
                              setValue(`experience.${index}.dates` as const, isPresent ? fromVal : `${fromVal ? `${fromVal} to ` : ''}Present`, { shouldDirty: true });
                            }}
                              className={`text-[9px] font-jetbrains uppercase px-1.5 py-0.5 rounded transition-all ${(watch(`experience.${index}.dates` as const) || '').toLowerCase().includes('present') ? 'bg-primary/20 text-primary border border-primary/30' : 'text-text-muted hover:text-text-main bg-surface-2'}`}>
                              ✓ Present
                            </button>
                          </div>
                          {(watch(`experience.${index}.dates` as const) || '').toLowerCase().includes('present') ? (
                            <div className="bg-primary/10 border border-primary/20 h-10 rounded-xl flex items-center px-3 text-xs text-primary font-bold cursor-pointer"
                              onClick={() => { const curr = watch(`experience.${index}.dates` as const) || ''; setValue(`experience.${index}.dates` as const, curr.split(' to ')[0].trim(), { shouldDirty: true }); }}>
                              Present
                            </div>
                          ) : (
                            <Input
                              type="text"
                              placeholder="MM/DD/YYYY"
                              value={toDisplayDate((watch(`experience.${index}.dates` as const) || '').split(' to ')[1]?.trim() || '')}
                              onChange={e => {
                                const curr = watch(`experience.${index}.dates` as const) || '';
                                const fromVal = curr.split(' to ')[0]?.trim() || curr;
                                setValue(`experience.${index}.dates` as const, `${fromVal ? `${fromVal} to ` : ''}${fromDisplayDate(e.target.value)}`, { shouldDirty: true });
                              }}
                              className="bg-surface-2 border-none h-10 rounded-xl text-sm"
                            />
                          )}
                        </div>
                      </div>
                      <input type="hidden" {...register(`experience.${index}.dates` as const)} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Responsibilities & Achievements</Label>
                      <Button size="sm" variant="ghost" type="button" onClick={() => onEnhanceBullets(index)}
                        disabled={enhancingBulletId === index.toString()}
                        className="h-6 text-[10px] text-primary font-bold uppercase tracking-widest hover:bg-primary/5">
                        {enhancingBulletId === index.toString() ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Optimizing...</> : <><Sparkles className="w-3 h-3 mr-1" /> AI Optimize</>}
                      </Button>
                    </div>
                    <textarea
                      {...register(`experience.${index}.description` as const)}
                      rows={4}
                      placeholder="• Led development of microservices handling 50K req/min&#10;• Reduced API latency by 40% through query optimization&#10;• Mentored 3 junior engineers"
                      className="w-full p-4 rounded-xl border-none bg-surface-2 text-text-main focus:ring-2 focus:ring-primary text-sm leading-relaxed resize-y"
                    />
                    <p className="text-[10px] text-text-muted font-jetbrains">Use bullet points (•) or separate lines. AI Optimize will quantify and strengthen each point.</p>
                  </div>
                </div>
              ))}
              {expFields.fields.length === 0 && (
                <div className="text-center py-8 border border-dashed border-white/10 rounded-2xl">
                  <p className="text-sm text-text-muted mb-3">No experience entries yet</p>
                  <Button type="button" size="sm" onClick={() => expFields.append({ id: Math.random().toString(), company: '', role: '', dates: '', description: '' })}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Experience
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Education */}
        {activeSection === 'education' && (
          <Card className="border-white/5 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="font-hanken text-lg flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-secondary" /> Education
                </CardTitle>
                <CardDescription className="text-xs mt-1">Degrees, diplomas, and academic credentials.</CardDescription>
              </div>
              <Button size="sm" type="button" onClick={() => eduFields.append({ id: Math.random().toString(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' })}
                className="rounded-full h-8 text-[10px] uppercase tracking-widest border-none">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-5">
              {eduFields.fields.map((field, index) => (
                <div key={field.id} className="relative p-5 rounded-2xl border border-white/5 bg-surface/30 group hover:border-primary/20 transition-all">
                  <Button variant="ghost" size="icon" type="button" onClick={() => eduFields.remove(index)}
                    className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 bg-surface border border-white/10 text-error rounded-full h-7 w-7">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Institution</Label>
                      <Input {...register(`education.${index}.institution` as const)} placeholder="e.g. MIT, Stanford University" className="bg-surface-2 border-none h-10 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Degree</Label>
                      <Input {...register(`education.${index}.degree` as const)} placeholder="e.g. Bachelor of Science, M.S." className="bg-surface-2 border-none h-10 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Field of Study</Label>
                      <Input {...register(`education.${index}.field` as const)} placeholder="e.g. Computer Science" className="bg-surface-2 border-none h-10 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Start Date (MM/YYYY)</Label>
                      <Input
                        type="text"
                        placeholder="MM/YYYY"
                        value={toDisplayMonth(watch(`education.${index}.startDate` as const) || '')}
                        onChange={e => setValue(`education.${index}.startDate` as const, e.target.value, { shouldDirty: true })}
                        className="bg-surface-2 border-none h-10 rounded-xl text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">End Date (MM/YYYY)</Label>
                      <Input
                        type="text"
                        placeholder="MM/YYYY or Present"
                        value={toDisplayMonth(watch(`education.${index}.endDate` as const) || '')}
                        onChange={e => setValue(`education.${index}.endDate` as const, e.target.value, { shouldDirty: true })}
                        className="bg-surface-2 border-none h-10 rounded-xl text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">GPA (optional)</Label>
                      <Input {...register(`education.${index}.gpa` as const)} placeholder="e.g. 3.9 / 4.0" className="bg-surface-2 border-none h-10 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
              {eduFields.fields.length === 0 && (
                <div className="text-center py-8 border border-dashed border-white/10 rounded-2xl">
                  <p className="text-sm text-text-muted mb-3">No education entries yet</p>
                  <Button type="button" size="sm" onClick={() => eduFields.append({ id: Math.random().toString(), institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' })}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Education
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Skills */}
        {activeSection === 'skills' && (
          <Card className="border-white/5 shadow-xl">
            <CardHeader>
              <CardTitle className="font-hanken text-lg flex items-center gap-2">
                <Code2 className="w-5 h-5 text-emerald-400" /> Skills
              </CardTitle>
              <CardDescription className="text-xs mt-1">Comma-separated list of technical skills, tools, and technologies.</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                {...register('skills')}
                rows={4}
                placeholder="React, Node.js, TypeScript, PostgreSQL, Docker, AWS, Python, GraphQL, Redis, Kubernetes..."
                className="w-full p-4 rounded-xl border-none bg-surface-2 text-text-main focus:ring-2 focus:ring-primary text-sm leading-relaxed resize-y"
              />
              <div className="mt-3">
                {watch('skills') && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {watch('skills').split(',').filter(s => s.trim()).map((skill, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-medium">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Projects */}
        {activeSection === 'projects' && (
          <Card className="border-white/5 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="font-hanken text-lg flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-primary" /> Projects
                </CardTitle>
                <CardDescription className="text-xs mt-1">Personal, open-source, or notable professional projects.</CardDescription>
              </div>
              <Button size="sm" type="button" onClick={() => projFields.append({ id: Math.random().toString(), name: '', description: '', techStack: '', url: '' })}
                className="rounded-full h-8 text-[10px] uppercase tracking-widest border-none">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-5">
              {projFields.fields.map((field, index) => (
                <div key={field.id} className="relative p-5 rounded-2xl border border-white/5 bg-surface/30 group hover:border-primary/20 transition-all">
                  <Button variant="ghost" size="icon" type="button" onClick={() => projFields.remove(index)}
                    className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 bg-surface border border-white/10 text-error rounded-full h-7 w-7">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Project Name</Label>
                      <Input {...register(`projects.${index}.name` as const)} placeholder="e.g. E-Commerce Platform" className="bg-surface-2 border-none h-10 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Tech Stack</Label>
                      <Input {...register(`projects.${index}.techStack` as const)} placeholder="e.g. React, Node.js, PostgreSQL" className="bg-surface-2 border-none h-10 rounded-xl" />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Description & Highlights</Label>
                      <textarea
                        {...register(`projects.${index}.description` as const)}
                        rows={3}
                        placeholder="Brief description of the project, your role, and key achievements..."
                        className="w-full p-3 rounded-xl border-none bg-surface-2 text-text-main focus:ring-2 focus:ring-primary text-sm leading-relaxed resize-y"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">URL (optional)</Label>
                      <Input {...register(`projects.${index}.url` as const)} placeholder="https://github.com/username/project" className="bg-surface-2 border-none h-10 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
              {projFields.fields.length === 0 && (
                <div className="text-center py-8 border border-dashed border-white/10 rounded-2xl">
                  <p className="text-sm text-text-muted mb-3">No projects added yet</p>
                  <Button type="button" size="sm" onClick={() => projFields.append({ id: Math.random().toString(), name: '', description: '', techStack: '', url: '' })}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Project
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Certifications */}
        {activeSection === 'certifications' && (
          <Card className="border-white/5 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="font-hanken text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" /> Certifications
                </CardTitle>
                <CardDescription className="text-xs mt-1">Professional certifications and licenses.</CardDescription>
              </div>
              <Button size="sm" type="button" onClick={() => certFields.append({ id: Math.random().toString(), name: '', issuer: '', date: '', url: '' })}
                className="rounded-full h-8 text-[10px] uppercase tracking-widest border-none">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-5">
              {certFields.fields.map((field, index) => (
                <div key={field.id} className="relative p-5 rounded-2xl border border-white/5 bg-surface/30 group hover:border-primary/20 transition-all">
                  <Button variant="ghost" size="icon" type="button" onClick={() => certFields.remove(index)}
                    className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 bg-surface border border-white/10 text-error rounded-full h-7 w-7">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Certification Name</Label>
                      <Input {...register(`certifications.${index}.name` as const)} placeholder="e.g. AWS Solutions Architect – Associate" className="bg-surface-2 border-none h-10 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Issuing Organization</Label>
                      <Input {...register(`certifications.${index}.issuer` as const)} placeholder="e.g. Amazon Web Services" className="bg-surface-2 border-none h-10 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Date Earned (MM/YYYY)</Label>
                      <Input
                        type="text"
                        placeholder="MM/YYYY"
                        value={toDisplayMonth(watch(`certifications.${index}.date` as const) || '')}
                        onChange={e => setValue(`certifications.${index}.date` as const, e.target.value, { shouldDirty: true })}
                        className="bg-surface-2 border-none h-10 rounded-xl text-sm"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Credential URL (optional)</Label>
                      <Input {...register(`certifications.${index}.url` as const)} placeholder="https://aws.amazon.com/certification/..." className="bg-surface-2 border-none h-10 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
              {certFields.fields.length === 0 && (
                <div className="text-center py-8 border border-dashed border-white/10 rounded-2xl">
                  <p className="text-sm text-text-muted mb-3">No certifications added yet</p>
                  <Button type="button" size="sm" onClick={() => certFields.append({ id: Math.random().toString(), name: '', issuer: '', date: '', url: '' })}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Certification
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Save button at bottom */}
        <div className="flex gap-3 mt-8">
          <Button type="submit" className="rounded-xl gap-2 shadow-lg shadow-primary/20 border-none px-8" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Resume'}
          </Button>
          <Button type="button" variant="outline" className="rounded-xl gap-2 border-white/10" onClick={() => setActiveSection(SECTIONS[(SECTIONS.findIndex(s => s.key === activeSection) + 1) % SECTIONS.length].key)}>
            Next Section <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </form>

      {/* PDF Preview Modal */}
      {pdfModalOpen && uploadedPdfBase64 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setPdfModalOpen(false)}>
          <div className="relative w-full max-w-4xl h-[85vh] bg-surface rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 bg-surface-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-error" />
                <span className="text-sm font-bold text-text-main truncate">{uploadedFileName}</span>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full" onClick={() => setPdfModalOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 bg-white">
              <iframe
                src={uploadedPdfBase64.startsWith('data:') ? uploadedPdfBase64 : `data:application/pdf;base64,${uploadedPdfBase64}`}
                className="w-full h-full border-none"
                title="Uploaded Resume PDF"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
