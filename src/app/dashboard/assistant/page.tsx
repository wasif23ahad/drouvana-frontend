"use client";

import React from 'react';
import ChatInterface from '@/components/ai/ChatInterface';
import { Sparkles, Target, Zap, ChevronRight, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function AssistantPage() {
  return (
    <div className="max-w-spacing-container-max mx-auto space-y-8 pb-10 animate-in fade-in duration-700">
      {/* Breadcrumbs & Header */}
      <div className="space-y-4">
        <div className="flex items-center text-xs text-on-surface-variant gap-2 font-mono uppercase tracking-widest">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Workspace</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary font-bold">AI Assistant</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-heading font-bold text-on-surface italic tracking-tight flex items-center gap-4">
              Career Strategist
              <span className="bg-primary/10 text-primary text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1 rounded-full border border-primary/20">Active Node</span>
            </h1>
            <p className="font-sans text-on-surface-variant italic">Augmenting your job search with deep matching intelligence.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chat area */}
        <div className="lg:col-span-8">
          <ChatInterface />
        </div>

        {/* Strategic Context Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold px-2">Current Context</h3>
          
          <div className="bg-surface-container-low rounded-[32px] p-8 border border-white/10 relative overflow-hidden group shadow-xl">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
              <Zap className="w-24 h-24 text-primary" />
            </div>
            <h4 className="font-heading font-bold text-lg text-on-surface italic mb-1">Target ATS Score</h4>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-heading font-bold text-primary italic">85</span>
              <span className="text-on-surface-variant font-mono text-sm">%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 mb-4 overflow-hidden">
              <div className="bg-gradient-primary h-full rounded-full" style={{ width: '85%' }} />
            </div>
            <p className="font-mono text-[9px] text-on-surface-variant uppercase tracking-widest">Calculated from 3 master profiles</p>
          </div>

          <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold px-2 pt-4">Strategic Activity</h3>
          
          <div className="space-y-4">
            {[
              { role: 'Senior UX Designer', company: 'Spotify', loc: 'Remote', status: 'Applied', color: 'secondary' },
              { role: 'Product Designer', company: 'Stripe', loc: 'San Francisco', status: 'Interviewing', color: 'primary' },
            ].map((activity, i) => (
              <div key={i} className="bg-surface-container-low p-5 rounded-2xl border border-white/5 hover:border-primary/30 transition-all cursor-pointer group shadow-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-0.5">
                    <h5 className="font-heading font-bold text-on-surface italic group-hover:text-primary transition-colors">{activity.role}</h5>
                    <p className="font-sans text-xs text-on-surface-variant">{activity.company} • {activity.loc}</p>
                  </div>
                  <span className={cn(
                    "px-2.5 py-1 rounded-lg font-mono text-[9px] uppercase tracking-widest font-black border",
                    activity.color === 'primary' ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary/10 text-secondary border-secondary/20"
                  )}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6">
            <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 bg-surface-container-low hover:bg-white/5 text-on-surface font-heading font-bold italic shadow-lg">
              Refresh Knowledge Base
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
