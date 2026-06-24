"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/products";
import { supabase } from "@/lib/supabase";

interface TabConfig { label: string; active: boolean; }
interface FPSettings {
  tab1: TabConfig; tab2: TabConfig; tab3: TabConfig;
  eyebrow: string; heading: string; headingItalic: string;
}

interface FeaturedPicksProps {
  latestProducts?: Product[];
  bestSellers?: Product[];
  saleProducts?: Product[];
  initialSettings?: Record<string, string>;
}

// Map DB row to Product shape
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbToProduct(row: any): Product {
  return {
    slug: row.slug ?? "", title: row.title ?? "",
    price: row.price ?? 0, comparePrice: row.compare_price ?? 0,
    category: row.category ?? "heels",
    collection: row.collection ?? "heels",
    variants: { type: row.variant_type ?? "none", options: row.variants ?? [] },
    image: row.image_url ?? row.image ?? "",
    description: row.description ?? "",
    featured_tab: row.featured_tab ?? null,
  };
}

// Color map: keyword in title/slug → gradient colors
const COLOR_MAP: Record<string, [string, string]> = {
  wine:       ["#7B3550", "#4A1E34"],
  maroon:     ["#6B2D3E", "#3E1525"],
  teal:       ["#3A8C8C", "#1F5F5F"],
  black:      ["#3A3A3A", "#1A1A1A"],
  milk:       ["#C8B89A", "#A89070"],
  cream:      ["#C8B89A", "#A89070"],
  beige:      ["#C4A882", "#A08060"],
  white:      ["#D8D0C8", "#B0A898"],
  nude:       ["#C4A882", "#9E8262"],
  gold:       ["#B8902A", "#8A6A10"],
  silver:     ["#8A9AAA", "#6A7A8A"],
  blue:       ["#4A6FA5", "#2A4F85"],
  navy:       ["#2A3F6A", "#1A2F5A"],
  blush:      ["#D4907A", "#B47060"],
  pink:       ["#C47080", "#A45060"],
  brown:      ["#8A6050", "#6A4030"],
  camel:      ["#C09060", "#A07040"],
  olive:      ["#6A7A40", "#4A5A20"],
  green:      ["#4A7A5A", "#2A5A3A"],
  red:        ["#8A3030", "#6A1010"],
  coral:      ["#C07060", "#A05040"],
  ivory:      ["#C8C0B0", "#A8A090"],
  taupe:      ["#8A7A6A", "#6A5A4A"],
  chocolate:  ["#6A4030", "#4A2010"],
};

function getCardColors(product: Product): [string, string] {
  const text = (product.title + " " + product.slug).toLowerCase();
  for (const [key, colors] of Object.entries(COLOR_MAP)) {
    if (text.includes(key)) return colors;
  }
  return ["#8A9AAA", "#6A7A8A"]; // default slate
}

