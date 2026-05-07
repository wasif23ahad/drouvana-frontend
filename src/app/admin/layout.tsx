import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Users, 
  FileCode, 
  BarChart3, 
  Settings,
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';

const adminLinks = [
  { name: 'Analytics', href: '/admin', icon: BarChart3 },
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'Resume Templates', href: '/admin/templates', icon: FileCode },
  { name: 'System Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-white font-sans">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-slate-900/50 flex flex-col h-screen fixed left-0 top-0 z-50">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-10 text-primary">
            <ShieldCheck className="w-8 h-8" />
            <span className="text-xl font-bold tracking-tighter text-white">ADMIN PANEL</span>
          </div>

          <nav className="space-y-2">
            {adminLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:bg-white/5 text-slate-400 hover:text-white"
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/10">
          <Link 
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Exit Admin
          </Link>
        </div>
      </aside>

      <div className="flex-1 ml-64 min-h-screen">
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-10">
          <h2 className="font-bold text-lg">Control Center</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM ONLINE
            </div>
          </div>
        </header>
        <main className="p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
