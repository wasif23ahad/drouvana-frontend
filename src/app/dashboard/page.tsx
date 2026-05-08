'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Briefcase, FileText, Target, Plus, ChevronRight, Activity } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardOverview() {
  const { applications } = useAppStore();

  const totalApps = applications.length;
  const interviews = applications.filter(a => a.status === 'INTERVIEW').length;
  const offers = applications.filter(a => a.status === 'OFFER').length;
  const activeApps = applications.filter(a => !['REJECTED', 'WITHDRAWN', 'OFFER'].includes(a.status)).length;

  const statusData = [
    { name: 'Saved', value: applications.filter(a => a.status === 'SAVED').length },
    { name: 'Applied', value: applications.filter(a => a.status === 'APPLIED').length },
    { name: 'Screening', value: applications.filter(a => a.status === 'SCREENING').length },
    { name: 'Interview', value: applications.filter(a => a.status === 'INTERVIEW').length },
    { name: 'Offer', value: applications.filter(a => a.status === 'OFFER').length },
    { name: 'Rejected', value: applications.filter(a => a.status === 'REJECTED').length },
  ].filter(d => d.value > 0);

  const COLORS = ['#64748B', '#3B82F6', '#F59E0B', '#8B5CF6', '#10B981', '#EF4444'];

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center text-xs text-text-muted gap-2 font-jetbrains uppercase tracking-widest mb-2">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Drouvana</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-bold">Terminal Overview</span>
          </div>
          <h1 className="text-3xl font-bold font-hanken">Intelligence Feed</h1>
          <p className="text-text-sub text-sm">Aggregated performance vectors and neural application tracking.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link href="/dashboard/tracker" className="flex-1 sm:flex-none">
            <Button variant="outline" className="w-full rounded-xl">View Tracker</Button>
          </Link>
          <Link href="/dashboard/tracker" className="flex-1 sm:flex-none">
            <Button className="w-full rounded-xl gap-2 shadow-lg shadow-primary/20 border-none">
              <Plus className="h-4 w-4" /> Initialize Application
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:border-primary/30 transition-colors group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-sub group-hover:text-primary transition-colors font-jetbrains uppercase tracking-widest">Total Applications</CardTitle>
            <Briefcase className="h-4 w-4 text-text-muted group-hover:text-primary transition-all group-hover:scale-110" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-hanken mb-1">{totalApps}</div>
            <p className="text-xs text-text-muted italic">+2 from last week</p>
          </CardContent>
        </Card>
        <Card className="hover:border-secondary/30 transition-colors group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-sub group-hover:text-secondary transition-colors font-jetbrains uppercase tracking-widest">Active Pipelines</CardTitle>
            <Target className="h-4 w-4 text-text-muted group-hover:text-secondary transition-all group-hover:scale-110" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-hanken mb-1">{activeApps}</div>
            <p className="text-xs text-text-muted italic">Awaiting responses</p>
          </CardContent>
        </Card>
        <Card className="hover:border-accent/30 transition-colors group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-sub group-hover:text-accent transition-colors font-jetbrains uppercase tracking-widest">Interviews</CardTitle>
            <BarChart3 className="h-4 w-4 text-text-muted group-hover:text-accent transition-all group-hover:scale-110" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-hanken mb-1">{interviews}</div>
            <p className="text-xs text-text-muted italic">2 coming up this week</p>
          </CardContent>
        </Card>
        <Card className="hover:border-success/30 transition-colors group border-success/10 bg-success/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-text-sub group-hover:text-success transition-colors font-jetbrains uppercase tracking-widest">Total Offers</CardTitle>
            <FileText className="h-4 w-4 text-success transition-all group-hover:scale-110" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-hanken mb-1 text-success">{offers}</div>
            <p className="text-xs text-success/70 italic font-medium">Congratulations!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="col-span-1 border-border-color shadow-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-hanken">Application Funnel</CardTitle>
          </CardHeader>
          <CardContent className="pl-2 h-80">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={statusData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border-color)" />
                 <XAxis type="number" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis dataKey="name" type="category" stroke="var(--color-text-sub)" fontSize={12} tickLine={false} axisLine={false} width={80} />
                 <Tooltip 
                   cursor={{fill: 'var(--bg-surface-2)', opacity: 0.1}} 
                   contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: '12px' }}
                 />
                 <Bar dataKey="value" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
               </BarChart>
             </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 border-border-color shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none" />
          <CardHeader>
            <CardTitle className="text-lg font-hanken">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Applications Preview */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-xl font-bold font-hanken">Recent Applications</h2>
          <Link href="/dashboard/tracker" className="text-sm text-primary hover:underline flex items-center gap-1 font-jetbrains uppercase tracking-widest text-[10px] font-bold">
            View All <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
        <Card className="border-border-color overflow-hidden">
          <CardContent className="p-0">
             <div className="divide-y divide-border-color">
                {applications.slice(0, 3).map((app, i) => (
                   <div key={app.id} className="p-6 flex items-center justify-between hover:bg-surface-2/20 transition-colors group">
                      <div className="flex items-center gap-4">
                         <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:scale-110 transition-transform">
                            {app.company.charAt(0)}
                         </div>
                         <div>
                            <p className="font-bold text-text-main group-hover:text-primary transition-colors">{app.jobTitle}</p>
                            <p className="text-xs text-text-muted">{app.company} • {app.location || 'Remote'}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-6">
                         <div className="hidden sm:block text-right">
                            <p className="text-xs text-text-sub font-jetbrains">{new Date(app.dateApplied).toLocaleDateString()}</p>
                            <p className="text-[10px] text-text-muted uppercase tracking-tighter">Applied Date</p>
                         </div>
                         <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            app.status === 'OFFER' ? 'bg-success/20 text-success' :
                            app.status === 'REJECTED' ? 'bg-error/20 text-error' :
                            'bg-primary/20 text-primary'
                         }`}>
                            {app.status}
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
