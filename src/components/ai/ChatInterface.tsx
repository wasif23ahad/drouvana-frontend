"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Paperclip, Zap, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  { t: "Analyze applications", d: "Review recent rejections", icon: Zap },
  { t: "Prep for interview", d: "Mock session for Google", icon: Bot },
  { t: "Tailor my resume", d: "Adjust for Stripe role", icon: Sparkles },
  { t: "Networking message", d: "Draft LinkedIn outreach", icon: Send },
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/chat/sse`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message: text, history: messages }),
      });

      if (!response.ok) throw new Error('Failed to connect to AI');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'delta') {
                assistantMessage += data.content;
                setMessages(prev => {
                  const last = prev[prev.length - 1];
                  return [...prev.slice(0, -1), { ...last, content: assistantMessage }];
                });
              }
            } catch (e) {
              console.error('Error parsing SSE chunk', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Strategic assessment failed. System recalibrating. Please retry.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] bg-surface-container-low/50 backdrop-blur-xl rounded-[32px] overflow-hidden border border-white/5 relative">
      {/* Header */}
      <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between bg-surface/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-on-surface italic">Career Assistant</h3>
            <p className="font-mono text-[9px] text-success flex items-center gap-1.5 uppercase tracking-[0.2em] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Strategic Mode Active
            </p>
          </div>
        </div>
        <button className="text-on-surface-variant hover:text-primary transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide relative"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-10 animate-in fade-in duration-1000">
            <div className="w-20 h-20 bg-gradient-primary rounded-[2rem] flex items-center justify-center shadow-[0_0_30px_rgba(192,193,255,0.2)]">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-heading font-bold text-on-surface italic tracking-tight">Accelerate your search</h2>
              <p className="text-on-surface-variant max-w-sm mx-auto font-sans">I am your AI career coach, equipped with your resume context and application data.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
              {SUGGESTIONS.map(s => (
                <button 
                  key={s.t}
                  onClick={() => handleSend(s.t)}
                  className="bg-surface-container p-6 rounded-2xl border border-white/5 hover:border-primary/50 hover:bg-white/5 transition-all text-left group relative overflow-hidden"
                >
                  <s.icon className="w-5 h-5 text-primary mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-heading font-bold text-on-surface text-sm italic mb-1">{s.t}</h3>
                  <p className="font-sans text-xs text-on-surface-variant">{s.d}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex items-start gap-4",
                m.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border",
                m.role === 'user' ? "bg-surface-container border-white/5" : "bg-primary/20 border-primary/20"
              )}>
                {m.role === 'user' ? <User className="w-5 h-5 text-on-surface-variant" /> : <Bot className="w-5 h-5 text-primary" />}
              </div>
              <div className={cn(
                "max-w-[80%] p-5 rounded-2xl text-sm leading-relaxed",
                m.role === 'user' 
                  ? "bg-gradient-primary text-white rounded-tr-none shadow-lg shadow-primary/10 font-medium" 
                  : "bg-surface-container text-on-surface-variant border border-white/5 rounded-tl-none font-sans"
              )}>
                {m.content}
                {i === messages.length - 1 && m.role === 'assistant' && isLoading && (
                  <span className="inline-block w-1.5 h-4 bg-primary ml-2 animate-pulse align-middle" />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input area */}
      <div className="p-8 bg-background border-t border-white/5 z-10 relative">
        <div className="absolute inset-x-8 top-8 bottom-8 bg-primary/5 blur-2xl rounded-full -z-10" />
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="relative flex items-center bg-surface-container rounded-2xl border border-white/10 focus-within:border-primary focus-within:shadow-[0_0_20px_rgba(192,193,255,0.1)] transition-all overflow-hidden"
        >
          <button type="button" className="p-4 text-on-surface-variant hover:text-primary transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything or type '/' for commands..."
            className="flex-1 bg-transparent border-none text-on-surface focus:ring-0 placeholder:text-on-surface-variant/40 py-5 px-2 font-sans text-sm"
          />
          <div className="flex items-center gap-2 pr-2">
            <button type="button" className="p-2 text-primary hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-primary text-on-primary w-10 h-10 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
        <p className="text-center mt-3 font-mono text-[9px] text-on-surface-variant/40 uppercase tracking-[0.3em]">
          Drouvana AI may provide suboptimal strategies. Verify critical details.
        </p>
      </div>
    </div>
  );
}
