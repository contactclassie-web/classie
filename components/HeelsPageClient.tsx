"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeelProduct, HeelsSettings } from "@/lib/products";
import { supabase } from "@/lib/supabase";
import OccasionFilterSection from "./OccasionFilterSection";

// ── Why Choose Section (reads settings from DB) ───────────────────────
const WHY_DEFAULTS = {
  heading: "Why Choose",
  headingItalic: "Classie?",
  card1Icon: "✨", card1Title: "Designed to Transform", card1Desc: "Interchangeable clip-ons let one heel match every look.",
  card2Icon: "👠", card2Title: "Made for Everyday Wear", card2Desc: "Comfort-first designs made for real movement, all day long.",
  card3Icon: "♻️", card3Title: "Style That Lasts",       card3Desc: "Premium materials. Reusable clip-ons worn again and again.",
  footerText: "Discover our curated collections designed to move seamlessly from everyday wear to special occasions.",
};

function WhyChooseSection({ m }: { m: HeelsSettings }) {
  const visible = m.heels_why_visible !== "false";
  const cfg = {
    heading:       m.heels_why_heading       || WHY_DEFAULTS.heading,
    headingItalic: m.heels_why_heading_italic || WHY_DEFAULTS.headingItalic,
    card1Icon:  m.heels_why_card1_icon  || WHY_DEFAULTS.card1Icon,
    card1Title: m.heels_why_card1_title || WHY_DEFAULTS.card1Title,
    card1Desc:  m.heels_why_card1_desc  || WHY_DEFAULTS.card1Desc,
    card2Icon:  m.heels_why_card2_icon  || WHY_DEFAULTS.card2Icon,
    card2Title: m.heels_why_card2_title || WHY_DEFAULTS.card2Title,
    card2Desc:  m.heels_why_card2_desc  || WHY_DEFAULTS.card2Desc,
    card3Icon:  m.heels_why_card3_icon  || WHY_DEFAULTS.card3Icon,
    card3Title: m.heels_why_card3_title || WHY_DEFAULTS.card3Title,
    card3Desc:  m.heels_why_card3_desc  || WHY_DEFAULTS.card3Desc,
    footerText: m.heels_why_footer_text || WHY_DEFAULTS.footerText,
  };

  const cards = [
    { icon: cfg.card1Icon, title: cfg.card1Title, desc: cfg.card1Desc },
    { icon: cfg.card2Icon, title: cfg.card2Title, desc: cfg.card2Desc },
    { icon: cfg.card3Icon, title: cfg.card3Title, desc: cfg.card3Desc },
  ];

  if (!visible) return null;
  return (
    <section className="py-16 px-6 text-center" style={{ background: "#ffffff" }}>
      <h2 className="font-serif text-[2.4rem] font-light text-[#1a1a1a] mb-10">
        {cfg.heading} <em className="italic text-[#3B5373]">{cfg.headingItalic}</em>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[860px] mx-auto mb-10">
        {cards.map((item, i) => (
          <div key={i} className="bg-[#f5f5f5] px-8 py-10 text-center">
            <div className="text-4xl mb-4">{item.icon}</div>
            <p className="text-sm font-semibold text-[#1a1a1a] mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.title}</p>
            <p className="text-xs text-[#1a1a1a] leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>{item.desc}</p>
          </div>
        ))}
      </div>
      {cfg.footerText && (
        <p className="text-sm text-[#1a1a1a] leading-loose max-w-[680px] mx-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>
          {cfg.footerText}
        </p>
      )}
    </section>
  );
}

