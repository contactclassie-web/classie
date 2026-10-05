import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { SUPABASE_URL, serverRestHeaders } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Admin login required" }, { status: 401 });
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/product_reviews?active=eq.false&select=id,product_slug,customer_name,rating,created_at&order=created_at.desc`,
    { headers: serverRestHeaders(), cache: "no-store" }
  );
  const data: { id: string; product_slug: string; customer_name: string; rating: number; created_at: string }[] = res.ok ? await res.json() : [];
  return NextResponse.json({ count: data.length, pending: data });
}
