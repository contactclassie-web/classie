// Gift sets — edited from Admin → Gift Sets, stored as JSON in site_settings
// under GIFT_SETS_KEY. A set is a list of existing products (any number, any
// mix of clips and heels) sold together at one price chosen in Admin.

export const GIFT_SETS_KEY = "gift_sets_v1";

export interface SetItem {
  slug: string;     // product slug
  variant: string;  // fixed colour/size, or "" = customer chooses on the set page
  qty: number;
}

export interface GiftSet {
  id: string;
  slug: string;          // URL: /gift-sets/<slug>
  name: string;
  tag: string;           // filter label, e.g. Bridal
  description: string;
  items: SetItem[];
  price: number;         // set price
  compareAt: number;     // 0 = auto (sum of the pieces' current prices)
  images: string[];      // set photos; empty = collage of the pieces' photos
  askOnly: boolean;      // no fixed price, "Ask on WhatsApp" instead of Add
  active: boolean;
}

export interface GiftSetsPage {
  bannerImage: string;
  eyebrow: string;
  heading: string;
  headingItalic: string;
  text: string;
  chips: string;         // comma separated
  buttonText: string;
  offerOn: boolean;
  offerTitle: string;
  offerText: string;
  offerLinkText: string;
  offerLinkUrl: string;
  why: { title: string; sub: string }[];
  returnNote: string;
  giftNote: string;
  emptyText: string;
  seoHeading: string;
  seoText: string;
}

export interface GiftSetsConfig {
  page: GiftSetsPage;
  sets: GiftSet[];
}

const C = "https://res.cloudinary.com/dbzt3soyi/image/upload/";

