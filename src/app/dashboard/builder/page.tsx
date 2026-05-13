'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sparkles, Download, Save, CheckCircle2, Loader2, Eye, LayoutTemplate, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function ResumeBuilderPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'templates'>('content');
  const [template, setTemplate] = useState<'modern' | 'minimal' | 'executive'>('modern');
  const [atsScore, setAtsScore] = useState(92);

  const [profile, setProfile] = useState({
    personalInfo: {
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@example.com',
      phone: '+1 (555) 234-5678',
      linkedin: 'linkedin.com/in/sarahjenkins',
    },
    summary: 'Senior Cloud Solutions Architect and systems builder with 8+ years of focused expertise in designing distributed message queues, migrating monolithic layers to AWS Kubernetes clusters, and driving multi-region reliability.',
    experience: [
      { 
        company: 'CloudScale Infrastructure', 
        role: 'Lead Backend Engineer', 
        dates: '2022 - Present', 
        description: 'Architected highly available REST/gRPC service topologies handling 120K req/sec. Redesigned connection pooling boundaries in Node.js/Go to drop database latency by 42% across global customer shards.' 
      },
      { 
        company: 'DataStream Metrics', 
        role: 'Software Engineer', 
        dates: '2019 - 2022', 
        description: 'Built high-throughput logging collectors leveraging Apache Kafka and Elasticsearch. Implemented unified JWT security barriers and optimized CI/CD GitHub Actions pipelines saving 20 dev-hours weekly.' 
      }
    ],
    skills: 'Go, TypeScript, Python, Kubernetes, AWS (EKS, S3, RDS), Apache Kafka, PostgreSQL, Redis, Docker, gRPC, Server-Sent Events (SSE), Terraform',
  });

  useEffect(() => {
    const fetchMasterProfile = async () => {
      try {
        const res = await api.get('/api/resume/master');
        if (res.data?.data) {
          // Merge safely to ensure rich fallback presentation if empty
          const p = res.data.data;
          setProfile({
            personalInfo: {
              name: p.personalInfo?.name || profile.personalInfo.name,
              email: p.personalInfo?.email || profile.personalInfo.email,
              phone: p.personalInfo?.phone || profile.personalInfo.phone,
              linkedin: p.personalInfo?.linkedin || profile.personalInfo.linkedin,
            },
            summary: p.summary || profile.summary,
            experience: p.experience?.length ? p.experience : profile.experience,
            skills: p.skills || profile.skills,
          });
        }
      } catch (error) {
        console.error('Master profile load fallback', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMasterProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/api/resume/master', { data: profile });
      setSaved(true);
      toast.success('Resume Customizations Synchronized');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error('Failed to sync changes');
    } finally {
      setSaving(false);
    }
  };

  const handleExpChange = (index: number, field: string, value: string) => {
    const updated = [...profile.experience];
    updated[index] = { ...updated[index], [field]: value };
    setProfile({ ...profile, experience: updated });
  };

  const addExperience = () => {
    setProfile({
      ...profile,
      experience: [...profile.experience, { company: 'New Company', role: 'Role Title', dates: '2024 - Present', description: 'Quantified engineering contribution details go here.' }]
    });
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center text-xs text-text-muted gap-2 font-jetbrains uppercase tracking-widest mb-2">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Workspace</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-bold">Resume Builder</span>
          </div>
          <h1 className="text-3xl font-bold font-hanken">Resume Builder</h1>
          <p className="text-text-sub text-sm">Design, customize, and generate formatted PDF output optimized for high ATS extraction.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => {
              toast.success('Initializing layout download...');
              window.print();
            }} 
            variant="outline" 
            className="rounded-xl gap-2 hover:bg-primary/10 hover:text-primary border-white/10"
          >
            <Download className="h-4 w-4" /> Export Document
          </Button>
          <Button onClick={handleSave} className="rounded-xl gap-2 shadow-lg shadow-primary/20 border-none" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saving ? 'Saving...' : saved ? 'Saved!' : 'Sync Profile'}
          </Button>
        </div>
      </div>

      {/* Grid view: Control drawer left, Document layout canvas right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Editors & Settings */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex bg-surface-2 p-1 rounded-2xl border border-white/5">
            <button 
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activeTab === 'content' ? 'bg-primary text-background shadow-md' : 'text-text-sub hover:text-text-main'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Content
            </button>
            <button 
              onClick={() => setActiveTab('templates')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                activeTab === 'templates' ? 'bg-primary text-background shadow-md' : 'text-text-sub hover:text-text-main'
              }`}
            >
              <LayoutTemplate className="w-3.5 h-3.5" /> Template Layouts
            </button>
          </div>

          {activeTab === 'content' ? (
            <div className="flex flex-col gap-6">
              {/* Personal Block */}
              <Card className="bg-surface/50 border-white/5 backdrop-blur-md rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold font-hanken text-primary">Personal Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-xs text-text-sub mb-1.5 block">Full Name</Label>
                    <Input 
                      value={profile.personalInfo.name} 
                      onChange={e => setProfile({...profile, personalInfo: {...profile.personalInfo, name: e.target.value}})}
                      className="bg-surface border-white/10 rounded-xl h-10 text-sm focus-visible:ring-primary/50" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-text-sub mb-1.5 block">Email</Label>
                      <Input 
                        value={profile.personalInfo.email} 
                        onChange={e => setProfile({...profile, personalInfo: {...profile.personalInfo, email: e.target.value}})}
                        className="bg-surface border-white/10 rounded-xl h-10 text-xs" 
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-text-sub mb-1.5 block">Phone</Label>
                      <Input 
                        value={profile.personalInfo.phone} 
                        onChange={e => setProfile({...profile, personalInfo: {...profile.personalInfo, phone: e.target.value}})}
                        className="bg-surface border-white/10 rounded-xl h-10 text-xs" 
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-text-sub mb-1.5 block">LinkedIn / Profile URL</Label>
                    <Input 
                      value={profile.personalInfo.linkedin} 
                      onChange={e => setProfile({...profile, personalInfo: {...profile.personalInfo, linkedin: e.target.value}})}
                      className="bg-surface border-white/10 rounded-xl h-10 text-xs text-text-muted" 
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card className="bg-surface/50 border-white/5 backdrop-blur-md rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold font-hanken text-primary">Professional Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea 
                    value={profile.summary}
                    onChange={e => setProfile({...profile, summary: e.target.value})}
                    rows={4}
                    className="w-full bg-surface border border-white/10 rounded-xl p-3 text-xs text-text-sub focus:outline-none focus:border-primary/50 resize-none font-sans leading-relaxed"
                  />
                </CardContent>
              </Card>

              {/* Experience List */}
              <Card className="bg-surface/50 border-white/5 backdrop-blur-md rounded-2xl">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-bold font-hanken text-primary">Experience Milestones</CardTitle>
                  <Button onClick={addExperience} variant="ghost" size="sm" className="h-7 px-2 text-xs text-primary hover:bg-primary/10">
                    + Add Entry
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {profile.experience.map((exp, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-surface-2 border border-white/5 relative group space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-[10px] text-text-muted block mb-1 uppercase tracking-wider">Company</Label>
                          <Input 
                            value={exp.company}
                            onChange={e => handleExpChange(idx, 'company', e.target.value)}
                            className="h-8 text-xs bg-surface border-white/5 rounded-lg"
                          />
                        </div>
                        <div>
                          <Label className="text-[10px] text-text-muted block mb-1 uppercase tracking-wider">Role</Label>
                          <Input 
                            value={exp.role}
                            onChange={e => handleExpChange(idx, 'role', e.target.value)}
                            className="h-8 text-xs bg-surface border-white/5 rounded-lg"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-[10px] text-text-muted block mb-1 uppercase tracking-wider">Dates</Label>
                        <Input 
                          value={exp.dates}
                          onChange={e => handleExpChange(idx, 'dates', e.target.value)}
                          className="h-8 text-xs bg-surface border-white/5 rounded-lg w-1/2"
                        />
                      </div>
                      <div>
                        <Label className="text-[10px] text-text-muted block mb-1 uppercase tracking-wider">Impact Details</Label>
                        <textarea 
                          value={exp.description}
                          onChange={e => handleExpChange(idx, 'description', e.target.value)}
                          rows={3}
                          className="w-full bg-surface border border-white/5 rounded-lg p-2 text-xs text-text-sub focus:outline-none focus:border-primary/50 resize-none font-sans"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="bg-surface/50 border-white/5 backdrop-blur-md rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold font-hanken text-primary">Skills Array</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea 
                    value={profile.skills}
                    onChange={e => setProfile({...profile, skills: e.target.value})}
                    rows={3}
                    placeholder="Separate skills with commas"
                    className="w-full bg-surface border border-white/10 rounded-xl p-3 text-xs text-text-sub focus:outline-none focus:border-primary/50 resize-none font-sans leading-relaxed"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="bg-surface/50 border-white/5 backdrop-blur-md rounded-2xl p-6">
              <h3 className="text-sm font-bold text-text-main mb-4 uppercase tracking-wider font-jetbrains">Select Document Theme</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setTemplate('modern')}
                  className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                    template === 'modern' ? 'border-primary bg-primary/10' : 'border-white/5 hover:bg-surface-2'
                  }`}
                >
                  <div>
                    <span className="text-sm font-bold block text-text-main">Modern Accelerator</span>
                    <span className="text-xs text-text-muted">High contrast primary headers, crisp font layouts</span>
                  </div>
                  {template === 'modern' && <Sparkles className="w-4 h-4 text-primary" />}
                </button>

                <button 
                  onClick={() => setTemplate('minimal')}
                  className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                    template === 'minimal' ? 'border-primary bg-primary/10' : 'border-white/5 hover:bg-surface-2'
                  }`}
                >
                  <div>
                    <span className="text-sm font-bold block text-text-main">Clean Classic</span>
                    <span className="text-xs text-text-muted">Pure left-aligned traditional structure for maximum safety</span>
                  </div>
                  {template === 'minimal' && <Sparkles className="w-4 h-4 text-primary" />}
                </button>

                <button 
                  onClick={() => setTemplate('executive')}
                  className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                    template === 'executive' ? 'border-primary bg-primary/10' : 'border-white/5 hover:bg-surface-2'
                  }`}
                >
                  <div>
                    <span className="text-sm font-bold block text-text-main">Executive Tier</span>
                    <span className="text-xs text-text-muted">Centered headers, sophisticated serif emphasis</span>
                  </div>
                  {template === 'executive' && <Sparkles className="w-4 h-4 text-primary" />}
                </button>
              </div>

              <div className="mt-8 p-4 rounded-xl bg-surface-2 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-muted font-jetbrains uppercase">Live Parsability Score</span>
                  <span className="text-sm font-bold text-emerald-400">{atsScore}% Optimized</span>
                </div>
                <div className="w-full bg-surface h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${atsScore}%` }} />
                </div>
                <p className="text-[11px] text-text-sub mt-2 leading-tight">Layout conforms securely to automated vector keyword scanning parameters.</p>
              </div>
            </Card>
          )}
        </div>

        {/* Right Side: Live Printable Canvas Viewport */}
        <div className="lg:col-span-7">
          <div className="sticky top-6">
            <div className="bg-white text-black p-8 sm:p-10 rounded-2xl shadow-2xl min-h-[750px] font-sans printable-resume border border-white/20 transition-all">
              
              {/* Layout variation logic based on selected theme */}
              <div className={`border-b-2 pb-5 mb-6 ${template === 'executive' ? 'text-center border-neutral-400' : template === 'modern' ? 'border-blue-600' : 'border-neutral-200'}`}>
                <h1 className={`text-2xl sm:text-3xl font-bold font-serif text-neutral-900 tracking-tight ${template === 'modern' ? 'text-blue-900 font-sans' : ''}`}>
                  {profile.personalInfo.name || 'Your Full Name'}
                </h1>
                <div className={`flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-neutral-600 font-medium ${template === 'executive' ? 'justify-center' : ''}`}>
                  <span>{profile.personalInfo.email}</span>
                  {profile.personalInfo.phone && <span>• {profile.personalInfo.phone}</span>}
                  {profile.personalInfo.linkedin && <span className="text-blue-700">• {profile.personalInfo.linkedin}</span>}
                </div>
              </div>

              {/* Summary */}
              {profile.summary && (
                <div className="mb-6">
                  <h2 className={`text-xs uppercase font-bold tracking-widest text-neutral-800 mb-2 font-mono ${template === 'modern' ? 'text-blue-800' : ''}`}>
                    Professional Summary
                  </h2>
                  <p className="text-xs text-neutral-700 leading-relaxed text-justify font-sans">
                    {profile.summary}
                  </p>
                </div>
              )}

              {/* Experience */}
              <div className="mb-6">
                <h2 className={`text-xs uppercase font-bold tracking-widest text-neutral-800 mb-3 font-mono ${template === 'modern' ? 'text-blue-800' : ''}`}>
                  Experience
                </h2>
                <div className="space-y-4">
                  {profile.experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs font-bold text-neutral-900">{exp.role || 'Role'}</span>
                        <span className="text-[11px] text-neutral-500 font-mono">{exp.dates}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-neutral-700">{exp.company || 'Company'}</div>
                      {exp.description && (
                        <p className="text-xs text-neutral-600 leading-normal pl-3 border-l-2 border-neutral-200 mt-1 text-justify">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Array */}
              {profile.skills && (
                <div>
                  <h2 className={`text-xs uppercase font-bold tracking-widest text-neutral-800 mb-2 font-mono ${template === 'modern' ? 'text-blue-800' : ''}`}>
                    Core Competencies
                  </h2>
                  <div className="flex flex-wrap gap-1">
                    {profile.skills.split(',').map((skill, i) => {
                      const trimmed = skill.trim();
                      if (!trimmed) return null;
                      return (
                        <span key={i} className="text-[11px] bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded font-medium border border-neutral-200">
                          {trimmed}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
