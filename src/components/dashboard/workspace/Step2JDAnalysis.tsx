"use client";

import React from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Zap, 
  BrainCircuit, 
  ShieldCheck, 
  Target,
  ArrowRight,
  Info,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Step2JDAnalysis = () => {
  const { analysis, setStep } = useWorkspaceStore();

  if (!analysis) return null;

  const sections = [
    { title: 'Core Capabilities', data: analysis.requiredSkills || [], icon: Target, color: 'text-primary' },
    { title: 'ATS Vector Points', data: analysis.atsKeywords || [], icon: Zap, color: 'text-secondary' },
    { title: 'Cultural Archetype', data: analysis.cultureSignals || [], icon: BrainCircuit, color: 'text-tertiary' },
  ];

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Neural Insight Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 p-10 bg-surface-container-high/50 rounded-[2.5rem] border border-white/5 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none"></div>
        <div className="w-20 h-20 rounded-3xl bg-primary/20 flex items-center justify-center shrink-0 border border-primary/20">
          <ShieldCheck className="text-primary w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="font-heading font-bold text-2xl text-on-surface italic tracking-tight">Semantic Extraction Result</h3>
          <p className="font-sans text-on-surface-variant leading-relaxed italic">{analysis.roleInsights}</p>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {sections.map((section, idx) => (
          <motion.div 
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <section.icon className={cn("w-5 h-5", section.color)} />
              <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-on-surface-variant font-bold">{section.title}</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {section.data.map((item: string, i: number) => (
                <span 
                  key={i} 
                  className="px-4 py-2 rounded-xl bg-surface-container border border-white/5 text-xs font-mono text-on-surface-variant hover:border-primary/50 hover:text-on-surface transition-all cursor-default shadow-md"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Intelligence Summary */}
      <div className="p-10 bg-surface-container-low rounded-[2.5rem] border border-white/5 space-y-4 relative overflow-hidden shadow-xl">
        <div className="flex items-center gap-3">
          <Info className="w-5 h-5 text-primary" />
          <h4 className="font-heading font-bold text-lg text-on-surface italic tracking-tight">Organization Profile Summary</h4>
        </div>
        <p className="font-sans text-on-surface-variant leading-relaxed italic text-lg">
          {analysis.companySummary}
        </p>
      </div>

      {/* Navigation Loop */}
      <div className="flex flex-col sm:flex-row justify-between items-center pt-10 border-t border-white/5 gap-6">
        <Button 
          variant="outline" 
          onClick={() => setStep(1)} 
          className="rounded-2xl h-14 px-8 border-white/10 bg-surface-container-low hover:bg-white/5 text-on-surface font-heading font-bold italic shadow-lg gap-2"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Parameters
        </Button>
        <Button 
          onClick={() => setStep(3)} 
          className="rounded-2xl bg-gradient-primary text-white gap-3 h-16 px-10 font-heading font-bold italic text-lg shadow-2xl shadow-primary/20 border-none transition-all hover:scale-[1.02] active:scale-95 group"
        >
          Next: Optimization Protocol <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default Step2JDAnalysis;