export const DEFAULT_GIFT_SETS: GiftSetsConfig = {
  page: {
    bannerImage: C + "v1783885597/d6e603de-2a3a-4311-a1b8-7c2b37cbad1e_renzr6.png",
    eyebrow: "Curated sets · website exclusive",
    heading: "Sets made to",
    headingItalic: "gift.",
    text: "Pieces chosen to go together. Each set costs less than buying the pieces one by one.",
    chips: "Website exclusive, Save on every set, Ready to gift",
    buttonText: "Shop the sets",
    offerOn: false,
    offerTitle: "Want to pick your own? Buy any 3 clips, get 10% off.",
    offerText: "Use the code at checkout. Sets already carry their own saving.",
    offerLinkText: "Shop clips",
    offerLinkUrl: "/shop/clips",
    why: [
      { title: "Less than buying separately", sub: "Every set shows how much you save." },
      { title: "FREE delivery on bigger sets", sub: "Sets above the free delivery amount ship free." },
      { title: "Ready to gift", sub: "All pieces packed together." },
    ],
    returnNote: "Sets are returned as a complete set within 7 days of delivery.",
    giftNote: "All pieces packed together.",
    emptyText: "New sets are on their way. Message us on WhatsApp to get one made for you.",
    seoHeading: "Shoe Clip Gift Sets Online in India",
    seoText: "Gift sets of crystal, bow, pearl and jute shoe clips, anklets and heels from Classie. Bridal, festive and everyday sets, packed together and delivered across India with cash on delivery.",
  },
  // Starting drafts (switched off). Check the prices in Admin and turn them on.
  sets: [
    {
      id: "bridal-crystal-trio", slug: "bridal-crystal-trio", name: "Bridal Crystal Trio", tag: "Bridal",
      description: "A pearl bow for the ceremony, a crystal bloom for the reception, and a pearl anklet that ties both looks together.",
      items: [
        { slug: "fauxbow-maroon", variant: "", qty: 1 },
        { slug: "starlight-bloom-crystal-clip-pair", variant: "Silver", qty: 1 },
        { slug: "pearl-grace-anklet-chain", variant: "", qty: 1 },
      ],
      price: 999, compareAt: 0, images: [], askOnly: false, active: false,
    },
    {
      id: "festive-crystal-trio", slug: "festive-crystal-trio", name: "Festive Crystal Trio", tag: "Festive",
      description: "Three statement crystal clips for haldi, sangeet and the big day.",
      items: [
        { slug: "radiance-crown-crystal-clip-pair", variant: "", qty: 1 },
        { slug: "radiance-heart-crystal-clip-pair", variant: "", qty: 1 },
        { slug: "radiant-frame-crystal-clip-pair", variant: "", qty: 1 },
      ],
      price: 1249, compareAt: 0, images: [], askOnly: false, active: false,
    },
    {
      id: "party-sparkle-duo", slug: "party-sparkle-duo", name: "Party Sparkle Duo", tag: "Duo",
      description: "A crystal bow and a crystal bloom: one for each party this season.",
      items: [
        { slug: "glitzknot", variant: "", qty: 1 },
        { slug: "marquise-bloom-crystal-clip-pair", variant: "", qty: 1 },
      ],
      price: 799, compareAt: 0, images: [], askOnly: false, active: false,
    },
    {
      id: "everyday-soft-trio", slug: "everyday-soft-trio", name: "Everyday Soft Trio", tag: "Everyday",
      description: "Soft satin, organza and jute flowers for office, college and weekends.",
      items: [
        { slug: "satin-swirl-beige", variant: "", qty: 1 },
        { slug: "fauxbow-brown", variant: "", qty: 1 },
        { slug: "flower-jute-shoe-charms", variant: "", qty: 1 },
      ],
      price: 849, compareAt: 0, images: [], askOnly: false, active: false,
    },
    {
      id: "heel-clip-starter", slug: "heel-clip-starter", name: "Heel + Clip Starter", tag: "Heel + clip",
      description: "One pair of heels and two crystal clips: three looks from one pair.",
      items: [
        { slug: "gloss-belle", variant: "", qty: 1 },
        { slug: "starlight-bloom-crystal-clip-pair", variant: "", qty: 1 },
        { slug: "radiance-heart-crystal-clip-pair", variant: "", qty: 1 },
      ],
      price: 2199, compareAt: 0, images: [], askOnly: false, active: false,
    },
    {
      id: "bridesmaid-pack", slug: "bridesmaid-pack", name: "Bridesmaid Pack", tag: "Bridesmaids",
      description: "The same clip for the whole group. Tell us the design and the number of pairs, and we'll share the price.",
      items: [{ slug: "fauxbow-maroon", variant: "", qty: 5 }],
      price: 0, compareAt: 0, images: [], askOnly: true, active: false,
    },
  ],
};

function isObj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}
const str = (v: unknown, d = "") => (typeof v === "string" ? v : d);
const num = (v: unknown, d = 0) => (Number.isFinite(Number(v)) ? Number(v) : d);

