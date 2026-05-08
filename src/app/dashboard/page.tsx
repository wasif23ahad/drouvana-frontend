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
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PipelineHealthCard from '@/components/ai/PipelineHealthCard';

const DashboardOverview = () => {
  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-on-surface italic tracking-tight">Search Overview</h1>
          <p className="font-sans text-sm text-on-surface-variant mt-1">Keep track of your applications and performance metrics.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/tracker">
            <Button variant="outline" className="border-white/10 text-on-surface-variant hover:text-primary transition-all rounded-xl h-11 font-mono text-[10px] uppercase tracking-widest">
              View Tracker
            </Button>
          </Link>
          <Link href="/dashboard/tracker?new=true">
            <Button className="bg-gradient-primary text-white rounded-xl shadow-lg shadow-primary/20 gap-2 h-11 font-heading font-bold italic px-6 border-none">
              <Plus className="w-4 h-4" />
              New Application
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-container-low border border-white/10 rounded-xl p-1">
          <ApplicationsOverTimeChart />
        </div>
        <div className="bg-surface-container-low border border-white/10 rounded-xl p-1">
          <ApplicationStatusChart />
        </div>
      </div>

      {/* AI Pipeline Health */}
      <div className="w-full">
        <PipelineHealthCard />
      </div>

      {/* Recent Activity Section */}
      <div className="bg-surface-container-low border border-white/10 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-xl font-heading font-bold text-on-surface italic">Recent Activity</h3>
          <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 gap-2 font-mono text-[10px] uppercase tracking-widest">
            View All <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="divide-y divide-white/5">
          {[
            { t: 'Interview Scheduled with Google', d: 'Technical Round for Senior Frontend Engineer', time: '2 hours ago', icon: Target },
            { t: 'JD Parsed: Staff Engineer at Stripe', d: 'Requirements extracted and added to tracker', time: '5 hours ago', icon: Briefcase },
            { t: 'Resume Tailored for Meta', d: 'Match score improved from 65% to 92%', time: 'Yesterday', icon: ChevronRight },
          ].map((activity, i) => (
            <div key={i} className="flex items-start gap-4 p-6 hover:bg-white/5 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <activity.icon className="text-primary w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-on-surface truncate italic">{activity.t}</p>
                <p className="text-sm text-on-surface-variant truncate font-sans">{activity.d}</p>
              </div>
              <div className="text-right shrink-0 hidden sm:block">
                <p className="font-mono text-[10px] uppercase tracking-widest text-primary">Status Event</p>
                <p className="font-mono text-[10px] text-on-surface-variant uppercase">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
