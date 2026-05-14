'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight, ExternalLink, MapPin, DollarSign, Calendar,
  Copy, CheckCircle2, Briefcase, Star, Zap, FileText,
  MessageSquare, ArrowRight, Clock, Tag, Award, Target, Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  SAVED: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  APPLIED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  SCREENING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  INTERVIEW: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  OFFER: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30',
  WITHDRAWN: 'bg-slate-400/20 text-slate-400 border-slate-400/30',
};

const STATUS_ORDER = ['SAVED', 'APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER'];

interface Activity {
  id: string;
  type: string;
  description: string;
  createdAt: string;
}

interface ParsedData {
  requiredSkills?: string[];
  preferredSkills?: string[];
  atsKeywords?: string[];
  roleInsights?: string;
  experienceLevel?: string;
  industryVertical?: string;
}

interface ApplicationDetail {
  id: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  location?: string;
  locationType?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  status: string;
  platform?: string;
  source?: string;
  jobUrl?: string;
  jobDescription?: string;
  appliedAt?: string;
  deadline?: string;
  notes?: string;
  priority?: string;
  parsedData?: ParsedData;
  createdAt: string;
  updatedAt: string;
  activities?: Activity[];
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [app, setApp] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get(`/api/applications/${id}`)
      .then(res => setApp(res.data.data))
      .catch(() => toast.error('Failed to load application'))
      .finally(() => setLoading(false));
  }, [id]);

  const copyJD = () => {
    if (!app?.jobDescription) return;
    navigator.clipboard.writeText(app.jobDescription);
    setCopied(true);
    toast.success('Job description copied');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-text-sub">Application not found.</p>
        <Button variant="outline" onClick={() => router.push('/dashboard/tracker')}>
          Back to Tracker
        </Button>
      </div>
    );
  }

  const parsed = app.parsedData as ParsedData | null;
  const statusIndex = STATUS_ORDER.indexOf(app.status);
  const isTerminal = app.status === 'REJECTED' || app.status === 'WITHDRAWN';

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500">
      {/* Breadcrumb */}
      <div className="flex items-center text-xs text-text-muted gap-2 font-mono uppercase tracking-widest">
        <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/dashboard/tracker" className="hover:text-primary transition-colors">Tracker</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-primary font-bold truncate max-w-xs">{app.jobTitle}</span>
      </div>

      {/* Header */}
      <Card className="border-[var(--color-border-subtle)] bg-white/[0.03]">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn(
                  'text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border',
                  STATUS_COLORS[app.status] ?? 'bg-slate-500/20 text-slate-400 border-slate-500/30',
                )}>
                  {app.status}
                </span>
                {app.platform && (
                  <span className="text-xs bg-white/5 border border-[var(--color-border-subtle)] text-text-sub px-3 py-1 rounded-full uppercase tracking-widest">
                    {app.platform.replace(/_/g, ' ')}
                  </span>
                )}
                {app.priority === 'HIGH' && (
                  <span className="text-xs bg-amber-500/20 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                    <Star className="w-3 h-3" /> High Priority
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold font-hanken text-on-surface">{app.jobTitle}</h1>
                <p className="text-xl text-text-sub mt-1">{app.company}</p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                {app.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {app.location}{app.locationType ? ` · ${app.locationType}` : ''}
                  </span>
                )}
                {(app.salaryMin || app.salaryMax) && (
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5" />
                    {app.salaryMin && app.salaryMax
                      ? `${app.salaryMin.toLocaleString()} – ${app.salaryMax.toLocaleString()}`
                      : (app.salaryMin ?? app.salaryMax)?.toLocaleString()}
                    {app.currency ? ` ${app.currency}` : ''}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Applied {formatDate(app.appliedAt ?? app.createdAt)}
                </span>
                {app.deadline && (
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Clock className="w-3.5 h-3.5" />
                    Deadline {formatDate(app.deadline)}
                  </span>
                )}
              </div>
            </div>

            {app.jobUrl && (
              <Button asChild size="sm" variant="outline" className="border-[var(--color-border-subtle)] rounded-xl gap-2 shrink-0">
                <a href={app.jobUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5" /> View Job
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: main content */}
        <div className="lg:col-span-2 space-y-6">

          {/* AI Skills Analysis */}
          {parsed && (parsed.requiredSkills?.length || parsed.preferredSkills?.length || parsed.atsKeywords?.length) && (
            <Card className="border-[var(--color-border-subtle)] bg-white/[0.03]">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-hanken flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" /> AI Skills Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!!parsed.requiredSkills?.length && (
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2 font-mono">Required</p>
                    <div className="flex flex-wrap gap-2">
                      {parsed.requiredSkills.map(skill => (
                        <span key={skill} className="text-xs bg-primary/15 text-primary border border-primary/25 px-2.5 py-1 rounded-full font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {!!parsed.preferredSkills?.length && (
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2 font-mono">Preferred</p>
                    <div className="flex flex-wrap gap-2">
                      {parsed.preferredSkills.map(skill => (
                        <span key={skill} className="text-xs bg-sky-500/15 text-sky-400 border border-sky-500/25 px-2.5 py-1 rounded-full font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {!!parsed.atsKeywords?.length && (
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-widest mb-2 font-mono">ATS Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {parsed.atsKeywords.map(kw => (
                        <span key={kw} className="text-xs bg-violet-500/15 text-violet-400 border border-violet-500/25 px-2.5 py-1 rounded-full font-medium">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {parsed.roleInsights && (
                  <div className="pt-2 border-t border-[var(--color-border-subtle)]">
                    <p className="text-[10px] text-text-muted uppercase tracking-widest mb-1 font-mono">Role Insights</p>
                    <p className="text-sm text-text-sub">{parsed.roleInsights}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Application Pipeline */}
          <Card className="border-[var(--color-border-subtle)] bg-white/[0.03]">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-hanken flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" /> Application Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                {STATUS_ORDER.map((s, i) => {
                  const isActive = !isTerminal && i <= statusIndex;
                  const isCurrent = s === app.status;
                  return (
                    <div key={s} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className={cn(
                          'w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all',
                          isCurrent ? 'border-primary bg-primary text-white'
                            : isActive ? 'border-primary/50 bg-primary/20 text-primary'
                            : 'border-[var(--color-border-subtle)] bg-white/5 text-text-muted',
                        )}>
                          {i + 1}
                        </div>
                        <span className={cn(
                          'text-[9px] uppercase tracking-widest font-mono whitespace-nowrap',
                          isCurrent ? 'text-primary font-bold' : isActive ? 'text-text-sub' : 'text-text-muted',
                        )}>
                          {s}
                        </span>
                      </div>
                      {i < STATUS_ORDER.length - 1 && (
                        <div className={cn(
                          'h-0.5 flex-1 mx-1 transition-all',
                          isActive && i < statusIndex ? 'bg-primary/50' : 'bg-white/5',
                        )} />
                      )}
                    </div>
                  );
                })}
              </div>
              {isTerminal && (
                <div className={cn(
                  'mt-4 text-center text-xs uppercase tracking-widest font-mono px-3 py-2 rounded-xl',
                  app.status === 'REJECTED'
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
                )}>
                  {app.status === 'REJECTED' ? 'Application Rejected' : 'Application Withdrawn'}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Description */}
          {app.jobDescription && (
            <Card className="border-[var(--color-border-subtle)] bg-white/[0.03]">
              <CardHeader className="pb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-hanken flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Job Description
                </CardTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs gap-1.5 text-text-muted hover:text-on-surface h-8"
                  onClick={copyJD}
                >
                  {copied
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="max-h-72 overflow-y-auto pr-2 text-sm text-text-sub leading-relaxed whitespace-pre-wrap">
                  {app.jobDescription}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Activity Log */}
          {!!app.activities?.length && (
            <Card className="border-[var(--color-border-subtle)] bg-white/[0.03]">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-hanken flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" /> Activity Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {app.activities.map(act => (
                    <div key={act.id} className="flex gap-3 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-[7px] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-text-sub">{act.description}</p>
                        <p className="text-xs text-text-muted mt-0.5">{timeAgo(act.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {app.notes && (
            <Card className="border-[var(--color-border-subtle)] bg-white/[0.03]">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-hanken flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" /> Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-sub leading-relaxed whitespace-pre-wrap">{app.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <Card className="border-[var(--color-border-subtle)] bg-white/[0.03]">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-mono text-text-muted uppercase tracking-widest">
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full justify-between rounded-xl h-11 border-[var(--color-border-subtle)]" variant="outline">
                <Link href={`/dashboard/workspace?appId=${app.id}`}>
                  <span className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-primary" /> Tailor Resume
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
                </Link>
              </Button>
              <Button asChild className="w-full justify-between rounded-xl h-11 border-[var(--color-border-subtle)]" variant="outline">
                <Link href={`/dashboard/cover-letter?jobTitle=${encodeURIComponent(app.jobTitle)}&company=${encodeURIComponent(app.company)}`}>
                  <span className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-sky-400" /> Cover Letter
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
                </Link>
              </Button>
              <Button asChild className="w-full justify-between rounded-xl h-11 border-[var(--color-border-subtle)]" variant="outline">
                <Link href={`/dashboard/outreach?jobTitle=${encodeURIComponent(app.jobTitle)}&company=${encodeURIComponent(app.company)}`}>
                  <span className="flex items-center gap-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-violet-400" /> Email Draft
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
                </Link>
              </Button>
              <Button asChild className="w-full justify-between rounded-xl h-11 border-[var(--color-border-subtle)]" variant="outline">
                <Link href="/dashboard/assistant">
                  <span className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-amber-400" /> Ask Coach
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Meta Info */}
          <Card className="border-[var(--color-border-subtle)] bg-white/[0.03]">
            <CardContent className="p-4 space-y-3">
              {[
                { label: 'Added', value: formatDate(app.createdAt) },
                { label: 'Updated', value: formatDate(app.updatedAt) },
                ...(app.source ? [{ label: 'Source', value: app.source }] : []),
                ...(parsed?.experienceLevel ? [{ label: 'Level', value: parsed.experienceLevel }] : []),
                ...(parsed?.industryVertical ? [{ label: 'Industry', value: parsed.industryVertical }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-text-muted font-mono uppercase tracking-widest">{label}</span>
                  <span className="text-text-sub">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
