import { Metadata } from "next";
import { getShopCategorySettings } from "@/lib/products";
import ShopCategoryPageClient from "@/components/ShopCategoryPageClient";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Buy Shoe Clips Online India — Rhinestone, Crystal & Bow Clips for Women | CLASSIE",
  description: "Shop CLASSIE shoe clips online in India — rhinestone shoe clips, crystal clips, bow clips, floral clips & more. Instantly transform any pair of heels or flats. Free shipping above ₹499. COD available.",
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

export default async function ClipsPage() {
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
        <h2 className="text-2xl font-serif font-light text-[#1a1a1a] mb-6">Buy Shoe Clips Online in India</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
          CLASSIE is India&apos;s favourite destination to <strong>buy shoe clips online</strong>. Our handcrafted <strong>rhinestone shoe clips</strong>, <strong>bow clips for shoes</strong>, <strong>crystal clips</strong>, and <strong>floral shoe clips</strong> are designed to transform any pair of heels, flats, or sandals instantly — no glue, no damage, no effort.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Looking for <strong>shoe clips for wedding</strong>? Our bridal shoe clips add the perfect sparkle to your wedding day shoes. The <strong>Ivory Pearl Bow</strong>, <strong>Starburst Crystal</strong>, and <strong>Butterfly Bling</strong> are top picks for brides across India. Want to style your saree? Our <strong>saree accessories</strong> collection includes clips that work beautifully on dupattas, belts, and blouse pins too.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
          All CLASSIE shoe clips are sold as a pair, made with premium materials, and available with free shipping above ₹499 and COD across India. Discover <strong>bow clips</strong>, <strong>crystal clips</strong>, <strong>satin clips</strong>, and <strong>fabric flower clips</strong> — all under one roof.
        </p>
      </section>

      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "How do shoe clips work?", "acceptedAnswer": { "@type": "Answer", "text": "Shoe clips clip onto the fabric or straps of any shoe using a hinged clip mechanism — no glue or tools needed. They can be attached and removed in seconds without damaging your shoes." } },
          { "@type": "Question", "name": "Where to buy shoe clips online in India?", "acceptedAnswer": { "@type": "Answer", "text": "CLASSIE (classie.co.in) offers India's finest collection of shoe clips — rhinestone, crystal, bow, and floral styles. Free shipping above ₹499 with COD available pan-India." } },
          { "@type": "Question", "name": "Can I use shoe clips on any type of shoe?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! CLASSIE shoe clips work on heels, flats, sandals, ballerinas, and most fabric or strap-based shoes. They also double as bag charms, hair clips and dupatta pins." } },
          { "@type": "Question", "name": "What shoe clips are best for a saree?", "acceptedAnswer": { "@type": "Answer", "text": "For sarees, rhinestone and crystal shoe clips add the perfect touch of elegance. Bow clips in gold, silver or pearl tones complement both traditional and contemporary saree looks." } },
        ]
      }) }} />
    </>
  );
}
