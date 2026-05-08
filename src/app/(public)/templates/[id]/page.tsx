import React from 'react';
import { Star, CheckCircle, Download, Share2, ArrowLeft, Clock, Layout, Sparkles, Rocket } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function TemplateDetailsPage({ params }: { params: { id: string } }) {
  // Mock data for public access (Rule 74)
  const template = {
    id: params.id,
    name: 'The Executive',
    category: 'Corporate',
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800',
    desc: 'The Executive is designed for leadership roles where authority and clarity are paramount. It features a robust sidebar for core competencies and a clean, chronological experience section.',
    features: ['ATS Optimized', '1-Page Layout', 'Google Docs Compatible', 'Professional Typography'],
    specs: {
      pages: 1,
      format: 'US Letter / A4',
      colors: 'Black & Blue',
      difficulty: 'Easy'
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-16">
      {/* Back Button */}
      <Link href="/templates" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Templates
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Visual Side */}
        <div className="space-y-6">
          <div className="glass-card rounded-[40px] overflow-hidden border-white/10 bg-white/5 aspect-3/4 relative group">
            <img 
              src={template.image} 
              alt={template.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="aspect-square rounded-2xl bg-white/5 border border-white/5 overflow-hidden cursor-pointer hover:border-primary transition-all">
                <img src={template.image} className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* Content Side */}
        <div className="space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-primary/10 text-primary border-none rounded-lg font-bold">{template.category}</Badge>
              <div className="flex items-center gap-1 text-sm font-bold">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                {template.rating} <span className="text-muted-foreground">({template.reviews} reviews)</span>
              </div>
            </div>
            <h1 className="text-5xl font-black italic tracking-tight">{template.name}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">{template.desc}</p>
          </div>

          {/* Key Specs (Rule 78) */}
          <div className="grid grid-cols-2 gap-6 py-8 border-y border-white/5">
            {[
              { icon: Layout, label: 'Pages', val: template.specs.pages },
              { icon: FileText, label: 'Format', val: template.specs.format },
              { icon: Clock, label: 'Difficulty', val: template.specs.difficulty },
              { icon: Sparkles, label: 'Optimization', val: 'ATS Ready' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-primary">
                  <s.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">{s.label}</p>
                  <p className="font-bold">{s.val}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Core Features</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {template.features.map(f => (
                <div key={f} className="flex items-center gap-3 font-bold text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button className="h-16 px-10 rounded-2xl bg-primary text-lg font-black italic flex-1 gap-3 shadow-xl shadow-primary/20">
              Get Started <Rocket className="w-6 h-6" />
            </Button>
            <Button variant="outline" size="icon" className="h-16 w-16 rounded-2xl border-white/10 bg-white/5">
              <Share2 className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews Section (Rule 79) */}
      <div className="pt-20 space-y-12">
        <h2 className="text-3xl font-bold tracking-tight italic">Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { name: 'Alex Rivera', role: 'DevOps Engineer', text: 'This template cleared the ATS at three FAANG companies. The layout is incredibly easy to manage.' },
            { name: 'Jane Smith', role: 'Marketing Director', text: 'Clean, modern, and exactly what I needed to stand out. Highly recommended!' },
          ].map((r, i) => (
            <div key={i} className="glass-card p-8 rounded-[32px] border-white/5 bg-white/5 space-y-4">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-muted-foreground italic leading-relaxed">"{r.text}"</p>
              <div>
                <h5 className="font-bold">{r.name}</h5>
                <p className="text-[10px] uppercase tracking-widest font-black text-primary">{r.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related Items (Rule 80) */}
      <div className="pt-20 space-y-12">
        <h2 className="text-3xl font-bold tracking-tight italic">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
           {/* Reusing template cards layout */}
           {[1,2,3,4].map(i => (
             <div key={i} className="glass-card rounded-[24px] aspect-3/4 bg-white/5 border-white/5" />
           ))}
        </div>
      </div>
    </div>
  );
}

import { FileText } from 'lucide-react';
