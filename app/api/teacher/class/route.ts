import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTeacher } from '@/lib/withAuth';

export const GET = withTeacher(async (req: NextRequest, { user }) => {
  try {
    const classData = await prisma.class.findUnique({
      where: { teacherId: user.sub },
      include: {
        lessonLocks: true,
        memberships: {
          include: {
            student: {
              select: {
                id: true,
                username: true,
                lessonProgress: true,
                quizAttempts: true,
                simulatorSessions: {
                  orderBy: { createdAt: 'desc' },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!classData) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    const students = classData.memberships.map(({ student }) => {
      const bestScoreByLesson = new Map<number, number>();
      for (const attempt of student.quizAttempts) {
        const existing = bestScoreByLesson.get(attempt.lessonNumber);
        if (existing === undefined || attempt.score > existing) {
          bestScoreByLesson.set(attempt.lessonNumber, attempt.score);
        }
      }

      const latestSession = student.simulatorSessions[0] ?? null;

      return {
        id: student.id,
        username: student.username,
        lessonsCompleted: student.lessonProgress.length,
        quizScores: Array.from(bestScoreByLesson.entries()).map(([lessonNumber, score]) => ({
          lessonNumber,
          score,
        })),
        latestCash: latestSession?.cashBalance ?? null,
      };
    });

    return NextResponse.json({
      class: {
        id: classData.id,
        classCode: classData.classCode,
        name: classData.name,
        simulatorUnlocked: classData.simulatorUnlocked,
      },
      lessonLocks: classData.lessonLocks.map(({ lessonNumber, isLocked }) => ({
        lessonNumber,
        isLocked,
      })),
      students,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('[GET /api/teacher/class]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
