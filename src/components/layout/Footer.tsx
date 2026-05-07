import React from 'react';
import Link from 'next/link';
import { Rocket, X, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <Rocket className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold">Drouvana</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Elevate your career with AI-powered resume intelligence and real-time application tracking.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/templates" className="text-sm text-muted-foreground hover:text-primary transition-colors">Resume Templates</Link></li>
              <li><Link href="/tracker" className="text-sm text-muted-foreground hover:text-primary transition-colors">Job Tracker</Link></li>
              <li><Link href="/ai-builder" className="text-sm text-muted-foreground hover:text-primary transition-colors">AI Builder</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2">
              <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Career Blog</Link></li>
              <li><Link href="/guides" className="text-sm text-muted-foreground hover:text-primary transition-colors">Resume Guides</Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">Help Center</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-muted rounded-lg hover:bg-primary/10 hover:text-primary transition-all">
                <X className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-muted rounded-lg hover:bg-primary/10 hover:text-primary transition-all">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-muted rounded-lg hover:bg-primary/10 hover:text-primary transition-all">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Drouvana. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
