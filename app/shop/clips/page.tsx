import { Metadata } from "next";
import { getShopCategorySettings } from "@/lib/products";
import ShopCategoryPageClient from "@/components/ShopCategoryPageClient";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Buy Shoe Clips Online India — Rhinestone, Crystal & Bow Clips for Women | CLASSIE",
  description: "Shop CLASSIE shoe clips online in India — rhinestone shoe clips, crystal clips, bow clips, floral clips & more. Instantly transform any pair of heels or flats. Free shipping above ₹499. COD available.",
};

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

function mapRow(row: Record<string, unknown>) {
  return {
    slug: row.slug as string,
    title: row.title as string,
    price: Number(row.price),
    comparePrice: Number(row.compare_price ?? 0),
    category: (row.category === "clips" || row.category === "bow" || row.category === "shoe-charms" ? "accessories" : row.category) as "heels" | "accessories",
    collection: "clips" as "heels" | "clips" | "bow",
    variants: { type: "none" as const, options: [] },
    image: row.image as string ?? "",
    description: (row.description as string) ?? "",
    featured_tab: (row.featured_tab as string) ?? null,
    heel_type: (row.heel_type as string) ?? null,
    tags: (row.tags as string[]) ?? [],
  };
}

export default async function ClipsPage() {
  const [shoeCharmsRes, clipsRes, bowRes, settings, collectionsData] = await Promise.all([
    sb.from("products").select("*").eq("category", "shoe-charms").eq("active", true),
    sb.from("products").select("*").eq("category", "clips").eq("active", true),
    sb.from("products").select("*").eq("category", "bow").eq("active", true),
    getShopCategorySettings("clips"),
    sb.from("collections").select("*").eq("active", true).order("display_order", { ascending: true }),
  ]);

  const allProducts = [
    ...(shoeCharmsRes.data ?? []).map(mapRow),
    ...(clipsRes.data ?? []).map(mapRow),
    ...(bowRes.data ?? []).map(mapRow),
  ];

  const initialOccasions = (collectionsData.data ?? []).map((c) => ({
    title: c.title, slug: c.slug, image: c.image_url ?? "",
    tag_label: c.tag_label ?? "", image_position: c.image_position ?? "50% 50%",
  }));

  return (
    <ShopCategoryPageClient
      initialProducts={allProducts}
      initialSettings={settings}
      category="clips"
      settingsPrefix="clips"
      categoryLabel="Shoe Charms"
      activeCategorySlug="clips"
      initialOccasions={initialOccasions}
    />
  );
}
