"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Rocket, User, LogOut, LayoutDashboard, Briefcase, FileText } from 'lucide-react';
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
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Templates', href: '/templates', icon: FileText },
    { name: 'Tracker', href: '/tracker', icon: Briefcase },
  ];

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
            <span className="text-2xl font-bold tracking-tight hidden sm:block">
              Drouvana<span className="text-primary text-4xl">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary relative ${
                  pathname === link.href ? 'text-primary' : 'text-foreground/70'
                }`}
              >
                {link.name}
                {pathname === link.href && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="relative h-10 w-10 rounded-full hover:bg-primary/10 transition-colors flex items-center justify-center">
                    <Avatar className="h-10 w-10 border border-primary/20">
                      <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {session.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link 
                  href="/login"
                  className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-white rounded-lg shadow-lg shadow-primary/20 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors"
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-20 left-4 right-4 z-40"
          >
            <div className="glass rounded-2xl p-6 flex flex-col gap-4 shadow-2xl">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    pathname === link.href ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              ))}
              {!session && (
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/50">
                  <Link 
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium border border-border/50 hover:bg-muted rounded-lg transition-colors"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-white rounded-lg transition-all"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
