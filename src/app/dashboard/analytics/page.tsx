"use client";

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Briefcase, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const APPLICATION_DATA = [
  { day: 'Mon', count: 4 },
  { day: 'Tue', count: 7 },
  { day: 'Wed', count: 5 },
  { day: 'Thu', count: 12 },
  { day: 'Fri', count: 8 },
  { day: 'Sat', count: 3 },
  { day: 'Sun', count: 2 },
];

const STATUS_DATA = [
  { name: 'Applied', value: 45, color: '#c0c1ff' },
  { name: 'Interview', value: 25, color: '#89ceff' },
  { name: 'Rejected', value: 20, color: '#ffb4ab' },
  { name: 'Offered', value: 10, color: '#d0bcff' },
];

const METRICS = [
  { title: 'Total Applications', value: '47', change: '+12%', trend: 'up', icon: Briefcase, color: 'primary' },
  { title: 'Response Rate', value: '23.4%', change: '+5.2%', trend: 'up', icon: Zap, color: 'secondary' },
  { title: 'Avg. ATS Match', value: '78%', change: '-2.1%', trend: 'down', icon: Target, color: 'tertiary' },
  { title: 'Interview Conversion', value: '14.8%', change: '+1.5%', trend: 'up', icon: ShieldCheck, color: 'success' },
];

export default function AnalyticsPage() {
  return (
    <div className="max-w-spacing-container-max mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Breadcrumbs & Header */}
      <div className="space-y-4">
        <div className="flex items-center text-xs text-on-surface-variant gap-2 font-mono uppercase tracking-widest">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary font-bold">Pipeline Intelligence</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-heading font-bold text-on-surface italic tracking-tight flex items-center gap-4">
              Tactical Analytics
              <span className="bg-primary/10 text-primary text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1 rounded-full border border-primary/20">Alpha V.1</span>
            </h1>
            <p className="font-sans text-on-surface-variant italic leading-relaxed text-lg">Visualizing multi-vector deployment performance and conversion metrics.</p>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {METRICS.map((m, i) => (
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
                 m.trend === 'up' ? "text-secondary" : "text-error"
               )}>
                 {m.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                 {m.change}
               </div>
             </div>
             <div className="space-y-1">
               <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-on-surface-variant font-bold opacity-60">{m.title}</p>
               <h3 className="text-3xl font-heading font-bold text-on-surface italic tracking-tighter">{m.value}</h3>
             </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Velocity Chart */}
        <div className="lg:col-span-2 bg-surface-container-low/50 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 blur-[100px] pointer-events-none -z-10" />
          <div className="flex justify-between items-center px-2">
            <h3 className="text-2xl font-heading font-bold text-on-surface italic tracking-tight">Application Velocity</h3>
            <div className="flex items-center gap-4 text-on-surface-variant font-mono text-[10px] uppercase tracking-widest font-black">
               <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /> Active Vectors</span>
               <span className="text-xs">7D History</span>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={APPLICATION_DATA}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c0c1ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c0c1ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  fontFamily="JetBrains Mono" 
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#ffffff20" 
                  fontSize={10} 
                  fontFamily="JetBrains Mono" 
                  tickLine={false}
                  axisLine={false}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d1c2d', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', fontFamily: 'Inter', fontSize: '12px' }}
                  itemStyle={{ color: '#c0c1ff', fontWeight: 'bold' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#c0c1ff" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorCount)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-surface-container-low/50 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 shadow-2xl space-y-10 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-tertiary/5 blur-[80px] pointer-events-none -z-10" />
          <h3 className="text-2xl font-heading font-bold text-on-surface italic tracking-tight">Status Distribution</h3>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={STATUS_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {STATUS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full grid grid-cols-2 gap-4 mt-8">
              {STATUS_DATA.map((s, i) => (
                <div key={i} className="flex flex-col gap-1 px-4 py-3 bg-surface-container rounded-2xl border border-white/5">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                     <span className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant font-bold">{s.name}</span>
                   </div>
                   <span className="text-xl font-heading font-bold text-on-surface italic">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Platform Stats */}
      <div className="bg-surface-container-low/50 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 shadow-2xl space-y-8 relative overflow-hidden">
         <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
              <TrendingUp className="text-secondary w-5 h-5" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-on-surface italic tracking-tight">Platform Performance</h3>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { name: 'LinkedIn', success: '78%', count: 124, color: 'primary' },
             { name: 'Indeed', success: '45%', count: 89, color: 'secondary' },
             { name: 'Direct', success: '92%', count: 56, color: 'tertiary' },
             { name: 'Greenhouse', success: '64%', count: 42, color: 'success' },
           ].map((p, i) => (
             <div key={i} className="space-y-4">
               <div className="flex justify-between items-end">
                 <span className="font-heading font-bold text-on-surface italic">{p.name}</span>
                 <span className="font-mono text-[10px] text-on-surface-variant font-bold">{p.success} Efficiency</span>
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
             </div>
           ))}
         </div>
      </div>
    </div>
  );
}
