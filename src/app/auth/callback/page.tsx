import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  // Auth disabled - redirect to home
  return NextResponse.redirect(`${origin}/`);
}

export default function AuthCallbackPage() {
  return null;
}