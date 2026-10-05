import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SetBuyBox from "@/components/sets/SetBuyBox";
import SetGallery from "@/components/sets/SetGallery";
import { SetCard } from "@/components/sets/SetCard";
import { loadGiftSets } from "@/lib/giftSetsServer";
import { setAvailable, setCompareAt, setImages, setKind } from "@/lib/giftSets";
import { optimizeCloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

async function findSet(slug: string) {
  const data = await loadGiftSets();
  const set = data.config.sets.find((s) => s.slug === slug && s.active && (s.askOnly || setAvailable(s, data.products)));
  return { data, set };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data, set } = await findSet(params.slug);
  if (!set) return { title: "Gift Set" };
  const img = setImages(set, data.products)[0];
  return {
    title: `${set.name} — Gift Set`,
    description: set.description || `${set.name}: a Classie gift set.`,
    alternates: { canonical: `https://www.classie.co.in/gift-sets/${set.slug}` },
    openGraph: img ? { images: [{ url: optimizeCloudinary(img, 1200) }] } : undefined,
  };
}

export default async function GiftSetPage({ params }: { params: { slug: string } }) {
  const { data, set } = await findSet(params.slug);
  if (!set) notFound();
  const { products, config, whatsapp, freeAmount } = data;
  const pieceImages = set.items.map((it) => products[it.slug]?.image).filter((u): u is string => !!u);
  const more = config.sets.filter((s) => s.id !== set.id && s.active && (s.askOnly || setAvailable(s, products))).slice(0, 3);

  return (
    <>
      <div className="max-w-[1200px] mx-auto px-4 md:px-10 pt-4">
        <nav className="font-sans text-[11px] text-[#6b6b6b]">
          <Link href="/" className="hover:text-[#3B5373]">Home</Link> / <Link href="/gift-sets" className="hover:text-[#3B5373]">Gift Sets</Link> / {set.name}
        </nav>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-10 pt-4 pb-10 md:pb-16 grid gap-6 md:grid-cols-[1.1fr_1fr] md:gap-12 md:items-start">
        <div className="md:sticky md:top-24">
          <SetGallery setImages={set.images} pieceImages={pieceImages} name={set.name} />
        </div>
        <div className="grid gap-5">
          <SetBuyBox
            set={set}
            products={products}
            compare={setCompareAt(set, products)}
            kind={setKind(set, products)}
            image={setImages(set, products)[0] ?? ""}
            whatsapp={whatsapp}
            freeAmount={freeAmount}
          />
          <div className="border-t border-[#ECEAE6]">
            {set.description && (
              <details open className="border-b border-[#ECEAE6] group">
                <summary className="list-none cursor-pointer flex justify-between py-3.5 font-sans text-[13px] font-medium text-[#1a1a1a]">Why this set <span className="text-[#6b6b6b] group-open:rotate-45 transition-transform">+</span></summary>
                <p className="pb-4 font-sans text-[12.5px] text-[#555] leading-relaxed">{set.description}</p>
              </details>
            )}
            {config.page.giftNote && (
              <details className="border-b border-[#ECEAE6] group">
                <summary className="list-none cursor-pointer flex justify-between py-3.5 font-sans text-[13px] font-medium text-[#1a1a1a]">Gifting <span className="text-[#6b6b6b] group-open:rotate-45 transition-transform">+</span></summary>
                <p className="pb-4 font-sans text-[12.5px] text-[#555] leading-relaxed">{config.page.giftNote}</p>
              </details>
            )}
            {config.page.returnNote && (
              <details className="border-b border-[#ECEAE6] group">
                <summary className="list-none cursor-pointer flex justify-between py-3.5 font-sans text-[13px] font-medium text-[#1a1a1a]">Returns on sets <span className="text-[#6b6b6b] group-open:rotate-45 transition-transform">+</span></summary>
                <p className="pb-4 font-sans text-[12.5px] text-[#555] leading-relaxed">{config.page.returnNote}</p>
              </details>
            )}
          </div>
        </div>
      </div>

      {more.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-4 md:px-10 pb-14">
          <div className="flex items-end justify-between mb-5 md:mb-8">
            <h2 className="font-serif font-light text-[28px] md:text-[40px] text-[#1a1a1a]">More <em className="italic text-[#3B5373]">sets</em></h2>
            <Link href="/gift-sets" className="font-sans text-[11px] tracking-[0.14em] uppercase text-[#3B5373] border-b border-[#3B5373] pb-0.5">All sets</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-8 md:gap-x-7">
            {more.map((s) => <SetCard key={s.id} set={s} products={products} />)}
          </div>
        </section>
      )}
    </>
  );
}
