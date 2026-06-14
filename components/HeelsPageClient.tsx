"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeelProduct } from "@/lib/products";
import { supabase } from "@/lib/supabase";
import OccasionFilterSection from "./OccasionFilterSection";

// ── Hero component (reads settings from DB) ───────────────────────────
function HeelsHero({ productCount, heelTypeCount }: { productCount: number; heelTypeCount: number }) {
  const [bgType, setBgType] = useState<"none"|"image"|"video"|"slider">("none");
  const [bgUrl, setBgUrl] = useState("");
  const [slides, setSlides] = useState<string[]>([]);
  const [textPos, setTextPos] = useState<"left"|"center"|"right">("center");
  const [eyebrow, setEyebrow] = useState("New Collection · SS25");
  const [title, setTitle] = useState("Heels");
  const [subtitle, setSubtitle] = useState("Step into your story");
  const [slideIdx, setSlideIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);

  useEffect(() => {
    supabase.from("site_settings").select("key,value")
      .in("key", ["heels_hero_bg_type","heels_hero_bg_url","heels_hero_slides","heels_hero_text_pos","heels_hero_eyebrow","heels_hero_title","heels_hero_subtitle"])
      .then(({ data }) => {
        const m: Record<string,string> = {};
        (data ?? []).forEach(({key,value}) => { m[key]=value; });
        if (m.heels_hero_bg_type) setBgType(m.heels_hero_bg_type as typeof bgType);
        if (m.heels_hero_bg_url) setBgUrl(m.heels_hero_bg_url);
        if (m.heels_hero_slides) { try { setSlides(JSON.parse(m.heels_hero_slides)); } catch { setSlides([]); } }
        if (m.heels_hero_text_pos) setTextPos(m.heels_hero_text_pos as typeof textPos);
        if (m.heels_hero_eyebrow) setEyebrow(m.heels_hero_eyebrow);
        if (m.heels_hero_title) setTitle(m.heels_hero_title);
        if (m.heels_hero_subtitle) setSubtitle(m.heels_hero_subtitle);
      });
  }, []);

  // Auto-advance slider
  useEffect(() => {
    if (bgType === "slider" && slides.length > 1) {
      timerRef.current = setInterval(() => setSlideIdx(i => (i + 1) % slides.length), 3500);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [bgType, slides]);

  const isYouTube = bgUrl.includes("youtube.com") || bgUrl.includes("youtu.be");
  const ytId = isYouTube ? bgUrl.match(/(?:v=|youtu\.be\/)([^&?]+)/)?.[1] : null;

  const textAlign = textPos === "left" ? "items-start text-left" : textPos === "right" ? "items-end text-right" : "items-center text-center";
  const textPad   = textPos === "left"  ? "pl-10 md:pl-20 pr-4" :
                    textPos === "right" ? "pr-10 md:pr-20 pl-4" :
                    "px-6";

  return (
    <section className="relative overflow-hidden" style={{ background: "#3B5373", minHeight: "320px" }}>
      {/* Background */}
      {bgType === "image" && bgUrl && (
        <img src={bgUrl} alt="" className="absolute inset-0 w-full h-full object-cover object-center opacity-40" />
      )}
      {bgType === "slider" && slides.length > 0 && (
        <>
          {slides.map((s, i) => (
            <img key={s} src={s} alt="" className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700"
              style={{ opacity: i === slideIdx ? 0.4 : 0 }} />
          ))}
          {slides.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {slides.map((_,i) => (
                <button key={i} onClick={() => setSlideIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${i===slideIdx?"w-5 bg-white":"w-1.5 bg-white/40"}`} />
              ))}
            </div>
          )}
        </>
      )}
      {bgType === "video" && bgUrl && !isYouTube && (
        <video src={bgUrl} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover object-center opacity-40" />
      )}
      {bgType === "video" && isYouTube && ytId && (
        <iframe src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0`}
          className="absolute inset-0 w-full h-full opacity-30 pointer-events-none scale-[1.4]" allow="autoplay" />
      )}

      {/* Text */}
      <div className={`relative z-10 flex flex-col justify-center ${textAlign} ${textPad} py-20`} style={{ minHeight: "320px" }}>
        <div className="flex items-center gap-4 mb-6" style={{ justifyContent: textPos === "center" ? "center" : textPos === "right" ? "flex-end" : "flex-start" }}>
          <div className="w-8 h-px bg-white/40" />
          <span className="text-[10px] tracking-[0.5em] uppercase text-white/60" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {eyebrow}
          </span>
          <div className="w-8 h-px bg-white/40" />
        </div>
        <h1 className="font-serif font-light text-white leading-none mb-5" style={{ fontSize: "clamp(64px, 10vw, 96px)" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="font-serif italic text-white/60 text-xl mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {subtitle}
          </p>
        )}
        <div className="flex items-center gap-6" style={{ justifyContent: textPos === "center" ? "center" : textPos === "right" ? "flex-end" : "flex-start" }}>
          <div className="text-center">
            <p className="text-2xl font-serif font-light text-white">{productCount}</p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/50 mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Styles</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <p className="text-2xl font-serif font-light text-white">{heelTypeCount}</p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/50 mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Heel Types</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div className="text-center">
            <p className="text-2xl font-serif font-light text-white">Free</p>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/50 mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Shipping ₹999+</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Product card matching homepage Featured Picks style ───────────────
function HeelCard({ product }: { product: HeelProduct }) {
  const discount =
    product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : 0;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3">
            <span className="bg-[#1a1a1a] text-white text-[10px] font-medium px-2 py-0.5 tracking-wide">
              -{discount}%
            </span>
          </div>
        )}

        {/* Featured badge + heart */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          {product.featured_tab === "latest" && (
            <span className="bg-[#3B5373] text-white text-[10px] font-medium px-2 py-0.5 tracking-wide">
              NEW
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); }}
            className="w-7 h-7 bg-white/20 hover:bg-white/90 rounded-full flex items-center justify-center transition-all duration-200 mt-1"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white hover:text-[#3B5373]">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>

        {/* Quick Add on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={(e) => { e.preventDefault(); }}
            className="w-full bg-[#3B5373] text-white text-[11px] tracking-[0.2em] uppercase py-3 font-medium hover:bg-[#2d3f4f] transition-colors"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Quick Add
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3">
        <p className="text-sm font-medium text-gray-800 truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {product.title}
        </p>
        {product.heel_type && (
          <p className="text-[11px] text-gray-400 mt-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {product.heel_type}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-sm text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {discount > 0 && (
            <>
              <span className="text-xs text-gray-400 line-through">
                ₹{product.comparePrice.toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-semibold text-[#3B5373]">
                -{discount}%
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Main client component ─────────────────────────────────────────────────
export default function HeelsPageClient({ initialProducts }: { initialProducts: HeelProduct[] }) {
  const [activeOccasion, setActiveOccasion] = useState<string | null>(null);
  const [selectedHeelTypes, setSelectedHeelTypes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(9999);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "newest">("default");

  // Load filter types from DB (admin-managed)
  const [heelTypes, setHeelTypes] = useState<string[]>(() => {
    // Fallback: auto-generate from products
    const types = new Set<string>();
    initialProducts.forEach((p) => { if (p.heel_type) types.add(p.heel_type); });
    return Array.from(types).sort();
  });

  useEffect(() => {
    supabase.from("site_settings").select("value").eq("key", "heels_filter_heel_types").maybeSingle()
      .then(({ data }) => {
        if (data?.value) {
          try {
            const parsed = JSON.parse(data.value);
            if (Array.isArray(parsed) && parsed.length > 0) setHeelTypes(parsed);
          } catch { /* use fallback */ }
        }
      });
  }, []);

  const filtered = useMemo(() => {
    let result = [...initialProducts];

    // Occasion filter: check product tags contain the occasion slug
    if (activeOccasion) {
      result = result.filter((p) =>
        p.tags.some((t) => t.toLowerCase().includes(activeOccasion.toLowerCase()))
      );
    }

    // Heel type filter
    if (selectedHeelTypes.length > 0) {
      result = result.filter((p) => p.heel_type && selectedHeelTypes.includes(p.heel_type));
    }

    // Price filter
    result = result.filter((p) => p.price <= maxPrice);

    // Sort
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "newest") result.sort((a, b) => (a.featured_tab === "latest" ? -1 : b.featured_tab === "latest" ? 1 : 0));

    return result;
  }, [initialProducts, activeOccasion, selectedHeelTypes, maxPrice, sortBy]);

  const toggleHeelType = (ht: string) => {
    setSelectedHeelTypes((prev) =>
      prev.includes(ht) ? prev.filter((x) => x !== ht) : [...prev, ht]
    );
  };

  const hasFilters = activeOccasion || selectedHeelTypes.length > 0 || maxPrice < 9999;

  return (
    <>
      {/* ── Hero (admin-controlled: image/video/slider + text position) ── */}
      <HeelsHero productCount={initialProducts.length} heelTypeCount={heelTypes.length} />

      {/* ── Occasion filter + Category links (exactly like homepage) ── */}
      <OccasionFilterSection
        activeOccasion={activeOccasion}
        onOccasionClick={setActiveOccasion}
        excludeCategorySlug=""
      />

      {/* ── Filter + Grid ─────────────────────────────────────────────── */}
      <section className="py-12" style={{ background: "#f5f5f5" }}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="flex gap-8">

            {/* Sidebar */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-24 space-y-6">

                {/* Availability */}
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Availability
                  </p>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <input type="checkbox" defaultChecked className="accent-[#3B5373]" />
                    In Stock ({initialProducts.length})
                  </label>
                </div>

                <div className="border-t border-gray-200" />

                {/* Heel Type */}
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Heel Type
                  </p>
                  <div className="space-y-2">
                    {heelTypes.map((ht) => (
                      <label key={ht} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        <input
                          type="checkbox"
                          checked={selectedHeelTypes.includes(ht)}
                          onChange={() => toggleHeelType(ht)}
                          className="accent-[#3B5373]"
                        />
                        {ht}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200" />

                {/* Price */}
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Max Price
                  </p>
                  <input
                    type="range"
                    min={999}
                    max={2999}
                    step={100}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#3B5373]"
                  />
                  <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Up to ₹{maxPrice >= 9999 ? "Any" : maxPrice.toLocaleString("en-IN")}
                  </p>
                </div>

                {/* Clear filters */}
                {hasFilters && (
                  <>
                    <div className="border-t border-gray-200" />
                    <button
                      onClick={() => {
                        setActiveOccasion(null);
                        setSelectedHeelTypes([]);
                        setMaxPrice(9999);
                      }}
                      className="text-[11px] tracking-[0.15em] uppercase text-[#3B5373] underline"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Clear All Filters
                    </button>
                  </>
                )}
              </div>
            </aside>

            {/* Grid */}
            <div className="flex-1">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {filtered.length} {filtered.length === 1 ? "item" : "items"}
                  {hasFilters && " (filtered)"}
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="text-xs border border-gray-200 px-3 py-2 bg-white text-gray-600 focus:outline-none focus:border-[#3B5373]"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <option value="default">Sort: Featured</option>
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <p className="font-serif text-2xl text-gray-400 mb-3">No heels found</p>
                  <p className="text-sm text-gray-400" style={{ fontFamily: "'Poppins', sans-serif" }}>Try removing some filters</p>
                  <button
                    onClick={() => { setActiveOccasion(null); setSelectedHeelTypes([]); setMaxPrice(9999); }}
                    className="mt-4 text-[11px] tracking-[0.2em] uppercase text-[#3B5373] border border-[#3B5373] px-6 py-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                  {filtered.map((product) => (
                    <HeelCard key={product.slug} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Classie ───────────────────────────────────────── */}
      <section className="py-16 px-6 text-center" style={{ background: "#ffffff" }}>
        <h2 className="font-serif text-[2.4rem] font-light text-[#1a1a1a] mb-10">
          Why Choose <em className="italic text-[#3B5373]">Classie?</em>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[860px] mx-auto mb-10">
          {[
            { icon: "✨", title: "Designed to Transform", desc: "Interchangeable clip-ons let one heel match every look." },
            { icon: "👠", title: "Made for Everyday Wear", desc: "Comfort-first designs made for real movement, all day long." },
            { icon: "♻️", title: "Style That Lasts", desc: "Premium materials. Reusable clip-ons worn again and again." },
          ].map((item) => (
            <div key={item.title} className="bg-[#f5f5f5] px-8 py-10 text-center">
              <div className="text-4xl mb-4">{item.icon}</div>
              <p className="text-sm font-semibold text-[#1a1a1a] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {item.title}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 leading-loose max-w-[680px] mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Discover our curated collections designed to move seamlessly from everyday wear to special occasions.
          Explore{" "}
          <Link href="/shop/heels" className="text-[#3B5373] font-medium underline">Heels</Link>,
          shop{" "}
          <Link href="/shop/clips" className="text-[#3B5373] font-medium underline">Rhinestone Clip-ons</Link>,
          or browse our{" "}
          <Link href="/shop/bow" className="text-[#3B5373] font-medium underline">Bloom &amp; Bow Collection</Link>.
        </p>
      </section>
    </>
  );
}
