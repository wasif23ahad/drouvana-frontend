"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  Zap,
  MessageSquare,
  ListTodo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userNavLinks = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Job Tracker', href: '/dashboard/tracker', icon: ListTodo },
    { name: 'Profile', href: '/dashboard/resume', icon: FileText },
    { name: 'AI Coach', href: '/dashboard/assistant', icon: MessageSquare },
    { name: 'Workspace', href: '/dashboard/workspace', icon: Zap },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const adminNavLinks = [
    ...userNavLinks,
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  ];

  const isAdmin = session?.user?.role === 'ADMIN';
  const navLinks = isAdmin ? adminNavLinks : userNavLinks;

  return (
    <aside className="bg-[var(--color-surface)] border-r border-[#334155] w-72 flex flex-col h-screen fixed left-0 top-0 z-50 overflow-y-auto hidden lg:flex shrink-0">
      <div className="p-6 border-b border-[#334155]">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <Image src="/Drouvana_logo.png" alt="Drouvana" width={28} height={28} className="rounded-lg" />
          <span className="text-xl font-bold font-hanken tracking-tight text-text-main">Drouvana</span>
        </Link>
      </div>

      <div className="px-4 py-6">
        <Link href="/dashboard/tracker">
          <Button className="w-full rounded-xl font-bold gap-2 border-none h-11 shadow-lg shadow-primary/10">
            <Plus className="w-4 h-4" />
            New Application
          </Button>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-text-sub hover:bg-surface-2 hover:text-text-main'
              }`}
            >
              <link.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-text-muted'}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#334155] mt-auto space-y-1">
        <Link 
          href="/help"
          className="flex items-center gap-3 px-4 py-2 text-text-muted hover:text-text-main transition-colors rounded-xl text-sm font-medium"
        >
          <HelpCircle className="w-4 h-4" />
          Help Center
        </Link>
        <button 
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-2 text-text-muted hover:text-error transition-colors rounded-xl text-sm font-medium w-full text-left"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
