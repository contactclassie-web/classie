// Homepage layout config — edited from Admin → Homepage → Layout, stored as JSON
// in site_settings under HOME_CONFIG_KEY. Every field has a default here, so the
// homepage renders fully even before anything is saved, and new fields added
// later fall back to their default for configs saved by an older version.

export const HOME_CONFIG_KEY = "home_v2";

export type HeroSlide =
  | { type: "beforeafter"; before: string; after: string; beforeLabel: string; afterLabel: string }
  | { type: "image"; url: string; link: string }
  | { type: "video"; url: string; poster: string };

export type SectionId =
  | "hero" | "marketplace" | "types" | "bestsellers" | "freeDelivery" | "howItWorks"
  | "custom" | "edit" | "heels" | "instagram" | "journal" | "reviews" | "why" | "whatsapp" | "seo"
  | "legacyHero" | "legacyTrustBand" | "legacyOccasions" | "legacyFeaturedPicks" | "legacyPhilosophy" | "legacyNewsletter";

export const SECTION_LABELS: Record<SectionId, string> = {
  hero: "Hero banner (slider)",
  marketplace: "Amazon · Flipkart · Myntra line",
  types: "Shop by type (round photos)",
  bestsellers: "Bestselling shoe charms",
  freeDelivery: "Free delivery banner",
  howItWorks: "How it works",
  custom: "Custom designs",
  edit: "Season edit (e.g. Wedding)",
  heels: "Heels",
  instagram: "Instagram / Style diaries",
  journal: "Journal (latest blog posts)",
  reviews: "Customer reviews",
  why: "Why buy here (4 points)",
  whatsapp: "WhatsApp join",
  seo: "SEO text",
  legacyHero: "Old: Hero slider (previous design)",
  legacyTrustBand: "Old: Trust band (scrolling line)",
  legacyOccasions: "Old: Shop by Occasion cards + category links",
  legacyFeaturedPicks: "Old: Featured Picks tabs",
  legacyPhilosophy: "Old: Philosophy / The Classie Way",
  legacyNewsletter: "Old: Newsletter email box",
};

// Where the content of sections that already have their own admin tab is edited.
export const SECTION_EDITED_IN: Partial<Record<SectionId, string>> = {
  instagram: "Homepage → Instagram",
  reviews: "Homepage → Reviews",
  legacyHero: "Homepage → Hero",
  legacyTrustBand: "Homepage → Trust Band",
  legacyOccasions: "Catalog → Collections / Categories",
  legacyFeaturedPicks: "Homepage → Featured Picks",
  legacyPhilosophy: "Homepage → Philosophy",
  legacyNewsletter: "Settings",
};

export type WhyIcon = "truck" | "cash" | "returns" | "whatsapp" | "star" | "gift" | "shield" | "sparkle";

export interface HomeConfig {
  sections: { id: SectionId; on: boolean }[];
  hero: {
    eyebrow: string; title1: string; titleItalic: string; title2: string; subtitle: string;
    cta1Text: string; cta1Url: string; cta2Text: string; cta2Url: string;
    intervalSec: number;
    slides: HeroSlide[];
  };
  marketplace: { prefix: string; names: string; note: string };
  types: { heading: string; headingItalic: string; items: { label: string; image: string; link: string; note: string }[] };
  bestsellers: { eyebrow: string; heading: string; headingItalic: string; count: number; linkText: string; linkUrl: string };
  freeDelivery: { eyebrow: string; heading: string; text: string; buttonText: string; buttonUrl: string; images: string[] };
  howItWorks: { heading: string; headingItalic: string; steps: { image: string; title: string; text: string }[] };
  custom: { eyebrow: string; heading: string; headingItalic: string; text: string; perk: string; buttonText: string; buttonUrl: string; sketchImage: string; productImage: string };
  edit: { eyebrow: string; heading: string; headingItalic: string; text: string; buttonText: string; buttonUrl: string; image: string; badge: string };
  heels: { eyebrow: string; heading: string; headingItalic: string; count: number; linkText: string; linkUrl: string };
  journal: { eyebrow: string; heading: string; headingItalic: string; count: number; linkText: string };
  why: { items: { icon: WhyIcon; title: string; sub: string }[] };
  whatsapp: { heading: string; text: string; buttonText: string; url: string };
  seo: { heading: string; text: string };
}

