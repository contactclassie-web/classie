import { Metadata } from "next";
import CollectionGrid from "@/components/CollectionGrid";
import { getCollectionProductsFromDB } from "@/lib/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "The Date Edit",
  description: "Dressed to impress, effortlessly. Shop Classie's Date Edit collection.",
};

export default async function DateEditPage() {
  const collectionProducts = await getCollectionProductsFromDB("the-date-edit");
  return (
    <CollectionGrid
      title="The Date Edit"
      subtitle="Dressed to impress, effortlessly"
      products={collectionProducts}
    />
  );
}
