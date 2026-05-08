"use client";

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  User as UserIcon,
  Search,
  Settings,
  ChevronRight,
  GripVertical,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function MasterResumePage() {
  const [activeTemplate, setActiveTemplate] = useState('modern');

  return (
    <div className="max-w-spacing-container-max mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Breadcrumbs & Header */}
      <div className="space-y-4">
        <div className="flex items-center text-xs text-on-surface-variant gap-2 font-mono uppercase tracking-widest">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Workspace</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary font-bold">Master Profile</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-heading font-bold text-on-surface italic tracking-tight flex items-center gap-4">
              Master Architecture
              <span className="bg-primary/10 text-primary text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1 rounded-full border border-primary/20">Source Node</span>
            </h1>
            <p className="font-sans text-on-surface-variant italic">Maintain your foundational professional data for multi-vector optimization.</p>
          </div>
          <div className="flex gap-4">
             <Button variant="outline" className="rounded-2xl border-secondary/20 text-secondary hover:bg-secondary/5 font-heading font-bold italic gap-2 h-12 shadow-lg">
               <Download className="w-4 h-4" /> Download PDF
             </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-280px)]">
        {/* Editor Side */}
        <div className="lg:col-span-8 overflow-y-auto pr-4 scrollbar-hide space-y-8">
          
          {/* Section: Personal Intelligence */}
          <div className="bg-surface-container-low/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 relative group shadow-2xl">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-20 cursor-grab transition-opacity">
              <GripVertical className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-xl text-primary italic mb-8 flex items-center gap-3">
              <UserIcon className="w-6 h-6" /> Personal Identity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-on-surface-variant font-black px-1">Full Identity</label>
                <Input defaultValue="Alex Rivera" className="bg-surface-container border-white/5 h-14 rounded-2xl text-on-surface focus:border-primary transition-all shadow-xl" />
              </div>
              <div className="space-y-3">
                <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-on-surface-variant font-black px-1">Tactical Title</label>
                <Input defaultValue="Senior Product Designer" className="bg-surface-container border-white/5 h-14 rounded-2xl text-on-surface focus:border-primary transition-all shadow-xl" />
              </div>
              <div className="space-y-3">
                <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-on-surface-variant font-black px-1">Communication Node</label>
                <Input defaultValue="alex.rivera@protocol.io" className="bg-surface-container border-white/5 h-14 rounded-2xl text-on-surface focus:border-primary transition-all shadow-xl" />
              </div>
              <div className="space-y-3">
                <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-on-surface-variant font-black px-1">Geographic Sector</label>
                <Input defaultValue="San Francisco, CA" className="bg-surface-container border-white/5 h-14 rounded-2xl text-on-surface focus:border-primary transition-all shadow-xl" />
              </div>
            </div>
          </div>

          {/* Section: Strategic Summary */}
          <div className="bg-surface-container-low/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 relative group shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-heading font-bold text-xl text-primary italic flex items-center gap-3">
                <FileText className="w-6 h-6" /> Executive Summary
              </h3>
              <Button size="sm" className="bg-primary/10 text-primary border border-primary/20 rounded-xl font-heading font-bold italic gap-2 hover:bg-primary/20">
                <Sparkles className="w-4 h-4" /> AI Enhance
              </Button>
            </div>
            <textarea 
              rows={5}
              className="w-full bg-surface-container border border-white/5 rounded-2xl p-6 text-on-surface-variant italic font-sans leading-relaxed focus:border-primary outline-none transition-all shadow-xl resize-none"
              defaultValue="Innovative Senior Product Designer with 8+ years of experience crafting intuitive, user-centric SaaS platforms. Proven track record of increasing user engagement by 40% through data-driven design methodologies."
            />
          </div>

          {/* Section: Professional Experience */}
          <div className="bg-surface-container-low/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 relative group shadow-2xl">
            <h3 className="font-heading font-bold text-xl text-primary italic mb-8 flex items-center gap-3">
              <Briefcase className="w-6 h-6" /> Experience Nodes
            </h3>
            
            <div className="space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-surface-container/40 p-8 rounded-[2rem] border border-white/5 relative group/card hover:border-primary/30 transition-all shadow-lg">
                  <div className="absolute right-6 top-6 flex gap-3 opacity-0 group-hover/card:opacity-100 transition-opacity">
                    <button className="text-on-surface-variant hover:text-primary transition-colors"><Edit3 className="w-4 h-4" /></button>
                    <button className="text-on-surface-variant hover:text-error transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <h4 className="text-xl font-heading font-bold text-on-surface italic">Lead UI/UX Designer</h4>
                      <p className="font-sans text-sm text-on-surface-variant italic opacity-60">TechFlow Inc. • New York, NY</p>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-secondary font-black">2020 — PRESENT</span>
                  </div>
                  <ul className="space-y-3 font-sans text-sm text-on-surface-variant leading-relaxed italic">
                    <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> Spearheaded the redesign of the core dashboard, improving task completion rates by 25%.</li>
                    <li className="flex gap-3"><span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> Managed a team of 4 designers, implementing a unified design system.</li>
                  </ul>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full h-16 rounded-[2rem] border-dashed border-white/10 bg-transparent hover:bg-white/5 hover:border-primary/50 text-on-surface-variant font-heading font-bold italic mt-8 gap-2 shadow-inner">
              <Plus className="w-5 h-5" /> Integrate Experience Block
            </Button>
          </div>

          {/* Section: Skills Protocol */}
          <div className="bg-surface-container-low/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 relative group shadow-2xl">
             <h3 className="font-heading font-bold text-xl text-primary italic mb-8 flex items-center gap-3">
              <Wrench className="w-6 h-6" /> Skills Protocol
            </h3>
            <div className="flex flex-wrap gap-3">
              {['Figma', 'User Research', 'Prototyping', 'Next.js', 'Tailwind CSS'].map(skill => (
                <Badge key={skill} className="bg-surface-container border-white/5 px-4 py-2 rounded-xl text-on-surface-variant hover:border-primary transition-all cursor-default shadow-md group">
                  {skill}
                  <X className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 text-error cursor-pointer transition-opacity" />
                </Badge>
              ))}
              <Badge variant="outline" className="border-dashed border-white/20 bg-transparent px-4 py-2 rounded-xl text-primary font-bold cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                <Plus className="w-3 h-3 mr-2" /> Inject Skill
              </Badge>
            </div>
          </div>
        </div>

        {/* Configuration Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold px-2">Global Config</h3>
          
          <div className="bg-surface-container-low/50 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 space-y-10 shadow-2xl">
            {/* Tailor Input */}
            <div className="space-y-4">
               <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-secondary font-black px-1 flex items-center gap-2">
                 <Sparkles className="w-3 h-3" /> Initialize Tailoring
               </label>
               <div className="bg-surface-container border border-white/5 rounded-2xl p-1 flex shadow-inner">
                 <Input className="bg-transparent border-none text-sm focus:ring-0 italic" placeholder="Paste JD Protocol..." />
                 <Button className="bg-primary/20 text-primary w-12 h-12 rounded-xl hover:bg-primary/30 p-0 border border-primary/20">
                   <Search className="w-5 h-5" />
                 </Button>
               </div>
            </div>

            {/* Template Selector */}
            <div className="space-y-6">
               <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary font-black px-1">Structural Blueprint</label>
               <div className="grid grid-cols-2 gap-4">
                 {[
                   { id: 'modern', name: 'Nocturnal', color: 'bg-primary/10 border-primary' },
                   { id: 'classic', name: 'Executive', color: 'bg-white/5 border-white/10' },
                   { id: 'compact', name: 'Vector', color: 'bg-white/5 border-white/10' },
                   { id: 'bold', name: 'Architect', color: 'bg-white/5 border-white/10' },
                 ].map((tpl) => (
                   <button 
                     key={tpl.id}
                     onClick={() => setActiveTemplate(tpl.id)}
                     className={cn(
                       "p-4 rounded-2xl border transition-all space-y-3 shadow-lg",
                       activeTemplate === tpl.id ? "border-primary bg-primary/5 shadow-primary/10" : "border-white/5 bg-surface-container-low hover:border-white/20"
                     )}
                   >
                     <div className="w-full h-20 bg-surface rounded-lg border border-white/5 shadow-inner" />
                     <p className={cn("font-mono text-[9px] uppercase tracking-widest", activeTemplate === tpl.id ? "text-primary font-bold" : "text-on-surface-variant/40")}>{tpl.name}</p>
                   </button>
                 ))}
               </div>
            </div>

            {/* Global Settings */}
            <div className="space-y-6 pt-4 border-t border-white/5">
               <label className="font-mono text-[9px] uppercase tracking-[0.2em] text-on-surface-variant font-black px-1 flex items-center gap-2">
                 <Settings className="w-3 h-3" /> System Parameters
               </label>
               <div className="space-y-4">
                 {[
                   { label: 'Profile Visualization', active: true },
                   { label: 'Keyword Density Heatmap', active: false },
                   { label: 'Match Confidence Level', active: true },
                 ].map((s) => (
                   <div key={s.label} className="flex justify-between items-center group cursor-pointer">
                      <span className="text-sm font-sans text-on-surface-variant italic group-hover:text-on-surface transition-colors">{s.label}</span>
                      <div className={cn(
                        "w-10 h-5 rounded-full transition-colors relative",
                        s.active ? "bg-primary" : "bg-white/10"
                      )}>
                        <div className={cn(
                          "absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-md",
                          s.active ? "right-1" : "left-1"
                        )} />
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
