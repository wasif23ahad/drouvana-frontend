"use client";

import React, { Suspense } from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Zap, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Lazy-loaded AI step components — heavy AI logic deferred until needed
const StepSkeleton = () => (
  <div className="glass-card rounded-3xl p-8 animate-pulse space-y-4">
    <div className="h-6 bg-surface-2 rounded-xl w-1/3" />
    <div className="h-4 bg-surface-2 rounded-xl w-2/3" />
    <div className="h-32 bg-surface-2 rounded-xl" />
    <div className="h-11 bg-primary/20 rounded-xl" />
  </div>
);

const Step1JobDetails = dynamic(() => import('@/components/dashboard/workspace/Step1JobDetails'), {
  loading: () => <StepSkeleton />, ssr: false,
});
const Step2JDAnalysis = dynamic(() => import('@/components/dashboard/workspace/Step2JDAnalysis'), {
  loading: () => <StepSkeleton />, ssr: false,
});
const Step3ResumeGen = dynamic(() => import('@/components/dashboard/workspace/Step3ResumeGen'), {
  loading: () => <StepSkeleton />, ssr: false,
});
const Step4HealthScore = dynamic(() => import('@/components/dashboard/workspace/Step4HealthScore'), {
  loading: () => <StepSkeleton />, ssr: false,
});

const STEPS = [
  { id: 1, title: 'Job Target', description: 'JD Acquisition' },
  { id: 2, title: 'AI Extraction', description: 'Requirement Mapping' },
  { id: 3, title: 'Optimization', description: 'Strategic Tailoring' },
  { id: 4, title: 'Verification', description: 'ATS Score Loop' },
];

const WorkspacePage = () => {
  const { step } = useWorkspaceStore();

  return (
    <div className="max-w-spacing-container-max mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Breadcrumbs & Header */}
      <div className="space-y-4">
        <div className="flex items-center text-xs text-text-muted gap-2 font-jetbrains uppercase tracking-widest">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Workspace</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary font-bold">Optimization Protocol</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold font-hanken text-text-main tracking-tight flex items-center gap-4">
              Intelligence Workspace
              <span className="bg-primary/10 text-primary text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1 rounded-full border border-primary/20">v4.2 Tactical</span>
            </h1>
            <p className="text-text-sub ">Augmenting resume architecture through high-fidelity AI alignment.</p>
          </div>
        </div>
      </div>

      {/* Modern Stepper */}
      <div className="bg-surface/50 backdrop-blur-xl border border-white/5 rounded-4xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl pointer-events-none -z-10" />
        <div className="flex justify-between items-center relative px-4">
          <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-0.5 bg-white/5 -z-10" />
          {STEPS.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-4 relative">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 border-2 relative z-10",
                step > s.id ? "bg-secondary border-secondary text-white shadow-lg shadow-secondary/20" :
                step === s.id ? "bg-primary border-primary text-white shadow-xl shadow-primary/30 scale-110" :
                "bg-surface-2 border-white/5 text-text-muted/40"
              )}>
                {step > s.id ? <Check className="w-6 h-6 stroke-3" /> : <span className="font-hanken font-bold text-lg">{s.id}</span>}
                {step === s.id && (
                   <div className="absolute -inset-2 bg-primary/20 rounded-2xl blur-lg animate-pulse -z-10" />
                )}
              </div>
              <div className="text-center space-y-1">
                <p className={cn("text-sm font-hanken font-bold tracking-tight", step === s.id ? "text-text-main" : "text-text-muted/60")}>{s.title}</p>
                <p className="font-jetbrains text-[8px] uppercase tracking-[0.2em] text-text-muted/40 font-black">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface/50 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-10 md:p-16 min-h-[600px] shadow-2xl relative">
        <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent pointer-events-none" />
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full"
          >
            {step === 1 && <Step1JobDetails />}
            {step === 2 && <Step2JDAnalysis />}
            {step === 3 && <Step3ResumeGen />}
            {step === 4 && <Step4HealthScore />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WorkspacePage;
