import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

let _supabase: SupabaseClient | null = null;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    "❌ FATAL: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing.",
    "\n  → In development: check frontend/.env",
    "\n  → In production: set these in Vercel Dashboard → Settings → Environment Variables"
  );
} else {
  _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Export with a non-null assertion for convenience — callers that need safety
// should check supabase !== null before use.
export const supabase = _supabase as SupabaseClient;
