import type { Metadata } from "next";
import { getProductsFromDB } from "@/lib/products";
import { createClient } from "@supabase/supabase-js";
import CollectionsClient from "./CollectionsClient";

export const metadata: Metadata = {
  title: "All Collections — Shoe Clips, Bow Clips & Accessories",
  description: "Browse all CLASSIE collections — shoe clips, bow clips, rhinestone clips, crystal clips and festive accessories for women. Shop the full range.",
  alternates: { canonical: "https://classie.co.in/collections" },
};

export const revalidate = 3600;

async function getCategories() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
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
