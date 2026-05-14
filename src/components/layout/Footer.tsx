import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone } from 'lucide-react';

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);


export default function Footer() {
  return (
    <footer className="w-full glass-card py-12 border-t border-[var(--color-border-subtle)] mt-auto relative z-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image src="/Drouvana_logo.png" alt="Drouvana" width={28} height={28} className="rounded-lg" />
              <span className="text-xl font-bold font-hanken">Drouvana</span>
            </div>
            <p className="text-text-sub max-w-xs mb-6 text-sm leading-relaxed">
              The ultimate AI-powered workspace for modern job seekers. Land faster, smarter.
            </p>
            {/* Contact Info */}
            <div className="space-y-2">
              <a href="mailto:support@drouvana.ai" className="flex items-center gap-2 text-sm text-text-sub hover:text-primary transition-colors">
                <Mail className="w-4 h-4 shrink-0" /> support@drouvana.ai
              </a>
              <div className="flex items-center gap-2 text-sm text-text-sub">
                <MapPin className="w-4 h-4 shrink-0" /> Silicon Valley, CA
              </div>
              <a href="tel:+14155552671" className="flex items-center gap-2 text-sm text-text-sub hover:text-primary transition-colors">
                <Phone className="w-4 h-4 shrink-0" /> +1 (415) 555-2671
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4 text-text-main font-hanken">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/dashboard/tracker" className="text-sm text-text-sub hover:text-primary transition-colors">Job Tracker</Link></li>
              <li><Link href="/dashboard/resume" className="text-sm text-text-sub hover:text-primary transition-colors">Resume Builder</Link></li>
              <li><Link href="/dashboard/assistant" className="text-sm text-text-sub hover:text-primary transition-colors">AI Assistant</Link></li>
              <li><Link href="/pricing" className="text-sm text-text-sub hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/templates" className="text-sm text-text-sub hover:text-primary transition-colors">Templates</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-text-main font-hanken">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-text-sub hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="text-sm text-text-sub hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-sm text-text-sub hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-text-main font-hanken">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-sm text-text-sub hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link href="/templates" className="text-sm text-text-sub hover:text-primary transition-colors">Explore Templates</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-text-main font-hanken">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy-terms" className="text-sm text-text-sub hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/privacy-terms" className="text-sm text-text-sub hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border-subtle pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-text-muted gap-4">
          <p>© 2026 Drouvana Inc. All rights reserved.</p>
          {/* Social Links */}
          <div className="flex gap-5">
            <a href="https://twitter.com/drouvana_ai" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="Twitter">
              <TwitterIcon />
            </a>
            <a href="https://linkedin.com/company/drouvana" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="LinkedIn">
              <LinkedinIcon />
            </a>
            <a href="https://github.com/drouvana-ai" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors" aria-label="GitHub">
              <GithubIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
