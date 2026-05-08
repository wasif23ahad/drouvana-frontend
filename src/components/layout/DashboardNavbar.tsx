"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { 
  Bell, 
  Search, 
  ChevronRight,
  Menu,
  Briefcase
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const DashboardNavbar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const getPageTitle = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length <= 1) return 'Overview';
    const lastPart = parts[parts.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace('-', ' ');
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-[#334155] shrink-0 bg-[#0F172A]/70 backdrop-blur-md sticky top-0 z-40 w-full">
      <div className="flex items-center gap-4">
        {/* Mobile Logo & Toggle */}
        <div className="flex items-center lg:hidden gap-2 mr-4">
           <Briefcase className="h-5 w-5 text-primary" />
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
            placeholder="Search Intelligence..." 
            type="text"
          />
        </div>
        <button className="text-text-muted hover:text-primary transition-colors relative p-2 rounded-full hover:bg-white/5">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-[#0F172A]"></span>
        </button>
        <div className="flex items-center gap-3 pl-2 border-l border-[#334155]">
           <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-text-main leading-none mb-1">{session?.user?.name}</p>
              <p className="text-[10px] text-text-muted font-jetbrains uppercase tracking-tighter">Operational</p>
           </div>
           <Avatar className="w-9 h-9 border border-primary/20 ring-4 ring-primary/5">
             <AvatarImage src={session?.user?.image || ''} />
             <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
               {session?.user?.name?.charAt(0) || 'U'}
             </AvatarFallback>
           </Avatar>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
