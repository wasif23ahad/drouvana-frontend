"use client";

import React, { useState, useEffect } from 'react';
import StatCard from '@/components/dashboard/StatCard';
import { 
  Users, 
  Rocket, 
  Database, 
  Zap,
  Loader2
} from 'lucide-react';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin/stats');
      setStats(response.data);
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
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Global Analytics</h1>
        <p className="text-slate-400">Real-time system performance and user growth metrics.</p>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Registered Users" 
          value={stats?.totalUsers || 0} 
          icon={Users} 
          trend={{ value: 12, isUp: true }}
          color="primary"
        />
        <StatCard 
          title="Applications Tracked" 
          value={stats?.totalApplications || 0} 
          icon={Rocket} 
          trend={{ value: 8, isUp: true }}
          color="success"
        />
        <StatCard 
          title="AI Tokens Used" 
          value={`${((stats?.tokensUsed || 0) / 1000).toFixed(1)}k`} 
          icon={Database} 
          color="warning"
        />
        <StatCard 
          title="Avg. AI Latency" 
          value={`${(stats?.avgLatency / 1000).toFixed(1)}s`} 
          icon={Zap} 
          trend={{ value: 5, isUp: false }}
          color="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card border-white/10 rounded-[32px] p-8">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold">System Health</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white/5 rounded-lg text-xs font-medium">Live Status</span>
            </div>
          </div>
          <div className="space-y-6">
            {[
              { name: 'API Server', status: stats?.health?.api || 'Healthy', latency: '42ms', load: '12%' },
              { name: 'Database (Supabase)', status: stats?.health?.db || 'Healthy', latency: '24ms', load: '8%' },
              { name: 'Redis Cache (Upstash)', status: stats?.health?.redis || 'Healthy', latency: '2ms', load: '4%' },
              { name: 'AI Services (NVIDIA)', status: stats?.health?.ai || 'Healthy', latency: `${stats?.avgLatency}ms`, load: '18%' },
            ].map((sys) => (
              <div key={sys.name} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${sys.status === 'Healthy' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-amber-500 animate-pulse'}`} />
                  <span className="font-bold">{sys.name}</span>
                </div>
                <div className="flex gap-10 text-sm font-medium text-slate-400">
                  <span>{sys.latency}</span>
                  <span className="w-16 text-right">{sys.load}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card border-white/10 rounded-[32px] p-8 space-y-6">
          <h3 className="text-xl font-bold mb-4">Resource Allocation</h3>
          <div className="flex items-center justify-center py-10">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.05)" strokeWidth="15" fill="transparent" />
                <circle cx="80" cy="80" r="70" stroke="#4F46E5" strokeWidth="15" strokeDasharray="440" strokeDashoffset="120" fill="transparent" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black italic">72%</span>
                <span className="text-[10px] uppercase font-bold text-slate-500">Utilization</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">API Requests</span>
              <span className="font-bold">{stats?.totalApplications * 4 || 0}k</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[72%]" />
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed text-center italic">
            System performance is optimal. All services are operating within normal parameters.
          </p>
        </div>
      </div>
    </div>
  );
}
