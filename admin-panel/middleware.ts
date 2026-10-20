import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================================
// HIMOYALANGAN SAHIFALAR
// ============================================================
const PROTECTED_ROUTES = [
  '/dashboard',
  '/properties',
  '/complexes',
  '/users',
  '/applications',
  '/promotions',
  '/reviews',
  '/employees',
  '/settings',
  '/seo',
  '/logs',
];

const AUTH_ROUTES = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Token'ni cookie yoki header'dan olish
  // Note: localStorage'ni middleware'da o'qish mumkin emas
  // Shu sababli cookie ishlatish yaxshiroq
  const token = request.cookies.get('etagi_admin_token')?.value;

  // ============================================================
  // HIMOYALANGAN SAHIFA + TOKEN YO'Q → LOGIN
  // ============================================================
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ============================================================
  // LOGIN SAHIFA + TOKEN BOR → DASHBOARD
  // ============================================================
  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
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
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};