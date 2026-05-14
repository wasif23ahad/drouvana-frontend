"use client";

import React, { useState } from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Rocket, Sparkles, Building2, Briefcase, FileText } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

const Step1JobDetails = () => {
  const { jdText, setJdText, setStep, setAnalysis, setApplicationId } = useWorkspaceStore();
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');

  const handleAnalyze = async () => {
    if (!jdText || !company || !title) {
      toast.error('Strategic parameters incomplete. Please provide all data points.');
      return;
    }

    setLoading(true);
    try {
      const appRes = await api.post('/api/applications', {
        company,
        jobTitle: title,
        jobDescription: jdText,
        status: 'SAVED'
      });
      
      const appId = appRes.data.data.id;
      setApplicationId(appId);

      const res = await api.post('/api/ai/parse-jd', { 
        jd: jdText,
        applicationId: appId
      });
      
      setAnalysis(res.data.data);
      setStep(2);
      toast.success('AI Semantic Extraction Complete');
    } catch (error) {
      console.error(error);
      toast.error('Neural parsing failed. Please verify JD connectivity.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-hanken font-bold text-text-main tracking-tight">Mission Parameters</h2>
        <p className="text-text-sub ">Define the target organization and role specifications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="font-jetbrains text-[10px] uppercase tracking-[0.3em] text-primary font-bold px-1">Target Organization</label>
          <div className="relative group">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="e.g. Vercel" 
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="pl-12 bg-surface-2 border-none h-14 rounded-xl text-text-main focus:border-primary transition-all shadow-xl"
            />
          </div>
        </div>
        <div className="space-y-3">
          <label className="font-jetbrains text-[10px] uppercase tracking-[0.3em] text-primary font-bold px-1">Strategic Position</label>
          <div className="relative group">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="e.g. Staff Design Engineer" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="pl-12 bg-surface-2 border-none h-14 rounded-xl text-text-main focus:border-primary transition-all shadow-xl"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="font-jetbrains text-[10px] uppercase tracking-[0.3em] text-primary font-bold px-1 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Raw Job Description
        </label>
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/5 rounded-4xl blur-2xl group-focus-within:bg-primary/10 transition-colors pointer-events-none" />
          <textarea
            className="w-full h-80 p-8 rounded-4xl bg-surface-2 border border-[var(--color-border-subtle)] focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none text-text-sub leading-relaxed relative z-10 "
            placeholder="Initialize semantic intake: paste the job description protocol here..."
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
          />
        </div>
      </div>

      <div className="pt-4">
        <Button 
          onClick={handleAnalyze} 
          disabled={loading}
          className="w-full h-16 rounded-4xl text-white shadow-2xl shadow-primary/20 text-lg font-hanken font-bold gap-4 border-none transition-all hover:scale-[1.02] active:scale-95 group"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="animate-pulse">Neural Parsing In Progress...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Execute AI Strategy Analysis
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Step1JobDetails;
