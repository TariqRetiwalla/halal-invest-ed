import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { signToken, setAuthCookie } from '@/lib/auth';

// In-memory rate limiter: IP → { count, resetAt }
const failedAttempts = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = failedAttempts.get(ip);

  if (!record || record.resetAt < now) {
    return false; // Not rate limited
  }

  return record.count >= RATE_LIMIT_MAX;
}

function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const record = failedAttempts.get(ip);

  if (!record || record.resetAt < now) {
    failedAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  } else {
    record.count++;
  }
}

function clearFailedAttempts(ip: string): void {
  failedAttempts.delete(ip);
}

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, 'Username or email is required'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      req.headers.get('x-real-ip') ??
      '127.0.0.1';

    // Check rate limit
    if (checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many failed attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 }
      );
    }

    const { usernameOrEmail, password } = parsed.data;

    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
      select: {
        id: true,
        username: true,
        email: true,
        passwordHash: true,
        role: true,
        ageRange: true,
      },
    });

    if (!user) {
      recordFailedAttempt(ip);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
      recordFailedAttempt(ip);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Clear failed attempts on success
    clearFailedAttempts(ip);

    // Issue JWT and set cookie
    const token = signToken({
      sub: user.id,
      username: user.username,
      role: user.role,
      ageRange: user.ageRange ?? null,
    });

    const userPayload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    const res = NextResponse.json({ user: userPayload }, { status: 200 });
    setAuthCookie(res, token);
    return res;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[login]', error);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
