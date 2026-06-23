import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";
import NewsletterSection from "@/components/NewsletterSection";
import OccasionSection from "@/components/OccasionSection";
import FeaturedPicks from "@/components/FeaturedPicks";
import HeroImageSlider from "@/components/HeroImageSlider";
import HeroSection from "@/components/HeroSection";
import TrustBand from "@/components/TrustBand";
import CategoryLinks from "@/components/CategoryLinks";
import PhilosophySection from "@/components/PhilosophySection";
import StyleInspoSection from "@/components/StyleInspoSection";
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
  const [allProducts, featuredProducts, latestTabProducts, bestsellerTabProducts, saleTabProducts] = await Promise.all([
    getProductsFromDB({ active: true }),
    getFeaturedProductsFromDB(),
    getTabProductsFromDB("latest"),
    getTabProductsFromDB("bestseller"),
    getTabProductsFromDB("sale"),
  ]);

  const latestProducts =
    latestTabProducts.length > 0 ? latestTabProducts : allProducts.slice(0, 4);
  const bestSellers =
    bestsellerTabProducts.length > 0
      ? bestsellerTabProducts
      : featuredProducts.length > 0
      ? featuredProducts.slice(0, 4)
      : allProducts.slice(0, 4);
  const saleProducts = saleTabProducts.length > 0
    ? saleTabProducts
    : allProducts.filter((p) => p.comparePrice && p.comparePrice > p.price).slice(0, 4);

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
  const heroCta2Text = cfg["hero_cta2_text"] || "Explore Edits";
  const heroCta2Url = cfg["hero_cta2_url"] || "/collections";
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
      {/* ══ 1. HERO ═══════════════════════════════════════════════════════ */}
      <HeroSection heroSlides={heroSlides ?? []} heroImageUrl={heroImageUrl} initialSettings={cfg} />

      {/* ══ 2. TRUST BAND ══════════════════════════════════════════════════ */}
      <TrustBand />

      {/* ══ 3. SHOP BY OCCASION ════════════════════════════════════════════ */}
      <section className="py-12 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          {/* Header — centered like HTML design */}
          <div className="text-center mb-10">
              <span className="font-sans text-[10px] font-light tracking-[0.38em] uppercase text-[#3B5373]">
                Curated Edits
              </span>
              <h2 className="font-serif text-[clamp(2.2rem,3.8vw,3.6rem)] font-light leading-[1.08] text-[#1a1a1a] mt-3">
                Shop by <em className="italic text-[#3B5373]">Occasion</em>
              </h2>
          </div>
          <OccasionSection />
          {/* Numbered Quick Links Row */}
          <CategoryLinks />
        </div>
      </section>

      {/* ══ 5. FEATURED PICKS ═════════════════════════════════════════════ */}
      <FeaturedPicks latestProducts={latestProducts} bestSellers={bestSellers} saleProducts={saleProducts} />

      {/* ══ 6. PHILOSOPHY ═════════════════════════════════════════════════ */}
      <PhilosophySection />

      {/* ══ 7. STYLE INSPO ════════════════════════════════════════════════ */}
      <StyleInspoSection />

      {/* ══ 8. NEWSLETTER ═════════════════════════════════════════════════ */}
      <NewsletterSection />
    </>
  );
}
