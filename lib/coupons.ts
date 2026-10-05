import type { SupabaseClient } from "@supabase/supabase-js";

// Coupon rules, used by /api/coupons/validate (to show the saving at checkout)
// and by the order/payment APIs (to work out the real amount on the server).

export interface CouponRow {
  id: string;
  code: string;
  discount_type: string;   // "percent" | "flat"
  discount_value: number;
  active: boolean;
  valid_from: string | null;
  valid_until: string | null;
  max_uses_total: number | null;
  max_uses_per_user: number | null;
  uses_count: number | null;
  min_order_value: number | null;
  require_phone?: boolean;
  require_email?: boolean;
}

export type CouponCheck =
  | { valid: true; coupon: CouponRow; discount: number }
  | { valid: false; error: string };

export async function checkCoupon(
  sb: SupabaseClient,
  code: string,
  opts: { phone?: string | null; email?: string | null; orderValue: number },
): Promise<CouponCheck> {
  const clean = String(code || "").trim().toUpperCase();
  if (!clean) return { valid: false, error: "Please enter a coupon code" };

  const { data: coupon, error } = await sb.from("coupons").select("*").eq("code", clean).maybeSingle();
  if (error || !coupon) return { valid: false, error: "Invalid coupon code" };
  const c = coupon as CouponRow;
  if (!c.active) return { valid: false, error: "This coupon is not active" };

  const now = new Date();
  if (c.valid_from && new Date(c.valid_from) > now) return { valid: false, error: "This coupon is not active yet" };
  if (c.valid_until && new Date(c.valid_until) < now) return { valid: false, error: "This coupon has expired" };
  if (c.max_uses_total != null && c.max_uses_total > 0 && (c.uses_count ?? 0) >= c.max_uses_total) {
    return { valid: false, error: "This coupon has reached its usage limit" };
  }

  const { phone, email } = opts;
  if ((phone || email) && c.max_uses_per_user) {
    let q = sb.from("coupon_uses").select("id", { count: "exact", head: true }).eq("coupon_id", c.id);
    q = phone ? q.eq("user_phone", phone) : q.eq("user_email", email!);
    const { count } = await q;
    if (count != null && count >= c.max_uses_per_user) {
      return { valid: false, error: `You can only use this coupon ${c.max_uses_per_user} time(s)` };
    }
  }

  if (c.min_order_value && opts.orderValue < c.min_order_value) {
    return { valid: false, error: `Minimum order value is ₹${c.min_order_value}` };
  }

  const discount = c.discount_type === "percent"
    ? Math.round((opts.orderValue * c.discount_value) / 100)
    : c.discount_value;
  return { valid: true, coupon: c, discount: Math.max(0, Math.min(discount, opts.orderValue)) };
}
