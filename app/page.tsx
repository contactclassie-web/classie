import type { Metadata } from "next";
import NewsletterSection from "@/components/NewsletterSection";
import OccasionSection from "@/components/OccasionSection";
import FeaturedPicks from "@/components/FeaturedPicks";
import TrustBand from "@/components/TrustBand";
import CategoryLinks from "@/components/CategoryLinks";
import PhilosophySection from "@/components/PhilosophySection";
import StyleInspoSection from "@/components/StyleInspoSection";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import HeroSection from "@/components/HeroSection";
import HomeHero from "@/components/home/HomeHero";
import HomeProductGrid from "@/components/home/HomeProductGrid";
import {
  SectionHeading, MarketplaceStrip, ShopByType, FreeDeliveryBanner, HowItWorks, CustomDesigns,
  SeasonEdit, Journal, WhyBuyHere, WhatsAppJoin, SeoBlock, type JournalPost,
} from "@/components/home/HomeSections";
import {
  Product,
  getProductsFromDB,
  getFeaturedProductsFromDB,
  getTabProductsFromDB,
} from "@/lib/products";
import { HOME_CONFIG_KEY, mergeHomeConfig, freeDeliveryThreshold, type SectionId } from "@/lib/homeConfig";
import { publicSupabase } from "@/lib/supabasePublic";

