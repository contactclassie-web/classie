import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = "https://hrjvxwqvxvibtwyfoyca.supabase.co";
const SUPABASE_KEY = "sb_publishable_fO8FW4iIh9pTTYdYGZ3m9Q_VXMtKI6z";

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

// GET /api/reviews?slug=velora → returns active reviews for that slug
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const url = `${SUPABASE_URL}/rest/v1/product_reviews?product_slug=eq.${encodeURIComponent(slug)}&active=eq.true&order=review_date.desc,created_at.desc`;
  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) {
    return NextResponse.json([], { status: 200 });
  }
  const data = await res.json();
  return NextResponse.json(data);
}

// POST /api/reviews → customer submits a review (saved with active=false)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_slug, product_id, customer_name, rating, review_text, review_date } = body;

    if (!product_slug || !customer_name || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const payload: Record<string, unknown> = {
      product_slug,
      customer_name,
      rating,
      review_text: review_text || "",
      review_date: review_date || new Date().toISOString().split("T")[0],
      active: false,
    };
    if (product_id) payload.product_id = product_id;

    const url = `${SUPABASE_URL}/rest/v1/product_reviews`;
    const res = await fetch(url, {
      method: "POST",
      headers: { ...headers, Prefer: "return=representation" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Review submitted. It will appear after approval." });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
