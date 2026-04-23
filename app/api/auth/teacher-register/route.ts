import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { signToken, setAuthCookie } from '@/lib/auth';

const teacherRegisterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  schoolName: z.string().min(1, 'School/club name is required').max(200),
});

function generateClassCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

async function generateUniqueClassCode(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateClassCode();
    const existing = await prisma.class.findUnique({
      where: { classCode: code },
      select: { id: true },
    });
    if (!existing) {
      return code;
    }
  }
  throw new Error('Failed to generate unique class code after 10 attempts');
}

function deriveUsername(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 30);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const parsed = teacherRegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }

    const { name, email, password, schoolName } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    // Derive unique username
    let baseUsername = deriveUsername(name);
    if (!baseUsername || baseUsername.length < 3) {
      baseUsername = 'teacher';
    }

    let username = baseUsername;
    let attempt = 0;
    while (true) {
      const existing = await prisma.user.findUnique({ where: { username }, select: { id: true } });
      if (!existing) break;
      attempt++;
      username = `${baseUsername}${attempt}`;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const classCode = await generateUniqueClassCode();

    // Create teacher + class + locks atomically
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { username, email, passwordHash, role: 'TEACHER' },
        select: { id: true, username: true, role: true },
      });

      const newClass = await tx.class.create({
        data: { teacherId: newUser.id, classCode, name: schoolName },
        select: { id: true },
      });

      await tx.classLessonLock.createMany({
        data: [1, 2, 3, 4, 5].map((lessonNumber) => ({
          classId: newClass.id,
          lessonNumber,
          isLocked: lessonNumber !== 1,
        })),
      });

      return newUser;
    });

    const token = signToken({
      sub: user.id,
      username: user.username,
      role: user.role,
      ageRange: null,
    });

    const res = NextResponse.json({ user, classCode }, { status: 201 });
    setAuthCookie(res, token);
    return res;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    if (process.env.NODE_ENV === 'development') {
      console.error('[teacher-register]', error);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
