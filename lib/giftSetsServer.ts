import { publicSupabase } from "@/lib/supabasePublic";
import { GIFT_SETS_KEY, mergeGiftSets, type GiftSetsConfig, type SetProduct } from "@/lib/giftSets";
import { freeDeliveryThreshold } from "@/lib/homeConfig";

export interface GiftSetsData {
  config: GiftSetsConfig;
  products: Record<string, SetProduct>;
  freeAmount: number | null;
  whatsapp: string;
}

// Server-side loader shared by /gift-sets and /gift-sets/[slug].
export async function loadGiftSets(): Promise<GiftSetsData> {
  const sb = publicSupabase(30);
  const [settingsRes, productsRes] = await Promise.all([
    sb.from("site_settings").select("key,value").in("key", [GIFT_SETS_KEY, "shipping_tiers", "shipping_default_fee", "footer_whatsapp_url"]),
    sb.from("products").select("slug,title,price,image,category,variant_type,variants,active"),
  ]);
  const cfg: Record<string, string> = {};
  (settingsRes.data ?? []).forEach((r: { key: string; value: string }) => { cfg[r.key] = r.value; });

  let saved: unknown = null;
  try { saved = cfg[GIFT_SETS_KEY] ? JSON.parse(cfg[GIFT_SETS_KEY]) : null; } catch { saved = null; }

  const products: Record<string, SetProduct> = {};
  (productsRes.data ?? []).forEach((p: {
    slug: string; title: string; price: number; image: string; category: string;
    variant_type: string | null; variants: string[] | null; active: boolean | null;
  }) => {
    products[p.slug] = {
      slug: p.slug,
      title: p.title,
      price: Number(p.price) || 0,
      image: p.image,
      category: p.category,
      variantType: (p.variant_type === "size" || p.variant_type === "color") ? p.variant_type : "none",
      options: Array.isArray(p.variants) ? p.variants : [],
      active: p.active !== false,
    };
  });

  return {
    config: mergeGiftSets(saved),
    products,
    freeAmount: freeDeliveryThreshold(cfg.shipping_tiers, cfg.shipping_default_fee),
    whatsapp: cfg.footer_whatsapp_url || "",
  };
}
