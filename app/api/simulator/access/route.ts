import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/withAuth';

export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    const userId = user.sub;
    const totalLessons = 5;

    const completedRows = await prisma.lessonProgress.findMany({ where: { userId } });
    const lessonsComplete = completedRows.length;

    if (lessonsComplete === totalLessons) {
      return NextResponse.json({ accessible: true, lessonsComplete, totalLessons });
    }

    const membership = await prisma.classMembership.findUnique({ where: { studentId: userId } });

    if (membership) {
      const cls = await prisma.class.findUnique({ where: { id: membership.classId } });
      if (cls?.simulatorUnlocked) {
        return NextResponse.json({ accessible: true, lessonsComplete, totalLessons });
      }
    }

    return NextResponse.json({
      accessible: false,
      lessonsComplete,
      totalLessons,
      reason: 'lessons_incomplete',
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('[GET /api/simulator/access]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
