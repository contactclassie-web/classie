import { Metadata } from "next";
import CollectionGrid from "@/components/CollectionGrid";
import { getByCollection, getClipons } from "@/lib/products";

export const metadata: Metadata = {
  title: "Clip-ons & Accessories",
  description: "Shop Classie's crystal clips, bow clips, satin swirls and shoe accessories.",
};

export default function ClipsPage() {
  const all = getClipons();
  const crystalClips = getByCollection("clips");
  const bow = getByCollection("bow");

  return (
    <CollectionGrid
      title="Clip-ons & Accessories"
      subtitle="Bloom Bow & Crystal"
      products={all}
      tabs={[
        { key: "all",    label: "All Clip-ons",     products: all },
        { key: "clips",  label: "Crystal Clips",    products: crystalClips },
        { key: "bow",    label: "Bloom Bow",         products: bow },
      ]}
    />
  );
}
