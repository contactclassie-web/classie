import { Metadata } from "next";
import { getShopCategoryProducts, getShopCategorySettings } from "@/lib/products";
import ShopCategoryPageClient from "@/components/ShopCategoryPageClient";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Rhinestone Clip-ons — Classie",
  description: "Shop Classie's Rhinestone Clip-ons — transform any heel in seconds.",
};

export default async function ClipsPage() {
  const [products, settings] = await Promise.all([
    getShopCategoryProducts("clips"),
    getShopCategorySettings("clips"),
  ]);
  return (
    <ShopCategoryPageClient
      initialProducts={products}
      initialSettings={settings}
      category="clips"
      settingsPrefix="clips"
      categoryLabel="Clip-ons"
      activeCategorySlug="clips"
    />
  );
}
