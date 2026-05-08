"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import { Bell, Lock, Palette, Save, Shield, Trash2, User } from 'lucide-react';

const tabs = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('account');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-hanken text-text-main mb-1">Settings</h1>
        <p className="text-text-sub text-sm">Manage your account preferences and configuration.</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-48 shrink-0">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-sub hover:bg-surface-2 hover:text-text-main'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 space-y-4">
          {activeTab === 'account' && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="font-hanken">Account Information</CardTitle>
                <CardDescription>Update your personal details and profile information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs font-jetbrains uppercase tracking-widest text-text-muted mb-1.5 block">Full Name</label>
                  <Input defaultValue={session?.user?.name || ''} className="bg-surface-2 border-none rounded-xl h-11" />
                </div>
                <div>
                  <label className="text-xs font-jetbrains uppercase tracking-widest text-text-muted mb-1.5 block">Email Address</label>
                  <Input defaultValue={session?.user?.email || ''} className="bg-surface-2 border-none rounded-xl h-11" />
                </div>
                <div>
                  <label className="text-xs font-jetbrains uppercase tracking-widest text-text-muted mb-1.5 block">Job Title</label>
                  <Input placeholder="e.g. Senior Software Engineer" className="bg-surface-2 border-none rounded-xl h-11" />
                </div>
                <div>
                  <label className="text-xs font-jetbrains uppercase tracking-widest text-text-muted mb-1.5 block">Location</label>
                  <Input placeholder="e.g. San Francisco, CA" className="bg-surface-2 border-none rounded-xl h-11" />
                </div>
                <Button onClick={handleSave} className="rounded-xl gap-2">
                  <Save className="w-4 h-4" />
                  {saved ? 'Saved!' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="font-hanken">Notification Preferences</CardTitle>
                <CardDescription>Choose when and how you receive updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Application Status Updates', desc: 'Get notified when your application status changes.' },
                  { label: 'AI Analysis Complete', desc: 'Receive alerts when an AI analysis finishes.' },
                  { label: 'Weekly Pipeline Summary', desc: 'A weekly digest of your job search progress.' },
                  { label: 'Interview Reminders', desc: 'Reminders for upcoming interviews and follow-ups.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-surface-2">
                    <div>
                      <p className="text-sm font-medium text-text-main">{item.label}</p>
                      <p className="text-xs text-text-sub mt-0.5">{item.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="font-hanken">Security Settings</CardTitle>
                <CardDescription>Manage your password and account security.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs font-jetbrains uppercase tracking-widest text-text-muted mb-1.5 block">Current Password</label>
                  <Input type="password" placeholder="••••••••" className="bg-surface-2 border-none rounded-xl h-11" />
                </div>
                <div>
                  <label className="text-xs font-jetbrains uppercase tracking-widest text-text-muted mb-1.5 block">New Password</label>
                  <Input type="password" placeholder="••••••••" className="bg-surface-2 border-none rounded-xl h-11" />
                </div>
                <div>
                  <label className="text-xs font-jetbrains uppercase tracking-widest text-text-muted mb-1.5 block">Confirm New Password</label>
                  <Input type="password" placeholder="••••••••" className="bg-surface-2 border-none rounded-xl h-11" />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button className="rounded-xl gap-2"><Lock className="w-4 h-4" />Update Password</Button>
                </div>
                <div className="mt-6 pt-6 border-t border-white/5">
                  <h4 className="text-sm font-bold text-error mb-2">Danger Zone</h4>
                  <Button variant="outline" className="border-error/30 text-error hover:bg-error/10 rounded-xl gap-2">
                    <Trash2 className="w-4 h-4" />Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="font-hanken">Appearance</CardTitle>
                <CardDescription>Customize the look and feel of your workspace.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-sub">Use the theme toggle in the top navigation bar to switch between light and dark modes.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
