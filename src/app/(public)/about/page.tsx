import React from 'react';
import { Target, Users, Zap, Shield } from 'lucide-react';

const FEATURES = [
  { icon: Zap, title: 'Efficiency', desc: 'Reduce your application time by 80% with automated tailoring.' },
  { icon: Target, title: 'Precision', desc: 'AI-driven ATS optimization ensures your resume lands on the right desks.' },
  { icon: Users, title: 'Growth', desc: 'Dedicated career coaching to help you navigate interviews and negotiations.' },
  { icon: Shield, title: 'Reliability', desc: 'Your data is encrypted and protected with industry-standard security.' },
];

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-20 py-20 px-4">
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight italic">
          Elevating the <span className="text-primary">Human</span> in Job Search
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          Drouvana was built with a single mission: to eliminate the frustration of the modern job search through intelligent, agentic AI that works for you, not against you.
        </p>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {FEATURES.map((f, i) => (
          <div key={i} className="glass-card p-8 rounded-[32px] space-y-4 hover:border-primary/40 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <f.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Narrative Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-6">
          <h2 className="text-4xl font-bold tracking-tight">The Drouvana Philosophy</h2>
          <p className="text-muted-foreground leading-relaxed">
            In an era where companies use AI to filter candidates out, we believe candidates should have their own AI to get filtered in. Drouvana is your personal agent in the competitive world of high-tech hiring.
          </p>
          <div className="space-y-4">
            {[
              "100% Free Tier AI Access",
              "Agentic Architecture for Multi-Tasking",
              "Data-Driven Career Insights",
              "Real-Time Response Generation"
            ].map(item => (
              <div key={item} className="flex items-center gap-3 font-bold text-sm">
                <div className="w-2 h-2 rounded-full bg-primary" />
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card aspect-square rounded-[40px] bg-primary/5 flex items-center justify-center border-primary/20">
          <Target className="w-32 h-32 text-primary/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
