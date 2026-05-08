"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Paperclip, MoreHorizontal, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  "Which applications need a follow-up?",
  "How's my resume for a Backend Engineer role?",
  "Write me a LinkedIn connection request for a recruiter at Stripe",
  "How should I prep for my Google interview?"
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi there! I am your Drouvana AI Coach. How can I help with your job search today?' }
  ]);
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

    // Simulated response logic for demo/dev if API is not connected
    // In production, this would use the SSE logic migrated previously
    setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `I'm analyzing your profile and the current job market. Based on your applications, I recommend focusing on your upcoming technical round at Stripe. Would you like to practice some system design questions?`
        }]);
        setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] border border-[var(--color-border-subtle)] rounded-2xl bg-[var(--color-surface)] overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-2)]/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
                <h2 className="font-bold font-hanken">Drouvana AI Coach</h2>
                <p className="text-xs text-text-muted flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    Always here to help you land the job.
                </p>
            </div>
        </div>
        <Button variant="ghost" size="icon" className="text-text-muted">
            <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[var(--color-bg-base)]"
      >
        {messages.length === 1 && (
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
             {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  className="text-left text-sm p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {s}
                </button>
             ))}
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                m.role === 'user' ? "ml-auto flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "h-9 w-9 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden border",
                m.role === 'assistant' ? "bg-primary/10 text-primary border-primary/10" : "bg-surface-2 text-text-muted border-white/5"
              )}>
                {m.role === 'assistant' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                m.role === 'user' 
                    ? "bg-primary text-white rounded-tr-none" 
                    : "bg-surface border border-[var(--color-border-subtle)] text-text-main rounded-tl-none"
              )}>
                {m.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
            <div className="flex gap-4 max-w-[85%]">
                <div className="h-9 w-9 rounded-full flex-shrink-0 flex items-center justify-center bg-primary/10 text-primary border border-primary/10">
                    <Bot className="h-4 w-4" />
                </div>
                <div className="p-4 rounded-2xl bg-surface border border-[var(--color-border-subtle)] text-text-sub text-sm flex gap-1 items-center">
                    <span className="animate-bounce delay-75">•</span>
                    <span className="animate-bounce delay-150">•</span>
                    <span className="animate-bounce delay-300">•</span>
                </div>
            </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface)]">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
          className="flex gap-3 max-w-4xl mx-auto"
        >
          <div className="flex-1 relative">
            <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your career coach anything..." 
                className="w-full rounded-full bg-[var(--color-bg-base)] border-[var(--color-border-subtle)] h-12 px-6 pr-12 focus-visible:ring-primary"
            />
            <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary h-8 w-8">
                <Paperclip className="h-4 w-4" />
            </Button>
          </div>
          <Button type="submit" disabled={!input.trim() || isLoading} className="h-12 w-12 rounded-full shrink-0 shadow-lg shadow-primary/20 p-0 border-none">
            <Send className="h-5 w-5" />
          </Button>
        </form>
        <p className="text-center mt-3 font-jetbrains text-[9px] text-text-muted uppercase tracking-[0.2em]">
            Drouvana AI Assistant • Operational Node
        </p>
      </div>
    </div>
  );
}
