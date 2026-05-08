import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

/** Returns true if Supabase env vars are configured */
export const isSupabaseConfigured = () =>
  supabaseUrl.length > 0 && supabaseKey.length > 0;

/** Supabase client — safe to call even without config (queries will fail gracefully) */
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);
