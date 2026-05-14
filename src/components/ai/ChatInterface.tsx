"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MoreHorizontal, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';
import { useSession, getSession, signOut } from 'next-auth/react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  "Which of my applications need a follow-up this week?",
  "What are the top 5 things I should prepare for a technical interview?",
  "Help me write a LinkedIn connection request to a recruiter at Stripe",
  "What salary should I negotiate for a Senior Engineer role at a Series B startup?",
  "Review my job search strategy and suggest improvements",
  "How do I handle a rejection professionally and turn it into a networking opportunity?",
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function ChatInterface() {
  const { data: session } = useSession();
  const { applications } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi there! I\'m your Drouvana AI Career Coach. I can help with interview prep, resume advice, email drafts, and job search strategy. What can I help you with today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingContent, setStreamingContent] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setError(null);
    const userMessage: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setStreamingContent('');

    // Build context from real user data
    const context = {
      totalApplications: applications.length,
      recentApplications: applications.slice(0, 5).map(a => ({
        jobTitle: a.jobTitle,
        company: a.company,
        status: a.status,
      })),
      responseRate: applications.length > 0
        ? Math.round((applications.filter(a => ['INTERVIEW', 'OFFER'].includes(a.status)).length / applications.length) * 100)
        : 0,
    };

    // Build history for multi-turn (last 20 messages)
    const history = updatedMessages.slice(-20).map(m => ({
      role: m.role,
      content: m.content,
    }));

    try {
      abortRef.current = new AbortController();

      // Get the freshest token: prefer localStorage cache (kept up-to-date by api.ts interceptor),
      // fall back to the session, then force a fresh session fetch.
      const getToken = async (): Promise<string | null> => {
        let token = localStorage.getItem('drouvana_cached_token');
        if (!token) {
          const s = await getSession();
          token = (s?.user as any)?.accessToken || (s as any)?.accessToken || null;
          if (token) localStorage.setItem('drouvana_cached_token', token);
        }
        return token;
      };

      const doPost = (t: string | null) => fetch(`${API_URL}/api/ai/chat/sse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(t ? { Authorization: `Bearer ${t}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify({ history, context }),
        signal: abortRef.current!.signal,
      });

      let token = await getToken();
      let response = await doPost(token);

      // Stale cached token — clear and retry once with a fresh session token
      if (response.status === 401) {
        localStorage.removeItem('drouvana_cached_token');
        const freshSession = await getSession();
        token = (freshSession?.user as any)?.accessToken || (freshSession as any)?.accessToken || null;
        if (!token) {
          signOut({ callbackUrl: '/login?reason=session_expired' }).catch(() => {});
          return;
        }
        localStorage.setItem('drouvana_cached_token', token);
        response = await doPost(token);
      }

      if (!response.ok) {
        if (response.status === 401) {
          // Refresh token is also dead — force sign-out
          localStorage.removeItem('drouvana_cached_token');
          signOut({ callbackUrl: '/login?reason=session_expired' }).catch(() => {});
          return;
        }
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (!reader) throw new Error('No response body');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === 'delta' && data.content) {
              fullContent += data.content;
              setStreamingContent(fullContent);
            } else if (data.type === 'complete') {
              break;
            } else if (data.type === 'error') {
              throw new Error(data.message || 'AI error');
            }
          } catch (parseErr) {
            // Skip malformed SSE lines
          }
        }
      }

      // Commit the streamed message
      setMessages(prev => [...prev, { role: 'assistant', content: fullContent }]);
      setStreamingContent('');
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error('Chat SSE error:', err);
      setError(err.message || 'Failed to connect to AI. Please try again.');
      setMessages(prev => prev.filter((_, i) => i !== prev.length - 1 || prev[prev.length-1].role !== 'user'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      setMessages(prev => prev.filter(m => !(m.role === 'user' && m.content === lastUserMsg.content)));
      handleSend(lastUserMsg.content);
    }
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
              Powered by NVIDIA NIM + Gemini
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
        {/* Suggestion chips — only shown before first user message */}
        {messages.length === 1 && (
          <div className="mb-6 mt-2">
            <p className="text-xs text-text-muted font-jetbrains uppercase tracking-widest mb-3">Suggested prompts</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  className="text-left text-sm p-3.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary transition-all hover:scale-[1.01] active:scale-[0.99] leading-snug"
                >
                  {s}
                </button>
              ))}
            </div>
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
                  ? "bg-primary text-white rounded-tr-none whitespace-pre-wrap"
                  : "bg-surface border border-[var(--color-border-subtle)] text-text-main rounded-tl-none w-full overflow-x-auto"
              )}>
                {m.role === 'user' ? m.content : renderMarkdown(m.content)}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Streaming response bubble */}
        {isLoading && streamingContent && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 max-w-[85%] w-full"
          >
            <div className="h-9 w-9 rounded-full flex-shrink-0 flex items-center justify-center bg-primary/10 text-primary border border-primary/10">
              <Bot className="h-4 w-4" />
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-[var(--color-border-subtle)] text-text-main rounded-tl-none text-sm leading-relaxed flex-1 overflow-x-auto">
              {renderMarkdown(streamingContent)}
              <span className="inline-block w-1.5 h-4 bg-primary animate-pulse mt-2 rounded-sm" />
            </div>
          </motion.div>
        )}

        {/* Loading dots (before streaming starts) */}
        {isLoading && !streamingContent && (
          <div className="flex gap-4 max-w-[85%]">
            <div className="h-9 w-9 rounded-full flex-shrink-0 flex items-center justify-center bg-primary/10 text-primary border border-primary/10">
              <Bot className="h-4 w-4" />
            </div>
            <div className="p-4 rounded-2xl bg-surface border border-[var(--color-border-subtle)] text-text-sub text-sm flex gap-1 items-center">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>•</span>
              <span className="animate-bounce" style={{ animationDelay: '150ms' }}>•</span>
              <span className="animate-bounce" style={{ animationDelay: '300ms' }}>•</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="flex-1">{error}</span>
            <Button variant="ghost" size="sm" className="text-error hover:bg-error/10 gap-1.5 h-8" onClick={handleRetry}>
              <RefreshCw className="h-3 w-3" /> Retry
            </Button>
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
              className="w-full rounded-full bg-[var(--color-bg-base)] border-[var(--color-border-subtle)] h-12 px-6 focus-visible:ring-primary"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-12 w-12 rounded-full shrink-0 shadow-lg shadow-primary/20 p-0 border-none"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
        <p className="text-center mt-3 font-jetbrains text-[9px] text-text-muted uppercase tracking-[0.2em]">
          Drouvana AI • NVIDIA NIM (Llama 3.1) + Gemini Fallback • Real-time Streaming
        </p>
      </div>
    </div>
  );
}

