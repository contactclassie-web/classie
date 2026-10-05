import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase access. Uses the secret (service role) key when it is
// set in Vercel, so API routes keep working after the database is locked down
// (public visitors can then only read catalogue tables). Never import this
// from a client component.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function serviceKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || "";
}

export function hasServiceKey(): boolean {
  return !!serviceKey();
}

let cached: SupabaseClient | null = null;

export function serverSupabase(): SupabaseClient | null {
  const key = serviceKey() || ANON_KEY;
  if (!SUPABASE_URL || !key || SUPABASE_URL === "your_supabase_url") return null;
  if (!cached) {
    cached = createClient(SUPABASE_URL, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}

// Headers for direct REST calls (same key choice as serverSupabase).
export function serverRestHeaders(): Record<string, string> {
  const key = serviceKey() || ANON_KEY;
  return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}
