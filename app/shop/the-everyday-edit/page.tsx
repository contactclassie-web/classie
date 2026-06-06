import { Metadata } from "next";
import CollectionGrid from "@/components/CollectionGrid";
import { getCollectionProductsFromDB } from "@/lib/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "The Everyday Edit",
  description: "Comfort for the every-day woman. Shop Classie's Everyday Edit collection.",
};

export default async function EverydayEditPage() {
  const collectionProducts = await getCollectionProductsFromDB("the-everyday-edit");
  return (
    <CollectionGrid
      title="The Everyday Edit"
      subtitle="Comfort for the every-day woman"
      products={collectionProducts}
    />
  );
}
