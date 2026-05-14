import React from 'react';
import { Search, HelpCircle, Book, MessageCircle, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';

const FAQS = [
  { q: "Is Drouvana really free?", a: "Yes! Our core agentic AI features are powered by free-tier models (NVIDIA NIM and Gemini Flash), so you can use them at no cost." },
  { q: "How secure is my resume data?", a: "We encrypt all personal data and never share your resume with third parties without your explicit permission." },
  { q: "What is an 'Agentic' AI?", a: "Agentic AI refers to AI systems that can plan and execute complex tasks autonomously, such as parsing a JD and tailoring a resume in one flow." },
  { q: "Can I use Drouvana for multiple roles?", a: "Absolutely. Your dashboard allows you to track and manage as many applications as you need." },
];

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto py-20 px-4 space-y-16">
      {/* Search Header */}
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-black tracking-tight ">How can we <span className="text-primary">Help</span>?</h1>
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input 
            placeholder="Search help articles, guides, and FAQs..." 
            className="h-16 pl-12 rounded-[24px] text-lg bg-white/5 border-[var(--color-border-subtle)]"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Book, title: 'Guides', count: '12 Articles' },
          { icon: FileText, title: 'Policies', count: '4 Articles' },
          { icon: MessageCircle, title: 'Support', count: 'Live Chat' },
        ].map((c, i) => (
          <div key={i} className="glass-card p-6 rounded-[32px] text-center space-y-2 border-[var(--color-border-subtle)] bg-white/5 hover:border-primary/20 transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <c.icon className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-bold">{c.title}</h4>
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{c.count}</p>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <HelpCircle className="text-primary w-6 h-6" />
          <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="glass-card p-8 rounded-[32px] border-[var(--color-border-subtle)] bg-white/5 space-y-2 group hover:bg-white/[0.07] transition-all">
              <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{faq.q}</h4>
              <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="p-10 rounded-[40px] bg-primary/5 border border-primary/20 text-center space-y-4">
        <h3 className="text-2xl font-bold">Still have questions?</h3>
        <p className="text-muted-foreground">Our support agents are available 24/7 to assist you.</p>
        <button className="h-12 px-8 bg-primary text-white rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20">
          Contact Support Team
        </button>
      </div>
    </div>
  );
}
