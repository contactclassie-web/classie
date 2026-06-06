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
    <>
      {/* ── Editorial page header */}
      <div className="bg-[#faf8f6] py-16 text-center border-b border-gray-100">
        <p className="text-[11px] tracking-[0.5em] uppercase text-gray-400 mb-3">Collections</p>
        <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-[#1a1a1a]">Bloom Bow</h1>
        <p className="text-sm text-gray-400 mt-3 tracking-wide">Satin swirls &amp; romantic bows</p>
      </div>

      <CollectionGrid
        title="Bloom Bow Collection"
        subtitle="Soft & Romantic"
        products={bowProducts}
      />
    </>
  );
}
