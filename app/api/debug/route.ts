import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json({ error: "ENV VARS MISSING", url: !!url, key: !!key });
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const sb = createClient(url, key);
    const { data, error } = await sb.from("site_settings").select("key,value").in("key", ["hero_eyebrow","hero_cta1_text","hero_heading_line1"]);
    return NextResponse.json({ status: "OK", data, error });
  } catch (e: unknown) {
    return NextResponse.json({ error: String(e) });
  }
}
