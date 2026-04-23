import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from './lib/auth';

// This proxy runs on matched routes. Protected pages can be added here.
// API route auth is handled per-route via withAuth().
export function proxy(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  // Protect /account routes at the proxy level
  if (pathname.startsWith('/account')) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const user = token ? verifyToken(token) : null;

    if (!user) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = '/auth/login';
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*'],
};
