import { Metadata } from "next";
import CollectionGrid from "@/components/CollectionGrid";
import { getByCollection } from "@/lib/products";

export const metadata: Metadata = {
  title: "Women's Heels",
  description: "Shop Classie's premium collection of women's heels — block heels, stilettos, slingbacks & more.",
};

export default function HeelsPage() {
  const heels = getByCollection("heels");
  return (
    <CollectionGrid
      title="Women's Heels"
      subtitle="Classie Collection"
      products={heels}
    />
  );
}
