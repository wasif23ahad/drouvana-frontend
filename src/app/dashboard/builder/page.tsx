'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Eye, EyeOff, GripVertical, Plus, Trash2, ChevronDown, ChevronUp,
  ArrowUp, ArrowDown, Download, Save, CheckCircle2, Loader2,
  Sparkles, ChevronRight, Sliders, FileText, AlignLeft, AlignCenter,
  AlignRight, Globe, Briefcase, GraduationCap, Code2, Award,
  Users, FolderOpen, Palette, Layers, Languages, Phone,
  Mail, MapPin, Link2, RefreshCw, X, Settings2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';

// ─── Types ─────────────────────────────────────────────────────────────────

type TemplateId = 'modern' | 'classic' | 'executive' | 'sidebar' | 'minimal';
type SectionType =
  | 'personal' | 'summary' | 'experience' | 'education' | 'skills'
  | 'projects' | 'certifications' | 'languages' | 'references' | 'custom';

interface SectionDef {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
}

interface ExpEntry { id: string; role: string; company: string; location: string; dates: string; bullets: string; }
interface EduEntry { id: string; institution: string; degree: string; field: string; dates: string; gpa: string; }
interface SkillGroup { id: string; category: string; items: string; }
interface ProjectEntry { id: string; name: string; description: string; tech: string; url: string; dates: string; }
interface CertEntry { id: string; name: string; issuer: string; date: string; }
interface LangEntry { id: string; language: string; proficiency: string; }
interface RefEntry { id: string; name: string; title: string; company: string; contact: string; }
interface CustomItem { id: string; heading: string; body: string; }

interface ResumeData {
  personal: { name: string; title: string; email: string; phone: string; location: string; linkedin: string; github: string; portfolio: string; x: string; };
  summary: string;
  experience: ExpEntry[];
  education: EduEntry[];
  skills: SkillGroup[];
  projects: ProjectEntry[];
  certifications: CertEntry[];
  languages: LangEntry[];
  references: RefEntry[];
  custom: Record<string, CustomItem[]>;
}

interface AppearanceConfig {
  template: TemplateId;
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  sectionGap: number;
  headerAlign: 'left' | 'center' | 'right';
}

// ─── Constants ──────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9);

const SECTION_ICONS: Record<SectionType, React.ElementType> = {
  personal: Globe, summary: FileText, experience: Briefcase,
  education: GraduationCap, skills: Code2, projects: Layers,
  certifications: Award, languages: Languages, references: Users, custom: Plus,
};

const DEFAULT_SECTIONS: SectionDef[] = [
  { id: 'summary', type: 'summary', title: 'Professional Summary', visible: true },
  { id: 'experience', type: 'experience', title: 'Work Experience', visible: true },
  { id: 'education', type: 'education', title: 'Education', visible: true },
  { id: 'skills', type: 'skills', title: 'Skills', visible: true },
  { id: 'projects', type: 'projects', title: 'Projects', visible: true },
  { id: 'certifications', type: 'certifications', title: 'Certifications', visible: true },
  { id: 'languages', type: 'languages', title: 'Languages', visible: false },
  { id: 'references', type: 'references', title: 'References', visible: false },
];

const TEMPLATES: { id: TemplateId; name: string; desc: string }[] = [
  { id: 'modern', name: 'Modern', desc: 'Clean accent headings, pill skills' },
  { id: 'classic', name: 'Classic', desc: 'Traditional serif, underlined headers' },
  { id: 'executive', name: 'Executive', desc: 'Bold header block, formal layout' },
  { id: 'sidebar', name: 'Sidebar', desc: 'Two-column with dark left panel' },
  { id: 'minimal', name: 'Minimal', desc: 'Ultra-clean, maximum whitespace' },
];

const ACCENT_PRESETS = [
  { hex: '#2563eb', label: 'Blue' }, { hex: '#0f766e', label: 'Teal' },
  { hex: '#7c3aed', label: 'Violet' }, { hex: '#b91c1c', label: 'Red' },
  { hex: '#b45309', label: 'Amber' }, { hex: '#1e40af', label: 'Navy' },
  { hex: '#374151', label: 'Slate' }, { hex: '#166534', label: 'Forest' },
];

