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
  Plus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const DashboardOverview = () => {
  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search Overview</h1>
          <p className="text-muted-foreground">Keep track of your applications and performance metrics.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/dashboard/tracker"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-border/50 hover:bg-muted rounded-xl transition-colors"
          >
            View All Applications
          </Link>
          <Button className="rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2">
            <Plus className="w-4 h-4" />
            Add Application
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Applications" 
          value="24" 
          icon={Briefcase} 
          trend={{ value: 12, isUp: true }}
          description="Total tracked since start"
        />
        <StatCard 
          title="Interviews" 
          value="4" 
          icon={Target} 
          trend={{ value: 25, isUp: true }}
          color="success"
          description="In progress interviews"
        />
        <StatCard 
          title="Offers" 
          value="1" 
          icon={CheckCircle2} 
          color="warning"
          description="Final stage offers"
        />
        <StatCard 
          title="Avg. Response Time" 
          value="5.2d" 
          icon={Clock} 
          trend={{ value: 8, isUp: false }}
          color="primary"
          description="Days to first response"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ApplicationsOverTimeChart />
        <ApplicationStatusChart />
      </div>

      {/* Recent Activity Section (Simplified for now) */}
      <div className="glass-card rounded-3xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold">Recent Activity</h3>
          <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/5 gap-2">
            View All <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Target className="text-primary w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">Interview Scheduled with Google</p>
                <p className="text-sm text-muted-foreground truncate">Technical Round for Senior Frontend Engineer</p>
              </div>
              <div className="text-right shrink-0 hidden sm:block">
                <p className="text-xs font-medium uppercase text-primary">Status Change</p>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
