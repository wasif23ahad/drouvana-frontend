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
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

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

  // Mock data for charts - in real app this would come from API
  const chartData = useMemo(() => [
    { name: 'Mon', users: 400, ai: 240 },
    { name: 'Tue', users: 300, ai: 139 },
    { name: 'Wed', users: 200, ai: 980 },
    { name: 'Thu', users: 278, ai: 390 },
    { name: 'Fri', users: 189, ai: 480 },
    { name: 'Sat', users: 239, ai: 380 },
    { name: 'Sun', users: 349, ai: 430 },
  ], []);

  const systemEvents = useMemo(() => [
    { type: 'User Auth', component: 'Gateway', status: 'Success', time: 'Just now', id: 1 },
    { type: 'JD Parse', component: 'AI Engine', status: 'Processing', time: '2m ago', id: 2 },
    { type: 'DB Sync', component: 'Core', status: 'Complete', time: '5m ago', id: 3 },
    { type: 'AI Generation', component: 'Agent-4', status: 'Success', time: '12m ago', id: 4 },
    { type: 'Token Reset', component: 'Billing', status: 'Complete', time: '45m ago', id: 5 },
    { type: 'New Template', component: 'Content', status: 'Pending', time: '1h ago', id: 6 },
    { type: 'Security Scan', component: 'Vault', status: 'Success', time: '3h ago', id: 7 },
  ], []);

  const filteredEvents = useMemo(() => {
    return systemEvents.filter(ev => 
      ev.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.component.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, systemEvents]);

  const paginatedEvents = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredEvents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredEvents, page]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const metrics = [
    { label: 'Total Users', value: stats?.totalUsers || 0, trend: '+12%', up: true, icon: Users, color: 'text-primary' },
    { label: 'Applications', value: stats?.totalApplications || 0, trend: '+8%', up: true, icon: Target, color: 'text-secondary' },
    { label: 'AI Operations', value: '4.2k', trend: '+24%', up: true, icon: Zap, color: 'text-accent' },
    { label: 'System Uptime', value: '99.9%', trend: '-0.1%', up: false, icon: Activity, color: 'text-success' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-success font-black">System Operational</p>
          </div>
          <h2 className="text-4xl font-hanken font-bold text-text-main italic tracking-tight">Intelligence Oversight</h2>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="bg-surface-2/50 border-border-color text-text-main gap-2 rounded-xl h-12 flex-1 md:flex-none">
            <Download className="w-4 h-4" />
            Export Audit
          </Button>
          <Button className="rounded-xl h-12 flex-1 md:flex-none shadow-xl shadow-primary/20">
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
            <h3 className="text-4xl font-hanken font-bold text-text-main italic">{m.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-surface-2/40 border border-border-color rounded-(--radius-premium) p-8 shadow-xl">
          <h4 className="text-xl font-hanken font-bold text-text-main italic mb-8">Interaction Velocity</h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748B" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  fontFamily="JetBrains Mono"
                />
                <YAxis 
                  stroke="#64748B" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  fontFamily="JetBrains Mono"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px', fontFamily: 'Hanken Grotesk' }}
                />
                <Area type="monotone" dataKey="users" stroke="#6366F1" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-surface-2/40 border border-border-color rounded-[2.5rem] p-8 shadow-xl flex flex-col">
          <h4 className="text-xl font-hanken font-bold text-text-main italic mb-8">AI Distribution</h4>
          <div className="flex-1 flex flex-col justify-center space-y-8">
            {[
              { label: 'Neural Parsing', val: 74, color: 'bg-primary' },
              { label: 'Semantic Matching', val: 42, color: 'bg-secondary' },
              { label: 'Creative Generation', val: 28, color: 'bg-accent' },
            ].map((f, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest">
                  <span className="text-text-sub">{f.label}</span>
                  <span className="text-text-main font-bold">{f.val}%</span>
                </div>
                <div className="h-2 bg-surface-2 rounded-full overflow-hidden border border-border-color">
                  <div 
                    className={`${f.color} h-full rounded-full transition-all duration-1000`}
                    style={{ width: `${f.val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-surface-2/40 border border-border-color rounded-(--radius-premium) overflow-hidden shadow-xl">
        <div className="p-8 border-b border-border-color flex flex-col sm:flex-row justify-between items-center gap-6">
          <h4 className="text-xl font-hanken font-bold text-text-main italic">System Activity Log</h4>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input 
                className="w-full bg-surface-2 border border-border-color rounded-xl pl-12 pr-4 py-3 text-xs font-sans focus:border-primary focus:outline-none transition-all text-text-main" 
                placeholder="Filter events or components..." 
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
                <th className="px-8 py-5 font-bold">Event Type</th>
                <th className="px-8 py-5 font-bold">Vector Component</th>
                <th className="px-8 py-5 font-bold">Status</th>
                <th className="px-8 py-5 font-bold">Latency</th>
                <th className="px-8 py-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color text-sm">
              {paginatedEvents.map((ev) => (
                <tr key={ev.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-5 font-hanken font-bold italic text-text-main text-base">{ev.type}</td>
                  <td className="px-8 py-5 text-text-sub font-mono text-xs">{ev.component}</td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 rounded-lg bg-surface-2 text-primary text-[10px] font-bold font-mono border border-primary/20">
                      {ev.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-text-muted font-mono text-xs">{ev.time}</td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-text-muted hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Table Pagination */}
        <div className="p-6 border-t border-border-color flex items-center justify-between">
           <p className="text-xs text-text-muted font-mono">
             Showing <span className="text-text-main font-bold">{Math.min(filteredEvents.length, itemsPerPage * page)}</span> of <span className="text-text-main font-bold">{filteredEvents.length}</span> nodes
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
               disabled={page * itemsPerPage >= filteredEvents.length}
             >
               Next
             </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
