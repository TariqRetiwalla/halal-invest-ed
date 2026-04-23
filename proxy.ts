import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from './lib/auth';

export function proxy(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

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
