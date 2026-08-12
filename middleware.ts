import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminToken = request.cookies.get('adminToken')?.value;
  const token = request.cookies.get('token')?.value;

  // Explicitly allow the admin auth page
  if (pathname.startsWith('/admin/auth')) {
    return NextResponse.next();
  }

  // Protect all other /admin routes
  if (pathname.startsWith('/admin')) {
    if (!adminToken && !token) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/auth';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
