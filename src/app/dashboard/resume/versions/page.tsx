'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Trash2, ChevronRight, Loader2, RefreshCw, Target, Calendar, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { toast } from 'sonner';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface ResumeVersion {
  id: string;
  name: string | null;
  templateId: string | null;
  atsScore: number | null;
  applicationId: string | null;
  createdAt: string;
  updatedAt: string;
}

function atsColor(score: number | null): string {
  if (score === null) return 'border-white/10 bg-white/5 text-on-surface-variant';
  if (score >= 80) return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
  if (score >= 60) return 'border-amber-500/30 bg-amber-500/10 text-amber-400';
  return 'border-red-500/30 bg-red-500/10 text-red-400';
}

export default function ResumeVersionsPage() {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/resume/versions');
      setVersions(res.data?.data || []);
    } catch {
      toast.error('Failed to load resume versions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVersions(); }, []);

  const handleDelete = async (id: string, name: string | null) => {
    if (!confirm(`Delete "${name || 'this version'}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/resume/versions/${id}`);
      setVersions(prev => prev.filter(v => v.id !== id));
      toast.success('Resume version deleted');
    } catch {
      toast.error('Failed to delete version');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center text-xs text-text-muted gap-2 font-jetbrains uppercase tracking-widest">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/dashboard/resume" className="hover:text-primary transition-colors">Resume</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary font-bold">Saved Versions</span>
        </div>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold font-hanken text-text-main flex items-center gap-3">
              <FileText className="w-7 h-7 text-primary" />
              Resume Versions
            </h1>
            <p className="text-text-sub text-sm mt-1">
              {loading ? 'Loading...' : `${versions.length} saved version${versions.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={fetchVersions}
              variant="outline"
              size="sm"
              disabled={loading}
              className="gap-2 border-white/10 text-xs rounded-xl"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Link href="/dashboard/builder">
              <Button size="sm" className="gap-2 border-none shadow-lg shadow-primary/20 text-xs rounded-xl">
                <Layers className="w-3.5 h-3.5" />
                Open Builder
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-8 h-8 animate-spin text-primary opacity-40" />
        </div>
      ) : versions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-2xl">
          <FileText className="w-14 h-14 text-text-muted mb-4 opacity-30" />
          <h3 className="text-sm font-bold font-hanken text-text-sub mb-2">No saved versions yet</h3>
          <p className="text-xs text-text-muted max-w-xs mb-6">
            Use the Resume Builder to create and save tailored resume versions for different roles.
          </p>
          <Link href="/dashboard/builder">
            <Button size="sm" className="gap-2 border-none shadow-lg shadow-primary/20 text-xs rounded-xl">
              <Layers className="w-3.5 h-3.5" /> Open Resume Builder
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {versions.map(v => (
            <div
              key={v.id}
              className="bg-surface/50 border border-white/5 rounded-2xl p-5 hover:border-primary/20 transition-all group flex flex-col gap-4"
            >
              {/* Top: name + ATS badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-text-main truncate">
                    {v.name || 'Untitled Version'}
                  </h3>
                  {v.templateId && (
                    <p className="text-[11px] text-text-muted mt-0.5 capitalize">
                      Template: {v.templateId}
                    </p>
                  )}
                </div>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-mono shrink-0 ${atsColor(v.atsScore)}`}
                >
                  {v.atsScore !== null ? (
                    <span className="flex items-center gap-1">
                      <Target className="w-2.5 h-2.5" />
                      {v.atsScore}% ATS
                    </span>
                  ) : (
                    'No score'
                  )}
                </Badge>
              </div>

              {/* Meta */}
              <div className="space-y-1.5 text-[11px] text-text-muted">
                {v.applicationId && (
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                    <Link
                      href={`/dashboard/applications/${v.applicationId}`}
                      className="hover:text-primary transition-colors truncate"
                    >
                      Linked application →
                    </Link>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 shrink-0" />
                  Saved {formatDistanceToNow(new Date(v.createdAt), { addSuffix: true })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-white/5 mt-auto">
                <Button
                  onClick={() => handleDelete(v.id, v.name)}
                  disabled={deletingId === v.id}
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2.5 text-xs gap-1.5 text-error hover:text-error hover:bg-error/10 ml-auto"
                >
                  {deletingId === v.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
