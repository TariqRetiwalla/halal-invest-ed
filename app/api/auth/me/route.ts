import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import { JwtPayload } from '@/lib/auth';

export const GET = withAuth(async (_req: NextRequest, { user }: { user: JwtPayload }) => {
  return NextResponse.json({
    user: {
      id: user.sub,
      username: user.username,
      role: user.role,
      ageRange: user.ageRange ?? null,
    },
  });
});
