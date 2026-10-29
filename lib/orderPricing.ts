import { colourPhotoKey, firstColourPhotos, type ColourRow } from "@/lib/variantPhotos";
import type { SupabaseClient } from "@supabase/supabase-js";
import { GIFT_SETS_KEY, mergeGiftSets } from "@/lib/giftSets";
import { parseShipping } from "@/lib/shipping";
import { checkCoupon, type CouponRow } from "@/lib/coupons";
import { couponBase, orderTotals, parsePayment, PAYMENT_KEYS } from "@/lib/orderTotals";
import { INVENTORY_KEY, parseInventory, stockOf, type Inventory } from "@/lib/inventory";

// Works out what an order really costs from the database, so the amount a
// customer pays can't be changed in the browser. Used by the Razorpay order
// API (amount to charge) and the orders API (amount saved on the order).

export interface InputItem {
  slug?: unknown; title?: unknown; price?: unknown; image?: unknown; quantity?: unknown; variant?: unknown;
}

export interface PricedItem {
  slug: string; title: string; price: number; image: string; quantity: number; variant?: string;
}

export type PricingResult =
  | {
      ok: true;
      items: PricedItem[];
      /** Stock to take off once the order is saved: product slug → variant ("" = none) → qty */
      stockUse: Record<string, Record<string, number>>;
      subtotal: number;
      shipping: number;
      discount: number;
      codFee: number;
      total: number;
      coupon: CouponRow | null;
      couponError: string | null;
    }
  | { ok: false; error: string };

const str = (v: unknown, max = 300) => (typeof v === "string" ? v.slice(0, max) : "");

