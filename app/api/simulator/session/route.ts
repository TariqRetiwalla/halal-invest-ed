import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/withAuth';

export const POST = withAuth(async (req: NextRequest, { user }) => {
  try {
    const userId = user.sub;
    const totalLessons = 5;

    const completedRows = await prisma.lessonProgress.findMany({ where: { userId } });
    const lessonsComplete = completedRows.length;

    let accessible = lessonsComplete === totalLessons;

    if (!accessible) {
      const membership = await prisma.classMembership.findUnique({ where: { studentId: userId } });
      if (membership) {
        const cls = await prisma.class.findUnique({ where: { id: membership.classId } });
        if (cls?.simulatorUnlocked) {
          accessible = true;
        }
      }
    }

    if (!accessible) {
      return NextResponse.json({ error: 'Simulator not yet unlocked' }, { status: 403 });
    }

    return NextResponse.json({ sessionId: crypto.randomUUID(), startingCash: 500 });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('[POST /api/simulator/session]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
