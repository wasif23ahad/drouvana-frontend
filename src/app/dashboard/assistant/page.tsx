"use client";

import React from 'react';
import ChatInterface from '@/components/ai/ChatInterface';
import { Sparkles, Target, Zap, TrendingUp } from 'lucide-react';

const STATS = [
  { label: 'Applications', value: '47', icon: Target, color: 'text-sky-400' },
  { label: 'Avg ATS Score', value: '72%', icon: Zap, color: 'text-amber-400' },
  { label: 'Active Interviews', value: '3', icon: TrendingUp, color: 'text-emerald-400' },
];

export default function AssistantPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            AI Assistant
            <span className="bg-primary/10 text-primary text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md border border-primary/20">Beta</span>
          </h1>
          <p className="text-muted-foreground">Your personal job search strategist and career coach.</p>
        </div>

        <div className="flex gap-4">
          {STATS.map(s => (
            <div key={s.label} className="glass-card px-4 py-2 rounded-2xl flex items-center gap-3 border-white/5 bg-white/5">
              <div className={`${s.color} bg-white/5 p-2 rounded-xl`}>
                <s.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{s.label}</p>
                <p className="font-bold">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chat area */}
        <div className="lg:col-span-2">
          <ChatInterface />
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-[32px] border-primary/20 bg-primary/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Sparkles className="w-20 h-20 text-primary" />
            </div>
            <h4 className="font-bold text-lg mb-2 relative z-10">AI Insights</h4>
            <p className="text-sm text-white/70 leading-relaxed relative z-10">
              Your response rate has increased by <span className="text-success font-bold">12%</span> since you started using tailored resumes. Focus on <span className="text-primary font-bold">Backend</span> roles for the highest match probability.
            </p>
            <button className="mt-4 text-[10px] uppercase tracking-widest font-bold text-primary hover:underline">
              Analyze Pipeline →
            </button>
          </div>

          <div className="glass-card p-6 rounded-[32px] border-white/5 bg-white/5 space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-white/40">Suggested Tasks</h4>
            <div className="space-y-3">
              {[
                "Follow up with Google (Applied 7 days ago)",
                "Optimize summary for Frontend role at Meta",
                "Prepare for Stripe interview on Friday"
              ].map((task, i) => (
                <div key={i} className="flex gap-3 text-sm group cursor-pointer hover:bg-white/5 p-2 -m-2 rounded-xl transition-colors">
                  <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-[10px] font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                    {i+1}
                  </div>
                  <span className="text-white/80 group-hover:text-white transition-colors">{task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
