import { Metadata } from "next";
import CollectionGrid from "@/components/CollectionGrid";
import HeroSlider from "@/components/HeroSlider";
import { getProductsFromDB } from "@/lib/products";
import { getHeroSlidesFromDB } from "@/lib/slides";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Clip-ons & Accessories",
  description: "Shop Classie's crystal clips, bow clips, satin swirls and shoe accessories.",
};

const BOW_SLUGS = ["fauxbow", "satin-swirl", "glitzknot"];

export default async function ClipsPage() {
  const [allAccessories, slides] = await Promise.all([
    getProductsFromDB({ category: "accessories", active: true }),
    getHeroSlidesFromDB("clips"),
  ]);

  const crystalClips = allAccessories.filter(
    (p) => !BOW_SLUGS.some((s) => p.slug.includes(s))
  );
  const bowProducts = allAccessories.filter(
    (p) => BOW_SLUGS.some((s) => p.slug.includes(s)) || p.slug.includes("bow")
  );

  return (
    <>
      {slides.length > 0 && <HeroSlider slides={slides} />}

      {/* ── Editorial page header */}
      <div className="bg-[#faf8f6] py-16 text-center border-b border-gray-100">
        <p className="text-[11px] tracking-[0.5em] uppercase text-gray-400 mb-3">Collections</p>
        <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-[#1a1a1a]">Clip-ons</h1>
        <p className="text-sm text-gray-400 mt-3 tracking-wide">Crystal clips &amp; statement pieces</p>
      </div>

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
    </>
  );
}
