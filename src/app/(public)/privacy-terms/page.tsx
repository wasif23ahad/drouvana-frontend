"use client";

import React from 'react';
import { Shield, Lock, Eye, FileText, ChevronRight, Scale, Info } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyTermsPage() {
  const sections = [
    {
      title: "Privacy Protocol",
      icon: Shield,
      content: "At Drouvana, we prioritize the integrity of your professional identity. Our systems are designed to process resume data with maximum transparency. We do not sell your personal data or application history to third-party data brokers."
    },
    {
      title: "Data Decryption",
      icon: Eye,
      content: "We collect only the information necessary to provide our AI-driven features: profile data, application status, and resume content. You maintain full ownership and can request total data erasure at any technical intersection."
    },
    {
      title: "Operational Terms",
      icon: Scale,
      content: "By accessing the Drouvana ecosystem, you agree to utilize our AI agents for legitimate career advancement. Any attempt to reverse-engineer our proprietary scoring models or automate bulk data extraction is strictly prohibited."
    },
    {
      title: "AI Ethics",
      icon: Info,
      content: "Our AI agents are designed to assist, not replace, human decision-making. We strive for algorithmic fairness and regularly audit our models for bias in JD analysis and resume optimization."
    }
  ];

  return (
    <div className="max-w-spacing-container-max mx-auto py-12 px-spacing-margin-desktop space-y-24 animate-in fade-in duration-700 min-h-screen">
      {/* Background Decor */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none -z-10"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px] pointer-events-none -z-10"></div>

      {/* Header */}
      <section className="text-center space-y-6 max-w-3xl mx-auto pt-12">
        <div className="flex justify-center items-center text-xs text-text-muted gap-2 font-jetbrains uppercase tracking-widest mb-4">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary font-bold">Privacy & Terms</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-hanken font-bold text-text-main italic tracking-tight">Legal & <span className="text-primary">Data Ethics</span></h1>
        <p className="text-lg text-text-sub leading-relaxed font-sans italic">
          Transparent governance of the Drouvana Digital Core and user professional narratives.
        </p>
      </section>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto pb-24">
        {sections.map((section, i) => (
          <div key={i} className="bg-surface-2/50 backdrop-blur-xl rounded-4xl p-10 border border-white/5 hover:border-primary/30 transition-all group shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-surface-2 flex items-center justify-center mb-6 border border-white/10 group-hover:border-primary/50 transition-colors">
              <section.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-hanken font-bold text-text-main italic mb-4">{section.title}</h3>
            <p className="font-sans text-text-sub leading-relaxed text-base italic">{section.content}</p>
          </div>
        ))}
      </div>

      {/* Detailed Sections */}
      <section className="max-w-4xl mx-auto space-y-16 pb-32">
        <div className="space-y-8">
          <div className="flex items-center gap-4 text-primary font-jetbrains text-xs uppercase tracking-widest font-black">
            <Lock className="w-4 h-4" />
            Security Architecture
          </div>
          <div className="bg-surface-2 border border-white/10 rounded-[2.5rem] p-10 md:p-14 space-y-8 shadow-2xl">
            <h4 className="text-3xl font-hanken font-bold text-text-main italic tracking-tight">Technical Safeguards</h4>
            <div className="space-y-6 text-text-sub font-sans italic leading-relaxed text-lg">
              <p>
                Drouvana implements industry-standard encryption for data at rest and in transit. Our database architecture utilizes multi-tenant isolation, ensuring that your professional documents are never accessible to other platform users.
              </p>
              <p>
                Our AI processing layer operates on ephemeral instances, meaning that while our models learn from patterns, your specific PII (Personally Identifiable Information) is never used for fundamental model training without explicit opt-in.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-4 text-secondary font-jetbrains text-xs uppercase tracking-widest font-black">
            <FileText className="w-4 h-4" />
            Governance Log
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Last Audit', val: 'Oct 2024' },
              { label: 'System Uptime', val: '99.98%' },
              { label: 'Data Encryption', val: 'AES-256' }
            ].map((stat, i) => (
              <div key={i} className="bg-surface-2/30 border border-white/5 rounded-2xl p-6 text-center">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted mb-2">{stat.label}</p>
                <p className="text-xl font-hanken font-bold text-text-main italic">{stat.val}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
