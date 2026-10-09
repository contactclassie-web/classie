import Link from "next/link";
import { ProductCard, type ListingProduct } from "@/components/shop/ShopListing";
import { optimizeCloudinary } from "@/lib/cloudinary";

// Occasion edit page (/shop/the-date-edit etc.). Title, description and photo
// come from Admin → Products → Collections; products in the order set there.
export default function EditView({ title, description, image, tag, products, fallbackSub }: {
  title: string; description: string; image: string; tag: string; products: ListingProduct[]; fallbackSub: string;
}) {
  const serif = { fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif" };
  const heels = products.filter((p) => p.heelType || p.variantType === "size");
  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-2 bg-[#F7F4EF]">
        <div className="md:order-2">
          {image
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={optimizeCloudinary(image, 1200)} alt={title} className="w-full h-[220px] md:h-[380px] object-cover" fetchPriority="high" />
            : <div className="h-[120px] md:h-[380px]" />}
        </div>
        <div className="md:order-1 px-4 py-6 md:px-16 lg:pl-[8vw] md:py-10 flex flex-col justify-center gap-2 md:gap-3">
          {tag && <p className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase font-medium text-[#8a6a3a]">{tag}</p>}
          <h1 className="text-[40px] md:text-[64px] leading-none font-normal text-[#1a1a1a]" style={serif}>{title}</h1>
          <p className="text-[13.5px] md:text-[15px] text-[#4a4a4a] leading-relaxed max-w-[460px]">{description || fallbackSub}</p>
          <p className="text-[12.5px] text-[#555]">{products.length} {products.length === 1 ? "piece" : "pieces"}{heels.length ? " · heels in sizes 35–39" : ""}</p>
        </div>
      </section>
      <section className="max-w-[1280px] mx-auto px-4 md:px-10 pt-8 md:pt-12 pb-14 md:pb-20">
        {products.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2.5 md:gap-x-5 gap-y-7 md:gap-y-9">
            {products.map((p) => (
              <ProductCard key={p.slug} p={p} mode={heels.includes(p) ? "heels" : "charms"} wornFirst={false} hidePair />
            ))}
          </div>
        ) : (
          <p className="text-center text-[14px] text-[#555] py-10">New pieces are coming to this edit soon. <Link href="/collections" className="underline text-[#3B5373]">See all collections</Link></p>
        )}
        <p className="text-center mt-12"><Link href="/collections" className="text-[12px] tracking-[0.14em] uppercase underline text-[#3B5373]">See all collections →</Link></p>
      </section>
    </>
  );
}
