import { Metadata } from "next";
import CollectionGrid from "@/components/CollectionGrid";
import HeroSlider from "@/components/HeroSlider";
import { getProductsFromDB, getProductsByCategorySlugFromDB } from "@/lib/products";
import { getHeroSlidesFromDB } from "@/lib/slides";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Women's Heels",
  description: "Shop Classie's premium collection of women's heels — block heels, stilettos, slingbacks & more.",
};

export default async function HeelsPage() {
  const [heels, slides] = await Promise.all([
    getProductsByCategorySlugFromDB("heels", () =>
      getProductsFromDB({ category: "heels", active: true })
    ),
    getHeroSlidesFromDB("heels"),
  ]);
  return (
    <>
      {slides.length > 0 && <HeroSlider slides={slides} />}

      {/* ── Editorial page header */}
      <div className="bg-[#faf8f6] py-16 text-center border-b border-gray-100">
        <p className="text-[11px] tracking-[0.5em] uppercase text-gray-400 mb-3">Collections</p>
        <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-[#1a1a1a]">Heels</h1>
        <p className="text-sm text-gray-400 mt-3 tracking-wide">Block heels, stilettos &amp; slingbacks</p>
      </div>

      <CollectionGrid
        title="Women's Heels"
        subtitle="Classie Collection"
        products={heels}
      />
    </>
  );
}
