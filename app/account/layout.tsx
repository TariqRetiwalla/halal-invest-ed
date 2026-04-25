import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Account — Halal Invest Ed',
  description: 'View your lesson progress, quiz scores, and class leaderboard.',
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
