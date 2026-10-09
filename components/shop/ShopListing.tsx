"use client";

// Heels page and Shoe Charms page (new layout). All copy comes from
// lib/shopPageContent.ts and is editable in Admin → Heels / Shoe Charms → New Page.

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Heart, SlidersHorizontal, X } from "lucide-react";
import { useWishlist } from "@/components/WishlistContext";
import { useCart } from "@/components/CartContext";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { contentReader, parseTypeNames } from "@/lib/shopPageContent";

export interface ListingProduct {
  slug: string;
  title: string;
  price: number;
  comparePrice: number;
  image: string;
  image2: string;          // second photo ("on a shoe" for charms), "" if none
  tags: string[];
  heelType: string;        // normalised, e.g. "Block Heel"
  variantType: "size" | "color" | "none";
  options: string[];
  isNew: boolean;
}

export interface Occasion { title: string; slug: string; image: string; tag: string }

interface Props {
  mode: "heels" | "charms";
  settings: Record<string, string>;
  products: ListingProduct[];
  heroImage: string;
  occasions?: Occasion[];
  occasionMap?: Record<string, string[]>; // occasion slug → product slugs
  typeTags?: string[];                     // charms: tags shown as buttons, in order
  bandImages?: string[];                   // heels band photos (fallbacks)
  charmFrom?: number;
  giftFrom?: number;
  giftImage?: string;
  freeFrom?: number | null;
  children?: React.ReactNode;              // long SEO text, shown under "Read more"
}

