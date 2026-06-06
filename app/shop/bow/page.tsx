import { Metadata } from "next";
import CollectionGrid from "@/components/CollectionGrid";
import { getProductsFromDB } from "@/lib/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Bloom Bow Collection",
  description: "Shop Classie's Bloom Bow collection — satin swirls, pearl bow clips and gloss bows.",
};

const BOW_KEYWORDS = ["fauxbow", "satin-swirl", "glitzknot", "bow"];

export default async function BowPage() {
  const accessories = await getProductsFromDB({ category: "accessories", active: true });
  const bowProducts = accessories.filter(
    (p) => BOW_KEYWORDS.some((kw) => p.slug.includes(kw))
  );

  return (
    <CollectionGrid
      title="Bloom Bow Collection"
      subtitle="Soft & Romantic"
      products={bowProducts}
    />
  );
}
