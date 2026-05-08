'use client';

import React, { useMemo } from 'react';
import { JobStatus, useAppStore } from '@/lib/store';
import { formatDistanceToNow } from 'date-fns';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Building2, Calendar, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const COLUMNS: { id: JobStatus; title: string; colorClass: string }[] = [
  { id: 'SAVED', title: 'Saved', colorClass: 'border-l-[var(--color-status-saved)]' },
  { id: 'APPLIED', title: 'Applied', colorClass: 'border-l-[var(--color-status-applied)]' },
  { id: 'SCREENING', title: 'Screening', colorClass: 'border-l-[var(--color-status-screening)]' },
  { id: 'INTERVIEW', title: 'Interview', colorClass: 'border-l-[var(--color-status-interview)]' },
  { id: 'OFFER', title: 'Offer', colorClass: 'border-l-[var(--color-status-offer)]' },
  { id: 'REJECTED', title: 'Rejected', colorClass: 'border-l-[var(--color-status-rejected)]' },
  { id: 'WITHDRAWN', title: 'Withdrawn', colorClass: 'border-l-[var(--color-status-withdrawn)]' },
];

function SortableItem({ app }: { app: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: app.id, data: { type: 'Application', app } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const today = React.useMemo(() => new Date().getTime(), []);
  const daysSinceApplied = Math.floor((today - new Date(app.dateApplied).getTime()) / (1000 * 60 * 60 * 24));
  let dateColor = 'text-text-muted';
  if (app.status === 'APPLIED') {
    if (daysSinceApplied > 14) dateColor = 'text-error';
    else if (daysSinceApplied > 7) dateColor = 'text-warning';
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none pb-3">
      <Card className="hover:border-primary/50 transition-colors bg-surface border-border-subtle cursor-grab active:cursor-grabbing">
        <CardContent className="p-4 flex flex-col gap-3">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h4 className="font-semibold text-sm leading-tight mb-1">{app.jobTitle}</h4>
              <div className="flex items-center text-xs text-text-sub">
                <Building2 className="h-3 w-3 mr-1" /> {app.company}
              </div>
            </div>
            <Link href={`/dashboard/applications/${app.id}`} className="text-text-muted hover:text-text-main pointer-events-auto" onClick={(e) => e.stopPropagation()}>
              <MoreHorizontal className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <span className={`text-[10px] font-medium flex items-center ${dateColor}`}>
              <Calendar className="h-3 w-3 mr-1" />
              {daysSinceApplied}d ago
            </span>
            {app.platform && (
              <span className="text-[10px] bg-surface-2 text-text-sub px-2 py-0.5 rounded-full">
                {app.platform}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Column({ col, applications }: { col: typeof COLUMNS[0], applications: any[] }) {
  const { setNodeRef } = useSortable({
    id: col.id,
    data: { type: 'Column', col },
  });

  return (
    <div className="shrink-0 w-72 flex flex-col bg-surface-2/30 rounded-2xl h-full border border-border-subtle overflow-hidden">
      <div className={`p-4 border-b border-border-subtle bg-surface-2 flex items-center justify-between border-l-4 ${col.colorClass}`}>
        <h3 className="font-semibold text-sm">{col.title}</h3>
        <Badge variant="outline" className="bg-surface bg-opacity-50 text-[10px] py-0">{applications.length}</Badge>
      </div>
      <div ref={setNodeRef} className="flex-1 p-3 overflow-y-auto min-h-[150px]">
        <SortableContext items={applications.map(a => a.id)} strategy={verticalListSortingStrategy}>
          {applications.map(app => (
            <SortableItem key={app.id} app={app} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export function KanbanBoard({ searchQuery }: { searchQuery: string }) {
  const { applications, updateApplicationStatus } = useAppStore();
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      if (!searchQuery) return true;
      const lower = searchQuery.toLowerCase();
      return app.jobTitle.toLowerCase().includes(lower) || app.company.toLowerCase().includes(lower);
    });
  }, [applications, searchQuery]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeApp = applications.find(a => a.id === active.id);
    const overId = over.id as string;
    
    let targetStatus: JobStatus | undefined;
    
    if (COLUMNS.find(c => c.id === overId)) {
      targetStatus = overId as JobStatus;
    } else {
      const overApp = applications.find(a => a.id === overId);
      if (overApp) targetStatus = overApp.status;
    }

    if (activeApp && targetStatus && activeApp.status !== targetStatus) {
      updateApplicationStatus(activeApp.id, targetStatus);
    }
  };

  const activeApp = useMemo(() => applications.find(a => a.id === activeId), [activeId, applications]);

  return (
    <div className="h-full overflow-x-auto pb-4 custom-scrollbar">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-full gap-4 items-start pb-4 px-2">
          {COLUMNS.map(col => (
            <Column
              key={col.id}
              col={col}
              applications={filteredApps.filter(app => app.status === col.id)}
            />
          ))}
        </div>
        
        <DragOverlay>
          {activeApp ? (
             <Card className="bg-surface border-primary outline-2 outline-primary shadow-2xl opacity-80 cursor-grabbing w-72">
               <CardContent className="p-4 flex flex-col gap-3">
                 <div>
                   <h4 className="font-semibold text-sm leading-tight mb-1">{activeApp.jobTitle}</h4>
                   <div className="flex items-center text-xs text-text-sub">
                     <Building2 className="h-3 w-3 mr-1" /> {activeApp.company}
                   </div>
                 </div>
               </CardContent>
             </Card>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
