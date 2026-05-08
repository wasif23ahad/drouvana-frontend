"use client";

import React, { useState } from 'react';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Rocket, Sparkles } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const Step1JobDetails = () => {
  const { jdText, setJdText, setStep, setAnalysis, setApplicationId } = useWorkspaceStore();
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');

  const handleAnalyze = async () => {
    if (!jdText || !company || !title) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Application first
      const appRes = await axios.post('/api/applications', {
        company,
        jobTitle: title,
        jobDescription: jdText,
        status: 'SAVED'
      });
      
      const appId = appRes.data.data.id;
      setApplicationId(appId);

      // 2. Analyze JD
      const res = await axios.post('/api/ai/parse-jd', { 
        jd: jdText,
        applicationId: appId
      });
      
      setAnalysis(res.data.data);
      setStep(2);
      toast.success('AI Analysis Complete!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to analyze Job Description');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Company Name</Label>
          <Input 
            placeholder="e.g. Google" 
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="rounded-xl border-border/50 h-11"
          />
        </div>
        <div className="space-y-2">
          <Label>Job Position</Label>
          <Input 
            placeholder="e.g. Senior Frontend Engineer" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-xl border-border/50 h-11"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Job Description</Label>
        <textarea
          className="w-full h-64 p-4 rounded-2xl bg-muted/30 border border-border/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none"
          placeholder="Paste the full job description here..."
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
        />
      </div>

      <Button 
        onClick={handleAnalyze} 
        disabled={loading}
        className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 text-lg font-bold gap-3"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            AI is Analyzing...
          </div>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Analyze with AI
          </>
        )}
      </Button>
    </div>
  );
};

export default Step1JobDetails;
