import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/settings'];

// Routes that should redirect authenticated users (login/register pages)
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle root path redirect at middleware level as fallback
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/homepage', request.url));
  }
  
  // Check if user has a session token (you'll need to implement proper token validation)
  // For now, we'll use a simple approach - in production, verify JWT tokens
  const hasAuth = request.cookies.get('auth-token');
  
  // Protect routes that require authentication
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!hasAuth) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Redirect authenticated users away from auth pages
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (hasAuth) {
      return NextResponse.redirect(new URL('/homepage', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};