const NAVY = "#3B5373";
const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
const serif = { fontFamily: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif" };

const ICONS = {
  shoe: <path d="M3 17h13l4-3v-2l-6-1-3-4H8L6 12H3z" />,
  returns: <><path d="M4 12a8 8 0 1 0 2.4-5.7" /><path d="M4 4v4.3h4.3" /></>,
  cash: <><rect x="3" y="6" width="18" height="12" rx="1.5" /><circle cx="12" cy="12" r="2.6" /></>,
  truck: <><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.6" /><circle cx="17" cy="17.5" r="1.6" /></>,
};
function Icon({ d, size = 26 }: { d: React.ReactNode; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">{d}</svg>;
}

function chipCls(active: boolean) {
  return `shrink-0 rounded-full border px-4 md:px-[18px] py-2.5 text-[12px] md:text-[12.5px] transition-colors ${active ? "bg-[#3B5373] border-[#3B5373] text-white" : "bg-white border-[#D8D1C5] text-[#1a1a1a] hover:border-[#3B5373]"}`;
}
function boxCls(active: boolean) {
  return `border px-3.5 py-2 text-[12px] transition-colors ${active ? "border-[#1a1a1a] font-semibold bg-white" : "border-[#D8D1C5] bg-white hover:border-[#1a1a1a]"}`;
}

// ── Product card ──────────────────────────────────────────────────────────
export function ProductCard({ p, mode, wornFirst, hidePair }: { p: ListingProduct; mode: "heels" | "charms"; wornFirst: boolean; hidePair: boolean }) {
  const { isWished, toggle } = useWishlist();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const needsChoice = p.options.length > 0 && p.variantType !== "none";
  const discount = p.comparePrice > p.price ? Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100) : 0;
  const title = hidePair ? p.title.replace(/\s*\(pair\)\s*/i, " ").trim() : p.title.trim();
  const first = wornFirst && p.image2 ? p.image2 : p.image;
  const second = wornFirst && p.image2 ? p.image : p.image2;
  const sub = mode === "heels"
    ? p.heelType
    : p.variantType === "color" && p.options.length ? p.options.map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(", ") : "";

  const quickAdd = (e: React.MouseEvent) => {
    if (needsChoice) return; // the link opens the product page to choose
    e.preventDefault();
    addToCart({ slug: p.slug, title: p.title, price: p.price, image: p.image, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link href={`/products/${p.slug}`} className="group flex flex-col gap-2.5">
      <div className="relative overflow-hidden bg-[#F2EFEA] aspect-square">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={optimizeCloudinary(first, 600)} alt={title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" />
        {second && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={optimizeCloudinary(second, 600)} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-0 md:group-hover:opacity-100 transition-opacity duration-500" />
        )}
        {discount > 0 && <span className="absolute top-2.5 left-2.5 bg-[#1a1a1a] text-white text-[10px] px-1.5 py-0.5">-{discount}%</span>}
        <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1.5">
          {p.isNew && <span className="bg-[#3B5373] text-white text-[10px] px-1.5 py-0.5 tracking-wide">NEW</span>}
          <button
            type="button"
            aria-label={isWished(p.slug) ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(p.slug); }}
            className="w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm"
          >
            <Heart className={`w-3.5 h-3.5 ${isWished(p.slug) ? "fill-red-500 stroke-red-500" : "stroke-gray-500"}`} strokeWidth={1.8} />
          </button>
        </div>
        <span
          onClick={quickAdd}
          className="hidden md:block absolute bottom-0 inset-x-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-[#3B5373] text-white text-[11px] tracking-[0.18em] uppercase py-3 text-center"
        >
          {added ? "Added ✓" : needsChoice ? (p.variantType === "size" ? "Select size →" : "Choose colour →") : "Quick add"}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[13px] md:text-[14px] text-[#1a1a1a] leading-snug line-clamp-2">{title}</span>
        {sub && <span className="text-[11.5px] md:text-[12px] text-[#6b6b6b] line-clamp-1">{sub}</span>}
        <span className="text-[13px] md:text-[14px] font-semibold text-[#1a1a1a]">
          {inr(p.price)}
          {discount > 0 && <span className="ml-1.5 font-normal text-[11px] md:text-[12px] text-[#8a8a8a] line-through">{inr(p.comparePrice)}</span>}
        </span>
      </div>
    </Link>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────
export default function ShopListing(props: Props) {
  const { mode, settings, products, occasions = [], occasionMap = {}, typeTags = [], bandImages = [], charmFrom = 0, giftFrom = 0, giftImage = "", freeFrom = null } = props;
  const P = mode === "heels" ? "hp2_" : "cp2_";
  const c = contentReader(settings);
  const k = (name: string) => c(P + name);

  const [occasion, setOccasion] = useState<string | null>(null);
  const [heelTypes, setHeelTypes] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [charmType, setCharmType] = useState<string | null>(null);
  const [sort, setSort] = useState<"featured" | "newest" | "price-asc" | "price-desc">("featured");
  const [sheetOpen, setSheetOpen] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Links like /shop/clips?type=Bow%20Shoe%20Charms or /shop/heels?occasion=the-date-edit
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const type = q.get("type");
    if (type && mode === "charms") setCharmType(type);
    const occ = q.get("occasion");
    if (occ && mode === "heels") setOccasion(occ);
  }, [mode]);

  const allHeelTypes = useMemo(
    () => Array.from(new Set(products.map((p) => p.heelType).filter(Boolean))).sort(),
    [products],
  );
  const allSizes = useMemo(
    () => Array.from(new Set(products.filter((p) => p.variantType === "size").flatMap((p) => p.options)))
      .filter((s) => s.trim() !== "").sort((a, b) => Number(a) - Number(b)),
    [products],
  );
  const typeNames = parseTypeNames(c("cp2_type_names"));
  const typeLabel = (tag: string) => typeNames[tag.toLowerCase()] || tag;
  const hasTag = (p: ListingProduct, tag: string) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase());

  const filtered = useMemo(() => {
    let list = [...products];
    if (mode === "heels") {
      if (occasion) {
        const slugs = occasionMap[occasion];
        list = slugs?.length ? list.filter((p) => slugs.includes(p.slug)) : list.filter((p) => p.tags.some((t) => t.toLowerCase().includes(occasion.replace(/^the-|-edit$/g, ""))));
      }
      if (heelTypes.length) list = list.filter((p) => heelTypes.includes(p.heelType));
      if (sizes.length) list = list.filter((p) => p.variantType === "size" && p.options.some((o) => sizes.includes(o)));
    } else if (charmType) {
      list = list.filter((p) => hasTag(p, charmType));
    }
    if (sort === "featured") list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, mode, occasion, heelTypes, sizes, charmType, sort, occasionMap]);

  const anyFilter = !!occasion || heelTypes.length > 0 || sizes.length > 0 || !!charmType;
  const clearAll = () => { setOccasion(null); setHeelTypes([]); setSizes([]); setCharmType(null); };
  const toggleIn = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  // Facts line under the title
  const prices = products.map((p) => p.price).filter((n) => n > 0);
  const lowest = prices.length ? Math.min(...prices) : 0;
  const autoFacts = mode === "heels"
    ? [allSizes.length ? `Sizes ${allSizes[0]}–${allSizes[allSizes.length - 1]}` : "", lowest ? `From ${inr(lowest)}` : "", "Size exchange in 7 days"]
    : ["Sold as a pair", lowest ? `From ${inr(lowest)}` : "", "No glue, no holes"];
  const facts = (k("facts") ? k("facts").split("·") : autoFacts).map((s) => s.trim()).filter(Boolean);

  const show = (name: string) => k(name) !== "off";
  const wornFirst = mode === "charms" && c("cp2_card_photo") !== "main";
  const hidePair = mode === "charms" && c("cp2_hide_pair") !== "show";

  // Band after the first 4 products
  const band = mode === "heels" ? (show("cs_show") && (
    <div key="band" className="col-span-full grid grid-cols-1 md:grid-cols-[400px_minmax(0,1fr)] text-white my-2 md:my-4" style={{ background: NAVY }}>
      <div className="grid grid-cols-3 md:order-2 md:h-full">
        {[1, 2, 3].map((n, i) => {
          const src = k(`cs_img${n}`) || bandImages[i] || "";
          return src
            // eslint-disable-next-line @next/next/no-img-element
            ? <img key={n} src={optimizeCloudinary(src, 500)} alt="A CLASSIE shoe charm on a heel" loading="lazy" className="w-full h-[130px] md:h-full md:min-h-[320px] object-cover" />
            : <div key={n} className="h-[130px] md:h-full md:min-h-[320px] bg-white/10" />;
        })}
      </div>
      <div className="md:order-1 px-4 py-6 md:p-12 flex flex-col justify-center gap-3">
        <p className="text-[10px] md:text-[10.5px] tracking-[0.3em] uppercase text-[#E6D3B3]">{k("cs_eyebrow")}</p>
        <h2 className="text-[28px] md:text-[36px] leading-[1.1] font-normal" style={serif}>{k("cs_title")} <em>{k("cs_title_em")}</em></h2>
        {k("cs_text") && <p className="hidden md:block text-[13.5px] text-white/90 leading-relaxed">{k("cs_text")}</p>}
        <Link href="/shop/clips" className="mt-1 self-stretch md:self-start text-center border border-white/80 hover:bg-white hover:text-[#3B5373] transition-colors text-[11px] tracking-[0.14em] uppercase px-5 py-3.5">
          {k("cs_button")}{charmFrom ? ` from ${inr(charmFrom)}` : ""}
        </Link>
      </div>
    </div>
  )) : (show("gift_show") && (
    <div key="band" className="col-span-full grid grid-cols-[120px_minmax(0,1fr)] md:grid-cols-[minmax(0,1fr)_420px] bg-[#F7F4EF] my-2 md:my-4">
      {(k("gift_img") || giftImage) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={optimizeCloudinary(k("gift_img") || giftImage, 700)} alt="A CLASSIE gift set" loading="lazy" className="w-full h-full min-h-[140px] md:h-[300px] object-cover md:order-2" />
      )}
      <div className="md:order-1 p-4 md:p-12 flex flex-col justify-center gap-2 md:gap-3">
        <p className="hidden md:block text-[10.5px] tracking-[0.3em] uppercase text-[#8a6a3a]">{k("gift_eyebrow")}</p>
        <h2 className="text-[21px] md:text-[36px] leading-[1.1] font-normal text-[#1a1a1a]" style={serif}>{k("gift_title")} <em style={{ color: NAVY }}>{k("gift_title_em")}</em></h2>
        <p className="hidden md:block text-[13.5px] text-[#4a4a4a]">{k("gift_text") || (giftFrom ? `Bridal, festive and party sets from ${inr(giftFrom)}.` : "Bridal, festive and party sets.")}</p>
        <Link href="/gift-sets" className="md:mt-1 self-start text-[12px] text-[#3B5373] md:text-white md:text-[11px] md:tracking-[0.14em] md:uppercase md:bg-[#3B5373] md:px-5 md:py-3.5 underline md:no-underline">
          {k("gift_button")} <span className="md:hidden">→</span>
        </Link>
      </div>
    </div>
  ));

  const cards = filtered.map((p) => <ProductCard key={p.slug} p={p} mode={mode} wornFirst={wornFirst} hidePair={hidePair} />);
  if (band && filtered.length > 4) cards.splice(4, 0, band as JSX.Element);

  const sortSelect = (
    <label className="flex items-center gap-2 border border-[#D8D1C5] px-3 h-11 text-[12.5px] text-[#555] bg-white">
      <span className="hidden md:inline">Sort</span>
      <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="bg-transparent text-[#1a1a1a] focus:outline-none" aria-label="Sort products">
        <option value="featured">Featured</option>
        <option value="newest">Newest</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
      </select>
    </label>
  );

  const heelAndSize = (
    <>
      {allHeelTypes.length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-full md:w-[86px] text-[10.5px] tracking-[0.2em] uppercase text-[#6b6b6b]">Heel</span>
          {allHeelTypes.map((h) => (
            <button key={h} type="button" onClick={() => setHeelTypes(toggleIn(heelTypes, h))} className={boxCls(heelTypes.includes(h))} aria-pressed={heelTypes.includes(h)}>
              {h.replace(/\s*heel$/i, "")}
            </button>
          ))}
        </div>
      )}
      {allSizes.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-full md:w-auto md:mr-1 text-[10.5px] tracking-[0.2em] uppercase text-[#6b6b6b]">Size</span>
          {allSizes.map((s) => (
            <button key={s} type="button" onClick={() => setSizes(toggleIn(sizes, s))} className={`${boxCls(sizes.includes(s))} w-11 px-0 text-center`} aria-pressed={sizes.includes(s)}>{s}</button>
          ))}
          <Link href="/size-guide" className="text-[12px] ml-1 underline" style={{ color: NAVY }}>Size guide</Link>
        </div>
      )}
    </>
  );

  const p1 = k("p1_title") || (allSizes.length ? `Sizes ${allSizes[0]} to ${allSizes[allSizes.length - 1]}` : "Find your size");
  const promises = [
    { title: p1, sub: k("p1_sub"), icon: ICONS.shoe, href: "/size-guide" },
    { title: k("p2_title"), sub: k("p2_sub"), icon: ICONS.returns },
    { title: k("p3_title"), sub: k("p3_sub"), icon: ICONS.cash },
    { title: k("p4_title"), sub: k("p4_sub") || (freeFrom ? `on orders ${inr(freeFrom)}+` : ""), icon: ICONS.truck },
  ].filter((x) => x.title);

  return (
    <>
      {/* 1 · Short banner */}
      <section className="grid grid-cols-1 md:grid-cols-2 bg-[#F7F4EF]">
        <div className="md:order-2 relative">
          {props.heroImage
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={optimizeCloudinary(props.heroImage, 1200)} alt="" className="w-full h-[180px] md:h-[340px] object-cover" style={{ objectPosition: "center 35%" }} fetchPriority="high" />
            : <div className="h-[120px] md:h-[340px]" />}
        </div>
        <div className="md:order-1 px-4 pt-5 pb-5 md:px-16 lg:pl-[8vw] md:py-10 flex flex-col justify-center gap-2 md:gap-3.5">
          <p className="hidden md:block text-[11px] tracking-[0.32em] uppercase font-medium text-[#8a6a3a]">{k("eyebrow")}</p>
          <h1 className="text-[40px] md:text-[72px] leading-none font-normal text-[#1a1a1a]" style={serif}>{k("title")}</h1>
          {k("sub") && <p className="hidden md:block text-[15px] text-[#4a4a4a]">{k("sub")}</p>}
          {facts.length > 0 && (
            <p className="text-[12.5px] text-[#444] flex flex-wrap gap-x-2 md:gap-x-4 gap-y-1 md:mt-1">
              {facts.map((f, i) => <span key={i} className="flex gap-2 md:gap-4">{i > 0 && <span className="text-[#B08D57]">·</span>}{f}</span>)}
            </p>
          )}
        </div>
      </section>

      {/* 2 · Filters */}
      <section className="border-y border-[#ECEAE6] bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-3 md:py-5 flex flex-col gap-3 md:gap-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] -mx-4 px-4 md:mx-0 md:px-0 items-center">
              {mode === "heels" ? (
                <>
                  <span className="hidden md:inline w-[86px] shrink-0 text-[10.5px] tracking-[0.2em] uppercase text-[#6b6b6b]">Occasion</span>
                  <button type="button" onClick={() => setOccasion(null)} className={chipCls(!occasion)}>All · {products.length}</button>
                  {occasions.map((o) => (
                    <button key={o.slug} type="button" onClick={() => setOccasion(occasion === o.slug ? null : o.slug)} className={chipCls(occasion === o.slug)}>
                      {o.tag ? o.tag.charAt(0) + o.tag.slice(1).toLowerCase() : o.title}
                    </button>
                  ))}
                </>
              ) : (
                <>
                  <button type="button" onClick={() => setCharmType(null)} className={chipCls(!charmType)}>All · {products.length}</button>
                  {typeTags.map((tag) => {
                    const n = products.filter((p) => hasTag(p, tag)).length;
                    if (!n) return null;
                    return (
                      <button key={tag} type="button" onClick={() => setCharmType(charmType === tag ? null : tag)} className={chipCls(charmType === tag)}>
                        {typeLabel(tag)} · {n}
                      </button>
                    );
                  })}
                </>
              )}
            </div>
            <div className="hidden md:flex items-center gap-4 shrink-0">
              <span className="text-[12.5px] text-[#555]">{filtered.length} {mode === "heels" ? (filtered.length === 1 ? "heel" : "heels") : (filtered.length === 1 ? "charm" : "charms")}</span>
              {sortSelect}
            </div>
          </div>

          {mode === "heels" && <div className="hidden md:flex flex-wrap gap-x-10 gap-y-3">{heelAndSize}</div>}

          {/* Phone: filter button + sort */}
          <div className="md:hidden grid grid-cols-2 gap-2">
            {mode === "heels" ? (
              <button type="button" onClick={() => setSheetOpen(true)} className="h-11 border border-[#D8D1C5] text-[12.5px] flex items-center justify-center gap-2">
                <SlidersHorizontal className="w-4 h-4" strokeWidth={1.6} /> Size · Heel{heelTypes.length + sizes.length > 0 ? ` (${heelTypes.length + sizes.length})` : ""}
              </button>
            ) : (
              <span className="h-11 flex items-center text-[12.5px] text-[#555]">{filtered.length} charms</span>
            )}
            {sortSelect}
          </div>

          {mode === "charms" && show("how_show") && (
            <div className="bg-[#F7F4EF] px-4 md:px-6 py-3 md:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-[12.5px] md:text-[13px]">
              <div className="flex flex-wrap gap-x-5 md:gap-x-7 gap-y-1">
                <span className="font-medium">{k("how_title")}</span>
                {[1, 2, 3].map((n) => k(`how_${n}`) && <span key={n}><b className="font-medium text-[#B08D57]">{n}</b> {k(`how_${n}`)}</span>)}
              </div>
              {k("how_link") && <Link href="/about#how-it-works" className="underline md:no-underline shrink-0" style={{ color: NAVY }}>{k("how_link")} →</Link>}
            </div>
          )}

          {anyFilter && (
            <button type="button" onClick={clearAll} className="self-start text-[12px] underline" style={{ color: NAVY }}>Clear filters</button>
          )}
        </div>
      </section>

      {/* Phone filter sheet */}
      {sheetOpen && (
        <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label="Filter heels">
          <button type="button" aria-label="Close filters" className="absolute inset-0 bg-black/40" onClick={() => setSheetOpen(false)} />
          <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-2xl p-5 pb-8 flex flex-col gap-5 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-medium">Filter heels</p>
              <button type="button" aria-label="Close" onClick={() => setSheetOpen(false)} className="w-10 h-10 flex items-center justify-center"><X className="w-5 h-5" /></button>
            </div>
            {heelAndSize}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button type="button" onClick={() => { setHeelTypes([]); setSizes([]); }} className="h-12 border border-[#D8D1C5] text-[12.5px]">Clear</button>
              <button type="button" onClick={() => { setSheetOpen(false); gridRef.current?.scrollIntoView({ behavior: "smooth" }); }} className="h-12 bg-[#3B5373] text-white text-[12.5px]">Show {filtered.length} heels</button>
            </div>
          </div>
        </div>
      )}

      {/* 3 · Products */}
      <section ref={gridRef} className="max-w-[1280px] mx-auto px-4 md:px-10 pt-6 md:pt-9 pb-12 md:pb-16 scroll-mt-20">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[26px] mb-2" style={serif}>Nothing matches yet</p>
            <p className="text-[13px] text-[#555] mb-5">Try removing a filter.</p>
            <button type="button" onClick={clearAll} className="text-[11px] tracking-[0.18em] uppercase border border-[#3B5373] px-6 py-3" style={{ color: NAVY }}>Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2.5 md:gap-x-5 gap-y-7 md:gap-y-9">{cards}</div>
        )}
      </section>

      {/* 4 · Occasions (heels) */}
      {mode === "heels" && show("occ_show") && occasions.length > 0 && (
        <section className="max-w-[1280px] mx-auto pb-10 md:pb-14 flex flex-col gap-4 md:gap-6">
          <h2 className="px-4 md:px-10 text-[28px] md:text-[40px] font-normal" style={serif}>{k("occ_title")} <em style={{ color: NAVY }}>{k("occ_title_em")}</em></h2>
          <div className="flex md:grid md:grid-cols-3 gap-2.5 md:gap-5 overflow-x-auto [scrollbar-width:none] px-4 md:px-10 snap-x">
            {occasions.map((o) => (
              <Link key={o.slug} href={`/shop/${o.slug}`} className="relative block shrink-0 w-[230px] md:w-auto snap-start text-white group overflow-hidden">
                {o.image
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={optimizeCloudinary(o.image, 700)} alt={o.title} loading="lazy" className="w-full h-[260px] object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  : <div className="w-full h-[260px] bg-[#3B5373]" />}
                <span className="absolute inset-x-0 bottom-0 px-4 md:px-5 pb-4 pt-10 bg-gradient-to-t from-black/65 to-transparent text-[22px] md:text-[28px]" style={serif}>{o.title} →</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 5 · Questions (charms) */}
      {mode === "charms" && show("q_show") && (
        <section className="max-w-[1280px] mx-auto px-4 md:px-10 pb-10 md:pb-14 grid grid-cols-1 md:grid-cols-[340px_minmax(0,1fr)] gap-3 md:gap-14">
          <h2 className="text-[28px] md:text-[40px] leading-[1.1] font-normal" style={serif}>{k("q_title")} <em style={{ color: NAVY }}>{k("q_title_em")}</em></h2>
          <div className="flex flex-col">
            {[1, 2, 3].map((n) => k(`q${n}`) && (
              <details key={n} className="border-t border-[#ECEAE6] last-of-type:border-b py-4 group" open={n === 1}>
                <summary className="cursor-pointer list-none flex justify-between items-center gap-4 text-[14px] md:text-[15px] font-medium min-h-[28px]">
                  {k(`q${n}`)}<span className="text-[#8a8a8a] group-open:rotate-45 transition-transform text-[18px] leading-none" aria-hidden="true">+</span>
                </summary>
                <p className="mt-2 text-[13px] md:text-[13.5px] text-[#555] leading-relaxed">{k(`a${n}`)}</p>
              </details>
            ))}
            <Link href="/faq" className="mt-3 text-[12.5px] underline" style={{ color: NAVY }}>All questions →</Link>
          </div>
        </section>
      )}

      {/* 6 · Promises (heels) */}
      {mode === "heels" && promises.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-4 md:px-10">
          <ul className="border-y border-[#ECEAE6] py-6 md:py-8 grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-5 md:gap-6">
            {promises.map((x, i) => (
              <li key={i} className="flex flex-col md:flex-row gap-1.5 md:gap-3 md:items-center">
                <span className="hidden md:block"><Icon d={x.icon} /></span>
                <span className="flex flex-col">
                  <span className="text-[12.5px] md:text-[13.5px] font-medium">{x.title}</span>
                  {x.sub && (x.href
                    ? <Link href={x.href} className="text-[12px] underline" style={{ color: NAVY }}>{x.sub}</Link>
                    : <span className="text-[12px] text-[#555]">{x.sub}</span>)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 7 · Text for Google */}
      <section className="max-w-[1280px] mx-auto px-4 md:px-10 pt-8 md:pt-12 pb-12 md:pb-16">
        <div className="max-w-[860px] flex flex-col gap-2.5">
          <h2 className="text-[24px] md:text-[30px] font-normal" style={serif}>{k("seo_title")}</h2>
          <p className="text-[12.5px] md:text-[13.5px] text-[#555] leading-relaxed">{k("seo_text")}</p>
          {props.children && (
            <details className="group">
              <summary className="cursor-pointer list-none text-[12.5px] underline" style={{ color: NAVY }}>
                <span className="group-open:hidden">Read more</span><span className="hidden group-open:inline">Read less</span>
              </summary>
              <div className="mt-3 text-[12.5px] md:text-[13px] text-[#555] leading-relaxed flex flex-col gap-3">{props.children}</div>
            </details>
          )}
        </div>
      </section>
    </>
  );
}
