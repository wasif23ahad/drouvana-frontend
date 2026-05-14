"use client";

import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Target,
  Zap,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import api from '@/lib/api';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const STATUS_COLORS: Record<string, string> = {
  APPLIED: '#c0c1ff',
  INTERVIEW: '#89ceff',
  REJECTED: '#ffb4ab',
  OFFER: '#d0bcff',
  SCREENING: '#ffd8a8',
  SAVED: '#94a3b8',
  WITHDRAWN: '#9ca3af',
};

interface AppData { day: string; count: number }
interface StatusEntry { name: string; value: number; color: string }
interface MetricCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  color: string;
}

function computeAnalytics(apps: any[]) {
  const total = apps.length;

  // Weekly chart: count per day-of-week for last 30 days
  const dayCounts: number[] = [0, 0, 0, 0, 0, 0, 0];
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  apps.forEach(app => {
    const d = new Date(app.createdAt || app.appliedAt || app.dateApplied).getTime();
    if (d >= thirtyDaysAgo) {
      dayCounts[new Date(d).getDay()]++;
    }
  });
  const applicationData: AppData[] = DAY_LABELS.map((day, i) => ({ day, count: dayCounts[i] }));

  // Status distribution
  const counts: Record<string, number> = {};
  apps.forEach(app => { counts[app.status] = (counts[app.status] || 0) + 1; });
  const statusData: StatusEntry[] = Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({
      name: name.charAt(0) + name.slice(1).toLowerCase(),
      value: Math.round((value / total) * 100),
      color: STATUS_COLORS[name] || '#888',
    }));

  // Metrics
  const responded = (counts.SCREENING || 0) + (counts.INTERVIEW || 0) + (counts.OFFER || 0) + (counts.REJECTED || 0);
  const responseRate = total > 0 ? ((responded / total) * 100).toFixed(1) : '0.0';
  const interviewed = (counts.INTERVIEW || 0) + (counts.OFFER || 0);
  const interviewConversion = total > 0 ? ((interviewed / total) * 100).toFixed(1) : '0.0';

  const metrics: MetricCard[] = [
    { title: 'Total Applications', value: String(total), change: `${total} tracked`, trend: 'neutral', icon: Briefcase, color: 'primary' },
    { title: 'Response Rate', value: `${responseRate}%`, change: `${responded} responses`, trend: Number(responseRate) > 20 ? 'up' : 'down', icon: Zap, color: 'secondary' },
    { title: 'Avg. ATS Match', value: 'N/A', change: 'run analyzer', trend: 'neutral', icon: Target, color: 'tertiary' },
    { title: 'Interview Conversion', value: `${interviewConversion}%`, change: `${interviewed} interviews`, trend: Number(interviewConversion) > 10 ? 'up' : 'down', icon: ShieldCheck, color: 'success' },
  ];

  // Platform distribution (from apps.platform field)
  const platforms: Record<string, number> = {};
  apps.forEach(app => { if (app.platform) platforms[app.platform] = (platforms[app.platform] || 0) + 1; });
  const platformList = Object.entries(platforms)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([name, count], idx) => ({
      name,
      count,
      success: `${Math.round((count / total) * 100)}%`,
      color: ['primary', 'secondary', 'tertiary', 'success'][idx] || 'primary',
    }));

  return { applicationData, statusData, metrics, platformList };
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [applicationData, setApplicationData] = useState<AppData[]>([]);
  const [statusData, setStatusData] = useState<StatusEntry[]>([]);
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [platformList, setPlatformList] = useState<{ name: string; count: number; success: string; color: string }[]>([]);

  useEffect(() => {
    api.get('/api/applications?limit=200&page=1')
      .then(res => {
        const apps: any[] = res.data?.data || res.data || [];
        if (Array.isArray(apps) && apps.length > 0) {
          const result = computeAnalytics(apps);
          setApplicationData(result.applicationData);
          setStatusData(result.statusData);
          setMetrics(result.metrics);
          setPlatformList(result.platformList);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-spacing-container-max mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center text-xs text-on-surface-variant gap-2 font-mono uppercase tracking-widest">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary font-bold">Pipeline Intelligence</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-heading font-bold text-on-surface tracking-tight flex items-center gap-4">
              Tactical Analytics
              <span className="bg-primary/10 text-primary text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1 rounded-full border border-primary/20">Live Data</span>
            </h1>
            <p className="font-sans text-on-surface-variant leading-relaxed text-lg">Visualizing your real application performance and conversion metrics.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
        </div>
      ) : (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((m, i) => (
              <div key={i} className="bg-surface-container-low/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 space-y-6 group hover:border-primary/40 transition-all duration-500 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl pointer-events-none -z-10" />
                <div className="flex justify-between items-start">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center border",
                    m.color === 'primary' ? "bg-primary/10 border-primary/20 text-primary" :
                    m.color === 'secondary' ? "bg-secondary/10 border-secondary/20 text-secondary" :
                    m.color === 'tertiary' ? "bg-tertiary/10 border-tertiary/20 text-tertiary" :
                    "bg-success/10 border-success/20 text-success"
                  )}>
                    <m.icon className="w-6 h-6" />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 font-mono text-[10px] font-black uppercase tracking-widest",
                    m.trend === 'up' ? "text-secondary" : m.trend === 'down' ? "text-error" : "text-on-surface-variant"
                  )}>
                    {m.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : m.trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : null}
                    {m.change}
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-on-surface-variant font-bold opacity-60">{m.title}</p>
                  <h3 className="text-3xl font-heading font-bold text-on-surface tracking-tighter">{m.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Velocity Chart */}
            <div className="lg:col-span-2 bg-surface-container-low/50 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 shadow-2xl space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[100px] pointer-events-none -z-10" />
              <div className="flex justify-between items-center px-2">
                <h3 className="text-2xl font-heading font-bold text-on-surface tracking-tight">Application Velocity</h3>
                <div className="flex items-center gap-4 text-on-surface-variant font-mono text-[10px] uppercase tracking-widest font-black">
                  <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /> Applications</span>
                  <span className="text-xs">30D by Weekday</span>
                </div>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={applicationData}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c0c1ff" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#c0c1ff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis dataKey="day" stroke="#ffffff20" fontSize={10} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#ffffff20" fontSize={10} fontFamily="JetBrains Mono" tickLine={false} axisLine={false} dx={-10} />
                    <Tooltip contentStyle={{ backgroundColor: '#0d1c2d', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', fontFamily: 'Inter', fontSize: '12px' }} itemStyle={{ color: '#c0c1ff', fontWeight: 'bold' }} />
                    <Area type="monotone" dataKey="count" stroke="#c0c1ff" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Status Distribution */}
            <div className="bg-surface-container-low/50 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 shadow-2xl space-y-10 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-tertiary/5 blur-[80px] pointer-events-none -z-10" />
              <h3 className="text-2xl font-heading font-bold text-on-surface tracking-tight">Status Distribution</h3>
              {statusData.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-on-surface-variant text-sm">No applications yet</div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-full h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip formatter={(val: number) => [`${val}%`, '']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full grid grid-cols-2 gap-3 mt-6">
                    {statusData.map((s, i) => (
                      <div key={i} className="flex flex-col gap-1 px-3 py-2 bg-surface-container rounded-2xl border border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                          <span className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant font-bold truncate">{s.name}</span>
                        </div>
                        <span className="text-xl font-heading font-bold text-on-surface">{s.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Platform Stats */}
          <div className="bg-surface-container-low/50 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 shadow-2xl space-y-8 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
                <TrendingUp className="text-secondary w-5 h-5" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-on-surface tracking-tight">Platform Breakdown</h3>
            </div>
            {platformList.length === 0 ? (
              <p className="text-on-surface-variant text-sm">No platform data yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {platformList.map((p, i) => (
                  <div key={i} className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="font-heading font-bold text-on-surface">{p.name}</span>
                      <span className="font-mono text-[10px] text-on-surface-variant font-bold">{p.count} apps</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden border border-white/5 shadow-inner">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          p.color === 'primary' ? "bg-primary" :
                          p.color === 'secondary' ? "bg-secondary" :
                          p.color === 'tertiary' ? "bg-tertiary" : "bg-success"
                        )}
                        style={{ width: p.success }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-on-surface-variant">{p.success} of total</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
