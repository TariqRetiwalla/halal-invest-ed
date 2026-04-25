import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withAuth } from '@/lib/withAuth';

export const GET = withAuth(async (req: NextRequest, { user }) => {
  try {
    let classId: string | null = null;

    if (user.role === 'TEACHER') {
      const classData = await prisma.class.findUnique({ where: { teacherId: user.sub } });
      classId = classData?.id ?? null;
    } else {
      const membership = await prisma.classMembership.findUnique({ where: { studentId: user.sub } });
      classId = membership?.classId ?? null;
    }

    if (!classId) {
      return NextResponse.json({ leaderboard: [] });
    }

    const memberships = await prisma.classMembership.findMany({
      where: { classId },
      include: {
        student: {
          select: {
            id: true,
            username: true,
            simulatorSessions: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              select: { cashBalance: true },
            },
          },
        },
      },
    });

    const sorted = memberships
      .map(({ student }) => ({
        username: student.username,
        cashBalance: student.simulatorSessions[0]?.cashBalance ?? null,
      }))
      .sort((a, b) => {
        if (a.cashBalance === null && b.cashBalance === null) return 0;
        if (a.cashBalance === null) return 1;
        if (b.cashBalance === null) return -1;
        return b.cashBalance - a.cashBalance;
      });

    const leaderboard = sorted.map((entry, index) => ({
      rank: index + 1,
      username: entry.username,
      cashBalance: entry.cashBalance,
    }));

    return NextResponse.json({ leaderboard });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('[GET /api/class/leaderboard]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
