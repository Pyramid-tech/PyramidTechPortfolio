import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'pyramid_token';

function getSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.JWT_SECRET!);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const isAuthenticated = token
    ? await jwtVerify(token, getSecret())
        .then(() => true)
        .catch(() => false)
    : false;

  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
