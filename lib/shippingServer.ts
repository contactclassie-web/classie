import { createClient } from "@supabase/supabase-js";
import { DEFAULT_SHIPPING, freeShippingFrom, parseShipping, type ShippingRules } from "@/lib/shipping";

// Delivery rules for server-rendered pages (shop pages, product pages).
export async function loadShippingRules(): Promise<ShippingRules> {
  try {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { data } = await sb.from("site_settings").select("key,value").in("key", ["shipping_tiers", "shipping_default_fee"]);
    const m: Record<string, string> = {};
    (data ?? []).forEach((r: { key: string; value: string }) => { m[r.key] = r.value; });
    return parseShipping(m.shipping_tiers, m.shipping_default_fee);
  } catch {
    return DEFAULT_SHIPPING;
  }
}

// Amount above which delivery is free, for page text ("free shipping above ₹999").
export async function loadFreeShippingAmount(): Promise<number> {
  return freeShippingFrom(await loadShippingRules()) ?? DEFAULT_SHIPPING.tiers[0].threshold;
}
