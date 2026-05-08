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
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Step4HealthScore() {
  const { applicationId, healthScore, setHealthScore, reset } = useWorkspaceStore();
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
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8 py-10">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="text-primary w-10 h-10 animate-pulse" />
          </div>
        </div>
        
        <div className="text-center space-y-4 max-w-md">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold">AI Evaluator Thinking...</h3>
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Step {progress < 30 ? '1: Parsing' : progress < 60 ? '2: Analyzing' : '3: Scoring'}</p>
          </div>
          
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <motion.div 
              className="bg-primary h-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs text-left font-mono opacity-40 line-clamp-3 h-16 overflow-hidden italic">
            {streamingText || "Initializing ATS simulation engine..."}
          </div>
        </div>
      </div>
    );
  }

  if (!healthScore) return null;

  return (
    <div className="space-y-12 pb-6">
      {/* Score Header */}
      <div className="flex flex-col md:flex-row items-center gap-12 bg-muted/20 p-10 rounded-[40px] border border-border/50">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-primary/10" />
            <motion.circle
              cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12"
              strokeDasharray={2 * Math.PI * 80}
              initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
              animate={{ strokeDashoffset: (2 * Math.PI * 80) * (1 - (healthScore.overallScore || healthScore.ats_score) / 100) }}
              transition={{ duration: 2, ease: "easeOut" }}
              fill="transparent" strokeLinecap="round" className="text-primary"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-black text-primary">{healthScore.overallScore || healthScore.ats_score}%</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Match Score</span>
          </div>
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight">You're looking strong! 🚀</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Your resume has an <strong>{healthScore.atsProbability || healthScore.ats_score}%</strong> probability of passing automated screening.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
            <div className="px-4 py-2 bg-success/10 text-success rounded-2xl text-sm font-bold border border-success/20">ATS Optimized</div>
            <div className="px-4 py-2 bg-amber-500/10 text-amber-600 rounded-2xl text-sm font-bold border border-amber-500/20">Keyword Ready</div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="text-success w-5 h-5" />
            <h4 className="font-bold uppercase tracking-widest text-xs">Top Strengths</h4>
          </div>
          <div className="space-y-3">
            {(healthScore.strengths || []).map((s: string, i: number) => (
              <div key={i} className="p-4 rounded-2xl bg-success/5 border border-success/10 text-sm">{s}</div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-amber-500 w-5 h-5" />
            <h4 className="font-bold uppercase tracking-widest text-xs">Improvement Areas</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {(healthScore.missingSkills || healthScore.keyword_gap_analysis || []).map((s: string, i: number) => (
              <span key={i} className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-700">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="p-8 bg-primary/5 rounded-[32px] border border-primary/10 space-y-4">
        <div className="flex items-center gap-3">
          <Trophy className="text-primary w-6 h-6" />
          <h4 className="text-xl font-bold">Expert Recommendations</h4>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(healthScore.recommendations || healthScore.prioritized_improvement_suggestions || []).map((r: string | any, i: number) => (
            <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              {typeof r === 'string' ? r : r.suggestion || r.improved}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-border/50">
        <Button variant="ghost" onClick={startStreaming} className="rounded-xl gap-2">
          <RefreshCw className="w-4 h-4" /> Recalculate
        </Button>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none rounded-xl" onClick={reset}>Start New</Button>
          <Button className="flex-1 sm:flex-none rounded-xl bg-primary gap-2 h-12 px-8 shadow-lg shadow-primary/20">
            View Final Resume <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