const DEFAULT_DATA: ResumeData = {
  personal: { name: '', title: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '', x: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [{ id: uid(), category: 'Technical Skills', items: '' }],
  projects: [],
  certifications: [],
  languages: [],
  references: [],
  custom: {},
};

const DEFAULT_APPEARANCE: AppearanceConfig = {
  template: 'modern', accentColor: '#2563eb', fontFamily: 'sans-serif',
  fontSize: 12, lineHeight: 1.5, sectionGap: 18, headerAlign: 'left',
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function ResumeBuilderPage() {
  const { status } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [activeTab, setActiveTab] = useState<'sections' | 'design' | 'history'>('sections');
  const [expandedSection, setExpandedSection] = useState<string | null>('summary');
  const [zoom, setZoom] = useState(0.75);

  const [sections, setSections] = useState<SectionDef[]>(DEFAULT_SECTIONS);
  const [data, setData] = useState<ResumeData>(DEFAULT_DATA);
  const [appearance, setAppearance] = useState<AppearanceConfig>(DEFAULT_APPEARANCE);
  const [savedVersions, setSavedVersions] = useState<Array<{ id: string; name: string; date: string; sections: SectionDef[]; data: ResumeData; appearance: AppearanceConfig }>>([]);

  // Load from API and localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('drouvana_builder_versions');
      if (stored) setSavedVersions(JSON.parse(stored));
      const storedSections = localStorage.getItem('drouvana_builder_sections');
      if (storedSections) setSections(JSON.parse(storedSections));
      const storedAppearance = localStorage.getItem('drouvana_builder_appearance');
      if (storedAppearance) setAppearance(JSON.parse(storedAppearance));
    } catch (_) {}

    if (status === 'unauthenticated') { setLoading(false); return; }
    if (status !== 'authenticated') return;

    api.get('/api/resume/master').then(res => {
      const p = res.data?.data;
      if (!p) return;
      setData(prev => ({
        ...prev,
        personal: {
          name: p.personalInfo?.name || '',
          title: p.personalInfo?.title || '',
          email: p.personalInfo?.email || '',
          phone: p.personalInfo?.phone || '',
          location: p.personalInfo?.location || p.personalInfo?.address || '',
          linkedin: p.personalInfo?.linkedin || '',
          github: p.personalInfo?.github || '',
          portfolio: p.personalInfo?.portfolio || '',
          x: p.personalInfo?.x || '',
        },
        summary: p.summary || '',
        experience: Array.isArray(p.experience)
          ? p.experience.map((e: any) => ({ id: uid(), role: e.role || '', company: e.company || '', location: '', dates: e.dates || '', bullets: e.description || '' }))
          : [],
        education: Array.isArray(p.education)
          ? p.education.map((e: any) => ({ id: uid(), institution: e.institution || '', degree: e.degree || '', field: e.field || '', dates: e.dates || e.startDate || '', gpa: e.gpa || '' }))
          : [],
        skills: p.skills
          ? [{ id: uid(), category: 'Skills', items: typeof p.skills === 'string' ? p.skills : '' }]
          : prev.skills,
        projects: Array.isArray(p.projects)
          ? p.projects.map((pr: any) => ({ id: uid(), name: pr.name || '', description: pr.description || '', tech: pr.techStack || '', url: pr.url || '', dates: pr.dates || '' }))
          : [],
        certifications: Array.isArray(p.certifications)
          ? p.certifications.map((c: any) => ({ id: uid(), name: c.name || '', issuer: c.issuer || '', date: c.date || '' }))
          : [],
      }));
    }).catch(() => {}).finally(() => setLoading(false));
  }, [status]);

  // ── Section management ──────────────────────────────────────────────────

  const toggleVisible = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
  };

  const moveSection = (id: string, dir: -1 | 1) => {
    setSections(prev => {
      const idx = prev.findIndex(s => s.id === id);
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  };

  const renameSectionTitle = (id: string, title: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, title } : s));
  };

  const addCustomSection = () => {
    const id = `custom_${uid()}`;
    setSections(prev => [...prev, { id, type: 'custom', title: 'Custom Section', visible: true }]);
    setData(prev => ({ ...prev, custom: { ...prev.custom, [id]: [{ id: uid(), heading: '', body: '' }] } }));
    setExpandedSection(id);
    toast.success('Custom section added');
  };

  const deleteSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
    if (id.startsWith('custom_')) {
      setData(prev => { const c = { ...prev.custom }; delete c[id]; return { ...prev, custom: c }; });
    }
    if (expandedSection === id) setExpandedSection(null);
  };

  // ── Data helpers ────────────────────────────────────────────────────────

  const updExp = (idx: number, field: keyof ExpEntry, val: string) =>
    setData(p => { const a = [...p.experience]; a[idx] = { ...a[idx], [field]: val }; return { ...p, experience: a }; });
  const addExp = () => setData(p => ({ ...p, experience: [...p.experience, { id: uid(), role: '', company: '', location: '', dates: '', bullets: '' }] }));
  const delExp = (idx: number) => setData(p => ({ ...p, experience: p.experience.filter((_, i) => i !== idx) }));

  const updEdu = (idx: number, field: keyof EduEntry, val: string) =>
    setData(p => { const a = [...p.education]; a[idx] = { ...a[idx], [field]: val }; return { ...p, education: a }; });
  const addEdu = () => setData(p => ({ ...p, education: [...p.education, { id: uid(), institution: '', degree: '', field: '', dates: '', gpa: '' }] }));
  const delEdu = (idx: number) => setData(p => ({ ...p, education: p.education.filter((_, i) => i !== idx) }));

  const updSkill = (idx: number, field: keyof SkillGroup, val: string) =>
    setData(p => { const a = [...p.skills]; a[idx] = { ...a[idx], [field]: val }; return { ...p, skills: a }; });
  const addSkillGroup = () => setData(p => ({ ...p, skills: [...p.skills, { id: uid(), category: '', items: '' }] }));
  const delSkillGroup = (idx: number) => setData(p => ({ ...p, skills: p.skills.filter((_, i) => i !== idx) }));

  const updProj = (idx: number, field: keyof ProjectEntry, val: string) =>
    setData(p => { const a = [...p.projects]; a[idx] = { ...a[idx], [field]: val }; return { ...p, projects: a }; });
  const addProj = () => setData(p => ({ ...p, projects: [...p.projects, { id: uid(), name: '', description: '', tech: '', url: '', dates: '' }] }));
  const delProj = (idx: number) => setData(p => ({ ...p, projects: p.projects.filter((_, i) => i !== idx) }));

  const updCert = (idx: number, field: keyof CertEntry, val: string) =>
    setData(p => { const a = [...p.certifications]; a[idx] = { ...a[idx], [field]: val }; return { ...p, certifications: a }; });
  const addCert = () => setData(p => ({ ...p, certifications: [...p.certifications, { id: uid(), name: '', issuer: '', date: '' }] }));
  const delCert = (idx: number) => setData(p => ({ ...p, certifications: p.certifications.filter((_, i) => i !== idx) }));

  const updLang = (idx: number, field: keyof LangEntry, val: string) =>
    setData(p => { const a = [...p.languages]; a[idx] = { ...a[idx], [field]: val }; return { ...p, languages: a }; });
  const addLang = () => setData(p => ({ ...p, languages: [...p.languages, { id: uid(), language: '', proficiency: 'Professional' }] }));
  const delLang = (idx: number) => setData(p => ({ ...p, languages: p.languages.filter((_, i) => i !== idx) }));

  const updRef = (idx: number, field: keyof RefEntry, val: string) =>
    setData(p => { const a = [...p.references]; a[idx] = { ...a[idx], [field]: val }; return { ...p, references: a }; });
  const addRef = () => setData(p => ({ ...p, references: [...p.references, { id: uid(), name: '', title: '', company: '', contact: '' }] }));
  const delRef = (idx: number) => setData(p => ({ ...p, references: p.references.filter((_, i) => i !== idx) }));

  const updCustomItem = (secId: string, idx: number, field: keyof CustomItem, val: string) =>
    setData(p => {
      const items = [...(p.custom[secId] || [])];
      items[idx] = { ...items[idx], [field]: val };
      return { ...p, custom: { ...p.custom, [secId]: items } };
    });
  const addCustomItem = (secId: string) =>
    setData(p => ({ ...p, custom: { ...p.custom, [secId]: [...(p.custom[secId] || []), { id: uid(), heading: '', body: '' }] } }));
  const delCustomItem = (secId: string, idx: number) =>
    setData(p => ({ ...p, custom: { ...p.custom, [secId]: (p.custom[secId] || []).filter((_, i) => i !== idx) } }));

  // ── Save / load ─────────────────────────────────────────────────────────

  const saveVersion = (name?: string) => {
    const entry = { id: uid(), name: name || `Version — ${new Date().toLocaleDateString('en-US')}`, date: new Date().toLocaleString('en-US'), sections, data, appearance };
    const updated = [entry, ...savedVersions].slice(0, 20);
    setSavedVersions(updated);
    localStorage.setItem('drouvana_builder_versions', JSON.stringify(updated));
    localStorage.setItem('drouvana_builder_sections', JSON.stringify(sections));
    localStorage.setItem('drouvana_builder_appearance', JSON.stringify(appearance));
    toast.success(`Saved "${entry.name}"`);
  };

  const loadVersion = (v: typeof savedVersions[0]) => {
    setSections(v.sections); setData(v.data); setAppearance(v.appearance);
    toast.success(`Loaded "${v.name}"`);
  };

  const deleteVersion = (id: string) => {
    const updated = savedVersions.filter(v => v.id !== id);
    setSavedVersions(updated);
    localStorage.setItem('drouvana_builder_versions', JSON.stringify(updated));
  };

  const syncToCloud = async () => {
    setSaving(true);
    try {
      await api.put('/api/resume/master', {
        data: {
          personalInfo: { ...data.personal },
          summary: data.summary,
          experience: data.experience.map(e => ({ company: e.company, role: e.role, dates: e.dates, description: e.bullets })),
          education: data.education.map(e => ({ institution: e.institution, degree: e.degree, field: e.field, dates: e.dates, gpa: e.gpa })),
          skills: data.skills.map(g => g.items).join(', '),
          projects: data.projects.map(p => ({ name: p.name, description: p.description, techStack: p.tech, url: p.url, dates: p.dates })),
          certifications: data.certifications.map(c => ({ name: c.name, issuer: c.issuer, date: c.date })),
        }
      });
      setSaved(true);
      toast.success('Synced to cloud');
      setTimeout(() => setSaved(false), 3000);
    } catch { toast.error('Sync failed'); }
    finally { setSaving(false); }
  };

  // ── Content editors ─────────────────────────────────────────────────────

  const renderEditor = (sec: SectionDef) => {
    const { id, type } = sec;
    switch (type) {
      case 'personal':
        return (
          <div className="grid grid-cols-2 gap-3 pt-3">
            {([['name', 'Full Name'], ['title', 'Professional Title'], ['email', 'Email'], ['phone', 'Phone'], ['location', 'Location'], ['linkedin', 'LinkedIn'], ['github', 'GitHub'], ['portfolio', 'Portfolio'], ['x', 'X / Twitter']] as [keyof ResumeData['personal'], string][]).map(([f, label]) => (
              <div key={f} className={f === 'name' || f === 'title' ? 'col-span-2' : ''}>
                <Label className="text-[10px] text-text-muted uppercase tracking-wider font-jetbrains mb-1 block">{label}</Label>
                <Input value={data.personal[f]} onChange={e => setData(p => ({ ...p, personal: { ...p.personal, [f]: e.target.value } }))} className="h-8 text-xs bg-surface border-white/10 rounded-lg" />
              </div>
            ))}
          </div>
        );
      case 'summary':
        return (
          <div className="pt-3">
            <textarea value={data.summary} onChange={e => setData(p => ({ ...p, summary: e.target.value }))} rows={4} placeholder="A compelling professional summary..." className="w-full bg-surface border border-white/10 rounded-xl p-3 text-xs text-text-sub focus:outline-none focus:border-primary/50 resize-none" />
          </div>
        );
      case 'experience':
        return (
          <div className="pt-3 space-y-3">
            {data.experience.map((exp, idx) => (
              <div key={exp.id} className="p-3 bg-surface rounded-xl border border-white/5 space-y-2 relative group">
                <Button variant="ghost" size="icon" type="button" onClick={() => delExp(idx)} className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-error rounded-full transition-opacity"><Trash2 className="w-3 h-3" /></Button>
                <div className="grid grid-cols-2 gap-2 pr-6">
                  <Input placeholder="Job Title" value={exp.role} onChange={e => updExp(idx, 'role', e.target.value)} className="h-8 text-xs bg-surface-2 border-white/5 rounded-lg" />
                  <Input placeholder="Company" value={exp.company} onChange={e => updExp(idx, 'company', e.target.value)} className="h-8 text-xs bg-surface-2 border-white/5 rounded-lg" />
                  <Input placeholder="Location" value={exp.location} onChange={e => updExp(idx, 'location', e.target.value)} className="h-8 text-xs bg-surface-2 border-white/5 rounded-lg" />
                  <Input placeholder="Dates (MM/YYYY – Present)" value={exp.dates} onChange={e => updExp(idx, 'dates', e.target.value)} className="h-8 text-xs bg-surface-2 border-white/5 rounded-lg" />
                </div>
                <textarea value={exp.bullets} onChange={e => updExp(idx, 'bullets', e.target.value)} rows={3} placeholder="• Led team of 5 engineers...&#10;• Reduced latency by 40%..." className="w-full bg-surface-2 border border-white/5 rounded-lg p-2 text-xs text-text-sub focus:outline-none focus:border-primary/50 resize-none" />
              </div>
            ))}
            <Button onClick={addExp} size="sm" variant="ghost" className="w-full h-8 text-xs border border-dashed border-white/10 rounded-xl text-text-muted hover:border-primary/40 hover:text-primary gap-1.5"><Plus className="w-3 h-3" /> Add Experience</Button>
          </div>
        );
      case 'education':
        return (
          <div className="pt-3 space-y-3">
            {data.education.map((edu, idx) => (
              <div key={edu.id} className="p-3 bg-surface rounded-xl border border-white/5 space-y-2 relative group">
                <Button variant="ghost" size="icon" type="button" onClick={() => delEdu(idx)} className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-error rounded-full transition-opacity"><Trash2 className="w-3 h-3" /></Button>
                <Input placeholder="Institution" value={edu.institution} onChange={e => updEdu(idx, 'institution', e.target.value)} className="h-8 text-xs bg-surface-2 border-white/5 rounded-lg" />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Degree (e.g. B.S.)" value={edu.degree} onChange={e => updEdu(idx, 'degree', e.target.value)} className="h-8 text-xs bg-surface-2 border-white/5 rounded-lg" />
                  <Input placeholder="Field of Study" value={edu.field} onChange={e => updEdu(idx, 'field', e.target.value)} className="h-8 text-xs bg-surface-2 border-white/5 rounded-lg" />
                  <Input placeholder="Dates" value={edu.dates} onChange={e => updEdu(idx, 'dates', e.target.value)} className="h-8 text-xs bg-surface-2 border-white/5 rounded-lg" />
                  <Input placeholder="GPA (optional)" value={edu.gpa} onChange={e => updEdu(idx, 'gpa', e.target.value)} className="h-8 text-xs bg-surface-2 border-white/5 rounded-lg" />
                </div>
              </div>
            ))}
            <Button onClick={addEdu} size="sm" variant="ghost" className="w-full h-8 text-xs border border-dashed border-white/10 rounded-xl text-text-muted hover:border-primary/40 hover:text-primary gap-1.5"><Plus className="w-3 h-3" /> Add Education</Button>
          </div>
        );
      case 'skills':
        return (
          <div className="pt-3 space-y-2">
            {data.skills.map((grp, idx) => (
              <div key={grp.id} className="p-3 bg-surface rounded-xl border border-white/5 space-y-2 relative group">
                <Button variant="ghost" size="icon" type="button" onClick={() => delSkillGroup(idx)} className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-error rounded-full transition-opacity"><Trash2 className="w-3 h-3" /></Button>
                <Input placeholder="Category (e.g. Languages, Frameworks)" value={grp.category} onChange={e => updSkill(idx, 'category', e.target.value)} className="h-8 text-xs bg-surface-2 border-white/5 rounded-lg pr-8" />
                <Input placeholder="React, Node.js, TypeScript, PostgreSQL..." value={grp.items} onChange={e => updSkill(idx, 'items', e.target.value)} className="h-8 text-xs bg-surface-2 border-white/5 rounded-lg" />
              </div>
            ))}
            <Button onClick={addSkillGroup} size="sm" variant="ghost" className="w-full h-8 text-xs border border-dashed border-white/10 rounded-xl text-text-muted hover:border-primary/40 hover:text-primary gap-1.5"><Plus className="w-3 h-3" /> Add Skill Group</Button>
          </div>
        );
      case 'projects':
        return (
          <div className="pt-3 space-y-3">
            {data.projects.map((proj, idx) => (
              <div key={proj.id} className="p-3 bg-surface rounded-xl border border-white/5 space-y-2 relative group">
                <Button variant="ghost" size="icon" type="button" onClick={() => delProj(idx)} className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-error rounded-full transition-opacity"><Trash2 className="w-3 h-3" /></Button>
                <div className="grid grid-cols-2 gap-2 pr-6">
                  <Input placeholder="Project Name" value={proj.name} onChange={e => updProj(idx, 'name', e.target.value)} className="h-8 text-xs bg-surface-2 border-white/5 rounded-lg" />
                  <Input placeholder="Dates" value={proj.dates} onChange={e => updProj(idx, 'dates', e.target.value)} className="h-8 text-xs bg-surface-2 border-white/5 rounded-lg" />
                </div>
                <Input placeholder="Tech stack (React, Node.js, Docker...)" value={proj.tech} onChange={e => updProj(idx, 'tech', e.target.value)} className="h-8 text-xs bg-surface-2 border-white/5 rounded-lg" />
                <Input placeholder="URL (optional)" value={proj.url} onChange={e => updProj(idx, 'url', e.target.value)} className="h-8 text-xs bg-surface-2 border-white/5 rounded-lg" />
                <textarea value={proj.description} onChange={e => updProj(idx, 'description', e.target.value)} rows={2} placeholder="• What you built and the impact..." className="w-full bg-surface-2 border border-white/5 rounded-lg p-2 text-xs text-text-sub focus:outline-none focus:border-primary/50 resize-none" />
              </div>
            ))}
            <Button onClick={addProj} size="sm" variant="ghost" className="w-full h-8 text-xs border border-dashed border-white/10 rounded-xl text-text-muted hover:border-primary/40 hover:text-primary gap-1.5"><Plus className="w-3 h-3" /> Add Project</Button>
          </div>
        );
      case 'certifications':
        return (
          <div className="pt-3 space-y-2">
            {data.certifications.map((c, idx) => (
              <div key={c.id} className="p-3 bg-surface rounded-xl border border-white/5 space-y-2 relative group">
                <Button variant="ghost" size="icon" type="button" onClick={() => delCert(idx)} className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-error rounded-full transition-opacity"><Trash2 className="w-3 h-3" /></Button>
                <Input placeholder="Certification Name" value={c.name} onChange={e => updCert(idx, 'name', e.target.value)} className="h-8 text-xs bg-surface-2 border-white/5 rounded-lg pr-8" />
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Issuer" value={c.issuer} onChange={e => updCert(idx, 'issuer', e.target.value)} className="h-8 text-xs bg-surface-2 border-white/5 rounded-lg" />
                  <Input placeholder="Date (MM/YYYY)" value={c.date} onChange={e => updCert(idx, 'date', e.target.value)} className="h-8 text-xs bg-surface-2 border-white/5 rounded-lg" />
                </div>
              </div>
            ))}
            <Button onClick={addCert} size="sm" variant="ghost" className="w-full h-8 text-xs border border-dashed border-white/10 rounded-xl text-text-muted hover:border-primary/40 hover:text-primary gap-1.5"><Plus className="w-3 h-3" /> Add Certification</Button>
          </div>
        );
      case 'languages':
        return (
          <div className="pt-3 space-y-2">
            {data.languages.map((l, idx) => (
              <div key={l.id} className="flex gap-2 items-center relative group">
                <Input placeholder="Language" value={l.language} onChange={e => updLang(idx, 'language', e.target.value)} className="h-8 text-xs bg-surface border-white/10 rounded-lg flex-1" />
                <select value={l.proficiency} onChange={e => updLang(idx, 'proficiency', e.target.value)} className="h-8 text-xs bg-surface border border-white/10 rounded-lg px-2 text-text-sub focus:outline-none">
                  {['Native', 'Fluent', 'Professional', 'Conversational', 'Basic'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <Button variant="ghost" size="icon" onClick={() => delLang(idx)} className="h-7 w-7 p-0 text-error opacity-0 group-hover:opacity-100 rounded-full transition-opacity"><Trash2 className="w-3 h-3" /></Button>
              </div>
            ))}
            <Button onClick={addLang} size="sm" variant="ghost" className="w-full h-8 text-xs border border-dashed border-white/10 rounded-xl text-text-muted hover:border-primary/40 hover:text-primary gap-1.5"><Plus className="w-3 h-3" /> Add Language</Button>
          </div>
        );
      case 'references':
        return (
          <div className="pt-3 space-y-2">
            {data.references.map((r, idx) => (
              <div key={r.id} className="p-3 bg-surface rounded-xl border border-white/5 space-y-2 relative group">
                <Button variant="ghost" size="icon" type="button" onClick={() => delRef(idx)} className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-error rounded-full transition-opacity"><Trash2 className="w-3 h-3" /></Button>
                <div className="grid grid-cols-2 gap-2 pr-6">
                  <Input placeholder="Full Name" value={r.name} onChange={e => updRef(idx, 'name', e.target.value)} className="h-8 text-xs bg-surface-2 border-white/5 rounded-lg" />
                  <Input placeholder="Job Title" value={r.title} onChange={e => updRef(idx, 'title', e.target.value)} className="h-8 text-xs bg-surface-2 border-white/5 rounded-lg" />
                  <Input placeholder="Company" value={r.company} onChange={e => updRef(idx, 'company', e.target.value)} className="h-8 text-xs bg-surface-2 border-white/5 rounded-lg" />
                  <Input placeholder="Email / Phone" value={r.contact} onChange={e => updRef(idx, 'contact', e.target.value)} className="h-8 text-xs bg-surface-2 border-white/5 rounded-lg" />
                </div>
              </div>
            ))}
            <Button onClick={addRef} size="sm" variant="ghost" className="w-full h-8 text-xs border border-dashed border-white/10 rounded-xl text-text-muted hover:border-primary/40 hover:text-primary gap-1.5"><Plus className="w-3 h-3" /> Add Reference</Button>
          </div>
        );
      case 'custom': {
        const items = data.custom[id] || [];
        return (
          <div className="pt-3 space-y-2">
            {items.map((item, idx) => (
              <div key={item.id} className="p-3 bg-surface rounded-xl border border-white/5 space-y-2 relative group">
                <Button variant="ghost" size="icon" type="button" onClick={() => delCustomItem(id, idx)} className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-error rounded-full transition-opacity"><Trash2 className="w-3 h-3" /></Button>
                <Input placeholder="Heading (optional)" value={item.heading} onChange={e => updCustomItem(id, idx, 'heading', e.target.value)} className="h-8 text-xs bg-surface-2 border-white/5 rounded-lg pr-8" />
                <textarea value={item.body} onChange={e => updCustomItem(id, idx, 'body', e.target.value)} rows={2} placeholder="Content..." className="w-full bg-surface-2 border border-white/5 rounded-lg p-2 text-xs text-text-sub focus:outline-none focus:border-primary/50 resize-none" />
              </div>
            ))}
            <Button onClick={() => addCustomItem(id)} size="sm" variant="ghost" className="w-full h-8 text-xs border border-dashed border-white/10 rounded-xl text-text-muted hover:border-primary/40 hover:text-primary gap-1.5"><Plus className="w-3 h-3" /> Add Item</Button>
          </div>
        );
      }
      default: return null;
    }
  };

  if (loading) return (
    <div className="flex h-[50vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  const { template, accentColor, fontFamily, fontSize, lineHeight, sectionGap, headerAlign } = appearance;
  const visibleSections = sections.filter(s => s.visible);

  return (
    <div className="flex flex-col h-full gap-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center text-xs text-text-muted gap-2 font-jetbrains uppercase tracking-widest mb-2">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Workspace</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary font-bold">Resume Builder</span>
          </div>
          <h1 className="text-3xl font-bold font-hanken">Resume Builder</h1>
          <p className="text-text-sub text-sm">Build, style, and export professional resumes. 5 templates, custom sections, full control.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={() => saveVersion()} variant="outline" className="rounded-xl gap-1.5 border-white/10 h-9 text-xs">
            <Save className="h-3.5 w-3.5" /> Save Version
          </Button>
          <Button onClick={() => { toast.info('Opening print dialog...'); window.print(); }} variant="outline" className="rounded-xl gap-1.5 border-white/10 h-9 text-xs">
            <Download className="h-3.5 w-3.5" /> Export PDF
          </Button>
          <Button onClick={syncToCloud} disabled={saving} className="rounded-xl gap-1.5 border-none shadow-lg shadow-primary/20 h-9 text-xs">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : saved ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
            {saving ? 'Saving...' : saved ? 'Synced' : 'Sync to Cloud'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Left Panel ─────────────────────────────────────────────── */}
        <div className="lg:col-span-4 flex flex-col gap-4">

          {/* Tab bar */}
          <div className="flex bg-surface-2 p-1 rounded-2xl border border-white/5 gap-1">
            {[
              { id: 'sections', icon: Layers, label: 'Sections' },
              { id: 'design', icon: Palette, label: 'Design' },
              { id: 'history', icon: FolderOpen, label: `Saved (${savedVersions.length})` },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-2 rounded-xl font-bold text-[11px] uppercase tracking-wide transition-all flex items-center justify-center gap-1.5 ${activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-text-sub hover:text-text-main'}`}>
                  <Icon className="w-3.5 h-3.5" /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB: Sections */}
          {activeTab === 'sections' && (
            <div className="flex flex-col gap-3">
              <div className="space-y-1.5">
                {sections.map((sec, idx) => {
                  const Icon = SECTION_ICONS[sec.type];
                  const isExpanded = expandedSection === sec.id;
                  const isCustom = sec.id.startsWith('custom_');
                  return (
                    <div key={sec.id} className={`rounded-xl border transition-all ${isExpanded ? 'border-primary/30 bg-surface/70' : 'border-white/5 bg-surface/40'}`}>
                      {/* Section row */}
                      <div className="flex items-center gap-2 px-3 py-2">
                        <GripVertical className="w-3.5 h-3.5 text-text-muted shrink-0 cursor-grab" />
                        <Icon className="w-3.5 h-3.5 text-text-muted shrink-0" />
                        <input
                          type="text"
                          value={sec.title}
                          onChange={e => renameSectionTitle(sec.id, e.target.value)}
                          className={`flex-1 text-xs font-bold bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary/50 rounded px-1 min-w-0 ${!sec.visible ? 'text-text-muted opacity-50' : 'text-text-main'}`}
                        />
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button onClick={() => toggleVisible(sec.id)} className={`p-1 rounded-lg transition-colors ${sec.visible ? 'text-primary hover:bg-primary/10' : 'text-text-muted hover:bg-surface-2'}`} title={sec.visible ? 'Hide section' : 'Show section'}>
                            {sec.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                          <button onClick={() => moveSection(sec.id, -1)} disabled={idx === 0} className="p-1 rounded-lg text-text-muted hover:bg-surface-2 disabled:opacity-30 transition-colors">
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => moveSection(sec.id, 1)} disabled={idx === sections.length - 1} className="p-1 rounded-lg text-text-muted hover:bg-surface-2 disabled:opacity-30 transition-colors">
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setExpandedSection(isExpanded ? null : sec.id)} className="p-1 rounded-lg text-text-muted hover:bg-surface-2 transition-colors">
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                          {isCustom && (
                            <button onClick={() => deleteSection(sec.id)} className="p-1 rounded-lg text-error hover:bg-error/10 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      {/* Expanded editor */}
                      {isExpanded && (
                        <div className="px-3 pb-3 border-t border-white/5">
                          {renderEditor(sec)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <Button onClick={addCustomSection} variant="ghost" className="w-full h-9 text-xs border border-dashed border-white/10 rounded-xl text-text-muted hover:border-primary/40 hover:text-primary gap-2">
                <Plus className="w-3.5 h-3.5" /> Add Custom Section
              </Button>

              <div className="text-[10px] text-text-muted font-jetbrains text-center">
                <EyeOff className="w-3 h-3 inline mr-1" /> Hidden sections are preserved — click the eye icon to restore
              </div>
            </div>
          )}

          {/* TAB: Design */}
          {activeTab === 'design' && (
            <div className="flex flex-col gap-4">

              {/* Template picker */}
              <Card className="bg-surface/50 border-white/5 rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-jetbrains uppercase text-primary tracking-wider">Template</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-2">
                  {TEMPLATES.map(t => (
                    <button key={t.id} onClick={() => setAppearance(a => ({ ...a, template: t.id }))}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${template === t.id ? 'border-primary bg-primary/10' : 'border-white/5 bg-surface hover:border-white/20'}`}>
                      {/* Mini template thumbnail */}
                      <div className="w-10 h-12 rounded border border-white/10 overflow-hidden shrink-0 bg-white relative">
                        <TemplateThumbnail id={t.id} color={accentColor} />
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${template === t.id ? 'text-primary' : 'text-text-main'}`}>{t.name}</p>
                        <p className="text-[10px] text-text-muted mt-0.5">{t.desc}</p>
                      </div>
                      {template === t.id && <CheckCircle2 className="w-4 h-4 text-primary ml-auto shrink-0" />}
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Accent color */}
              <Card className="bg-surface/50 border-white/5 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-jetbrains uppercase text-primary tracking-wider font-bold">Accent Color</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-text-muted font-mono">{accentColor}</span>
                    <input type="color" value={accentColor} onChange={e => setAppearance(a => ({ ...a, accentColor: e.target.value }))} className="w-6 h-6 rounded border-none cursor-pointer p-0 bg-transparent" />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {ACCENT_PRESETS.map(c => (
                    <button key={c.hex} onClick={() => setAppearance(a => ({ ...a, accentColor: c.hex }))}
                      className={`h-8 rounded-lg text-[10px] font-bold transition-all border flex items-center justify-center gap-1 ${accentColor === c.hex ? 'border-white scale-105' : 'border-white/10 hover:border-white/30'}`}
                      style={{ backgroundColor: `${c.hex}25` }}>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.hex }} />
                      <span className="text-text-muted">{c.label}</span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Typography & spacing */}
              <Card className="bg-surface/50 border-white/5 rounded-2xl p-4 space-y-4">
                <span className="text-xs font-jetbrains uppercase text-primary tracking-wider font-bold block">Typography & Spacing</span>

                <div>
                  <Label className="text-[10px] text-text-muted uppercase tracking-wider mb-2 block">Font Family</Label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[['sans-serif', 'Sans-serif'], ['Georgia, serif', 'Serif'], ['"Courier New", monospace', 'Mono'], ['"Arial", sans-serif', 'Arial']].map(([val, label]) => (
                      <button key={val} onClick={() => setAppearance(a => ({ ...a, fontFamily: val }))}
                        className={`py-1.5 rounded-lg text-[11px] border transition-all ${fontFamily === val ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-white/5 bg-surface text-text-muted hover:border-white/20'}`}
                        style={{ fontFamily: val }}>{label}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-text-sub">Font Size</span>
                    <span className="text-xs font-mono font-bold text-primary">{fontSize}px</span>
                  </div>
                  <input type="range" min={10} max={16} step={0.5} value={fontSize} onChange={e => setAppearance(a => ({ ...a, fontSize: parseFloat(e.target.value) }))} className="w-full accent-primary h-1.5 rounded-lg" />
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-text-sub">Line Height</span>
                    <span className="text-xs font-mono font-bold text-primary">{lineHeight}x</span>
                  </div>
                  <input type="range" min={1.1} max={2.0} step={0.1} value={lineHeight} onChange={e => setAppearance(a => ({ ...a, lineHeight: parseFloat(e.target.value) }))} className="w-full accent-primary h-1.5 rounded-lg" />
                </div>

                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-text-sub">Section Gap</span>
                    <span className="text-xs font-mono font-bold text-primary">{sectionGap}px</span>
                  </div>
                  <input type="range" min={10} max={36} step={1} value={sectionGap} onChange={e => setAppearance(a => ({ ...a, sectionGap: parseInt(e.target.value) }))} className="w-full accent-primary h-1.5 rounded-lg" />
                </div>

                <div>
                  <Label className="text-[10px] text-text-muted uppercase tracking-wider mb-2 block">Header Alignment</Label>
                  <div className="flex bg-surface p-1 rounded-xl border border-white/5">
                    {[['left', AlignLeft], ['center', AlignCenter], ['right', AlignRight]].map(([val, Icon]) => {
                      const I = Icon as React.ElementType;
                      return (
                        <button key={val as string} onClick={() => setAppearance(a => ({ ...a, headerAlign: val as any }))}
                          className={`flex-1 py-1.5 rounded-lg text-xs transition-all flex items-center justify-center ${headerAlign === val ? 'bg-surface-2 text-primary shadow-sm' : 'text-text-muted hover:text-text-sub'}`}>
                          <I className="w-3.5 h-3.5" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB: Saved versions */}
          {activeTab === 'history' && (
            <div className="flex flex-col gap-3">
              <Button onClick={() => saveVersion()} className="w-full h-10 rounded-xl gap-2 text-xs font-bold border-none shadow-lg shadow-primary/20">
                <Save className="w-3.5 h-3.5" /> Save Current Version
              </Button>

              {savedVersions.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
                  <p className="text-xs text-text-muted">No saved versions yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedVersions.map(v => (
                    <div key={v.id} className="p-3 bg-surface-2 rounded-xl border border-white/5 flex items-center justify-between group">
                      <div className="min-w-0 mr-3">
                        <p className="text-xs font-bold text-text-main truncate">{v.name}</p>
                        <p className="text-[10px] text-text-muted">{v.date} · <span className="capitalize">{v.appearance.template}</span></p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button onClick={() => loadVersion(v)} size="sm" variant="ghost" className="h-7 px-2 text-xs text-primary rounded-lg gap-1"><FolderOpen className="w-3 h-3" /> Load</Button>
                        <Button onClick={() => deleteVersion(v.id)} size="sm" variant="ghost" className="h-7 w-7 p-0 text-error rounded-lg"><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right Panel: A4 Preview ─────────────────────────────────── */}
        <div className="lg:col-span-8 flex flex-col gap-3">

          {/* Zoom controls */}
          <div className="flex items-center justify-between bg-surface-2 px-4 py-2 rounded-xl border border-white/5">
            <span className="text-xs text-text-sub font-medium flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-primary" /> Preview Zoom
            </span>
            <div className="flex items-center gap-1.5">
              {[0.5, 0.65, 0.75, 0.9, 1.0].map(z => (
                <button key={z} onClick={() => setZoom(z)} className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${zoom === z ? 'bg-primary text-white font-bold' : 'text-text-muted hover:bg-surface'}`}>{Math.round(z * 100)}%</button>
              ))}
            </div>
          </div>

          {/* A4 Canvas */}
          <div className="overflow-x-auto overflow-y-auto pb-8 flex justify-center" style={{ minHeight: '600px' }}>
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', marginBottom: zoom < 1 ? `${(zoom - 1) * 297 * 3.78}px` : '0' }}>
              <ResumeCanvas
                data={data}
                sections={visibleSections}
                appearance={appearance}
                allSections={sections}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Template Thumbnail ─────────────────────────────────────────────────────

function TemplateThumbnail({ id, color }: { id: TemplateId; color: string }) {
  if (id === 'modern') return (
    <div className="w-full h-full p-1">
      <div className="h-2 rounded-sm mb-1" style={{ backgroundColor: color, opacity: 0.9 }} />
      <div className="space-y-0.5">
        {[1, 0.7, 0.5, 0.7, 0.5, 0.5].map((w, i) => <div key={i} className="h-0.5 rounded-full bg-gray-300" style={{ width: `${w * 100}%` }} />)}
      </div>
      <div className="h-px mt-1 mb-1" style={{ backgroundColor: color, opacity: 0.5 }} />
      <div className="space-y-0.5">
        {[0.8, 0.6, 0.6].map((w, i) => <div key={i} className="h-0.5 rounded-full bg-gray-300" style={{ width: `${w * 100}%` }} />)}
      </div>
    </div>
  );
  if (id === 'classic') return (
    <div className="w-full h-full p-1">
      <div className="text-center mb-1">
        <div className="h-1.5 rounded-sm bg-gray-800 mx-auto mb-0.5" style={{ width: '70%' }} />
        <div className="h-0.5 rounded-sm bg-gray-400 mx-auto" style={{ width: '50%' }} />
      </div>
      <div className="border-b border-gray-700 pb-0.5 mb-1">
        <div className="h-0.5 bg-gray-700 rounded" style={{ width: '40%' }} />
      </div>
      <div className="space-y-0.5">
        {[0.9, 0.7, 0.6].map((w, i) => <div key={i} className="h-0.5 rounded-full bg-gray-300" style={{ width: `${w * 100}%` }} />)}
      </div>
    </div>
  );
  if (id === 'executive') return (
    <div className="w-full h-full">
      <div className="h-4 w-full mb-1 flex items-center px-1.5" style={{ backgroundColor: color }}>
        <div className="h-1 rounded-sm bg-white opacity-90" style={{ width: '60%' }} />
      </div>
      <div className="px-1 space-y-0.5">
        <div className="flex items-center gap-0.5 mb-0.5">
          <div className="h-3 w-0.5 rounded-full" style={{ backgroundColor: color }} />
          <div className="h-0.5 rounded-full bg-gray-700" style={{ width: '40%' }} />
        </div>
        {[0.8, 0.6, 0.7].map((w, i) => <div key={i} className="h-0.5 rounded-full bg-gray-300" style={{ width: `${w * 100}%` }} />)}
      </div>
    </div>
  );
  if (id === 'sidebar') return (
    <div className="w-full h-full flex">
      <div className="w-2/5 h-full p-0.5 flex flex-col gap-0.5" style={{ backgroundColor: `${color}20` }}>
        <div className="h-0.5 rounded bg-gray-600" style={{ width: '80%' }} />
        <div className="h-0.5 rounded bg-gray-400" style={{ width: '60%' }} />
        <div className="h-0.5 rounded bg-gray-400" style={{ width: '70%' }} />
        <div className="h-0.5 rounded bg-gray-400" style={{ width: '50%' }} />
      </div>
      <div className="flex-1 p-0.5 space-y-0.5">
        {[0.9, 0.7, 0.8, 0.6].map((w, i) => <div key={i} className="h-0.5 rounded-full bg-gray-300" style={{ width: `${w * 100}%` }} />)}
      </div>
    </div>
  );
  // minimal
  return (
    <div className="w-full h-full p-1.5">
      <div className="h-1 rounded-sm bg-gray-800 mb-1.5" style={{ width: '55%' }} />
      <div className="space-y-0.5 mb-1.5">
        {[0.5, 0.4].map((w, i) => <div key={i} className="h-0.5 rounded-full bg-gray-300" style={{ width: `${w * 100}%` }} />)}
      </div>
      <div className="h-px bg-gray-200 mb-1" />
      <div className="space-y-0.5">
        {[0.8, 0.6, 0.7].map((w, i) => <div key={i} className="h-0.5 rounded-full bg-gray-200" style={{ width: `${w * 100}%` }} />)}
      </div>
    </div>
  );
}

// ─── Resume Canvas ───────────────────────────────────────────────────────────

interface CanvasProps {
  data: ResumeData;
  sections: SectionDef[];      // only visible ones
  allSections: SectionDef[];   // all (for sidebar column logic)
  appearance: AppearanceConfig;
}

function ResumeCanvas({ data, sections, appearance }: CanvasProps) {
  const { template } = appearance;
  if (template === 'sidebar') return <SidebarTemplate data={data} sections={sections} appearance={appearance} />;
  return <SingleColumnTemplate data={data} sections={sections} appearance={appearance} />;
}

// ─── Single-column templates (Modern, Classic, Executive, Minimal) ───────────

function SingleColumnTemplate({ data, sections, appearance }: { data: ResumeData; sections: SectionDef[]; appearance: AppearanceConfig }) {
  const { template, accentColor, fontFamily, fontSize, lineHeight, sectionGap, headerAlign } = appearance;

  const headingStyle = (): React.CSSProperties => {
    if (template === 'modern') return { color: accentColor, borderBottom: `1.5px solid ${accentColor}40` };
    if (template === 'classic') return { color: '#111', borderBottom: '2px solid #111' };
    if (template === 'executive') return { color: '#111', borderLeft: `3px solid ${accentColor}`, paddingLeft: '8px' };
    // minimal
    return { color: '#555', borderBottom: '1px solid #e5e5e5', letterSpacing: '0.12em' };
  };

  const renderSectionHeading = (title: string) => (
    <h2 style={{ fontSize: `${fontSize * 0.88}px`, fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', paddingBottom: '4px', display: 'block', ...headingStyle() }}>
      {title}
    </h2>
  );

  const renderBullets = (text: string) => text.split('\n').map((line, i) => {
    const t = line.trim();
    if (!t) return null;
    const clean = t.replace(/^[•\-*]\s*/, '');
    return (
      <div key={i} style={{ display: 'flex', gap: '6px', marginTop: '3px', fontSize: `${fontSize * 0.95}px`, color: '#444', lineHeight }}>
        <span style={{ color: accentColor, fontWeight: 700, marginTop: '1px', fontSize: `${fontSize * 0.8}px` }}>▸</span>
        <span style={{ flex: 1 }}>{clean}</span>
      </div>
    );
  });

  const headerBg = template === 'executive' ? accentColor : 'transparent';
  const headerTextColor = template === 'executive' ? '#fff' : template === 'modern' ? accentColor : '#111';
  const headerSubColor = template === 'executive' ? 'rgba(255,255,255,0.8)' : '#555';

  return (
    <div className="printable-resume bg-white text-black shadow-2xl border border-neutral-200 rounded-sm" style={{ width: '794px', minHeight: '1123px', fontFamily, fontSize: `${fontSize}px`, lineHeight, color: '#222' }}>

      {/* Header */}
      <div style={{ backgroundColor: headerBg, padding: template === 'executive' ? '28px 40px 24px' : '36px 40px 20px', textAlign: headerAlign, borderBottom: template !== 'executive' ? `3px solid ${accentColor}` : 'none' }}>
        <h1 style={{ fontSize: `${fontSize * 2.4}px`, fontWeight: 800, letterSpacing: '-0.5px', margin: 0, color: headerTextColor, lineHeight: 1.1 }}>
          {data.personal.name || 'Your Name'}
        </h1>
        {data.personal.title && (
          <p style={{ fontSize: `${fontSize * 1.1}px`, fontWeight: 500, margin: '4px 0 0', color: template === 'executive' ? 'rgba(255,255,255,0.85)' : accentColor }}>
            {data.personal.title}
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', marginTop: '10px', fontSize: `${fontSize * 0.85}px`, color: headerSubColor, justifyContent: headerAlign === 'center' ? 'center' : headerAlign === 'right' ? 'flex-end' : 'flex-start' }}>
          {data.personal.email && <span>✉ {data.personal.email}</span>}
          {data.personal.phone && <span>✆ {data.personal.phone}</span>}
          {data.personal.location && <span>⊙ {data.personal.location}</span>}
          {data.personal.linkedin && <span>in {data.personal.linkedin}</span>}
          {data.personal.github && <span>⌥ {data.personal.github}</span>}
          {data.personal.portfolio && <span>⇢ {data.personal.portfolio}</span>}
          {data.personal.x && <span>𝕏 {data.personal.x}</span>}
        </div>
      </div>

      {/* Sections */}
      <div style={{ padding: '24px 40px', display: 'flex', flexDirection: 'column', gap: `${sectionGap}px` }}>
        {sections.filter(s => s.type !== 'personal').map(sec => {
          switch (sec.type) {
            case 'summary':
              if (!data.summary) return null;
              return (
                <div key={sec.id}>
                  {renderSectionHeading(sec.title)}
                  <p style={{ margin: 0, fontSize: `${fontSize}px`, color: '#333', lineHeight, textAlign: 'justify' }}>{data.summary}</p>
                </div>
              );
            case 'experience':
              if (!data.experience.length) return null;
              return (
                <div key={sec.id}>
                  {renderSectionHeading(sec.title)}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: `${sectionGap * 0.65}px` }}>
                    {data.experience.map((exp, i) => (
                      <div key={i} style={{ borderLeft: template === 'executive' ? `2px solid ${accentColor}20` : 'none', paddingLeft: template === 'executive' ? '10px' : '0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <strong style={{ fontSize: `${fontSize * 1.05}px`, color: '#111' }}>{exp.role || 'Role'}</strong>
                          <span style={{ fontSize: `${fontSize * 0.82}px`, color: '#888', fontStyle: 'italic' }}>{exp.dates}</span>
                        </div>
                        <div style={{ fontSize: `${fontSize * 0.92}px`, color: accentColor, fontWeight: 600, marginTop: '1px' }}>
                          {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                        </div>
                        {exp.bullets && <div style={{ marginTop: '5px' }}>{renderBullets(exp.bullets)}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            case 'education':
              if (!data.education.length) return null;
              return (
                <div key={sec.id}>
                  {renderSectionHeading(sec.title)}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: `${sectionGap * 0.4}px` }}>
                    {data.education.map((edu, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <strong style={{ fontSize: `${fontSize}px`, color: '#111' }}>{edu.degree}{edu.field ? `, ${edu.field}` : ''}</strong>
                          <div style={{ fontSize: `${fontSize * 0.9}px`, color: '#555', marginTop: '1px' }}>{edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</div>
                        </div>
                        <span style={{ fontSize: `${fontSize * 0.85}px`, color: '#888', whiteSpace: 'nowrap', marginLeft: '12px', marginTop: '2px' }}>{edu.dates}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            case 'skills':
              if (!data.skills.some(g => g.items.trim())) return null;
              return (
                <div key={sec.id}>
                  {renderSectionHeading(sec.title)}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {data.skills.map((grp, i) => {
                      if (!grp.items.trim()) return null;
                      const skillList = grp.items.split(',').map(s => s.trim()).filter(Boolean);
                      return (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          {grp.category && (
                            <span style={{ fontSize: `${fontSize * 0.85}px`, color: '#555', fontWeight: 600, minWidth: '90px', paddingTop: '2px' }}>{grp.category}:</span>
                          )}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', flex: 1 }}>
                            {skillList.map((sk, j) => (
                              <span key={j} style={{ fontSize: `${fontSize * 0.82}px`, padding: '2px 8px', borderRadius: '4px', border: `1px solid ${accentColor}30`, backgroundColor: template === 'minimal' ? 'transparent' : `${accentColor}0e`, color: template === 'minimal' ? '#444' : accentColor, fontWeight: 500 }}>{sk}</span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            case 'projects':
              if (!data.projects.length) return null;
              return (
                <div key={sec.id}>
                  {renderSectionHeading(sec.title)}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: `${sectionGap * 0.65}px` }}>
                    {data.projects.map((proj, i) => (
                      <div key={i}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontWeight: 700, fontSize: `${fontSize}px`, color: '#111' }}>{proj.name}</span>
                          <span style={{ fontSize: `${fontSize * 0.82}px`, color: '#888', fontStyle: 'italic' }}>{proj.dates}</span>
                        </div>
                        {proj.tech && <div style={{ fontSize: `${fontSize * 0.85}px`, color: accentColor, fontWeight: 600, marginTop: '1px' }}>{proj.tech}</div>}
                        {proj.url && <div style={{ fontSize: `${fontSize * 0.82}px`, color: '#777', marginTop: '1px' }}>{proj.url}</div>}
                        {proj.description && <div style={{ marginTop: '4px' }}>{renderBullets(proj.description)}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            case 'certifications':
              if (!data.certifications.length) return null;
              return (
                <div key={sec.id}>
                  {renderSectionHeading(sec.title)}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {data.certifications.map((c, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: `${fontSize}px`, color: '#111', fontWeight: 600 }}>{c.name}</span>
                        <span style={{ fontSize: `${fontSize * 0.85}px`, color: '#888' }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            case 'languages':
              if (!data.languages.length) return null;
              return (
                <div key={sec.id}>
                  {renderSectionHeading(sec.title)}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
                    {data.languages.map((l, i) => (
                      <span key={i} style={{ fontSize: `${fontSize * 0.92}px`, color: '#333' }}>
                        <strong>{l.language}</strong> <span style={{ color: '#777' }}>— {l.proficiency}</span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            case 'references':
              if (!data.references.length) return null;
              return (
                <div key={sec.id}>
                  {renderSectionHeading(sec.title)}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {data.references.map((r, i) => (
                      <div key={i} style={{ padding: '8px 10px', border: `1px solid ${accentColor}20`, borderRadius: '4px' }}>
                        <div style={{ fontWeight: 700, fontSize: `${fontSize}px`, color: '#111' }}>{r.name}</div>
                        <div style={{ fontSize: `${fontSize * 0.88}px`, color: accentColor }}>{r.title}{r.company ? `, ${r.company}` : ''}</div>
                        {r.contact && <div style={{ fontSize: `${fontSize * 0.82}px`, color: '#666', marginTop: '2px' }}>{r.contact}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            case 'custom': {
              const items = data.custom[sec.id] || [];
              if (!items.length) return null;
              return (
                <div key={sec.id}>
                  {renderSectionHeading(sec.title)}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {items.map((item, i) => (
                      <div key={i}>
                        {item.heading && <strong style={{ fontSize: `${fontSize}px`, color: '#111', display: 'block' }}>{item.heading}</strong>}
                        {item.body && <p style={{ margin: '2px 0 0', fontSize: `${fontSize * 0.95}px`, color: '#444', lineHeight }}>{item.body}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            default: return null;
          }
        })}
      </div>
    </div>
  );
}

// ─── Sidebar Template ────────────────────────────────────────────────────────

function SidebarTemplate({ data, sections, appearance }: { data: ResumeData; sections: SectionDef[]; appearance: AppearanceConfig }) {
  const { accentColor, fontFamily, fontSize, lineHeight, sectionGap } = appearance;

  const SIDEBAR_TYPES: SectionType[] = ['skills', 'education', 'certifications', 'languages'];
  const MAIN_TYPES: SectionType[] = ['summary', 'experience', 'projects', 'references', 'custom'];

  const sidebarSections = sections.filter(s => SIDEBAR_TYPES.includes(s.type));
  const mainSections = sections.filter(s => MAIN_TYPES.includes(s.type));

  const sideHeading = (title: string) => (
    <h2 style={{ fontSize: `${fontSize * 0.82}px`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.9)', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '4px', marginBottom: '8px' }}>
      {title}
    </h2>
  );

  const mainHeading = (title: string) => (
    <h2 style={{ fontSize: `${fontSize * 0.88}px`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, borderBottom: `1.5px solid ${accentColor}35`, paddingBottom: '4px', marginBottom: '8px' }}>
      {title}
    </h2>
  );

  const renderBullets = (text: string, dark = false) => text.split('\n').map((line, i) => {
    const t = line.trim();
    if (!t) return null;
    const clean = t.replace(/^[•\-*]\s*/, '');
    return (
      <div key={i} style={{ display: 'flex', gap: '5px', marginTop: '3px', fontSize: `${fontSize * 0.92}px`, color: dark ? 'rgba(255,255,255,0.75)' : '#444', lineHeight }}>
        <span style={{ color: dark ? 'rgba(255,255,255,0.5)' : accentColor, marginTop: '1px', fontSize: `${fontSize * 0.75}px` }}>▸</span>
        <span>{clean}</span>
      </div>
    );
  });

  return (
    <div className="printable-resume bg-white text-black shadow-2xl border border-neutral-200 rounded-sm" style={{ width: '794px', minHeight: '1123px', fontFamily, fontSize: `${fontSize}px`, lineHeight, color: '#222', display: 'flex', flexDirection: 'column' }}>

      {/* Header full width */}
      <div style={{ backgroundColor: accentColor, padding: '28px 32px 22px', color: '#fff' }}>
        <h1 style={{ fontSize: `${fontSize * 2.3}px`, fontWeight: 800, margin: 0, letterSpacing: '-0.5px', lineHeight: 1.1 }}>
          {data.personal.name || 'Your Name'}
        </h1>
        {data.personal.title && (
          <p style={{ fontSize: `${fontSize * 1.05}px`, margin: '4px 0 0', opacity: 0.85, fontWeight: 500 }}>{data.personal.title}</p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', marginTop: '10px', fontSize: `${fontSize * 0.82}px`, opacity: 0.8 }}>
          {data.personal.email && <span>✉ {data.personal.email}</span>}
          {data.personal.phone && <span>✆ {data.personal.phone}</span>}
          {data.personal.location && <span>⊙ {data.personal.location}</span>}
          {data.personal.linkedin && <span>in {data.personal.linkedin}</span>}
          {data.personal.github && <span>⌥ {data.personal.github}</span>}
          {data.personal.portfolio && <span>⇢ {data.personal.portfolio}</span>}
        </div>
      </div>

      {/* Two columns */}
      <div style={{ display: 'flex', flex: 1 }}>

        {/* Left sidebar */}
        <div style={{ width: '260px', minWidth: '260px', backgroundColor: `${accentColor}12`, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: `${sectionGap * 0.9}px`, borderRight: `2px solid ${accentColor}20` }}>
          {sidebarSections.map(sec => {
            switch (sec.type) {
              case 'skills':
                if (!data.skills.some(g => g.items.trim())) return null;
                return (
                  <div key={sec.id}>
                    {sideHeading(sec.title)}
                    {data.skills.map((grp, i) => {
                      if (!grp.items.trim()) return null;
                      const skillList = grp.items.split(',').map(s => s.trim()).filter(Boolean);
                      return (
                        <div key={i} style={{ marginBottom: '8px' }}>
                          {grp.category && <div style={{ fontSize: `${fontSize * 0.8}px`, fontWeight: 700, color: accentColor, marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{grp.category}</div>}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                            {skillList.map((sk, j) => (
                              <span key={j} style={{ fontSize: `${fontSize * 0.8}px`, padding: '1px 6px', borderRadius: '3px', backgroundColor: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}30`, fontWeight: 500 }}>{sk}</span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              case 'education':
                if (!data.education.length) return null;
                return (
                  <div key={sec.id}>
                    {sideHeading(sec.title)}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {data.education.map((edu, i) => (
                        <div key={i}>
                          <div style={{ fontWeight: 700, fontSize: `${fontSize * 0.88}px`, color: '#111' }}>{edu.degree}</div>
                          {edu.field && <div style={{ fontSize: `${fontSize * 0.82}px`, color: '#444' }}>{edu.field}</div>}
                          <div style={{ fontSize: `${fontSize * 0.82}px`, color: accentColor, fontWeight: 600 }}>{edu.institution}</div>
                          <div style={{ fontSize: `${fontSize * 0.78}px`, color: '#666', marginTop: '1px' }}>{edu.dates}{edu.gpa ? ` · ${edu.gpa}` : ''}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              case 'certifications':
                if (!data.certifications.length) return null;
                return (
                  <div key={sec.id}>
                    {sideHeading(sec.title)}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {data.certifications.map((c, i) => (
                        <div key={i}>
                          <div style={{ fontWeight: 600, fontSize: `${fontSize * 0.85}px`, color: '#111' }}>{c.name}</div>
                          <div style={{ fontSize: `${fontSize * 0.78}px`, color: '#666' }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              case 'languages':
                if (!data.languages.length) return null;
                return (
                  <div key={sec.id}>
                    {sideHeading(sec.title)}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {data.languages.map((l, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: `${fontSize * 0.85}px` }}>
                          <span style={{ fontWeight: 600, color: '#111' }}>{l.language}</span>
                          <span style={{ color: '#777' }}>{l.proficiency}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              default: return null;
            }
          })}
        </div>

        {/* Right main */}
        <div style={{ flex: 1, padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: `${sectionGap}px` }}>
          {mainSections.map(sec => {
            switch (sec.type) {
              case 'summary':
                if (!data.summary) return null;
                return (
                  <div key={sec.id}>
                    {mainHeading(sec.title)}
                    <p style={{ margin: 0, fontSize: `${fontSize}px`, color: '#333', lineHeight, textAlign: 'justify' }}>{data.summary}</p>
                  </div>
                );
              case 'experience':
                if (!data.experience.length) return null;
                return (
                  <div key={sec.id}>
                    {mainHeading(sec.title)}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: `${sectionGap * 0.65}px` }}>
                      {data.experience.map((exp, i) => (
                        <div key={i}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <strong style={{ fontSize: `${fontSize * 1.02}px`, color: '#111' }}>{exp.role || 'Role'}</strong>
                            <span style={{ fontSize: `${fontSize * 0.8}px`, color: '#888', fontStyle: 'italic' }}>{exp.dates}</span>
                          </div>
                          <div style={{ fontSize: `${fontSize * 0.9}px`, color: accentColor, fontWeight: 600, marginTop: '1px' }}>
                            {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                          </div>
                          {exp.bullets && <div style={{ marginTop: '5px' }}>{renderBullets(exp.bullets)}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              case 'projects':
                if (!data.projects.length) return null;
                return (
                  <div key={sec.id}>
                    {mainHeading(sec.title)}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: `${sectionGap * 0.6}px` }}>
                      {data.projects.map((proj, i) => (
                        <div key={i}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontWeight: 700, fontSize: `${fontSize}px`, color: '#111' }}>{proj.name}</span>
                            <span style={{ fontSize: `${fontSize * 0.82}px`, color: '#888' }}>{proj.dates}</span>
                          </div>
                          {proj.tech && <div style={{ fontSize: `${fontSize * 0.82}px`, color: accentColor, fontWeight: 600 }}>{proj.tech}</div>}
                          {proj.description && <div style={{ marginTop: '3px' }}>{renderBullets(proj.description)}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              case 'references':
                if (!data.references.length) return null;
                return (
                  <div key={sec.id}>
                    {mainHeading(sec.title)}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {data.references.map((r, i) => (
                        <div key={i} style={{ padding: '8px', border: `1px solid ${accentColor}20`, borderRadius: '4px' }}>
                          <div style={{ fontWeight: 700, fontSize: `${fontSize * 0.92}px`, color: '#111' }}>{r.name}</div>
                          <div style={{ fontSize: `${fontSize * 0.82}px`, color: accentColor }}>{r.title}{r.company ? `, ${r.company}` : ''}</div>
                          {r.contact && <div style={{ fontSize: `${fontSize * 0.78}px`, color: '#666' }}>{r.contact}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              case 'custom': {
                const items = data.custom[sec.id] || [];
                if (!items.length) return null;
                return (
                  <div key={sec.id}>
                    {mainHeading(sec.title)}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {items.map((item, i) => (
                        <div key={i}>
                          {item.heading && <strong style={{ fontSize: `${fontSize}px`, color: '#111', display: 'block' }}>{item.heading}</strong>}
                          {item.body && <p style={{ margin: '2px 0 0', fontSize: `${fontSize * 0.95}px`, color: '#444', lineHeight }}>{item.body}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              default: return null;
            }
          })}
        </div>
      </div>
    </div>
  );
}
