import React from 'react';
import Link from 'next/link';
import { Rocket, Mail, Globe, Send, Share } from 'lucide-react';

const FOOTER_LINKS = [
  {
    title: 'Product',
    links: [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Workspace', href: '/dashboard/workspace' },
      { name: 'Templates', href: '/templates' },
      { name: 'Pricing', href: '/pricing' },
    ]
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' },
    ]
  },
  {
    title: 'Resources',
    links: [
      { name: 'Help Center', href: '/help' },
      { name: 'Documentation', href: '/docs' },
      { name: 'Community', href: '/community' },
      { name: 'Status', href: '/status' },
    ]
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'GDPR', href: '/gdpr' },
    ]
  }
];

export default function Footer() {
  return (
    <footer className="bg-background border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-4 space-y-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12">
          {/* Logo & Intro */}
          <div className="col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                <Rocket className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight italic">
                Drouvana<span className="text-primary text-4xl leading-none">.</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The world's first agentic career platform designed to help professionals navigate the modern hiring landscape with intelligence and ease.
            </p>
            <div className="flex gap-4">
              {[Send, Share, Mail, Globe].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all border border-white/5 hover:border-primary/50">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {FOOTER_LINKS.map((section, i) => (
            <div key={i} className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-muted-foreground font-medium">
            © 2026 Drouvana AI. All rights reserved. Built with ❤️ in Silicon Valley.
          </p>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              System Status: All Operational
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <Globe className="w-4 h-4" />
              English (US)
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
