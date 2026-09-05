import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const VALID_TYPES = new Set(["page_view", "add_to_cart", "begin_checkout", "purchase", "error"]);

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function getDevice(userAgent: string | null): string {
  if (!userAgent) return "unknown";
  return /Mobi|Android|iPhone|iPad|iPod/i.test(userAgent) ? "mobile" : "desktop";
}

// Called by lib/analytics.ts (sendBeacon/fetch) on page views, cart/checkout/purchase
// events, and client-side errors. Best-effort: failures here must never surface to users.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !VALID_TYPES.has(body.event_type)) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ ok: true }); // table not configured yet — no-op

    // Vercel injects these at the edge on every request — real geo/device info,
    // not something the client can fake by sending a fake value in the body.
    const device = getDevice(request.headers.get("user-agent"));
    const country = request.headers.get("x-vercel-ip-country");
    const cityHeader = request.headers.get("x-vercel-ip-city");
    const city = cityHeader ? decodeURIComponent(cityHeader) : null;

    await supabase.from("analytics_events").insert([{
      event_type: body.event_type,
      path: typeof body.path === "string" ? body.path.slice(0, 500) : null,
      product_slug: typeof body.product_slug === "string" ? body.product_slug.slice(0, 200) : null,
      product_title: typeof body.product_title === "string" ? body.product_title.slice(0, 300) : null,
      value: typeof body.value === "number" ? body.value : null,
      source: typeof body.source === "string" ? body.source.slice(0, 200) : null,
      session_id: typeof body.session_id === "string" ? body.session_id.slice(0, 100) : null,
      message: typeof body.message === "string" ? body.message.slice(0, 1000) : null,
      meta: body.meta ?? null,
      device,
      country,
      city,
    }]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // tracking must never error out for the client
  }
}