// Helper for inline bolding formatting — eye-soothing crisp white text
const formatInline = (line: string): React.ReactNode[] => {
  if (!line) return [];
  const parts = line.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

// State-of-the-art line-by-line native React Markdown parser
const renderMarkdown = (text: string) => {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="space-y-1.5 w-full text-text-main">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={lineIdx} className="h-1.5" />;

        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={lineIdx} className="font-bold text-white text-base mt-3 mb-1">
              {formatInline(trimmed.replace(/^###\s+/, ''))}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={lineIdx} className="font-bold text-white text-lg mt-3 mb-1 border-b border-white/10 pb-1">
              {formatInline(trimmed.replace(/^##\s+/, ''))}
            </h3>
          );
        }
        if (trimmed.startsWith('# ')) {
          return (
            <h2 key={lineIdx} className="font-bold text-white text-xl mt-4 mb-1 border-b border-white/10 pb-1">
              {formatInline(trimmed.replace(/^#\s+/, ''))}
            </h2>
          );
        }

        const isListItem = trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*');
        const textContent = trimmed.replace(/^[-•*]\s*/, '');
        return (
          <div key={lineIdx} className={cn(isListItem ? "flex gap-2 pl-2.5" : "", "text-sm leading-relaxed text-text-main")}>
            {isListItem && <span className="text-white/60 select-none mt-0.5">•</span>}
            <span className="flex-1">{formatInline(textContent)}</span>
          </div>
        );
      })}
    </div>
  );
};
