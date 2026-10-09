"use client";

// Collections page (new layout). Copy is editable in Admin → Collections → New Page;
// the three big edit tiles come from Catalog → Collections.

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { ProductCard, type ListingProduct, type Occasion } from "@/components/shop/ShopListing";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { contentReader } from "@/lib/shopPageContent";

export interface SmallTile { name: string; sub: string; image: string; href: string }
export interface Look { name: string; heel: ListingProduct; clip: ListingProduct }

const NAVY = "#3B5373";
const serif = { fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif" };
const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
const short = (t: string) => t.replace(/\s*\(pair\)\s*/i, " ").trim();

function LookCard({ look }: { look: Look }) {
  const { addToCart } = useCart();
  const { heel, clip } = look;
  const heelNeedsSize = heel.variantType !== "none" && heel.options.length > 0;
  const clipNeedsColour = clip.variantType !== "none" && clip.options.length > 0;
  const [size, setSize] = useState("");
  const [colour, setColour] = useState(clipNeedsColour ? clip.options[0] : "");
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);

  const addBoth = () => {
    if (heelNeedsSize && !size) { setError(true); return; }
    addToCart({ slug: heel.slug, title: heel.title, price: heel.price, image: heel.image, quantity: 1, variant: size || undefined });
    addToCart({ slug: clip.slug, title: clip.title, price: clip.price, image: clip.image, quantity: 1, variant: colour || undefined });
    setAdded(true);
    setError(false);
  };

  return (
    <div className="bg-white flex flex-col shrink-0 w-[285px] md:w-auto snap-start">
      <div className="grid grid-cols-2">
        <Link href={`/products/${heel.slug}`} aria-label={heel.title}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={optimizeCloudinary(heel.image, 500)} alt={heel.title} loading="lazy" className="w-full aspect-square object-cover" />
        </Link>
        <Link href={`/products/${clip.slug}`} aria-label={clip.title}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={optimizeCloudinary(clip.image2 || clip.image, 500)} alt={clip.title} loading="lazy" className="w-full aspect-square object-cover" />
        </Link>
      </div>
      <div className="p-4 md:p-5 flex flex-col gap-2 flex-1">
        <p className="text-[21px] md:text-[24px] leading-tight" style={serif}>{look.name}</p>
        <p className="text-[11.5px] md:text-[12.5px] text-[#555]">
          <Link href={`/products/${heel.slug}`} className="hover:underline">{heel.title}</Link> · <Link href={`/products/${clip.slug}`} className="hover:underline">{short(clip.title)}</Link>
        </p>
        {heelNeedsSize && (
          <div className="flex flex-wrap gap-1.5 mt-1" role="group" aria-label="Heel size">
            {heel.options.map((o) => (
              <button key={o} type="button" onClick={() => { setSize(o); setError(false); }} aria-pressed={size === o}
                className={`w-10 h-9 border text-[12px] ${size === o ? "border-[#1a1a1a] font-semibold" : "border-[#D8D1C5]"}`}>{o}</button>
            ))}
          </div>
        )}
        {clipNeedsColour && clip.options.length > 1 && (
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Charm colour">
            {clip.options.map((o) => (
              <button key={o} type="button" onClick={() => setColour(o)} aria-pressed={colour === o}
                className={`px-3 h-9 border text-[12px] capitalize ${colour === o ? "border-[#1a1a1a] font-semibold" : "border-[#D8D1C5]"}`}>{o}</button>
            ))}
          </div>
        )}
        {error && <p className="text-[12px] text-[#b42318]">Choose a heel size first.</p>}
        <div className="flex justify-between items-center gap-3 mt-auto pt-2">
          <span className="text-[15px] font-semibold">{inr(heel.price + clip.price)}</span>
          {added
            ? <Link href="/cart" className="text-[11px] tracking-[0.12em] uppercase px-4 py-3 border border-[#3B5373]" style={{ color: NAVY }}>Added · View cart</Link>
            : <button type="button" onClick={addBoth} className="bg-[#3B5373] hover:bg-[#2a3d55] text-white text-[11px] tracking-[0.12em] uppercase px-4 py-3">Add both</button>}
        </div>
      </div>
    </div>
  );
}

