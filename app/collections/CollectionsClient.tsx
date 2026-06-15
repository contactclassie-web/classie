"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { SlidersHorizontal, ChevronDown, Heart, ShieldCheck, Layers, TrendingUp } from "lucide-react";
import { Product } from "@/lib/products";

interface Category {
  name: string;
  slug: string;
  image_url?: string;
  description?: string;
}

interface Props {
  initialProducts: Product[];
  categories: Category[];
  initialSettings: Record<string, string>;
}

const SORT_OPTIONS = [
  { label: "Newest First",      value: "newest"     },
  { label: "Price: Low → High", value: "price_asc"  },
  { label: "Price: High → Low", value: "price_desc" },
];

// ── helpers ──────────────────────────────────────────────────────────────────
function s(settings: Record<string, string>, key: string, fallback: string) {
  return settings[key] || fallback;
}

export default function CollectionsClient({ initialProducts, categories, initialSettings }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort]                     = useState("newest");
  const [sortOpen, setSortOpen]             = useState(false);

  const filtered = useMemo(() => {
    let list = activeCategory === "all"
      ? initialProducts
      : initialProducts.filter((p) => p.category === activeCategory);
    if (sort === "price_asc")  list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [initialProducts, activeCategory, sort]);

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Sort";

  // Settings
  const heroEyebrow  = s(initialSettings, "coll_hero_eyebrow",  "Summer Edit 2025");
  const heroTitle    = s(initialSettings, "coll_hero_title",    "Explore");
  const heroTagline  = s(initialSettings, "coll_hero_tagline",  "One heel. Endless looks.");
  const heroSub      = s(initialSettings, "coll_hero_sub",      "India's first interchangeable heel brand — where a single shoe becomes four different styles with our signature clip-on collection.");
  const heroImage    = s(initialSettings, "coll_hero_image",    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=900&h=900&fit=crop&q=85");
  const stat1Val     = s(initialSettings, "coll_stat1_val",     "24+");
  const stat1Label   = s(initialSettings, "coll_stat1_label",   "Styles");
  const stat2Val     = s(initialSettings, "coll_stat2_val",     "3");
  const stat2Label   = s(initialSettings, "coll_stat2_label",   "Collections");
  const stat3Val     = s(initialSettings, "coll_stat3_val",     "₹399+");
  const stat3Label   = s(initialSettings, "coll_stat3_label",   "Starting At");
  const strip1Title  = s(initialSettings, "coll_strip1_title",  "Designed to Transform");
  const strip1Desc   = s(initialSettings, "coll_strip1_desc",   "Interchangeable clip-ons that let one heel match every look.");
  const strip2Title  = s(initialSettings, "coll_strip2_title",  "Made for Everyday Wear");
  const strip2Desc   = s(initialSettings, "coll_strip2_desc",   "Comfort-focused designs made for real movement and real life.");
  const strip3Title  = s(initialSettings, "coll_strip3_title",  "Style That Lasts");
  const strip3Desc   = s(initialSettings, "coll_strip3_desc",   "Reusable clip-ons designed to be worn again and again.");
  const testText     = s(initialSettings, "coll_testimonial_text",   "\"I bought one pair of Classie heels and three clip-on sets — it's like having ten shoes in one box. Absolute game changer.\"");
  const testAuthor   = s(initialSettings, "coll_testimonial_author", "— Priya S., Mumbai");
  const sectionLabel = s(initialSettings, "coll_section_label", "Curated for you this season");

  return (
    <main className="bg-white">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="grid md:grid-cols-2 min-h-[88vh] overflow-hidden">
        {/* Left: text */}
        <div className="flex flex-col justify-center px-10 md:px-14 py-16 md:py-24 relative">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-7">
            <span className="w-7 h-px bg-gray-200 block" />
            <span className="text-[9.5px] tracking-[0.38em] uppercase text-gray-400">{heroEyebrow}</span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-[clamp(48px,6vw,80px)] font-light leading-[0.97] tracking-[-0.01em] text-[#1a1a1a] mb-3">
            {heroTitle}<br /><em className="italic text-[#3B5373]">our</em><br />Collection
          </h1>

          {/* Tagline */}
          <p className="font-serif text-base italic text-gray-400 mb-5 tracking-wide">{heroTagline}</p>

          {/* Sub */}
          <p className="text-[11.5px] text-gray-500 leading-[1.9] font-light max-w-[360px] mb-9">{heroSub}</p>

          {/* Stats row */}
          <div className="flex border-t border-b border-gray-100 py-4 mb-9">
            {[{ val: stat1Val, label: stat1Label }, { val: stat2Val, label: stat2Label }, { val: stat3Val, label: stat3Label }].map((st, i, arr) => (
              <div key={i} className={`flex-1 ${i === 0 ? "pr-5 border-r border-gray-100" : i === arr.length - 1 ? "pl-5" : "px-5 border-r border-gray-100"}`}>
                <p className="font-serif text-[26px] font-light text-[#3B5373] leading-none mb-1">{st.val}</p>
                <p className="text-[8.5px] tracking-[0.22em] uppercase text-gray-400">{st.label}</p>
              </div>
            ))}
          </div>

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
          <div className="flex gap-3 items-center">
            <a href="#products"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#3B5373] text-white text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-[#2c4159] transition-all duration-300 rounded-sm">
              Explore All Styles →
            </a>
            <Link href="/shop/heels"
              className="px-6 py-3.5 text-[10px] tracking-[0.18em] uppercase border-[1.5px] border-gray-200 text-gray-500 hover:border-[#3B5373] hover:text-[#3B5373] transition-all duration-200 rounded-sm">
              Style Guide
            </Link>
          </div>
        </div>

        {/* Right: image */}
        <div className="relative overflow-hidden bg-[#f4f2ee] hidden md:block">
          {heroImage ? (
            <Image
              src={heroImage}
              alt="Classie Collections"
              fill
              className="object-cover"
              sizes="50vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-5xl text-gray-200">✦</div>
          )}
          {/* Float badge */}
          <div className="absolute bottom-10 left-0 bg-white shadow-xl px-6 py-5 border-l-[3px] border-[#3B5373] z-10 min-w-[160px]">
            <p className="text-[8.5px] tracking-[0.18em] uppercase text-gray-400 mb-1">New Arrivals</p>
            <p className="font-serif text-[28px] font-light text-[#3B5373] leading-none mb-1">{stat1Val}</p>
            <p className="text-[10px] text-gray-500 font-light">Styles this season</p>
          </div>
        </div>
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
        {/* Section label */}
        <div className="flex items-center gap-4 mb-10">
          <span className="text-[9.5px] tracking-[0.24em] uppercase text-gray-400">{sectionLabel}</span>
          <span className="flex-1 h-px bg-[#e8e0d5]" />
        </div>

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

      {/* ── BRAND STRIP ───────────────────────────────────────────────────── */}
      <section className="bg-[#3B5373] py-14">
        <div className="max-w-screen-xl mx-auto px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 md:divide-x md:divide-white/10">
            {[
              { Icon: ShieldCheck, title: strip1Title, desc: strip1Desc },
              { Icon: Layers,      title: strip2Title, desc: strip2Desc },
              { Icon: TrendingUp,  title: strip3Title, desc: strip3Desc },
            ].map(({ Icon, title, desc }, i) => (
              <div key={i} className={`text-center ${i !== 0 ? "md:pl-10" : ""} ${i !== 2 ? "md:pr-10" : ""}`}>
                <Icon className="w-9 h-9 mx-auto mb-4 text-white/50" strokeWidth={1.2} />
                <h3 className="font-serif text-lg text-white mb-2 font-light">{title}</h3>
                <p className="text-[11px] text-white/40 leading-relaxed font-light">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ───────────────────────────────────────────────────── */}
      <section className="bg-[#faf9f7] border-t border-[#e8e0d5] py-20 text-center">
        <div className="max-w-[560px] mx-auto px-6">
          <p className="font-serif text-[56px] text-[#e8e0d5] leading-[0.5] mb-5">"</p>
          <p className="text-[#3B5373] text-sm tracking-[3px] mb-5">★★★★★</p>
          <p className="font-serif text-[21px] italic text-[#1a1a1a] leading-[1.55] mb-4 font-light">{testText}</p>
          <p className="text-[10px] tracking-[0.18em] uppercase text-gray-400">{testAuthor}</p>
        </div>
      </section>

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
      {/* Image */}
      <div className="relative overflow-hidden bg-[#f8f7ff]" style={{ aspectRatio: "3/4" }}>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-3xl text-gray-200">✦</div>
        )}

        {/* Badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 px-2 py-1 text-[8px] tracking-[0.14em] uppercase bg-[#3B5373] text-white rounded-sm font-semibold">
            −{discount}%
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); setWished(!wished); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 scale-[0.85] group-hover:scale-100 transition-all duration-[250ms]">
          <Heart className={`w-[14px] h-[14px] transition-colors ${wished ? "fill-red-500 stroke-red-500" : "stroke-gray-400"}`} strokeWidth={1.8} />
        </button>

        {/* Hover overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[350ms]"
          style={{ background: "linear-gradient(to top, rgba(59,83,115,0.8) 0%, rgba(59,83,115,0.04) 45%, transparent 100%)" }}>
          <div className="absolute bottom-5 left-0 right-0 flex justify-center">
            <span className="px-6 py-2.5 bg-white text-[#3B5373] text-[9px] tracking-[0.2em] uppercase font-semibold rounded-sm shadow-md translate-y-3 group-hover:translate-y-0 transition-transform duration-[300ms] delay-[60ms]">
              View Product
            </span>
          </div>
        </div>
      </div>

      {/* Info */}
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
