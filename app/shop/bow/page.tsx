import { Metadata } from "next";
import { getShopCategoryProducts, getShopCategorySettings } from "@/lib/products";
import ShopCategoryPageClient from "@/components/ShopCategoryPageClient";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Bow Collection — Classie",
  description: "Shop Classie's Bow Collection — romance in every step.",
};

export default async function BowPage() {
  const [products, settings] = await Promise.all([
    getShopCategoryProducts("bow"),
    getShopCategorySettings("bow"),
  ]);
  return (
    <ShopCategoryPageClient
      initialProducts={products}
      initialSettings={settings}
      category="bow"
      settingsPrefix="bow"
      categoryLabel="Bow Collection"
      activeCategorySlug="bow"
    />
  );
}
