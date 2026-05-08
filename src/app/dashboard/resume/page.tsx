'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sparkles, Plus, Trash2, GripVertical, ChevronRight, Download } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import Link from 'next/link';

export default function MasterResumePage() {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      personalInfo: {
        name: 'Alex Rivera',
        email: 'alex.rivera@protocol.io',
        phone: '+1 (555) 123-4567',
        linkedin: 'linkedin.com/in/alexrivera',
      },
      summary: 'Experienced Senior Product Designer with a passion for building intuitive, user-centric SaaS platforms. Proficient in React, Design Systems, and product strategy.',
      experience: [
        { id: '1', company: 'TechFlow Inc.', role: 'Lead UI/UX Designer', dates: '2020 - Present', description: 'Spearheaded the redesign of the core dashboard, improving task completion rates by 25%.' }
      ],
      skills: 'Figma, User Research, Prototyping, Next.js, Tailwind CSS, Product Strategy',
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "experience"
  });

  const onSubmit = (data: any) => {
    console.log(data);
    // Auto-save logic
  };

  return (
    <div className="flex flex-col h-full gap-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center text-xs text-text-muted gap-2 font-jetbrains uppercase tracking-widest mb-2">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Workspace</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-bold">Master Profile</span>
          </div>
          <h1 className="text-3xl font-bold font-hanken">Master Architecture</h1>
          <p className="text-text-sub text-sm">Maintain your foundational professional data for multi-vector optimization.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none rounded-xl gap-2">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
          <Button className="flex-1 sm:flex-none rounded-xl gap-2 shadow-lg shadow-primary/20 border-none">
            <Sparkles className="h-4 w-4" /> Analyze Strength
          </Button>
        </div>
      </div>

      <form onChange={handleSubmit(onSubmit)} className="max-w-4xl space-y-8">
        <Card className="border-white/5 shadow-2xl">
          <CardHeader>
            <CardTitle className="font-hanken text-xl flex items-center gap-2">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Full Identity</Label>
              <Input {...register('personalInfo.name')} className="bg-surface-2 border-none h-12 rounded-xl focus-visible:ring-primary" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Communication Node</Label>
              <Input {...register('personalInfo.email')} className="bg-surface-2 border-none h-12 rounded-xl focus-visible:ring-primary" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">Tactical Phone</Label>
              <Input {...register('personalInfo.phone')} className="bg-surface-2 border-none h-12 rounded-xl focus-visible:ring-primary" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-text-muted font-jetbrains">LinkedIn URL</Label>
              <Input {...register('personalInfo.linkedin')} className="bg-surface-2 border-none h-12 rounded-xl focus-visible:ring-primary" />
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
              className="w-full min-h-[120px] p-4 rounded-xl border-none bg-surface-2 text-text-main focus:ring-2 focus:ring-primary custom-scrollbar resize-y text-sm italic leading-relaxed"
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
                     className="w-full min-h-[100px] p-4 rounded-xl border-none bg-surface-2 text-text-main focus:ring-2 focus:ring-primary text-sm italic leading-relaxed custom-scrollbar"
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
             <Input {...register('skills')} placeholder="e.g. React, Node.js, Python" className="bg-surface-2 border-none h-14 rounded-xl focus-visible:ring-primary italic" />
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
