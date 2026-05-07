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
  Sparkles
} from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Step4HealthScore = () => {
  const { applicationId, healthScore, setHealthScore, reset } = useWorkspaceStore();
  const [loading, setLoading] = useState(!healthScore);

  const fetchScore = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/ai/health-score', { applicationId });
      setHealthScore(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!healthScore) {
      fetchScore();
    }
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] space-y-6">
        <div className="relative">
          <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="text-primary w-8 h-8 animate-pulse" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold">Calculating Match Score</h3>
          <p className="text-muted-foreground text-sm">Simulating ATS evaluation...</p>
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
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-primary/10"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="80"
              stroke="currentColor"
              strokeWidth="12"
              strokeDasharray={2 * Math.PI * 80}
              initial={{ strokeDashoffset: 2 * Math.PI * 80 }}
              animate={{ strokeDashoffset: (2 * Math.PI * 80) * (1 - healthScore.overallScore / 100) }}
              transition={{ duration: 2, ease: "easeOut" }}
              fill="transparent"
              strokeLinecap="round"
              className="text-primary"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-black text-primary">{healthScore.overallScore}%</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Match Score</span>
          </div>
        </div>

        <div className="flex-1 space-y-4 text-center md:text-left">
          <h2 className="text-3xl font-bold tracking-tight">You're looking strong! 🚀</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Your resume has an <strong>{healthScore.atsProbability}%</strong> probability of passing automated screening for this role.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
            <div className="px-4 py-2 bg-success/10 text-success rounded-2xl text-sm font-bold border border-success/20">
              ATS Optimized
            </div>
            <div className="px-4 py-2 bg-amber-500/10 text-amber-600 rounded-2xl text-sm font-bold border border-amber-500/20">
              Keyword Ready
            </div>
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
            {healthScore.strengths.map((s: string, i: number) => (
              <div key={i} className="p-4 rounded-2xl bg-success/5 border border-success/10 text-sm">
                {s}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-amber-500 w-5 h-5" />
            <h4 className="font-bold uppercase tracking-widest text-xs">Missing Skills</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {healthScore.missingSkills.map((s: string, i: number) => (
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
          {healthScore.recommendations.map((r: string, i: number) => (
            <li key={i} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-border/50">
        <Button variant="ghost" onClick={fetchScore} className="rounded-xl gap-2">
          <RefreshCw className="w-4 h-4" /> Recalculate
        </Button>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none rounded-xl" onClick={reset}>
            Start New
          </Button>
          <Button className="flex-1 sm:flex-none rounded-xl bg-primary gap-2 h-12 px-8 shadow-lg shadow-primary/20">
            View Final Resume <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Step4HealthScore;
