import { Metadata } from "next";
import CollectionGrid from "@/components/CollectionGrid";
import { getCollectionProductsFromDB } from "@/lib/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "The Festive Edit",
  description: "Celebrate in style. Shop Classie's Festive Edit collection.",
};

export default async function FestiveEditPage() {
  const collectionProducts = await getCollectionProductsFromDB("the-festive-edit");
  return (
    <CollectionGrid
      title="The Festive Edit"
      subtitle="Celebrate in style"
      products={collectionProducts}
    />
  );
}
