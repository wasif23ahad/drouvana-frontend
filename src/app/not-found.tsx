import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-8">
      <div className="space-y-6 max-w-md">
        <div className="font-mono text-8xl font-black text-primary opacity-20 select-none">404</div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-heading text-on-surface">Page not found</h1>
          <p className="text-on-surface-variant text-sm">The page you're looking for doesn't exist or has been moved.</p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
