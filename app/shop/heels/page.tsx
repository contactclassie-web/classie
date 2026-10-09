import { Metadata } from "next";
import { loadFreeShippingAmount } from "@/lib/shippingServer";
import ShopListing from "@/components/shop/ShopListing";
import { DEFAULT_CHARM_TYPES, bandPhotos, loadAllListingProducts, loadOccasions, loadSettings, parseList } from "@/lib/shopListingServer";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const free = await loadFreeShippingAmount();
  return {
    alternates: { canonical: "/shop/heels" },
  title: "Buy Women's Heels Online India — Block, Slingback & Sculpted Heels",
  description:
    `Shop CLASSIE women's heels online in India — block heels, slingback heels, sculpted heels, slim heels & more. Premium quality, free shipping above ₹${free}, COD available. Buy heels for wedding, office, party & everyday wear.`,
  };
}

export default async function HeelsPage() {
  const [free, { heels, charms }, settings, { occasions, map }] = await Promise.all([
    loadFreeShippingAmount(),
    loadAllListingProducts(),
    loadSettings(["hp2_"], ["heels_hero_bg_url", "clips_filter_types"]),
    loadOccasions(),
  ]);

  const heelPrices = heels.map((p) => p.price).filter((n) => n > 0);
  const charmPrices = charms.map((p) => p.price).filter((n) => n > 0);
  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  const priceRange = heelPrices.length
    ? `between ${inr(Math.min(...heelPrices))} and ${inr(Math.max(...heelPrices))}`
    : "from ₹1,499";

  return (
    <>
      <ShopListing
        mode="heels"
        settings={settings}
        products={heels}
        heroImage={settings.hp2_hero_img || settings.heels_hero_bg_url || ""}
        occasions={occasions}
        occasionMap={map}
        bandImages={bandPhotos(charms, parseList(settings.clips_filter_types, DEFAULT_CHARM_TYPES))}
        charmFrom={charmPrices.length ? Math.min(...charmPrices) : 0}
        freeFrom={free}
      >
        <p>
          CLASSIE offers a curated collection of premium <strong>women&apos;s heels online in India</strong> — from everyday <strong>block heels</strong> and <strong>slingback heels</strong> to elegant sculpted heels and slim heels. Whether you&apos;re shopping for <strong>heels for an Indian wedding</strong>, office wear, a party or everyday styling, there is a pair for every occasion.
        </p>
        <p>
          Our <strong>block heels for women</strong> are designed for all-day comfort. The <strong>slingback heels</strong> and pointed toe styles suit ethnic wear and sarees, and our <strong>comfortable heels for long hours</strong> come with cushioning and stable bases.
        </p>
        <p>
          Shop <strong>black heels</strong>, <strong>white heels</strong>, <strong>maroon heels</strong>, <strong>cream heels</strong> and more — with free shipping above ₹{free} and COD across India.
        </p>
      </ShopListing>

      {/* FAQ Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "Where can I buy women's heels online in India?", "acceptedAnswer": { "@type": "Answer", "text": "You can buy premium women's heels online at CLASSIE (classie.co.in). We offer block heels, slingback heels, sculpted heels and more with free shipping above ₹" + free + " and COD across India." } },
          { "@type": "Question", "name": "Which heels are best for Indian weddings?", "acceptedAnswer": { "@type": "Answer", "text": "For Indian weddings, block heels and slingback heels work best with sarees and lehengas. Gold, cream, and maroon heels are the most popular choices for bridal and wedding guest outfits." } },
          { "@type": "Question", "name": "Are block heels comfortable for long hours?", "acceptedAnswer": { "@type": "Answer", "text": "Yes! Block heels distribute weight evenly and are much more comfortable than stilettos. CLASSIE block heels are designed with premium cushioning for all-day wear at office or events." } },
          { "@type": "Question", "name": "What is the price range of CLASSIE heels?", "acceptedAnswer": { "@type": "Answer", "text": "CLASSIE women's heels are priced " + priceRange + ". Free shipping is available on orders above ₹" + free + " with cash on delivery across India." } },
        ]
      }) }} />
    </>
  );
}
