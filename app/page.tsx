import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Star, Truck, RefreshCw, Shield, Sparkles } from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import NewsletterSection from "@/components/NewsletterSection";
import {
  Product,
  CURATED_COLLECTIONS,
  getProductsFromDB,
  getFeaturedProductsFromDB,
} from "@/lib/products";

export const revalidate = 60;

export default async function HomePage() {
  // ── Fetch live data from Supabase (falls back to hardcoded if DB unavailable) ──
  const [allProducts, featuredProducts] = await Promise.all([
    getProductsFromDB({ active: true }),
    getFeaturedProductsFromDB(),
  ]);

  const heels = allProducts.filter((p) => p.category === "heels");
  const accessories = allProducts.filter((p) => p.category === "accessories");

  // Safe image access for category banners
  const heelsCategoryImage = heels[6]?.image ?? heels[0]?.image ?? "";
  const clipsImage =
    accessories.find((p) => p.collection === "clips")?.image ?? "";

  // "Most Loved" section: use featured if available, else first 8
  const bestsellers =
    featuredProducts.length > 0
      ? featuredProducts.slice(0, 8)
      : allProducts.slice(0, 8);

  // Occasion rows — resolve slugs from live products
  const resolveCollection = (key: keyof typeof CURATED_COLLECTIONS, limit = 5): Product[] =>
    CURATED_COLLECTIONS[key].slugs
      .map((s) => allProducts.find((p) => p.slug === s))
      .filter((p): p is Product => p !== undefined)
      .slice(0, limit);

  const dateEdit = resolveCollection("the-date-edit");
  const everydayEdit = resolveCollection("the-everyday-edit");
  const festiveEdit = resolveCollection("the-festive-edit");

  return (
    <>
      {/* ══ 1. HERO SLIDER ══════════════════════════════════════════════ */}
      <HeroSlider />

      {/* ══ TRUST BAR ═══════════════════════════════════════════════════ */}
      <div className="border-b border-classie-border bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Truck,     title: "Free Shipping",   body: "On orders above ₹999" },
              { icon: RefreshCw, title: "Easy Returns",    body: "7-day exchange policy" },
              { icon: Shield,    title: "Secure Checkout", body: "100% safe & trusted" },
              { icon: Star,      title: "Premium Quality", body: "Comfort-first design" },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-[#3D4F5F] flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-classie-black">{title}</p>
                  <p className="text-xs text-classie-gray">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ 2. SHOP BY CATEGORY ══════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="section-subheading">Collections</p>
          <h2 className="section-heading mt-2 mb-10">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                label: "Heels",
                sub: "Block heels, stilettos & slingbacks",
                href: "/shop/heels",
                image: heelsCategoryImage,
                count: heels.length,
              },
              {
                label: "Clip-ons",
                sub: "Crystal clips, bow clips & satin swirls",
                href: "/shop/clips",
                image: clipsImage,
                count: accessories.length,
              },
            ].map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group relative overflow-hidden rounded-2xl bg-classie-light"
                style={{ aspectRatio: "16 / 8" }}
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-xs uppercase tracking-widest text-white/60 mb-1">
                    {cat.count} products
                  </p>
                  <h3 className="font-serif text-4xl mb-1">{cat.label}</h3>
                  <p className="text-sm text-white/75">{cat.sub}</p>
                </div>
                <div className="absolute top-4 right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  <ChevronRight className="w-4 h-4 text-[#3D4F5F]" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 3. SHOP BY OCCASION ══════════════════════════════════════════ */}
      <section className="py-16 bg-[#faf8f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="section-subheading">Curated for you</p>
          <h2 className="section-heading mt-2 mb-14">Shop by Occasion</h2>

          <OccasionRow
            label="The Date Edit"
            sub="Dressed to impress, effortlessly"
            href="/shop/the-date-edit"
            items={dateEdit}
          />
          <OccasionRow
            label="The Everyday Edit"
            sub="Comfort for the every-day woman"
            href="/shop/the-everyday-edit"
            items={everydayEdit}
          />
          <OccasionRow
            label="The Festive Edit"
            sub="Celebrate in style"
            href="/shop/the-festive-edit"
            items={festiveEdit}
          />
        </div>
      </section>

      {/* ══ 4. BESTSELLERS ═══════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[11px] tracking-[0.4em] uppercase text-classie-gray">Bestsellers</p>
              <h2 className="font-serif text-3xl md:text-4xl text-classie-black mt-2">Most Loved</h2>
            </div>
            <Link href="/shop/heels" className="hidden md:flex items-center gap-1 text-sm text-[#3D4F5F] hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {bestsellers.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
          <div className="text-center mt-10 md:hidden">
            <Link href="/shop/heels" className="btn-outline">View All</Link>
          </div>
        </div>
      </section>

      {/* ══ PROMO BANNER ══════════════════════════════════════════════════ */}
      <section className="bg-[#3D4F5F] text-white py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-4 text-amber-300" />
          <p className="text-[11px] tracking-[0.5em] uppercase text-white/50 mb-4">Limited Time</p>
          <h2 className="font-serif text-5xl md:text-6xl mb-4">Up to 35% Off</h2>
          <p className="text-white/60 text-base mb-8">
            Our hottest deals — curated styles at unbeatable prices. Cash on delivery available.
          </p>
          <Link href="/hot-deals" className="btn-ghost-white">
            Shop Hot Deals
          </Link>
        </div>
      </section>

      {/* ══ 5. NEWSLETTER ════════════════════════════════════════════════ */}
      <NewsletterSection />

      {/* ══ TESTIMONIALS ═════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="section-subheading">Happy Customers</p>
          <h2 className="section-heading mt-2 mb-10">What They Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Priya S.", review: "The Modiva heels are absolutely stunning. Wore them to my sister's wedding and got so many compliments. Super comfortable for a 4-inch heel!", rating: 5 },
              { name: "Ananya K.", review: "Ordered the satin swirl clips — they completely transformed my old heels. Fast delivery, beautiful packaging, will definitely order more!", rating: 5 },
              { name: "Meera R.", review: "Quality is premium and the price is very reasonable. The Gloss Belle fits perfectly and the cushioning is great. Very happy with my purchase.", rating: 5 },
            ].map((t) => (
              <div key={t.name} className="bg-[#faf8f6] p-6 rounded-2xl">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-classie-black text-sm leading-relaxed mb-4">&ldquo;{t.review}&rdquo;</p>
                <p className="text-xs font-semibold text-classie-gray uppercase tracking-wider">— {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ INSTAGRAM CTA ════════════════════════════════════════════════ */}
      <section className="py-14 bg-[#faf8f6] border-t border-classie-border">
        <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[11px] tracking-[0.4em] uppercase text-classie-gray mb-3">Follow us</p>
          <h2 className="font-serif text-4xl text-classie-black mb-4">@_classie_in</h2>
          <p className="text-classie-gray text-sm mb-7">Tag us in your Classie moments for a chance to be featured ✨</p>
          <a href="https://www.instagram.com/_classie_in/" target="_blank" rel="noopener noreferrer" className="btn-primary">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            Follow on Instagram
          </a>
        </div>
      </section>
    </>
  );
}

function OccasionRow({
  label,
  sub,
  href,
  items,
}: {
  label: string;
  sub: string;
  href: string;
  items: Product[];
}) {
  return (
    <div className="mb-14 last:mb-0">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h3 className="font-serif text-2xl md:text-3xl text-classie-black">{label}</h3>
          <p className="text-sm text-classie-gray mt-1">{sub}</p>
        </div>
        <Link href={href} className="flex items-center gap-1 text-sm text-[#3D4F5F] hover:underline">
          View All <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {items.map((p) => <ProductCard key={p.slug} product={p} />)}
      </div>
    </div>
  );
}
