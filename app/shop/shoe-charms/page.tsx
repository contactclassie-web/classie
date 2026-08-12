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
      <section style={{ background: "#fafafa", borderTop: "1px solid #e8e8e8", borderBottom: "1px solid #e8e8e8" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 400, color: "#1a1a1a", marginBottom: "28px", letterSpacing: "0.02em" }}>
            Buy Shoe Charms Online in India
          </h2>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.82rem", color: "#555", lineHeight: 1.9, marginBottom: "16px", fontWeight: 300 }}>
            CLASSIE offers India&apos;s finest collection of <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>shoe charms online</strong> — handcrafted <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>crystal shoe charms</strong>, <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>rhinestone charms</strong>, <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>bow charms</strong>, <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>flower charms</strong>, and pearl anklet clips. Our shoe charms clip on instantly to any pair of heels, flats, or sandals — no tools, no damage.
          </p>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.82rem", color: "#555", lineHeight: 1.9, marginBottom: "16px", fontWeight: 300 }}>
            Looking for <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>shoe charms for wedding</strong>? Our bridal collection — Ivory Pearl Bow, Starburst Crystal, Celestial Wings — is perfect for brides and wedding guests. For everyday styling, our <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>bow shoe clips</strong> and <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>satin charms</strong> in black, beige and rose are the finishing touch every outfit needs.
          </p>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.82rem", color: "#555", lineHeight: 1.9, marginBottom: "40px", fontWeight: 300 }}>
            All CLASSIE shoe charms also work as <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>bag charms</strong>, <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>dupatta clips</strong>, and <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>hair accessories</strong> — one clip, endless possibilities. Free shipping above ₹499, COD across India.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
            {["Crystal Charms", "Bow Clips", "Bridal Charms", "Flower Clips"].map((label) => (
              <a key={label} href="/shop/shoe-charms" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#3B5373", border: "1px solid #3B5373", padding: "8px 20px", textDecoration: "none" }}>
                {label}
              </a>
            ))}
          </div>
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
