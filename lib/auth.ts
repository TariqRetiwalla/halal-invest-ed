import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET as string;
const COOKIE_NAME = 'auth-token';

export interface JwtPayload {
  sub: string;
  username: string;
  role: 'STUDENT' | 'TEACHER';
  ageRange?: 'UNDER_13' | 'AGE_13_17' | 'AGE_18_PLUS' | null;
  iat: number;
  exp: number;
}

export function signToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  const now = Date.now();
  const fullPayload: JwtPayload = {
    ...payload,
    iat: now,
    exp: now + 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  };
  // jsonwebtoken expects iat/exp in seconds — but we follow the spec from agent instructions
  // which uses ms. We use sign with no automatic exp to keep our custom payload intact.
  return jwt.sign(fullPayload, JWT_SECRET, { algorithm: 'HS256' });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    }) as JwtPayload;

    // Check expiry manually since exp is stored in ms (per agent instructions)
    if (decoded.exp < Date.now()) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

export function setAuthCookie(res: NextResponse, token: string): void {
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: '/',
  });
}

export function clearAuthCookie(res: NextResponse): void {
  res.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
}

export { COOKIE_NAME };
