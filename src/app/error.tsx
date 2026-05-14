'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-8 font-sans">
        <div className="space-y-6 max-w-md">
          <div className="font-mono text-8xl font-black text-error opacity-20 select-none">500</div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-on-surface">Something went wrong</h1>
            <p className="text-on-surface-variant text-sm">An unexpected error occurred. Try refreshing the page.</p>
            {error?.digest && (
              <p className="text-[10px] font-mono text-on-surface-variant opacity-50">digest: {error.digest}</p>
            )}
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={reset}
              className="bg-primary text-on-primary px-6 py-3 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              Try again
            </button>
            <Link href="/dashboard" className="border border-white/10 text-on-surface-variant px-6 py-3 rounded-xl text-sm font-bold hover:text-on-surface transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