export const metadata: Metadata = {
  title: "CLASSIE — Shoe Clips, Shoe Charms & Heels Online India",
  description: "Shop CLASSIE — crystal shoe clips, bow & pearl shoe charms, handmade jute flower clips and comfort heels for women in India. Custom rhinestone designs. Free delivery on eligible orders, COD available.",
  keywords: ["shoe clips india", "shoe charms india", "rhinestone shoe clips", "bow clips for shoes", "crystal shoe clips", "custom rhinestone accessories", "women's heels india", "shoe accessories for women"],
  openGraph: {
    title: "CLASSIE — Shoe Clips & Shoe Charms",
    description: "Crystal, bow, pearl & jute shoe charms. One clip, a whole new shoe.",
    url: "https://classie.co.in",
    siteName: "CLASSIE",
    images: [{ url: "https://res.cloudinary.com/dbzt3soyi/image/upload/v1782380055/f5d0052f-6be6-4ac9-bee2-ffa893f3d4a3_je39kw.png", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CLASSIE — Shoe Clips & Shoe Charms for Women",
    description: "Crystal, bow, pearl & jute shoe charms for women in India.",
  },
  alternates: { canonical: "https://www.classie.co.in" },
};

export const dynamic = "force-dynamic";

const WRAP = "max-w-[1280px] mx-auto px-4 md:px-10";

const FALLBACK_OCCASIONS = [
  { title: "The Date Edit", href: "/shop/the-date-edit", image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/70.png?v=1767129647", tag_label: "FESTIVE" },
  { title: "The Everyday Edit", href: "/shop/the-everyday-edit", image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/40_c9833246-51b7-4ff5-8200-acf9809593c5.png?v=1767109414", tag_label: "EVERYDAY" },
  { title: "The Festive Edit", href: "/shop/the-festive-edit", image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/75.png?v=1767179583", tag_label: "NEW IN" },
];

// Settings read by the homepage and the old (switchable) sections.
const LEGACY_KEYS = [
  "hero_eyebrow","hero_heading_line1","hero_heading_italic","hero_heading_line3",
  "hero_subtitle","hero_cta1_text","hero_cta1_url","hero_cta2_text","hero_cta2_url",
  "hero_image_url","hero_stat1_number","hero_stat1_label","hero_stat2_number","hero_stat2_label",
  "hero_stat3_number","hero_stat3_label","hero_chip_code","hero_chip_text","band_text",
  "hero_badge_text","hero_badge_sub","hero_badge_active","hero_pill_text","hero_pill_sub","hero_pill_active",
  "philosophy_eyebrow","philosophy_headline","philosophy_headline_italic","philosophy_headline2",
  "philosophy_body","philosophy_cta_text","philosophy_cta_url","philosophy_image_url",
  "phil_stat1_number","phil_stat1_label","phil_stat2_number","phil_stat2_label",
  "phil_stat3_number","phil_stat3_label","phil_f1_title","phil_f1_desc","phil_f2_title","phil_f2_desc",
  "ig_handle","ig_heading","ig_subtext","ig_follow_text","ig_follow_url","adv_inspo_desktop","adv_inspo_gap",
  "cat_links_bold","cat_links_hover","cat_links_hover_bg","cat_links_hover_text","cat_num_color","cat_text_size",
  "coll_testimonial_text","coll_testimonial_author",
];
const FP_KEYS = [
  "fp_tab1_label","fp_tab1_active","fp_tab2_label","fp_tab2_active","fp_tab3_label","fp_tab3_active",
  "fp_eyebrow","fp_heading","fp_heading_italic",
  "adv_picks_mobile","adv_picks_desktop","adv_picks_gap","adv_picks_aspect","adv_picks_radius","adv_picks_card_h",
];
const NL_KEYS = ["nl_eyebrow","nl_heading","nl_heading_italic","nl_subtext","nl_placeholder","nl_btn_text","nl_success_text"];
const HOME_KEYS = [HOME_CONFIG_KEY, "shipping_tiers", "shipping_default_fee", "footer_whatsapp_url"];

export default async function HomePage() {
  const sb = publicSupabase();

  const [allProducts, settingsRes, heroRes, colorRes, igRes] = await Promise.all([
    getProductsFromDB({ active: true }),
    sb.from("site_settings").select("key,value").in("key", [...HOME_KEYS, ...LEGACY_KEYS, ...FP_KEYS, ...NL_KEYS]),
    sb.from("hero_slides").select("image_url").eq("active", true).eq("page", "home").order("display_order", { ascending: true }),
    sb.from("product_color_variants").select("product_slug,color_name,color_hex"),
    sb.from("instagram_images").select("image_url, link_url").eq("active", true).order("display_order", { ascending: true }).limit(9),
  ]);

  const cfg: Record<string, string> = {};
  (settingsRes.data ?? []).forEach((r: { key: string; value: string }) => { cfg[r.key] = r.value; });

  let saved: unknown = null;
  try { saved = cfg[HOME_CONFIG_KEY] ? JSON.parse(cfg[HOME_CONFIG_KEY]) : null; } catch { saved = null; }
  const home = mergeHomeConfig(saved);
  const on = new Set<SectionId>(home.sections.filter((s) => s.on).map((s) => s.id));
  const amount = freeDeliveryThreshold(cfg.shipping_tiers, cfg.shipping_default_fee);

  // Only fetch what the switched-on sections need.
  const [journalRes, collectionsRes, featuresRes, siteCatsRes, legacyPicks] = await Promise.all([
    on.has("journal")
      ? sb.from("blog_posts").select("slug,title,cover_image,category").eq("active", true).order("published_at", { ascending: false }).limit(home.journal.count)
      : Promise.resolve({ data: [] as JournalPost[] }),
    on.has("legacyOccasions")
      ? sb.from("collections").select("*").eq("active", true).order("display_order", { ascending: true })
      : Promise.resolve({ data: null }),
    on.has("legacyTrustBand")
      ? sb.from("features_bar").select("icon,title,active,display_order").eq("active", true).order("display_order", { ascending: true })
      : Promise.resolve({ data: null }),
    on.has("legacyOccasions")
      ? sb.from("site_categories").select("*").eq("active", true).order("display_order", { ascending: true })
      : Promise.resolve({ data: null }),
    on.has("legacyFeaturedPicks")
      ? Promise.all([getFeaturedProductsFromDB(), getTabProductsFromDB("latest"), getTabProductsFromDB("bestseller"), getTabProductsFromDB("sale")])
      : Promise.resolve(null),
  ]);

  // Product colours for the dots and the quick-add chooser.
  const colors: Record<string, Record<string, string>> = {};
  (colorRes.data ?? []).forEach((r: { product_slug: string; color_name: string; color_hex: string | null }) => {
    if (!r.product_slug || !r.color_name || !r.color_hex) return;
    (colors[r.product_slug] ||= {})[r.color_name.toLowerCase()] = r.color_hex;
  });

  // Bestselling shoe charms: non-heel products tagged "Bestseller" in Featured Picks
  // first, then the other non-heel products. Heels have their own section.
  const pickBestsellers = (): Product[] => {
    const charms = allProducts.filter((p) => p.category !== "heels");
    const tagged = charms.filter((p) => p.featured_tab === "bestseller");
    const rest = charms.filter((p) => p.featured_tab !== "bestseller");
    return [...tagged, ...rest].slice(0, home.bestsellers.count);
  };
  const heelsList = allProducts.filter((p) => p.category === "heels").slice(0, home.heels.count);

  const heroFallback = (heroRes.data ?? []).map((r: { image_url: string }) => r.image_url).filter(Boolean);

  const igImages = igRes.data && igRes.data.length > 0
    ? igRes.data.map((img: { image_url: string; link_url: string }) => ({ image: img.image_url, link: img.link_url || "https://www.instagram.com/_classie_in/" }))
    : allProducts.slice(0, 6).map((p) => ({ image: p.image, link: "https://www.instagram.com/_classie_in/" }));

  const testimonials = (() => {
    const rawText = cfg["coll_testimonial_text"] || "";
    const rawAuthor = cfg["coll_testimonial_author"] || "";
    let items: { quote: string; author: string }[] = [];
    try { const p = JSON.parse(rawText); if (Array.isArray(p)) items = p; } catch { items = []; }
    if (!items.length && rawText) items = [{ quote: rawText, author: rawAuthor }];
    return items;
  })();

  const pick = (keys: string[]) => {
    const o: Record<string, string> = {};
    keys.forEach((k) => { if (cfg[k] !== undefined) o[k] = cfg[k]; });
    return o;
  };

  const renderSection = (id: SectionId) => {
    switch (id) {
      case "hero":
        return <HomeHero hero={home.hero} fallbackImages={heroFallback} />;
      case "marketplace":
        return <MarketplaceStrip c={home.marketplace} />;
      case "types":
        return <ShopByType c={home.types} />;
      case "bestsellers": {
        const list = pickBestsellers();
        if (!list.length) return null;
        const b = home.bestsellers;
        return (
          <section className={`${WRAP} py-10 md:py-16`}>
            <SectionHeading eyebrow={b.eyebrow} heading={b.heading} italic={b.headingItalic} linkText={b.linkText} linkUrl={b.linkUrl} />
            <HomeProductGrid products={list} colors={colors} />
          </section>
        );
      }
      case "freeDelivery":
        return <FreeDeliveryBanner c={home.freeDelivery} amount={amount} />;
      case "howItWorks":
        return <HowItWorks c={home.howItWorks} />;
      case "custom":
        return <CustomDesigns c={home.custom} />;
      case "edit":
        return <SeasonEdit c={home.edit} />;
      case "heels": {
        if (!heelsList.length) return null;
        const h = home.heels;
        return (
          <section className={`${WRAP} py-10 md:py-16`}>
            <SectionHeading eyebrow={h.eyebrow} heading={h.heading} italic={h.headingItalic} linkText={h.linkText} linkUrl={h.linkUrl} />
            <HomeProductGrid products={heelsList} colors={colors} />
          </section>
        );
      }
      case "instagram":
        return <StyleInspoSection initialImages={igImages} initialSettings={cfg} />;
      case "journal":
        return <Journal c={home.journal} posts={(journalRes.data ?? []) as JournalPost[]} />;
      case "reviews":
        return testimonials.length > 0 ? <TestimonialCarousel items={testimonials} intervalMs={5000} /> : null;
      case "why":
        return <WhyBuyHere c={home.why} amount={amount} />;
      case "whatsapp":
        return <WhatsAppJoin c={home.whatsapp} url={home.whatsapp.url || cfg.footer_whatsapp_url || ""} />;
      case "seo":
        return <SeoBlock c={home.seo} amount={amount} />;

      // ── Old sections: kept intact, switched off by default ──
      case "legacyHero":
        return (
          <HeroSection
            heroSlides={heroRes.data ?? []}
            heroImageUrl={cfg["hero_image_url"] || "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/75.png?v=1767179583"}
            initialSettings={cfg}
          />
        );
      case "legacyTrustBand":
        return <TrustBand initialItems={featuresRes.data ?? []} />;
      case "legacyOccasions": {
        const dbCollections = collectionsRes.data as { title: string; slug: string; image_url?: string; tag_label?: string; image_position?: string }[] | null;
        const occasions = dbCollections && dbCollections.length > 0
          ? dbCollections.map((c) => ({ title: c.title, href: `/shop/${c.slug}`, image: c.image_url ?? "", tag_label: c.tag_label ?? "", image_position: c.image_position ?? "top" }))
          : FALLBACK_OCCASIONS;
        return (
          <section className="py-12 bg-white">
            <div className="max-w-[1280px] mx-auto px-4 md:px-10">
              <div className="text-center mb-10">
                <span className="font-sans text-[10px] font-light tracking-[0.38em] uppercase text-[#3B5373]">Curated Edits</span>
                <h2 className="font-serif text-[clamp(2.2rem,3.8vw,3.6rem)] font-light leading-[1.08] text-[#1a1a1a] mt-3">
                  Shop by <em className="italic text-[#3B5373]">Occasion</em>
                </h2>
              </div>
              <OccasionSection initialOccasions={occasions} />
              <CategoryLinks initialCategories={siteCatsRes.data ?? []} initialSettings={cfg} />
            </div>
          </section>
        );
      }
      case "legacyFeaturedPicks": {
        if (!legacyPicks) return null;
        const [featured, latestTab, bestTab, saleTab] = legacyPicks;
        const latest = latestTab.length > 0 ? latestTab : allProducts.slice(0, 4);
        const best = bestTab.length > 0 ? bestTab : featured.length > 0 ? featured.slice(0, 4) : allProducts.slice(0, 4);
        const sale = saleTab.length > 0 ? saleTab : allProducts.filter((p) => p.comparePrice && p.comparePrice > p.price).slice(0, 4);
        return <FeaturedPicks latestProducts={latest} bestSellers={best} saleProducts={sale} initialSettings={pick(FP_KEYS)} />;
      }
      case "legacyPhilosophy":
        return <PhilosophySection initialSettings={cfg} />;
      case "legacyNewsletter":
        return <NewsletterSection initialSettings={pick(NL_KEYS)} />;
      default:
        return null;
    }
  };

  return (
    <>
      {home.sections.filter((s) => s.on).map((s) => (
        <div key={s.id} data-section={s.id}>{renderSection(s.id)}</div>
      ))}
    </>
  );
}