export default function CollectionsView({ settings, edits, tiles, looks, heels, charms }: {
  settings: Record<string, string>;
  edits: Occasion[];
  tiles: SmallTile[];
  looks: Look[];
  heels: ListingProduct[];
  charms: ListingProduct[];
}) {
  const c = contentReader(settings);
  const [tab, setTab] = useState<"all" | "heels" | "charms">("all");
  const all = [...heels, ...charms];
  const list = tab === "heels" ? heels : tab === "charms" ? charms : all;
  const tabs: { id: typeof tab; label: string; n: number }[] = [
    { id: "all", label: "All", n: all.length },
    { id: "heels", label: "Heels", n: heels.length },
    { id: "charms", label: "Shoe Charms", n: charms.length },
  ];

  return (
    <>
      {/* 1 · Heading */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-10 pt-8 md:pt-16 pb-5 md:pb-9 flex flex-col md:flex-row md:justify-between md:items-end gap-3">
        <div className="flex flex-col gap-2 md:gap-3">
          <p className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase font-medium text-[#8a6a3a]">{c("col2_eyebrow")}</p>
          <h1 className="text-[40px] md:text-[64px] leading-none font-normal text-[#1a1a1a]" style={serif}>
            {c("col2_title")} <em style={{ color: NAVY }}>{c("col2_title_em")}</em>
          </h1>
        </div>
        {c("col2_text") && <p className="text-[13px] md:text-[14px] text-[#555] max-w-[380px] leading-relaxed">{c("col2_text")}</p>}
      </section>

      {/* 2 · Edits + small tiles */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-10 flex flex-col gap-2.5 md:gap-5">
        {edits.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 md:gap-5">
            {edits.map((e, i) => (
              <Link key={e.slug} href={`/shop/${e.slug}`} className={`relative block text-white overflow-hidden group ${i === 0 ? "col-span-2 md:col-span-1" : ""}`}>
                {e.image
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={optimizeCloudinary(e.image, 800)} alt={e.title} loading={i === 0 ? "eager" : "lazy"} className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] ${i === 0 ? "h-[230px]" : "h-[200px]"} md:h-[460px]`} />
                  : <div className={`w-full ${i === 0 ? "h-[230px]" : "h-[200px]"} md:h-[460px]`} style={{ background: NAVY }} />}
                <span className="absolute inset-x-0 bottom-0 px-3 md:px-6 pb-3 md:pb-6 pt-14 bg-gradient-to-t from-black/65 to-transparent flex flex-col gap-0.5 md:gap-1">
                  {e.tag && <span className="hidden md:block text-[10.5px] tracking-[0.24em] uppercase">{e.tag}</span>}
                  <span className="text-[20px] md:text-[34px] leading-tight" style={serif}>{e.title}</span>
                  <span className="hidden md:block text-[12px]">Shop the edit →</span>
                </span>
              </Link>
            ))}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-5 mt-1 md:mt-0">
          {tiles.map((t) => (
            <Link key={t.href} href={t.href} className="grid grid-cols-[84px_minmax(0,1fr)_auto] md:grid-cols-[150px_minmax(0,1fr)] items-center gap-3.5 md:gap-0 bg-[#F7F4EF] pr-4 md:pr-0 group">
              {t.image
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={optimizeCloudinary(t.image, 320)} alt={t.name} loading="lazy" className="w-[84px] h-[84px] md:w-[150px] md:h-[150px] object-cover" />
                : <div className="w-[84px] h-[84px] md:w-[150px] md:h-[150px] bg-[#EDE7DD]" />}
              <span className="md:px-6 flex flex-col gap-0.5 md:gap-1">
                <span className="text-[21px] md:text-[26px] leading-tight text-[#1a1a1a]" style={serif}>{t.name}</span>
                {t.sub && <span className="text-[11.5px] md:text-[12.5px] text-[#555]">{t.sub}</span>}
              </span>
              <span className="md:hidden text-[#1a1a1a]" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3 · Shop the look */}
      {c("col2_looks_show") !== "off" && looks.length > 0 && (
        <section className="mt-10 md:mt-20 bg-[#F7F4EF]">
          <div className="max-w-[1280px] mx-auto py-8 md:py-[72px] flex flex-col gap-4 md:gap-8">
            <div className="px-4 md:px-10 flex flex-col gap-2 md:gap-2.5">
              <p className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase font-medium text-[#8a6a3a]">{c("col2_looks_eyebrow")}</p>
              <h2 className="text-[28px] md:text-[46px] leading-[1.06] font-normal" style={serif}>{c("col2_looks_title")} <em style={{ color: NAVY }}>{c("col2_looks_title_em")}</em></h2>
            </div>
            <div className="flex md:grid md:grid-cols-3 gap-2.5 md:gap-5 overflow-x-auto [scrollbar-width:none] px-4 md:px-10 snap-x">
              {looks.map((l) => <LookCard key={l.heel.slug + l.clip.slug} look={l} />)}
            </div>
          </div>
        </section>
      )}

      {/* 4 · Everything */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-10 pt-10 md:pt-[72px] pb-14 md:pb-20 flex flex-col gap-5 md:gap-7">
        <h2 className="text-[28px] md:text-[40px] font-normal" style={serif}>{c("col2_all_title")}</h2>
        <div className="flex gap-6 md:gap-8 border-b border-[#ECEAE6] overflow-x-auto [scrollbar-width:none]" role="tablist">
          {tabs.map((x) => (
            <button key={x.id} type="button" role="tab" aria-selected={tab === x.id} onClick={() => setTab(x.id)}
              className={`shrink-0 py-3.5 text-[11.5px] md:text-[12px] tracking-[0.14em] uppercase border-b-2 -mb-px ${tab === x.id ? "border-[#3B5373] font-semibold text-[#1a1a1a]" : "border-transparent text-[#555]"}`}>
              {x.label} · {x.n}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2.5 md:gap-x-5 gap-y-7 md:gap-y-9">
          {list.map((p) => (
            <ProductCard key={p.slug} p={p} mode={heels.includes(p) ? "heels" : "charms"} wornFirst={false} hidePair />
          ))}
        </div>
      </section>
    </>
  );
}
