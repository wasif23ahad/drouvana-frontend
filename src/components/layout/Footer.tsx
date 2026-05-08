import React from 'react';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full glass-card py-12 border-t border-[#334155] mt-auto relative z-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold font-hanken">Drouvana</span>
            </div>
            <p className="text-text-sub max-w-xs mb-6">
              The ultimate AI-powered workspace for modern job seekers.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-text-main font-hanken">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/dashboard/tracker" className="text-sm text-text-sub hover:text-primary transition-colors">Job Tracker</Link></li>
              <li><Link href="/dashboard/resume" className="text-sm text-text-sub hover:text-primary transition-colors">Resume Builder</Link></li>
              <li><Link href="/dashboard/assistant" className="text-sm text-text-sub hover:text-primary transition-colors">AI Assistant</Link></li>
              <li><Link href="/pricing" className="text-sm text-text-sub hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-text-main font-hanken">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-sm text-text-sub hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/help" className="text-sm text-text-sub hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-sm text-text-sub hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-text-main font-hanken">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-text-sub hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-text-sub hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[var(--color-border-subtle)] pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-text-muted gap-4">
          <p>© 2026 Drouvana. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-text-main transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-text-main transition-colors">LinkedIn</Link>
            <Link href="#" className="hover:text-text-main transition-colors">GitHub</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
