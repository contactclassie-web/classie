import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Public (read-only) Supabase client for server-rendered pages.
//
// Next.js keeps fetch() results in its Data Cache, and without a revalidate
// time the Supabase reads in the layout / homepage / gift sets / custom
// designs were being kept for a year — so admin changes could stay hidden.
// Every read through this client is reused for at most `revalidateSeconds`
// (admin saves also clear the whole cache via /api/revalidate).
const clients = new Map<number, SupabaseClient>();

export function publicSupabase(revalidateSeconds = 60): SupabaseClient {
  let c = clients.get(revalidateSeconds);
  if (!c) {
    c = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => fetch(input, { ...init, next: { revalidate: revalidateSeconds } }),
      },
    });
    clients.set(revalidateSeconds, c);
  }
  return c;
}
