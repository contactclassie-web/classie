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
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-serif font-light text-[#1a1a1a] mb-6">Buy Women&apos;s Heels Online in India</h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
          CLASSIE offers a curated collection of premium <strong>women&apos;s heels online in India</strong> — from everyday block heels and slingback heels to elegant sculpted heels and slim stilettos. Whether you&apos;re shopping for <strong>heels for an Indian wedding</strong>, office wear, a party or everyday styling, we have the perfect pair for every occasion.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Our <strong>block heels for women</strong> are designed for all-day comfort without compromising on style. The <strong>slingback heels</strong> and pointed toe styles are perfect for ethnic wear and sarees, while our <strong>comfortable heels for long hours</strong> are crafted with premium cushioning and stable bases.
        </p>
        <p className="text-sm text-gray-600 leading-relaxed mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
          All CLASSIE heels are available with free shipping above ₹999 and cash on delivery across India. Shop <strong>black heels</strong>, <strong>white heels</strong>, <strong>gold and silver heels</strong>, <strong>maroon heels</strong>, <strong>cream heels</strong> and more — each crafted to last.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mt-8">
          {[
            { label: "Block Heels", href: "/shop/heels" },
            { label: "Slingback Heels", href: "/shop/heels" },
            { label: "Wedding Heels", href: "/shop/heels" },
            { label: "Office Heels", href: "/shop/heels" },
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
          { "@type": "Question", "name": "Where can I buy women's heels online in India?", "acceptedAnswer": { "@type": "Answer", "text": "You can buy premium women's heels online at CLASSIE (classie.co.in). We offer block heels, slingback heels, sculpted heels and more with free shipping above ₹999 and COD across India." } },
          { "@type": "Question", "name": "Which heels are best for Indian weddings?", "acceptedAnswer": { "@type": "Answer", "text": "For Indian weddings, block heels and slingback heels work best with sarees and lehengas. Gold, cream, and maroon heels are the most popular choices for bridal and wedding guest outfits." } },
          { "@type": "Question", "name": "Are block heels comfortable for long hours?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! Block heels distribute weight evenly and are much more comfortable than stilettos. CLASSIE block heels are designed with premium cushioning for all-day wear at office or events." } },
          { "@type": "Question", "name": "What is the price range of CLASSIE heels?", "acceptedAnswer": { "@type": "Answer", "text": "CLASSIE women's heels are priced between ₹1,499 to ₹3,999. Free shipping is available on orders above ₹999 with cash on delivery across India." } },
        ]
      }) }} />
    </>
  );
}
