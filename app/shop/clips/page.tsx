import { Metadata } from "next";
import { loadFreeShippingAmount } from "@/lib/shippingServer";
import ShopListing from "@/components/shop/ShopListing";
import { contentReader } from "@/lib/shopPageContent";
import { DEFAULT_CHARM_TYPES, listingJsonLd, loadAllListingProducts, loadGiftSummary, loadSettings, parseList } from "@/lib/shopListingServer";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const free = await loadFreeShippingAmount();
  return {
    alternates: { canonical: "/shop/clips" },
  title: "Buy Shoe Clips Online India — Rhinestone, Crystal & Bow Clips for Women",
  description: `Shop CLASSIE shoe clips online in India — rhinestone shoe clips, crystal clips, bow clips, floral clips & more. Instantly transform any pair of heels or flats. Free shipping above ₹${free}. COD available.`,
  };
}

export default async function ClipsPage() {
  const [free, { charms }, settings, gift] = await Promise.all([
    loadFreeShippingAmount(),
    loadAllListingProducts(),
    loadSettings(["cp2_"], ["clips_filter_types"]),
    loadGiftSummary(),
  ]);

  return (
    <>
      <ShopListing
        mode="charms"
        settings={settings}
        products={charms}
        heroImage={contentReader(settings)("cp2_hero_img")}
        typeTags={parseList(settings.clips_filter_types, DEFAULT_CHARM_TYPES)}
        giftFrom={gift.from}
        giftImage={gift.image}
        freeFrom={free}
      >
        {contentReader(settings)("cp2_seo_more").replaceAll("{free}", String(free)).split(/\n\s*\n/).map((para, i) => <p key={i}>{para}</p>)}
      </ShopListing>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: listingJsonLd("Shoe Charms", "/shop/clips", charms) }} />

      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "How do shoe clips work?", "acceptedAnswer": { "@type": "Answer", "text": "Shoe clips clip onto the fabric or straps of any shoe using a hinged clip mechanism — no glue or tools needed. They can be attached and removed in seconds without damaging your shoes." } },
          { "@type": "Question", "name": "Where to buy shoe clips online in India?", "acceptedAnswer": { "@type": "Answer", "text": "CLASSIE (classie.co.in) offers India's finest collection of shoe clips — rhinestone, crystal, bow, and floral styles. Free shipping above ₹" + free + " with COD available pan-India." } },
          { "@type": "Question", "name": "Can I use shoe clips on any type of shoe?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! CLASSIE shoe clips work on heels, flats, sandals, ballerinas, and most fabric or strap-based shoes. They also double as bag charms, hair clips and dupatta pins." } },
          { "@type": "Question", "name": "What shoe clips are best for a saree?", "acceptedAnswer": { "@type": "Answer", "text": "For sarees, rhinestone and crystal shoe clips add the perfect touch of elegance. Bow clips in gold, silver or pearl tones complement both traditional and contemporary saree looks." } },
        ]
      }) }} />
    </>
  );
}
