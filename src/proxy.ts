import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(cookie => {
            response.cookies.set(cookie.name, cookie.value, cookie.options);
          });
        },
      },
    }
  );

  // Refresh the session if necessary
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token && session?.refresh_token) {
    const { data, error } = await supabase.auth.refreshSession();

    if (data?.session && !error) {
      const { access_token, refresh_token } = data.session;
      const expiresAt = data.session.expires_at;
      const maxAge = expiresAt ? expiresAt - Math.floor(Date.now() / 1000) : 0;

      response.cookies.set('sb-access-token', access_token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge,
      });

      response.cookies.set('sb-refresh-token', refresh_token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30,
      });
    }
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Admin route protection
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('status')
      .eq('id', user.id)
      .single();

    if (error || !adminUser || adminUser.status !== 'active') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated admins away from login page
  if (user && request.nextUrl.pathname === '/admin/login') {
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('status')
      .eq('id', user.id)
      .single();

    if (adminUser?.status === 'active') {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|api|favicon.ico|.*\\..*$|public).*)',
  ],
};