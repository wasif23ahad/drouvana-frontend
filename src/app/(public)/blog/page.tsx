import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const POSTS = [
  {
    title: "Mastering the AI-Driven Job Market",
    excerpt: "How to leverage agentic AI to gain a competitive edge in 2026.",
    date: "May 12, 2026",
    readTime: "5 min",
    category: "Strategy",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800"
  },
  {
    title: "ATS Optimization: Beyond Keywords",
    excerpt: "Why the context of your achievements matters more than simple keyword stuffing.",
    date: "May 08, 2026",
    readTime: "8 min",
    category: "Technical",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800"
  },
  {
    title: "The Future of Professional Networking",
    excerpt: "Using AI to craft personalized LinkedIn outreach that actually gets responses.",
    date: "May 05, 2026",
    readTime: "4 min",
    category: "Networking",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800"
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-6xl mx-auto py-20 px-4 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <h1 className="text-5xl font-black tracking-tight italic">Career <span className="text-primary">Insights</span></h1>
          <p className="text-xl text-muted-foreground max-w-xl">Deep dives into the intersection of artificial intelligence and professional growth.</p>
        </div>
        <div className="flex gap-4">
          {['All', 'Strategy', 'Technical', 'Networking'].map(c => (
            <button key={c} className="px-4 py-2 rounded-xl border border-border/50 text-xs font-bold uppercase tracking-widest hover:border-primary transition-colors">
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {POSTS.map((post, i) => (
          <div key={i} className="glass-card rounded-[32px] overflow-hidden group border-white/5 bg-white/5 hover:border-primary/20 transition-all flex flex-col h-full">
            <div className="relative aspect-video overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                {post.category}
              </div>
            </div>
            <div className="p-8 flex-1 flex flex-col space-y-4">
              <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
              </div>
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors leading-tight">{post.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{post.excerpt}</p>
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary group/btn">
                Read Full Article <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
