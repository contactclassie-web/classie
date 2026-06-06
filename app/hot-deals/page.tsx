import { Metadata } from "next";
import CollectionGrid from "@/components/CollectionGrid";
import { getHotDeals } from "@/lib/products";

export const metadata: Metadata = {
  title: "Hot Deals",
  description: "Shop Classie's best deals — premium heels and accessories at discounted prices.",
};

export default function HotDealsPage() {
  return (
    <>
      <div className="bg-[#3D4F5F] text-white py-12 text-center">
        <p className="text-[11px] tracking-[0.5em] uppercase text-white/50 mb-2">Limited Time</p>
        <h1 className="font-serif text-5xl md:text-6xl">Hot Deals 🔥</h1>
        <p className="text-white/70 text-sm mt-3">Up to 35% off — while stocks last</p>
      </div>
      <CollectionGrid
        title=""
        products={getHotDeals()}
      />
    </>
  );
}
