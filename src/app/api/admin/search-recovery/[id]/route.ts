import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

const ALLOWED_STATUSES = new Set(['open', 'in_progress', 'resolved', 'ignored']);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const nextStatus = String(body?.status || '').trim();
    const notes = typeof body?.notes === 'string' ? body.notes.trim() : undefined;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Task id is required' }, { status: 400 });
    }

    if (!ALLOWED_STATUSES.has(nextStatus)) {
      return NextResponse.json({ success: false, error: 'Invalid status value' }, { status: 400 });
    }

    const supabase = await createClient();

    const payload: Record<string, string> = {
      status: nextStatus,
      updated_at: new Date().toISOString(),
    };

    if (notes !== undefined) {
      payload.notes = notes;
    }

    const { error } = await supabase
      .from('search_recovery_tasks')
      .update(payload)
      .eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update task' }, { status: 500 });
  }
}