const C = "https://res.cloudinary.com/dbzt3soyi/image/upload/";

export const DEFAULT_HOME: HomeConfig = {
  sections: [
    { id: "hero", on: true },
    { id: "marketplace", on: true },
    { id: "types", on: true },
    { id: "bestsellers", on: true },
    { id: "freeDelivery", on: true },
    { id: "howItWorks", on: true },
    { id: "custom", on: true },
    { id: "edit", on: true },
    { id: "heels", on: true },
    { id: "instagram", on: true },
    { id: "journal", on: true },
    { id: "reviews", on: true },
    { id: "why", on: true },
    { id: "whatsapp", on: true },
    { id: "seo", on: true },
    { id: "legacyHero", on: false },
    { id: "legacyTrustBand", on: false },
    { id: "legacyOccasions", on: false },
    { id: "legacyFeaturedPicks", on: false },
    { id: "legacyPhilosophy", on: false },
    { id: "legacyNewsletter", on: false },
  ],
  hero: {
    eyebrow: "Shoe charms by Classie",
    title1: "One clip.",
    titleItalic: "A whole",
    title2: "new shoe.",
    subtitle: "Crystal, bow, pearl & jute shoe charms from ₹249. Clip on in seconds. Wear them on heels, flats, bags and hair.",
    cta1Text: "Shop Shoe Charms",
    cta1Url: "/shop/clips",
    cta2Text: "Shop Heels",
    cta2Url: "/shop/heels",
    intervalSec: 6,
    slides: [
      {
        type: "beforeafter",
        before: C + "v1782590542/0121228a-dc8e-486d-a906-9f7a5668dbb8_kfgwmq.png",
        after: C + "v1783885020/65bf792a-f6ad-489d-a704-ef339feab858_pplslm.png",
        beforeLabel: "Without clip",
        afterLabel: "With Starburst clip",
      },
      // Empty URLs fall back to the photos in Admin → Homepage → Hero.
      { type: "image", url: "", link: "" },
      { type: "image", url: "", link: "" },
    ],
  },
  marketplace: {
    prefix: "Classie is also on",
    names: "Amazon, Flipkart, Myntra",
    note: "Buy here for COD, easy heel returns & WhatsApp help",
  },
  types: {
    heading: "Shop by",
    headingItalic: "type",
    items: [
      { label: "Crystal", image: C + "v1783885593/b7881316-ad7b-4b83-82ae-d4444edd280a_w4ueo6.png", link: "/shop/clips", note: "₹399+" },
      { label: "Bow & Pearl", image: C + "v1784293137/4aa57f8c-8b90-4e21-a08e-85bc4f5694b6_hgbcxu.png", link: "/shop/clips", note: "₹299+" },
      { label: "Flower & Jute", image: C + "v1786391658/1d465eba-5e95-4988-ac63-a22011f7eb61_okgiig.png", link: "/shop/clips", note: "₹249+" },
      { label: "Anklets", image: C + "v1785502275/b03551d4-2e7d-448f-bdf6-b5c570aa5e4b_oqnh1w.png", link: "/shop/clips", note: "₹349" },
      { label: "Heels", image: C + "v1783884222/060a9b45-5fab-4dd8-a8f5-f704de1a8b13_-_Copy_c2mjkz.png", link: "/shop/heels", note: "₹1,269+" },
    ],
  },
  bestsellers: {
    eyebrow: "Most loved",
    heading: "Bestselling",
    headingItalic: "shoe charms",
    count: 8,
    linkText: "View all",
    linkUrl: "/shop/clips",
  },
  freeDelivery: {
    eyebrow: "Free delivery",
    heading: "FREE delivery on {amount}+",
    text: "Three crystal clips get you there. One for every outfit this wedding season.",
    buttonText: "Build your set",
    buttonUrl: "/shop/clips",
    images: [
      C + "v1783885591/687541b9-dd0d-4372-be07-ddc8258ee2be_nmuthw.png",
      C + "v1783887880/c39384ea-6490-4191-aecf-208eddfa72e2_zepgsd.png",
      C + "v1784204547/7449cba8-895c-4fc6-b821-792a0caaf6df_k6dblv.png",
    ],
  },
  howItWorks: {
    heading: "How it",
    headingItalic: "works",
    steps: [
      { image: C + "v1784205439/85f39cb9-98dd-4559-b102-82833ceb459b_qiztyp.png", title: "Pick", text: "Crystal, bow, pearl or jute. Every pair has 2 clips." },
      { image: C + "v1784205457/e7dcebb2-d9a2-4139-bdaa-93323897695b_ewxq2z.png", title: "Clip on", text: "On the front or side of your shoe. Comes off just as easily." },
      { image: C + "v1786389887/2_kn9ywo.png", title: "Style anywhere", text: "Heels, flats, bags, belts or hair." },
    ],
  },
  custom: {
    eyebrow: "Classie Custom",
    heading: "Have a design in mind?",
    headingItalic: "We'll make it.",
    text: "We now have our own rhinestone studio. Send us a sketch, a photo or a Pinterest pin, and we'll make it for you.",
    perk: "If our team adds your design to the Classie collection, your pair is free.",
    buttonText: "Design yours",
    buttonUrl: "/custom-designs",
    sketchImage: "",
    productImage: C + "v1784204557/c02279d6-b56e-436e-9599-795387501f3f_yrwurd.png",
  },
  edit: {
    eyebrow: "The wedding season edit",
    heading: "Five looks,",
    headingItalic: "one pair of heels.",
    text: "Crystal clips for haldi, mehendi, sangeet and the big day. Swap them between functions in seconds.",
    buttonText: "Shop the edit",
    buttonUrl: "/shop/the-festive-edit",
    image: C + "v1783885597/d6e603de-2a3a-4311-a1b8-7c2b37cbad1e_renzr6.png",
    badge: "",
  },
  heels: {
    eyebrow: "Comfort heels · from ₹1,269",
    heading: "Heels that",
    headingItalic: "take a clip",
    count: 4,
    linkText: "All heels",
    linkUrl: "/shop/heels",
  },
  journal: {
    eyebrow: "From the journal",
    heading: "Style",
    headingItalic: "notes",
    count: 3,
    linkText: "All posts",
  },
  why: {
    items: [
      { icon: "truck", title: "Free delivery", sub: "on {amount}+" },
      { icon: "cash", title: "Cash on delivery", sub: "pay at your door" },
      { icon: "returns", title: "7-day heel returns", sub: "easy size exchange" },
      { icon: "whatsapp", title: "WhatsApp help", sub: "real people reply" },
    ],
  },
  whatsapp: {
    heading: "New designs, first on WhatsApp",
    text: "One message for every new drop. No spam.",
    buttonText: "Join on WhatsApp",
    url: "",
  },
  seo: {
    heading: "Shoe Clips, Shoe Charms & Heels Online in India",
    text: "Classie makes crystal shoe clips, bow and pearl shoe charms, handmade jute flower clips and comfort heels for Indian women. Free delivery on orders above {amount}. Cash on delivery available across India.",
  },
};

