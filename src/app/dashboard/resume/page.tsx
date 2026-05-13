'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sparkles, Plus, Trash2, GripVertical, ChevronRight, Download, Save, CheckCircle2, Loader2, UploadCloud } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useDropzone } from 'react-dropzone';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function MasterResumePage() {
  const { data: session, status } = useSession();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [loading, setLoading] = useState(true);

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      personalInfo: {
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        phone: '',
        linkedin: '',
        github: '',
        x: '',
        reddit: '',
        leetcode: '',
        portfolio: '',
      },
      summary: 'Experienced professional with a passion for building impactful products.',
      experience: [
        { id: '1', company: '', role: '', dates: '', description: '' }
      ],
      skills: '',
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience"
  });

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      setLoading(false);
      return;
    }
    if (status !== 'authenticated') return;

    const fetchResume = async () => {
      try {
        const res = await api.get('/api/resume/master');
        if (res.data.data) {
          reset(res.data.data);
        }
      } catch (error) {
        console.error('Failed to load master resume', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [reset, status]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      await api.put('/api/resume/master', { data });
      setSaved(true);
      toast.success('Profile Saved Successfully');
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      toast.error('Failed to save profile');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setParsing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      toast.info('Analyzing PDF Architecture...');
      const res = await api.post('/api/ai/parse-resume', formData);
      if (res.data.data) {
        reset(res.data.data);
        await api.put('/api/resume/master', { data: res.data.data });
        toast.success('Resume Extracted & Profile Synchronized');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to parse PDF document');
    } finally {
      setParsing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center text-xs text-text-muted gap-2 font-jetbrains uppercase tracking-widest mb-2">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Workspace</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-bold">Profile</span>
          </div>
          <h1 className="text-3xl font-bold font-hanken">Profile</h1>
          <p className="text-text-sub text-sm">Your professional information used across all AI features.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none rounded-xl gap-2">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
          <Button onClick={handleSubmit(onSubmit)} className="flex-1 sm:flex-none rounded-xl gap-2 shadow-lg shadow-primary/20 border-none" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Profile'}
          </Button>
        </div>
      </div>

      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-primary/50 bg-surface/30'
        }`}
      >
        <input {...getInputProps()} />
        {parsing ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm font-jetbrains text-text-sub uppercase tracking-widest">Parsing document...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center">
              <UploadCloud className="w-6 h-6 text-text-sub" />
            </div>
            <p className="text-sm font-bold text-text-main">
              {isDragActive ? "Drop PDF here" : "Import existing Resume (PDF)"}
            </p>
            <p className="text-xs text-text-muted">Our AI will extract and structure your intelligence logs automatically.</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-8">
        <Card className="border-white/5 shadow-2xl">
          <CardHeader>
            <CardTitle className="font-hanken text-xl flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Full Name</Label>
              <Input {...register('personalInfo.name')} placeholder="e.g. Alex Rivera" className="bg-surface-2 border-none h-12 rounded-xl focus-visible:ring-primary" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Email</Label>
              <Input {...register('personalInfo.email')} placeholder="e.g. alex@example.com" className="bg-surface-2 border-none h-12 rounded-xl focus-visible:ring-primary" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Phone</Label>
              <Input {...register('personalInfo.phone')} placeholder="e.g. +1 (555) 019-2834" className="bg-surface-2 border-none h-12 rounded-xl focus-visible:ring-primary" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">LinkedIn URL</Label>
              <Input {...register('personalInfo.linkedin')} placeholder="e.g. linkedin.com/in/username" className="bg-surface-2 border-none h-12 rounded-xl focus-visible:ring-primary" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">GitHub URL</Label>
              <Input {...register('personalInfo.github')} placeholder="e.g. github.com/username" className="bg-surface-2 border-none h-12 rounded-xl focus-visible:ring-primary" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">X (Twitter) URL</Label>
              <Input {...register('personalInfo.x')} placeholder="e.g. x.com/username" className="bg-surface-2 border-none h-12 rounded-xl focus-visible:ring-primary" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Reddit Profile</Label>
              <Input {...register('personalInfo.reddit')} placeholder="e.g. reddit.com/user/username" className="bg-surface-2 border-none h-12 rounded-xl focus-visible:ring-primary" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">LeetCode Profile</Label>
              <Input {...register('personalInfo.leetcode')} placeholder="e.g. leetcode.com/u/username" className="bg-surface-2 border-none h-12 rounded-xl focus-visible:ring-primary" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Portfolio Website</Label>
              <Input {...register('personalInfo.portfolio')} placeholder="e.g. https://myportfolio.dev" className="bg-surface-2 border-none h-12 rounded-xl focus-visible:ring-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/5 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="font-hanken text-xl flex items-center gap-2">
              <span className="w-1.5 h-6 bg-secondary rounded-full" />
              Professional Summary
            </CardTitle>
            <Button size="sm" variant="outline" type="button" className="text-primary border-primary/30 hover:bg-primary/10 rounded-full h-8 text-[10px] uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> AI Enhance
            </Button>
          </CardHeader>
          <CardContent>
            <textarea
              {...register('summary')}
              className="w-full min-h-[120px] p-4 rounded-xl border-none bg-surface-2 text-text-main focus:ring-2 focus:ring-primary custom-scrollbar resize-y text-sm leading-relaxed"
            ></textarea>
          </CardContent>
        </Card>

        <Card className="border-white/5 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="font-hanken text-xl flex items-center gap-2">
              <span className="w-1.5 h-6 bg-accent rounded-full" />
              Work Experience
            </CardTitle>
            <Button size="sm" type="button" onClick={() => append({ id: Math.random().toString(), company: '', role: '', dates: '', description: '' })} className="rounded-full h-8 text-[10px] uppercase tracking-widest font-bold border-none">
               <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Node
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {fields.map((field, index) => (
              <div key={field.id} className="relative p-6 rounded-2xl border border-white/5 bg-surface/30 group hover:border-primary/30 transition-all">
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-30 cursor-grab transition-opacity">
                  <GripVertical className="w-5 h-5" />
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => remove(index)}
                  className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-surface border border-white/10 text-error hover:text-error hover:bg-error/10 rounded-full h-8 w-8"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Company / Protocol</Label>
                    <Input {...register(`experience.${index}.company` as const)} className="bg-surface-2 border-none h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Tactical Role</Label>
                    <Input {...register(`experience.${index}.role` as const)} className="bg-surface-2 border-none h-11 rounded-xl" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Operational Window</Label>
                    <Input {...register(`experience.${index}.dates` as const)} placeholder="e.g. Jan 2020 - Present" className="bg-surface-2 border-none h-11 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between items-center mb-1">
                     <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Intelligence Logs</Label>
                     <Button size="sm" variant="ghost" type="button" className="h-6 text-[10px] text-primary font-bold uppercase tracking-widest hover:bg-primary/5">
                       <Sparkles className="w-3 h-3 mr-1" /> Optimize Bullets
                     </Button>
                   </div>
                   <textarea
                     {...register(`experience.${index}.description` as const)}
                     className="w-full min-h-[100px] p-4 rounded-xl border-none bg-surface-2 text-text-main focus:ring-2 focus:ring-primary text-sm leading-relaxed custom-scrollbar"
                   ></textarea>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/5 shadow-2xl">
          <CardHeader>
            <CardTitle className="font-hanken text-xl flex items-center gap-2">
              <span className="w-1.5 h-6 bg-success rounded-full" />
              Technical Stack
            </CardTitle>
            <CardDescription className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Comma-separated skills protocol</CardDescription>
          </CardHeader>
          <CardContent>
             <Input {...register('skills')} placeholder="e.g. React, Node.js, Python" className="bg-surface-2 border-none h-14 rounded-xl focus-visible:ring-primary " />
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
