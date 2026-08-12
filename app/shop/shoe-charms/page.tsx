import { Metadata } from "next";
import { getShopCategorySettings } from "@/lib/products";
import ShopCategoryPageClient from "@/components/ShopCategoryPageClient";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Buy Shoe Charms Online India — Crystal, Rhinestone, Flower & Bow Charms | CLASSIE",
  description: "Shop CLASSIE shoe charms online in India — rhinestone shoe charms, crystal flower charms, bow charms, pearl anklet clips & more. Perfect for weddings, parties & everyday styling. Free shipping above ₹499.",
};

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

function mapRow(row: Record<string, unknown>) {
  return {
    slug: row.slug as string,
    title: row.title as string,
    price: Number(row.price),
    comparePrice: Number(row.compare_price ?? 0),
    category: (row.category === "clips" || row.category === "bow" || row.category === "shoe-charms" ? "accessories" : row.category) as "heels" | "accessories",
    collection: "clips" as "heels" | "clips" | "bow",
    variants: { type: "none" as const, options: [] },
    image: row.image as string ?? "",
    description: (row.description as string) ?? "",
    featured_tab: (row.featured_tab as string) ?? null,
    heel_type: (row.heel_type as string) ?? null,
    tags: (row.tags as string[]) ?? [],
  };
}

export default async function ShoeCharmsPage() {
  const [shoeCharmsRes, clipsRes, bowRes, settings, collectionsData] = await Promise.all([
    sb.from("products").select("*").eq("category", "shoe-charms").eq("active", true),
    sb.from("products").select("*").eq("category", "clips").eq("active", true),
    sb.from("products").select("*").eq("category", "bow").eq("active", true),
    getShopCategorySettings("clips"),
    sb.from("collections").select("*").eq("active", true).order("display_order", { ascending: true }),
  ]);

  const allProducts = [
    ...(shoeCharmsRes.data ?? []).map(mapRow),
    ...(clipsRes.data ?? []).map(mapRow),
    ...(bowRes.data ?? []).map(mapRow),
  ];

  const initialOccasions = (collectionsData.data ?? []).map((c) => ({
    title: c.title, slug: c.slug, image: c.image_url ?? "",
    tag_label: c.tag_label ?? "", image_position: c.image_position ?? "50% 50%",
  }));

  return (
    <>
      <ShopCategoryPageClient
        initialProducts={allProducts}
        initialSettings={settings}
        category="clips"
        settingsPrefix="clips"
        categoryLabel="Shoe Charms"
        activeCategorySlug="clips"
        initialOccasions={initialOccasions}
      />

      {/* SEO Content Block */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-serif font-light text-[#1a1a1a] mb-6">Buy Shoe Charms Online in India</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
          CLASSIE offers India&apos;s most beautiful collection of <strong>shoe charms online</strong> — handcrafted <strong>crystal shoe charms</strong>, <strong>rhinestone shoe charms</strong>, <strong>bow charms</strong>, <strong>flower charms</strong>, and pearl anklet clips. Our shoe charms clip on instantly to any pair of heels, flats, or sandals — transforming your shoes in seconds.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Looking for <strong>shoe charms for wedding</strong>? Our bridal collection includes ivory pearl bows, starburst crystals, and celestial wings — perfect for brides and wedding guests. For everyday styling, our <strong>bow shoe clips</strong> and <strong>satin charms</strong> in black, beige and rose are the perfect finishing touch.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
          All CLASSIE shoe charms also work as <strong>bag charms</strong>, <strong>dupatta clips</strong>, and <strong>hair accessories</strong> — making them the most versatile accessory in your wardrobe. Free shipping above ₹499, COD available across India.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { label: "Crystal Charms", href: "/shop/shoe-charms" },
            { label: "Bow Clips", href: "/shop/shoe-charms" },
            { label: "Bridal Charms", href: "/shop/shoe-charms" },
            { label: "Flower Clips", href: "/shop/shoe-charms" },
          ].map((item) => (
            <a key={item.label} href={item.href} className="text-xs tracking-widest uppercase text-[#3B5373] border border-[#3B5373]/30 px-3 py-2 hover:bg-[#3B5373]/5 transition-colors" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {item.label}
            </a>
          ))}
        </div>
      </section>

      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "What are shoe charms and how do they work?", "acceptedAnswer": { "@type": "Answer", "text": "Shoe charms are decorative clips that attach instantly to any shoe without glue or tools. They clip onto straps, toe bands, or anywhere on your shoe to add sparkle and personality." } },
          { "@type": "Question", "name": "Can shoe charms be used as bag charms or hair clips?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! CLASSIE shoe charms are multi-use accessories. They work beautifully as bag charms, dupatta pins, hair clips and even saree pins — making them incredibly versatile." } },
          { "@type": "Question", "name": "Which shoe charms are best for Indian weddings?", "acceptedAnswer": { "@type": "Answer", "text": "For Indian weddings, crystal and rhinestone shoe charms are most popular. The Ivory Pearl Bow, Starburst Crystal, and Marquise Bloom are bestsellers for brides and wedding guests." } },
          { "@type": "Question", "name": "Where to buy shoe charms online in India?", "acceptedAnswer": { "@type": "Answer", "text": "CLASSIE (classie.co.in) is India's leading online store for premium shoe charms. We offer free shipping above ₹499 and COD across all pin codes in India." } },
        ]
      }) }} />
    </>
  );
}
