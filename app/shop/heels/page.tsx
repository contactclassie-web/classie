import { Metadata } from "next";
import { getHeelsForPageFromDB, getHeelsSettings } from "@/lib/products";
import HeelsPageClient from "@/components/HeelsPageClient";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Buy Women's Heels Online India — Block, Slingback & Sculpted Heels | CLASSIE",
  description:
    "Shop CLASSIE women's heels online in India — block heels, slingback heels, sculpted heels, slim heels & more. Premium quality, free shipping above ₹999, COD available. Buy heels for wedding, office, party & everyday wear.",
};

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default async function HeelsPage() {
  const [products, settings, collectionsData, filterSettingData, collectionProductsData] = await Promise.all([
    getHeelsForPageFromDB(),
    getHeelsSettings(),
    sb.from("collections").select("*").eq("active", true).order("display_order", { ascending: true }),
    sb.from("site_settings").select("value").eq("key", "heels_filter_heel_types").maybeSingle(),
    sb.from("collection_products").select("collection_id, product_slug"),
  ]);

  const initialOccasions = (collectionsData.data ?? []).map((c) => ({
    title: c.title,
    slug: c.slug,
    image: c.image_url ?? "",
    tag_label: c.tag_label ?? "",
    image_position: c.image_position ?? "50% 50%",
  }));

  // Build map: collection_slug → product_slugs[]
  const collectionSlugMap: Record<string, string[]> = {};
  const collectionIdToSlug: Record<string, string> = {};
  (collectionsData.data ?? []).forEach((c: any) => { collectionIdToSlug[c.id] = c.slug; });
  (collectionProductsData.data ?? []).forEach((row: any) => {
    const slug = collectionIdToSlug[row.collection_id];
    if (!slug) return;
    if (!collectionSlugMap[slug]) collectionSlugMap[slug] = [];
    collectionSlugMap[slug].push(row.product_slug);
  });

  let initialFilterTypes: string[] | undefined;
  if (filterSettingData.data?.value) {
    try {
      const parsed = JSON.parse(filterSettingData.data.value);
      if (Array.isArray(parsed) && parsed.length > 0) initialFilterTypes = parsed;
    } catch { /* ignore */ }
  }

  return <HeelsPageClient initialProducts={products} initialSettings={settings} initialOccasions={initialOccasions} initialFilterTypes={initialFilterTypes} collectionSlugMap={collectionSlugMap} />;
}
