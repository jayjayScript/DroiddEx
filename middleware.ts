import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  if (pathname.startsWith('/admin')) {
    if (!token || role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// 👇 Add this at the bottom of middleware.ts
export const config = {
  matcher: ['/admin/:path*'],
};
