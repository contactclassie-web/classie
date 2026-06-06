import { Metadata } from "next";
import CollectionGrid from "@/components/CollectionGrid";
import HeroSlider from "@/components/HeroSlider";
import { getProductsFromDB } from "@/lib/products";
import { getHeroSlidesFromDB } from "@/lib/slides";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Hot Deals",
  description: "Shop Classie's best deals — premium heels and accessories at discounted prices.",
};

export default async function HotDealsPage() {
  const [allProducts, slides] = await Promise.all([
    getProductsFromDB({ active: true }),
    getHeroSlidesFromDB("hot-deals"),
  ]);
  // Show products where compare_price > price, sorted by biggest discount first
  const hotDeals = allProducts
    .filter((p) => p.comparePrice > p.price)
    .sort(
      (a, b) =>
        (b.comparePrice - b.price) / b.comparePrice -
        (a.comparePrice - a.price) / a.comparePrice
    );

  return (
    <>
      {slides.length > 0 && <HeroSlider slides={slides} />}
      <div className="bg-[#3B5373] text-white py-12 text-center">
        <p className="text-[11px] tracking-[0.5em] uppercase text-white/50 mb-2">Limited Time</p>
        <h1 className="font-serif text-5xl md:text-6xl">Hot Deals 🔥</h1>
        <p className="text-white/70 text-sm mt-3">Up to 35% off — while stocks last</p>
      </div>
      <CollectionGrid
        title=""
        products={hotDeals}
      />
    </>
  );
}
