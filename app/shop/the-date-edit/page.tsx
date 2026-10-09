import { Metadata } from "next";
import CollectionGrid from "@/components/CollectionGrid";
import { getCollectionProductsFromDB } from "@/lib/products";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/shop/the-date-edit" },
  title: "Date Night Heels & Shoe Charms — The Date Edit",
  description: "Heels and crystal shoe charms for date nights and dinners — slingbacks, sculpted heels and sparkle clips by CLASSIE. COD and free delivery across India.",
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
