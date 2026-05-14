'use client';

import { useState } from 'react';
import { KanbanSquare, List, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KanbanBoard } from '@/components/dashboard/tracker/KanbanBoard';
import { ApplicationList } from '@/components/dashboard/tracker/ApplicationList';
import { AddApplicationModal } from '@/components/dashboard/tracker/AddApplicationModal';

export default function TrackerPage() {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="flex h-full flex-col gap-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-hanken text-text-main">Job Tracker</h1>
          <p className="text-text-sub text-sm">Visualize and manage your multi-vector deployment performance.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 min-w-[140px] sm:flex-none sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              placeholder="Filter nodes..."
              className="pl-10 bg-surface-2 border-none rounded-xl h-11 focus-visible:ring-primary w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex bg-surface rounded-xl border border-white/5 p-1 shadow-lg">
              <button
                onClick={() => setView('kanban')}
                className={`p-2.5 rounded-lg transition-all ${view === 'kanban' ? 'bg-surface-2 text-primary shadow-sm' : 'text-text-muted hover:text-text-main'}`}
              >
                <KanbanSquare className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2.5 rounded-lg transition-all ${view === 'list' ? 'bg-surface-2 text-primary shadow-sm' : 'text-text-muted hover:text-text-main'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <Button onClick={() => setAddOpen(true)} className="gap-2 rounded-xl h-11 px-4 sm:px-6 border-none shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" /> Add Node
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {view === 'kanban' ? (
           <KanbanBoard searchQuery={search} />
        ) : (
           <ApplicationList searchQuery={search} />
        )}
      </div>

      <AddApplicationModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