export async function priceOrder(
  sb: SupabaseClient,
  rawItems: unknown,
  opts: { couponCode?: string | null; phone?: string | null; email?: string | null; method?: "cod" | "online"; skipStockCheck?: boolean } = {},
): Promise<PricingResult> {
  if (!Array.isArray(rawItems) || rawItems.length === 0) return { ok: false, error: "No items in order" };
  if (rawItems.length > 50) return { ok: false, error: "Too many items in one order" };

  const items = (rawItems as InputItem[]).map((it) => ({
    slug: str(it.slug, 200),
    title: str(it.title, 300),
    image: str(it.image, 1000),
    variant: str(it.variant, 500) || undefined,
    clientPrice: Number(it.price),
    quantity: Math.min(50, Math.max(1, Math.round(Number(it.quantity) || 1))),
  }));
  if (items.some((it) => !it.slug)) return { ok: false, error: "Invalid item in cart" };

  const productSlugs = Array.from(new Set(items.filter((it) => !it.slug.startsWith("set-")).map((it) => it.slug)));
  const hasSets = items.some((it) => it.slug.startsWith("set-"));

  const [productsRes, offersRes, settingsRes, coloursRes] = await Promise.all([
    productSlugs.length
      ? sb.from("products").select("slug,title,price,active,image").in("slug", productSlugs)
      : Promise.resolve({ data: [] as { slug: string; title: string; price: number; active: boolean; image: string | null }[], error: null }),
    sb.from("product_bundle_offers").select("main_product_slug,accessory_slug,discount_type,discount_value,active").eq("active", true),
    sb.from("site_settings").select("key,value").in("key", ["shipping_tiers", "shipping_default_fee", ...PAYMENT_KEYS, INVENTORY_KEY, ...(hasSets ? [GIFT_SETS_KEY] : [])]),
    productSlugs.length
      ? sb.from("product_color_variants").select("product_slug,color_name,image").in("product_slug", productSlugs)
      : Promise.resolve({ data: [] as ColourRow[] }),
  ]);
  // Order photo (admin list + emails): the chosen colour's first photo, else the main photo.
  const colourPhotos = firstColourPhotos((coloursRes.data ?? []) as ColourRow[]);
  if (productsRes.error) return { ok: false, error: "Couldn't check prices. Please try again." };

  const products = new Map((productsRes.data ?? []).map((p) => [p.slug, p]));
  const cfg: Record<string, string> = {};
  (settingsRes.data ?? []).forEach((r: { key: string; value: string }) => { cfg[r.key] = r.value; });

  let sets = new Map<string, number>();
  const setItems = new Map<string, { slug: string; variant: string; qty: number }[]>();
  if (hasSets) {
    let saved: unknown = null;
    try { saved = cfg[GIFT_SETS_KEY] ? JSON.parse(cfg[GIFT_SETS_KEY]) : null; } catch { saved = null; }
    const live = mergeGiftSets(saved).sets.filter((s) => s.active && !s.askOnly && s.price > 0);
    sets = new Map(live.map((s) => [`set-${s.slug}`, s.price]));
    live.forEach((s) => setItems.set(`set-${s.slug}`, s.items.map((i) => ({ slug: i.slug, variant: i.variant || "", qty: i.qty || 1 }))));
  }

  const inCart = new Set(items.map((it) => it.slug.toLowerCase()));
  const offers = (offersRes.data ?? []) as { main_product_slug: string; accessory_slug: string; discount_type: string; discount_value: number }[];

  const priced: PricedItem[] = [];
  for (const it of items) {
    let price: number;
    if (it.slug.startsWith("set-")) {
      const setPrice = sets.get(it.slug);
      if (setPrice == null) return { ok: false, error: `"${it.title || it.slug}" is no longer available. Please remove it from your cart.` };
      price = setPrice;
    } else {
      const p = products.get(it.slug);
      if (!p || !p.active) return { ok: false, error: `"${it.title || it.slug}" is no longer available. Please remove it from your cart.` };
      price = Number(p.price);
      // "Buy together" offers: the lower price is allowed only when the main
      // product is in the same cart.
      const allowed = offers
        .filter((o) => o.accessory_slug?.toLowerCase() === it.slug.toLowerCase() && inCart.has(String(o.main_product_slug || "").toLowerCase()))
        .map((o) => o.discount_type === "percentage"
          ? Math.round(price * (1 - Number(o.discount_value) / 100))
          : Math.max(0, Math.round(price - Number(o.discount_value))));
      if (allowed.includes(it.clientPrice)) price = it.clientPrice;
      if (!it.title) it.title = p.title;
    }
    const dbImage = it.slug.startsWith("set-") ? "" : (colourPhotos.get(colourPhotoKey(it.slug, it.variant)) || products.get(it.slug)?.image || "");
    priced.push({ slug: it.slug, title: it.title, price, image: dbImage || it.image, quantity: it.quantity, ...(it.variant ? { variant: it.variant } : {}) });
  }

  // Stock: refuse anything that is sold out or short (untracked = unlimited).
  const inv: Inventory = parseInventory(cfg[INVENTORY_KEY]);
  const stockUse: Record<string, Record<string, number>> = {};
  const use = (slug: string, variant: string, qty: number) => { stockUse[slug] ??= {}; stockUse[slug][variant] = (stockUse[slug][variant] || 0) + qty; };
  for (const it of priced) {
    if (it.slug.startsWith("set-")) (setItems.get(it.slug) || []).forEach((c) => use(c.slug, c.variant, c.qty * it.quantity));
    else use(it.slug, it.variant || "", it.quantity);
  }
  for (const [slug, byVariant] of Object.entries(stockUse)) {
    for (const [variant, qty] of Object.entries(byVariant)) {
      // A gift-set part without a colour counts against the product's total stock.
      const tracked = variant || !inv[slug] ? stockOf(inv, slug, variant) : Object.values(inv[slug]).reduce((a, n) => a + Math.max(0, n), 0);
      if (opts.skipStockCheck || tracked === undefined || tracked >= qty) continue;
      const name = priced.find((p) => p.slug === slug)?.title || slug;
      const label = `${name}${variant ? ` (${variant})` : ""}`;
      return { ok: false, error: tracked <= 0 ? `Sorry, ${label} is sold out. Please remove it from your cart.` : `Only ${tracked} left of ${label}. Please lower the quantity.` };
    }
  }

  // Coupon on products only (never gift sets, delivery or the COD fee).
  let coupon: CouponRow | null = null;
  let couponError: string | null = null;
  let discount = 0;
  if (opts.couponCode) {
    const r = await checkCoupon(sb, opts.couponCode, { phone: opts.phone, email: opts.email, orderValue: couponBase(priced) });
    if (r.valid) { coupon = r.coupon; discount = r.discount; }
    else couponError = r.error;
  }

  const method = opts.method === "cod" ? "cod" : "online";
  const t = orderTotals(priced, discount, parseShipping(cfg.shipping_tiers, cfg.shipping_default_fee), parsePayment(cfg), method);
  if (method === "cod" && !t.codAllowed) return { ok: false, error: t.codReason };
  const { subtotal, shipping, codFee, total } = t;
  discount = t.discount;

  return { ok: true, items: priced, stockUse, subtotal, shipping, discount, codFee, total, coupon, couponError };
}