function ProductCard({ product, isNew, cardStyle }: { product: Product; isNew?: boolean; cardStyle?: { aspectRatio?: string; borderRadius?: string; height?: number } }) {
  const router = useRouter();
  const hasDiscount = product.comparePrice > 0 && product.comparePrice > product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.price / product.comparePrice) * 100) : 0;
  const [c1, c2] = getCardColors(product);

  return (
    <div className="group cursor-pointer" onClick={() => router.push(`/products/${product.slug}`)}>
      {/* Card */}
      <div className={`relative overflow-hidden ${cardStyle?.borderRadius || ""}`} style={{ aspectRatio: cardStyle?.height ? undefined : (cardStyle?.aspectRatio || "3/4"), height: cardStyle?.height ? `${cardStyle.height}px` : undefined, background: `#f9f9f9` }}>
        {/* Product image */}
        {product.image && (
          <Image src={product.image} alt={product.title} fill
            className="object-contain transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw" />
        )}

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="bg-[#1a1a1a] text-white text-[10px] font-medium px-2 py-0.5 tracking-wide">
              -{discountPct}%
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          {isNew && (
            <span className="bg-[#3B5373] text-white text-[10px] font-medium px-2 py-0.5 tracking-wide">
              NEW
            </span>
          )}
          {/* Heart */}
          <button className="w-7 h-7 bg-white/20 hover:bg-white/90 rounded-full flex items-center justify-center transition-all duration-200 mt-1"
            onClick={e => { e.stopPropagation(); }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white hover:text-[#3B5373]">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        {/* Quick Add hover button */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full bg-[#3B5373] text-white text-[11px] tracking-[0.2em] uppercase py-3 font-medium hover:bg-[#2d3f4f] transition-colors"
            onClick={e => { e.stopPropagation(); router.push(`/products/${product.slug}`); }}>
            Quick Add
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-800 truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {product.title}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-sm text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {hasDiscount && (
            <>
              <span className="text-xs text-gray-400 line-through">₹{product.comparePrice.toLocaleString("en-IN")}</span>
              <span className="text-xs font-semibold text-[#3B5373]">-{discountPct}%</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const DEFAULT_SETTINGS: FPSettings = {
  tab1: { label: "Latest Styles",  active: true },
  tab2: { label: "Best Sellers",   active: true },
  tab3: { label: "On Sale",        active: true },
  eyebrow: "New Arrivals",
  heading: "Featured",
  headingItalic: "Picks",
};

export default function FeaturedPicks({ latestProducts: _l, bestSellers: _b, saleProducts: _s, initialSettings }: FeaturedPicksProps) {
  const [activeTab, setActiveTab] = useState<"latest" | "bestsellers" | "sale">("latest");
  const [fps, setFps] = useState<FPSettings>(() => {
    if (initialSettings && Object.keys(initialSettings).length > 0) {
      const m = initialSettings;
      return {
        tab1: { label: m.fp_tab1_label ?? "Latest Styles", active: (m.fp_tab1_active ?? "true") === "true" },
        tab2: { label: m.fp_tab2_label ?? "Best Sellers",  active: (m.fp_tab2_active ?? "true") === "true" },
        tab3: { label: m.fp_tab3_label ?? "On Sale",       active: (m.fp_tab3_active ?? "true") === "true" },
        eyebrow:       m.fp_eyebrow        ?? "New Arrivals",
        heading:       m.fp_heading        ?? "Featured",
        headingItalic: m.fp_heading_italic ?? "Picks",
      };
    }
    return DEFAULT_SETTINGS;
  });
  const [latestProducts, setLatestProducts]   = useState<Product[]>(_l ?? []);
  const [bestSellers,    setBestSellers]       = useState<Product[]>(_b ?? []);
  const [saleProducts,   setSaleProducts]      = useState<Product[]>(_s ?? []);
  const [advMobile,  setAdvMobile]  = useState(() => initialSettings?.adv_picks_mobile  ? parseInt(initialSettings.adv_picks_mobile)  || 2 : 2);
  const [advDesktop, setAdvDesktop] = useState(() => initialSettings?.adv_picks_desktop ? parseInt(initialSettings.adv_picks_desktop) || 4 : 4);
  const [advGap,     setAdvGap]     = useState(() => initialSettings?.adv_picks_gap     ? parseInt(initialSettings.adv_picks_gap)     || 12 : 12);
  const [advAspect,  setAdvAspect]  = useState(() => initialSettings?.adv_picks_aspect  || "4/5");
  const [advRadius,  setAdvRadius]  = useState(() => initialSettings?.adv_picks_radius  || "sharp");
  const [advCardH,   setAdvCardH]   = useState(() => initialSettings?.adv_picks_card_h  ? parseInt(initialSettings.adv_picks_card_h) || 0 : 0);

  const radiusMap: Record<string,string> = { sharp: "", slight: "rounded", rounded: "rounded-xl", pill: "rounded-3xl" };

  useEffect(() => {
    // Fetch adv grid settings (skip if provided via SSR)
    if (!initialSettings?.adv_picks_mobile) {
      supabase.from("site_settings").select("key,value")
        .in("key", ["adv_picks_mobile","adv_picks_desktop","adv_picks_gap","adv_picks_aspect","adv_picks_radius","adv_picks_card_h"])
        .then(({ data }) => {
          if (!data) return;
          const m: Record<string,string> = {};
          data.forEach(({ key, value }) => { m[key] = value; });
          if (m.adv_picks_mobile)  setAdvMobile(parseInt(m.adv_picks_mobile) || 2);
          if (m.adv_picks_desktop) setAdvDesktop(parseInt(m.adv_picks_desktop) || 4);
          if (m.adv_picks_gap)     setAdvGap(parseInt(m.adv_picks_gap) || 12);
          if (m.adv_picks_aspect)  setAdvAspect(m.adv_picks_aspect);
          if (m.adv_picks_radius)  setAdvRadius(m.adv_picks_radius);
          if (m.adv_picks_card_h)  setAdvCardH(parseInt(m.adv_picks_card_h) || 0);
        });
    }

    // Fetch FP text settings (skip if provided via SSR)
    if (!initialSettings || Object.keys(initialSettings).length === 0) {
      supabase.from("site_settings").select("key,value")
        .in("key", ["fp_tab1_label","fp_tab1_active","fp_tab2_label","fp_tab2_active","fp_tab3_label","fp_tab3_active","fp_eyebrow","fp_heading","fp_heading_italic"])
        .then(({ data }) => {
          if (!data || data.length === 0) return;
          const m: Record<string, string> = {};
          data.forEach(({ key, value }) => { m[key] = value; });
          setFps({
            tab1: { label: m.fp_tab1_label ?? "Latest Styles", active: (m.fp_tab1_active ?? "true") === "true" },
            tab2: { label: m.fp_tab2_label ?? "Best Sellers",  active: (m.fp_tab2_active ?? "true") === "true" },
            tab3: { label: m.fp_tab3_label ?? "On Sale",       active: (m.fp_tab3_active ?? "true") === "true" },
            eyebrow:       m.fp_eyebrow         ?? "New Arrivals",
            heading:       m.fp_heading         ?? "Featured",
            headingItalic: m.fp_heading_italic  ?? "Picks",
          });
        });
    }

    // Fetch products client-side for instant updates
    supabase.from("products").select("*").eq("featured_tab", "latest").eq("active", true).limit(4)
      .then(({ data }) => { if (data && data.length > 0) setLatestProducts(data.map(mapDbToProduct)); });
    supabase.from("products").select("*").eq("featured_tab", "bestseller").eq("active", true).limit(4)
      .then(({ data }) => { if (data && data.length > 0) setBestSellers(data.map(mapDbToProduct)); });
    supabase.from("products").select("*").eq("featured_tab", "sale").eq("active", true).limit(4)
      .then(({ data }) => { if (data && data.length > 0) setSaleProducts(data.map(mapDbToProduct)); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabs = [
    { key: "latest"      as const, cfg: fps.tab1, products: latestProducts },
    { key: "bestsellers" as const, cfg: fps.tab2, products: bestSellers    },
    { key: "sale"        as const, cfg: fps.tab3, products: saleProducts   },
  ].filter(t => t.cfg.active);

  const products = (tabs.find(t => t.key === activeTab) ?? tabs[0])?.products.slice(0, 4) ?? [];

  return (
    <section className="pt-12 pb-16 px-6 md:px-20" style={{ background: "#f5f5f5" }}>
      <div className="max-w-[1280px] mx-auto">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-7 h-px bg-[#3B5373]" />
          <span className="font-sans text-[10px] font-light tracking-[0.36em] uppercase text-[#3B5373]">
            {fps.eyebrow}
          </span>
        </div>

        {/* Heading row */}
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-serif text-[clamp(1.8rem,3.5vw,2.8rem)] font-normal leading-[1.1] text-[#1a1a1a]">
            {fps.heading} <em className="italic font-light text-[#3B5373]">{fps.headingItalic}</em>
          </h2>

        </div>

        {/* Tabs */}
        <div className="relative mb-8">
          <div className="absolute bottom-0 left-0 right-0 border-b border-gray-300" />
          <div className="relative flex gap-8">
            {tabs.map(({ key, cfg }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`relative pb-3 text-[11px] tracking-[0.15em] uppercase font-medium transition-colors duration-200 ${
                  activeTab === key ? "text-[#1a1a1a] border-b-2 border-[#3B5373]" : "text-[#1a1a1a] hover:text-[#1a1a1a]"
                }`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                {cfg.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div
          className="grid"
          style={{ gap: advGap + "px", gridTemplateColumns: `repeat(${advDesktop}, minmax(0, 1fr))` }}
        >
          {products.map((product, idx) => (
            <ProductCard key={product.slug} product={product} isNew={activeTab === "latest" && idx === 0} cardStyle={{ aspectRatio: advAspect !== "none" ? advAspect : undefined, borderRadius: radiusMap[advRadius] || "", height: advCardH || undefined }} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link href="/collections"
            className="inline-block bg-[#3B5373] text-white px-14 py-3.5 text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-[#2d3f4f] transition-colors">
            Explore All Styles
          </Link>
        </div>
      </div>
    </section>
  );
}
