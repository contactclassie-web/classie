"use client";

import { createClient } from "@supabase/supabase-js";

// Supabase client for the admin pages. Requests go through /api/admin/sb,
// which checks the admin login cookie and adds the secret key on the server.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const REST = `${url.replace(/\/$/, "")}/rest/v1/`;

const viaProxy: typeof fetch = (input, init) => {
  const u = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (u.startsWith(REST)) {
    return fetch(`/api/admin/sb/rest/v1/${u.slice(REST.length)}`, { ...init, credentials: "same-origin" });
  }
  return fetch(input, init);
};

export const adminSupabase = createClient(url, anon, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { fetch: viaProxy },
});
