import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { code, phone, email, order_value } = await req.json();

    if (!code || !code.trim()) {
      return NextResponse.json({ valid: false, error: "Please enter a coupon code" });
    }

    // 1. Find coupon
    const { data: coupon, error } = await sb
      .from("coupons")
      .select("*")
      .eq("code", code.trim().toUpperCase())
      .single();

    if (error || !coupon) {
      return NextResponse.json({ valid: false, error: "Invalid coupon code" });
    }
    if (!coupon.active) {
      return NextResponse.json({ valid: false, error: "This coupon is not active" });
    }

    // 2. Check date validity
    const now = new Date();
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
      return NextResponse.json({ valid: false, error: "This coupon is not active yet" });
    }
    if (coupon.valid_until && new Date(coupon.valid_until) < now) {
      return NextResponse.json({ valid: false, error: "This coupon has expired" });
    }

    // 3. Check total uses
    if (coupon.max_uses_total != null && coupon.uses_count >= coupon.max_uses_total) {
      return NextResponse.json({ valid: false, error: "This coupon has reached its usage limit" });
    }

    // 4. Check per-user uses (by phone or email)
    const identifier = phone || email;
    if (identifier && coupon.max_uses_per_user) {
      let query = sb
        .from("coupon_uses")
        .select("id", { count: "exact", head: true })
        .eq("coupon_id", coupon.id);
      if (phone) query = query.eq("user_phone", phone);
      else if (email) query = query.eq("user_email", email);
      const { count } = await query;
      if (count != null && count >= coupon.max_uses_per_user) {
        return NextResponse.json({
          valid: false,
          error: `You can only use this coupon ${coupon.max_uses_per_user} time(s)`,
        });
      }
    }

    // 5. Check min order value
    if (order_value != null && coupon.min_order_value && order_value < coupon.min_order_value) {
      return NextResponse.json({
        valid: false,
        error: `Minimum order value is ₹${coupon.min_order_value}`,
      });
    }

    // 6. Calculate discount
    let discount_amount: number;
    if (coupon.discount_type === "percent") {
      discount_amount = order_value
        ? Math.round((order_value * coupon.discount_value) / 100)
        : coupon.discount_value;
    } else {
      discount_amount = coupon.discount_value;
    }

    return NextResponse.json({
      valid: true,
      coupon_id: coupon.id,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      discount_amount,
      require_phone: coupon.require_phone,
      require_email: coupon.require_email,
      message: `Coupon applied! You save ${
        coupon.discount_type === "percent"
          ? coupon.discount_value + "%"
          : "₹" + coupon.discount_value
      }`,
    });
  } catch {
    return NextResponse.json({ valid: false, error: "Something went wrong. Please try again." });
  }
}
