'use client';

import React, { useMemo, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { MoreHorizontal, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PAGE_SIZE = 8;

const STATUS_COLORS: Record<string, string> = {
  SAVED: 'bg-slate-500/20 text-slate-400',
  APPLIED: 'bg-blue-500/20 text-blue-400',
  SCREENING: 'bg-amber-500/20 text-amber-400',
  INTERVIEW: 'bg-purple-500/20 text-purple-400',
  OFFER: 'bg-green-500/20 text-green-400',
  REJECTED: 'bg-red-500/20 text-red-400',
  WITHDRAWN: 'bg-gray-500/20 text-gray-400',
};

export function ApplicationList({ searchQuery }: { searchQuery: string }) {
  const { applications } = useAppStore();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  const filteredApps = useMemo(() => {
    let result = applications.filter(app => {
      const lower = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || app.jobTitle.toLowerCase().includes(lower) || app.company.toLowerCase().includes(lower);
      const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    if (sortBy === 'newest') result = result.sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime());
    else if (sortBy === 'oldest') result = result.sort((a, b) => new Date(a.dateApplied).getTime() - new Date(b.dateApplied).getTime());
    else if (sortBy === 'company') result = result.sort((a, b) => a.company.localeCompare(b.company));
    
    return result;
  }, [applications, searchQuery, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredApps.length / PAGE_SIZE));
  const pagedApps = filteredApps.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4 h-full">
      {/* Table Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-40 h-9 text-xs bg-surface-2 border-none rounded-xl">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="SAVED">Saved</SelectItem>
            <SelectItem value="APPLIED">Applied</SelectItem>
            <SelectItem value="SCREENING">Screening</SelectItem>
            <SelectItem value="INTERVIEW">Interview</SelectItem>
            <SelectItem value="OFFER">Offer</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setPage(1); }}>
          <SelectTrigger className="w-40 h-9 text-xs bg-surface-2 border-none rounded-xl">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="company">Company A-Z</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-text-muted ml-auto font-jetbrains">
          {filteredApps.length} result{filteredApps.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-y-auto rounded-2xl border border-border-subtle bg-surface">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-text-sub uppercase bg-surface-2 border-b border-border-subtle sticky top-0 z-10">
            <tr>
              <th className="px-6 py-4 font-medium rounded-tl-2xl">Company / Role</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium hidden md:table-cell">Platform</th>
              <th className="px-6 py-4 font-medium hidden lg:table-cell">Location</th>
              <th className="px-6 py-4 font-medium hidden sm:table-cell">Applied</th>
              <th className="px-6 py-4 font-medium text-right rounded-tr-2xl">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {pagedApps.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                  <Activity className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p>No applications match your filters.</p>
                </td>
              </tr>
            ) : (
              pagedApps.map((app) => (
                <tr key={app.id} className="hover:bg-surface-2/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-text-main">{app.jobTitle}</div>
                    <div className="text-text-sub mt-0.5 text-xs">{app.company}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[app.status] || 'bg-primary/20 text-primary'}`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-text-sub text-xs">{app.platform || '-'}</td>
                  <td className="px-6 py-4 hidden lg:table-cell text-text-sub text-xs">{app.location || 'Remote'}</td>
                  <td className="px-6 py-4 hidden sm:table-cell text-text-sub text-xs">
                    {format(new Date(app.dateApplied), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-text-sub hover:text-primary">
                      <Link href={`/dashboard/applications/${app.id}`}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-2">
          <Button
            variant="outline" size="icon"
            className="w-8 h-8 rounded-lg border-[var(--color-border-subtle)] bg-surface-2 text-text-muted hover:text-primary disabled:opacity-30"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? 'default' : 'outline'}
              className={`w-8 h-8 rounded-lg text-xs border-[var(--color-border-subtle)] ${page === i + 1 ? 'bg-primary text-white' : 'bg-surface-2 text-text-sub hover:text-primary'}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            variant="outline" size="icon"
            className="w-8 h-8 rounded-lg border-[var(--color-border-subtle)] bg-surface-2 text-text-muted hover:text-primary disabled:opacity-30"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
