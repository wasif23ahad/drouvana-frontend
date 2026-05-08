"use client";

import React, { useState, useEffect } from 'react';
import { 
  Search, Star, ChevronLeft, ChevronRight, Filter, SortAsc, LayoutGrid
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
  const [minScore, setMinScore] = useState('0');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const params: any = {
        page,
        limit: 8,
        sort: sortBy === 'RATING_DESC' ? 'rating' : sortBy === 'POPULAR' ? 'popular' : 'newest',
      };
      
      if (category !== 'ALL') params.category = category;
      if (minScore !== '0') params.minScore = parseInt(minScore);
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
  }, [debouncedSearch, category, minScore, sortBy, page]);

  return (
    <div className="max-w-spacing-container-max mx-auto py-12 px-spacing-margin-desktop space-y-10 min-h-screen">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center text-xs text-on-surface-variant gap-2 font-mono uppercase tracking-widest mb-4">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary font-bold">Templates</span>
        </div>
        <h1 className="text-5xl font-heading font-bold text-on-surface italic leading-tight">Explore Templates</h1>
        <p className="font-sans text-on-surface-variant max-w-2xl">Discover battle-tested resume designs augmented by AI matching intelligence.</p>
      </div>

      {/* Filters Row - Design Alignment */}
      <div className="flex flex-col lg:flex-row gap-4 bg-surface-container-high/50 p-4 rounded-xl border border-white/5 backdrop-blur-md">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <Input 
            placeholder="Search by name, role, or skill..." 
            className="w-full bg-surface-container border-outline-variant/30 rounded-lg py-2 pl-10 pr-4 text-sm focus:border-primary transition-all h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Select value={category} onValueChange={(val) => { setCategory(val); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-40 h-11 rounded-lg bg-surface-container border-outline-variant/30 text-on-surface font-sans text-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="glass border-white/10">
              <SelectItem value="ALL">All Categories</SelectItem>
              <SelectItem value="TECH">Engineering</SelectItem>
              <SelectItem value="CREATIVE">Creative</SelectItem>
              <SelectItem value="EXECUTIVE">Executive</SelectItem>
              <SelectItem value="FINANCE">Finance</SelectItem>
            </SelectContent>
          </Select>

          <Select value={minScore} onValueChange={(val) => { setMinScore(val); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-40 h-11 rounded-lg bg-surface-container border-outline-variant/30 text-on-surface font-sans text-sm">
              <SelectValue placeholder="ATS Score" />
            </SelectTrigger>
            <SelectContent className="glass border-white/10">
              <SelectItem value="0">Any Score</SelectItem>
              <SelectItem value="70">70%+ Match</SelectItem>
              <SelectItem value="80">80%+ Match</SelectItem>
              <SelectItem value="90">90%+ Match</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(val) => { setSortBy(val); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-40 h-11 rounded-lg bg-surface-container border-outline-variant/30 text-on-surface font-sans text-sm">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="glass border-white/10">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="POPULAR">Most Popular</SelectItem>
              <SelectItem value="RATING_DESC">Highest Match</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="h-11 border-outline-variant/30 bg-surface-container text-on-surface-variant gap-2 rounded-lg font-mono text-[10px] uppercase tracking-widest hidden sm:flex">
            <Filter className="w-4 h-4" />
            Advanced
          </Button>
        </div>
      </div>

      {/* Grid Listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-3/4 rounded-xl bg-surface-container" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2 bg-surface-container" />
                <Skeleton className="h-3 w-3/4 bg-surface-container" />
              </div>
            </div>
          ))
        ) : templates.length > 0 ? (
          templates.map((t) => (
            <Link href={`/templates/${t.id}`} key={t.id} className="group flex flex-col h-full animate-in fade-in zoom-in duration-300">
              <div className="bg-surface-container/80 backdrop-blur-lg rounded-xl overflow-hidden border border-white/5 flex flex-col h-full hover:border-primary/50 hover:shadow-primary/5 transition-all">
                <div className="relative aspect-3/4 overflow-hidden">
                  <img 
                    src={t.previewImage} 
                    alt={t.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 right-4 bg-linear-to-r from-secondary-fixed-dim to-secondary text-on-secondary px-3 py-1 rounded-full font-mono text-[9px] font-bold uppercase tracking-widest">
                    {t.atsScore}% Match
                  </div>
                </div>
                <div className="p-6 space-y-3 flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-primary mb-1">{t.category}</p>
                      <h4 className="text-lg font-heading font-bold text-on-surface italic group-hover:text-primary transition-colors">{t.title}</h4>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant flex-1 italic line-clamp-2 leading-relaxed">{t.description}</p>
                  <Button className="w-full rounded-lg bg-surface-container-highest group-hover:bg-gradient-primary transition-all font-mono text-[10px] uppercase tracking-widest h-10 border-none">
                    Analyze Design
                  </Button>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-6 bg-surface-container-low rounded-3xl border border-white/5">
            <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto border border-white/5">
              <Search className="w-8 h-8 text-on-surface-variant" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-heading font-bold text-on-surface italic">No results found</h3>
              <p className="text-on-surface-variant">Try adjusting your filters or search query.</p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12 pb-12">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-10 h-10 rounded-lg border-outline-variant/30 bg-surface text-on-surface-variant hover:text-primary transition-all disabled:opacity-50"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button 
              key={i} 
              variant={page === i + 1 ? 'default' : 'outline'} 
              className={cn(
                "w-10 h-10 rounded-lg border-outline-variant/30 font-mono text-xs", 
                page === i + 1 ? "bg-primary text-on-primary border-primary" : "bg-surface text-on-surface-variant hover:border-primary/50"
              )}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button 
            variant="outline" 
            size="icon" 
            className="w-10 h-10 rounded-lg border-outline-variant/30 bg-surface text-on-surface-variant hover:text-primary transition-all disabled:opacity-50"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
