import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Instagram } from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import NewsletterSection from "@/components/NewsletterSection";
import OccasionCarousel from "@/components/OccasionCarousel";
import FeaturedPicks from "@/components/FeaturedPicks";
import {
  Product,
  CURATED_COLLECTIONS,
  getProductsFromDB,
  getFeaturedProductsFromDB,
  getTabProductsFromDB,
} from "@/lib/products";
import { getHeroSlidesFromDB } from "@/lib/slides";

export const revalidate = 60;

export default async function HomePage() {
  // ── Fetch live data from Supabase (falls back to hardcoded if DB unavailable) ──
  const [allProducts, featuredProducts, heroSlides, latestTabProducts, bestsellerTabProducts] = await Promise.all([
    getProductsFromDB({ active: true }),
    getFeaturedProductsFromDB(),
    getHeroSlidesFromDB(),
    getTabProductsFromDB('latest'),
    getTabProductsFromDB('bestseller'),
  ]);

  const heels = allProducts.filter((p) => p.category === "heels");
  const accessories = allProducts.filter((p) => p.category === "accessories");

  // Featured Picks: admin-controlled via featured_tab column, fallback to defaults
  const latestProducts =
    latestTabProducts.length > 0 ? latestTabProducts : allProducts.slice(0, 4);
  const bestSellers =
    bestsellerTabProducts.length > 0
      ? bestsellerTabProducts
      : featuredProducts.length > 0
      ? featuredProducts.slice(0, 4)
      : allProducts.slice(0, 4);

  // Occasion rows — resolve slugs from live products
  const resolveCollection = (key: keyof typeof CURATED_COLLECTIONS, limit = 5): Product[] =>
    CURATED_COLLECTIONS[key].slugs
      .map((s) => allProducts.find((p) => p.slug === s))
      .filter((p): p is Product => p !== undefined)
      .slice(0, limit);

  const dateEdit = resolveCollection("the-date-edit");
  const everydayEdit = resolveCollection("the-everyday-edit");
  const festiveEdit = resolveCollection("the-festive-edit");

  // Occasions & Categories — fetch from DB (admin se manage hoga)
  const { createClient } = await import("@supabase/supabase-js");
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data: dbCollections } = await sb.from("collections").select("*").eq("active", true).order("display_order", { ascending: true });
  const { data: dbSiteCategories } = await sb.from("site_categories").select("*").eq("active", true).order("display_order", { ascending: true });
  const siteCategories: Array<{ name: string; slug: string; description: string; image_url: string }> = dbSiteCategories ?? [];
  
  const FALLBACK_OCCASIONS = [
    { title: "The Date Edit",     href: "/shop/the-date-edit",     image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/70.png?v=1767129647" },
    { title: "The Everyday Edit", href: "/shop/the-everyday-edit", image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/40_c9833246-51b7-4ff5-8200-acf9809593c5.png?v=1767109414" },
    { title: "The Festive Edit",  href: "/shop/the-festive-edit",  image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/75.png?v=1767179583" },
  ];
  const occasions = dbCollections && dbCollections.length > 0
    ? dbCollections.map((c: { title: string; slug: string; image_url?: string }) => ({
        title: c.title,
        href: `/shop/${c.slug}`,
        image: c.image_url ?? "",
      }))
    : FALLBACK_OCCASIONS;

  // Instagram feed images (first 4 products)
  const igImages = allProducts.slice(0, 4).map((p) => ({ image: p.image, slug: p.slug, title: p.title }));

  return (
    <>
      {/* ══ 1. HERO SLIDER ══════════════════════════════════════════════ */}
      <HeroSlider slides={heroSlides} />

      {/* ══ 2. SHOP BY OCCASION — Circular Premium Design ══════════════ */}
      <section className="pt-16 pb-10 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <p className="section-subheading mb-3">Our Collections</p>
          <h2 className="mb-10 section-heading">Shop by Occasion</h2>
          <OccasionCarousel occasions={occasions} />
        </div>
      </section>

      {/* ══ 3. SHOP BY CATEGORY ══════════════════════════════════════════ */}
      <section className="pt-10 pb-10 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="section-subheading text-left">Collections</p>
          <h2 className="section-heading text-left mt-2 mb-10">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {siteCategories.map((cat) => (
              <Link key={cat.slug} href={`/shop/${cat.slug}`}
                className="group relative overflow-hidden bg-classie-light"
                style={{ aspectRatio: "3 / 4" }}
              >
                {cat.image_url && (
                  <Image src={cat.image_url} alt={cat.name} fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="font-serif text-3xl mb-1">{cat.name}</h3>
                  <p className="text-sm text-white/75">{cat.description}</p>
                </div>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 4. FEATURED PICKS ════════════════════════════════════════════ */}
      <FeaturedPicks latestProducts={latestProducts} bestSellers={bestSellers} />

      {/* ══ OUR STORY — Editorial Banner ════════════════════════════════ */}
      <section className="bg-[#3B5373] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Left: editorial headline */}
          <div>
            <p className="text-[11px] tracking-[0.5em] uppercase text-white/40 mb-6">Our Philosophy</p>
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-none uppercase">
              One Heel.<br />
              Endless<br />
              Possibilities.
            </h2>
          </div>
          {/* Right: copy + CTA */}
          <div className="md:border-l md:border-white/20 md:pl-12">
            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-8">
              Classie was born from a simple idea — every woman deserves to feel powerful in her heels.
              Comfort-first design, premium quality, styled your way. From morning coffee to midnight
              celebrations, there&apos;s a Classie for every chapter of your day.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 border border-white/40 text-white px-8 py-3.5 text-sm tracking-widest uppercase hover:bg-white hover:text-[#3B5373] transition-all duration-300"
            >
              Our Story <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 5. NEWSLETTER ════════════════════════════════════════════════ */}
      <NewsletterSection />

      {/* ══ TESTIMONIALS ═════════════════════════════════════════════════ */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <p className="section-subheading mb-10">What They Say</p>
          <blockquote className="font-serif text-2xl md:text-3xl text-gray-800 leading-relaxed mb-8" style={{fontFamily:"'Playfair Display', serif", fontWeight:400}}>
            &ldquo;The most elegant heels I&apos;ve owned. Wore them all evening at a wedding — zero discomfort, endless compliments.&rdquo;
          </blockquote>
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400">— Priya S., Delhi</p>
        </div>
      </section>

      {/* ══ INSTAGRAM FEED — Premium Grid ════════════════════════════════ */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <p className="section-subheading mb-3">Instagram</p>
            <h2 className="section-heading mb-2">As Seen on Instagram</h2>
            <p className="text-gray-400 text-xs tracking-wide" style={{fontFamily:"'Poppins', sans-serif", fontWeight:300}}>Tag us @_classie_in to be featured</p>
          </div>

          <a
            href="https://www.instagram.com/_classie_in/"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              {igImages.map((item, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden bg-classie-light"
                  style={{ aspectRatio: "1 / 1" }}
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  )}
                  {/* Instagram overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <Instagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </a>

          <div className="text-center mt-8">
            <a
              href="https://www.instagram.com/_classie_in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#3B5373] border border-[#3B5373] px-8 py-3 tracking-[0.2em] uppercase hover:bg-[#3B5373] hover:text-white transition-all duration-300"
            >
              <Instagram className="w-4 h-4" />
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
