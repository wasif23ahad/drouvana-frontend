"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Rocket, User, LogOut, LayoutDashboard, 
  Briefcase, Sparkles, BookOpen, Mail, HelpCircle, 
  Info, Settings, Bell 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession, signOut } from 'next-auth/react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const publicLinks = [
    { name: 'About', href: '/about', icon: Info },
    { name: 'Blog', href: '/blog', icon: BookOpen },
    { name: 'Contact', href: '/contact', icon: Mail },
    { name: 'Help', href: '/help', icon: HelpCircle },
  ];

  const privateLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Workspace', href: '/dashboard/workspace', icon: Sparkles },
    { name: 'Assistant', href: '/dashboard/assistant', icon: User },
    { name: 'Tracker', href: '/dashboard/tracker', icon: Briefcase },
  ];

  const currentLinks = session ? privateLinks : publicLinks;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'py-2' : 'py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className={`glass rounded-2xl px-6 py-3 flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'bg-background/80 shadow-lg' : 'bg-background/40'
        }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <Rocket className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight hidden sm:block italic">
              Drouvana<span className="text-primary text-4xl leading-none">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {currentLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-sm font-bold uppercase tracking-widest transition-all hover:text-primary relative group/link ${
                  pathname === link.href ? 'text-primary' : 'text-foreground/60'
                }`}
              >
                {link.name}
                <div className={`absolute -bottom-1 left-0 h-0.5 bg-primary rounded-full transition-all duration-300 ${
                  pathname === link.href ? 'w-full' : 'w-0 group-hover/link:w-full'
                }`} />
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-primary/10 rounded-xl transition-colors relative hidden sm:block">
                  <Bell className="w-5 h-5 text-foreground/60" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary transition-colors">
                      <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {session.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 glass p-2 rounded-2xl mt-2" align="end">
                    <DropdownMenuLabel className="p-3">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold leading-none">{session.user?.name}</p>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{session.user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem onClick={() => router.push('/profile')} className="rounded-xl p-3 focus:bg-primary/10 group cursor-pointer">
                      <User className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="font-bold text-xs uppercase tracking-widest">Profile Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="rounded-xl p-3 focus:bg-primary/10 group cursor-pointer">
                      <Settings className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="font-bold text-xs uppercase tracking-widest">System Preferences</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem onClick={() => signOut()} className="rounded-xl p-3 text-destructive focus:bg-destructive/10 group cursor-pointer">
                      <LogOut className="mr-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      <span className="font-bold text-xs uppercase tracking-widest">Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" className="rounded-xl font-bold uppercase tracking-widest text-xs">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 hover:bg-primary/10 rounded-xl transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="md:hidden fixed inset-0 top-[72px] bg-background/95 backdrop-blur-xl z-40 p-6 flex flex-col gap-4"
          >
            {currentLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  pathname === link.href ? 'bg-primary text-white shadow-xl shadow-primary/20' : 'hover:bg-primary/10'
                }`}
              >
                <link.icon className="w-5 h-5" />
                <span className="font-bold uppercase tracking-widest">{link.name}</span>
              </Link>
            ))}
            {!session && (
              <div className="flex flex-col gap-3 mt-auto mb-10">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest">Login</Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full h-14 rounded-2xl bg-primary text-white font-bold uppercase tracking-widest">Get Started</Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
