"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, AlertCircle, CheckCircle, ArrowRight, Activity, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';

interface HealthInsight {
  icon: string;
  title: string;
  description: string;
  action_link?: string;
}

interface PipelineHealth {
  health_score: number;
  summary: string;
  insights: HealthInsight[];
  action_items: string[];
  positive_signals: string[];
}

export default function PipelineHealthCard() {
  const { status } = useSession();
  const [data, setData] = useState<PipelineHealth | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/ai/pipeline-health');
      setData(res.data.data);
    } catch (error) {
      console.error('Pipeline Health Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      setLoading(false);
      return;
    }
    if (status === 'authenticated') {
      fetchHealth();
    }
  }, [status]);

  if (loading) {
    return (
      <div className="glass-card rounded-[32px] p-8 h-full flex flex-col items-center justify-center space-y-4 min-h-[300px]">
        <div className="relative">
          <Activity className="w-12 h-12 text-primary/20 animate-pulse" />
          <Loader2 className="absolute inset-0 w-12 h-12 text-primary animate-spin" />
        </div>
        <p className="text-sm font-bold uppercase tracking-widest text-white/40">AI Analyzing Pipeline...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="glass-card rounded-[32px] overflow-hidden border-primary/20 bg-primary/5 flex flex-col md:flex-row h-full">
      {/* Left Score Side */}
      <div className="p-8 md:w-1/3 flex flex-col items-center justify-center text-center space-y-4 border-b md:border-b-0 md:border-r border-primary/10">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-primary/10" />
            <motion.circle
              cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8"
              strokeDasharray={2 * Math.PI * 56}
              initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
              animate={{ strokeDashoffset: (2 * Math.PI * 56) * (1 - data.health_score / 100) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              fill="transparent" strokeLinecap="round" className="text-primary"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-black text-primary">{data.health_score}</span>
            <span className="text-[8px] uppercase tracking-widest font-bold text-muted-foreground">Health</span>
          </div>
        </div>
        <div>
          <h4 className="font-bold">Pipeline Health</h4>
          <p className="text-xs text-white/60 leading-relaxed">{data.summary}</p>
        </div>
      </div>

      {/* Right Insights Side */}
      <div className="p-8 flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h5 className="text-[10px] uppercase tracking-widest font-bold text-primary flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            AI Insights
          </h5>
          <div className="space-y-3">
            {data.insights.map((insight, i) => (
              <div key={i} className="flex gap-3 group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-primary/40 transition-colors">
                  <Activity className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold group-hover:text-primary transition-colors">{insight.title}</p>
                  <p className="text-[11px] text-white/50 leading-relaxed">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h5 className="text-[10px] uppercase tracking-widest font-bold text-success flex items-center gap-2">
            <TrendingUp className="w-3 h-3" />
            Next Actions
          </h5>
          <div className="space-y-2">
            {data.action_items.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-white/70 bg-white/5 p-2 rounded-xl border border-transparent hover:border-white/10 transition-all">
                <div className="w-1.5 h-1.5 rounded-full bg-success" />
                <span className="flex-1">{item}</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
