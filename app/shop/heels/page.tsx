import { Metadata } from "next";
import CollectionGrid from "@/components/CollectionGrid";
import { getProductsFromDB } from "@/lib/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Women's Heels",
  description: "Shop Classie's premium collection of women's heels — block heels, stilettos, slingbacks & more.",
};

export default async function HeelsPage() {
  const heels = await getProductsFromDB({ category: "heels", active: true });
  return (
    <CollectionGrid
      title="Women's Heels"
      subtitle="Classie Collection"
      products={heels}
    />
  );
}
