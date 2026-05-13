"use client";

import React from 'react';
import { Target, Users, Zap, Shield, Brain, Rocket, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const PRINCIPLES = [
  { icon: Brain, title: 'Intelligence', desc: 'We build systems that understand context, nuance, and potential—moving beyond keyword matching to true semantic comprehension.', color: 'primary' },
  { icon: Rocket, title: 'Velocity', desc: 'Time is the ultimate currency. We ruthlessly automate the administrative burden so you can focus on the interview.', color: 'secondary' },
  { icon: Shield, title: 'Empowerment', desc: 'Data should work for the candidate. We prioritize transparency and user control, ensuring you own your professional narrative.', color: 'tertiary' },
];

export default function AboutPage() {
  return (
    <div className="max-w-spacing-container-max mx-auto py-12 px-spacing-margin-desktop space-y-24 animate-in fade-in duration-700">
      {/* Background Decor */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/5 blur-[150px] pointer-events-none -z-10"></div>

      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto py-12">
        <div className="flex justify-center items-center text-xs text-text-muted gap-2 font-jetbrains uppercase tracking-widest mb-4">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary font-bold">About</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-hanken font-bold text-text-main leading-tight tracking-tight">
          Our Mission to <span className="bg-primary bg-clip-text text-transparent">Humanize</span> Job Hunting
        </h1>
        <p className="text-xl text-text-sub leading-relaxed font-sans max-w-3xl mx-auto">
          We believe finding your next career move shouldn't feel like speaking to a void. Drouvana leverages advanced AI to understand your unique value, connecting you with opportunities where you'll thrive.
        </p>
      </section>

      {/* Narrative Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="bg-surface-2/50 backdrop-blur-xl rounded-[2.5rem] p-10 md:p-14 border border-white/10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full"></div>
          <h2 className="text-4xl font-hanken font-bold text-text-main mb-8 relative z-10 tracking-tight">The Drouvana Story</h2>
          <div className="space-y-6 font-sans text-text-sub leading-relaxed relative z-10 text-lg">
            <p>
              Founded in 2023 by a team of frustrated tech professionals and AI researchers, Drouvana was born from a simple realization: the modern job search is fundamentally broken. It's a high-friction, low-transparency process that treats human potential as mere data points.
            </p>
            <p>
              We set out to build an intelligent engine that acts as a tireless advocate. By combining generative AI with deep market analytics, we created a platform that not only matches skills to requirements but aligns ambitions with culture.
            </p>
          </div>
        </div>
        <div className="h-[500px] md:h-[600px] rounded-[2.5rem] overflow-hidden border border-white/10 relative shadow-2xl group">
          <img 
            alt="Modern tech office" 
            className="w-full h-full object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-1000 scale-105 group-hover:scale-100" 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" 
          />
          <div className="absolute inset-0 bg-linear-to-t from-bg-base/60 via-transparent to-transparent"></div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="space-y-16 py-12">
        <div className="text-center space-y-4">
          <p className="font-jetbrains text-[10px] uppercase tracking-[0.4em] text-secondary font-black">Strategic Core</p>
          <h2 className="text-4xl font-hanken font-bold text-text-main tracking-tight">Core Principles</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRINCIPLES.map((p, i) => (
            <div key={i} className="bg-surface-2/50 backdrop-blur-xl rounded-4xl p-8 border border-white/5 hover:border-primary/40 transition-all duration-500 hover:-translate-y-2 group shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center mb-8 border border-white/10 group-hover:border-primary/50 transition-colors">
                <p.icon className={cn("w-7 h-7", p.color === 'primary' ? 'text-primary' : p.color === 'secondary' ? 'text-secondary' : 'text-tertiary')} />
              </div>
              <h3 className="text-2xl font-hanken font-bold text-text-main mb-4">{p.title}</h3>
              <p className="font-sans text-text-sub leading-relaxed text-sm ">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-surface-2 border border-white/10 rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <h2 className="text-4xl md:text-5xl font-hanken font-bold text-text-main tracking-tight leading-tight">Ready to evolve your career strategy?</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
          <Link href="/register">
            <button className="h-14 px-10 rounded-2xl bg-primary text-white font-hanken font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              Initialize Account
            </button>
          </Link>
          <Link href="/templates">
            <button className="h-14 px-10 rounded-2xl bg-surface-2 text-text-main font-hanken font-bold text-lg border border-white/10 hover:bg-white/5 transition-all">
              Explore Blueprints
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
