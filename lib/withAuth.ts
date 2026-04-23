import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME, JwtPayload } from './auth';

// Next.js 16 App Router: context.params is a Promise
type RouteContext = {
  params?: Promise<Record<string, string>>;
};

type AuthenticatedHandler = (
  req: NextRequest,
  context: { user: JwtPayload; params?: Record<string, string> }
) => Promise<NextResponse> | NextResponse;

export function withAuth(handler: AuthenticatedHandler) {
  return async (
    req: NextRequest,
    context?: RouteContext
  ): Promise<NextResponse> => {
    const token = req.cookies.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }

    // Await params if it's a Promise (Next.js 16)
    const params = context?.params ? await context.params : undefined;

    return handler(req, { user, params });
  };
}

export function withTeacher(handler: AuthenticatedHandler) {
  return withAuth(async (req, context) => {
    if (context.user.role !== 'TEACHER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return handler(req, context);
  });
}
