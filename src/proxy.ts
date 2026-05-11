import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  // Firebase Auth usually handles protection on the client side 
  // or via Session Cookies. For now, we'll keep the routing simple.
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|api|favicon.ico|.*\\..*$|public).*)',
  ],
};