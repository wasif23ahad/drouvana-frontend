"use client";

import React, { useState, useEffect } from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Button } from '@/components/ui/button';
import { Rocket, Loader2, CheckCircle2, Layout, Sparkles } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const TEMPLATES = [
  { id: 'classic', name: 'The Executive', image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80', desc: 'Minimalist high-density architecture.' },
  { id: 'modern', name: 'Silicon Valley', image: 'https://images.unsplash.com/photo-1626197031507-c17099753214?auto=format&fit=crop&q=80', desc: 'Bold visual hierarchy for tech roles.' },
];

const Step3ResumeGen = () => {
  const { applicationId, setStep, setResumeData, templateId, setTemplateId } = useWorkspaceStore();
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  const startGeneration = async () => {
    if (!templateId) {
      toast.error('Selection required: Please choose a design blueprint.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/ai/generate-resume', { 
        applicationId,
        templateId 
      });
      setJobId(res.data.data.jobId);
    } catch (error) {
      console.error(error);
      toast.error('Generation sequence failed. System recalibrating.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!jobId) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`/api/ai/jobs/${jobId}`);
        const { status, result } = res.data.data;

        if (status === 'completed') {
          clearInterval(interval);
          setResumeData(result);
          setLoading(false);
          toast.success('Resume Architecture Optimized');
          setStep(4);
        } else if (status === 'failed') {
          clearInterval(interval);
          setLoading(false);
          toast.error('Optimization failed. Please retry protocol.');
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  return (
    <div className="space-y-16 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <h3 className="text-4xl font-hanken font-bold text-text-main italic tracking-tight">Design Architecture</h3>
        <p className="text-text-sub italic text-lg max-w-xl mx-auto">Choose the structural blueprint for your tailored strategic profile.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {TEMPLATES.map((tpl) => (
          <div 
            key={tpl.id}
            onClick={() => setTemplateId(tpl.id)}
            className={cn(
              "group cursor-pointer relative rounded-[3rem] overflow-hidden border-4 transition-all duration-700 bg-surface shadow-2xl",
              templateId === tpl.id ? "border-primary scale-[1.02] shadow-primary/20" : "border-white/5 hover:border-primary/30"
            )}
          >
            <div className="aspect-3/4 relative">
              <img 
                src={tpl.image} 
                alt={tpl.name} 
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-1000 opacity-60 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-linear-to-t from-bg-base/90 via-bg-base/20 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 space-y-2">
                <h4 className="font-hanken font-bold text-2xl text-text-main italic tracking-tight">{tpl.name}</h4>
                <p className="font-jetbrains text-[9px] uppercase tracking-[0.2em] text-primary font-black">{tpl.desc}</p>
              </div>
            </div>
            {templateId === tpl.id && (
              <div className="absolute top-6 right-6 bg-primary text-white w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xl animate-in zoom-in duration-300">
                <CheckCircle2 className="w-6 h-6 stroke-3" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-8 pt-8">
        <Button 
          onClick={startGeneration}
          disabled={loading || !templateId}
          className="w-full max-w-lg h-16 rounded-4xl bg-primary text-white text-lg font-hanken font-bold italic gap-4 shadow-2xl shadow-primary/20 border-none transition-all hover:scale-[1.02] active:scale-95 group"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="animate-pulse">AI Optimization Protocol Active...</span>
            </div>
          ) : (
            <>
              <Rocket className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Initialize High-Impact Generation
            </>
          )}
        </Button>
        
        {loading && (
          <div className="flex items-center gap-3 text-secondary animate-pulse font-jetbrains text-[10px] uppercase tracking-[0.3em] font-black">
            <Sparkles className="w-4 h-4" />
            Injecting semantic alignment layers
          </div>
        )}
      </div>
    </div>
  );
};

export default Step3ResumeGen;
