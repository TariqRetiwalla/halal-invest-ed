import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found — Halal Invest Ed',
};

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-extrabold text-[#c9a84c] mb-4">404</p>
        <h1 className="text-2xl font-bold text-[#e8eeff] mb-3">Page not found</h1>
        <p className="text-sm text-[#8aabcc] mb-8 max-w-xs mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-[#c9a84c] px-6 py-3 text-sm font-semibold text-[#0f1f3d] hover:bg-[#b5923a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
