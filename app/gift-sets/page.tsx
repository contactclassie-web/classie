import type { Metadata } from "next";
import Link from "next/link";
import SetsGrid from "@/components/sets/SetsGrid";
import { loadGiftSets } from "@/lib/giftSetsServer";
import { setAvailable } from "@/lib/giftSets";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { withAmount } from "@/lib/homeConfig";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gift Sets — Shoe Clip Sets & Combos",
  description: "Curated gift sets of crystal, bow, pearl and jute shoe clips and heels from Classie. Each set costs less than buying the pieces separately. COD available across India.",
  alternates: { canonical: "https://www.classie.co.in/gift-sets" },
};

export default async function GiftSetsPage() {
  const { config, products, freeAmount, whatsapp } = await loadGiftSets();
  const p = config.page;
  const sets = config.sets.filter((s) => s.active && (s.askOnly || setAvailable(s, products)));
  const chips = p.chips.split(",").map((c) => c.trim()).filter(Boolean);

  return (
    <>
      {/* Banner */}
      <section className="bg-[#F7F4EF] md:grid md:grid-cols-[1fr_1.15fr] md:items-center">
        {p.bannerImage && (
          <div className="md:order-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={optimizeCloudinary(p.bannerImage, 1400)} alt="" className="w-full aspect-[4/3] md:aspect-[16/11] object-cover" />
          </div>
        )}
        <div className="px-5 pt-5 pb-8 md:px-14 md:py-12 grid gap-3 md:gap-4">
          <nav className="font-sans text-[11px] text-[#6b6b6b]"><Link href="/" className="hover:text-[#3B5373]">Home</Link> / Gift Sets</nav>
          {p.eyebrow && <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#3B5373]">{p.eyebrow}</span>}
          <h1 className="font-serif font-light text-[40px] md:text-[64px] leading-[1.02] text-[#1a1a1a]">
            {p.heading} {p.headingItalic && <em className="italic text-[#3B5373]">{p.headingItalic}</em>}
          </h1>
          {p.text && <p className="font-sans text-[13.5px] md:text-[15px] text-[#555] leading-relaxed max-w-[46ch]">{withAmount(p.text, freeAmount)}</p>}
          {chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {chips.map((c) => <span key={c} className="font-sans text-[10.5px] md:text-[11.5px] tracking-[0.05em] border border-[#d9cfbf] bg-white px-2.5 py-1.5 text-[#5a5245]">{withAmount(c, freeAmount)}</span>)}
            </div>
          )}
          {p.buttonText && sets.length > 0 && (
            <a href="#sets" className="justify-self-start mt-1 bg-[#3B5373] text-white font-sans text-[11px] tracking-[0.16em] uppercase px-5 py-3.5 hover:bg-[#2a3d55] transition-colors">{p.buttonText}</a>
          )}
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 md:px-10">
        {p.offerOn && p.offerTitle && (
          <div className="mt-6 md:mt-8 grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] gap-3 items-center border border-dashed border-[#B08D57] bg-[#FBF7F0] px-4 py-3">
            <span className="w-8 h-8 rounded-full bg-[#B08D57] text-white font-sans text-sm font-semibold grid place-items-center" aria-hidden>%</span>
            <div>
              <b className="block font-sans text-[13px] font-semibold text-[#1a1a1a]">{p.offerTitle}</b>
              {p.offerText && <span className="block font-sans text-[11.5px] text-[#6b6b6b] mt-0.5">{p.offerText}</span>}
            </div>
            {p.offerLinkText && (
              <Link href={p.offerLinkUrl || "/shop/clips"} className="col-start-2 md:col-start-auto justify-self-start font-sans text-[10.5px] tracking-[0.12em] uppercase text-[#3B5373] border-b border-[#3B5373]">{p.offerLinkText}</Link>
            )}
          </div>
        )}

        <section id="sets" className="py-8 md:py-14 scroll-mt-24">
          {sets.length > 0 ? (
            <SetsGrid sets={sets} products={products} />
          ) : (
            <div className="text-center grid gap-4 justify-items-center py-10">
              <p className="font-serif text-[22px] md:text-[28px] text-[#1a1a1a] max-w-[30ch]">{p.emptyText}</p>
              {whatsapp && (
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="bg-[#1E7A4C] text-white font-sans text-[11px] tracking-[0.16em] uppercase px-5 py-3.5">Message us on WhatsApp</a>
              )}
            </div>
          )}
        </section>

        {p.why.filter((w) => w.title).length > 0 && (
          <div className="grid md:grid-cols-3 gap-px bg-[#ECEAE6] border border-[#ECEAE6] mb-10 md:mb-14">
            {p.why.filter((w) => w.title).map((w, i) => (
              <div key={i} className="bg-white px-4 py-3.5 md:px-6 md:py-5 grid gap-0.5">
                <b className="font-serif font-normal text-[17px] md:text-[21px] text-[#1a1a1a]">{withAmount(w.title, freeAmount)}</b>
                {w.sub && <span className="font-sans text-[11.5px] md:text-[12.5px] text-[#6b6b6b]">{withAmount(w.sub, freeAmount)}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {(p.seoHeading || p.seoText) && (
        <section className="max-w-3xl mx-auto px-6 pb-12 text-center grid gap-3">
          {p.seoHeading && <h2 className="font-serif font-light text-[20px] md:text-[24px] text-[#1a1a1a]">{p.seoHeading}</h2>}
          {p.seoText && <p className="font-sans text-[12.5px] md:text-[13px] text-[#6b6b6b] leading-relaxed">{p.seoText}</p>}
        </section>
      )}
    </>
  );
}
