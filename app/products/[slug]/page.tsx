import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { products, getProductBySlugFromDB, getProductsFromDB, getTabProductsFromDB, Product } from "@/lib/products";
import ProductDetailClient from "./ProductDetailClient";

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
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { fetch: (url: RequestInfo | URL, options?: RequestInit) => fetch(url, { ...options, cache: "no-store" }) } }
  );
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

  const product = await getProductBySlugFromDB(slug);
  if (!product) notFound();

  // Related products (same collection, exclude self)
  const allProducts = await getProductsFromDB({ active: true });
  const related = allProducts
    .filter((p) => p.collection === product.collection && p.slug !== product.slug)
    .slice(0, 4);

  // Bundle offers
  let bundleOffers: BundleOfferWithProduct[] = [];
  try {
    const { data: offerRows } = await supabase
      .from("product_bundle_offers")
      .select("*")
      .eq("main_product_slug", slug)
      .eq("active", true)
      .order("sort_order");

    if (offerRows && offerRows.length > 0) {
      const slugs = offerRows.map((r: any) => r.accessory_slug);
      const { data: accessoryRows } = await supabase
        .from("products")
        .select("*")
        .in("slug", slugs)
        .eq("active", true);

      if (accessoryRows) {
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
    }
  } catch {
    // silent fail
  }

  // Feature tiles from site_settings
  let featureTiles: FeatureTile[] = [];
  try {
    const { data: settingRow } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "feature_tiles")
      .maybeSingle();
    if (settingRow?.value) {
      const parsed = JSON.parse(settingRow.value);
      if (Array.isArray(parsed)) featureTiles = parsed;
    }
  } catch {
    // silent fail — use defaults in client
  }

  // Color variants
  let colorVariants: ColorVariant[] = [];
  try {
    const { data: myRow } = await supabase
      .from("product_color_variants")
      .select("*")
      .eq("product_slug", slug)
      .maybeSingle();
    if (myRow) {
      const { data: groupRows } = await supabase
        .from("product_color_variants")
        .select("*")
        .eq("group_id", myRow.group_id)
        .order("sort_order");
      if (groupRows && groupRows.length > 0) {
        // Fetch product images for each variant
        const slugs = groupRows.map((r: any) => r.product_slug);
        const { data: productRows } = await supabase
          .from("products")
          .select("slug,image")
          .in("slug", slugs);
        const imageMap: Record<string, string> = {};
        (productRows || []).forEach((p: any) => { imageMap[p.slug] = p.image; });
        colorVariants = groupRows.map((r: any) => ({ ...r, image: imageMap[r.product_slug] || "" }));
      }
    }
  } catch {
    // silent fail
  }

  // Collection products for "Shop the Full Collection"
  let latestProducts: Product[] = [];
  let bestsellerProducts: Product[] = [];
  try {
    latestProducts = await getTabProductsFromDB("latest");
    bestsellerProducts = await getTabProductsFromDB("bestseller");
    // If no DB data, use related as fallback
    if (latestProducts.length === 0) latestProducts = related;
    if (bestsellerProducts.length === 0) bestsellerProducts = related;
  } catch {
    latestProducts = related;
    bestsellerProducts = related;
  }

  // Fetch active reviews for this product
  let initialReviews: ProductReview[] = [];
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const reviewsRes = await fetch(`${siteUrl}/api/reviews?slug=${slug}`, { cache: "no-store" });
    if (reviewsRes.ok) {
      initialReviews = await reviewsRes.json();
    }
  } catch {
    // silent fail
  }

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
