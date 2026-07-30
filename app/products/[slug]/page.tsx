import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { products, getProductBySlugFromDB, getProductsFromDB, getTabProductsFromDB, Product } from "@/lib/products";
import ProductDetailClient from "./ProductDetailClient";
export const revalidate = 300; // 5 min cache — admin revalidation busts this

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export interface ProductReview {
  id: string;
  product_slug: string;
  product_id?: string;
  customer_name: string;
  rating: number;
  review_text: string;
  review_date: string;
  active: boolean;
  created_at: string;
}

// Server-side Supabase client (no-store)
function serverSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}

export interface BundleOfferWithProduct {
  id: string;
  accessory_slug: string;
  discount_type: string;
  discount_value: number;
  custom_label?: string;
  product: Product;
}

export interface FeatureTile {
  icon: string;
  title: string;
  desc: string;
}

export interface ColorVariant {
  id: string;
  product_slug: string;
  color_name: string;
  color_hex: string;
  sort_order: number;
  image?: string;
}

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlugFromDB(params.slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const supabase = serverSupabase();
  const { slug } = params;
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hrjvxwqvxvibtwyfoyca.supabase.co";
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_fO8FW4iIh9pTTYdYGZ3m9Q_VXMtKI6z";

  const product = await getProductBySlugFromDB(slug);
  if (!product) notFound();

  // ── Round 1: All independent queries in parallel ──────────────────────
  const [
    allProducts,
    offerRowsResult,
    settingRowResult,
    colorVariantFirstResult,
    latestProductsRaw,
    bestsellerProductsRaw,
    reviewsRes,
  ] = await Promise.all([
    getProductsFromDB({ active: true }),
    supabase.from("product_bundle_offers").select("*").eq("main_product_slug", slug).eq("active", true).order("sort_order"),
    supabase.from("site_settings").select("value").eq("key", "feature_tiles").maybeSingle(),
    supabase.from("product_color_variants").select("*").eq("product_slug", slug).limit(1),
    getTabProductsFromDB("latest").catch(() => [] as Product[]),
    getTabProductsFromDB("bestseller").catch(() => [] as Product[]),
    fetch(
      `${SUPABASE_URL}/rest/v1/product_reviews?product_slug=eq.${encodeURIComponent(slug)}&active=eq.true&order=review_date.desc,created_at.desc`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }, next: { revalidate: 300 } }
    ).catch(() => null),
  ]);

  const related = allProducts
    .filter((p) => p.collection === product.collection && p.slug !== product.slug)
    .slice(0, 4);

  // ── Round 2: Dependent queries in parallel ────────────────────────────
  const offerRows = offerRowsResult.data ?? [];
  const myRow = colorVariantFirstResult.data?.[0] ?? null;

  const [accessoryRowsResult, colorGroupResult] = await Promise.all([
    offerRows.length > 0
      ? supabase.from("products").select("*").in("slug", offerRows.map((r: any) => r.accessory_slug)).eq("active", true)
      : Promise.resolve({ data: [] }),
    myRow
      ? supabase.from("product_color_variants").select("*").eq("group_id", myRow.group_id).order("sort_order")
      : Promise.resolve({ data: [] }),
  ]);

  // ── Round 3: Final dependent query (product images for color variants) ─
  const groupRows = colorGroupResult.data ?? [];
  let variantProductRows: any[] = [];
  if (groupRows.length > 0) {
    const variantSlugs = groupRows.map((r: any) => r.product_slug);
    const { data } = await supabase.from("products").select("slug,image").in("slug", variantSlugs);
    variantProductRows = data ?? [];
  }

  // ── Assemble results ──────────────────────────────────────────────────

  // Bundle offers
  let bundleOffers: BundleOfferWithProduct[] = [];
  try {
    const accessoryRows = accessoryRowsResult.data ?? [];
    if (offerRows.length > 0 && accessoryRows.length > 0) {
      bundleOffers = offerRows
        .map((offer: any) => {
          const acc = (accessoryRows as any[]).find((p) => p.slug === offer.accessory_slug);
          if (!acc) return null;
          const p: Product = {
            slug: acc.slug,
            title: acc.title,
            price: Number(acc.price),
            comparePrice: Number(acc.compare_price),
            category: acc.category,
            collection: acc.category === "heels" ? "heels" : acc.slug.includes("fauxbow") || acc.slug.includes("satin-swirl") || acc.slug.includes("glitzknot") ? "bow" : "clips",
            variants: { type: acc.variant_type ?? "none", options: Array.isArray(acc.variants) ? acc.variants : [] },
            image: acc.image,
            images: Array.isArray(acc.images) ? acc.images : [],
            description: acc.description,
          };
          return { id: offer.id, accessory_slug: offer.accessory_slug, discount_type: offer.discount_type, discount_value: Number(offer.discount_value), custom_label: offer.custom_label || "", product: p };
        })
        .filter(Boolean) as BundleOfferWithProduct[];
    }
  } catch { /* silent fail */ }

  // Feature tiles
  let featureTiles: FeatureTile[] = [];
  try {
    if (settingRowResult.data?.value) {
      const parsed = JSON.parse(settingRowResult.data.value);
      if (Array.isArray(parsed)) featureTiles = parsed;
    }
  } catch { /* silent fail */ }

  // Color variants
  let colorVariants: ColorVariant[] = [];
  try {
    if (groupRows.length > 0) {
      const imageMap: Record<string, string> = {};
      variantProductRows.forEach((p: any) => { imageMap[p.slug] = p.image; });
      colorVariants = groupRows.map((r: any) => {
        const dbImage = r.image;
        const productImage = imageMap[r.product_slug] || "";
        return { ...r, image: (dbImage && typeof dbImage === "string" && dbImage.startsWith("[")) ? dbImage : productImage };
      });
    }
  } catch { /* silent fail */ }

  // Tab products
  const latestProducts = latestProductsRaw.length > 0 ? latestProductsRaw : related;
  const bestsellerProducts = bestsellerProductsRaw.length > 0 ? bestsellerProductsRaw : related;

  // Reviews
  let initialReviews: ProductReview[] = [];
  try {
    if (reviewsRes?.ok) initialReviews = await reviewsRes.json();
  } catch { /* silent fail */ }

  return (
    <ProductDetailClient
      product={product}
      related={related}
      bundleOffers={bundleOffers}
      featureTiles={featureTiles}
      latestProducts={latestProducts}
      bestsellerProducts={bestsellerProducts}
      colorVariants={colorVariants}
      initialReviews={initialReviews}
    />
  );
}

