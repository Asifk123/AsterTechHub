import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // 1. If trying to access protected routes without login
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/dashboard');

  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Role & Verification Logic (if logged in)
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('id', user.id)
      .single();

    const role = (profile?.role || '').toUpperCase();
    const status = profile?.status;

    // HARDCODED BYPASS FOR CEO
    const isExecutive = ['ADMIN', 'CEO', 'MD', 'OD'].includes(role) || user.email === 'samasif582@gmail.com';
    const isTeam = role === 'TEAM';

    // Block pending users from any dashboard
    if (status === 'pending' && isProtectedRoute) {
      return NextResponse.redirect(new URL('/pending', request.url));
    }

    // -- 3-WAY ACCESS CONTROL --

    // 1. /admin access: Only Executives
    if (request.nextUrl.pathname.startsWith('/admin') && !isExecutive) {
      const target = isTeam ? '/team' : '/dashboard';
      return NextResponse.redirect(new URL(target, request.url));
    }

    // 2. /team access: Only Team Members and Executives (Executives might want to see team board)
    if (request.nextUrl.pathname.startsWith('/team') && !isTeam && !isExecutive) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // 3. /dashboard access: Only Clients and Executives
    if (request.nextUrl.pathname.startsWith('/dashboard') && !isExecutive && role !== 'CLIENT') {
      const target = isTeam ? '/team' : '/login';
      return NextResponse.redirect(new URL(target, request.url));
    }

    // Redirect already logged in users from login/signup
    if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup') {
      let target = '/dashboard';
      if (isExecutive) target = '/admin';
      else if (isTeam) target = '/team';
      return NextResponse.redirect(new URL(target, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/team/:path*',
    '/pending',
    '/login',
    '/signup'
  ],
};
