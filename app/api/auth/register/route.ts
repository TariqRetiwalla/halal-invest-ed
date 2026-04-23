import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { signToken, setAuthCookie } from '@/lib/auth';

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  ageRange: z.enum(['UNDER_13', 'AGE_13_17', 'AGE_18_PLUS']),
  classCode: z.string().optional(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }

    const { username, email, password, ageRange } = parsed.data;
    // Normalise: trim and uppercase so "abc123" and "ABC123" both match
    const classCode = parsed.data.classCode?.trim().toUpperCase() || undefined;

    // Best-effort uniqueness check — gives specific error messages
    // P2002 below is the authoritative guard for the TOCTOU race
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] },
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    // Resolve classCode if provided
    let classRecord: { id: string } | null = null;
    if (classCode) {
      classRecord = await prisma.class.findUnique({
        where: { classCode },
        select: { id: true },
      });
      if (!classRecord) {
        return NextResponse.json({ error: 'Invalid class code' }, { status: 400 });
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Create user + membership + locks atomically
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { username, email, passwordHash, ageRange, role: 'STUDENT' },
        select: { id: true, username: true, role: true, ageRange: true },
      });

      if (classRecord) {
        await tx.classMembership.create({
          data: { classId: classRecord.id, studentId: newUser.id },
        });
        await tx.classLessonLock.createMany({
          data: [1, 2, 3, 4, 5].map((lessonNumber) => ({
            classId: classRecord!.id,
            lessonNumber,
            isLocked: lessonNumber !== 1,
          })),
          skipDuplicates: true,
        });
      }

      return newUser;
    });

    const token = signToken({
      sub: user.id,
      username: user.username,
      role: user.role,
      ageRange: user.ageRange ?? null,
    });

    const res = NextResponse.json({ user }, { status: 201 });
    setAuthCookie(res, token);
    return res;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'Username or email already taken' }, { status: 409 });
    }
    if (process.env.NODE_ENV === 'development') {
      console.error('[register]', error);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
