import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/';

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', request.url));
  }

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth callback error:', error);
      const errorMessage = encodeURIComponent(error.message);
      return NextResponse.redirect(new URL(`/login?error=${errorMessage}`, request.url));
    }

    return NextResponse.redirect(new URL(next, request.url));
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    const errorMessage = encodeURIComponent('An unexpected error occurred');
    return NextResponse.redirect(new URL(`/login?error=${errorMessage}`, request.url));
  }
}
