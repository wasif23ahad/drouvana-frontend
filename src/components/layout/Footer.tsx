import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-white/5 py-12">
      <div className="max-w-spacing-container-max mx-auto px-spacing-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-spacing-gutter">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-xl font-heading font-bold text-primary">
              Drouvana
            </Link>
            <p className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
              © 2026 Drouvana AI. Accelerating Careers.
            </p>
          </div>

          {/* Links Column 1 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Legal</h4>
            <Link className="text-sm font-sans text-on-surface-variant hover:text-secondary transition-colors" href="#">Privacy Policy</Link>
            <Link className="text-sm font-sans text-on-surface-variant hover:text-secondary transition-colors" href="#">Terms of Service</Link>
            <Link className="text-sm font-sans text-on-surface-variant hover:text-secondary transition-colors" href="#">Cookie Policy</Link>
          </div>

          {/* Links Column 2 */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-2">Support</h4>
            <Link className="text-sm font-sans text-on-surface-variant hover:text-secondary transition-colors" href="#">Help Center</Link>
            <Link className="text-sm font-sans text-on-surface-variant hover:text-secondary transition-colors" href="#">Documentation</Link>
            <Link className="text-sm font-sans text-on-surface-variant hover:text-secondary transition-colors" href="#">System Status</Link>
          </div>

          {/* Spacer for 4-column grid as per design */}
          <div className="hidden md:block"></div>
        </div>
      </div>
    </footer>
  );
}
