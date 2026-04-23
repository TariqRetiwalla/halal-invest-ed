import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/withAuth';
import { getPublicCompanies } from '@/lib/simulatorData';

export const GET = withAuth(async (_req: NextRequest) => {
  return NextResponse.json({ companies: getPublicCompanies() });
});
