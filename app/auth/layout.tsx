import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign in — Halal Invest Ed',
  description: 'Create an account or log in to track your progress and join a class.',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
