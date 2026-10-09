import { Metadata } from "next";
import CollectionGrid from "@/components/CollectionGrid";
import { getCollectionProductsFromDB } from "@/lib/products";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/shop/the-festive-edit" },
  title: "Wedding & Festive Heels and Shoe Charms — The Festive Edit",
  description: "Heels with crystal shoe clips for weddings, sangeet, mehendi and Diwali, by CLASSIE. COD and free delivery across India.",
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
