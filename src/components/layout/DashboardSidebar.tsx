"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Sparkles, 
  BarChart3, 
  Settings,
  Plus,
  HelpCircle,
  LogOut,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';

const navLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Tracker', href: '/dashboard/tracker', icon: Briefcase },
  { name: 'Master Profile', href: '/dashboard/resume', icon: FileText },
  { name: 'AI Optimization', href: '/dashboard/workspace', icon: Zap },
  { name: 'AI Assistant', href: '/dashboard/assistant', icon: Sparkles },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="bg-surface-container backdrop-blur-xl border-r border-white/10 w-72 flex flex-col h-screen fixed left-0 top-0 z-50 overflow-y-auto hidden lg:flex shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary">
             <Zap className="w-5 h-5 fill-primary/20" />
          </div>
          <div>
            <h1 className="text-lg font-heading font-bold text-primary italic leading-none">Drouvana</h1>
            <p className="font-mono text-[8px] uppercase tracking-widest text-on-surface-variant">AI Job Tracker</p>
          </div>
        </div>
      </div>

      <div className="px-4 mb-6">
        <Link href="/dashboard/tracker?new=true">
          <Button className="w-full bg-gradient-primary text-white py-2.5 px-4 rounded-xl font-heading font-bold italic text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(128,131,255,0.2)] border-none h-11">
            <Plus className="w-4 h-4" />
            New Application
          </Button>
        </Link>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface'
              }`}
            >
              <link.icon className={`w-5 h-5 ${isActive ? 'fill-primary/10' : ''}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 mt-auto space-y-1">
        <Link 
          href="/help"
          className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-on-surface transition-colors rounded-lg text-sm"
        >
          <HelpCircle className="w-4 h-4" />
          Help
        </Link>
        <button 
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-error transition-colors rounded-lg text-sm w-full text-left"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
