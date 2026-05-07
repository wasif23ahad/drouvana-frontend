import React from 'react';
import KanbanBoard from '@/components/dashboard/tracker/KanbanBoard';

export default function TrackerPage() {
  return (
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Tracker</h1>
        <p className="text-muted-foreground">Manage your applications and move them through different stages.</p>
      </div>

      <div className="flex-1 min-h-0">
        <KanbanBoard />
      </div>
    </div>
  );
}
