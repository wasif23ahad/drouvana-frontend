"use client";

import React, { useState } from 'react';
import KanbanBoard from '@/components/dashboard/tracker/KanbanBoard';
import ApplicationTable from '@/components/dashboard/tracker/ApplicationTable';
import { LayoutGrid, List, ChevronRight, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function TrackerPage() {
  const [view, setView] = useState<'board' | 'table'>('board');

  return (
    <div className="h-full flex flex-col space-y-12 animate-in fade-in duration-700 pb-20 max-w-spacing-container-max mx-auto">
      {/* Breadcrumbs & Header */}
      <div className="space-y-4">
        <div className="flex items-center text-xs text-on-surface-variant gap-2 font-mono uppercase tracking-widest">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary font-bold">Tactical Tracker</span>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-on-surface italic tracking-tight flex items-center gap-4">
              Mission Pipeline
              <span className="bg-secondary/10 text-secondary text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1 rounded-full border border-secondary/20">Active Vectors</span>
            </h1>
            <p className="font-sans text-on-surface-variant italic text-lg leading-relaxed">Simulating deployment trajectories across target organizations.</p>
          </div>

          <div className="flex bg-surface-container-low/50 p-1.5 rounded-[1.5rem] border border-white/5 backdrop-blur-xl shadow-xl">
            <button 
              onClick={() => setView('board')}
              className={cn(
                "flex items-center gap-3 px-6 py-2.5 rounded-2xl font-mono text-[10px] uppercase tracking-widest font-black transition-all",
                view === 'board' ? "bg-gradient-primary text-white shadow-lg shadow-primary/20" : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              <LayoutGrid className="w-4 h-4" /> Board
            </button>
            <button 
              onClick={() => setView('table')}
              className={cn(
                "flex items-center gap-3 px-6 py-2.5 rounded-2xl font-mono text-[10px] uppercase tracking-widest font-black transition-all",
                view === 'table' ? "bg-gradient-primary text-white shadow-lg shadow-primary/20" : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              <List className="w-4 h-4" /> Table
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-[600px] relative">
         {/* Background Decor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/2 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        {view === 'board' ? <KanbanBoard /> : <ApplicationTable />}
      </div>
    </div>
  );
}
