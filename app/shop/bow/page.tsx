import { Metadata } from "next";
import { getShopCategoryProducts, getShopCategorySettings } from "@/lib/products";
import ShopCategoryPageClient from "@/components/ShopCategoryPageClient";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Bow Clips for Shoes — Satin, Jute & Pearl Bow Shoe Clips",
  description: "Shop CLASSIE bow clips for shoes — handcrafted satin, jute and pearl bow shoe clips for women. Perfect for heels, flats and sandals. Free shipping above ₹499.",
};

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default async function BowPage() {
  const [products, settings, collectionsData] = await Promise.all([
    getShopCategoryProducts("bow"),
    getShopCategorySettings("bow"),
    sb.from("collections").select("*").eq("active", true).order("display_order", { ascending: true }),
  ]);
  const initialOccasions = (collectionsData.data ?? []).map((c) => ({
    title: c.title, slug: c.slug, image: c.image_url ?? "",
    tag_label: c.tag_label ?? "", image_position: c.image_position ?? "50% 50%",
  }));
  return (
    <ShopCategoryPageClient
      initialProducts={products}
      initialSettings={settings}
      category="bow"
      settingsPrefix="bow"
      categoryLabel="Bow Collection"
      activeCategorySlug="bow"
      initialOccasions={initialOccasions}
    />
  );
}
