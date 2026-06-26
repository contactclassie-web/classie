import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = "https://hrjvxwqvxvibtwyfoyca.supabase.co";
const SUPABASE_KEY = "sb_publishable_fO8FW4iIh9pTTYdYGZ3m9Q_VXMtKI6z";

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

// GET /api/reviews/admin?slug=velora → ALL reviews (active + inactive) for that slug
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  const url = `${SUPABASE_URL}/rest/v1/product_reviews?product_slug=eq.${encodeURIComponent(slug)}&order=review_date.desc,created_at.desc`;
  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) {
    return NextResponse.json([], { status: 200 });
  }
  const data = await res.json();
  return NextResponse.json(data);
}

// POST /api/reviews/admin → add review manually (active=true by default)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_slug, product_id, customer_name, rating, review_text, review_date, active } = body;

    if (!product_slug || !customer_name || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const payload: Record<string, unknown> = {
      product_slug,
      customer_name,
      rating: Number(rating),
      review_text: review_text || "",
      review_date: review_date || new Date().toISOString().split("T")[0],
      active: active !== false, // default true for admin
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

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// PATCH /api/reviews/admin → update review (toggle active, edit fields)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const url = `${SUPABASE_URL}/rest/v1/product_reviews?id=eq.${encodeURIComponent(id)}`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: { ...headers, Prefer: "return=representation" },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// DELETE /api/reviews/admin?id=xxx → delete a review
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const url = `${SUPABASE_URL}/rest/v1/product_reviews?id=eq.${encodeURIComponent(id)}`;
  const res = await fetch(url, { method: "DELETE", headers });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
