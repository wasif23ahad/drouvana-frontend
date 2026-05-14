"use client";

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  Search,
  ChevronRight,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  ListTodo,
  FileText,
  Sparkles,
  BarChart3,
  Layers,
  Send,
  MessageSquare,
  Activity,
  HelpCircle,
  Plus,
} from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

const NAV_LINKS = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Job Tracker', href: '/dashboard/tracker', icon: ListTodo },
  { name: 'Profile Data', href: '/dashboard/resume', icon: FileText },
  { name: 'Resume Versions', href: '/dashboard/resume/versions', icon: Layers },
  { name: 'Resume Builder', href: '/dashboard/builder', icon: Sparkles },
  { name: 'ATS Analyzer', href: '/dashboard/analyzer', icon: BarChart3 },
  { name: 'Cover Letters', href: '/dashboard/cover-letter', icon: Layers },
  { name: 'Cold Outreach', href: '/dashboard/outreach', icon: Send },
  { name: 'AI Coach', href: '/dashboard/assistant', icon: MessageSquare },
  { name: 'Pipeline Health', href: '/dashboard/health', icon: Activity },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const DashboardNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getPageTitle = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length <= 1) return 'Overview';
    const lastPart = parts[parts.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace('-', ' ');
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-[#334155] shrink-0 bg-[#0F172A]/70 backdrop-blur-md sticky top-0 z-40 w-full">
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 text-text-muted hover:text-text-main transition-colors rounded-xl hover:bg-white/5"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo — mobile only (lg sidebar covers this) */}
          <div className="flex items-center lg:hidden gap-2">
            <Image src="/Drouvana_logo.png" alt="Drouvana" width={24} height={24} className="rounded-lg" />
            <span className="font-bold font-hanken text-text-main text-sm">Drouvana</span>
          </div>

          <div className="hidden sm:flex items-center text-xs text-text-muted gap-2 font-jetbrains uppercase tracking-widest">
            <Link href="/dashboard" className="hover:text-primary transition-colors">Workspace</Link>
            <ChevronRight className="w-3 h-3 opacity-50" />
            <span className="text-primary font-bold">{getPageTitle()}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <form
            className="relative hidden md:block w-52 lg:w-64"
            onSubmit={e => {
              e.preventDefault();
              if (searchQuery.trim()) {
                router.push(`/dashboard/tracker?search=${encodeURIComponent(searchQuery.trim())}`);
              }
            }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-3.5 h-3.5" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-surface-2 border border-white/5 text-text-main text-xs rounded-xl pl-9 pr-4 py-2 focus:border-primary focus:outline-none transition-all placeholder:text-text-muted/50"
              placeholder="Search applications..."
              type="text"
            />
          </form>

          <button className="text-text-muted hover:text-primary transition-colors relative p-2 rounded-full hover:bg-white/5">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-[#0F172A]"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 sm:gap-3 pl-2 border-l border-[#334155] hover:opacity-80 transition-opacity"
            >
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold text-text-main leading-none mb-1">{session?.user?.name}</p>
                <p className="text-[10px] text-text-muted font-jetbrains uppercase tracking-tighter">
                  {session?.user?.role === 'ADMIN' ? 'Administrator' : 'Member'}
                </p>
              </div>
              <Avatar className="w-8 h-8 sm:w-9 sm:h-9 border border-primary/20 ring-4 ring-primary/5">
                <AvatarImage src={session?.user?.image || ''} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {session?.user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform hidden sm:block ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-surface border border-white/5 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
                <div className="p-3 border-b border-white/5">
                  <p className="text-sm font-bold text-text-main truncate">{session?.user?.name}</p>
                  <p className="text-xs text-text-muted truncate">{session?.user?.email}</p>
                </div>
                <div className="p-2">
                  <Link href="/dashboard/resume" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-sub hover:bg-surface-2 hover:text-text-main transition-colors">
                    <User className="w-4 h-4" />Profile
                  </Link>
                  <Link href="/dashboard/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-sub hover:bg-surface-2 hover:text-text-main transition-colors">
                    <Settings className="w-4 h-4" />Settings
                  </Link>
                </div>
                <div className="p-2 border-t border-white/5">
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-error hover:bg-error/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer panel */}
          <aside className="absolute left-0 top-0 h-full w-72 bg-[var(--color-surface)] border-r border-[#334155] flex flex-col overflow-y-auto animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="p-5 border-b border-[#334155] flex items-center justify-between">
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
                <Image src="/Drouvana_logo.png" alt="Drouvana" width={26} height={26} className="rounded-lg" />
                <span className="text-lg font-bold font-hanken tracking-tight text-text-main">Drouvana</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 text-text-muted hover:text-text-main rounded-lg hover:bg-white/5">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* New application CTA */}
            <div className="px-4 py-4">
              <Link href="/dashboard/tracker" onClick={() => setMobileOpen(false)}>
                <button className="w-full h-10 bg-primary text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                  <Plus className="w-4 h-4" /> New Application
                </button>
              </Link>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-3 space-y-1 pb-4">
              {NAV_LINKS.map(link => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-sub hover:bg-surface-2 hover:text-text-main'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-text-muted'}`} />
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-[#334155] space-y-1">
              <Link href="/help" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-text-muted hover:text-text-main rounded-xl text-sm font-medium">
                <HelpCircle className="w-4 h-4" /> Help Center
              </Link>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-3 px-4 py-2 text-text-muted hover:text-error rounded-xl text-sm font-medium w-full text-left"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default DashboardNavbar;
