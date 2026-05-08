"use client";

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Share2, ArrowLeft, Clock, Layout, Sparkles, Rocket, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { useParams } from 'next/navigation';

export default function TemplateDetailsPage() {
  const { id } = useParams();
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/templates/${id}`);
        setTemplate(response.data);
      } catch (error) {
        console.error('Failed to fetch template details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTemplate();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Template Not Found</h1>
        <Link href="/templates">
          <Button variant="outline">Back to Templates</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-16 animate-in fade-in duration-700">
      {/* Back Button */}
      <Link href="/templates" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Templates
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Visual Side */}
        <div className="space-y-6">
          <div className="glass-card rounded-[40px] overflow-hidden border-white/10 bg-white/5 aspect-3/4 relative group">
            <img 
              src={template.previewImage} 
              alt={template.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {template.images?.map((img: string, i: number) => (
              <div key={i} className="aspect-square rounded-2xl bg-white/5 border border-white/5 overflow-hidden cursor-pointer hover:border-primary transition-all">
                <img src={img} className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-opacity" />
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
                {template.averageRating.toFixed(1)} <span className="text-muted-foreground">({template._count?.reviews || 0} reviews)</span>
              </div>
            </div>
            <h1 className="text-5xl font-black italic tracking-tight">{template.title}</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">{template.description}</p>
          </div>

          {/* Key Specs (Rule 78) */}
          <div className="grid grid-cols-2 gap-6 py-8 border-y border-white/5">
            {[
              { icon: Layout, label: 'Type', val: template.style },
              { icon: FileText, label: 'Usage', val: `${template.usageCount}+ Used` },
              { icon: Clock, label: 'Status', val: 'Active' },
              { icon: Sparkles, label: 'ATS Score', val: `${template.atsScore}%` },
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
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Best For Roles</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {template.bestFor?.map((f: string) => (
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
          {template.reviews?.length > 0 ? template.reviews.map((r: any, i: number) => (
            <div key={i} className="glass-card p-8 rounded-[32px] border-white/5 bg-white/5 space-y-4">
              <div className="flex gap-1">
                {Array.from({ length: r.rating }).map((_, s) => <Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-muted-foreground italic leading-relaxed">"{r.comment}"</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs uppercase">
                  {r.user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h5 className="font-bold text-sm">{r.user?.name || 'Anonymous User'}</h5>
                  <p className="text-[8px] uppercase tracking-widest font-black text-primary">Verified Purchase</p>
                </div>
              </div>
            </div>
          )) : (
            <p className="text-muted-foreground italic">No reviews yet for this template.</p>
          )}
        </div>
      </div>
    </div>
  );
}
