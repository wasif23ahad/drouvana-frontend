"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  Settings, 
  User, 
  Bell, 
  Rocket,
  ChevronRight,
  LogOut,
  PlusCircle,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';

interface SidebarLink {
  name: string;
  href: string;
  icon: any;
  highlight?: boolean;
}

const userLinks: SidebarLink[] = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Workspace', href: '/dashboard/workspace', icon: Rocket, highlight: true },
  { name: 'Career Coach', href: '/dashboard/assistant', icon: User },
  { name: 'Job Tracker', href: '/dashboard/tracker', icon: Briefcase },
  { name: 'Templates', href: '/templates', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const adminLinks: SidebarLink[] = [
  { name: 'Admin Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'User Management', href: '/admin/users', icon: User },
  { name: 'AI Performance', href: '/admin/performance', icon: Activity },
  { name: 'Content Manager', href: '/admin/content', icon: FileText },
  { name: 'System Logs', href: '/admin/logs', icon: Bell },
  { name: 'Global Settings', href: '/admin/settings', icon: Settings },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  
  // Rule 100: Check role
  const isAdmin = (session?.user as any)?.role === 'ADMIN' || pathname.startsWith('/admin');
  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside className="w-72 border-r border-border/50 bg-background/50 backdrop-blur-xl flex flex-col h-screen fixed left-0 top-0 z-40">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group mb-10">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
            <Rocket className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight italic">Drouvana</span>
        </Link>

        <div className="space-y-1">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                pathname === link.href 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : link.highlight 
                    ? "text-primary hover:bg-primary/5 border border-primary/20"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <link.icon className="w-5 h-5" />
                <span>{link.name}</span>
              </div>
              {pathname === link.href && (
                <motion.div layoutId="sidebar-dot" className="w-1.5 h-1.5 bg-white rounded-full" />
              )}
              {!link.highlight && pathname !== link.href && (
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-border/50 space-y-4">
        <div className="glass rounded-2xl p-4 space-y-3">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">Quick Action</p>
          <Button className="w-full justify-start gap-2 h-10 bg-primary/10 hover:bg-primary/20 text-primary border-none">
            <PlusCircle className="w-4 h-4" />
            New Application
          </Button>
        </div>

        <button 
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
