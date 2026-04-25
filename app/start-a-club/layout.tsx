import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Start a Club — Halal Invest Ed',
  description:
    'Everything you need to run a halal investing club session — session guides, printable ground rules, and teacher registration.',
};

export default function StartAClubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
