import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/product_reviews?active=eq.false&select=id`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "count=exact",
      },
      cache: "no-store",
    }
  );
  const count = parseInt(res.headers.get("content-range")?.split("/")[1] ?? "0", 10);
  const data = await res.json();
  return NextResponse.json({ count: isNaN(count) ? data.length : count });
}
