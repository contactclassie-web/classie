import type { Metadata } from "next";
import CollectionsView, { type Look, type SmallTile } from "./CollectionsView";
import { contentReader } from "@/lib/shopPageContent";
import { listingJsonLd, loadAllListingProducts, loadGiftSummary, loadOccasions, loadSettings } from "@/lib/shopListingServer";

export const metadata: Metadata = {
  title: "Shop All Collections — Women's Heels, Shoe Clips & Accessories India",
  description: "Browse all CLASSIE collections — the Date, Everyday and Festive edits, crystal and flower shoe charms, gift sets and heel + charm looks. Free shipping and COD across India.",
  alternates: { canonical: "https://www.classie.co.in/collections" },
};

export const revalidate = 3600;

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export default async function CollectionsPage() {
  const [{ heels, charms }, settings, { occasions }, gift] = await Promise.all([
    loadAllListingProducts(),
    loadSettings(["col2_"]),
    loadOccasions(),
    loadGiftSummary(),
  ]);
  const c = contentReader(settings);

  const byTag = (tag: string) => charms.filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
  const tagTile = (n: number, tag: string): SmallTile => {
    const list = byTag(tag);
    const prices = list.map((p) => p.price).filter((x) => x > 0);
    return {
      name: c(`col2_t${n}_name`),
      sub: list.length ? `${list.length} ${list.length === 1 ? "style" : "styles"}${prices.length ? ` · from ${inr(Math.min(...prices))}` : ""}` : "",
      image: c(`col2_t${n}_img`) || list[0]?.image || "",
      href: `/shop/clips?type=${encodeURIComponent(tag)}`,
    };
  };
  const tiles: SmallTile[] = [
    tagTile(1, "Rhinestone Shoe Charms"),
    tagTile(2, "Flower Shoe Charms"),
    {
      name: c("col2_t3_name"),
      sub: gift.count ? `${gift.count} ${gift.count === 1 ? "set" : "sets"}${gift.from ? ` · from ${inr(gift.from)}` : ""}` : "Duos & trios",
      image: c("col2_t3_img") || gift.image,
      href: "/gift-sets",
    },
  ];

  const find = (list: typeof heels, slug: string) => list.find((p) => p.slug === slug.trim());
  const looks: Look[] = [1, 2, 3].flatMap((n) => {
    const heel = find(heels, c(`col2_l${n}_heel`));
    const clip = find(charms, c(`col2_l${n}_clip`));
    return heel && clip ? [{ name: c(`col2_l${n}_name`), heel, clip }] : [];
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: listingJsonLd("Collections", "/collections", [...heels, ...charms]) }} />
      <CollectionsView settings={settings} edits={occasions} tiles={tiles} looks={looks} heels={heels} charms={charms} />
    </>
  );
}
