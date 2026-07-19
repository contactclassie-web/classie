"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { SlidersHorizontal, ChevronDown, Heart, ShieldCheck, Layers, TrendingUp } from "lucide-react";
import { Product } from "@/lib/products";
import { supabase } from "@/lib/supabase";
import TestimonialCarousel from "@/components/TestimonialCarousel";

interface Category {
  name: string;
  slug: string;
  image_url?: string;
  description?: string;
}

interface Props {
  initialProducts: Product[];
  categories: Category[];
}

type Settings = Record<string, string>;

const SETTINGS_KEYS = [
  "coll_hero_eyebrow",
  "coll_hero_line1", "coll_hero_line2", "coll_hero_line3",
  "coll_hero_tagline", "coll_hero_sub", "coll_hero_image",
  "coll_stat1_val", "coll_stat1_label",
  "coll_stat2_val", "coll_stat2_label",
  "coll_stat3_val", "coll_stat3_label",
  "coll_badge_label", "coll_badge_sub",
  "coll_cta_text", "coll_cta2_text",
  "coll_strip1_title", "coll_strip1_desc",
  "coll_strip2_title", "coll_strip2_desc",
  "coll_strip3_title", "coll_strip3_desc",
  "coll_testimonial_text", "coll_testimonial_author",
  "coll_section_label",
];

const DEFAULTS: Settings = {
  coll_hero_eyebrow:      "Summer Edit 2025",
  coll_hero_line1:        "Explore",
  coll_hero_line2:        "our",
  coll_hero_line3:        "Collection",
  coll_hero_tagline:      "One heel. Endless looks.",
  coll_hero_sub:          "India's first interchangeable heel brand — where a single shoe becomes four different styles with our signature clip-on collection.",
  coll_hero_image:        "",
  coll_stat1_val:         "24+",
  coll_stat1_label:       "Styles",
  coll_stat2_val:         "3",
  coll_stat2_label:       "Collections",
  coll_stat3_val:         "₹399+",
  coll_stat3_label:       "Starting At",
  coll_badge_label:       "New Arrivals",
  coll_badge_sub:         "Styles this season",
  coll_cta_text:          "Explore All Styles →",
  coll_cta2_text:         "Style Guide",
  coll_strip1_title:      "Designed to Transform",
  coll_strip1_desc:       "Interchangeable clip-ons that let one heel match every look.",
  coll_strip2_title:      "Made for Everyday Wear",
  coll_strip2_desc:       "Comfort-focused designs made for real movement and real life.",
  coll_strip3_title:      "Style That Lasts",
  coll_strip3_desc:       "Reusable clip-ons designed to be worn again and again.",
  coll_testimonial_text:  "\"I bought one pair of Classie heels and three clip-on sets — it's like having ten shoes in one box. Absolute game changer.\"",
  coll_testimonial_author: "— Priya S., Mumbai",
  coll_section_label:     "Curated for you this season",
};

const SORT_OPTIONS = [
  { label: "Newest First",      value: "newest"     },
  { label: "Price: Low → High", value: "price_asc"  },
  { label: "Price: High → Low", value: "price_desc" },
];

function g(settings: Settings, key: string): string {
  // If key exists in settings (even empty string), use it; else use default
  return key in settings ? settings[key] : DEFAULTS[key] ?? "";
}

