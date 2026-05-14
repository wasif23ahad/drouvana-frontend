'use client';

import React from 'react';
import ChatInterface from '@/components/ai/ChatInterface';
import { Sparkles, ChevronRight, Brain, MessageSquare, Target, Mic } from 'lucide-react';
import Link from 'next/link';

const CAPABILITIES = [
  { icon: MessageSquare, label: 'Interview Prep', desc: 'Practice Q&A for any role' },
  { icon: Target, label: 'Career Strategy', desc: 'Job search planning & advice' },
  { icon: Brain, label: 'Resume Review', desc: 'Tailored improvement tips' },
  { icon: Mic, label: 'Salary Negotiation', desc: 'Scripts & benchmarks' },
];

export default function AssistantPage() {
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center text-xs text-text-muted gap-2 font-jetbrains uppercase tracking-widest mb-2">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Workspace</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-bold">AI Career Coach</span>
          </div>
          <h1 className="text-3xl font-bold font-hanken">AI Career Coach</h1>
          <p className="text-text-sub text-sm">Context-aware career guidance — powered by your live application data.</p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          {CAPABILITIES.map((cap, i) => (
            <div key={i} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-surface-2/50 border border-[var(--color-border-subtle)] min-w-[80px] text-center">
              <cap.icon className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold font-jetbrains text-text-main">{cap.label}</span>
              <span className="text-[9px] text-text-muted leading-tight">{cap.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ChatInterface />
      </div>
    </div>
  );
}
