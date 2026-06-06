import { Metadata } from "next";
import CollectionGrid from "@/components/CollectionGrid";
import HeroSlider from "@/components/HeroSlider";
import { getProductsFromDB } from "@/lib/products";
import { getHeroSlidesFromDB } from "@/lib/slides";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Women's Heels",
  description: "Shop Classie's premium collection of women's heels — block heels, stilettos, slingbacks & more.",
};

export default async function HeelsPage() {
  const [heels, slides] = await Promise.all([
    getProductsFromDB({ category: "heels", active: true }),
    getHeroSlidesFromDB("heels"),
  ]);
  return (
    <>
      {slides.length > 0 && <HeroSlider slides={slides} />}
      <CollectionGrid
        title="Women's Heels"
        subtitle="Classie Collection"
        products={heels}
      />
    </>
  );
}
