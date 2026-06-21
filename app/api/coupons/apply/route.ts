import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const {
      coupon_id,
      user_phone,
      user_email,
      user_name,
      order_id,
      order_total,
      discount_applied,
      final_amount,
      products_json,
      items_count,
    } = await req.json();

    if (!coupon_id) {
      return NextResponse.json({ ok: false, error: "coupon_id is required" }, { status: 400 });
    }

    // Insert usage record
    const { error: insertError } = await sb.from("coupon_uses").insert({
      coupon_id,
      user_phone: user_phone || null,
      user_email: user_email || null,
      user_name: user_name || null,
      order_id: order_id || null,
      order_total: order_total || null,
      discount_applied: discount_applied || null,
      final_amount: final_amount || null,
      products_json: products_json || null,
      items_count: items_count || null,
    });

    if (insertError) {
      console.error("coupon_uses insert error:", insertError);
      return NextResponse.json({ ok: false, error: insertError.message }, { status: 500 });
    }

    // Increment uses_count on the coupon
    const { data: coupon } = await sb
      .from("coupons")
      .select("uses_count")
      .eq("id", coupon_id)
      .single();

    await sb
      .from("coupons")
      .update({ uses_count: (coupon?.uses_count || 0) + 1 })
      .eq("id", coupon_id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("coupon apply error:", err);
    return NextResponse.json({ ok: false, error: "Internal server error" }, { status: 500 });
  }
}
