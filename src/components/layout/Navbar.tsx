"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, User, LogOut, LayoutDashboard, 
  Sparkles, Bell, Settings, Briefcase, ChevronRight 
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

import { ThemeToggle } from '@/components/shared/ThemeToggle';

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
    { name: 'Features', href: '/#features' },
    { name: 'How it Works', href: '/#how-it-works' },
    { name: 'Testimonials', href: '/#testimonials' },
    { name: 'Pricing', href: '/#pricing' },
  ];

  const privateLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Applications', href: '/dashboard/tracker' },
    { name: 'Templates', href: '/templates' },
    { name: 'Assistant', href: '/dashboard/assistant' },
    { name: 'Settings', href: '/dashboard/settings' },
    { name: 'Resources', href: '/templates' },
  ];

  const currentLinks = session ? privateLinks : publicLinks;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-bg-base/80 backdrop-blur-md border-b border-border-color' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/Drouvana_logo.png" alt="Drouvana" width={30} height={30} className="rounded-lg" />
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-text-primary to-text-secondary font-hanken">Drouvana</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {currentLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? 'text-primary' : 'text-text-sub'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Action Section */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {status === 'loading' ? (
            <div className="w-8 h-8 rounded-full bg-surface-2 animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-4">
              <button className="text-primary hover:opacity-80 transition-opacity">
                <Bell className="w-5 h-5" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="h-9 w-9 border border-primary/20 hover:border-primary/50 transition-colors">
                    <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {session.user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 glass-card p-2 rounded-xl mt-2 border-[var(--color-border-subtle)]" align="end">
                  <DropdownMenuLabel className="p-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold text-text-main">{session.user?.name}</p>
                      <p className="text-[10px] font-jetbrains uppercase tracking-widest text-text-muted">{session.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem onClick={() => router.push('/dashboard')} className="rounded-lg p-3 focus:bg-primary/10 cursor-pointer">
                    <LayoutDashboard className="mr-3 h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest font-jetbrains">Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/resume')} className="rounded-lg p-3 focus:bg-primary/10 cursor-pointer">
                    <User className="mr-3 h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest font-jetbrains">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="rounded-lg p-3 focus:bg-primary/10 cursor-pointer">
                    <Settings className="mr-3 h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest font-jetbrains">Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem onClick={() => signOut()} className="rounded-lg p-3 text-error focus:bg-error/10 cursor-pointer">
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-widest font-jetbrains">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login?switch=true">
                <Button variant="ghost" className="hidden sm:inline-flex text-sm font-medium hover:text-primary transition-colors h-9">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="rounded-full px-6 h-10 text-sm font-medium">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-primary p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 right-0 bg-bg-base/95 backdrop-blur-xl border-b border-border-color p-6 flex flex-col gap-4"
          >
            {currentLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-bold font-hanken transition-all ${
                  pathname === link.href ? 'text-primary' : 'text-text-sub'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {!session && (
              <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                <Link href="/login?switch=true" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full h-12 rounded-full font-bold uppercase tracking-widest text-xs border-primary text-primary">Login</Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full h-12 rounded-full font-bold uppercase tracking-widest text-xs border-none">Get Started</Button>
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
