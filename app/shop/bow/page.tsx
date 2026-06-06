import { Metadata } from "next";
import CollectionGrid from "@/components/CollectionGrid";
import { getByCollection } from "@/lib/products";

export const metadata: Metadata = {
  title: "Bloom Bow Collection",
  description: "Shop Classie's Bloom Bow collection — satin swirls, pearl bow clips and gloss bows.",
};

export default function BowPage() {
  return (
    <CollectionGrid
      title="Bloom Bow Collection"
      subtitle="Soft & Romantic"
      products={getByCollection("bow")}
    />
  );
}
