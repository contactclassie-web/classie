import { publicSupabase } from "@/lib/supabasePublic";
import { loadGiftSets } from "@/lib/giftSetsServer";
import type { ListingProduct, Occasion } from "@/components/shop/ShopListing";

export const CHARM_CATEGORIES = ["shoe-charms", "clips", "bow"];
export const DEFAULT_CHARM_TYPES = ["Rhinestone Shoe Charms", "Flower Shoe Charms", "Bow Shoe Charms", "Pearl Anklet"];

type Row = {
  slug: string; title: string; price: number | string; compare_price: number | string | null;
  image: string | null; images: string[] | null; tags: string[] | null; heel_type: string | null;
  variant_type: string | null; variants: string[] | null; featured_tab: string | null; category: string;
};

/** "Block heel" / "Block Heel" / "block heel " → "Block Heel" */
export function normalizeHeelType(s: string | null | undefined): string {
  return (s ?? "").trim().replace(/\s+/g, " ").toLowerCase().replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export function toListing(r: Row): ListingProduct {
  const image = r.image ?? "";
  const image2 = (Array.isArray(r.images) ? r.images : []).find((u) => u && u !== image) ?? "";
  const vt = r.variant_type === "size" || r.variant_type === "color" ? r.variant_type : "none";
  return {
    slug: r.slug,
    title: r.title,
    price: Number(r.price) || 0,
    comparePrice: Number(r.compare_price) || 0,
    image,
    image2,
    tags: Array.isArray(r.tags) ? r.tags : [],
    heelType: normalizeHeelType(r.heel_type === "None" ? "" : r.heel_type),
    variantType: vt,
    options: vt === "none" ? [] : (Array.isArray(r.variants) ? r.variants.filter((v) => String(v).trim() !== "") : []),
    isNew: r.featured_tab === "latest",
  };
}

const COLS = "slug,title,price,compare_price,image,images,tags,heel_type,variant_type,variants,featured_tab,category";

export async function loadAllListingProducts(): Promise<{ heels: ListingProduct[]; charms: ListingProduct[] }> {
  const sb = publicSupabase(60);
  const { data } = await sb.from("products").select(COLS).eq("active", true).order("created_at", { ascending: false });
  const rows = (data ?? []) as Row[];
  return {
    heels: rows.filter((r) => r.category === "heels").map(toListing),
    charms: rows.filter((r) => CHARM_CATEGORIES.includes(r.category)).map(toListing),
  };
}

export async function loadSettings(prefixes: string[], extraKeys: string[] = []): Promise<Record<string, string>> {
  const sb = publicSupabase(60);
  const filters = [...prefixes.map((p) => `key.like.${p}%`), ...extraKeys.map((k) => `key.eq.${k}`)].join(",");
  const { data } = await sb.from("site_settings").select("key,value").or(filters);
  const m: Record<string, string> = {};
  (data ?? []).forEach((r: { key: string; value: string }) => { m[r.key] = r.value; });
  return m;
}

export async function loadOccasions(): Promise<{ occasions: Occasion[]; map: Record<string, string[]> }> {
  const sb = publicSupabase(60);
  const [cols, links] = await Promise.all([
    sb.from("collections").select("id,title,slug,tag_label,image_url").eq("active", true).order("display_order", { ascending: true }),
    sb.from("collection_products").select("collection_id,product_slug,display_order").order("display_order", { ascending: true }),
  ]);
  const idToSlug: Record<string, string> = {};
  const occasions: Occasion[] = (cols.data ?? []).map((c: { id: string; title: string; slug: string; tag_label: string | null; image_url: string | null }) => {
    idToSlug[c.id] = c.slug;
    return { title: c.title, slug: c.slug, image: c.image_url ?? "", tag: c.tag_label ?? "" };
  });
  const map: Record<string, string[]> = {};
  (links.data ?? []).forEach((l: { collection_id: string; product_slug: string }) => {
    const s = idToSlug[l.collection_id];
    if (!s) return;
    (map[s] ??= []).push(l.product_slug);
  });
  return { occasions, map };
}

/** Lowest active gift set price and a photo for it. */
export async function loadGiftSummary(): Promise<{ from: number; image: string; count: number }> {
  try {
    const data = await loadGiftSets();
    const sets = data.config.sets.filter((s) => s.active && !s.askOnly && s.price > 0);
    const first = sets[0];
    const image = first ? first.images[0] || data.products[first.items[0]?.slug]?.image || "" : "";
    return { from: sets.length ? Math.min(...sets.map((s) => s.price)) : 0, image, count: sets.length };
  } catch {
    return { from: 0, image: "", count: 0 };
  }
}

/** One "on a shoe" photo per charm type, for the band on the heels page. */
export function bandPhotos(charms: ListingProduct[], types: string[]): string[] {
  const out: string[] = [];
  for (const tag of types) {
    const p = charms.find((c) => c.image2 && c.tags.some((t) => t.toLowerCase() === tag.toLowerCase()) && !out.includes(c.image2));
    if (p) out.push(p.image2);
  }
  for (const c of charms) { if (out.length >= 3) break; if (c.image2 && !out.includes(c.image2)) out.push(c.image2); }
  return out.slice(0, 3);
}

export function parseList(raw: string | undefined, fallback: string[]): string[] {
  try {
    const v = raw ? JSON.parse(raw) : null;
    return Array.isArray(v) && v.length ? v.map(String) : fallback;
  } catch {
    return fallback;
  }
}

/** Google data for a listing page: breadcrumb + list of products. */
export function listingJsonLd(name: string, path: string, products: ListingProduct[]): string {
  const base = "https://www.classie.co.in";
  return JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: base },
        { "@type": "ListItem", position: 2, name, item: base + path },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name,
      url: base + path,
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${base}/products/${p.slug}`,
        name: p.title.trim(),
        image: p.image,
      })),
    },
  ]).replace(/</g, "\\u003c");
}

/** An occasion edit (Catalog → Collections) with its products in admin order. */
export async function loadEdit(slug: string): Promise<{ title: string; description: string; image: string; tag: string; products: ListingProduct[] } | null> {
  const sb = publicSupabase(60);
  const { data: col } = await sb.from("collections").select("id,title,description,image_url,tag_label").eq("slug", slug).maybeSingle();
  if (!col) return null;
  const { data: links } = await sb.from("collection_products").select("product_slug,display_order").eq("collection_id", col.id).order("display_order", { ascending: true });
  const slugs = (links ?? []).map((l: { product_slug: string }) => l.product_slug);
  const { data: rows } = slugs.length
    ? await sb.from("products").select(COLS).in("slug", slugs).eq("active", true)
    : { data: [] as Row[] };
  const bySlug = new Map((rows ?? []).map((r: Row) => [r.slug, toListing(r)]));
  return {
    title: col.title ?? "",
    description: col.description ?? "",
    image: col.image_url ?? "",
    tag: col.tag_label ?? "",
    products: slugs.map((s: string) => bySlug.get(s)).filter((p): p is ListingProduct => !!p),
  };
}
