import { Metadata } from "next";
import CollectionGrid from "@/components/CollectionGrid";
import { getCollectionProductsFromDB } from "@/lib/products";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/shop/the-everyday-edit" },
  title: "Everyday & Office Heels and Shoe Charms — The Everyday Edit",
  description: "Comfortable block and kitten heels with easy shoe charms for office and everyday wear, by CLASSIE. COD and free delivery across India.",
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
