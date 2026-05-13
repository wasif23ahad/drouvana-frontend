"use client";

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Share2, ArrowLeft, Clock, Layout, Sparkles, Rocket, FileText, Loader2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

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
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-heading font-bold text-on-surface ">Template Not Found</h1>
        <Link href="/templates">
          <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5">Back to Explore</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-spacing-container-max mx-auto py-12 px-spacing-margin-desktop space-y-16 animate-in fade-in duration-700">
      {/* Breadcrumbs */}
      <div className="flex items-center text-xs text-on-surface-variant gap-2 font-mono uppercase tracking-widest">
        <Link href="/templates" className="hover:text-primary transition-colors">Templates</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-primary font-bold">{template.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Visual Side */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-surface-container-low rounded-[40px] overflow-hidden border border-white/10 aspect-3/4 relative group shadow-2xl shadow-primary/5">
            <img 
              src={template.previewImage} 
              alt={template.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-linear-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {template.images?.length > 0 ? template.images.map((img: string, i: number) => (
              <div key={i} className="aspect-square rounded-2xl bg-surface-container border border-white/5 overflow-hidden cursor-pointer hover:border-primary transition-all group">
                <img src={img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all scale-110 group-hover:scale-100" />
              </div>
            )) : (
               Array.from({ length: 4 }).map((_, i) => (
                 <div key={i} className="aspect-square rounded-2xl bg-surface-container border border-white/5 flex items-center justify-center opacity-20">
                   <Layout className="w-6 h-6" />
                 </div>
               ))
            )}
          </div>
        </div>

        {/* Content Side */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Badge className="bg-primary/10 text-primary border border-primary/20 rounded-lg font-mono text-[10px] uppercase tracking-widest px-3 py-1">{template.category}</Badge>
              <div className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
                <Star className="w-3 h-3 text-secondary fill-secondary" />
                <span className="text-on-surface font-bold">{template.averageRating.toFixed(1)}</span>
                <span className="opacity-50">({template._count?.reviews || 0} reviews)</span>
              </div>
            </div>
            <h1 className="text-5xl font-heading font-bold text-on-surface leading-tight tracking-tight">{template.title}</h1>
            <p className="text-lg text-on-surface-variant leading-relaxed font-sans ">{template.description}</p>
          </div>

          {/* Technical Specs */}
          <div className="grid grid-cols-2 gap-y-10 gap-x-6 py-10 border-y border-white/5">
            {[
              { icon: Layout, label: 'Visual Style', val: template.style },
              { icon: FileText, label: 'Deployments', val: `${template.usageCount}+ Used` },
              { icon: Sparkles, label: 'ATS Target', val: `${template.atsScore}% Score` },
              { icon: Clock, label: 'Last Update', val: 'Oct 2024' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary border border-white/5 group hover:border-primary/50 transition-all">
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-on-surface-variant mb-1">{s.label}</p>
                  <p className="font-heading font-bold text-on-surface text-sm">{s.val}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary font-bold">Optimal For Roles</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {template.bestFor?.map((f: string) => (
                <div key={f} className="flex items-center gap-3 font-heading font-bold text-sm text-on-surface-variant ">
                  <CheckCircle className="w-4 h-4 text-secondary" />
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button className="h-16 px-10 rounded-2xl bg-gradient-primary text-white text-lg font-heading font-bold flex-1 gap-3 shadow-xl shadow-primary/20 border-none transition-all hover:scale-[1.02] active:scale-95">
              Launch Builder <Rocket className="w-6 h-6" />
            </Button>
            <Button variant="outline" size="icon" className="h-16 w-16 rounded-2xl border-white/10 bg-surface-container hover:bg-white/5 text-on-surface-variant hover:text-primary transition-all">
              <Share2 className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Related Templates */}
      <div className="pt-24 space-y-16">
        <div className="text-center space-y-2">
           <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary font-bold">Strategic Ecosystem</p>
           <h2 className="text-4xl font-heading font-bold text-on-surface ">Related Architectures</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface-container-low rounded-2xl border border-white/5 overflow-hidden group hover:border-primary/30 transition-all">
              <div className="aspect-video bg-surface-container overflow-hidden">
                <div className="w-full h-full bg-primary/5 animate-pulse" />
              </div>
              <div className="p-6">
                <div className="h-4 w-3/4 bg-surface-container rounded mb-3" />
                <div className="h-3 w-1/2 bg-surface-container rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Proof */}
      <div className="pt-24 space-y-16">
        <div className="text-center space-y-2">
           <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-secondary font-black">Success Stories</p>
           <h2 className="text-4xl font-heading font-bold text-on-surface ">Verified Platform Impact</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {template.reviews?.length > 0 ? template.reviews.slice(0, 3).map((r: any, i: number) => (
            <div key={i} className="bg-surface-container-low p-8 rounded-[32px] border border-white/5 space-y-6 relative group overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-linear-to-br from-primary/20 to-transparent rounded-full blur-2xl group-hover:from-primary/30 transition-colors" />
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className={cn("w-3 h-3", s < r.rating ? "text-secondary fill-secondary" : "text-white/10 fill-white/10")} />
                ))}
              </div>
              <p className="text-on-surface-variant leading-relaxed font-sans text-sm">"{r.comment}"</p>
              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-tertiary flex items-center justify-center font-bold text-xs text-white">
                  {r.user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h5 className="font-heading font-bold text-sm text-on-surface ">{r.user?.name || 'Anonymous User'}</h5>
                  <p className="font-mono text-[8px] uppercase tracking-widest text-primary font-black">Verified Strategist</p>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-12 text-center bg-surface-container-low rounded-3xl border border-dashed border-white/10">
              <p className="text-on-surface-variant font-sans">Strategic assessments pending for this design architecture.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
