import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Simulator — Halal Invest Ed',
  description:
    'Practice evaluating companies against Islamic finance criteria in a safe simulation with no real money.',
};

export default function PlayLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
