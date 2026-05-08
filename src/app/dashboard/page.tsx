"use client";

import React from 'react';
import StatCard from '@/components/dashboard/StatCard';
import ApplicationStatusChart from '@/components/dashboard/ApplicationStatusChart';
import ApplicationsOverTimeChart from '@/components/dashboard/ApplicationsOverTimeChart';
import { 
  Briefcase, 
  Target, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Plus,
  ChevronRight,
  Zap,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PipelineHealthCard from '@/components/ai/PipelineHealthCard';

const DashboardOverview = () => {
  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700 max-w-spacing-container-max mx-auto">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center text-xs text-on-surface-variant gap-2 font-mono uppercase tracking-widest">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Drouvana</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary font-bold">Terminal Overview</span>
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-on-surface italic tracking-tight flex items-center gap-4">
              Intelligence Feed
              <span className="bg-primary/10 text-primary text-[9px] uppercase tracking-[0.2em] font-black px-3 py-1 rounded-full border border-primary/20">Operational</span>
            </h1>
            <p className="font-sans text-on-surface-variant italic text-lg leading-relaxed">Aggregated performance vectors and neural application tracking.</p>
          </div>
          <div className="flex gap-4 w-full lg:w-auto">
            <Link href="/dashboard/tracker" className="flex-1 lg:flex-none">
              <Button variant="outline" className="w-full border-white/10 text-on-surface hover:bg-white/5 transition-all rounded-2xl h-14 px-8 font-heading font-bold italic shadow-lg">
                View Tracker
              </Button>
            </Link>
            <Link href="/dashboard/tracker?new=true" className="flex-1 lg:flex-none">
              <Button className="w-full bg-gradient-primary text-white rounded-2xl shadow-2xl shadow-primary/20 gap-3 h-14 px-8 font-heading font-bold italic border-none transition-all hover:scale-105 active:scale-95">
                <Plus className="w-5 h-5" />
                Initialize Application
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          title="Total Applications" 
          value="24" 
          icon={Briefcase} 
          trend={{ value: 12, isUp: true }}
        />
        <StatCard 
          title="Interviews" 
          value="4" 
          icon={Target} 
          trend={{ value: 25, isUp: true }}
          color="success"
        />
        <StatCard 
          title="Offers" 
          value="1" 
          icon={CheckCircle2} 
          color="warning"
          description="Final stage offers"
        />
        <StatCard 
          title="Response Time" 
          value="5.2d" 
          icon={Clock} 
          trend={{ value: 8, isUp: false }}
          color="primary"
          description="Avg. days to first reply"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Charts Section */}
        <div className="lg:col-span-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface-container-low/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none" />
              <ApplicationsOverTimeChart />
            </div>
            <div className="bg-surface-container-low/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 blur-3xl pointer-events-none" />
              <ApplicationStatusChart />
            </div>
          </div>

          {/* AI Pipeline Health */}
          <div className="w-full relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <PipelineHealthCard />
          </div>
        </div>

        {/* Recent Activity Side */}
        <div className="lg:col-span-4 bg-surface-container-low/50 backdrop-blur-xl border border-white/5 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl h-fit">
          <div className="p-10 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-2xl font-heading font-bold text-on-surface italic tracking-tight">Recent Activity</h3>
          </div>
          <div className="divide-y divide-white/5">
            {[
              { t: 'Interview Scheduled with Google', d: 'Technical Round: Senior Frontend', time: '2h ago', icon: Target },
              { t: 'JD Parsed: Staff Engineer at Stripe', d: 'Requirements successfully extracted', time: '5h ago', icon: Briefcase },
              { t: 'Resume Tailored for Meta', d: 'Match score optimized to 92%', time: 'Yesterday', icon: Zap },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-5 p-8 hover:bg-white/5 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center shrink-0 border border-white/5 group-hover:border-primary/50 transition-colors shadow-lg">
                  <activity.icon className="text-primary w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="font-heading font-bold text-on-surface truncate italic tracking-tight">{activity.t}</p>
                  <p className="text-[11px] text-on-surface-variant truncate font-sans italic opacity-60">{activity.d}</p>
                  <div className="flex justify-between items-center pt-2">
                     <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-primary font-black">System Event</span>
                     <span className="font-mono text-[8px] text-on-surface-variant uppercase font-black">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-8 mt-auto">
             <Button variant="ghost" className="w-full h-14 rounded-2xl border border-white/5 bg-white/5 text-on-surface hover:text-primary hover:bg-white/10 gap-3 font-heading font-bold italic transition-all group">
               Full Tactical Logs <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
