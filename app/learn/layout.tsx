import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lessons — Halal Invest Ed',
  description:
    'Five lessons covering Islamic finance principles, halal screening, and portfolio building — designed for ages 12 and up.',
};

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
