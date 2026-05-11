import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Extract the Supabase JWT from the Authorization header
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ isAdmin: false });
    }

    // Verify the token and get the authenticated user
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ isAdmin: false });
    }

    // Query admin_users table joined with admin_roles
    const { data: adminUser, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select(`
        *,
        role:admin_roles (
          id,
          name,
          permissions
        )
      `)
      .eq('id', user.id)
      .single();

    if (adminError) {
      // If the query fails (e.g. table doesn't exist, RLS blocks), treat as non-admin
      console.error('Admin check query error:', adminError);
      return NextResponse.json({ isAdmin: false });
    }

    if (!adminUser) {
      // User exists but is not an admin
      return NextResponse.json({ isAdmin: false });
    }

    // User is an admin — return full admin info
    return NextResponse.json({
      isAdmin: true,
      role: adminUser.role?.name ?? null,
      adminUser: {
        id: adminUser.id,
        name: adminUser.name,
        email: adminUser.email,
        status: adminUser.status,
        role: adminUser.role ?? null,
        created_at: adminUser.created_at,
      },
    });
  } catch (error) {
    console.error('Admin check error:', error);
    return NextResponse.json({ isAdmin: false });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}