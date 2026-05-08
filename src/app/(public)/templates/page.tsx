"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Star, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

export default function TemplatesExplorePage() {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search (Rule 84)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch templates from API
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 8,
        sort: sortBy === 'RATING_DESC' ? 'rating' : sortBy === 'POPULAR' ? 'popular' : 'newest',
      };
      
      if (category !== 'ALL') params.category = category;
      if (debouncedSearch) params.search = debouncedSearch;

      const response = await api.get('/api/templates', { params });
      setTemplates(response.data.templates);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [debouncedSearch, category, sortBy, page]);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 space-y-12 min-h-screen">
      {/* Header & Search (Rule 84) */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4 w-full max-w-2xl">
          <h1 className="text-5xl font-black italic tracking-tight">Explore <span className="text-primary">Templates</span></h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search templates by name, style, or role..." 
              className="h-16 pl-12 rounded-[24px] bg-white/5 border-white/10 text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Filters & Sorting (Rule 85, 86) */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Select value={category} onValueChange={(val) => { setCategory(val); setPage(1); }}>
            <SelectTrigger className="w-48 h-12 rounded-xl bg-white/5 border-white/10">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="glass">
              <SelectItem value="ALL">All Categories</SelectItem>
              <SelectItem value="TECH">Tech</SelectItem>
              <SelectItem value="CREATIVE">Creative</SelectItem>
              <SelectItem value="EXECUTIVE">Executive</SelectItem>
              <SelectItem value="FINANCE">Finance</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(val) => { setSortBy(val); setPage(1); }}>
            <SelectTrigger className="w-48 h-12 rounded-xl bg-white/5 border-white/10">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="glass">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="POPULAR">Most Popular</SelectItem>
              <SelectItem value="RATING_DESC">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid Listing (Rule 69, 70) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-3/4 rounded-[32px]" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))
        ) : templates.length > 0 ? (
          templates.map((t) => (
            <Link href={`/templates/${t.id}`} key={t.id} className="group flex flex-col h-full">
              <div className="glass-card rounded-[32px] overflow-hidden border-white/5 bg-white/5 flex flex-col h-full hover:border-primary/40 transition-all">
                <div className="relative aspect-3/4 overflow-hidden">
                  <img 
                    src={t.previewImage} 
                    alt={t.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg flex items-center gap-1 text-white text-[10px] font-black">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {t.atsScore / 20}
                  </div>
                </div>
                <div className="p-6 space-y-3 flex-1 flex flex-col">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-primary mb-1">{t.category}</p>
                    <h4 className="text-lg font-bold group-hover:text-primary transition-colors">{t.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground flex-1 italic truncate">{t.description}</p>
                  <Button className="w-full rounded-xl bg-white/5 group-hover:bg-primary transition-all font-bold text-xs uppercase tracking-widest h-10 group-hover:text-white">
                    View Details
                  </Button>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold">No templates found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>

      {/* Pagination (Rule 87) */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-12">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-12 h-12 rounded-xl border-white/10 bg-white/5 disabled:opacity-50"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button 
                key={i} 
                variant={page === i + 1 ? 'default' : 'outline'} 
                className={cn("w-12 h-12 rounded-xl border-white/10 font-bold", page === i + 1 ? "bg-primary" : "bg-white/5")}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="w-12 h-12 rounded-xl border-white/10 bg-white/5 disabled:opacity-50"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
