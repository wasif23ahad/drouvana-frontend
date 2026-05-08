'use client';

import React from 'react';
import ChatInterface from '@/components/ai/ChatInterface';
import { Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function AssistantPage() {
  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center text-xs text-text-muted gap-2 font-jetbrains uppercase tracking-widest mb-2">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Workspace</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-bold">AI Assistant</span>
          </div>
          <h1 className="text-3xl font-bold font-hanken">Career Coach</h1>
          <p className="text-text-sub text-sm">Always here to help you land the job.</p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ChatInterface />
      </div>
    </div>
  );
}
