"use client";

import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter, 
  Loader2, 
  LayoutGrid, 
  List,
  MoreHorizontal,
  Calendar,
  ExternalLink,
  Target
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  SAVED: 'bg-slate-500/10 text-slate-500',
  APPLIED: 'bg-secondary/10 text-secondary',
  SCREENING: 'bg-primary/10 text-primary',
  INTERVIEW: 'bg-tertiary/10 text-tertiary',
  OFFER: 'bg-success/10 text-success',
  REJECTED: 'bg-error/10 text-error',
};

const KANBAN_COLUMNS = [
  { id: 'SAVED', title: 'Saved', color: 'bg-slate-500' },
  { id: 'APPLIED', title: 'Applied', color: 'bg-secondary' },
  { id: 'INTERVIEW', title: 'Interviewing', color: 'bg-primary' },
  { id: 'OFFER', title: 'Offer', color: 'bg-success' },
];

export default function ApplicationTracker() {
  const { status } = useSession();
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: viewMode === 'list' ? 10 : 50, // More for board view
      };
      
      if (debouncedSearch) params.search = debouncedSearch;

      const response = await api.get('/api/applications', { params });
      const source = response.data?.data || response.data?.applications || [];
      setApplications(source);
      setTotalCount(response.data?.pagination?.total || source.length);
      setTotalPages(response.data?.pagination?.pages || 1);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      setLoading(false);
      return;
    }
    if (status === 'authenticated') {
      fetchApplications();
    }
  }, [debouncedSearch, page, viewMode, status]);

  const renderKanban = () => {
    return (
      <div className="flex-1 overflow-x-auto pb-6 flex gap-6 min-h-[600px]">
        {KANBAN_COLUMNS.map((col) => {
          const colApps = applications.filter(app => {
             if (col.id === 'APPLIED') return app.status === 'APPLIED' || app.status === 'SCREENING';
             return app.status === col.id;
          });

          return (
            <div key={col.id} className="w-80 shrink-0 flex flex-col h-full bg-surface-container-low/30 rounded-xl border border-[var(--color-border-subtle)]">
              <div className="p-4 flex items-center justify-between border-b border-[var(--color-border-subtle)] shrink-0">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", col.color)} />
                  <h3 className="font-heading font-bold text-sm text-on-surface ">{col.title}</h3>
                  <span className="bg-surface-container text-on-surface-variant text-[10px] font-mono px-2 py-0.5 rounded-full">{colApps.length}</span>
                </div>
                <button className="text-on-surface-variant hover:text-on-surface"><MoreHorizontal className="w-4 h-4" /></button>
              </div>
              
              <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                {colApps.map((app) => (
                  <div key={app.id} className="bg-surface-container/80 backdrop-blur-lg p-4 rounded-xl border border-[var(--color-border-subtle)] hover:border-primary/50 transition-all group relative cursor-pointer shadow-sm hover:shadow-primary/5">
                    <div className="absolute top-3 right-3 bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold tracking-tighter">
                      92% MATCH
                    </div>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center shrink-0 border border-[var(--color-border-subtle)]">
                        <span className="text-primary font-bold text-lg">{app.company.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-bold text-sm text-on-surface group-hover:text-primary transition-colors truncate pr-12">{app.jobTitle}</h4>
                        <p className="text-xs text-on-surface-variant mt-0.5 font-sans">{app.company} • {app.location || 'Remote'}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 text-[10px] font-mono text-on-surface-variant uppercase tracking-widest border-t border-[var(--color-border-subtle)] pt-3">
                      <div className="flex items-center gap-1.5 opacity-70">
                        <Calendar className="w-3 h-3" />
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : ''}
                      </div>
                      <div className="flex items-center gap-1 bg-surface-variant/50 px-2 py-0.5 rounded text-[9px]">
                        {app.platform || 'Direct'}
                      </div>
                    </div>
                  </div>
                ))}
                {colApps.length === 0 && (
                  <div className="py-12 flex flex-col items-center justify-center text-center opacity-30 border border-dashed border-[var(--color-border-subtle)] rounded-xl">
                    <Target className="w-8 h-8 mb-2" />
                    <p className="text-[10px] uppercase font-mono tracking-widest">No Applications</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderList = () => {
    return (
      <div className="bg-surface-container-low border border-[var(--color-border-subtle)] rounded-xl overflow-hidden min-h-[400px] flex flex-col">
        <Table>
          <TableHeader className="bg-surface/50">
            <TableRow className="border-[var(--color-border-subtle)] hover:bg-transparent">
              <TableHead className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant p-6">Company</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Role</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Status</TableHead>
              <TableHead className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Applied</TableHead>
              <TableHead className="text-right p-6 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">Match</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id} className="border-[var(--color-border-subtle)] hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                <TableCell className="p-6">
                  <div className="font-heading font-bold text-on-surface ">{app.company}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium text-on-surface-variant">{app.jobTitle}</div>
                </TableCell>
                <TableCell>
                  <Badge className={cn("rounded-lg border-none font-mono text-[10px] uppercase tracking-widest px-2 py-0.5", STATUS_COLORS[app.status])}>
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-xs font-mono text-on-surface-variant uppercase">
                    {app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : ''}
                  </div>
                </TableCell>
                <TableCell className="text-right p-6">
                   <div className="flex items-center justify-end gap-2">
                      <span className="text-secondary font-mono text-[10px] font-bold">92%</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-on-surface-variant hover:text-primary">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                   </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Pagination only for list view */}
        <div className="p-6 border-t border-[var(--color-border-subtle)] flex items-center justify-between mt-auto">
          <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
            Showing {applications.length} of {totalCount} records
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="w-8 h-8 rounded-lg border-[var(--color-border-subtle)] bg-surface disabled:opacity-50" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-mono text-xs w-8 text-center">{page}</span>
            <Button 
              variant="outline" 
              size="icon" 
              className="w-8 h-8 rounded-lg border-[var(--color-border-subtle)] bg-surface disabled:opacity-50"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 flex flex-col h-full animate-in fade-in duration-500">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <Input 
            placeholder="Filter by company or role..." 
            className="pl-10 rounded-xl bg-surface-container border-[var(--color-border-subtle)] h-11 font-sans text-sm focus:border-primary transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-surface-container rounded-lg p-1 flex items-center border border-[var(--color-border-subtle)] h-11">
            <button 
              onClick={() => setViewMode('board')}
              className={cn(
                "px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all h-full",
                viewMode === 'board' ? "bg-surface-bright text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              Board
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={cn(
                "px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all h-full",
                viewMode === 'list' ? "bg-surface-bright text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              <List className="w-4 h-4" />
              List
            </button>
          </div>
          <Button variant="outline" className="h-11 border-[var(--color-border-subtle)] bg-surface-container text-on-surface-variant gap-2 rounded-xl font-mono text-[10px] uppercase tracking-widest">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : applications.length > 0 ? (
        viewMode === 'board' ? renderKanban() : renderList()
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-4 bg-surface-container-low rounded-3xl border border-[var(--color-border-subtle)]">
           <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center border border-[var(--color-border-subtle)]">
             <Target className="w-8 h-8 text-on-surface-variant" />
           </div>
           <div className="space-y-1">
             <h3 className="text-xl font-heading font-bold text-on-surface ">No results found</h3>
             <p className="text-on-surface-variant text-sm font-sans">Try adjusting your search or filters.</p>
           </div>
        </div>
      )}
    </div>
  );
}
