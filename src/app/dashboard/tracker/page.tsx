"use client";

import React, { useState } from 'react';
import KanbanBoard from '@/components/dashboard/tracker/KanbanBoard';
import ApplicationTable from '@/components/dashboard/tracker/ApplicationTable';
import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TrackerPage() {
  const [view, setView] = useState<'board' | 'table'>('board');

  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight italic">Job <span className="text-primary">Tracker</span></h1>
          <p className="text-muted-foreground">Manage your applications and move them through different stages.</p>
        </div>

        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
          <button 
            onClick={() => setView('board')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
              view === 'board' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-white"
            )}
          >
            <LayoutGrid className="w-4 h-4" /> Board
          </button>
          <button 
            onClick={() => setView('table')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
              view === 'table' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-white"
            )}
          >
            <List className="w-4 h-4" /> Table
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {view === 'board' ? <KanbanBoard /> : <ApplicationTable />}
      </div>
    </div>
  );
}
