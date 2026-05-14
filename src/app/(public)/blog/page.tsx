"use client";

import React from 'react';
import { Calendar, Clock, ArrowRight, ChevronRight, Search } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const POSTS = [
  {
    title: "Mastering the AI-Driven Job Market",
    excerpt: "How to leverage agentic AI to gain a competitive edge in the evolving professional landscape of 2026.",
    date: "May 12, 2026",
    readTime: "5 min",
    category: "Strategy",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80"
  },
  {
    title: "ATS Optimization: Beyond Keywords",
    excerpt: "Why the context of your achievements matters more than simple keyword stuffing in modern algorithms.",
    date: "May 08, 2026",
    readTime: "8 min",
    category: "Technical",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80"
  },
  {
    title: "Future of Professional Networking",
    excerpt: "Using generative intelligence to craft personalized outreach that actually builds human connections.",
    date: "May 05, 2026",
    readTime: "4 min",
    category: "Networking",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80"
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-spacing-container-max mx-auto py-12 px-spacing-margin-desktop space-y-16 animate-in fade-in duration-700">
      {/* Header & Category Filter */}
      <div className="space-y-10">
        <div className="flex items-center text-xs text-on-surface-variant gap-2 font-mono uppercase tracking-widest">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary font-bold">Blog</span>
        </div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-on-surface leading-tight tracking-tight">Career Insights</h1>
            <p className="text-xl text-on-surface-variant font-sans leading-relaxed">Deep dives into the intersection of artificial intelligence and professional evolution.</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {['All', 'Strategy', 'Technical', 'Networking'].map((c, i) => (
              <button 
                key={c} 
                className={cn(
                  "px-6 py-2 rounded-xl border font-mono text-[10px] uppercase tracking-widest transition-all",
                  i === 0 
                    ? "bg-primary text-on-primary border-primary shadow-lg shadow-primary/20" 
                    : "border-[var(--color-border-subtle)] text-on-surface-variant hover:border-primary/50 hover:text-on-surface"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Search */}
      <div className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
        <Input 
          placeholder="Search articles, insights, or guides..." 
          className="h-14 pl-12 rounded-2xl bg-surface-container-low border-[var(--color-border-subtle)] text-on-surface focus:border-primary transition-all shadow-xl"
        />
      </div>

      {/* Grid Listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
        {POSTS.map((post, i) => (
          <div key={i} className="bg-surface-container-low/50 backdrop-blur-xl rounded-[2.5rem] overflow-hidden group border border-[var(--color-border-subtle)] hover:border-primary/40 transition-all duration-500 flex flex-col h-full shadow-2xl">
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000 opacity-80 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100"
              />
              <div className="absolute top-6 left-6 px-4 py-1.5 bg-background/60 backdrop-blur-md text-primary text-[9px] font-mono font-black uppercase tracking-[0.2em] rounded-lg border border-primary/20">
                {post.category}
              </div>
            </div>
            <div className="p-10 flex-1 flex flex-col space-y-6">
              <div className="flex items-center gap-6 font-mono text-[9px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {post.date}</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {post.readTime}</span>
              </div>
              <h3 className="text-2xl font-heading font-bold text-on-surface group-hover:text-primary transition-colors leading-tight tracking-tight">{post.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed flex-1 font-sans ">{post.excerpt}</p>
              <button className="flex items-center gap-3 font-mono text-[10px] font-black uppercase tracking-[0.2em] text-primary group/btn transition-all hover:gap-5">
                Full Protocol <ArrowRight className="w-4 h-4 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter Section */}
      <section className="bg-surface-container-low border border-[var(--color-border-subtle)] rounded-[3rem] p-12 md:p-20 text-center space-y-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-4 max-w-2xl mx-auto relative z-10">
          <h2 className="text-4xl font-heading font-bold text-on-surface tracking-tight">Stay ahead of the curve</h2>
          <p className="font-sans text-on-surface-variant ">Join 10,000+ professionals receiving weekly AI-driven career strategies.</p>
        </div>
        <form className="flex flex-col sm:flex-row justify-center gap-4 relative z-10 max-w-lg mx-auto">
          <Input placeholder="Enter your email" className="h-14 bg-surface-container rounded-2xl border-[var(--color-border-subtle)] px-6 font-sans" />
          <button className="h-14 px-10 rounded-2xl bg-gradient-primary text-white font-heading font-bold shadow-xl shadow-primary/20 whitespace-nowrap">
            Join Protocol
          </button>
        </form>
      </section>
    </div>
  );
}
