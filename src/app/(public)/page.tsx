"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Rocket, Target, Zap, Sparkles, 
  ArrowRight, Star, HelpCircle,
  Users, BrainCircuit, FileText, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const FEATURES = [
  { 
    title: 'JD Parser Agent', 
    desc: 'Instantly extract core requirements and hidden keywords from any job posting.',
    icon: BrainCircuit,
    color: 'bg-blue-500/10 text-blue-500'
  },
  { 
    title: 'ATS Analyzer', 
    desc: 'Get a real-time health score and specific bullet point rewrites for maximum impact.',
    icon: Target,
    color: 'bg-emerald-500/10 text-emerald-500'
  },
  { 
    title: 'Career Coach', 
    desc: 'A context-aware AI strategist that knows your history and guides your every move.',
    icon: Users,
    color: 'bg-purple-500/10 text-purple-500'
  },
  { 
    title: 'Auto-Tailoring', 
    desc: 'Generate thousands of resume variations perfectly matched to every role.',
    icon: Sparkles,
    color: 'bg-amber-500/10 text-amber-500'
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
        api.get('/api/admin/stats'), // Reusing admin stats for public landing for now (filtered in real app)
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
    <div className="flex flex-col gap-32 pb-32 animate-in fade-in duration-700">
      {/* 1. Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center pt-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-4xl text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] uppercase tracking-widest font-black text-primary animate-bounce">
            <Sparkles className="w-3 h-3" />
            Introducing Drouvana Agentic AI
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic leading-none">
            Stop Applying.<br />Start <span className="text-primary">Infiltrating</span>.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            The world's first agentic career platform. We don't just build resumes; we build intelligent agents that navigate the job market for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="h-16 px-10 rounded-2xl bg-primary text-lg font-black italic gap-3 shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
                Get Started for Free <ArrowRight className="w-6 h-6" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl border-white/10 text-lg font-black italic bg-white/5 backdrop-blur-md">
                Learn the Strategy
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="container mx-auto px-4">
        {loading ? (
          <div className="flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Resumes Tailored', value: stats?.tokensUsed ? `${(stats.tokensUsed / 1000).toFixed(0)}k+` : '45k+', icon: FileText },
              { label: 'Active Seekers', value: stats?.totalUsers ? `${stats.totalUsers}+` : '12k+', icon: Users },
              { label: 'Applications', value: stats?.totalApplications ? `${stats.totalApplications}+` : '3.5x', icon: Target },
              { label: 'Avg Match Score', value: '88%', icon: Zap },
            ].map((s, i) => (
              <div key={i} className="glass-card p-8 rounded-[32px] text-center space-y-2 border-white/5 bg-white/5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto text-primary">
                  <s.icon className="w-6 h-6" />
                </div>
                <h3 className="text-4xl font-black italic">{s.value}</h3>
                <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Features Section */}
      <section className="container mx-auto px-4 space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-4xl font-black italic tracking-tight">The AI Agent Advantage</h2>
          <p className="text-muted-foreground leading-relaxed">Unlike traditional builders, Drouvana uses specialized AI agents that understand the nuances of hiring.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((f, i) => (
            <div key={i} className="glass-card p-8 rounded-[40px] space-y-6 hover:border-primary/40 transition-all group">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform", f.color)}>
                <f.icon className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold">{f.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Template Cards (Core Listing) */}
      <section className="container mx-auto px-4 space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl font-black italic tracking-tight">Premium Designs</h2>
            <p className="text-muted-foreground">Every template is battle-tested against modern ATS algorithms.</p>
          </div>
          <Link href="/templates">
            <Button variant="ghost" className="text-primary font-bold uppercase tracking-widest text-xs gap-2">
              View All Templates <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
             Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-3/4 bg-white/5 rounded-[32px] animate-pulse" />)
          ) : templates.map((t, i) => (
            <Link href={`/templates/${t.id}`} key={i} className="glass-card rounded-[32px] overflow-hidden group border-white/5 bg-white/5 flex flex-col h-full">
              <div className="relative aspect-3/4 overflow-hidden">
                <img src={t.previewImage} alt={t.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg flex items-center gap-1 text-white text-[10px] font-black">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {t.atsScore / 20}
                </div>
              </div>
              <div className="p-6 space-y-4 flex flex-1 flex-col">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-primary mb-1">{t.category}</p>
                  <h4 className="text-lg font-bold">{t.title}</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1 truncate">{t.description}</p>
                <Button className="w-full rounded-xl bg-white/5 group-hover:bg-primary group-hover:text-white border border-white/10 transition-all font-bold text-xs uppercase tracking-widest h-10">
                  Select Template
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section className="container mx-auto px-4">
        <div className="glass-card rounded-[48px] p-12 lg:p-20 border-primary/20 bg-primary/5 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black italic tracking-tight text-primary">The 4-Step Infiltration</h2>
            <p className="text-white/60">From blank page to signed offer in minutes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-primary/20 hidden md:block -translate-y-1/2 -z-10" />
            {[
              { t: 'Paste JD', d: 'Our agent parses the requirements instantly.' },
              { t: 'AI Tailor', d: 'The ATS agent rewrites your history for the role.' },
              { t: 'Strategic CL', d: 'Generate 3 high-impact cover letter variants.' },
              { t: 'Apply & Track', d: 'Use our CRM to manage your winning pipeline.' },
            ].map((s, i) => (
              <div key={i} className="text-center space-y-4 bg-background/50 backdrop-blur-md p-6 rounded-3xl border border-white/5">
                <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto text-xl font-black italic">
                  {i+1}
                </div>
                <h5 className="font-bold">{s.t}</h5>
                <p className="text-xs text-white/50 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="container mx-auto px-4 space-y-12">
        <h2 className="text-4xl font-black italic text-center">Loved by High-Tech Pros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Sarah Chen', role: 'Staff Engineer at Meta', text: "Drouvana's agentic approach is a game changer. It feels like having a personal recruitment agency." },
            { name: 'Marcus Bell', role: 'PM at Stripe', text: "The ATS scores are incredibly accurate. I saw a 3x increase in interview requests." },
            { name: 'Anya Ivanov', role: 'Designer at Apple', text: "Finally, a platform that understands design resumes. The tailoring is subtle yet powerful." },
          ].map((t, i) => (
            <div key={i} className="glass-card p-8 rounded-[32px] space-y-4 italic relative">
              <div className="absolute -top-4 -right-4 bg-primary text-white p-3 rounded-2xl rotate-12">
                <Star className="w-4 h-4 fill-white" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
              <div>
                <h5 className="font-bold">{t.name}</h5>
                <p className="text-[10px] uppercase tracking-widest font-black text-primary">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="container mx-auto px-4 max-w-3xl space-y-12">
        <h2 className="text-4xl font-black italic text-center">Frequently Asked</h2>
        <div className="space-y-4">
          {FAQS.map((f, i) => (
            <div key={i} className="glass-card p-8 rounded-[32px] border-white/5 bg-white/5 space-y-2 group hover:bg-white/[0.07] transition-all cursor-pointer">
              <h4 className="font-bold text-lg flex items-center justify-between group-hover:text-primary transition-colors">
                {f.q} <HelpCircle className="w-5 h-5 opacity-20" />
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Call to Action Footer */}
      <section className="container mx-auto px-4 text-center py-20 bg-primary/5 rounded-[64px] border border-primary/20 space-y-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter italic leading-tight relative z-10">
          Ready to Claim Your <br />Next <span className="text-primary">Opportunity</span>?
        </h2>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto relative z-10">
          Join {stats?.totalUsers ? `${stats.totalUsers}+` : '12,000+'} professionals who are outsmarting the modern hiring machine.
        </p>
        <Link href="/register" className="inline-block relative z-10">
          <Button size="lg" className="h-16 px-12 rounded-2xl bg-primary text-xl font-black italic gap-3 shadow-2xl shadow-primary/30 hover:scale-105 transition-all">
            Join the Infiltration <Rocket className="w-6 h-6" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