export default function CollectionsClient({ initialProducts, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort]                     = useState("newest");
  const [sortOpen, setSortOpen]             = useState(false);
  const [settings, setSettings]             = useState<Settings>(DEFAULTS);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // ── Client-side settings fetch — instant update on every page visit ──────
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("key,value")
        .in("key", SETTINGS_KEYS);
      if (data) {
        const m: Settings = { ...DEFAULTS };
        data.forEach((r: { key: string; value: string }) => { m[r.key] = r.value; });
        setSettings(m);
      }
      setSettingsLoaded(true);
    })();
  }, []);

  const filtered = useMemo(() => {
    let list = activeCategory === "all"
      ? initialProducts
      : initialProducts.filter((p) => p.category === activeCategory);
    if (sort === "price_asc")  list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [initialProducts, activeCategory, sort]);

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Sort";

  // ── Derived values (blank = hide) ────────────────────────────────────────
  const eyebrow     = g(settings, "coll_hero_eyebrow");
  const line1       = g(settings, "coll_hero_line1");
  const line2       = g(settings, "coll_hero_line2");
  const line3       = g(settings, "coll_hero_line3");
  const tagline     = g(settings, "coll_hero_tagline");
  const heroSub     = g(settings, "coll_hero_sub");
  const heroImage   = g(settings, "coll_hero_image");
  const stat1Val    = g(settings, "coll_stat1_val");
  const stat1Label  = g(settings, "coll_stat1_label");
  const stat2Val    = g(settings, "coll_stat2_val");
  const stat2Label  = g(settings, "coll_stat2_label");
  const stat3Val    = g(settings, "coll_stat3_val");
  const stat3Label  = g(settings, "coll_stat3_label");
  const badgeLabel  = g(settings, "coll_badge_label");
  const badgeSub    = g(settings, "coll_badge_sub");
  const ctaText     = g(settings, "coll_cta_text");
  const cta2Text    = g(settings, "coll_cta2_text");
  const strip1Title = g(settings, "coll_strip1_title");
  const strip1Desc  = g(settings, "coll_strip1_desc");
  const strip2Title = g(settings, "coll_strip2_title");
  const strip2Desc  = g(settings, "coll_strip2_desc");
  const strip3Title = g(settings, "coll_strip3_title");
  const strip3Desc  = g(settings, "coll_strip3_desc");
  const testText    = g(settings, "coll_testimonial_text");
  const testAuthor  = g(settings, "coll_testimonial_author");
  const sectionLbl  = g(settings, "coll_section_label");

  // Visibility flags — blank = hide
  const showStats = stat1Val || stat2Val || stat3Val;
  const showStrip = strip1Title || strip2Title || strip3Title;
  const showTest  = testText;
  const showBadge = heroImage && (badgeLabel || badgeSub || stat1Val);

  const stats = [
    { val: stat1Val, label: stat1Label },
    { val: stat2Val, label: stat2Label },
    { val: stat3Val, label: stat3Label },
  ].filter(st => st.val); // hide blank stat blocks

  const stripItems = [
    { Icon: ShieldCheck, title: strip1Title, desc: strip1Desc },
    { Icon: Layers,      title: strip2Title, desc: strip2Desc },
    { Icon: TrendingUp,  title: strip3Title, desc: strip3Desc },
  ].filter(it => it.title);

  if (!settingsLoaded) {
    // Skeleton — prevent flash, show spinner briefly
    return (
      <main className="bg-white min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#3B5373] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="bg-white">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className={`grid ${heroImage ? "md:grid-cols-2" : "grid-cols-1"} min-h-[88vh] overflow-hidden`}>
        {/* Left: text */}
        <div className={`flex flex-col justify-center px-10 ${heroImage ? "md:px-14" : "md:px-24"} py-16 md:py-24`}>

          {eyebrow && (
            <div className="flex items-center gap-3 mb-7">
              <span className="w-7 h-px bg-gray-200 block" />
              <span className="text-[9.5px] tracking-[0.38em] uppercase text-gray-400">{eyebrow}</span>
            </div>
          )}

          <h1 className="font-serif text-[clamp(48px,6vw,80px)] font-light leading-[0.97] tracking-[-0.01em] text-[#1a1a1a] mb-3">
            {line1 && <>{line1}<br /></>}
            {line2 && <><em className="italic text-[#3B5373]">{line2}</em><br /></>}
            {line3 && line3}
          </h1>

          {tagline && (
            <p className="font-serif text-base italic text-gray-400 mb-5 tracking-wide">{tagline}</p>
          )}

          {heroSub && (
            <p className="text-[11.5px] text-gray-500 leading-[1.9] font-light max-w-[380px] mb-9">{heroSub}</p>
          )}

          {showStats && stats.length > 0 && (
            <div className="flex border-t border-b border-gray-100 py-4 mb-9">
              {stats.map((st, i) => (
                <div key={i} className={`flex-1 ${i === 0 ? "pr-5" : i === stats.length - 1 ? "pl-5" : "px-5"} ${i < stats.length - 1 ? "border-r border-gray-100" : ""}`}>
                  <p className="font-serif text-[26px] font-light text-[#3B5373] leading-none mb-1">{st.val}</p>
                  <p className="text-[8.5px] tracking-[0.22em] uppercase text-gray-400">{st.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap mb-9">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-5 py-2.5 rounded-full text-[9.5px] tracking-[0.14em] uppercase border-[1.5px] transition-all duration-200 font-medium ${
                activeCategory === "all"
                  ? "bg-[#3B5373] border-[#3B5373] text-white"
                  : "border-gray-200 text-gray-500 hover:border-[#3B5373] hover:text-[#3B5373]"
              }`}>
              All Products
            </button>
            {categories.map((cat) => (
              <button key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-5 py-2.5 rounded-full text-[9.5px] tracking-[0.14em] uppercase border-[1.5px] transition-all duration-200 font-medium ${
                  activeCategory === cat.slug
                    ? "bg-[#3B5373] border-[#3B5373] text-white"
                    : "border-gray-200 text-gray-500 hover:border-[#3B5373] hover:text-[#3B5373]"
                }`}>
                {cat.name}
              </button>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3 items-center flex-wrap">
            {ctaText && (
              <a href="#products"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#3B5373] text-white text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-[#2c4159] transition-all duration-300 rounded-sm">
                {ctaText}
              </a>
            )}
            {cta2Text && (
              <Link href="/shop/heels"
                className="px-6 py-3.5 text-[10px] tracking-[0.18em] uppercase border-[1.5px] border-gray-200 text-gray-500 hover:border-[#3B5373] hover:text-[#3B5373] transition-all duration-200 rounded-sm">
                {cta2Text}
              </Link>
            )}
          </div>
        </div>

        {/* Right: image — only if heroImage is set */}
        {heroImage && (
          <div className="relative overflow-hidden bg-[#f4f2ee] hidden md:block">
            <Image
              src={heroImage}
              alt="Classie Collections"
              fill
              className="object-cover"
              sizes="50vw"
              priority
            />
            {/* Float badge — only if badge content exists */}
            {showBadge && (
              <div className="absolute bottom-10 left-0 bg-white shadow-xl px-6 py-5 border-l-[3px] border-[#3B5373] z-10 min-w-[160px]">
                {badgeLabel && <p className="text-[8.5px] tracking-[0.18em] uppercase text-gray-400 mb-1">{badgeLabel}</p>}
                {stat1Val && <p className="font-serif text-[28px] font-light text-[#3B5373] leading-none mb-1">{stat1Val}</p>}
                {badgeSub && <p className="text-[10px] text-gray-500 font-light">{badgeSub}</p>}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ── FILTER BAR ────────────────────────────────────────────────────── */}
      <div id="products" className="sticky top-[68px] z-30 bg-white/97 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-10">
          <div className="flex items-center justify-between" style={{ height: "60px" }}>
            {/* Tabs */}
            <div className="flex items-center overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveCategory("all")}
                className={`flex items-center gap-2 px-5 h-[60px] text-[9.5px] tracking-[0.18em] uppercase border-b-2 transition-all whitespace-nowrap font-medium ${
                  activeCategory === "all"
                    ? "border-[#3B5373] text-[#3B5373]"
                    : "border-transparent text-gray-400 hover:text-[#3B5373]"
                }`}>
                All
                <span className={`inline-flex items-center justify-center min-w-[20px] h-[18px] px-1.5 text-[8.5px] font-medium rounded-full ${activeCategory === "all" ? "bg-[#3B5373] text-white" : "bg-[#f0eef8] text-[#9a97b0]"}`}>
                  {initialProducts.length}
                </span>
              </button>
              {categories.map((cat) => {
                const count = initialProducts.filter((p) => p.category === cat.slug).length;
                return (
                  <button key={cat.slug}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`flex items-center gap-2 px-5 h-[60px] text-[9.5px] tracking-[0.18em] uppercase border-b-2 transition-all whitespace-nowrap font-medium ${
                      activeCategory === cat.slug
                        ? "border-[#3B5373] text-[#3B5373]"
                        : "border-transparent text-gray-400 hover:text-[#3B5373]"
                    }`}>
                    {cat.name}
                    <span className={`inline-flex items-center justify-center min-w-[20px] h-[18px] px-1.5 text-[8.5px] font-medium rounded-full ${activeCategory === cat.slug ? "bg-[#3B5373] text-white" : "bg-[#f0eef8] text-[#9a97b0]"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sort */}
            <div className="relative flex-shrink-0 ml-4">
              <button onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 px-5 py-2 text-[9.5px] tracking-[0.14em] uppercase text-gray-500 border border-gray-200 hover:border-[#3B5373] hover:text-[#3B5373] transition-all rounded-full">
                <SlidersHorizontal className="w-3 h-3" />
                {sortLabel}
                <ChevronDown className={`w-3 h-3 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 shadow-xl rounded-xl z-50 min-w-[210px] overflow-hidden">
                  {SORT_OPTIONS.map((opt) => (
                    <button key={opt.value}
                      onClick={() => { setSort(opt.value); setSortOpen(false); }}
                      className={`w-full text-left px-5 py-3.5 text-[9.5px] tracking-[0.14em] uppercase transition-colors ${
                        sort === opt.value ? "text-[#3B5373] bg-[#f8f7ff] font-medium" : "text-gray-600 hover:bg-gray-50"
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── PRODUCT GRID ──────────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-10 py-14 pb-24">
        {sectionLbl && (
          <div className="flex items-center gap-4 mb-10">
            <span className="text-[9.5px] tracking-[0.24em] uppercase text-gray-400">{sectionLbl}</span>
            <span className="flex-1 h-px bg-[#e8e0d5]" />
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-300">
            <p className="text-5xl mb-4">✦</p>
            <p className="text-sm tracking-widest uppercase">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <p className="text-center text-[9px] tracking-[0.2em] uppercase text-gray-300 mt-14">
            Showing {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>
        )}
      </section>

      {/* ── BRAND STRIP — hidden if all titles blank ──────────────────────── */}
      {showStrip && stripItems.length > 0 && (
        <section className="bg-[#3B5373] py-14">
          <div className="max-w-screen-xl mx-auto px-10">
            <div className={`grid grid-cols-1 md:grid-cols-${stripItems.length} gap-10 md:gap-0 md:divide-x md:divide-white/10`}>
              {stripItems.map(({ Icon, title, desc }, i) => (
                <div key={i} className={`text-center ${i !== 0 ? "md:pl-10" : ""} ${i !== stripItems.length - 1 ? "md:pr-10" : ""}`}>
                  <Icon className="w-9 h-9 mx-auto mb-4 text-white/50" strokeWidth={1.2} />
                  <h3 className="font-serif text-lg text-white mb-2 font-light">{title}</h3>
                  {desc && <p className="text-[11px] text-white/40 leading-relaxed font-light">{desc}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS CAROUSEL ─────────────────────────────────────────── */}
      {(() => {
        let items: {quote:string;author:string}[] = [];
        try { const p = JSON.parse(testText); if(Array.isArray(p)) items = p; } catch { items = []; }
        if (!items.length && testText) items = [{ quote: testText, author: testAuthor || "" }];
        return items.length > 0 ? <TestimonialCarousel items={items} intervalMs={5000} /> : null;
      })()}

    </main>
  );
}

/* ── Product Card ────────────────────────────────────────────────────────── */
function ProductCard({ product }: { product: Product }) {
  const [wished, setWished] = useState(false);
  const discount = product.comparePrice > product.price
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0;

  return (
    <Link href={`/product/${product.slug}`}
      className="group block bg-white rounded-sm overflow-hidden shadow-[0_1px_8px_rgba(59,83,115,0.07)] hover:shadow-[0_14px_40px_rgba(59,83,115,0.13)] hover:-translate-y-[5px] transition-all duration-[380ms]">
      <div className="relative overflow-hidden bg-[#f8f7ff]" style={{ aspectRatio: "3/4" }}>
        {product.image ? (
          <Image src={product.image} alt={product.title} fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-3xl text-gray-200">✦</div>
        )}

        {discount > 0 && (
          <span className="absolute top-3 left-3 px-2 py-1 text-[8px] tracking-[0.14em] uppercase bg-[#3B5373] text-white rounded-sm font-semibold">
            −{discount}%
          </span>
        )}

        <button
          onClick={(e) => { e.preventDefault(); setWished(!wished); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 scale-[0.85] group-hover:scale-100 transition-all duration-[250ms]">
          <Heart className={`w-[14px] h-[14px] transition-colors ${wished ? "fill-red-500 stroke-red-500" : "stroke-gray-400"}`} strokeWidth={1.8} />
        </button>

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[350ms]"
          style={{ background: "linear-gradient(to top, rgba(59,83,115,0.8) 0%, rgba(59,83,115,0.04) 45%, transparent 100%)" }}>
          <div className="absolute bottom-5 left-0 right-0 flex justify-center">
            <span className="px-6 py-2.5 bg-white text-[#3B5373] text-[9px] tracking-[0.2em] uppercase font-semibold rounded-sm shadow-md translate-y-3 group-hover:translate-y-0 transition-transform duration-[300ms] delay-[60ms]">
              View Product
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 pb-5">
        <p className="text-[8.5px] tracking-[0.2em] uppercase text-gray-400 mb-1.5 capitalize">{product.category}</p>
        <h3 className="font-serif text-[17px] font-light text-[#1a1a1a] leading-snug group-hover:text-[#3B5373] transition-colors line-clamp-2 mb-2.5">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13px] font-medium text-[#1a1a1a]">₹{product.price.toLocaleString("en-IN")}</span>
          {product.comparePrice > product.price && (
            <>
              <span className="text-[11px] text-gray-400 line-through">₹{product.comparePrice.toLocaleString("en-IN")}</span>
              <span className="text-[9px] font-semibold text-[#3B5373] bg-[rgba(59,83,115,0.09)] px-2 py-0.5 rounded-full">−{discount}%</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
