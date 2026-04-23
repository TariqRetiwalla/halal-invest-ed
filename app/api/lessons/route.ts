import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/withAuth';
import { LESSONS } from '@/lib/lessonData';

export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    const userId = user.sub;

    const [completedRows, quizAttempts, membership] = await Promise.all([
      prisma.lessonProgress.findMany({ where: { userId } }),
      prisma.quizAttempt.findMany({ where: { userId } }),
      prisma.classMembership.findUnique({ where: { studentId: userId } }),
    ]);

    const completedNumbers = new Set(completedRows.map((r) => r.lessonNumber));

    const latestScoreByLesson = new Map<number, number>();
    for (const attempt of quizAttempts) {
      const existing = latestScoreByLesson.get(attempt.lessonNumber);
      if (existing === undefined || attempt.score > existing) {
        latestScoreByLesson.set(attempt.lessonNumber, attempt.score);
      }
    }

    let lockMap: Map<number, boolean> | null = null;
    if (membership) {
      const locks = await prisma.classLessonLock.findMany({
        where: { classId: membership.classId },
      });
      lockMap = new Map(locks.map((l) => [l.lessonNumber, l.isLocked]));
    }

    const lessons = LESSONS.map((lesson) => {
      const prevCompleted = lesson.number === 1 || completedNumbers.has(lesson.number - 1);

      let accessible = prevCompleted;

      if (lockMap !== null) {
        // For club students, a lesson must also be unlocked by the teacher.
        // Absent a lock row defaults to locked (isLocked: true is the schema default).
        const isLocked = lockMap.get(lesson.number) ?? true;
        accessible = prevCompleted && !isLocked;
      }

      return {
        number: lesson.number,
        title: lesson.title,
        accessible,
        completed: completedNumbers.has(lesson.number),
        quizScore: latestScoreByLesson.get(lesson.number) ?? null,
      };
    });

    return NextResponse.json({ lessons });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('[GET /api/lessons]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
