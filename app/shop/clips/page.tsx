import { Metadata } from "next";
import CollectionGrid from "@/components/CollectionGrid";
import { getProductsFromDB } from "@/lib/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Clip-ons & Accessories",
  description: "Shop Classie's crystal clips, bow clips, satin swirls and shoe accessories.",
};

const BOW_SLUGS = ["fauxbow", "satin-swirl", "glitzknot"];

export default async function ClipsPage() {
  const allAccessories = await getProductsFromDB({ category: "accessories", active: true });

  const crystalClips = allAccessories.filter(
    (p) => !BOW_SLUGS.some((s) => p.slug.includes(s))
  );
  const bowProducts = allAccessories.filter(
    (p) => BOW_SLUGS.some((s) => p.slug.includes(s)) || p.slug.includes("bow")
  );

  return (
    <CollectionGrid
      title="Clip-ons & Accessories"
      subtitle="Bloom Bow & Crystal"
      products={allAccessories}
      tabs={[
        { key: "all",   label: "All Clip-ons",  products: allAccessories },
        { key: "clips", label: "Crystal Clips",  products: crystalClips },
        { key: "bow",   label: "Bloom Bow",      products: bowProducts },
      ]}
    />
  );
}
