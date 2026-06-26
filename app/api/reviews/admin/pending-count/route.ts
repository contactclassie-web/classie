import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/product_reviews?active=eq.false&select=id,product_slug,customer_name,rating,created_at&order=created_at.desc`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );
  const data: { id: string; product_slug: string; customer_name: string; rating: number; created_at: string }[] = await res.json();
  return NextResponse.json({ count: data.length, pending: data });
}
