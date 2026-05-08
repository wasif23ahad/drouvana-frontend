"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Target, 
  Zap, 
  Loader2, 
  Download,
  MoreVertical,
  Search,
  Filter,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const metrics = [
    { 
      label: 'Total Users', 
      value: stats?.totalUsers || 0, 
      change: '+14.2%', 
      icon: Users,
      color: 'text-primary'
    },
    { 
      label: 'Applications', 
      value: stats?.totalApplications || 0, 
      change: '+8.7%', 
      icon: Target,
      color: 'text-secondary'
    },
    { 
      label: 'AI Tokens Used', 
      value: stats?.tokensUsed ? `${(stats.tokensUsed / 1000).toFixed(1)}k` : '0', 
      change: '+22.4%', 
      icon: Zap,
      color: 'text-tertiary'
    },
    { 
      label: 'System Health', 
      value: '99.9%', 
      change: 'Stable', 
      icon: AlertTriangle,
      color: 'text-success'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-heading font-bold text-on-surface italic">Analytics Overview</h2>
          <p className="font-sans text-sm text-on-surface-variant mt-1">Platform performance and user metrics for the last 30 days.</p>
        </div>
        <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10 gap-2 font-bold italic">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-surface-container-low backdrop-blur-md border border-white/10 rounded-xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <m.icon className={`w-16 h-16 ${m.color}`} />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">{m.label}</p>
            <h3 className="text-4xl font-heading font-bold text-on-surface mb-4">{m.value}</h3>
            <div className="flex items-center gap-2">
              <span className="text-secondary bg-secondary/10 px-2 py-0.5 rounded text-[10px] font-bold">
                {m.change}
              </span>
              <span className="font-mono text-[10px] text-on-surface-variant uppercase">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts / Details Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-container-low border border-white/10 rounded-xl p-6 h-[400px] flex flex-col">
          <h4 className="text-lg font-heading font-bold text-on-surface mb-6 italic">New Users Over Time</h4>
          <div className="flex-1 flex items-end justify-between gap-2">
            {[30, 45, 60, 40, 75, 65, 80, 50, 90, 70].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-primary/20 group-hover:bg-primary/40 rounded-t-lg transition-all relative"
                  style={{ height: `${h}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-container-highest px-2 py-1 rounded text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 whitespace-nowrap">
                    {Math.round(h * 5)} Users
                  </div>
                </div>
                <span className="font-mono text-[10px] text-on-surface-variant">D{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-container-low border border-white/10 rounded-xl p-6 flex flex-col">
          <h4 className="text-lg font-heading font-bold text-on-surface mb-6 italic">AI Feature Usage</h4>
          <div className="flex-1 flex flex-col justify-center space-y-6">
            {[
              { label: 'Resume Parsing', value: 55, color: 'bg-primary' },
              { label: 'Cover Letter Gen', value: 30, color: 'bg-secondary' },
              { label: 'Coach Chat', value: 15, color: 'bg-tertiary' },
            ].map((f, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-bold italic uppercase tracking-wider">
                  <span className="text-on-surface">{f.label}</span>
                  <span className="text-primary">{f.value}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`${f.color} h-full rounded-full transition-all duration-1000`}
                    style={{ width: `${f.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 font-mono text-[10px] text-on-surface-variant uppercase text-center tracking-widest">
            Stats updated 5m ago
          </p>
        </div>
      </div>

      {/* User Table (Simplified version as per design) */}
      <div className="bg-surface-container-low border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h4 className="text-lg font-heading font-bold text-on-surface italic">Recent System Events</h4>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input className="w-full bg-surface-container border border-white/5 rounded-lg pl-10 pr-4 py-2 text-xs font-sans focus:border-primary focus:outline-none transition-all" placeholder="Search system logs..." />
            </div>
            <Button variant="outline" size="icon" className="border-white/5 bg-surface-container hover:bg-white/5">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-surface/30 text-on-surface-variant font-mono text-[10px] uppercase tracking-widest">
                <th className="px-6 py-4 font-bold">Event Type</th>
                <th className="px-6 py-4 font-bold">System Component</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Timestamp</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {[
                { type: 'User Auth', component: 'Gateway', status: 'Success', time: 'Just now' },
                { type: 'JD Parse', component: 'AI Engine', status: 'Processing', time: '2m ago' },
                { type: 'DB Sync', component: 'Core', status: 'Complete', time: '5m ago' },
              ].map((ev, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-bold italic text-on-surface">{ev.type}</td>
                  <td className="px-6 py-4 text-on-surface-variant font-mono text-xs">{ev.component}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold border border-secondary/20">
                      {ev.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant font-mono text-xs">{ev.time}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-on-surface-variant hover:text-primary transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
