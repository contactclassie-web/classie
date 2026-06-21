import { Metadata } from "next";
import { getHeelsForPageFromDB, getHeelsSettings } from "@/lib/products";
import HeelsPageClient from "@/components/HeelsPageClient";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 0; // always fresh — no cache

export const metadata: Metadata = {
  title: "Women's Heels — Classie",
  description:
    "Shop Classie's premium collection of women's heels — block heels, sculpted heels, slim heels, slingbacks & more. Free shipping above ₹999. COD available.",
};

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default async function HeelsPage() {
  const [products, settings, collectionsData] = await Promise.all([
    getHeelsForPageFromDB(),
    getHeelsSettings(),
    sb.from("collections").select("*").eq("active", true).order("display_order", { ascending: true }),
  ]);

  const initialOccasions = (collectionsData.data ?? []).map((c) => ({
    title: c.title,
    slug: c.slug,
    image: c.image_url ?? "",
    tag_label: c.tag_label ?? "",
    image_position: c.image_position ?? "50% 50%",
  }));

  return <HeelsPageClient initialProducts={products} initialSettings={settings} initialOccasions={initialOccasions} />;
}
