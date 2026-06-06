import { Metadata } from "next";
import CollectionGrid from "@/components/CollectionGrid";
import { getCollection } from "@/lib/products";

export const metadata: Metadata = {
  title: "The Date Edit",
  description: "Dressed to impress, effortlessly. Shop Classie's Date Edit collection.",
};

export default function DateEditPage() {
  return (
    <CollectionGrid
      title="The Date Edit"
      subtitle="Dressed to impress, effortlessly"
      products={getCollection("the-date-edit")}
    />
  );
}