const ALL_SECTIONS = DEFAULT_HOME.sections.map((s) => s.id);

function isObj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v);
}

// Shallow-merge one section object: saved values win, but only for keys whose
// type matches the default, so a corrupted value can't break the page.
function mergeObj<T extends object>(def: T, saved: unknown): T {
  if (!isObj(saved)) return def;
  const out: Record<string, unknown> = { ...(def as Record<string, unknown>) };
  for (const [k, dv] of Object.entries(def as Record<string, unknown>)) {
    const sv = saved[k];
    if (sv === undefined || sv === null) continue;
    if (Array.isArray(dv)) { if (Array.isArray(sv)) out[k] = sv; continue; }
    if (typeof sv === typeof dv) out[k] = sv;
  }
  return out as T;
}

function normalizeSlides(raw: unknown): HeroSlide[] {
  if (!Array.isArray(raw)) return DEFAULT_HOME.hero.slides;
  const out: HeroSlide[] = [];
  for (const s of raw) {
    if (!isObj(s)) continue;
    const str = (v: unknown) => (typeof v === "string" ? v : "");
    if (s.type === "beforeafter") out.push({ type: "beforeafter", before: str(s.before), after: str(s.after), beforeLabel: str(s.beforeLabel), afterLabel: str(s.afterLabel) });
    else if (s.type === "video") out.push({ type: "video", url: str(s.url), poster: str(s.poster) });
    else if (s.type === "image") out.push({ type: "image", url: str(s.url), link: str(s.link) });
  }
  return out;
}

