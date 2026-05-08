"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { 
  Bell, 
  Search, 
  ChevronRight,
  Menu
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';

const DashboardNavbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const getPageTitle = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length <= 1) return 'Dashboard';
    const lastPart = parts[parts.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
  };

  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 shrink-0 bg-surface/50 backdrop-blur-md sticky top-0 z-40 w-full">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle (visible only on mobile) */}
        <button className="lg:hidden text-on-surface-variant hover:text-primary">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center text-xs text-on-surface-variant gap-2 font-mono uppercase tracking-widest">
          <span className="hover:text-primary transition-colors cursor-pointer">Workspace</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary font-bold">{getPageTitle()}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden sm:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
          <input 
            className="w-full bg-surface-container-high border border-outline-variant/50 text-on-surface text-xs rounded-lg pl-10 pr-4 py-2 focus:border-primary focus:outline-none transition-all placeholder:text-on-surface-variant/50" 
            placeholder="Search applications..." 
            type="text"
          />
        </div>
        <button className="text-on-surface-variant hover:text-primary transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border border-background"></span>
        </button>
        <Avatar className="w-8 h-8 border border-white/10 ring-2 ring-primary/10">
          <AvatarImage src={session?.user?.image || ''} />
          <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">
            {session?.user?.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default DashboardNavbar;
