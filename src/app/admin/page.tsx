"use client";

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Target,
  Zap,
  Loader2,
  Download,
  MoreVertical,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import {
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
} from 'recharts';

const FEATURE_LABEL: Record<string, string> = {
  JD_PARSE: 'JD Parser',
  ATS_ANALYZE: 'ATS Analyzer',
  COVER_LETTER: 'Cover Letter',
  EMAIL_DRAFT: 'Email Draft',
  CAREER_COACH: 'Career Coach',
  PIPELINE_HEALTH: 'Pipeline Health',
  RESUME_GEN: 'Resume Gen',
  RESUME_PARSER: 'Resume Parser',
  TEXT_ENHANCE: 'Text Enhance',
};

const FEATURE_COMPONENT: Record<string, string> = {
  JD_PARSE: 'AI Engine',
  ATS_ANALYZE: 'AI Engine',
  COVER_LETTER: 'Content Gen',
  EMAIL_DRAFT: 'Content Gen',
  CAREER_COACH: 'Agent-Chat',
  PIPELINE_HEALTH: 'Analytics',
  RESUME_GEN: 'Builder',
  RESUME_PARSER: 'Parser',
  TEXT_ENHANCE: 'AI Engine',
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [statsRes, logsRes] = await Promise.all([
          api.get('/api/admin/stats'),
          api.get('/api/admin/logs?limit=50'),
        ]);
        setStats(statsRes.data);
        setLogs(logsRes.data?.data ?? logsRes.data ?? []);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Derive feature distribution from real logs
  const featureDistribution = useMemo(() => {
    if (!logs.length) return [
      { label: 'Neural Parsing', val: 74, color: 'bg-primary' },
      { label: 'Semantic Matching', val: 42, color: 'bg-secondary' },
      { label: 'Creative Generation', val: 28, color: 'bg-accent' },
    ];
    const total = logs.length;
    const parsing = logs.filter(l => ['JD_PARSE', 'ATS_ANALYZE', 'RESUME_PARSER'].includes(l.feature)).length;
    const matching = logs.filter(l => l.feature === 'ATS_ANALYZE').length;
    const creative = logs.filter(l => ['COVER_LETTER', 'EMAIL_DRAFT', 'CAREER_COACH'].includes(l.feature)).length;
    return [
      { label: 'Neural Parsing', val: Math.round((parsing / total) * 100), color: 'bg-primary' },
      { label: 'Semantic Matching', val: Math.round((matching / total) * 100), color: 'bg-secondary' },
      { label: 'Creative Generation', val: Math.round((creative / total) * 100), color: 'bg-accent' },
    ];
  }, [logs]);

  // Build chart data from logs grouped by day-of-week
  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts: Record<string, number> = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    logs.forEach(l => {
      const day = days[new Date(l.createdAt).getDay()];
      counts[day] = (counts[day] ?? 0) + 1;
    });
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => ({ name: d, requests: counts[d] }));
  }, [logs]);

  const filteredLogs = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return logs.filter(l => {
      const label = (FEATURE_LABEL[l.feature] ?? l.feature ?? '').toLowerCase();
      const comp = (FEATURE_COMPONENT[l.feature] ?? '').toLowerCase();
      return !q || label.includes(q) || comp.includes(q);
    });
  }, [logs, searchQuery]);

  const paginatedLogs = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, page]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const metrics = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, trend: '+12%', up: true, icon: Users, color: 'text-primary' },
    { label: 'Applications', value: stats?.totalApplications ?? 0, trend: '+8%', up: true, icon: Target, color: 'text-secondary' },
    { label: 'AI Operations', value: (stats?.aiRequests ?? 0).toLocaleString(), trend: '+24%', up: true, icon: Zap, color: 'text-accent' },
    { label: 'Avg Latency', value: stats?.avgLatency ? `${Math.round(stats.avgLatency)}ms` : '—', trend: '-5%', up: true, icon: Activity, color: 'text-success' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-success font-black">System Operational</p>
          </div>
          <h2 className="text-4xl font-hanken font-bold text-text-main tracking-tight">Intelligence Oversight</h2>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="bg-surface-2/50 border-border-color text-text-main gap-2 rounded-xl h-12 flex-1 md:flex-none">
            <Download className="w-4 h-4" />
            Export Audit
          </Button>
          <Button className="rounded-xl h-12 flex-1 md:flex-none shadow-xl shadow-primary/20" onClick={() => window.location.reload()}>
            Refresh Node
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-surface-2/40 backdrop-blur-xl border border-border-color rounded-(--radius-premium) p-8 relative overflow-hidden group hover:border-primary/30 transition-all shadow-lg">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-2xl bg-surface-2 border border-white/10 ${m.color}`}>
                <m.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold font-mono ${m.up ? 'text-success' : 'text-error'}`}>
                {m.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {m.trend}
              </div>
            </div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-muted mb-1">{m.label}</p>
            <h3 className="text-4xl font-hanken font-bold text-text-main">{m.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-surface-2/40 border border-border-color rounded-(--radius-premium) p-8 shadow-xl">
          <h4 className="text-xl font-hanken font-bold text-text-main mb-8">AI Request Velocity</h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorReqs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} fontFamily="JetBrains Mono" />
                <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} fontFamily="JetBrains Mono" allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px', fontFamily: 'Hanken Grotesk' }}
                />
                <Area type="monotone" dataKey="requests" stroke="#6366F1" fillOpacity={1} fill="url(#colorReqs)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-surface-2/40 border border-border-color rounded-[2.5rem] p-8 shadow-xl flex flex-col">
          <h4 className="text-xl font-hanken font-bold text-text-main mb-8">AI Distribution</h4>
          <div className="flex-1 flex flex-col justify-center space-y-8">
            {featureDistribution.map((f, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest">
                  <span className="text-text-sub">{f.label}</span>
                  <span className="text-text-main font-bold">{f.val}%</span>
                </div>
                <div className="h-2 bg-surface-2 rounded-full overflow-hidden border border-border-color">
                  <div className={`${f.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${f.val}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Logs Table */}
      <div className="bg-surface-2/40 border border-border-color rounded-(--radius-premium) overflow-hidden shadow-xl">
        <div className="p-8 border-b border-border-color flex flex-col sm:flex-row justify-between items-center gap-6">
          <h4 className="text-xl font-hanken font-bold text-text-main">AI Activity Log</h4>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                className="w-full bg-surface-2 border border-border-color rounded-xl pl-12 pr-4 py-3 text-xs font-sans focus:border-primary focus:outline-none transition-all text-text-main"
                placeholder="Filter by feature or component..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              />
            </div>
            <Button variant="outline" size="icon" className="border-white/10 bg-surface-2 h-11 w-11 rounded-xl hover:bg-white/5">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-color bg-surface-2/20 text-text-muted font-mono text-[10px] uppercase tracking-[0.2em]">
                <th className="px-8 py-5 font-bold">Feature</th>
                <th className="px-8 py-5 font-bold">Component</th>
                <th className="px-8 py-5 font-bold">Status</th>
                <th className="px-8 py-5 font-bold">Latency</th>
                <th className="px-8 py-5 font-bold">Time</th>
                <th className="px-8 py-5 font-bold text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color text-sm">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-text-muted font-mono text-xs">
                    No AI log entries found.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log: any, idx: number) => (
                  <tr key={log.id ?? idx} className="hover:bg-white/5 transition-colors group">
                    <td className="px-8 py-5 font-hanken font-bold text-text-main text-base">
                      {FEATURE_LABEL[log.feature] ?? log.feature}
                    </td>
                    <td className="px-8 py-5 text-text-sub font-mono text-xs">
                      {FEATURE_COMPONENT[log.feature] ?? 'AI Engine'}
                    </td>
                    <td className="px-8 py-5">
                      {log.success ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold font-mono border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/10 text-red-400 text-[10px] font-bold font-mono border border-red-500/20">
                          <XCircle className="w-3 h-3" /> Error
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-text-muted font-mono text-xs">
                      {log.latencyMs != null ? `${log.latencyMs}ms` : '—'}
                    </td>
                    <td className="px-8 py-5 text-text-muted font-mono text-xs">
                      {log.createdAt ? timeAgo(log.createdAt) : '—'}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-text-muted hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-border-color flex items-center justify-between">
          <p className="text-xs text-text-muted font-mono">
            Showing <span className="text-text-main font-bold">{Math.min(filteredLogs.length, itemsPerPage * page)}</span> of{' '}
            <span className="text-text-main font-bold">{filteredLogs.length}</span> logs
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="h-9 px-4 rounded-lg border-white/10 text-xs disabled:opacity-50"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              className="h-9 px-4 rounded-lg border-white/10 text-xs disabled:opacity-50"
              onClick={() => setPage(p => p + 1)}
              disabled={page * itemsPerPage >= filteredLogs.length}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
