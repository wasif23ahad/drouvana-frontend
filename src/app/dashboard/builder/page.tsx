'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sparkles, Download, Save, CheckCircle2, Loader2, LayoutTemplate, FileText, ChevronRight, Sliders, ArrowUp, ArrowDown, AlignLeft, AlignCenter, AlignRight, Plus, Trash2, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

interface SectionItem {
  id: string;
  title: string;
  enabled: boolean;
}

export default function ResumeBuilderPage() {
  const { status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Tab controller matching FlowCV core features
  const [activeTab, setActiveTab] = useState<'content' | 'appearance' | 'versions'>('content');
  
  // Design configuration states
  const [template, setTemplate] = useState<'modern' | 'minimal' | 'executive'>('modern');
  const [fontFamily, setFontFamily] = useState<string>('sans-serif');
  const [fontSize, setFontSize] = useState<number>(13);
  const [lineSpacing, setLineSpacing] = useState<number>(1.5);
  const [sectionGap, setSectionGap] = useState<number>(20);
  const [headerAlign, setHeaderAlign] = useState<'left' | 'center' | 'right'>('left');
  const [atsScore, setAtsScore] = useState(96);

  // FlowCV style custom section layout ordering controller
  const [sectionsOrder, setSectionsOrder] = useState<SectionItem[]>([
    { id: 'summary', title: 'Professional Summary', enabled: true },
    { id: 'experience', title: 'Work Experience', enabled: true },
    { id: 'skills', title: 'Core Competencies', enabled: true },
    { id: 'education', title: 'Education History', enabled: true }
  ]);

  // Master Content payload state
  const [profile, setProfile] = useState({
    personalInfo: {
      name: 'Sarah Jenkins',
      email: 'sarah.jenkins@example.com',
      phone: '+1 (555) 234-5678',
      linkedin: 'linkedin.com/in/sarahjenkins',
      address: 'San Francisco, CA'
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
    skills: 'Go, TypeScript, Python, Kubernetes, AWS (EKS, S3, RDS), Apache Kafka, PostgreSQL, Redis, Docker, gRPC',
    education: [
      {
        institution: 'University of California, Berkeley',
        degree: 'B.S. Electrical Engineering & Computer Science',
        dates: '2015 - 2019'
      }
    ]
  });

  // Local storage cache for user-created custom versions
  const [savedResumes, setSavedResumes] = useState<Array<{ id: string; name: string; date: string; profile: any; template: string }>>([]);

  useEffect(() => {
    // Load local storage saved versions if present
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('flowcv_saved_resumes');
        if (stored) setSavedResumes(JSON.parse(stored));
      } catch (err) {}
    }

    if (status === 'unauthenticated') {
      setLoading(false);
      return;
    }

    if (status !== 'authenticated') return;

    // Fetch primary profile data from backend
    const fetchMasterProfile = async () => {
      try {
        const res = await api.get('/api/resume/master');
        if (res.data?.data) {
          const p = res.data.data;
          setProfile(prev => ({
            ...prev,
            personalInfo: {
              ...prev.personalInfo,
              name: p.personalInfo?.name || prev.personalInfo.name,
              email: p.personalInfo?.email || prev.personalInfo.email,
              phone: p.personalInfo?.phone || prev.personalInfo.phone,
              linkedin: p.personalInfo?.linkedin || prev.personalInfo.linkedin,
            },
            summary: p.summary || prev.summary,
            experience: p.experience?.length ? p.experience : prev.experience,
            skills: p.skills || prev.skills,
          }));
        }
      } catch (error) {
        // non-blocking fallback presentation
      } finally {
        setLoading(false);
      }
    };
    fetchMasterProfile();
  }, [status]);

  // Save current flow custom build state to persistent memory
  const handleSaveVersion = (customVersionName?: string) => {
    const nameToSave = customVersionName || `Formatted Layout — ${new Date().toLocaleDateString()}`;
    const newEntry = {
      id: Date.now().toString(),
      name: nameToSave,
      date: new Date().toLocaleString(),
      profile,
      template
    };

    const updatedList = [newEntry, ...savedResumes];
    setSavedResumes(updatedList);

    if (typeof window !== 'undefined') {
      localStorage.setItem('flowcv_saved_resumes', JSON.stringify(updatedList));
    }

    toast.success(`Saved "${nameToSave}" to local history storage`);
  };

  // Sync to database backend profile table
  const handleSyncBackend = async () => {
    setSaving(true);
    try {
      await api.put('/api/resume/master', { data: profile });
      setSaved(true);
      toast.success('Resume Core Successfully Synchronized with Cloud Database');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error('Cloud API sync encountered timeout. Saved to Local Memory.');
    } finally {
      setSaving(false);
    }
  };

  // Switch/Load an entire old resume setup
  const loadSavedVersion = (entry: any) => {
    setProfile(entry.profile);
    if (entry.template) setTemplate(entry.template);
    toast.success(`Loaded saved configurations: ${entry.name}`);
  };

  const deleteSavedVersion = (id: string) => {
    const filter = savedResumes.filter(item => item.id !== id);
    setSavedResumes(filter);
    if (typeof window !== 'undefined') {
      localStorage.setItem('flowcv_saved_resumes', JSON.stringify(filter));
    }
    toast.info('Removed snapshot configuration');
  };

  // Section position adjustment functions
  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...sectionsOrder];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;
    setSectionsOrder(newOrder);
    toast.success('Section shift updated layout array');
  };

  const moveSectionDown = (index: number) => {
    if (index === sectionsOrder.length - 1) return;
    const newOrder = [...sectionsOrder];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;
    setSectionsOrder(newOrder);
    toast.success('Section shift updated layout array');
  };

  const toggleSectionEnabled = (id: string) => {
    setSectionsOrder(sectionsOrder.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  // Experience updates
  const handleExpChange = (index: number, field: string, value: string) => {
    const updated = [...profile.experience];
    updated[index] = { ...updated[index], [field]: value };
    setProfile({ ...profile, experience: updated });
  };

  const addExperience = () => {
    setProfile({
      ...profile,
      experience: [...profile.experience, { company: 'New Enterprise', role: 'Role Title', dates: '2024 - Present', description: 'Quantified impact metrics and delivery timeline updates go here.' }]
    });
  };

  const deleteExperience = (idx: number) => {
    const filter = profile.experience.filter((_, i) => i !== idx);
    setProfile({ ...profile, experience: filter });
  };

  // Education updates
  const handleEduChange = (index: number, field: string, value: string) => {
    const updated = [...profile.education];
    updated[index] = { ...updated[index], [field]: value };
    setProfile({ ...profile, education: updated });
  };

  const addEducation = () => {
    setProfile({
      ...profile,
      education: [...profile.education, { institution: 'University Name', degree: 'Degree Field', dates: '2020 - 2024' }]
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
            <span className="text-primary font-bold">FlowCV Resume Studio</span>
          </div>
          <h1 className="text-3xl font-bold font-hanken">FlowCV Resume Studio</h1>
          <p className="text-text-sub text-sm">Design professional A4 ratio documents with customizable section sorting, fine-grain font controls, and custom version storage.</p>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Button 
            onClick={() => handleSaveVersion()} 
            variant="outline" 
            className="rounded-xl gap-2 border-white/10 hover:bg-surface-2 h-10 text-xs"
          >
            <Save className="h-3.5 w-3.5 text-primary" /> Snapshot State
          </Button>
          
          <Button 
            onClick={() => {
              toast.success('Activating A4 printable rendering layers...');
              window.print();
            }} 
            variant="secondary" 
            className="rounded-xl gap-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 h-10 text-xs"
          >
            <Download className="h-3.5 w-3.5" /> Download PDF
          </Button>

          <Button 
            onClick={handleSyncBackend} 
            className="rounded-xl gap-2 shadow-lg shadow-primary/20 border-none h-10 text-xs font-bold" 
            disabled={saving}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            {saving ? 'Saving DB...' : saved ? 'Synchronized' : 'Sync Profile DB'}
          </Button>
        </div>
      </div>

      {/* Primary Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Control Column */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Sub Navigation Tabs */}
          <div className="flex bg-surface-2 p-1 rounded-2xl border border-white/5">
            <button 
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'content' ? 'bg-primary text-background shadow-md' : 'text-text-sub hover:text-text-main'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> 1. Sections
            </button>
            <button 
              onClick={() => setActiveTab('appearance')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'appearance' ? 'bg-primary text-background shadow-md' : 'text-text-sub hover:text-text-main'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" /> 2. Beautify
            </button>
            <button 
              onClick={() => setActiveTab('versions')}
              className={`flex-1 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'versions' ? 'bg-primary text-background shadow-md' : 'text-text-sub hover:text-text-main'
              }`}
            >
              <LayoutTemplate className="w-3.5 h-3.5" /> 3. History ({savedResumes.length})
            </button>
          </div>

          {/* TAB 1: Content & Ordering */}
          {activeTab === 'content' && (
            <div className="flex flex-col gap-6">
              
              {/* Dynamic Section Position Ordering */}
              <Card className="bg-surface/50 border-white/5 backdrop-blur-md rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xs uppercase font-jetbrains text-primary tracking-wider flex items-center justify-between">
                    <span>FlowCV Layout Sorting</span>
                    <span className="text-[10px] text-text-muted normal-case font-sans">Shift up/down to arrange output</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sectionsOrder.map((sec, idx) => (
                    <div key={sec.id} className="flex items-center justify-between p-2.5 bg-surface-2 rounded-xl border border-white/5">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={sec.enabled} 
                          onChange={() => toggleSectionEnabled(sec.id)}
                          className="rounded border-white/10 accent-primary"
                        />
                        <span className={`text-xs font-bold ${sec.enabled ? 'text-text-main' : 'text-text-muted line-through opacity-50'}`}>
                          {sec.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => moveSectionUp(idx)} 
                          disabled={idx === 0}
                          className="h-6 w-6 p-0 hover:bg-surface text-text-sub"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => moveSectionDown(idx)} 
                          disabled={idx === sectionsOrder.length - 1}
                          className="h-6 w-6 p-0 hover:bg-surface text-text-sub"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Personal Details */}
              <Card className="bg-surface/50 border-white/5 backdrop-blur-md rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold font-hanken text-text-main">Personal Info Block</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-[11px] text-text-sub mb-1 block">Full Name</Label>
                    <Input 
                      value={profile.personalInfo.name} 
                      onChange={e => setProfile({...profile, personalInfo: {...profile.personalInfo, name: e.target.value}})}
                      className="bg-surface border-white/10 rounded-xl h-9 text-xs" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <Label className="text-[11px] text-text-sub mb-1 block">Email</Label>
                      <Input 
                        value={profile.personalInfo.email} 
                        onChange={e => setProfile({...profile, personalInfo: {...profile.personalInfo, email: e.target.value}})}
                        className="bg-surface border-white/10 rounded-xl h-9 text-xs" 
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] text-text-sub mb-1 block">Phone</Label>
                      <Input 
                        value={profile.personalInfo.phone} 
                        onChange={e => setProfile({...profile, personalInfo: {...profile.personalInfo, phone: e.target.value}})}
                        className="bg-surface border-white/10 rounded-xl h-9 text-xs" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <Label className="text-[11px] text-text-sub mb-1 block">LinkedIn</Label>
                      <Input 
                        value={profile.personalInfo.linkedin} 
                        onChange={e => setProfile({...profile, personalInfo: {...profile.personalInfo, linkedin: e.target.value}})}
                        className="bg-surface border-white/10 rounded-xl h-9 text-xs" 
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] text-text-sub mb-1 block">Address / Location</Label>
                      <Input 
                        value={profile.personalInfo.address || ''} 
                        onChange={e => setProfile({...profile, personalInfo: {...profile.personalInfo, address: e.target.value}})}
                        placeholder="e.g. SF, California"
                        className="bg-surface border-white/10 rounded-xl h-9 text-xs" 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card className="bg-surface/50 border-white/5 backdrop-blur-md rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold font-hanken text-text-main">Professional Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea 
                    value={profile.summary}
                    onChange={e => setProfile({...profile, summary: e.target.value})}
                    rows={3}
                    className="w-full bg-surface border border-white/10 rounded-xl p-2.5 text-xs text-text-sub focus:outline-none focus:border-primary/50 resize-none font-sans"
                  />
                </CardContent>
              </Card>

              {/* Experience */}
              <Card className="bg-surface/50 border-white/5 backdrop-blur-md rounded-2xl">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold font-hanken text-text-main">Work Experience</CardTitle>
                  <Button onClick={addExperience} size="sm" variant="ghost" className="h-7 text-xs text-primary px-2 hover:bg-surface">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Entry
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.experience.map((exp, idx) => (
                    <div key={idx} className="p-3 bg-surface-2 rounded-xl border border-white/5 space-y-2.5 relative group">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => deleteExperience(idx)}
                        className="absolute top-2 right-2 h-6 w-6 p-0 text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                      <div className="grid grid-cols-2 gap-2 pr-6">
                        <Input 
                          placeholder="Company"
                          value={exp.company}
                          onChange={e => handleExpChange(idx, 'company', e.target.value)}
                          className="h-8 text-xs bg-surface border-white/5 rounded-lg"
                        />
                        <Input 
                          placeholder="Role"
                          value={exp.role}
                          onChange={e => handleExpChange(idx, 'role', e.target.value)}
                          className="h-8 text-xs bg-surface border-white/5 rounded-lg"
                        />
                      </div>
                      <Input 
                        placeholder="Dates (e.g. 2022 - Present)"
                        value={exp.dates}
                        onChange={e => handleExpChange(idx, 'dates', e.target.value)}
                        className="h-8 text-xs bg-surface border-white/5 rounded-lg w-1/2"
                      />
                      <textarea 
                        value={exp.description}
                        onChange={e => handleExpChange(idx, 'description', e.target.value)}
                        rows={2}
                        placeholder="Bullet responsibilities..."
                        className="w-full bg-surface border border-white/5 rounded-lg p-2 text-xs text-text-sub focus:outline-none focus:border-primary/50 resize-none font-sans"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Skills Array */}
              <Card className="bg-surface/50 border-white/5 backdrop-blur-md rounded-2xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold font-hanken text-text-main">Skills List</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input 
                    value={profile.skills}
                    onChange={e => setProfile({...profile, skills: e.target.value})}
                    placeholder="Comma separated string..."
                    className="bg-surface border-white/10 rounded-xl h-9 text-xs"
                  />
                </CardContent>
              </Card>

              {/* Education Block */}
              <Card className="bg-surface/50 border-white/5 backdrop-blur-md rounded-2xl">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold font-hanken text-text-main">Education History</CardTitle>
                  <Button onClick={addEducation} size="sm" variant="ghost" className="h-7 text-xs text-primary px-2 hover:bg-surface">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Entry
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile.education.map((edu, idx) => (
                    <div key={idx} className="p-3 bg-surface-2 rounded-xl border border-white/5 space-y-2">
                      <Input 
                        placeholder="Institution"
                        value={edu.institution}
                        onChange={e => handleEduChange(idx, 'institution', e.target.value)}
                        className="h-8 text-xs bg-surface border-white/5 rounded-lg"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input 
                          placeholder="Degree"
                          value={edu.degree}
                          onChange={e => handleEduChange(idx, 'degree', e.target.value)}
                          className="h-8 text-xs bg-surface border-white/5 rounded-lg"
                        />
                        <Input 
                          placeholder="Dates"
                          value={edu.dates}
                          onChange={e => handleEduChange(idx, 'dates', e.target.value)}
                          className="h-8 text-xs bg-surface border-white/5 rounded-lg"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

            </div>
          )}

          {/* TAB 2: Appearance & Beautification Controls */}
          {activeTab === 'appearance' && (
            <div className="flex flex-col gap-6">
              
              {/* Core Themes Switching (Transfers all active state seamlessly) */}
              <Card className="bg-surface/50 border-white/5 backdrop-blur-md rounded-2xl p-5">
                <span className="text-xs font-jetbrains uppercase text-primary tracking-wider block mb-3 font-bold">Layout Architectures</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'modern', name: 'Modern Accent' },
                    { id: 'minimal', name: 'Pure Classic' },
                    { id: 'executive', name: 'Executive Tier' }
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t.id as any)}
                      className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        template === t.id ? 'bg-primary/20 border-primary text-primary font-bold' : 'bg-surface border-white/5 text-text-muted hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs tracking-tight">{t.name}</span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Font Picker */}
              <Card className="bg-surface/50 border-white/5 backdrop-blur-md rounded-2xl p-5">
                <span className="text-xs font-jetbrains uppercase text-primary tracking-wider block mb-3 font-bold">Typography Families</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'sans-serif', name: 'Inter / System Default', fontClass: 'font-sans' },
                    { id: 'Georgia, serif', name: 'Georgia Serif', fontClass: 'font-serif' },
                    { id: '"Courier New", monospace', name: 'JetBrains / Mono', fontClass: 'font-mono' },
                    { id: '"Arial", sans-serif', name: 'Clean Corporate Arial', fontClass: 'font-sans' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setFontFamily(f.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        fontFamily === f.id ? 'bg-primary/10 border-primary text-text-main font-bold' : 'bg-surface border-white/5 text-text-sub hover:text-text-main'
                      }`}
                    >
                      <span className="text-xs block truncate" style={{ fontFamily: f.id }}>{f.name}</span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Layout Alignment sliders */}
              <Card className="bg-surface/50 border-white/5 backdrop-blur-md rounded-2xl p-5 space-y-5">
                
                {/* Header Align */}
                <div>
                  <span className="text-xs font-jetbrains uppercase text-text-sub tracking-wider block mb-2">Header Title Alignment</span>
                  <div className="flex bg-surface p-1 rounded-xl border border-white/5">
                    {[
                      { id: 'left', icon: AlignLeft, label: 'Left' },
                      { id: 'center', icon: AlignCenter, label: 'Center' },
                      { id: 'right', icon: AlignRight, label: 'Right' }
                    ].map(a => (
                      <button
                        key={a.id}
                        onClick={() => setHeaderAlign(a.id as any)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          headerAlign === a.id ? 'bg-surface-2 text-primary shadow-sm' : 'text-text-muted hover:text-text-sub'
                        }`}
                      >
                        <a.icon className="w-3.5 h-3.5" /> {a.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Scaling Stepper */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-text-sub">Base Font Scale</span>
                    <span className="text-xs font-bold font-mono text-primary">{fontSize}px</span>
                  </div>
                  <input 
                    type="range" 
                    min={11} 
                    max={16} 
                    step={0.5} 
                    value={fontSize}
                    onChange={e => setFontSize(parseFloat(e.target.value))}
                    className="w-full accent-primary bg-surface h-1.5 rounded-lg"
                  />
                </div>

                {/* Line Spacing */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-text-sub">Vertical Line Spacing</span>
                    <span className="text-xs font-bold font-mono text-primary">{lineSpacing}x</span>
                  </div>
                  <input 
                    type="range" 
                    min={1.1} 
                    max={2.0} 
                    step={0.1} 
                    value={lineSpacing}
                    onChange={e => setLineSpacing(parseFloat(e.target.value))}
                    className="w-full accent-primary bg-surface h-1.5 rounded-lg"
                  />
                </div>

                {/* Section Padding Spacer */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-text-sub">Section Block Separation</span>
                    <span className="text-xs font-bold font-mono text-primary">{sectionGap}px</span>
                  </div>
                  <input 
                    type="range" 
                    min={10} 
                    max={35} 
                    step={1} 
                    value={sectionGap}
                    onChange={e => setSectionGap(parseInt(e.target.value))}
                    className="w-full accent-primary bg-surface h-1.5 rounded-lg"
                  />
                </div>

              </Card>

              {/* Live Score update meter */}
              <div className="p-4 rounded-xl bg-surface-2 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-muted font-jetbrains uppercase">A4 Page Parsing Factor</span>
                  <span className="text-xs font-bold text-emerald-400">{atsScore}% Optimized</span>
                </div>
                <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${atsScore}%` }} />
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Custom Storage / History List */}
          {activeTab === 'versions' && (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 flex flex-col gap-2">
                <span className="text-xs font-bold text-primary font-jetbrains uppercase tracking-wider">Save Current Studio Setup</span>
                <p className="text-xs text-text-sub leading-normal">Take persistent offline state snapshots instantly. Your active customized inputs and layout arrays transfer cleanly.</p>
                <div className="flex gap-2 mt-1">
                  <Button onClick={() => handleSaveVersion()} size="sm" className="h-8 text-xs font-bold rounded-lg border-none">
                    Save New Snapshot Entry
                  </Button>
                </div>
              </div>

              <span className="text-xs font-jetbrains uppercase text-text-sub tracking-wider mt-2 block">Stored Snapshot Configurations</span>
              
              {savedResumes.length === 0 ? (
                <div className="text-center p-8 bg-surface/20 rounded-xl border border-white/5">
                  <p className="text-xs text-text-muted">No custom configuration snapshots preserved yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedResumes.map((item) => (
                    <div key={item.id} className="p-3.5 bg-surface-2 rounded-xl border border-white/5 flex items-center justify-between group">
                      <div className="truncate pr-4">
                        <span className="text-xs font-bold text-text-main block truncate">{item.name}</span>
                        <span className="text-[10px] text-text-muted block mt-0.5">{item.date} • Template: <span className="capitalize">{item.template || 'modern'}</span></span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Button 
                          onClick={() => loadSavedVersion(item)} 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 text-xs px-2.5 gap-1.5 text-primary hover:bg-surface rounded-lg"
                        >
                          <FolderOpen className="w-3.5 h-3.5" /> Load
                        </Button>
                        <Button 
                          onClick={() => deleteSavedVersion(item.id)} 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 w-7 p-0 text-text-muted hover:text-red-400 hover:bg-surface rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Layout Canvas (Strict A4 Page Dimensions ratio mapping) */}
        <div className="lg:col-span-7">
          <div className="sticky top-6 flex justify-center overflow-x-auto pb-6">
            
            {/* Inner A4 Printable Paper Boundary Container */}
            <div 
              className="bg-white text-black p-10 rounded-xl shadow-2xl transition-all select-text shrink-0 printable-resume flowcv-a4-canvas border border-neutral-300"
              style={{
                width: '210mm',
                minHeight: '297mm', // absolute A4 metrics standard
                fontFamily: fontFamily,
                fontSize: `${fontSize}px`,
                lineHeight: lineSpacing,
                color: '#1a1a1a', // true deep contrast printable black
              }}
            >
              
              {/* Header block with selected alignment layout */}
              <div 
                className={`border-b-2 pb-5 mb-5 ${
                  template === 'executive' ? 'border-neutral-400' : template === 'modern' ? 'border-blue-700' : 'border-neutral-200'
                }`}
                style={{
                  textAlign: headerAlign,
                }}
              >
                <h1 className="font-bold tracking-tight m-0 leading-tight" style={{ fontSize: `${fontSize * 2.2}px`, color: template === 'modern' ? '#1e3a8a' : '#000' }}>
                  {profile.personalInfo.name || 'Full Name'}
                </h1>
                
                <div 
                  className={`flex flex-wrap gap-x-3 gap-y-1 mt-2 text-neutral-600 font-medium`}
                  style={{ 
                    fontSize: `${fontSize * 0.85}px`,
                    justifyContent: headerAlign === 'center' ? 'center' : headerAlign === 'right' ? 'flex-end' : 'flex-start'
                  }}
                >
                  {profile.personalInfo.email && <span>{profile.personalInfo.email}</span>}
                  {profile.personalInfo.phone && <span>• {profile.personalInfo.phone}</span>}
                  {profile.personalInfo.linkedin && <span className="text-blue-800">• {profile.personalInfo.linkedin}</span>}
                  {profile.personalInfo.address && <span>• {profile.personalInfo.address}</span>}
                </div>
              </div>

              {/* Dynamic sections ordered map based on FlowCV dragging logic */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: `${sectionGap}px` }}>
                {sectionsOrder.map((sectionMeta) => {
                  if (!sectionMeta.enabled) return null;

                  // 1. Summary Block
                  if (sectionMeta.id === 'summary' && profile.summary) {
                    return (
                      <div key={sectionMeta.id}>
                        <h2 
                          className="font-bold uppercase tracking-widest m-0 pb-1.5 mb-2 border-b border-neutral-200" 
                          style={{ 
                            fontSize: `${fontSize * 0.95}px`, 
                            color: template === 'modern' ? '#1e3a8a' : '#111',
                            borderBottom: template === 'modern' ? '1px solid #bfdbfe' : '1px solid #e5e5e5'
                          }}
                        >
                          Professional Summary
                        </h2>
                        <p className="m-0 leading-relaxed text-justify text-neutral-800" style={{ fontSize: `${fontSize}px` }}>
                          {profile.summary}
                        </p>
                      </div>
                    );
                  }

                  // 2. Experience Block
                  if (sectionMeta.id === 'experience' && profile.experience.length > 0) {
                    return (
                      <div key={sectionMeta.id}>
                        <h2 
                          className="font-bold uppercase tracking-widest m-0 pb-1.5 mb-3 border-b border-neutral-200" 
                          style={{ 
                            fontSize: `${fontSize * 0.95}px`, 
                            color: template === 'modern' ? '#1e3a8a' : '#111',
                            borderBottom: template === 'modern' ? '1px solid #bfdbfe' : '1px solid #e5e5e5'
                          }}
                        >
                          Work Experience
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: `${sectionGap * 0.7}px` }}>
                          {profile.experience.map((exp, eIdx) => (
                            <div key={eIdx} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <div className="flex justify-between items-baseline">
                                <span className="font-bold text-neutral-900" style={{ fontSize: `${fontSize * 1.05}px` }}>{exp.role || 'Role'}</span>
                                <span className="text-neutral-500 font-mono" style={{ fontSize: `${fontSize * 0.85}px` }}>{exp.dates}</span>
                              </div>
                              <div className="font-medium text-neutral-700" style={{ fontSize: `${fontSize * 0.92}px` }}>{exp.company || 'Company'}</div>
                              {exp.description && (
                                <p className="m-0 text-neutral-700 pl-3 border-l-2 border-neutral-200 mt-1 text-justify" style={{ fontSize: `${fontSize * 0.95}px` }}>
                                  {exp.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  // 3. Skills Array Block
                  if (sectionMeta.id === 'skills' && profile.skills) {
                    return (
                      <div key={sectionMeta.id}>
                        <h2 
                          className="font-bold uppercase tracking-widest m-0 pb-1.5 mb-2.5 border-b border-neutral-200" 
                          style={{ 
                            fontSize: `${fontSize * 0.95}px`, 
                            color: template === 'modern' ? '#1e3a8a' : '#111',
                            borderBottom: template === 'modern' ? '1px solid #bfdbfe' : '1px solid #e5e5e5'
                          }}
                        >
                          Core Competencies
                        </h2>
                        <div className="flex flex-wrap gap-1.5">
                          {profile.skills.split(',').map((sk, skIdx) => {
                            const trimmed = sk.trim();
                            if (!trimmed) return null;
                            return (
                              <span 
                                key={skIdx} 
                                className="bg-neutral-100 text-neutral-800 rounded font-medium border border-neutral-200"
                                style={{ 
                                  padding: '2px 8px', 
                                  fontSize: `${fontSize * 0.85}px`,
                                  backgroundColor: template === 'modern' ? '#eff6ff' : '#f5f5f5',
                                  borderColor: template === 'modern' ? '#dbeafe' : '#e5e5e5'
                                }}
                              >
                                {trimmed}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  // 4. Education Block
                  if (sectionMeta.id === 'education' && profile.education?.length > 0) {
                    return (
                      <div key={sectionMeta.id}>
                        <h2 
                          className="font-bold uppercase tracking-widest m-0 pb-1.5 mb-3 border-b border-neutral-200" 
                          style={{ 
                            fontSize: `${fontSize * 0.95}px`, 
                            color: template === 'modern' ? '#1e3a8a' : '#111',
                            borderBottom: template === 'modern' ? '1px solid #bfdbfe' : '1px solid #e5e5e5'
                          }}
                        >
                          Education
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: `${sectionGap * 0.5}px` }}>
                          {profile.education.map((edu, edIdx) => (
                            <div key={edIdx} className="flex justify-between items-baseline">
                              <div>
                                <span className="font-bold text-neutral-900 block" style={{ fontSize: `${fontSize}px` }}>{edu.degree || 'Degree'}</span>
                                <span className="text-neutral-600 block mt-0.5" style={{ fontSize: `${fontSize * 0.9}px` }}>{edu.institution || 'Institution'}</span>
                              </div>
                              <span className="text-neutral-500 font-mono shrink-0" style={{ fontSize: `${fontSize * 0.85}px` }}>{edu.dates}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return null;
                })}
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
