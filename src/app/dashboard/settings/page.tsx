"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession, signOut } from 'next-auth/react';
import { Bell, Lock, Palette, Save, Shield, Trash2, User, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';

const tabs = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState('account');

  // Account form
  const [name, setName] = useState('');
  const [headline, setHeadline] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [savingAccount, setSavingAccount] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Delete
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    api.get('/api/auth/me').then(res => {
      const u = res.data;
      setName(u.name || '');
      setHeadline(u.headline || '');
      setLocation(u.location || '');
      setBio(u.bio || '');
      setLinkedinUrl(u.linkedinUrl || '');
      setGithubUrl(u.githubUrl || '');
    }).catch(() => {
      // fallback to session
      setName(session?.user?.name || '');
    });
  }, [session?.user]);

  const handleSaveAccount = async () => {
    setSavingAccount(true);
    try {
      await api.patch('/api/auth/me', { name, headline, location, bio, linkedinUrl, githubUrl });
      await update({ name });
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSavingAccount(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    setSavingPassword(true);
    try {
      await api.post('/api/auth/change-password', { currentPassword, newPassword });
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      await api.delete('/api/auth/me');
      toast.success('Account deactivated');
      await signOut({ callbackUrl: '/' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
      setDeletingAccount(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-hanken text-text-main mb-1">Settings</h1>
        <p className="text-text-sub text-sm">Manage your account preferences and configuration.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="sm:w-48 shrink-0">
          <nav className="flex sm:flex-col gap-1 overflow-x-auto sm:overflow-visible">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-text-sub hover:bg-surface-2 hover:text-text-main'
                }`}
              >
                <tab.icon className="w-4 h-4 shrink-0" />
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
                  <Input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="bg-surface-2 border-none rounded-xl h-11"
                  />
                </div>
                <div>
                  <label className="text-xs font-jetbrains uppercase tracking-widest text-text-muted mb-1.5 block">Email Address</label>
                  <Input
                    value={session?.user?.email || ''}
                    disabled
                    className="bg-surface-2 border-none rounded-xl h-11 opacity-60 cursor-not-allowed"
                  />
                  <p className="text-xs text-text-muted mt-1">Email cannot be changed.</p>
                </div>
                <div>
                  <label className="text-xs font-jetbrains uppercase tracking-widest text-text-muted mb-1.5 block">Job Title / Headline</label>
                  <Input
                    value={headline}
                    onChange={e => setHeadline(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="bg-surface-2 border-none rounded-xl h-11"
                  />
                </div>
                <div>
                  <label className="text-xs font-jetbrains uppercase tracking-widest text-text-muted mb-1.5 block">Location</label>
                  <Input
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                    className="bg-surface-2 border-none rounded-xl h-11"
                  />
                </div>
                <div>
                  <label className="text-xs font-jetbrains uppercase tracking-widest text-text-muted mb-1.5 block">Bio</label>
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="A short professional bio..."
                    rows={3}
                    className="w-full bg-surface-2 border-none rounded-xl px-3 py-2.5 text-sm text-text-main placeholder:text-text-muted resize-none outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-jetbrains uppercase tracking-widest text-text-muted mb-1.5 block">LinkedIn URL</label>
                    <Input
                      value={linkedinUrl}
                      onChange={e => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="bg-surface-2 border-none rounded-xl h-11"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-jetbrains uppercase tracking-widest text-text-muted mb-1.5 block">GitHub URL</label>
                    <Input
                      value={githubUrl}
                      onChange={e => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="bg-surface-2 border-none rounded-xl h-11"
                    />
                  </div>
                </div>
                <Button onClick={handleSaveAccount} disabled={savingAccount} className="rounded-xl gap-2">
                  {savingAccount ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {savingAccount ? 'Saving...' : 'Save Changes'}
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
                <p className="text-xs text-text-muted pt-2">Notification delivery settings require email configuration on the server.</p>
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
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-surface-2 border-none rounded-xl h-11"
                  />
                </div>
                <div>
                  <label className="text-xs font-jetbrains uppercase tracking-widest text-text-muted mb-1.5 block">New Password</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-surface-2 border-none rounded-xl h-11"
                  />
                </div>
                <div>
                  <label className="text-xs font-jetbrains uppercase tracking-widest text-text-muted mb-1.5 block">Confirm New Password</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`bg-surface-2 border-none rounded-xl h-11 ${confirmPassword && confirmPassword !== newPassword ? 'ring-1 ring-error' : ''}`}
                  />
                  {confirmPassword && confirmPassword !== newPassword && (
                    <p className="text-xs text-error mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Passwords do not match</p>
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleChangePassword}
                    disabled={savingPassword || !currentPassword || !newPassword || newPassword !== confirmPassword}
                    className="rounded-xl gap-2"
                  >
                    {savingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                    {savingPassword ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
                <div className="mt-6 pt-6 border-t border-white/5">
                  <h4 className="text-sm font-bold text-red-400 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Danger Zone
                  </h4>
                  <p className="text-xs text-text-muted mb-4">Deleting your account will deactivate access to all features. This action can be reversed by contacting support.</p>
                  {!showDeleteConfirm ? (
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </Button>
                  ) : (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 space-y-3">
                      <p className="text-sm font-medium text-red-400">Are you sure? This will deactivate your account immediately.</p>
                      <div className="flex gap-3">
                        <Button
                          variant="destructive"
                          onClick={handleDeleteAccount}
                          disabled={deletingAccount}
                          className="rounded-xl gap-2"
                        >
                          {deletingAccount ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          {deletingAccount ? 'Deleting...' : 'Yes, Delete My Account'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="rounded-xl"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
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
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-surface-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-main">Theme</p>
                    <p className="text-xs text-text-sub mt-0.5">Switch between light and dark mode using the toggle in the top navigation bar.</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-success" />
                </div>
                <div className="p-4 rounded-xl bg-surface-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-text-main">Compact Mode</p>
                    <p className="text-xs text-text-sub mt-0.5">Reduce spacing in dashboard views for more content density.</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4 accent-primary" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
