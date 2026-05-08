"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, User, LogOut, LayoutDashboard, 
  Sparkles, Bell, Settings 
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
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
    { name: 'Blog', href: '#blog' },
  ];

  const privateLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Templates', href: '/templates' },
    { name: 'Tracker', href: '/dashboard/tracker' },
    { name: 'Assistant', href: '/dashboard/assistant' },
  ];

  const currentLinks = session ? privateLinks : publicLinks;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-surface/80 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
    }`}>
      <div className="max-w-spacing-container-max mx-auto px-spacing-margin-desktop py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/" className="text-xl font-heading font-bold text-primary">
            Drouvana
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {currentLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-sm font-sans font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Action Section */}
        <div className="flex items-center gap-4">
          {status === 'loading' ? (
            <div className="w-8 h-8 rounded-full bg-surface-container animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-4">
              <button className="text-primary hover:opacity-80 transition-opacity">
                <Bell className="w-5 h-5" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="h-9 w-9 border border-primary/20">
                    <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                    <AvatarFallback className="bg-primary-container/20 text-primary text-xs font-bold">
                      {session.user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 glass p-2 rounded-xl mt-2" align="end">
                  <DropdownMenuLabel className="p-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold text-on-surface">{session.user?.name}</p>
                      <p className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">{session.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem onClick={() => router.push('/dashboard')} className="rounded-lg p-3 focus:bg-primary/10 cursor-pointer">
                    <LayoutDashboard className="mr-3 h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/profile')} className="rounded-lg p-3 focus:bg-primary/10 cursor-pointer">
                    <User className="mr-3 h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest">Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="rounded-lg p-3 focus:bg-primary/10 cursor-pointer">
                    <Settings className="mr-3 h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-widest">Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/5" />
                  <DropdownMenuItem onClick={() => signOut()} className="rounded-lg p-3 text-error focus:bg-error/10 cursor-pointer">
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden md:block text-sm font-sans font-medium text-on-surface-variant hover:text-primary transition-colors">
                Sign In
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-primary text-white px-6 py-2 rounded-xl text-sm font-sans font-medium hover:opacity-90 transition-opacity h-10 border-none">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-primary"
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
            className="md:hidden absolute top-full left-0 right-0 bg-surface-container/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-4"
          >
            {currentLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-lg font-bold italic transition-all ${
                  pathname === link.href ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {!session && (
              <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-xs border-primary text-primary">Login</Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full h-12 rounded-xl bg-gradient-primary text-white font-bold uppercase tracking-widest text-xs border-none">Get Started</Button>
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
