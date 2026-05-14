'use client';

import React, { useState } from 'react';
import { X, Loader2, Plus } from 'lucide-react';
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

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddApplicationModal({ open, onClose }: Props) {
  const { applications, setApplications } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    jobTitle: '',
    company: '',
    status: 'SAVED' as JobStatus,
    location: '',
    jobUrl: '',
    notes: '',
  });

  if (!open) return null;

  const set = (field: keyof typeof form, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

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
        notes: form.notes.trim() || undefined,
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
            notes: app.notes || '',
            platform: app.platform || '',
            dateApplied: app.createdAt || new Date().toISOString(),
            lastUpdated: app.updatedAt || new Date().toISOString(),
          },
          ...applications,
        ]);
      }
      toast.success(`${form.jobTitle} at ${form.company} added`);
      setForm({ jobTitle: '', company: '', status: 'SAVED', location: '', jobUrl: '', notes: '' });
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
      <div className="relative w-full max-w-md bg-surface border border-white/10 rounded-2xl shadow-2xl p-6 z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold font-hanken text-text-main">Add Application</h2>
            <p className="text-xs text-text-muted mt-0.5">Track a new job application</p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text-main transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains mb-1.5 block">Job Title *</Label>
              <Input
                value={form.jobTitle}
                onChange={e => set('jobTitle', e.target.value)}
                placeholder="e.g. Senior Engineer"
                className="bg-surface-2 border-white/10 rounded-xl text-sm h-10"
                autoFocus
              />
            </div>
            <div className="col-span-2">
              <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains mb-1.5 block">Company *</Label>
              <Input
                value={form.company}
                onChange={e => set('company', e.target.value)}
                placeholder="e.g. Stripe"
                className="bg-surface-2 border-white/10 rounded-xl text-sm h-10"
              />
            </div>
            <div>
              <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains mb-1.5 block">Status</Label>
              <select
                value={form.status}
                onChange={e => set('status', e.target.value)}
                className="w-full bg-surface-2 border border-white/10 rounded-xl px-3 text-sm h-10 text-text-main focus:outline-none focus:border-primary/50"
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains mb-1.5 block">Location</Label>
              <Input
                value={form.location}
                onChange={e => set('location', e.target.value)}
                placeholder="e.g. Remote"
                className="bg-surface-2 border-white/10 rounded-xl text-sm h-10"
              />
            </div>
            <div className="col-span-2">
              <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains mb-1.5 block">Job URL</Label>
              <Input
                value={form.jobUrl}
                onChange={e => set('jobUrl', e.target.value)}
                placeholder="https://..."
                className="bg-surface-2 border-white/10 rounded-xl text-sm h-10"
              />
            </div>
            <div className="col-span-2">
              <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains mb-1.5 block">Notes</Label>
              <textarea
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                placeholder="Any notes about this application..."
                rows={3}
                className="w-full bg-surface-2 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-text-sub focus:outline-none focus:border-primary/50 resize-none font-sans"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1 rounded-xl h-10 border-white/10 text-sm">
              Cancel
            </Button>
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
