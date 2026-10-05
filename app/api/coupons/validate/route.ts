import { NextResponse } from "next/server";
import { serverSupabase } from "@/lib/supabaseServer";
import { checkCoupon } from "@/lib/coupons";

export async function POST(req: Request) {
  try {
    const sb = serverSupabase();
    if (!sb) return NextResponse.json({ valid: false, error: "Something went wrong. Please try again." });
    const { code, phone, email, order_value } = await req.json();
    const r = await checkCoupon(sb, code, { phone, email, orderValue: Number(order_value) || 0 });
    if (!r.valid) return NextResponse.json({ valid: false, error: r.error });
    const c = r.coupon;
    return NextResponse.json({
      valid: true,
      coupon_id: c.id,
      discount_type: c.discount_type,
      discount_value: c.discount_value,
      discount_amount: r.discount,
      require_phone: c.require_phone,
      require_email: c.require_email,
      message: `Coupon applied! You save ${c.discount_type === "percent" ? c.discount_value + "%" : "₹" + c.discount_value}`,
    });
  } catch {
    return NextResponse.json({ valid: false, error: "Something went wrong. Please try again." });
  }
}
