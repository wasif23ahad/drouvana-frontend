"use client";

import React, { useState, useEffect } from 'react';
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
import { ChevronLeft, ChevronRight, Search, Filter, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const STATUS_COLORS: Record<string, string> = {
  SAVED: 'bg-slate-500/10 text-slate-500',
  APPLIED: 'bg-blue-500/10 text-blue-500',
  SCREENING: 'bg-yellow-500/10 text-yellow-500',
  INTERVIEW: 'bg-purple-500/10 text-purple-500',
  OFFER: 'bg-emerald-500/10 text-emerald-500',
  REJECTED: 'bg-destructive/10 text-destructive',
};

export default function ApplicationTable() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 10,
      };
      
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (debouncedSearch) params.search = debouncedSearch;

      const response = await api.get('/api/applications', { params });
      setApplications(response.data.applications);
      setTotalCount(response.data.pagination.total);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [debouncedSearch, statusFilter, page]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
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
            <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(1); }}>
              <SelectTrigger className="rounded-xl h-11 bg-white/5 border-white/10">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="glass">
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="SAVED">Saved</SelectItem>
                <SelectItem value="APPLIED">Applied</SelectItem>
                <SelectItem value="SCREENING">Screening</SelectItem>
                <SelectItem value="INTERVIEW">Interview</SelectItem>
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
      <div className="glass-card rounded-[32px] overflow-hidden border-white/5 bg-white/5 min-h-[400px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : applications.length > 0 ? (
          <>
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground p-6">Company</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Role</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Status</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Date Created</TableHead>
                  <TableHead className="text-right p-6 font-bold text-xs uppercase tracking-widest text-muted-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((item) => (
                  <TableRow key={item.id} className="border-white/5 hover:bg-white/5 transition-colors">
                    <TableCell className="p-6">
                      <div className="font-bold text-lg">{item.company}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium text-white/70">{item.jobTitle}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("rounded-lg border-none", STATUS_COLORS[item.status])}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
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
            <div className="p-6 border-t border-white/5 flex items-center justify-between mt-auto">
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                Showing {applications.length} of {totalCount} applications
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="w-8 h-8 rounded-lg border-white/10 bg-white/5 disabled:opacity-50" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-xs font-bold w-8 text-center">{page}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="w-8 h-8 rounded-lg border-white/10 bg-white/5 disabled:opacity-50"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-4">
             <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
               <Search className="w-6 h-6 text-muted-foreground" />
             </div>
             <h3 className="text-xl font-bold">No applications found</h3>
             <p className="text-muted-foreground text-sm">Start by adding your first job application.</p>
          </div>
        )}
      </div>
    </div>
  );
}
