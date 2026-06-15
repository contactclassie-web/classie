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

export default async function CollectionsPage() {
  const [allProducts, categories] = await Promise.all([
    getProductsFromDB({ active: true }),
    getCategories(),
  ]);

  return (
    <CollectionsClient
      initialProducts={allProducts}
      categories={categories}
    />
  );
}
