import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/withAuth';

export const POST = withAuth(async (req: NextRequest, { user, params }) => {
  try {
    const lessonNumber = Number(params?.id);
    if (!Number.isInteger(lessonNumber) || lessonNumber < 1 || lessonNumber > 5) {
      return NextResponse.json({ error: 'Lesson number must be between 1 and 5' }, { status: 400 });
    }

    const userId = user.sub;

    const [completedRows, membership] = await Promise.all([
      prisma.lessonProgress.findMany({ where: { userId } }),
      prisma.classMembership.findUnique({ where: { studentId: userId } }),
    ]);

    const completedNumbers = new Set(completedRows.map((r) => r.lessonNumber));
    const prevCompleted = lessonNumber === 1 || completedNumbers.has(lessonNumber - 1);

    let accessible = prevCompleted;

    if (membership) {
      const lockRow = await prisma.classLessonLock.findUnique({
        where: { classId_lessonNumber: { classId: membership.classId, lessonNumber } },
      });
      // Absent a lock row defaults to locked (isLocked: true is the schema default).
      const isLocked = lockRow?.isLocked ?? true;
      accessible = prevCompleted && !isLocked;
    }

    if (!accessible) {
      return NextResponse.json({ error: 'Lesson is not accessible' }, { status: 403 });
    }

    await prisma.lessonProgress.upsert({
      where: { userId_lessonNumber: { userId, lessonNumber } },
      create: { userId, lessonNumber },
      update: {},
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('[POST /api/lessons/:id/complete]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
