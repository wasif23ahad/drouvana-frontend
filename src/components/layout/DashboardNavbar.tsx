"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, Search, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NotificationDrawer from '../dashboard/NotificationDrawer';
import { toast } from 'sonner';

const DashboardNavbar = () => {
  const { data: session } = useSession();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  useEffect(() => {
    if (!session) return;

    const eventSource = new EventSource('/api/notifications/stream');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'connected') return;

      toast.success(data.title, {
        description: data.message,
      });
      setHasUnread(true);
    };

    return () => eventSource.close();
  }, [session]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="h-20 border-b border-border/50 bg-background/30 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 hover:bg-muted rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            {getGreeting()}, {session?.user?.name?.split(' ')[0] || 'User'} 👋
          </h2>
          <p className="text-sm text-muted-foreground hidden sm:block">
            Here's what's happening with your job search today.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search applications..." 
            className="pl-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              setIsNotifOpen(true);
              setHasUnread(false);
            }}
            className="relative hover:bg-primary/10 hover:text-primary rounded-xl transition-all"
          >
            <Bell className="w-5 h-5" />
            {hasUnread && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background animate-pulse" />
            )}
          </Button>

          <NotificationDrawer 
            isOpen={isNotifOpen} 
            onClose={() => setIsNotifOpen(false)} 
          />

          <div className="h-8 w-px bg-border/50 mx-2" />

          <Avatar className="h-10 w-10 border border-primary/20 shadow-lg shadow-primary/5 cursor-pointer hover:scale-105 transition-transform">
            <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {session?.user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
