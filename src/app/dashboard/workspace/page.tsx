"use client";

import React from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import Step1JobDetails from '@/components/dashboard/workspace/Step1JobDetails';
import Step2JDAnalysis from '@/components/dashboard/workspace/Step2JDAnalysis';
import Step3ResumeGen from '@/components/dashboard/workspace/Step3ResumeGen';
import Step4HealthScore from '@/components/dashboard/workspace/Step4HealthScore';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, title: 'Job Details', description: 'Paste the JD' },
  { id: 2, title: 'AI Analysis', description: 'Extract insights' },
  { id: 3, title: 'Resume Gen', description: 'Tailor content' },
  { id: 4, title: 'Match Score', description: 'ATS check' },
];

const WorkspacePage = () => {
  const { step } = useWorkspaceStore();

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">AI Intelligence Workspace</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our advanced AI analyzes your job description and builds a high-performance, ATS-optimized resume in minutes.
        </p>
      </div>

      {/* Stepper */}
      <div className="flex justify-between items-center relative px-4">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-border/50 -z-10" />
        {STEPS.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-3 bg-background px-4">
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2",
              step > s.id ? "bg-success border-success text-white" :
              step === s.id ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-110" :
              "bg-muted border-border text-muted-foreground"
            )}>
              {step > s.id ? <Check className="w-6 h-6" /> : <span>{s.id}</span>}
            </div>
            <div className="text-center">
              <p className={cn("text-sm font-bold", step === s.id ? "text-primary" : "text-foreground/70")}>{s.title}</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{s.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="glass-card rounded-[40px] p-8 md:p-12 min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
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
