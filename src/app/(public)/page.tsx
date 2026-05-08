"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Rocket, Target, Zap, Sparkles, 
  ArrowRight, Star, HelpCircle,
  Users, BrainCircuit, FileText, Loader2, PlayCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const FEATURES = [
  { 
    title: 'AI JD Parsing', 
    desc: 'Paste a job URL, and Drouvana extracts key requirements, skills, and salary data in seconds, adding it directly to your tracker.',
    icon: BrainCircuit,
    color: 'bg-primary/10 text-primary'
  },
  { 
    title: 'Resume Tailoring', 
    desc: 'Our engine compares your master resume against parsed job descriptions to suggest high-impact keyword optimizations instantly.',
    icon: Target,
    color: 'bg-secondary/10 text-secondary'
  },
  { 
    title: 'Cover Letter Gen', 
    desc: 'Generate highly personalized, context-aware cover letters based on your profile and the specific company\'s requirements.',
    icon: FileText,
    color: 'bg-tertiary/10 text-tertiary'
  },
];

const FAQS = [
  { q: 'How does the AI tailoring work?', a: 'Our agentic AI analyzes the JD and your master resume, then intelligently rewrites bullet points to match requirements while preserving truthfulness.' },
  { q: 'Is my data safe?', a: 'Absolutely. We use industry-standard encryption and never share your data with third parties.' },
  { q: 'Can I track my applications?', a: 'Yes, Drouvana includes a full-featured CRM to track every application status from "Sent" to "Offer".' },
];

