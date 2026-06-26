import { supabase } from './supabase';

export interface Product {
  slug: string;
  title: string;
  price: number;
  comparePrice: number;
  category: "heels" | "accessories";
  collection: "heels" | "clips" | "bow";
  variants: { type: "size" | "color" | "none"; options: string[] };
  image: string;
  images?: string[];
  video_url?: string;
  key_features?: string;
  other_info?: string;
  specs?: Array<{label: string; value: string}>;
  feature_checks?: string;
  variant_label?: string;
  promo_line?: string;
  description: string;
  featured_tab?: string | null;
}

export const products: Product[] = [
  // ── HEELS ────────────────────────────────────────────────────────────
  { slug: "clessia-wine", title: "Clessia Wine", price: 1699, comparePrice: 1899, category: "heels", collection: "heels", variants: { type: "size", options: ["35","36","37","38","39"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/75.png?v=1767179583", description: "Signature C-shaped sculpted front, 3-inch sculpted heel, premium satin fabric, Classie Comfort Insole." },
  { slug: "clessia", title: "Clessia Rose Gold", price: 1699, comparePrice: 1899, category: "heels", collection: "heels", variants: { type: "size", options: ["35","36","37","38","39"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/70.png?v=1767129647", description: "Signature C-shaped sculpted front, 3-inch sculpted heel, premium satin fabric in Rose Gold." },
  { slug: "crovia-choclate-brown", title: "Crovia Chocolate Brown", price: 1499, comparePrice: 1799, category: "heels", collection: "heels", variants: { type: "size", options: ["35","36","37","38","39"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/58.png?v=1767126020", description: "3-inch block heel, premium alligator-textured vegan fabric, soft cushioned insole." },
  { slug: "crovia", title: "Crovia Caramel", price: 1499, comparePrice: 1799, category: "heels", collection: "heels", variants: { type: "size", options: ["35","36","37","38","39"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/40_c9833246-51b7-4ff5-8200-acf9809593c5.png?v=1767109414", description: "3-inch block heel, premium alligator-textured vegan fabric in warm caramel tone." },
  { slug: "gloss-belle-mocha", title: "Gloss Belle Mocha Brown", price: 1599, comparePrice: 1799, category: "heels", collection: "heels", variants: { type: "size", options: ["35","36","37","38","39"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/39.png?v=1766919149", description: "2.5-inch block heel, glossy patent finish, adjustable slingback strap with gold buckle." },
  { slug: "gloss-belle", title: "Gloss Belle Black", price: 1599, comparePrice: 1799, category: "heels", collection: "heels", variants: { type: "size", options: ["35","36","37","38","39"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/17_fc5c95f2-f403-4090-abdf-3c6a93afec00.png?v=1766915208", description: "2.5-inch block heel, glossy patent finish in classic black, adjustable slingback strap." },
  { slug: "modiva-bgn", title: "Modiva Wine Red", price: 1599, comparePrice: 1999, category: "heels", collection: "heels", variants: { type: "size", options: ["35","36","37","38","39"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/3_a87e3602-d73e-482f-8d3d-54bcddc6313b.png?v=1766843058", description: "3.5-inch pointed toe slingback, premium matte vegan leather in burgundy." },
  { slug: "modiva", title: "Modiva Lint", price: 1799, comparePrice: 1999, category: "heels", collection: "heels", variants: { type: "size", options: ["35","36","37","38","39"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/17_6c8cad27-4dae-458d-8c22-521fa7873904.png?v=1767787949", description: "3.5-inch pointed toe slingback, premium matte vegan leather in lint tone." },
  { slug: "tressa-teal", title: "Tressa Teal", price: 1799, comparePrice: 1999, category: "heels", collection: "heels", variants: { type: "size", options: ["35","36","37","38","39"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/254.png?v=1767818723", description: "3.5-inch slim heel, rhinestone ankle strap, glossy patent finish in teal." },
  { slug: "tressa", title: "Tressa Black", price: 1799, comparePrice: 1999, category: "heels", collection: "heels", variants: { type: "size", options: ["35","36","37","38","39"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/261.png?v=1767786587", description: "3.5-inch slim heel, rhinestone ankle strap, glossy patent finish in black." },
  { slug: "velora-milk", title: "Velora Milk", price: 1699, comparePrice: 1999, category: "heels", collection: "heels", variants: { type: "size", options: ["35","36","37","38","39"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/103.png?v=1767437754", description: "3-inch block heel, premium matte finish in off-white, soft cushioned Texan insole." },
  { slug: "velora", title: "Velora Black", price: 1699, comparePrice: 1999, category: "heels", collection: "heels", variants: { type: "size", options: ["35","36","37","38","39"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/89.png?v=1767460150", description: "3-inch block heel, premium supreme suede in classic black, soft cushioned insole." },

  // ── BLOOM BOW COLLECTION ──────────────────────────────────────────────
  { slug: "fauxbow-brown", title: "Pearl Bloom Flower Clip (Pair)", price: 249, comparePrice: 399, category: "accessories", collection: "bow", variants: { type: "color", options: ["Black","Blush Pink","Mocha Brown","Maroon","Green"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/204_397638a6-1e93-4da9-9e40-e5177abaf59b.png?v=1767778718", description: "Soft organza fabric petals with pearl bead detailing. Sold as a pair." },
  { slug: "satin-swirl-clip-lint", title: "Rose Satin Swirl Clip (Pair)", price: 299, comparePrice: 449, category: "accessories", collection: "bow", variants: { type: "none", options: [] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/282.png?v=1770130960", description: "Handcrafted satin rosette, secure metal clip, multipurpose for heels, handbags & hair. Sold as a pair." },
  { slug: "satin-swirl-beige", title: "Satin Swirl Clip (Pair)", price: 359, comparePrice: 459, category: "accessories", collection: "bow", variants: { type: "color", options: ["Lint","Black","Beige"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/242.png?v=1767896660", description: "Handcrafted satin rosette, 3 color options, secure metal clip. Sold as a pair." },
  { slug: "fauxbow-maroon", title: "Ivory Pearl Bow Clip", price: 379, comparePrice: 479, category: "accessories", collection: "bow", variants: { type: "none", options: [] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/228.png?v=1767781810", description: "Organza fabric with lace, pearl drops & rhinestone detailing. Smooth back clip. Sold as a pair." },
  { slug: "fauxbow-black", title: "Gloss Bow Clip (Pair)", price: 399, comparePrice: 549, category: "accessories", collection: "bow", variants: { type: "color", options: ["Black","Brown","Maroon"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/189.png?v=1769796361", description: "High-gloss leather (PU) bow with rhinestone detailing. Sold as a pair." },
  { slug: "glitzknot", title: "Glitz Knot Bow Clip (Pair)", price: 399, comparePrice: 499, category: "accessories", collection: "bow", variants: { type: "none", options: [] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/219.png?v=1767780827", description: "Crystal bow-knot with high-shine rhinestone sheet detailing on metal alloy base. Sold as a pair." },

  // ── CRYSTAL CLIPS ─────────────────────────────────────────────────────
  { slug: "radiance-heart-crystal-clip-pair", title: "Radiance Heart Crystal Clip (Pair)", price: 399, comparePrice: 499, category: "accessories", collection: "clips", variants: { type: "color", options: ["Silver","Gold"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/155.png?v=1767726986", description: "Heart-shaped teardrop and round stone arrangement. Perfect for weddings & gifting. Sold as a pair." },
  { slug: "starlight-bloom-crystal-clip-pair", title: "Starlight Bloom Crystal Clip (Pair)", price: 299, comparePrice: 349, category: "accessories", collection: "clips", variants: { type: "color", options: ["Gold","Silver"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/181.png?v=1767734157", description: "Hand-set glass rhinestones in star-petal bloom. Polished metal alloy base. Sold as a pair." },
  { slug: "marquise-bloom-crystal-clip-pair", title: "Marquise Bloom Crystal Clip (Pair)", price: 449, comparePrice: 699, category: "accessories", collection: "clips", variants: { type: "color", options: ["Silver"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/138.png?v=1767706611", description: "Floral marquise-cut crystal blossom clip. Polished metal alloy base. Sold as a pair." },
  { slug: "radiant-frame-crystal-clip-pair", title: "Radiant Frame Crystal Clip (Pair)", price: 449, comparePrice: 649, category: "accessories", collection: "clips", variants: { type: "color", options: ["Silver","Gold"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/169.png?v=1767731563", description: "Vintage-inspired rectangular crystal frame clip. Polished metal alloy base. Sold as a pair." },
  { slug: "radiance-crown-crystal-clip-pair", title: "Radiance Crown Crystal Clip (Pair)", price: 429, comparePrice: 529, category: "accessories", collection: "clips", variants: { type: "color", options: ["Gold","Silver"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/143.png?v=1767707781", description: "Elongated crown-like clip with marquise and baguette stones. Sold as a pair." },
  { slug: "crystal-starburst-clip-pair", title: "Starburst Crystal Clip (Pair)", price: 449, comparePrice: 699, category: "accessories", collection: "clips", variants: { type: "color", options: ["Gold","Silver"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/133.png?v=1767705234", description: "Dramatic starburst with marquise, teardrop and round rhinestones. Sold as a pair." },
  { slug: "celestial-wings-crystal-clip-pair", title: "Celestial Wings Crystal Clip (Pair)", price: 559, comparePrice: 600, category: "accessories", collection: "clips", variants: { type: "color", options: ["Silver"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/129.png?v=1767702276", description: "Wing-motif crystal clip with marquise and round rhinestones. Sold as a pair." },
  { slug: "butterfly-bling-crystal-clip-pair", title: "Butterfly Bling Crystal Clip (Pair)", price: 399, comparePrice: 499, category: "accessories", collection: "clips", variants: { type: "color", options: ["Silver"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/118_5686a03b-fc5e-4e7f-950e-9c676f178510.png?v=1767700791", description: "Butterfly-shaped precision-set rhinestone clip. Sold as a pair." },
];

// ── COLLECTION DEFINITIONS ────────────────────────────────────────────────
export const CURATED_COLLECTIONS = {
  "the-date-edit": {
    title: "The Date Edit",
    subtitle: "Dressed to impress, effortlessly",
    slugs: ["clessia","crovia","butterfly-bling-crystal-clip-pair","radiance-heart-crystal-clip-pair","starlight-bloom-crystal-clip-pair","fauxbow-black","fauxbow-maroon","velora-milk","modiva-bgn","satin-swirl-clip-lint"],
  },
  "the-everyday-edit": {
    title: "The Everyday Edit",
    subtitle: "Comfort for the every-day woman",
    slugs: ["crovia-choclate-brown","fauxbow-brown","crovia","gloss-belle-mocha","tressa-teal","satin-swirl-beige","fauxbow-maroon","butterfly-bling-crystal-clip-pair","gloss-belle"],
  },
  "the-festive-edit": {
    title: "The Festive Edit",
    subtitle: "Celebrate in style",
    slugs: ["clessia-wine","crovia-choclate-brown","modiva-bgn","fauxbow-black","radiant-frame-crystal-clip-pair","radiance-crown-crystal-clip-pair","marquise-bloom-crystal-clip-pair","crystal-starburst-clip-pair","celestial-wings-crystal-clip-pair","modiva","velora","tressa","clessia"],
  },
} as const;

export type CuratedCollectionKey = keyof typeof CURATED_COLLECTIONS;

// ── HELPERS ───────────────────────────────────────────────────────────────
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCollection(key: string): Product[] {
  const col = CURATED_COLLECTIONS[key as CuratedCollectionKey];
  if (!col) return [];
  return col.slugs.map((s) => products.find((p) => p.slug === s)!).filter(Boolean);
}

export function getByCollection(col: "heels" | "clips" | "bow"): Product[] {
  return products.filter((p) => p.collection === col);
}

export function getClipons(): Product[] {
  return products.filter((p) => p.category === "accessories");
}

export function getHotDeals(): Product[] {
  return products.filter((p) => p.comparePrice > p.price).sort(
    (a, b) => (b.comparePrice - b.price) / b.comparePrice - (a.comparePrice - a.price) / a.comparePrice
  );
}

// ── SUPABASE DB TYPES ─────────────────────────────────────────────────────
// DB schema: variants = string[] (options only), variant_type = 'size'|'color'|'none'
// No 'collection' field in DB — we derive it from slug/category
interface DbProduct {
  id?: string;
  slug: string;
  title: string;
  price: number;
  compare_price: number;
  category: string;
  variant_type: string | null;
  variants: string[] | null;  // plain array of option values
  image: string;
  description: string;
  tags?: string[];
  active?: boolean;
  is_featured?: boolean;
  featured_tab?: string | null;
}

function deriveCollection(slug: string, category: string): Product['collection'] {
  if (category === 'heels') return 'heels';
  // Bow products: fauxbow-*, satin-swirl-*, glitzknot
  if (
    slug.includes('fauxbow') ||
    slug.includes('satin-swirl') ||
    slug.includes('glitzknot')
  ) {
    return 'bow';
  }
  return 'clips';
}

function mapDbProduct(row: DbProduct): Product {
  return {
    slug: row.slug,
    title: row.title,
    price: Number(row.price),
    comparePrice: Number(row.compare_price),
    category: row.category as Product['category'],
    collection: deriveCollection(row.slug, row.category),
    variants: {
      type: ((row.variant_type ?? 'none') as 'size' | 'color' | 'none'),
      options: Array.isArray(row.variants) ? row.variants : [],
    },
    image: row.image,
    images: Array.isArray((row as any).images) ? (row as any).images : [],
    video_url: (row as any).video_url || "",
    key_features: (row as any).key_features || "",
    other_info: (row as any).other_info || "",
    specs: Array.isArray((row as any).specs) ? (row as any).specs : [],
    feature_checks: (row as any).feature_checks || "",
    variant_label: (row as any).variant_label || "",
    promo_line: (row as any).promo_line || "",
    description: row.description,
    featured_tab: row.featured_tab ?? null,
  };
}

// ── ASYNC SUPABASE FUNCTIONS (with hardcoded fallback) ────────────────────

export async function getProductsFromDB(filters?: { category?: string; active?: boolean }): Promise<Product[]> {
  try {
    let query = supabase.from('products').select('*').eq('active', true);
    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      // Fallback to hardcoded
      let fallback = products;
      if (filters?.category) fallback = products.filter((p) => p.category === filters.category);
      return fallback;
    }
    return (data as DbProduct[]).map(mapDbProduct);
  } catch {
    let fallback = products;
    if (filters?.category) fallback = products.filter((p) => p.category === filters!.category);
    return fallback;
  }
}

export async function getProductBySlugFromDB(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (error) {
      // DB error → fall back to hardcoded
      return getProductBySlug(slug) ?? null;
    }
    if (data === null) {
      // Not in DB → fall back to hardcoded
      return getProductBySlug(slug) ?? null;
    }
    // Inactive product → don't show
    if ((data as DbProduct).active === false) return null;
    return mapDbProduct(data as DbProduct);
  } catch {
    return getProductBySlug(slug) ?? null;
  }
}

export async function getFeaturedProductsFromDB(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('active', true)
      .limit(8);
    if (error || !data || data.length === 0) {
      return products.slice(0, 8);
    }
    return (data as DbProduct[]).map(mapDbProduct);
  } catch {
    return products.slice(0, 8);
  }
}

export async function getTabProductsFromDB(tab: 'latest' | 'bestseller' | 'sale'): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured_tab', tab)
      .eq('active', true)
      .limit(4);
    if (error || !data || data.length === 0) return [];
    return (data as DbProduct[]).map(mapDbProduct);
  } catch {
    return [];
  }
}

/**
 * Fetch products for a site_category by slug.
 * If category_products entries exist for that category → return those (ordered by display_order).
 * Otherwise → call fallbackFn() so existing behaviour is preserved.
 */
export async function getProductsByCategorySlugFromDB(
  slug: string,
  fallbackFn: () => Promise<Product[]>
): Promise<Product[]> {
  try {
    const { data: catData } = await supabase
      .from('site_categories')
      .select('id')
      .eq('slug', slug)
      .single();

    if (catData) {
      const { data: cpData } = await supabase
        .from('category_products')
        .select('product_id')
        .eq('category_id', catData.id)
        .order('display_order', { ascending: true });

      if (cpData && cpData.length > 0) {
        const ids = (cpData as { product_id: string }[]).map((r) => r.product_id);
        const { data: prods } = await supabase
          .from('products')
          .select('*')
          .in('id', ids)
          .eq('active', true);

        if (prods && prods.length > 0) {
          // Preserve display_order from category_products
          const ordered = ids
            .map((id) => (prods as DbProduct[]).find((p) => p.id === id))
            .filter((p): p is DbProduct => Boolean(p))
            .map(mapDbProduct);
          if (ordered.length > 0) return ordered;
        }
      }
    }
  } catch { /* fall through to fallback */ }
  return fallbackFn();
}

export async function getCollectionProductsFromDB(slug: string): Promise<Product[]> {
  try {
    // Get collection id first
    const { data: col } = await supabase
      .from('collections')
      .select('id')
      .eq('slug', slug)
      .single();

    if (!col) return getCollection(slug);

    // Get linked product slugs ordered by display_order
    const { data: links } = await supabase
      .from('collection_products')
      .select('product_slug, display_order')
      .eq('collection_id', col.id)
      .order('display_order', { ascending: true });

    if (!links || links.length === 0) return getCollection(slug);

    const slugs = links.map((l: any) => l.product_slug);

    // Fetch products by slug
    const { data: productRows } = await supabase
      .from('products')
      .select('*')
      .in('slug', slugs)
      .eq('active', true);

    if (!productRows || productRows.length === 0) return getCollection(slug);

    // Return in display_order order
    const mapped = slugs
      .map((s: string) => (productRows as DbProduct[]).find((p) => p.slug === s))
      .filter((p): p is DbProduct => Boolean(p))
      .map((p) => mapDbProduct(p));

    return mapped.length > 0 ? mapped : getCollection(slug);
  } catch {
    return getCollection(slug);
  }
}

// ── Extended type for heels page (includes filter fields from DB) ──────────
export interface HeelProduct extends Product {
  heel_type: string | null;
  tags: string[];
}

export async function getHeelsForPageFromDB(): Promise<HeelProduct[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', 'heels')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return products.filter((p) => p.category === 'heels').map((p) => ({
        ...p,
        heel_type: null,
        tags: [],
      }));
    }

    return (data as (DbProduct & { heel_type?: string | null; tags?: string[] })[]).map((row) => ({
      slug: row.slug,
      title: row.title,
      price: Number(row.price),
      comparePrice: Number(row.compare_price),
      category: row.category as Product['category'],
      collection: 'heels' as Product['collection'],
      variants: {
        type: ((row.variant_type ?? 'none') as 'size' | 'color' | 'none'),
        options: Array.isArray(row.variants) ? row.variants : [],
      },
      image: row.image,
      description: row.description,
      featured_tab: row.featured_tab ?? null,
      heel_type: row.heel_type ?? null,
      tags: row.tags ?? [],
    }));
  } catch {
    return products.filter((p) => p.category === 'heels').map((p) => ({
      ...p,
      heel_type: null,
      tags: [],
    }));
  }
}

export type HeelsSettings = Record<string, string>;

export async function getHeelsSettings(): Promise<HeelsSettings> {
  try {
    const keys = [
      "heels_hero_bg_type","heels_hero_bg_url","heels_hero_slides","heels_hero_text_pos",
      "heels_hero_eyebrow","heels_hero_title","heels_hero_subtitle",
      "heels_hero_show_stats","heels_hero_stat1_val","heels_hero_stat1_label",
      "heels_hero_stat2_val","heels_hero_stat2_label","heels_hero_stat3_val","heels_hero_stat3_label",
      "heels_why_visible","heels_why_heading","heels_why_heading_italic",
      "heels_why_card1_icon","heels_why_card1_title","heels_why_card1_desc",
      "heels_why_card2_icon","heels_why_card2_title","heels_why_card2_desc",
      "heels_why_card3_icon","heels_why_card3_title","heels_why_card3_desc",
      "heels_why_footer_text",
    ];
    const { data } = await supabase.from("site_settings").select("key,value").in("key", keys);
    const m: HeelsSettings = {};
    (data ?? []).forEach(({ key, value }: { key: string; value: string }) => { m[key] = value; });
    return m;
  } catch {
    return {};
  }
}

// ── Generic category functions (for clips, bow, etc.) ─────────────────────

export async function getShopCategoryProducts(category: string): Promise<HeelProduct[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return products
        .filter((p) => p.category === category)
        .map((p) => ({ ...p, heel_type: null, tags: [] }));
    }

    return (data as (DbProduct & { heel_type?: string | null; tags?: string[] })[]).map((row) => ({
      slug: row.slug,
      title: row.title,
      price: Number(row.price),
      comparePrice: Number(row.compare_price),
      category: row.category as Product['category'],
      collection: deriveCollection(row.slug, row.category),
      variants: {
        type: ((row.variant_type ?? 'none') as 'size' | 'color' | 'none'),
        options: Array.isArray(row.variants) ? row.variants : [],
      },
      image: row.image,
      description: row.description,
      featured_tab: row.featured_tab ?? null,
      heel_type: row.heel_type ?? null,
      tags: row.tags ?? [],
    }));
  } catch {
    return products
      .filter((p) => p.category === category)
      .map((p) => ({ ...p, heel_type: null, tags: [] }));
  }
}

export async function getShopCategorySettings(prefix: string): Promise<HeelsSettings> {
  try {
    const keys = [
      `${prefix}_hero_bg_type`, `${prefix}_hero_bg_url`, `${prefix}_hero_slides`, `${prefix}_hero_text_pos`,
      `${prefix}_hero_eyebrow`, `${prefix}_hero_title`, `${prefix}_hero_subtitle`,
      `${prefix}_hero_show_stats`, `${prefix}_hero_stat1_val`, `${prefix}_hero_stat1_label`,
      `${prefix}_hero_stat2_val`, `${prefix}_hero_stat2_label`, `${prefix}_hero_stat3_val`, `${prefix}_hero_stat3_label`,
      `${prefix}_why_visible`, `${prefix}_why_heading`, `${prefix}_why_heading_italic`,
      `${prefix}_why_card1_icon`, `${prefix}_why_card1_title`, `${prefix}_why_card1_desc`,
      `${prefix}_why_card2_icon`, `${prefix}_why_card2_title`, `${prefix}_why_card2_desc`,
      `${prefix}_why_card3_icon`, `${prefix}_why_card3_title`, `${prefix}_why_card3_desc`,
      `${prefix}_why_footer_text`,
      `${prefix}_filter_types`,
    ];
    const { data } = await supabase.from("site_settings").select("key,value").in("key", keys);
    const m: HeelsSettings = {};
    (data ?? []).forEach(({ key, value }: { key: string; value: string }) => { m[key] = value; });
    return m;
  } catch {
    return {};
  }
}
