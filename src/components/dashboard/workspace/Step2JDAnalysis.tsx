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
  Info
} from 'lucide-react';

const Step2JDAnalysis = () => {
  const { analysis, setStep } = useWorkspaceStore();

  if (!analysis) return null;

  const sections = [
    { title: 'Core Skills', data: analysis.requiredSkills, icon: Target, color: 'text-primary' },
    { title: 'ATS Keywords', data: analysis.atsKeywords, icon: Zap, color: 'text-amber-500' },
    { title: 'Culture Signals', data: analysis.cultureSignals, icon: BrainCircuit, color: 'text-emerald-500' },
  ];

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4 p-6 bg-primary/5 rounded-3xl border border-primary/10">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="text-primary w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Analysis Result</h3>
          <p className="text-sm text-muted-foreground">{analysis.roleInsights}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sections.map((section, idx) => (
          <motion.div 
            key={section.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <section.icon className={section.color + " w-5 h-5"} />
              <h4 className="font-bold uppercase tracking-wider text-xs">{section.title}</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {section.data.map((item: string, i: number) => (
                <span 
                  key={i} 
                  className="px-3 py-1.5 rounded-xl bg-muted/50 border border-border/50 text-xs font-medium hover:border-primary/30 transition-colors cursor-default"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-6 bg-muted/20 rounded-3xl border border-border/50 space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          <h4 className="font-bold text-sm">Company Summary</h4>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {analysis.companySummary}
        </p>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-border/50">
        <Button variant="ghost" onClick={() => setStep(1)} className="rounded-xl">
          Back to JD
        </Button>
        <Button onClick={() => setStep(3)} className="rounded-xl bg-primary gap-2 h-12 px-8">
          Next: Generate Resume <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Step2JDAnalysis;
