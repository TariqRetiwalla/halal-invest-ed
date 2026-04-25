import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTeacher } from '@/lib/withAuth';

export const PATCH = withTeacher(async (req: NextRequest, { user }) => {
  try {
    const classData = await prisma.class.findUnique({ where: { teacherId: user.sub } });

    if (!classData) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    await prisma.class.update({
      where: { id: classData.id },
      data: { simulatorUnlocked: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('[PATCH /api/teacher/simulator/unlock]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