export function slugify(s: string): string {
  return s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

function normalizeSet(raw: unknown, i: number): GiftSet | null {
  if (!isObj(raw)) return null;
  const name = str(raw.name).trim();
  const slug = slugify(str(raw.slug) || name) || `set-${i + 1}`;
  const items: SetItem[] = Array.isArray(raw.items)
    ? raw.items.filter(isObj).map((it) => ({
        slug: str(it.slug),
        variant: str(it.variant),
        qty: Math.min(20, Math.max(1, Math.round(num(it.qty, 1)))),
      })).filter((it) => it.slug)
    : [];
  return {
    id: str(raw.id) || slug,
    slug,
    name: name || "Untitled set",
    tag: str(raw.tag),
    description: str(raw.description),
    items,
    price: Math.max(0, Math.round(num(raw.price))),
    compareAt: Math.max(0, Math.round(num(raw.compareAt))),
    images: Array.isArray(raw.images) ? raw.images.filter((u): u is string => typeof u === "string" && !!u.trim()) : [],
    askOnly: raw.askOnly === true,
    active: raw.active === true,
  };
}

export function mergeGiftSets(saved: unknown): GiftSetsConfig {
  if (!isObj(saved)) return DEFAULT_GIFT_SETS;
  const dp = DEFAULT_GIFT_SETS.page;
  const sp = isObj(saved.page) ? saved.page : {};
  const page: GiftSetsPage = {
    bannerImage: str(sp.bannerImage, dp.bannerImage),
    eyebrow: str(sp.eyebrow, dp.eyebrow),
    heading: str(sp.heading, dp.heading),
    headingItalic: str(sp.headingItalic, dp.headingItalic),
    text: str(sp.text, dp.text),
    chips: str(sp.chips, dp.chips),
    buttonText: str(sp.buttonText, dp.buttonText),
    offerOn: typeof sp.offerOn === "boolean" ? sp.offerOn : dp.offerOn,
    offerTitle: str(sp.offerTitle, dp.offerTitle),
    offerText: str(sp.offerText, dp.offerText),
    offerLinkText: str(sp.offerLinkText, dp.offerLinkText),
    offerLinkUrl: str(sp.offerLinkUrl, dp.offerLinkUrl),
    why: Array.isArray(sp.why)
      ? sp.why.filter(isObj).map((w) => ({ title: str(w.title), sub: str(w.sub) })).slice(0, 4)
      : dp.why,
    returnNote: str(sp.returnNote, dp.returnNote),
    giftNote: str(sp.giftNote, dp.giftNote),
    emptyText: str(sp.emptyText, dp.emptyText),
    seoHeading: str(sp.seoHeading, dp.seoHeading),
    seoText: str(sp.seoText, dp.seoText),
  };
  const sets = Array.isArray(saved.sets)
    ? saved.sets.map(normalizeSet).filter((s): s is GiftSet => !!s)
    : DEFAULT_GIFT_SETS.sets;
  // Slugs must be unique for the URLs.
  const seen = new Set<string>();
  for (const s of sets) {
    let slug = s.slug, n = 2;
    while (seen.has(slug)) slug = `${s.slug}-${n++}`;
    s.slug = slug;
    seen.add(slug);
  }
  return { page, sets };
}

// Minimal product info the set pages and admin need.
export interface SetProduct {
  slug: string;
  title: string;
  price: number;
  image: string;
  category: string;
  variantType: "size" | "color" | "none";
  options: string[];
  active: boolean;
}

export function pieceCount(set: GiftSet): number {
  return set.items.reduce((n, it) => n + it.qty, 0);
}

// "Duo", "Trio", "Set of 4", "Heel + 2 clips"…
export function setKind(set: GiftSet, products: Record<string, SetProduct>): string {
  const heels = set.items.filter((it) => products[it.slug]?.category === "heels").reduce((n, it) => n + it.qty, 0);
  const total = pieceCount(set);
  if (heels > 0 && total > heels) return `${heels === 1 ? "Heel" : `${heels} heels`} + ${total - heels} ${total - heels === 1 ? "clip" : "clips"}`;
  if (total === 2) return "Duo";
  if (total === 3) return "Trio";
  return `Set of ${total}`;
}

// Original price = sum of the pieces at today's prices (unless overridden in Admin).
export function setCompareAt(set: GiftSet, products: Record<string, SetProduct>): number {
  if (set.compareAt > 0) return set.compareAt;
  return set.items.reduce((sum, it) => sum + (products[it.slug]?.price ?? 0) * it.qty, 0);
}

// A set is sellable when every piece exists and is active.
export function setAvailable(set: GiftSet, products: Record<string, SetProduct>): boolean {
  return set.items.length > 0 && set.items.every((it) => products[it.slug]?.active);
}

// Pieces whose colour/size the customer still has to choose on the set page.
export function needsChoice(it: SetItem, products: Record<string, SetProduct>): boolean {
  const p = products[it.slug];
  return !!p && !it.variant && p.options.length > 1;
}

export function setImages(set: GiftSet, products: Record<string, SetProduct>): string[] {
  if (set.images.length) return set.images;
  return set.items.map((it) => products[it.slug]?.image).filter((u): u is string => !!u);
}
