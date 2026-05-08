"use client";

import React from 'react';
import { Check, X, Zap, Shield, Rocket, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    desc: 'Essential tools to get your search started.',
    features: ['Basic tracking', '3 resume versions', 'Limited AI calls'],
    button: 'Get Started Free',
    highlight: false,
    color: 'secondary'
  },
  {
    name: 'Pro',
    price: '$19',
    desc: 'Full AI power for ambitious professionals.',
    features: ['Unlimited tracking', 'Full AI assistant', 'ATS tailoring', 'Priority support'],
    button: 'Upgrade to Pro',
    highlight: true,
    color: 'primary'
  },
  {
    name: 'Executive',
    price: '$49',
    desc: 'White-glove service and bespoke strategy.',
    features: ['All Pro features', '1-on-1 human coaching', 'Custom templates'],
    button: 'Contact Sales',
    highlight: false,
    color: 'tertiary'
  }
];

const COMPARISON = [
  { f: 'Job Applications Tracking', free: 'Up to 50', pro: 'Unlimited', exec: 'Unlimited' },
  { f: 'AI Resume Tailoring', free: '3 per month', pro: 'Unlimited', exec: 'Unlimited + Custom' },
  { f: 'AI Cover Letter Generator', free: false, pro: true, exec: true },
  { f: 'Interview Prep Assistant', free: false, pro: 'Basic', exec: 'Advanced + Coaching' },
  { f: 'Support', free: 'Community', pro: 'Priority Email', exec: '1-on-1 Dedicated' },
];

export default function PricingPage() {
  return (
    <div className="max-w-spacing-container-max mx-auto py-12 px-spacing-margin-desktop space-y-24 animate-in fade-in duration-700">
      {/* Header */}
      <header className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="flex justify-center items-center text-xs text-on-surface-variant gap-2 font-mono uppercase tracking-widest mb-4">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary font-bold">Pricing</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-heading font-bold text-on-surface italic leading-tight tracking-tight">Flexible Plans for Every Career Stage</h1>
        <p className="font-sans text-on-surface-variant text-lg italic">Supercharge your job search with AI-driven insights, tailored resumes, and intelligent tracking. Choose the plan that fits your momentum.</p>
      </header>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {PLANS.map((plan) => (
          <div 
            key={plan.name}
            className={cn(
              "bg-surface-container-low/50 backdrop-blur-xl border rounded-[2rem] p-10 flex flex-col relative overflow-hidden transition-all duration-500 hover:scale-[1.02]",
              plan.highlight ? "border-primary/50 shadow-2xl shadow-primary/10 md:-translate-y-4" : "border-white/5 shadow-xl"
            )}
          >
            {plan.highlight && (
              <div className="absolute top-0 right-0 bg-primary text-on-primary font-mono text-[9px] font-black px-6 py-2 rounded-bl-2xl uppercase tracking-[0.2em] shadow-lg">
                Most Popular
              </div>
            )}
            
            <div className="space-y-2 mb-8">
              <h3 className={cn("text-3xl font-heading font-bold italic", plan.highlight ? "text-primary" : "text-on-surface")}>{plan.name}</h3>
              <p className="text-sm text-on-surface-variant font-sans h-10">{plan.desc}</p>
            </div>

            <div className="mb-10">
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-heading font-bold text-on-surface italic tracking-tighter">{plan.price}</span>
                <span className="text-on-surface-variant font-mono text-sm uppercase">/mo</span>
              </div>
            </div>

            <ul className="space-y-5 mb-12 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-4">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-on-surface font-sans">{f}</span>
                </li>
              ))}
            </ul>

            <Button className={cn(
              "w-full h-14 rounded-2xl font-heading font-bold italic text-lg shadow-lg border-none transition-all active:scale-95",
              plan.highlight ? "bg-gradient-primary text-white shadow-primary/20" : "bg-surface-container-highest text-on-surface hover:bg-white/5"
            )}>
              {plan.button}
            </Button>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="space-y-12 py-12">
        <div className="text-center space-y-2">
           <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-secondary font-black">Strategic Breakdown</p>
           <h2 className="text-4xl font-heading font-bold text-on-surface italic tracking-tight">Compare Plan Capabilities</h2>
        </div>
        <div className="bg-surface-container-low rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-surface/50">
                  <th className="py-6 px-10 font-mono text-[10px] uppercase tracking-[0.2em] text-on-surface-variant">Capabilities</th>
                  <th className="py-6 px-10 font-heading font-bold text-lg text-on-surface italic">Free</th>
                  <th className="py-6 px-10 font-heading font-bold text-lg text-primary italic bg-primary/5">Pro</th>
                  <th className="py-6 px-10 font-heading font-bold text-lg text-on-surface italic">Executive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {COMPARISON.map((row) => (
                  <tr key={row.f} className="hover:bg-white/5 transition-colors">
                    <td className="py-6 px-10 font-sans text-on-surface">{row.f}</td>
                    <td className="py-6 px-10 font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                      {typeof row.free === 'boolean' ? (row.free ? <Check className="w-5 h-5 text-primary" /> : <X className="w-5 h-5 text-error opacity-30" />) : row.free}
                    </td>
                    <td className="py-6 px-10 font-mono text-[11px] text-primary uppercase tracking-wider bg-primary/5">
                      {typeof row.pro === 'boolean' ? (row.pro ? <Check className="w-5 h-5 text-primary" /> : <X className="w-5 h-5 text-error opacity-30" />) : row.pro}
                    </td>
                    <td className="py-6 px-10 font-mono text-[11px] text-on-surface-variant uppercase tracking-wider">
                      {typeof row.exec === 'boolean' ? (row.exec ? <Check className="w-5 h-5 text-primary" /> : <X className="w-5 h-5 text-error opacity-30" />) : row.exec}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto space-y-12">
        <h2 className="text-4xl font-heading font-bold text-center text-on-surface italic tracking-tight">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { q: 'Can I switch plans later?', a: 'Yes, you can upgrade or downgrade at any time. Prorated charges will be applied to your account automatically.' },
            { q: 'What does "Unlimited" mean?', a: 'Pro and Executive users have unmetered access to our core AI generation features, subject only to fair use policies.' },
            { q: 'Is there a free trial?', a: 'Our Free plan is free forever. You can experience the core platform without any commitment.' },
            { q: 'How do I cancel?', a: 'Cancel anytime from your account settings. You will maintain access until the end of your billing cycle.' }
          ].map((item) => (
            <div key={item.q} className="bg-surface-container-low/50 border border-white/5 rounded-2xl p-8 space-y-4 hover:border-primary/30 transition-all shadow-lg">
              <h4 className="font-heading font-bold text-on-surface italic">{item.q}</h4>
              <p className="font-sans text-sm text-on-surface-variant leading-relaxed italic">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
