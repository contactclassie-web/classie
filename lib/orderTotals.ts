import { shippingFee, type ShippingRules } from "@/lib/shipping";

// One set of money rules for the checkout page and the order/payment APIs,
// so the total a customer sees is the total the server charges.
//
// - Coupons count only products, never gift sets, delivery or the COD fee.
// - Free delivery is checked on the cart value after the coupon.
// - A cart with a gift set ships free.
// - Cash on delivery adds a fee and is allowed only within a cart-value range.
//   Values come from Admin → Shipping Rates (site_settings cod_fee / cod_min / cod_max).

export interface PaymentRules { codFee: number; codMin: number; codMax: number }
export const DEFAULT_PAYMENT: PaymentRules = { codFee: 99, codMin: 299, codMax: 3000 };
export const PAYMENT_KEYS = ["cod_fee", "cod_min", "cod_max"] as const;

export function parsePayment(m: Record<string, string | undefined>): PaymentRules {
  const num = (v: string | undefined, d: number) => (v != null && v !== "" && !Number.isNaN(Number(v)) ? Math.max(0, Number(v)) : d);
  return { codFee: num(m.cod_fee, DEFAULT_PAYMENT.codFee), codMin: num(m.cod_min, DEFAULT_PAYMENT.codMin), codMax: num(m.cod_max, DEFAULT_PAYMENT.codMax) };
}

export const isGiftSet = (slug: string) => slug.startsWith("set-");

export interface Line { slug: string; price: number; quantity: number }

/** Value the coupon is worked out on: products only (gift sets are already discounted). */
export function couponBase(lines: Line[]): number {
  return lines.filter((l) => !isGiftSet(l.slug)).reduce((s, l) => s + l.price * l.quantity, 0);
}

export interface Totals {
  subtotal: number;      // everything in the cart
  discount: number;      // coupon saving (already capped to products)
  goods: number;         // subtotal - discount
  shipping: number;
  codFee: number;        // 0 unless paying cash on delivery
  codAllowed: boolean;
  codReason: string;     // why COD is not available, for the checkout page
  total: number;
}

export function orderTotals(lines: Line[], discount: number, shippingRules: ShippingRules, payment: PaymentRules, method: "cod" | "online"): Totals {
  const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const safeDiscount = Math.max(0, Math.min(discount, couponBase(lines)));
  const goods = subtotal - safeDiscount;
  const shipping = lines.some((l) => isGiftSet(l.slug)) ? 0 : shippingFee(goods, shippingRules);
  const rs = (n: number) => "₹" + n.toLocaleString("en-IN");
  let codReason = "";
  if (payment.codMin > 0 && goods < payment.codMin) codReason = `Cash on delivery is available on orders of ${rs(payment.codMin)} or more.`;
  else if (payment.codMax > 0 && goods > payment.codMax) codReason = `Cash on delivery is available up to ${rs(payment.codMax)}. Please pay online for this order.`;
  const codAllowed = codReason === "";
  const codFee = method === "cod" ? payment.codFee : 0;
  return { subtotal, discount: safeDiscount, goods, shipping, codFee, codAllowed, codReason, total: Math.max(0, goods + shipping + codFee) };
}
