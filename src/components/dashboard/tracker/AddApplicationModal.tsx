'use client';

import React, { useState } from 'react';
import { X, Loader2, Plus, Link2, MapPin, DollarSign, StickyNote, Briefcase, Building2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useAppStore, JobStatus } from '@/lib/store';

const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: 'SAVED', label: 'Saved' },
  { value: 'APPLIED', label: 'Applied' },
  { value: 'SCREENING', label: 'Screening' },
  { value: 'INTERVIEW', label: 'Interview' },
  { value: 'OFFER', label: 'Offer' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'WITHDRAWN', label: 'Withdrawn' },
];

const PRIORITY_OPTIONS = [
  { value: 1, label: 'Low' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'High' },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddApplicationModal({ open, onClose }: Props) {
  const { applications, setApplications } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'details'>('basic');
  const [form, setForm] = useState({
    jobTitle: '',
    company: '',
    status: 'SAVED' as JobStatus,
    location: '',
    jobUrl: '',
    jobDescription: '',
    notes: '',
    salaryMin: '',
    salaryMax: '',
    priority: 2,
  });

  if (!open) return null;

  const set = (field: keyof typeof form, value: string | number) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleParseJD = async () => {
    if (!form.jobDescription.trim()) {
      toast.warning('Paste a job description first');
      return;
    }
    setParsing(true);
    try {
      const res = await api.post('/api/ai/parse-jd', { jd: form.jobDescription });
      const parsed = res.data?.data;
      if (parsed) {
        if (parsed.jobTitle && !form.jobTitle) set('jobTitle', parsed.jobTitle);
        if (parsed.company && !form.company) set('company', parsed.company);
        if (parsed.location && !form.location) set('location', parsed.location);
        toast.success('Job description parsed — fields auto-filled');
      }
    } catch {
      toast.error('Could not parse job description');
    } finally {
      setParsing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.jobTitle.trim() || !form.company.trim()) {
      toast.warning('Job title and company are required');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/api/applications', {
        jobTitle: form.jobTitle.trim(),
        company: form.company.trim(),
        status: form.status,
        location: form.location.trim() || undefined,
        jobUrl: form.jobUrl.trim() || undefined,
        jobDescription: form.jobDescription.trim() || undefined,
        notes: form.notes.trim() || undefined,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        priority: form.priority,
      });
      const app = res.data?.data;
      if (app) {
        setApplications([
          {
            id: app.id,
            jobTitle: app.jobTitle,
            company: app.company,
            status: app.status,
            location: app.location || '',
            jobUrl: app.jobUrl || '',
            jobDescription: app.jobDescription || '',
            notes: app.notes || '',
            platform: app.platform || '',
            salaryMin: app.salaryMin,
            salaryMax: app.salaryMax,
            priority: app.priority,
            dateApplied: app.createdAt || new Date().toISOString(),
            lastUpdated: app.updatedAt || new Date().toISOString(),
          },
          ...applications,
        ]);
      }
      toast.success(`${form.jobTitle} at ${form.company} added`);
      setForm({ jobTitle: '', company: '', status: 'SAVED', location: '', jobUrl: '', jobDescription: '', notes: '', salaryMin: '', salaryMax: '', priority: 2 });
      setActiveTab('basic');
      onClose();
    } catch {
      toast.error('Failed to add application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface border border-[var(--color-border-subtle)] rounded-2xl shadow-2xl z-10 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-lg font-bold font-hanken text-text-main">Add Application</h2>
            <p className="text-xs text-text-muted mt-0.5">Track a new job opportunity</p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-main transition-colors p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--color-border-subtle)] px-6">
          {(['basic', 'details'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-medium font-jetbrains uppercase tracking-widest transition-all border-b-2 -mb-px ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text-sub'
              }`}
            >
              {tab === 'basic' ? 'Basic Info' : 'Details & JD'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
            {activeTab === 'basic' && (
              <>
                <div>
                  <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains mb-1.5 block">
                    <Briefcase className="w-3 h-3 inline mr-1" />Job Title *
                  </Label>
                  <Input
                    value={form.jobTitle}
                    onChange={e => set('jobTitle', e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="bg-surface-2 border-[var(--color-border-subtle)] rounded-xl text-sm h-10"
                    autoFocus
                  />
                </div>
                <div>
                  <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains mb-1.5 block">
                    <Building2 className="w-3 h-3 inline mr-1" />Company *
                  </Label>
                  <Input
                    value={form.company}
                    onChange={e => set('company', e.target.value)}
                    placeholder="e.g. Stripe"
                    className="bg-surface-2 border-[var(--color-border-subtle)] rounded-xl text-sm h-10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains mb-1.5 block">Status</Label>
                    <select
                      value={form.status}
                      onChange={e => set('status', e.target.value)}
                      className="w-full bg-surface-2 border border-[var(--color-border-subtle)] rounded-xl px-3 text-sm h-10 text-text-main focus:outline-none focus:border-primary/50"
                    >
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains mb-1.5 block">Priority</Label>
                    <select
                      value={form.priority}
                      onChange={e => set('priority', Number(e.target.value))}
                      className="w-full bg-surface-2 border border-[var(--color-border-subtle)] rounded-xl px-3 text-sm h-10 text-text-main focus:outline-none focus:border-primary/50"
                    >
                      {PRIORITY_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains mb-1.5 block">
                    <MapPin className="w-3 h-3 inline mr-1" />Location
                  </Label>
                  <Input
                    value={form.location}
                    onChange={e => set('location', e.target.value)}
                    placeholder="e.g. Remote / San Francisco, CA"
                    className="bg-surface-2 border-[var(--color-border-subtle)] rounded-xl text-sm h-10"
                  />
                </div>
                <div>
                  <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains mb-1.5 block">
                    <Link2 className="w-3 h-3 inline mr-1" />Job URL
                  </Label>
                  <Input
                    value={form.jobUrl}
                    onChange={e => set('jobUrl', e.target.value)}
                    placeholder="https://..."
                    className="bg-surface-2 border-[var(--color-border-subtle)] rounded-xl text-sm h-10"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains mb-1.5 block">
                      <DollarSign className="w-3 h-3 inline mr-1" />Min Salary
                    </Label>
                    <Input
                      type="number"
                      value={form.salaryMin}
                      onChange={e => set('salaryMin', e.target.value)}
                      placeholder="e.g. 120000"
                      className="bg-surface-2 border-[var(--color-border-subtle)] rounded-xl text-sm h-10"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains mb-1.5 block">Max Salary</Label>
                    <Input
                      type="number"
                      value={form.salaryMax}
                      onChange={e => set('salaryMax', e.target.value)}
                      placeholder="e.g. 160000"
                      className="bg-surface-2 border-[var(--color-border-subtle)] rounded-xl text-sm h-10"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === 'details' && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains">
                      Job Description
                    </Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleParseJD}
                      disabled={parsing || !form.jobDescription.trim()}
                      className="h-7 text-xs gap-1.5 rounded-lg border-primary/30 text-primary hover:bg-primary/10"
                    >
                      {parsing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      {parsing ? 'Parsing...' : 'AI Parse'}
                    </Button>
                  </div>
                  <textarea
                    value={form.jobDescription}
                    onChange={e => set('jobDescription', e.target.value)}
                    placeholder="Paste the full job description here. Click 'AI Parse' to auto-fill job title, company, and location."
                    rows={8}
                    className="w-full bg-surface-2 border border-[var(--color-border-subtle)] rounded-xl px-3 py-2.5 text-sm text-text-sub placeholder:text-text-muted focus:outline-none focus:border-primary/50 resize-none font-sans"
                  />
                  <p className="text-[10px] text-text-muted mt-1">Paste the JD and use AI Parse to auto-fill fields on the Basic tab.</p>
                </div>
                <div>
                  <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains mb-1.5 block">
                    <StickyNote className="w-3 h-3 inline mr-1" />Notes
                  </Label>
                  <textarea
                    value={form.notes}
                    onChange={e => set('notes', e.target.value)}
                    placeholder="Recruiter name, referral source, important deadlines..."
                    rows={3}
                    className="w-full bg-surface-2 border border-[var(--color-border-subtle)] rounded-xl px-3 py-2.5 text-sm text-text-sub focus:outline-none focus:border-primary/50 resize-none font-sans"
                  />
                </div>
              </>
            )}
          </div>

          <div className="px-6 pb-6 flex gap-3 border-t border-[var(--color-border-subtle)] pt-4">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1 rounded-xl h-10 border-[var(--color-border-subtle)] text-sm">
              Cancel
            </Button>
            {activeTab === 'basic' ? (
              <Button type="button" onClick={() => setActiveTab('details')} variant="outline" className="flex-1 rounded-xl h-10 border-primary/30 text-primary text-sm">
                Add Details
              </Button>
            ) : null}
            <Button type="submit" disabled={loading} className="flex-1 rounded-xl h-10 border-none gap-2 text-sm shadow-lg shadow-primary/20">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {loading ? 'Adding...' : 'Add Application'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
