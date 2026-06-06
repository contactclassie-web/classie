import { Metadata } from "next";
import CollectionGrid from "@/components/CollectionGrid";
import { getCollection } from "@/lib/products";

export const metadata: Metadata = {
  title: "The Everyday Edit",
  description: "Comfort for the every-day woman. Shop Classie's Everyday Edit collection.",
};

export default function EverydayEditPage() {
  return (
    <CollectionGrid
      title="The Everyday Edit"
      subtitle="Comfort for the every-day woman"
      products={getCollection("the-everyday-edit")}
    />
  );
}
