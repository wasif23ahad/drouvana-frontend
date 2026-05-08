"use client";

import React, { useEffect, useState } from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  RefreshCw,
  Sparkles,
  Loader2,
  Zap,
  Target,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Step4HealthScore() {
  const { applicationId, healthScore, setHealthScore, reset, setStep } = useWorkspaceStore();
  const [loading, setLoading] = useState(!healthScore);
  const [streamingText, setStreamingText] = useState('');
  const [progress, setProgress] = useState(0);

  const startStreaming = async () => {
    setLoading(true);
    setStreamingText('');
    setProgress(0);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/analyze-resume/sse/${applicationId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to connect to AI');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'delta') {
              fullContent += data.content;
              setStreamingText(fullContent);
              setProgress(prev => Math.min(prev + 1, 95));
            } else if (data.type === 'complete') {
              try {
                const result = JSON.parse(data.fullContent);
                setHealthScore(result);
                setLoading(false);
              } catch (e) {
                console.error('Error parsing final JSON', e);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming Error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!healthScore) {
      startStreaming();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-12 py-10 animate-in fade-in duration-700">
        <div className="relative group">
          <div className="w-40 h-40 border-4 border-primary/10 border-t-primary rounded-full animate-spin transition-all" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Target className="text-primary w-12 h-12 animate-pulse" />
          </div>
          <div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl -z-10 animate-pulse" />
        </div>
        
        <div className="text-center space-y-6 max-w-lg">
          <div className="space-y-2">
            <h3 className="text-3xl font-heading font-bold text-on-surface italic tracking-tight">Neural Verification...</h3>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary font-black animate-pulse">
              PROTOCOL {progress < 30 ? '01: SEMANTIC_PARSING' : progress < 60 ? '02: VECTOR_ALIGNMENT' : '03: ATS_SIMULATION'}
            </p>
          </div>
          
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden shadow-inner">
            <motion.div 
              className="bg-gradient-primary h-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="p-8 bg-surface-container rounded-[2rem] border border-white/5 text-[11px] text-left font-mono text-on-surface-variant/40 line-clamp-3 h-24 overflow-hidden italic shadow-lg">
            {streamingText || "Initializing ATS simulation engine: loading vector space..."}
          </div>
        </div>
      </div>
    );
  }

  if (!healthScore) return null;

  const score = healthScore.overallScore || healthScore.ats_score || 0;

  return (
    <div className="space-y-16 max-w-5xl mx-auto animate-in slide-in-from-bottom-10 duration-700">
      {/* Score Header */}
      <div className="flex flex-col md:flex-row items-center gap-12 bg-surface-container-high/50 p-12 rounded-[3rem] border border-white/5 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none -z-10" />
        
        <div className="relative w-56 h-56 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-white/5" />
            <motion.circle
              cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="10"
              strokeDasharray={2 * Math.PI * 100}
              initial={{ strokeDashoffset: 2 * Math.PI * 100 }}
              animate={{ strokeDashoffset: (2 * Math.PI * 100) * (1 - score / 100) }}
              transition={{ duration: 2, ease: "easeOut" }}
              fill="transparent" strokeLinecap="round" className="text-primary drop-shadow-[0_0_10px_rgba(192,193,255,0.3)]"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-6xl font-heading font-bold text-on-surface italic tracking-tighter">{score}%</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-black text-on-surface-variant">Strategic Match</span>
          </div>
        </div>

        <div className="flex-1 space-y-6 text-center md:text-left">
          <div className="space-y-2">
            <h2 className="text-4xl font-heading font-bold text-on-surface italic tracking-tight leading-tight">Optimization Success 🚀</h2>
            <p className="font-sans text-on-surface-variant text-lg leading-relaxed italic">
              Your architectural profile demonstrates a <strong>{score}%</strong> probability of bypass-success through automated verification layers.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <div className="px-5 py-2 bg-primary/10 text-primary rounded-xl font-mono text-[10px] uppercase tracking-widest font-black border border-primary/20">Vector Aligned</div>
            <div className="px-5 py-2 bg-secondary/10 text-secondary rounded-xl font-mono text-[10px] uppercase tracking-widest font-black border border-secondary/20">Keywords Injected</div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <CheckCircle2 className="text-primary w-5 h-5" />
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Strategic Strengths</h4>
          </div>
          <div className="space-y-4">
            {(healthScore.strengths || []).map((s: string, i: number) => (
              <div key={i} className="p-6 rounded-[2rem] bg-surface-container-low border border-white/5 font-sans italic text-on-surface-variant text-sm shadow-lg">
                {s}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <AlertTriangle className="text-secondary w-5 h-5" />
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">Potential Friction Points</h4>
          </div>
          <div className="flex flex-wrap gap-3">
            {(healthScore.missingSkills || healthScore.keyword_gap_analysis || []).map((s: string, i: number) => (
              <span key={i} className="px-5 py-2.5 rounded-2xl bg-secondary/10 border border-secondary/20 font-mono text-[10px] text-secondary uppercase tracking-widest font-black shadow-md">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-10 bg-surface-container-low rounded-[3rem] border border-white/5 space-y-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-[60px] pointer-events-none" />
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Trophy className="text-primary w-6 h-6" />
          </div>
          <h4 className="text-2xl font-heading font-bold text-on-surface italic tracking-tight">Tactical Refinements</h4>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {(healthScore.recommendations || healthScore.prioritized_improvement_suggestions || []).map((r: string | any, i: number) => (
            <li key={i} className="flex gap-4 font-sans text-on-surface-variant leading-relaxed italic text-sm">
              <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0 shadow-[0_0_8px_rgba(192,193,255,0.5)]" />
              {typeof r === 'string' ? r : r.suggestion || r.improved}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-10 border-t border-white/5">
        <Button 
          variant="outline" 
          onClick={startStreaming} 
          className="rounded-2xl h-14 px-8 border-white/10 bg-surface-container-low hover:bg-white/5 text-on-surface font-heading font-bold italic shadow-lg gap-3"
        >
          <RefreshCw className="w-4 h-4" /> Re-execute Verification
        </Button>
        <div className="flex gap-4 w-full sm:w-auto">
          <Button 
            variant="outline" 
            className="flex-1 sm:flex-none rounded-2xl h-14 px-8 border-white/10 bg-surface-container-low text-on-surface font-heading font-bold italic" 
            onClick={() => setStep(1)}
          >
            Adjust Target
          </Button>
          <Button className="flex-1 sm:flex-none rounded-[1.5rem] bg-gradient-primary text-white gap-3 h-16 px-10 font-heading font-bold italic text-lg shadow-2xl shadow-primary/20 border-none transition-all hover:scale-[1.02] active:scale-95 group">
            Final Preview Protocol <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