export function mergeHomeConfig(saved: unknown): HomeConfig {
  const s = isObj(saved) ? saved : {};
  // Sections: keep saved order, drop unknown ids, append any new ids (with
  // their default on/off) so sections added in later versions still appear.
  const seen = new Set<SectionId>();
  const sections: HomeConfig["sections"] = [];
  if (Array.isArray(s.sections)) {
    for (const row of s.sections) {
      if (!isObj(row)) continue;
      const id = row.id as SectionId;
      if (!ALL_SECTIONS.includes(id) || seen.has(id)) continue;
      seen.add(id);
      sections.push({ id, on: row.on !== false });
    }
  }
  for (const d of DEFAULT_HOME.sections) if (!seen.has(d.id)) sections.push({ ...d });

  const hero = mergeObj(DEFAULT_HOME.hero, s.hero);
  hero.slides = isObj(s.hero) && "slides" in s.hero ? normalizeSlides(s.hero.slides) : DEFAULT_HOME.hero.slides;
  hero.intervalSec = Math.min(20, Math.max(3, Number(hero.intervalSec) || 6));

  const out: HomeConfig = {
    sections,
    hero,
    marketplace: mergeObj(DEFAULT_HOME.marketplace, s.marketplace),
    types: mergeObj(DEFAULT_HOME.types, s.types),
    bestsellers: mergeObj(DEFAULT_HOME.bestsellers, s.bestsellers),
    freeDelivery: mergeObj(DEFAULT_HOME.freeDelivery, s.freeDelivery),
    howItWorks: mergeObj(DEFAULT_HOME.howItWorks, s.howItWorks),
    custom: mergeObj(DEFAULT_HOME.custom, s.custom),
    edit: mergeObj(DEFAULT_HOME.edit, s.edit),
    heels: mergeObj(DEFAULT_HOME.heels, s.heels),
    journal: mergeObj(DEFAULT_HOME.journal, s.journal),
    why: mergeObj(DEFAULT_HOME.why, s.why),
    whatsapp: mergeObj(DEFAULT_HOME.whatsapp, s.whatsapp),
    seo: mergeObj(DEFAULT_HOME.seo, s.seo),
  };
  out.bestsellers.count = Math.min(16, Math.max(2, Number(out.bestsellers.count) || 8));
  out.heels.count = Math.min(12, Math.max(2, Number(out.heels.count) || 4));
  out.journal.count = Math.min(6, Math.max(1, Number(out.journal.count) || 3));
  return out;
}

// "Free delivery above ₹X" amount from Admin → Shipping Rates. Returns null when
// there is no free tier (default fee isn't 0), so callers can hide the claim.
export function freeDeliveryThreshold(tiersJson?: string, defaultFee?: string): number | null {
  let tiers: { threshold: number; fee: number }[] = [{ threshold: 999, fee: 99 }];
  try {
    const p = tiersJson ? JSON.parse(tiersJson) : null;
    if (Array.isArray(p) && p.length > 0) tiers = p;
  } catch { /* keep default */ }
  const fee = defaultFee === undefined || defaultFee === "" ? 0 : Number(defaultFee) || 0;
  if (fee !== 0) return null;
  const max = Math.max(...tiers.map((t) => Number(t.threshold) || 0));
  return max > 0 ? max : null;
}

export function formatINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

// Replace {amount} in admin text with the live free-delivery amount.
export function withAmount(text: string, amount: number | null): string {
  return text.replace(/\{amount\}/g, amount ? formatINR(amount) : "");
}
