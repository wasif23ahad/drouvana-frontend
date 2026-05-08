"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  Users, 
  FileCode, 
  BarChart3, 
  Settings,
  Zap,
  ArrowLeft,
  ChevronRight,
  Bell
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';

const adminLinks = [
  { name: 'Dashboard', href: '/admin', icon: BarChart3 },
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'Resume Templates', href: '/admin/templates', icon: FileCode },
  { name: 'AI Interaction Logs', href: '/admin/ai-logs', icon: Zap },
  { name: 'System Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen bg-background text-on-background font-sans">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-surface-container backdrop-blur-xl border-r border-white/10 h-screen fixed left-0 top-0 z-50 overflow-y-auto hidden md:flex flex-col shrink-0">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary to-tertiary flex items-center justify-center text-on-primary font-bold text-lg">D</div>
            <div>
              <h1 className="text-sm font-heading font-bold text-primary italic leading-none">Drouvana</h1>
              <p className="font-mono text-[8px] uppercase tracking-widest text-on-surface-variant">Admin Dashboard</p>
            </div>
          </div>
        </div>

        <div className="p-4 flex-1">
          <nav className="space-y-2">
            {adminLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all border-l-4 ${
                    isActive 
                      ? 'bg-primary/10 text-primary border-primary' 
                      : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface border-transparent'
                  }`}
                >
                  <link.icon className={`w-5 h-5 ${isActive ? 'fill-primary/20' : ''}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/5">
          <Link 
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-on-surface-variant hover:text-on-surface transition-all border-l-4 border-transparent hover:bg-white/5"
          >
            <ArrowLeft className="w-5 h-5" />
            Exit Admin
          </Link>
        </div>
      </aside>

      <div className="flex-1 md:ml-64 min-h-screen flex flex-col overflow-hidden relative">
        {/* Decorative Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* TopNavBar */}
        <header className="bg-surface/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40 flex justify-between items-center px-8 py-4 w-full h-16">
          <div className="flex items-center gap-4">
            <div className="text-on-surface-variant font-sans text-xs flex items-center gap-2">
              <span>Admin</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-on-surface font-bold uppercase tracking-widest text-[10px]">
                {adminLinks.find(l => l.href === pathname)?.name || 'Dashboard'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-on-surface-variant hover:text-primary transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border border-background"></span>
            </button>
            <Avatar className="w-8 h-8 border border-white/10">
              <AvatarImage src={session?.user?.image || ''} />
              <AvatarFallback className="bg-surface-bright text-xs font-bold">{session?.user?.name?.charAt(0) || 'A'}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8 z-10">
          <div className="max-w-spacing-container-max mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
