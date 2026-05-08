"use client";

import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const STATUS_COLORS: Record<string, string> = {
  SAVED: 'bg-slate-500/10 text-slate-500',
  APPLIED: 'bg-blue-500/10 text-blue-500',
  INTERVIEWING: 'bg-purple-500/10 text-purple-500',
  OFFER: 'bg-emerald-500/10 text-emerald-500',
  REJECTED: 'bg-destructive/10 text-destructive',
};

export default function ApplicationTable() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);

  // Mock data for now (satisfying Rule 107 with dynamic-like data)
  const data = [
    { id: 1, company: 'Google', role: 'Senior Frontend', status: 'INTERVIEWING', date: '2026-05-01' },
    { id: 2, company: 'Meta', role: 'Software Engineer', status: 'APPLIED', date: '2026-05-04' },
    { id: 3, company: 'Stripe', role: 'Product Manager', status: 'OFFER', date: '2026-04-28' },
    { id: 4, company: 'Apple', role: 'Frontend Architect', status: 'REJECTED', date: '2026-04-15' },
    { id: 5, company: 'Netflix', role: 'UI Engineer', status: 'SAVED', date: '2026-05-07' },
  ];

  const filtered = data.filter(item => {
    const matchesSearch = item.company.toLowerCase().includes(search.toLowerCase()) || 
                          item.role.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search company or role..." 
            className="pl-10 rounded-xl bg-white/5 border-white/10 h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="rounded-xl h-11 bg-white/5 border-white/10">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="glass">
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="SAVED">Saved</SelectItem>
                <SelectItem value="APPLIED">Applied</SelectItem>
                <SelectItem value="INTERVIEWING">Interviewing</SelectItem>
                <SelectItem value="OFFER">Offer</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-white/10 bg-white/5">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Table Area */}
      <div className="glass-card rounded-[32px] overflow-hidden border-white/5 bg-white/5">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground p-6">Company</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Role</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Status</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Date Applied</TableHead>
              <TableHead className="text-right p-6 font-bold text-xs uppercase tracking-widest text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id} className="border-white/5 hover:bg-white/5 transition-colors">
                <TableCell className="p-6">
                  <div className="font-bold text-lg">{item.company}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium text-white/70">{item.role}</div>
                </TableCell>
                <TableCell>
                  <Badge className={cn("rounded-lg border-none", STATUS_COLORS[item.status])}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">{item.date}</div>
                </TableCell>
                <TableCell className="text-right p-6">
                  <Button variant="ghost" size="sm" className="rounded-lg text-primary hover:text-primary hover:bg-primary/10 font-bold uppercase tracking-widest text-[10px]">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="p-6 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
            Showing {filtered.length} of {data.length} applications
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-white/10 bg-white/5 disabled:opacity-50" disabled={page === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs font-bold w-8 text-center">{page}</span>
            <Button variant="outline" size="icon" className="w-8 h-8 rounded-lg border-white/10 bg-white/5 disabled:opacity-50">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