// ── Hero component (server-rendered settings via props) ───────────────
function HeelsHero({ productCount, heelTypeCount, m }: { productCount: number; heelTypeCount: number; m: HeelsSettings }) {
  const bgType   = (m.heels_hero_bg_type  || "none") as "none"|"image"|"video"|"slider";
  const bgUrl    = m.heels_hero_bg_url    || "";
  const textPos  = (m.heels_hero_text_pos || "center") as "left"|"center"|"right";
  const eyebrow  = m.heels_hero_eyebrow   || "New Collection · SS25";
  const title    = m.heels_hero_title     || "Heels";
  const subtitle = m.heels_hero_subtitle  || "Step into your story";
  const showStats = m.heels_hero_show_stats !== "false";
  const stat1Val   = m.heels_hero_stat1_val   || "";
  const stat1Label = m.heels_hero_stat1_label || "Styles";
  const stat2Val   = m.heels_hero_stat2_val   || "";
  const stat2Label = m.heels_hero_stat2_label || "Heel Types";
  const stat3Val   = m.heels_hero_stat3_val   || "Free";
  const stat3Label = m.heels_hero_stat3_label || "Shipping ₹999+";
  let slides: string[] = [];
  try { slides = m.heels_hero_slides ? JSON.parse(m.heels_hero_slides) : []; } catch { slides = []; }

  const [slideIdx, setSlideIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);

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
    <section className="relative overflow-hidden" style={{ background: "#F5F5F5", aspectRatio: "16/5" }}>
      {/* Background */}
      {bgType === "image" && bgUrl && (
        <img src={bgUrl} alt="" className="absolute inset-0 w-full h-full object-contain opacity-100" />
      )}
      {bgType === "slider" && slides.length > 0 && (
        <>
          {slides.map((s, i) => (
            <img key={s} src={s} alt="" className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700"
              style={{ opacity: i === slideIdx ? 0.9 : 0 }} />
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
          <div className="w-8 h-px bg-[#3B5373]/50" />
          <span className="text-[10px] tracking-[0.5em] uppercase text-[#3B5373]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {eyebrow}
          </span>
          <div className="w-8 h-px bg-[#3B5373]/50" />
        </div>
        <h1 className="font-serif font-light text-[#1a1a1a] leading-none mb-5" style={{ fontSize: "clamp(64px, 10vw, 96px)" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="font-serif italic text-[#1a1a1a] text-xl mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            {subtitle}
          </p>
        )}
        {showStats && (
          <div className="flex items-center gap-6" style={{ justifyContent: textPos === "center" ? "center" : textPos === "right" ? "flex-end" : "flex-start" }}>
            {[
              { val: stat1Val || String(productCount), label: stat1Label },
              { val: stat2Val || String(heelTypeCount), label: stat2Label },
              { val: stat3Val, label: stat3Label },
            ].map((s, i) => (
              <>
                {i > 0 && <div key={`div-${i}`} className="w-px h-8 bg-[#3B5373]/30" />}
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-serif font-light text-[#1a1a1a]">{s.val}</p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#3B5373] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>{s.label}</p>
                </div>
              </>
            ))}
          </div>
        )}
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
          <p className="text-[11px] text-[#1a1a1a] mt-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
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
export default function HeelsPageClient({ initialProducts, initialSettings = {}, initialOccasions, initialFilterTypes }: { initialProducts: HeelProduct[]; initialSettings?: HeelsSettings; initialOccasions?: { title: string; slug: string; image: string; tag_label?: string; image_position?: string }[]; initialFilterTypes?: string[] }) {
  const [activeOccasion, setActiveOccasion] = useState<string | null>(null);
  const [selectedHeelTypes, setSelectedHeelTypes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(9999);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "newest">("default");

  // Load filter types: use SSR-provided initialFilterTypes if available
  const [heelTypes, setHeelTypes] = useState<string[]>(() => {
    if (initialFilterTypes && initialFilterTypes.length > 0) return initialFilterTypes;
    // Fallback: auto-generate from products
    const types = new Set<string>();
    initialProducts.forEach((p) => { if (p.heel_type) types.add(p.heel_type); });
    return Array.from(types).sort();
  });

  useEffect(() => {
    // Skip if provided via SSR
    if (initialFilterTypes && initialFilterTypes.length > 0) return;
    supabase.from("site_settings").select("value").eq("key", "heels_filter_heel_types").maybeSingle()
      .then(({ data }) => {
        if (data?.value) {
          try {
            const parsed = JSON.parse(data.value);
            if (Array.isArray(parsed) && parsed.length > 0) setHeelTypes(parsed);
          } catch { /* use fallback */ }
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <HeelsHero productCount={initialProducts.length} heelTypeCount={heelTypes.length} m={initialSettings} />

      {/* ── Occasion filter + Category links (exactly like homepage) ── */}
      <OccasionFilterSection
        activeOccasion={activeOccasion}
        onOccasionClick={setActiveOccasion}
        activeCategorySlug="heels"
        initialOccasions={initialOccasions}
        compact={false}
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
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#1a1a1a] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
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
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#1a1a1a] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
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
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#1a1a1a] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
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
                  <p className="text-xs text-[#1a1a1a] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
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
                <p className="text-sm text-[#1a1a1a]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {filtered.length} {filtered.length === 1 ? "item" : "items"}
                  {hasFilters && " (filtered)"}
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="text-xs border border-gray-200 px-3 py-2 bg-white text-[#1a1a1a] focus:outline-none focus:border-[#3B5373]"
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
                  <p className="font-serif text-2xl text-[#1a1a1a] mb-3">No heels found</p>
                  <p className="text-sm text-[#1a1a1a]" style={{ fontFamily: "'Poppins', sans-serif" }}>Try removing some filters</p>
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

      {/* ── Why Choose Classie (admin-controlled) ───────────────────── */}
      <WhyChooseSection m={initialSettings} />
    </>
  );
}
