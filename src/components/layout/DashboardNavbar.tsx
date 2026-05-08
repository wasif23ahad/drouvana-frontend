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
} from 'lucide-react';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

const DashboardNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getPageTitle = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length <= 1) return 'Overview';
    const lastPart = parts[parts.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace('-', ' ');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-[#334155] shrink-0 bg-[#0F172A]/70 backdrop-blur-md sticky top-0 z-40 w-full">
      <div className="flex items-center gap-4">
        {/* Mobile Logo */}
        <div className="flex items-center lg:hidden gap-2 mr-4">
           <Image src="/Drouvana_logo.png" alt="Drouvana" width={26} height={26} className="rounded-lg" />
           <span className="font-bold font-hanken text-text-main">Drouvana</span>
        </div>

        <div className="hidden sm:flex items-center text-xs text-text-muted gap-2 font-jetbrains uppercase tracking-widest">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Workspace</Link>
          <ChevronRight className="w-3 h-3 opacity-50" />
          <span className="text-primary font-bold">{getPageTitle()}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-3.5 h-3.5" />
          <input 
            className="w-full bg-surface-2 border border-white/5 text-text-main text-xs rounded-xl pl-9 pr-4 py-2 focus:border-primary focus:outline-none transition-all placeholder:text-text-muted/50" 
            placeholder="Search applications..." 
            type="text"
          />
        </div>

        <button className="text-text-muted hover:text-primary transition-colors relative p-2 rounded-full hover:bg-white/5">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-[#0F172A]"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 pl-2 border-l border-[#334155] hover:opacity-80 transition-opacity"
          >
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-text-main leading-none mb-1">{session?.user?.name}</p>
              <p className="text-[10px] text-text-muted font-jetbrains uppercase tracking-tighter">
                {session?.user?.role === 'ADMIN' ? 'Administrator' : 'Member'}
              </p>
            </div>
            <Avatar className="w-9 h-9 border border-primary/20 ring-4 ring-primary/5">
              <AvatarImage src={session?.user?.image || ''} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                {session?.user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform hidden sm:block ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-surface border border-white/5 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
              <div className="p-3 border-b border-white/5">
                <p className="text-sm font-bold text-text-main truncate">{session?.user?.name}</p>
                <p className="text-xs text-text-muted truncate">{session?.user?.email}</p>
              </div>
              <div className="p-2">
                <Link
                  href="/dashboard/resume"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-sub hover:bg-surface-2 hover:text-text-main transition-colors"
                >
                  <User className="w-4 h-4" />Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-sub hover:bg-surface-2 hover:text-text-main transition-colors"
                >
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
  );
};

export default DashboardNavbar;
