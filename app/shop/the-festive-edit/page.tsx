import { Metadata } from "next";
import CollectionGrid from "@/components/CollectionGrid";
import { getCollection } from "@/lib/products";

export const metadata: Metadata = {
  title: "The Festive Edit",
  description: "Celebrate in style. Shop Classie's Festive Edit collection.",
};

export default function FestiveEditPage() {
  return (
    <CollectionGrid
      title="The Festive Edit"
      subtitle="Celebrate in style"
      products={getCollection("the-festive-edit")}
    />
  );
}
