"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Rocket, 
  LayoutDashboard 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import axios from 'axios';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

const NotificationDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error(error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'WARNING': return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'AI': return <Rocket className="w-5 h-5 text-primary" />;
      default: return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-border/50 shadow-2xl z-50 flex flex-col"
          >
            <div className="p-6 border-b border-border/50 flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bell className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Notifications</h3>
                  <p className="text-xs text-muted-foreground">Stay updated with your search</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50">
                  <LayoutDashboard className="w-12 h-12" />
                  <p className="text-sm font-medium">No notifications yet</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n.id}
                    onClick={() => !n.read && markAsRead(n.id)}
                    className={cn(
                      "p-5 rounded-3xl border transition-all cursor-pointer group relative overflow-hidden",
                      n.read ? "bg-muted/10 border-border/50 opacity-60" : "bg-primary/5 border-primary/20 hover:bg-primary/10 shadow-lg shadow-primary/5"
                    )}
                  >
                    {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                    <div className="flex gap-4">
                      <div className="mt-1">{getIcon(n.type)}</div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm">{n.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                        <p className="text-[10px] font-medium text-muted-foreground pt-2">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-border/50">
              <Button variant="outline" className="w-full rounded-2xl h-12 font-bold" onClick={onClose}>
                Close
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationDrawer;
