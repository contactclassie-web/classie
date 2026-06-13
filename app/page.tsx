import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";
import NewsletterSection from "@/components/NewsletterSection";
import OccasionCarousel from "@/components/OccasionCarousel";
import FeaturedPicks from "@/components/FeaturedPicks";
import HeroImageSlider from "@/components/HeroImageSlider";
import {
  Product,
  CURATED_COLLECTIONS,
  getProductsFromDB,
  getFeaturedProductsFromDB,
  getTabProductsFromDB,
} from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // ── Fetch live data from Supabase ──────────────────────────────────────
  const [allProducts, featuredProducts, latestTabProducts, bestsellerTabProducts] = await Promise.all([
    getProductsFromDB({ active: true }),
    getFeaturedProductsFromDB(),
    getTabProductsFromDB("latest"),
    getTabProductsFromDB("bestseller"),
  ]);

  const latestProducts =
    latestTabProducts.length > 0 ? latestTabProducts : allProducts.slice(0, 4);
  const bestSellers =
    bestsellerTabProducts.length > 0
      ? bestsellerTabProducts
      : featuredProducts.length > 0
      ? featuredProducts.slice(0, 4)
      : allProducts.slice(0, 4);
  const saleProducts = allProducts.filter(
    (p) => p.comparePrice && p.comparePrice > p.price
  ).slice(0, 4);

  // ── Supabase client ────────────────────────────────────────────────────
  const { createClient } = await import("@supabase/supabase-js");
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // ── Hero Slides ───────────────────────────────────────────────────────
  const { data: heroSlides } = await sb
    .from("hero_slides")
    .select("image_url")
    .eq("active", true)
    .eq("page", "home")
    .order("display_order", { ascending: true });

  // ── Occasions & Categories ─────────────────────────────────────────────
  const { data: dbCollections } = await sb
    .from("collections")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });
  const { data: dbSiteCategories } = await sb
    .from("site_categories")
    .select("*")
    .eq("active", true)
    .order("display_order", { ascending: true });
  const siteCategories: Array<{
    name: string;
    slug: string;
    description: string;
    image_url: string;
  }> = dbSiteCategories ?? [];

  const FALLBACK_OCCASIONS = [
    {
      title: "The Date Edit",
      href: "/shop/the-date-edit",
      image:
        "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/70.png?v=1767129647",
      tag_label: "FESTIVE",
    },
    {
      title: "The Everyday Edit",
      href: "/shop/the-everyday-edit",
      image:
        "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/40_c9833246-51b7-4ff5-8200-acf9809593c5.png?v=1767109414",
      tag_label: "EVERYDAY",
    },
    {
      title: "The Festive Edit",
      href: "/shop/the-festive-edit",
      image:
        "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/75.png?v=1767179583",
      tag_label: "NEW IN",
    },
  ];
  const occasions =
    dbCollections && dbCollections.length > 0
      ? dbCollections.map(
          (c: { title: string; slug: string; image_url?: string; tag_label?: string; image_position?: string }) => ({
            title: c.title,
            href: `/shop/${c.slug}`,
            image: c.image_url ?? "",
            tag_label: c.tag_label ?? "",
            image_position: c.image_position ?? "top",
          })
        )
      : FALLBACK_OCCASIONS;

  // ── Site Settings ──────────────────────────────────────────────────────
  const HERO_KEYS = [
    "hero_eyebrow",
    "hero_heading_line1",
    "hero_heading_italic",
    "hero_heading_line3",
    "hero_subtitle",
    "hero_cta1_text",
    "hero_cta1_url",
    "hero_cta2_text",
    "hero_cta2_url",
    "hero_image_url",
    "hero_stat1_number",
    "hero_stat1_label",
    "hero_stat2_number",
    "hero_stat2_label",
    "hero_stat3_number",
    "hero_stat3_label",
    "hero_chip_code",
    "hero_chip_text",
    "band_text",
  ];
  const PHIL_KEYS = [
    "philosophy_eyebrow",
    "philosophy_headline",
    "philosophy_body",
    "philosophy_cta_text",
    "philosophy_cta_url",
    "philosophy_image_url",
  ];

  const { data: settingsRows } = await sb
    .from("site_settings")
    .select("key,value")
    .in("key", [...HERO_KEYS, ...PHIL_KEYS]);

  const cfg: Record<string, string> = {};
  (settingsRows ?? []).forEach((r: { key: string; value: string }) => {
    cfg[r.key] = r.value;
  });

  // Hero
  const heroEyebrow = cfg["hero_eyebrow"] || "";
  const heroLine1 = cfg["hero_heading_line1"] || "";
  const heroItalic = cfg["hero_heading_italic"] || "";
  const heroLine3 = cfg["hero_heading_line3"] || "";
  const heroSubtitle = cfg["hero_subtitle"] || "";
  const heroCta1Text = cfg["hero_cta1_text"] || "";
  const heroCta1Url = cfg["hero_cta1_url"] || "/shop";
  const heroCta2Text = cfg["hero_cta2_text"] || "";
  const heroCta2Url = cfg["hero_cta2_url"] || "/shop";
  const heroImageUrl =
    cfg["hero_image_url"] ||
    "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/75.png?v=1767179583";
  const heroStat1Num = cfg["hero_stat1_number"] || "";
  const heroStat1Label = cfg["hero_stat1_label"] || "";
  const heroStat2Num = cfg["hero_stat2_number"] || "";
  const heroStat2Label = cfg["hero_stat2_label"] || "";
  const heroStat3Num = cfg["hero_stat3_number"] || "";
  const heroStat3Label = cfg["hero_stat3_label"] || "";
  const showStats = !!(heroStat1Num || heroStat2Num || heroStat3Num);
  const heroChipCode = cfg["hero_chip_code"] || "";
  const heroChipText = cfg["hero_chip_text"] || "";

  // Trust Band
  const bandRaw =
    cfg["band_text"] ||
    "Free Shipping on Orders Above ₹999 · Easy Returns · Premium Quality · Comfort-First Design · Handcrafted Luxury";
  const bandItems = bandRaw.split(" · ").map((s) => s.trim()).filter(Boolean);

  // Philosophy
  const philEyebrow = cfg["philosophy_eyebrow"] || "Our Philosophy";
  const philHeadline =
    cfg["philosophy_headline"] || "One Heel. Endless Possibilities.";
  const philBody =
    cfg["philosophy_body"] ||
    "Classie was born from a simple idea — every woman deserves to feel powerful in her heels. Comfort-first design, premium quality, styled your way. From morning coffee to midnight celebrations, there's a Classie for every chapter of your day.";
  const philCtaText = cfg["philosophy_cta_text"] || "Our Story";
  const philCtaUrl = cfg["philosophy_cta_url"] || "/about";
  const philImageUrl = cfg["philosophy_image_url"] || "";

  // Instagram / Style Inspo feed — from DB first, fallback to products
  const { data: dbInstagramImages } = await sb
    .from("instagram_images")
    .select("image_url, link_url")
    .eq("active", true)
    .order("display_order", { ascending: true })
    .limit(6);

  const igImages = dbInstagramImages && dbInstagramImages.length > 0
    ? dbInstagramImages.map((img: { image_url: string; link_url: string }) => ({
        image: img.image_url,
        link: img.link_url || "https://www.instagram.com/_classie_in/",
      }))
    : allProducts.slice(0, 6).map((p) => ({
        image: p.image,
        link: "https://www.instagram.com/_classie_in/",
      }));

  const stats = [
    { number: heroStat1Num, label: heroStat1Label },
    { number: heroStat2Num, label: heroStat2Label },
    { number: heroStat3Num, label: heroStat3Label },
  ];

  return (
    <>
      {/* ══ 1. HERO — Split editorial layout ═══════════════════════════════ */}
      <section className="grid grid-cols-1 md:grid-cols-[42%_58%] min-h-[calc(100vh-72px)]">
        {/* Left: text content */}
        <div className="flex flex-col justify-center px-6 md:px-20 py-16 md:py-24 bg-white relative">
          {/* Vertical line divider */}
          <div className="absolute right-0 top-[12%] bottom-[12%] w-px bg-gradient-to-b from-transparent via-[rgba(59,83,115,0.2)] to-transparent hidden md:block" />

          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-7">
            <div className="w-8 h-px bg-[#3B5373]" />
            <span className="font-sans text-[10px] font-light tracking-[0.36em] uppercase text-[#3B5373]">
              {heroEyebrow}
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-serif text-[clamp(52px,6.2vw,94px)] font-light leading-[1.02] text-[#1a1a1a] mb-8">
            {heroLine1}
            <br />
            <em className="italic text-[#3B5373]">{heroItalic}</em>
            <br />
            {heroLine3}
          </h1>

          {/* Subtitle */}
          <p className="font-sans text-sm font-light leading-[1.85] text-[#6b7280] max-w-[360px] mb-12 tracking-[0.04em]">
            {heroSubtitle}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-6 mb-16">
            <Link
              href={heroCta1Url}
              className="bg-[#3B5373] text-white px-10 py-4 text-[10px] font-light tracking-[0.28em] uppercase border border-[#3B5373] hover:bg-[#1a1a1a] hover:border-[#1a1a1a] transition-all duration-300"
            >
              {heroCta1Text}
            </Link>
            {heroCta2Text && (
              <Link
                href={heroCta2Url}
                className="text-[10px] font-light tracking-[0.24em] uppercase text-[#3B5373] border-b border-[rgba(59,83,115,0.4)] pb-0.5 flex items-center gap-2 hover:gap-4 transition-all duration-300"
              >
                {heroCta2Text} →
              </Link>
            )}
          </div>

          {/* Stats row — only show if values exist in DB */}
          {showStats && (
            <div className="flex gap-10 pt-10 border-t border-[rgba(59,83,115,0.1)]">
              {stats.filter(s => s.number).map((stat) => (
                <div key={stat.label}>
                  <div className="font-serif text-4xl font-light text-[#1a1a1a] leading-none">
                    {stat.number}
                  </div>
                  <div className="font-sans text-[9.5px] font-light tracking-[0.2em] uppercase text-[#9ca3af] mt-1.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: auto-changing image slider */}
        <div className="relative overflow-hidden bg-[#F9F9F9] min-h-[400px]">
          <HeroImageSlider slides={heroSlides ?? []} fallbackUrl={heroImageUrl} />
          {/* Promo chip */}
          {heroChipCode && (
            <div className="absolute bottom-12 left-0 bg-white px-7 py-5 border-l-[3px] border-[#3B5373] shadow-xl">
              <div className="font-serif text-xl font-normal text-[#3B5373] tracking-[0.08em]">
                {heroChipCode}
              </div>
              <div className="font-sans text-[9.5px] font-light tracking-[0.22em] uppercase text-[#6b7280] mt-1">
                {heroChipText}
              </div>
            </div>
          )}
          {/* SS Badge */}
          <div className="absolute top-6 right-6 bg-[#3B5373] text-white text-center px-3 py-2">
            <div className="font-sans text-[10px] font-semibold tracking-[0.2em] uppercase">SS25</div>
            <div className="font-sans text-[9px] tracking-[0.14em] uppercase text-white/70 mt-0.5">New In</div>
          </div>
          {/* Live sold pill */}
          <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm shadow-md px-3 py-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
            <div>
              <p className="font-sans text-[11px] font-medium text-[#1a1a1a]">Trending today</p>
              <p className="font-sans text-[10px] text-[#9ca3af]">Limited stock</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 2. TRUST BAND — Navy scrolling ticker ══════════════════════════ */}
      <div className="bg-[#3B5373] py-4 overflow-hidden">
        <div className="flex animate-ticker w-max">
          {[...bandItems, ...bandItems].map((item, i) => (
            <span
              key={i}
              className="font-serif text-[15px] font-light italic text-white/80 px-14 whitespace-nowrap flex items-center gap-14"
            >
              {item}
              <span className="not-italic text-[7px] text-white/40">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ 3. SHOP BY OCCASION ════════════════════════════════════════════ */}
      <section className="py-20 bg-white px-6 md:px-20">
          {/* Header */}
          <div className="flex items-end justify-between mb-14">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-7 h-px bg-[#3B5373]" />
                <span className="font-sans text-[10px] font-light tracking-[0.38em] uppercase text-[#3B5373]">
                  Curated Edits
                </span>
              </div>
              <h2 className="font-serif text-[clamp(2.2rem,3.8vw,3.6rem)] font-light leading-[1.08] text-[#1a1a1a]">
                Shop by <em className="italic text-[#3B5373]">Occasion</em>
              </h2>
            </div>
          </div>
          <OccasionCarousel occasions={occasions} />
          {/* Numbered Quick Links Row */}
          {siteCategories.length > 0 && (
            <div className="grid border border-[#e8e8e8] mt-5" style={{ gridTemplateColumns: `repeat(${Math.min(siteCategories.length, 4)}, 1fr)` }}>
              {siteCategories.slice(0, 4).map((cat, idx) => (
                <Link
                  key={cat.slug}
                  href={`/shop/${cat.slug}`}
                  className="group flex items-center justify-between px-6 py-5 bg-white hover:bg-[#f7f7f7] transition-colors border-r border-[#e8e8e8] last:border-r-0"
                >
                  <div>
                    <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#9ca3af] mb-1">
                      0{idx + 1}
                    </p>
                    <p className="font-serif text-[1.05rem] text-[#1a1a1a] group-hover:text-[#3B5373] transition-colors">
                      {cat.name}
                    </p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B5373" strokeWidth="1.8" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              ))}
            </div>
          )}
      </section>

      {/* ══ 5. FEATURED PICKS ═════════════════════════════════════════════ */}
      <FeaturedPicks latestProducts={latestProducts} bestSellers={bestSellers} saleProducts={saleProducts} />

      {/* ══ 6. PHILOSOPHY — Image + Dark text layout ══════════════════════ */}
      <section className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: "82vh" }}>
        {/* Left: image */}
        <div className="relative overflow-hidden" style={{ minHeight: "400px" }}>
          {philImageUrl ? (
            <Image
              src={philImageUrl}
              alt="Classie Philosophy"
              fill
              className="object-cover object-center"
              sizes="50vw"
            />
          ) : (
            <div className="absolute inset-0 bg-[#F9F9F9] flex items-center justify-center">
              <div
                className="text-center"
                style={{ fontFamily: "var(--font-cormorant)", color: "rgba(59,83,115,0.12)", fontSize: "120px", fontWeight: 300 }}
              >
                C
              </div>
            </div>
          )}
        </div>

        {/* Right: dark content */}
        <div className="bg-[#1a1a1a] flex flex-col justify-center px-6 md:px-20 py-20">
          {/* Eyebrow */}
          <div className="flex items-center gap-4 mb-7">
            <div className="w-8 h-px bg-[rgba(59,83,115,0.6)]" />
            <span className="font-sans text-[10px] font-light tracking-[0.36em] uppercase text-[rgba(59,83,115,0.8)]">
              {philEyebrow}
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-serif text-[clamp(36px,4vw,64px)] font-light leading-[1.05] text-white mb-8">
            {philHeadline}
          </h2>

          {/* Body */}
          <p className="font-sans text-sm font-light leading-[1.85] text-white/50 mb-12 max-w-[420px] tracking-[0.03em]">
            {philBody}
          </p>

          {/* Feature rows */}
          <div className="space-y-8 mb-12">
            <div className="flex items-start gap-5">
              <span className="text-[#3B5373] text-lg mt-0.5 flex-shrink-0">✦</span>
              <div>
                <div className="font-sans text-[11px] font-light tracking-[0.24em] uppercase text-white/80 mb-1.5">
                  Comfort-First Design
                </div>
                <div className="font-sans text-xs font-light text-white/40 leading-[1.7]">
                  Engineered for all-day wear without sacrificing elegance.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-5">
              <span className="text-[#3B5373] text-lg mt-0.5 flex-shrink-0">⬡</span>
              <div>
                <div className="font-sans text-[11px] font-light tracking-[0.24em] uppercase text-white/80 mb-1.5">
                  Premium Quality
                </div>
                <div className="font-sans text-xs font-light text-white/40 leading-[1.7]">
                  Curated materials, careful craftsmanship in every pair.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-5">
              <span className="text-[#3B5373] text-lg mt-0.5 flex-shrink-0">↩</span>
              <div>
                <div className="font-sans text-[11px] font-light tracking-[0.24em] uppercase text-white/80 mb-1.5">
                  Free Exchange
                </div>
                <div className="font-sans text-xs font-light text-white/40 leading-[1.7]">
                  Not the right fit? Exchange hassle-free, always.
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Link
            href={philCtaUrl}
            className="inline-flex items-center gap-3 border border-[rgba(59,83,115,0.5)] text-white px-10 py-4 text-[10px] font-light tracking-[0.28em] uppercase hover:bg-[#3B5373] hover:border-[#3B5373] transition-all duration-300 self-start"
          >
            {philCtaText} →
          </Link>
        </div>
      </section>

      {/* ══ 8. NEWSLETTER ═════════════════════════════════════════════════ */}
      <NewsletterSection />

      {/* ══ STYLE INSPO / INSTAGRAM ═══════════════════════════════════════ */}
      <section className="py-20 bg-white border-t border-gray-100 px-6 md:px-20">
        <div>
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-8 h-px bg-[#3B5373]" />
              <span className="font-sans text-[10px] font-light tracking-[0.36em] uppercase text-[#3B5373]">
                @classie_in
              </span>
              <div className="w-8 h-px bg-[#3B5373]" />
            </div>
            <h2 className="font-serif text-[clamp(1.6rem,3vw,2.5rem)] font-light leading-[1.15] text-[#1a1a1a] mb-2">
              Style <em className="italic text-[#3B5373]">Inspo</em>
            </h2>
            <p className="text-[#9ca3af] text-xs tracking-wide font-light">
              Tag us to be featured
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-1 md:gap-1">
            {igImages.map((item, i) => (
              <a
                key={i}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden bg-[#c8d6e5]"
                style={{ aspectRatio: "1 / 1" }}
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt="Style Inspo"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 33vw, 16vw"
                  />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </a>
            ))}
          </div>
          <div className="text-center mt-8">
            <a
              href="https://www.instagram.com/_classie_in/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#3B5373] border-b border-[#3B5373] pb-0.5 hover:text-[#2a3d55] transition-colors"
            >
              Follow @classie_in →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
