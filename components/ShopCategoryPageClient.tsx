"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeelProduct, HeelsSettings } from "@/lib/products";
import { supabase } from "@/lib/supabase";
import OccasionFilterSection from "./OccasionFilterSection";

interface Props {
  initialProducts: HeelProduct[];
  initialSettings?: HeelsSettings;
  category: string;
  settingsPrefix: string;
  categoryLabel: string;
  activeCategorySlug: string;
  initialOccasions?: { title: string; slug: string; image: string; tag_label?: string; image_position?: string }[];
}

// ── Why Choose Section ────────────────────────────────────────────────
function WhyChooseSection({ m, prefix, categoryLabel }: { m: HeelsSettings; prefix: string; categoryLabel: string }) {
  const visible = m[`${prefix}_why_visible`] !== "false";

  // Per-category default cards
  const defaultCards: Record<string, { card1Icon: string; card1Title: string; card1Desc: string; card2Icon: string; card2Title: string; card2Desc: string; card3Icon: string; card3Title: string; card3Desc: string }> = {
    clips: {
      card1Icon: "✨", card1Title: "Mix & Match",       card1Desc: "Swap styles in seconds.",
      card2Icon: "💎", card2Title: "Rhinestone Finish",  card2Desc: "Handcrafted crystals.",
      card3Icon: "🔗", card3Title: "Fits Any Heel",      card3Desc: "Clips onto any Classie heel.",
    },
    bow: {
      card1Icon: "🎀", card1Title: "Delicate Design",   card1Desc: "Soft ribbon bows.",
      card2Icon: "🌸", card2Title: "Versatile Style",   card2Desc: "From brunch to events.",
      card3Icon: "👛", card3Title: "Gift-Ready",         card3Desc: "Perfect as a gift.",
    },
  };

  const d = defaultCards[prefix] ?? {
    card1Icon: "✨", card1Title: "Designed to Transform", card1Desc: "Interchangeable clip-ons let one heel match every look.",
    card2Icon: "👠", card2Title: "Made for Everyday Wear", card2Desc: "Comfort-first designs made for real movement, all day long.",
    card3Icon: "♻️", card3Title: "Style That Lasts",       card3Desc: "Premium materials. Reusable clip-ons worn again and again.",
  };

  const cfg = {
    heading:       m[`${prefix}_why_heading`]        || "Why Choose",
    headingItalic: m[`${prefix}_why_heading_italic`] || "Classie?",
    card1Icon:  m[`${prefix}_why_card1_icon`]  || d.card1Icon,
    card1Title: m[`${prefix}_why_card1_title`] || d.card1Title,
    card1Desc:  m[`${prefix}_why_card1_desc`]  || d.card1Desc,
    card2Icon:  m[`${prefix}_why_card2_icon`]  || d.card2Icon,
    card2Title: m[`${prefix}_why_card2_title`] || d.card2Title,
    card2Desc:  m[`${prefix}_why_card2_desc`]  || d.card2Desc,
    card3Icon:  m[`${prefix}_why_card3_icon`]  || d.card3Icon,
    card3Title: m[`${prefix}_why_card3_title`] || d.card3Title,
    card3Desc:  m[`${prefix}_why_card3_desc`]  || d.card3Desc,
    footerText: m[`${prefix}_why_footer_text`] || `Discover our curated ${categoryLabel} designed to move seamlessly from everyday wear to special occasions.`,
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

// ── Hero component ────────────────────────────────────────────────────
function CategoryHero({
  productCount, filterCount, m, prefix, categoryLabel,
}: {
  productCount: number;
  filterCount: number;
  m: HeelsSettings;
  prefix: string;
  categoryLabel: string;
}) {
  // Per-category defaults
  const perCategoryDefaults: Record<string, { subtitle: string; stat3Val: string; stat3Label: string }> = {
    clips: { subtitle: "Transform any look instantly", stat3Val: "Free", stat3Label: "Shipping ₹999+" },
    bow:   { subtitle: "Romance in every step",        stat3Val: "Free", stat3Label: "Shipping ₹999+" },
  };
  const def = perCategoryDefaults[prefix] ?? { subtitle: "Step into your story", stat3Val: "Free", stat3Label: "Shipping ₹999+" };

  const bgType   = (m[`${prefix}_hero_bg_type`]  || "none") as "none"|"image"|"video"|"slider";
  const bgUrl    = m[`${prefix}_hero_bg_url`]    || "";
  const textPos  = (m[`${prefix}_hero_text_pos`] || "center") as "left"|"center"|"right";
  const eyebrow  = m[`${prefix}_hero_eyebrow`]   || "New Collection · SS25";
  const title    = m[`${prefix}_hero_title`]     || categoryLabel;
  const subtitle = m[`${prefix}_hero_subtitle`]  || def.subtitle;
  const showStats = m[`${prefix}_hero_show_stats`] !== "false";
  const stat1Val   = m[`${prefix}_hero_stat1_val`]   || "";
  const stat1Label = m[`${prefix}_hero_stat1_label`] || "Styles";
  const stat2Val   = m[`${prefix}_hero_stat2_val`]   || "";
  const stat2Label = m[`${prefix}_hero_stat2_label`] || "Filter Types";
  const stat3Val   = m[`${prefix}_hero_stat3_val`]   || def.stat3Val;
  const stat3Label = m[`${prefix}_hero_stat3_label`] || def.stat3Label;

  let slides: string[] = [];
  try { slides = m[`${prefix}_hero_slides`] ? JSON.parse(m[`${prefix}_hero_slides`]) : []; } catch { slides = []; }

  const [slideIdx, setSlideIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);

  useEffect(() => {
    if (bgType === "slider" && slides.length > 1) {
      timerRef.current = setInterval(() => setSlideIdx(i => (i + 1) % slides.length), 3500);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bgType, slides.length]);

  const isYouTube = bgUrl.includes("youtube.com") || bgUrl.includes("youtu.be");
  const ytId = isYouTube ? bgUrl.match(/(?:v=|youtu\.be\/)([^&?]+)/)?.[1] : null;

  const textAlign = textPos === "left" ? "items-start text-left" : textPos === "right" ? "items-end text-right" : "items-center text-center";
  const textPad   = textPos === "left"  ? "pl-10 md:pl-20 pr-4" :
                    textPos === "right" ? "pr-10 md:pr-20 pl-4" :
                    "px-6";

  return (
    <section className="relative overflow-hidden" style={{ background: "#F5F5F5", aspectRatio: "16/5" }}>
      {bgType === "image" && bgUrl && (
        <img src={bgUrl} alt="" className="absolute inset-0 w-full h-full object-contain opacity-100" />
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
        <video src={bgUrl} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover object-center opacity-90" />
      )}
      {bgType === "video" && isYouTube && ytId && (
        <iframe src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0`}
          className="absolute inset-0 w-full h-full opacity-30 pointer-events-none scale-[1.4]" allow="autoplay" />
      )}

      <div className={`relative z-10 flex flex-col justify-center ${textAlign} ${textPad} py-20`} style={{ minHeight: "320px" }}>
        <div className="flex items-center gap-4 mb-6" style={{ justifyContent: textPos === "center" ? "center" : textPos === "right" ? "flex-end" : "flex-start" }}>
          <div className="w-8 h-px bg-white/40" />
          <span className="text-[10px] tracking-[0.5em] uppercase text-[#3B5373]" style={{ fontFamily: "'Poppins', sans-serif" }}>
            {eyebrow}
          </span>
          <div className="w-8 h-px bg-white/40" />
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
              { val: stat2Val || String(filterCount),  label: stat2Label },
              { val: stat3Val, label: stat3Label },
            ].map((s, i) => (
              <>
                {i > 0 && <div key={`div-${i}`} className="w-px h-8 bg-white/20" />}
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

// ── Product card ──────────────────────────────────────────────────────
function CategoryProductCard({ product, cardStyle }: { product: HeelProduct; cardStyle?: { aspectRatio?: string; borderRadius?: string; height?: number } }) {
  const discount =
    product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : 0;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className={`relative overflow-hidden ${cardStyle?.borderRadius || ""}`} style={{ aspectRatio: cardStyle?.height ? undefined : (cardStyle?.aspectRatio || "1/1"), height: cardStyle?.height ? `${cardStyle.height}px` : undefined }}>
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

        {discount > 0 && (
          <div className="absolute top-3 left-3">
            <span className="bg-[#1a1a1a] text-white text-[10px] font-medium px-2 py-0.5 tracking-wide">
              -{discount}%
            </span>
          </div>
        )}

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
export default function ShopCategoryPageClient({
  initialProducts,
  initialSettings = {},
  settingsPrefix,
  categoryLabel,
  activeCategorySlug,
  initialOccasions,
}: Props) {
  const [activeOccasion, setActiveOccasion] = useState<string | null>(null);
  const [selectedFilterTypes, setSelectedFilterTypes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(9999);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "newest">("default");

  const [advMobile,  setAdvMobile]  = useState(2);
  const [advDesktop, setAdvDesktop] = useState(4);
  const [advGap,     setAdvGap]     = useState(12);
  const [advAspect,  setAdvAspect]  = useState("1/1");
  const [advRadius,  setAdvRadius]  = useState("sharp");
  const [advCardH,   setAdvCardH]   = useState(0);

  const radiusMap: Record<string,string> = { sharp: "", slight: "rounded", rounded: "rounded-xl", pill: "rounded-3xl" };

  // Load filter types from DB settings
  const [filterTypes, setFilterTypes] = useState<string[]>(() => {
    // Fallback: try to parse from initialSettings
    const raw = initialSettings[`${settingsPrefix}_filter_types`];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch { /* use fallback */ }
    }
    // Auto-generate from products heel_type field
    const types = new Set<string>();
    initialProducts.forEach((p) => { if (p.heel_type) types.add(p.heel_type); });
    return Array.from(types).sort();
  });

  useEffect(() => {
    supabase.from("site_settings").select("key,value")
      .in("key", ["adv_coll_mobile","adv_coll_desktop","adv_coll_gap","adv_coll_aspect","adv_coll_radius","adv_coll_card_h"])
      .then(({ data }) => {
        if (!data) return;
        const m: Record<string,string> = {};
        data.forEach(({ key, value }) => { m[key] = value; });
        if (m.adv_coll_mobile)  setAdvMobile(parseInt(m.adv_coll_mobile) || 2);
        if (m.adv_coll_desktop) setAdvDesktop(parseInt(m.adv_coll_desktop) || 4);
        if (m.adv_coll_gap)     setAdvGap(parseInt(m.adv_coll_gap) || 12);
        if (m.adv_coll_aspect)  setAdvAspect(m.adv_coll_aspect);
        if (m.adv_coll_radius)  setAdvRadius(m.adv_coll_radius);
        if (m.adv_coll_card_h)  setAdvCardH(parseInt(m.adv_coll_card_h) || 0);
      });

    // Skip filter_types fetch if already provided via SSR initialSettings
    if (!initialSettings[`${settingsPrefix}_filter_types`]) {
      supabase
        .from("site_settings")
        .select("value")
        .eq("key", `${settingsPrefix}_filter_types`)
        .maybeSingle()
        .then(({ data }) => {
          if (data?.value) {
            try {
              const parsed = JSON.parse(data.value);
              if (Array.isArray(parsed) && parsed.length > 0) setFilterTypes(parsed);
            } catch { /* use fallback */ }
          }
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingsPrefix]);

  const filtered = useMemo(() => {
    let result = [...initialProducts];

    if (activeOccasion) {
      result = result.filter((p) =>
        p.tags.some((t) => t.toLowerCase().includes(activeOccasion.toLowerCase()))
      );
    }

    if (selectedFilterTypes.length > 0) {
      if (settingsPrefix === "clips") {
        // Clips use tags for filtering
        result = result.filter((p) => p.tags && selectedFilterTypes.some(ft => p.tags.map((t: string) => t.toLowerCase()).includes(ft.toLowerCase())));
      } else {
        result = result.filter((p) => p.heel_type && selectedFilterTypes.includes(p.heel_type));
      }
    }

    result = result.filter((p) => p.price <= maxPrice);

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sortBy === "newest") result.sort((a, b) => (a.featured_tab === "latest" ? -1 : b.featured_tab === "latest" ? 1 : 0));

    return result;
  }, [initialProducts, activeOccasion, selectedFilterTypes, maxPrice, sortBy]);

  const toggleFilterType = (ft: string) => {
    setSelectedFilterTypes((prev) =>
      prev.includes(ft) ? prev.filter((x) => x !== ft) : [...prev, ft]
    );
  };

  const hasFilters = activeOccasion || selectedFilterTypes.length > 0 || maxPrice < 9999;

  return (
    <>
      <CategoryHero
        productCount={initialProducts.length}
        filterCount={filterTypes.length}
        m={initialSettings}
        prefix={settingsPrefix}
        categoryLabel={categoryLabel}
      />

      {settingsPrefix === "heels" && (
        <OccasionFilterSection
          activeOccasion={activeOccasion}
          onOccasionClick={setActiveOccasion}
          activeCategorySlug={activeCategorySlug}
          initialOccasions={initialOccasions}
        />
      )}

      {/* ── Shoe Charms Pill Filter (clips page only) ── */}
      {settingsPrefix === "clips" && (
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10 text-center">
            <p className="font-serif mb-6" style={{ fontSize: "1.35rem", fontWeight: 600, color: "#1a1a1a", letterSpacing: "0.02em" }}>
              Shoe Charms
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: "View All", tags: [] },
                { label: "Rhinestone Shoe Charms", tags: ["rhinestone","crystal"] },
                { label: "Flower Shoe Charms", tags: ["flower"] },
                { label: "Bow Shoe Charms", tags: ["bow"] },
                { label: "Pearl Anklet", tags: ["pearl","anklet"] },
              ].map((item) => {
                const isActive = item.tags.length === 0
                  ? selectedFilterTypes.length === 0
                  : item.tags.some(t => selectedFilterTypes.includes(t));
                return (
                  <button
                    key={item.label}
                    onClick={() => setSelectedFilterTypes(item.tags)}
                    className="transition-all duration-200"
                    style={{
                      padding: "10px 22px",
                      borderRadius: "999px",
                      border: `1.5px solid #3B5373`,
                      background: isActive ? "#3B5373" : "transparent",
                      color: isActive ? "#ffffff" : "#3B5373",
                      fontSize: "12px",
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 500,
                      letterSpacing: "0.04em",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Clip Type Pill Filter (clips page only) ── */}
      {settingsPrefix === "clips" && filterTypes.length > 0 && (
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="max-w-[1280px] mx-auto px-4 md:px-10">
            <p className="font-sans text-[10px] tracking-[0.35em] uppercase text-[#3B5373] text-center mb-5">
              Shop by Style
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {/* All pill */}
              <button
                onClick={() => setSelectedFilterTypes([])}
                className="px-6 py-2 text-[11px] tracking-[0.18em] uppercase font-medium transition-all duration-200 border"
                style={{
                  background: selectedFilterTypes.length === 0 ? "#3B5373" : "transparent",
                  color: selectedFilterTypes.length === 0 ? "#ffffff" : "#3B5373",
                  borderColor: "#3B5373",
                }}
              >
                All
              </button>
              {filterTypes.map((ft) => {
                const isActive = selectedFilterTypes.includes(ft);
                return (
                  <button
                    key={ft}
                    onClick={() => setSelectedFilterTypes(isActive ? selectedFilterTypes.filter(t => t !== ft) : [...selectedFilterTypes, ft])}
                    className="px-6 py-2 text-[11px] tracking-[0.18em] uppercase font-medium transition-all duration-200 border"
                    style={{
                      background: isActive ? "#3B5373" : "transparent",
                      color: isActive ? "#ffffff" : "#3B5373",
                      borderColor: "#3B5373",
                    }}
                  >
                    {ft}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-12" style={{ background: "#f5f5f5" }}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="flex gap-8">

            {/* Sidebar */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-24 space-y-6">

                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#1a1a1a] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Availability
                  </p>
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    <input type="checkbox" defaultChecked className="accent-[#3B5373]" />
                    In Stock ({initialProducts.length})
                  </label>
                </div>

                {filterTypes.length > 0 && (
                  <>
                    <div className="border-t border-gray-200" />
                    <div>
                      <p className="text-[10px] tracking-[0.3em] uppercase text-[#1a1a1a] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        Type
                      </p>
                      <div className="space-y-2">
                        {filterTypes.map((ft) => (
                          <label key={ft} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            <input
                              type="checkbox"
                              checked={selectedFilterTypes.includes(ft)}
                              onChange={() => toggleFilterType(ft)}
                              className="accent-[#3B5373]"
                            />
                            {ft}
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <div className="border-t border-gray-200" />

                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#1a1a1a] mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Max Price
                  </p>
                  <input
                    type="range"
                    min={99}
                    max={2999}
                    step={50}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#3B5373]"
                  />
                  <p className="text-xs text-[#1a1a1a] mt-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Up to ₹{maxPrice >= 9999 ? "Any" : maxPrice.toLocaleString("en-IN")}
                  </p>
                </div>

                {hasFilters && (
                  <>
                    <div className="border-t border-gray-200" />
                    <button
                      onClick={() => {
                        setActiveOccasion(null);
                        setSelectedFilterTypes([]);
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
                  <p className="font-serif text-2xl text-[#1a1a1a] mb-3">No items found</p>
                  <p className="text-sm text-[#1a1a1a]" style={{ fontFamily: "'Poppins', sans-serif" }}>Try removing some filters</p>
                  <button
                    onClick={() => { setActiveOccasion(null); setSelectedFilterTypes([]); setMaxPrice(9999); }}
                    className="mt-4 text-[11px] tracking-[0.2em] uppercase text-[#3B5373] border border-[#3B5373] px-6 py-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div
                  className="grid"
                  style={{ gap: advGap + "px", gridTemplateColumns: `repeat(${advDesktop}, minmax(0, 1fr))` }}
                >
                  {filtered.map((product) => (
                    <CategoryProductCard key={product.slug} product={product} cardStyle={{ aspectRatio: advAspect !== "none" ? advAspect : undefined, borderRadius: radiusMap[advRadius] || "", height: advCardH || undefined }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <WhyChooseSection m={initialSettings} prefix={settingsPrefix} categoryLabel={categoryLabel} />
    </>
  );
}
