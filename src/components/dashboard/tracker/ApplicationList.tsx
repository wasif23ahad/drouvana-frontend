'use client';

import React, { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { MoreHorizontal, ExternalLink, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function ApplicationList({ searchQuery }: { searchQuery: string }) {
  const { applications } = useAppStore();

  const filteredApps = useMemo(() => {
    return applications
      .filter(app => {
        if (!searchQuery) return true;
        const lower = searchQuery.toLowerCase();
        return app.jobTitle.toLowerCase().includes(lower) || app.company.toLowerCase().includes(lower);
      })
      .sort((a, b) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime());
  }, [applications, searchQuery]);

  return (
    <div className="h-full overflow-y-auto rounded-2xl border border-border-subtle bg-surface">
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
          {filteredApps.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                <Activity className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <p>No applications found.</p>
              </td>
            </tr>
          ) : (
            filteredApps.map((app) => (
              <tr key={app.id} className="hover:bg-surface-2/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-semibold text-text-main">{app.jobTitle}</div>
                  <div className="text-text-sub mt-0.5">{app.company}</div>
                </td>
                <td className="px-6 py-4">
                  <Badge variant={app.status.toLowerCase() as any}>{app.status.replace('_', ' ')}</Badge>
                </td>
                <td className="px-6 py-4 hidden md:table-cell text-text-sub">
                  {app.platform || '-'}
                </td>
                <td className="px-6 py-4 hidden lg:table-cell text-text-sub">
                  {app.location || '-'}
                </td>
                <td className="px-6 py-4 hidden sm:table-cell text-text-sub">
                  {format(new Date(app.dateApplied), 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/dashboard/applications/${app.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-text-sub hover:text-primary">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