export default function LandingPage() {
  const [stats, setStats] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLandingData = async () => {
    try {
      setLoading(true);
      const [statsRes, templatesRes] = await Promise.all([
        api.get('/api/admin/stats'), 
        api.get('/api/templates', { params: { limit: 4, sort: 'popular' } })
      ]);
      setStats(statsRes.data);
      setTemplates(templatesRes.data.templates);
    } catch (error) {
      console.error('Failed to fetch landing data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLandingData();
  }, []);

  return (
    <div className="flex flex-col gap-24 pb-32">
      {/* 1. Hero Section */}
      <section className="relative min-h-[665px] flex items-center justify-center overflow-hidden py-24">
        {/* Background Gradient Mesh */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] bg-primary-container/20 blur-[120px] rounded-full mix-blend-screen"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[80%] bg-tertiary-container/20 blur-[150px] rounded-full mix-blend-screen"></div>
        </div>

        <div className="relative z-10 max-w-spacing-container-max mx-auto px-spacing-margin-desktop flex flex-col lg:flex-row items-center gap-spacing-gutter">
          <div className="lg:w-1/2 flex flex-col gap-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-on-surface leading-tight tracking-tight italic">
              The AI-Powered Job Tracker of <span className="text-gradient">2026</span>
            </h1>
            <p className="font-sans text-lg text-on-surface-variant max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Stop manually updating spreadsheets. Drouvana intelligently tracks your applications across platforms, extracts job details automatically, and helps you tailor resumes with a single click.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link href="/register" className="w-full sm:w-auto">
                <Button className="bg-gradient-primary text-white px-8 py-3 rounded-xl text-lg font-bold w-full h-14 hover:shadow-[0_0_30px_rgba(192,193,255,0.3)] transition-all border-none">
                  Get Started Free
                </Button>
              </Link>
              <Button variant="outline" className="border-secondary text-secondary px-8 py-3 rounded-xl text-lg font-bold w-full sm:w-auto h-14 hover:bg-secondary/10 transition-colors flex items-center justify-center gap-2">
                <PlayCircle className="w-5 h-5" /> Watch Demo
              </Button>
            </div>
          </div>

          <div className="lg:w-1/2 relative w-full aspect-video lg:aspect-auto lg:h-[500px]">
            <div className="absolute inset-0 bg-surface-container rounded-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-3xl overflow-hidden flex flex-col">
              {/* Mockup Header */}
              <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2 bg-surface-container-highest/50">
                <div className="w-3 h-3 rounded-full bg-error"></div>
                <div className="w-3 h-3 rounded-full bg-secondary-container"></div>
                <div className="w-3 h-3 rounded-full bg-primary-container"></div>
              </div>
              {/* Mockup Body */}
              <div className="flex-1 p-6 relative">
                <div className="w-full h-full bg-surface-container-lowest/50 rounded-lg flex items-center justify-center border border-white/5">
                   <div className="flex flex-col items-center gap-4">
                      <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                      <p className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">Infiltrating Pipeline...</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Features Section */}
      <section className="py-24 bg-surface-container-lowest" id="features">
        <div className="max-w-spacing-container-max mx-auto px-spacing-margin-desktop">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-on-surface mb-4">Intelligent Workflows</h2>
            <p className="font-sans text-lg text-on-surface-variant max-w-2xl mx-auto">
              Automate the tedious parts of your job search. Our AI handles the heavy lifting so you can focus on interviewing.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-spacing-gutter">
            {FEATURES.map((f, i) => (
              <div key={i} className="bg-surface-container/50 backdrop-blur-xl border border-white/10 rounded-xl p-8 hover:border-primary/50 transition-colors group">
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform", f.color)}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-heading font-bold text-on-surface mb-3">{f.title}</h3>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Stats Section */}
      <section className="container mx-auto px-spacing-margin-desktop">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Resumes Tailored', value: stats?.tokensUsed ? `${(stats.tokensUsed / 1000).toFixed(0)}k+` : '45k+', icon: FileText },
              { label: 'Active Seekers', value: stats?.totalUsers ? `${stats.totalUsers}+` : '12k+', icon: Users },
              { label: 'Applications', value: stats?.totalApplications ? `${stats.totalApplications}+` : '150k+', icon: Target },
              { label: 'Avg Match Score', value: '88%', icon: Zap },
            ].map((s, i) => (
              <div key={i} className="glass-card p-8 rounded-[32px] text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
                  <s.icon className="w-6 h-6" />
                </div>
                <h3 className="text-4xl font-heading font-bold italic">{s.value}</h3>
                <p className="font-mono text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Template Cards */}
      <section className="container mx-auto px-spacing-margin-desktop space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-heading font-bold text-on-surface italic">Premium Designs</h2>
            <p className="text-on-surface-variant">Every template is battle-tested against modern ATS algorithms.</p>
          </div>
          <Link href="/templates">
            <Button variant="ghost" className="text-primary font-bold uppercase tracking-widest text-xs gap-2">
              View All Templates <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
             Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-3/4 bg-surface-container rounded-[32px] animate-pulse" />)
          ) : templates.map((t, i) => (
            <Link href={`/templates/${t.id}`} key={i} className="glass-card rounded-[32px] overflow-hidden group flex flex-col h-full">
              <div className="relative aspect-3/4 overflow-hidden">
                <img src={t.previewImage} alt={t.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg flex items-center gap-1 text-white text-[10px] font-bold">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {t.atsScore / 20}
                </div>
              </div>
              <div className="p-6 space-y-4 flex flex-1 flex-col">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest font-bold text-primary mb-1">{t.category}</p>
                  <h4 className="text-lg font-bold text-on-surface">{t.title}</h4>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed flex-1 truncate">{t.description}</p>
                <Button className="w-full rounded-xl bg-surface-container group-hover:bg-primary group-hover:text-white border border-white/10 transition-all font-bold text-xs uppercase tracking-widest h-10 border-none">
                  Select Template
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Call to Action Footer */}
      <section className="container mx-auto px-spacing-margin-desktop text-center py-20 bg-primary/5 rounded-[64px] border border-primary/20 space-y-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <h2 className="text-5xl md:text-7xl font-heading font-bold italic leading-tight relative z-10 text-on-surface">
          Ready to Claim Your <br />Next <span className="text-gradient">Opportunity</span>?
        </h2>
        <p className="text-xl text-on-surface-variant max-w-xl mx-auto relative z-10">
          Join {stats?.totalUsers ? `${stats.totalUsers}+` : '12,000+'} professionals who are outsmarting the modern hiring machine.
        </p>
        <Link href="/register" className="inline-block relative z-10">
          <Button size="lg" className="h-16 px-12 rounded-2xl bg-gradient-primary text-xl font-bold italic gap-3 shadow-2xl shadow-primary/30 hover:scale-105 transition-all border-none">
            Join the Infiltration <Rocket className="w-6 h-6" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
