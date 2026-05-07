"use client";

import React, { useState, useEffect } from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Button } from '@/components/ui/button';
import { Rocket, Loader2, CheckCircle2, Layout } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import Image from 'next/image';

const TEMPLATES = [
  { id: 'classic', name: 'The Executive', image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400' },
  { id: 'modern', name: 'Silicon Valley', image: 'https://images.unsplash.com/photo-1626197031507-c17099753214?w=400' },
];

const Step3ResumeGen = () => {
  const { applicationId, setStep, setResumeData, templateId, setTemplateId } = useWorkspaceStore();
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);

  const startGeneration = async () => {
    if (!templateId) {
      toast.error('Please select a template');
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
      toast.error('Failed to start generation');
      setLoading(false);
    }
  };

  // Polling for job status
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
          toast.success('Resume Generated Successfully!');
          setStep(4);
        } else if (status === 'failed') {
          clearInterval(interval);
          setLoading(false);
          toast.error('Generation failed. Please try again.');
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  return (
    <div className="space-y-10">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">Select Your Template</h3>
        <p className="text-muted-foreground text-sm">Choose the style that best fits your professional brand.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {TEMPLATES.map((tpl) => (
          <div 
            key={tpl.id}
            onClick={() => setTemplateId(tpl.id)}
            className={`group cursor-pointer relative rounded-[32px] overflow-hidden border-4 transition-all duration-300 ${
              templateId === tpl.id ? 'border-primary shadow-2xl scale-105' : 'border-transparent hover:border-primary/20'
            }`}
          >
            <div className="aspect-3/4 relative">
              <Image 
                src={tpl.image} 
                alt={tpl.name} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h4 className="font-bold text-lg">{tpl.name}</h4>
                <p className="text-xs text-white/70">ATS-Optimized Standard</p>
              </div>
            </div>
            {templateId === tpl.id && (
              <div className="absolute top-4 right-4 bg-primary text-white p-2 rounded-full shadow-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-6">
        <Button 
          onClick={startGeneration}
          disabled={loading || !templateId}
          className="w-full max-w-md h-14 rounded-2xl bg-primary text-lg font-bold gap-3 shadow-xl shadow-primary/20"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              AI is writing your resume...
            </>
          ) : (
            <>
              <Rocket className="w-5 h-5" />
              Generate Tailored Resume
            </>
          )}
        </Button>
        {loading && (
          <div className="flex items-center gap-2 text-primary animate-pulse">
            <Layout className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide">Magic is happening in the background</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step3ResumeGen;
