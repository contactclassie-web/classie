import { getProductsFromDB } from "@/lib/products";
import { createClient } from "@supabase/supabase-js";
import CollectionsClient from "./CollectionsClient";

export const revalidate = 0;

async function getCategories() {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await sb
    .from("site_categories")
    .select("name,slug,image_url,description")
    .eq("active", true)
    .order("display_order");
  return data ?? [];
}

async function getCollectionsSettings() {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const keys = [
    "coll_hero_eyebrow","coll_hero_title","coll_hero_tagline","coll_hero_sub","coll_hero_image",
    "coll_stat1_val","coll_stat1_label","coll_stat2_val","coll_stat2_label","coll_stat3_val","coll_stat3_label",
    "coll_strip1_title","coll_strip1_desc","coll_strip2_title","coll_strip2_desc","coll_strip3_title","coll_strip3_desc",
    "coll_testimonial_text","coll_testimonial_author","coll_section_label",
  ];
  const { data } = await sb.from("site_settings").select("key,value").in("key", keys);
  const map: Record<string, string> = {};
  (data ?? []).forEach((r: { key: string; value: string }) => { map[r.key] = r.value; });
  return map;
}

export default async function CollectionsPage() {
  const [allProducts, categories, settings] = await Promise.all([
    getProductsFromDB({ active: true }),
    getCategories(),
    getCollectionsSettings(),
  ]);

  return (
    <CollectionsClient
      initialProducts={allProducts}
      categories={categories}
      initialSettings={settings}
    />
  );
}
