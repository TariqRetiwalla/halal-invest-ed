import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { withTeacher } from '@/lib/withAuth';

export const PATCH = withTeacher(async (req: NextRequest, { user, params }) => {
  try {
    const lessonNumber = Number(params?.id);
    if (!Number.isInteger(lessonNumber) || lessonNumber < 1 || lessonNumber > 5) {
      return NextResponse.json({ error: 'Lesson number must be between 1 and 5' }, { status: 400 });
    }

    const classData = await prisma.class.findUnique({ where: { teacherId: user.sub } });

    if (!classData) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 });
    }

    await prisma.classLessonLock.upsert({
      where: { classId_lessonNumber: { classId: classData.id, lessonNumber } },
      update: { isLocked: false },
      create: { classId: classData.id, lessonNumber, isLocked: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') console.error('[PATCH /api/teacher/lessons/:id/unlock]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
