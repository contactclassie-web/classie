import { Metadata } from "next";
import { getShopCategoryProducts, getShopCategorySettings } from "@/lib/products";
import ShopCategoryPageClient from "@/components/ShopCategoryPageClient";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Rhinestone Clip-ons — Classie",
  description: "Shop Classie's Rhinestone Clip-ons — transform any heel in seconds.",
};

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { global: { fetch: (url: RequestInfo | URL, options?: RequestInit) => fetch(url, { ...options, cache: "no-store" }) } });

export default async function ClipsPage() {
  const [products, settings, collectionsData] = await Promise.all([
    getShopCategoryProducts("clips"),
    getShopCategorySettings("clips"),
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
      category="clips"
      settingsPrefix="clips"
      categoryLabel="Clip-ons"
      activeCategorySlug="clips"
      initialOccasions={initialOccasions}
    />
  );
}
