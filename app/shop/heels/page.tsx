import { Metadata } from "next";
import { getHeelsForPageFromDB, getHeelsSettings } from "@/lib/products";
import HeelsPageClient from "@/components/HeelsPageClient";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Buy Women's Heels Online India — Block, Slingback & Sculpted Heels | CLASSIE",
  description:
    "Shop CLASSIE women's heels online in India — block heels, slingback heels, sculpted heels, slim heels & more. Premium quality, free shipping above ₹999, COD available. Buy heels for wedding, office, party & everyday wear.",
};

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default async function HeelsPage() {
  const [products, settings, collectionsData, filterSettingData, collectionProductsData] = await Promise.all([
    getHeelsForPageFromDB(),
    getHeelsSettings(),
    sb.from("collections").select("*").eq("active", true).order("display_order", { ascending: true }),
    sb.from("site_settings").select("value").eq("key", "heels_filter_heel_types").maybeSingle(),
    sb.from("collection_products").select("collection_id, product_slug"),
  ]);

  const initialOccasions = (collectionsData.data ?? []).map((c) => ({
    title: c.title,
    slug: c.slug,
    image: c.image_url ?? "",
    tag_label: c.tag_label ?? "",
    image_position: c.image_position ?? "50% 50%",
  }));

  // Build map: collection_slug → product_slugs[]
  const collectionSlugMap: Record<string, string[]> = {};
  const collectionIdToSlug: Record<string, string> = {};
  (collectionsData.data ?? []).forEach((c: any) => { collectionIdToSlug[c.id] = c.slug; });
  (collectionProductsData.data ?? []).forEach((row: any) => {
    const slug = collectionIdToSlug[row.collection_id];
    if (!slug) return;
    if (!collectionSlugMap[slug]) collectionSlugMap[slug] = [];
    collectionSlugMap[slug].push(row.product_slug);
  });

  let initialFilterTypes: string[] | undefined;
  if (filterSettingData.data?.value) {
    try {
      const parsed = JSON.parse(filterSettingData.data.value);
      if (Array.isArray(parsed) && parsed.length > 0) initialFilterTypes = parsed;
    } catch { /* ignore */ }
  }

  return (
    <>
      <HeelsPageClient initialProducts={products} initialSettings={settings} initialOccasions={initialOccasions} initialFilterTypes={initialFilterTypes} collectionSlugMap={collectionSlugMap} />

      {/* SEO Content Block */}
      <section style={{ background: "#fafafa", borderTop: "1px solid #e8e8e8", borderBottom: "1px solid #e8e8e8" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2rem", fontWeight: 400, color: "#1a1a1a", marginBottom: "28px", letterSpacing: "0.02em" }}>
            Buy Women&apos;s Heels Online in India
          </h2>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.82rem", color: "#555", lineHeight: 1.9, marginBottom: "16px", fontWeight: 300 }}>
            CLASSIE offers a curated collection of premium <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>women&apos;s heels online in India</strong> — from everyday <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>block heels</strong> and <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>slingback heels</strong> to elegant sculpted heels and slim stilettos. Whether you&apos;re shopping for <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>heels for an Indian wedding</strong>, office wear, a party or everyday styling, we have the perfect pair for every occasion.
          </p>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.82rem", color: "#555", lineHeight: 1.9, marginBottom: "16px", fontWeight: 300 }}>
            Our <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>block heels for women</strong> are designed for all-day comfort without compromising on style. The <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>slingback heels</strong> and pointed toe styles are perfect for ethnic wear and sarees, while our <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>comfortable heels for long hours</strong> are crafted with premium cushioning and stable bases.
          </p>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.82rem", color: "#555", lineHeight: 1.9, marginBottom: "40px", fontWeight: 300 }}>
            Shop <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>black heels</strong>, <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>white heels</strong>, <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>gold &amp; silver heels</strong>, <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>maroon heels</strong>, <strong style={{ color: "#1a1a1a", fontWeight: 500 }}>cream heels</strong> and more — all with free shipping above ₹999 and COD across India.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
            {["Block Heels", "Slingback Heels", "Wedding Heels", "Office Heels"].map((label) => (
              <a key={label} href="/shop/heels" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#3B5373", border: "1px solid #3B5373", padding: "8px 20px", textDecoration: "none" }}>
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
          { "@type": "Question", "name": "Where can I buy women's heels online in India?", "acceptedAnswer": { "@type": "Answer", "text": "You can buy premium women's heels online at CLASSIE (classie.co.in). We offer block heels, slingback heels, sculpted heels and more with free shipping above ₹999 and COD across India." } },
          { "@type": "Question", "name": "Which heels are best for Indian weddings?", "acceptedAnswer": { "@type": "Answer", "text": "For Indian weddings, block heels and slingback heels work best with sarees and lehengas. Gold, cream, and maroon heels are the most popular choices for bridal and wedding guest outfits." } },
          { "@type": "Question", "name": "Are block heels comfortable for long hours?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! Block heels distribute weight evenly and are much more comfortable than stilettos. CLASSIE block heels are designed with premium cushioning for all-day wear at office or events." } },
          { "@type": "Question", "name": "What is the price range of CLASSIE heels?", "acceptedAnswer": { "@type": "Answer", "text": "CLASSIE women's heels are priced between ₹1,499 to ₹3,999. Free shipping is available on orders above ₹999 with cash on delivery across India." } },
        ]
      }) }} />
    </>
  );
}
