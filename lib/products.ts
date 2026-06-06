export interface Product {
  slug: string;
  title: string;
  price: number;
  comparePrice: number;
  category: "heels" | "accessories";
  collection: "heels" | "clips" | "bow";
  variants: { type: "size" | "color" | "none"; options: string[] };
  image: string;
  description: string;
}

export const products: Product[] = [
  // ── HEELS ────────────────────────────────────────────────────────────
  { slug: "clessia-wine", title: "Clessia Wine", price: 1699, comparePrice: 1899, category: "heels", collection: "heels", variants: { type: "size", options: ["35","36","37","38","39"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/75.png?v=1767179583", description: "Signature C-shaped sculpted front, 3-inch sculpted heel, premium satin fabric, Classie Comfort Insole." },
  { slug: "clessia", title: "Clessia Rose Gold", price: 1699, comparePrice: 1899, category: "heels", collection: "heels", variants: { type: "size", options: ["35","36","37","38","39"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/70.png?v=1767129647", description: "Signature C-shaped sculpted front, 3-inch sculpted heel, premium satin fabric in Rose Gold." },
  { slug: "crovia-choclate-brown", title: "Crovia Chocolate Brown", price: 1499, comparePrice: 1799, category: "heels", collection: "heels", variants: { type: "size", options: ["35","36","37","38","39"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/58.png?v=1767126020", description: "3-inch block heel, premium alligator-textured vegan fabric, soft cushioned insole." },
  { slug: "crovia", title: "Crovia Caramel", price: 1499, comparePrice: 1799, category: "heels", collection: "heels", variants: { type: "size", options: ["35","36","37","38","39"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/40_c9833246-51b7-4ff5-8200-acf9809593c5.png?v=1767109414", description: "3-inch block heel, premium alligator-textured vegan fabric in warm caramel tone." },
  { slug: "gloss-belle-mocha", title: "Gloss Belle Mocha Brown", price: 1599, comparePrice: 1799, category: "heels", collection: "heels", variants: { type: "size", options: ["35","36","37","38","39"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/39.png?v=1766919149", description: "2.5-inch block heel, glossy patent finish, adjustable slingback strap with gold buckle." },
  { slug: "gloss-belle", title: "Gloss Belle Black", price: 1599, comparePrice: 1799, category: "heels", collection: "heels", variants: { type: "size", options: ["35","36","37","38","39"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/17_fc5c95f2-f403-4090-abdf-3c6a93afec00.png?v=1766915208", description: "2.5-inch block heel, glossy patent finish in classic black, adjustable slingback strap." },
  { slug: "modiva-bgn", title: "Modiva Wine Red", price: 1599, comparePrice: 1999, category: "heels", collection: "heels", variants: { type: "size", options: ["35","36","37","38","39"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/3_a87e3602-d73e-482f-8d3d-54bcddc6313b.png?v=1766843058", description: "3.5-inch pointed toe slingback, premium matte vegan leather in burgundy." },
  { slug: "modiva", title: "Modiva Lint", price: 1799, comparePrice: 1999, category: "heels", collection: "heels", variants: { type: "size", options: ["35","36","37","38","39"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/17_6c8cad27-4dae-458d-8c22-521fa7873904.png?v=1767787949", description: "3.5-inch pointed toe slingback, premium matte vegan leather in lint tone." },
  { slug: "tressa-teal", title: "Tressa Teal", price: 1799, comparePrice: 1999, category: "heels", collection: "heels", variants: { type: "size", options: ["35","36","37","38","39"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/254.png?v=1767818723", description: "3.5-inch slim heel, rhinestone ankle strap, glossy patent finish in teal." },
  { slug: "tressa", title: "Tressa Black", price: 1799, comparePrice: 1999, category: "heels", collection: "heels", variants: { type: "size", options: ["35","36","37","38","39"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/261.png?v=1767786587", description: "3.5-inch slim heel, rhinestone ankle strap, glossy patent finish in black." },
  { slug: "velora-milk", title: "Velora Milk", price: 1699, comparePrice: 1999, category: "heels", collection: "heels", variants: { type: "size", options: ["35","36","37","38","39"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/103.png?v=1767437754", description: "3-inch block heel, premium matte finish in off-white, soft cushioned Texan insole." },
  { slug: "velora", title: "Velora Black", price: 1699, comparePrice: 1999, category: "heels", collection: "heels", variants: { type: "size", options: ["35","36","37","38","39"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/89.png?v=1767460150", description: "3-inch block heel, premium supreme suede in classic black, soft cushioned insole." },

  // ── BLOOM BOW COLLECTION ──────────────────────────────────────────────
  { slug: "fauxbow-brown", title: "Pearl Bloom Flower Clip (Pair)", price: 249, comparePrice: 399, category: "accessories", collection: "bow", variants: { type: "color", options: ["Black","Blush Pink","Mocha Brown","Maroon","Green"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/204_397638a6-1e93-4da9-9e40-e5177abaf59b.png?v=1767778718", description: "Soft organza fabric petals with pearl bead detailing. Sold as a pair." },
  { slug: "satin-swirl-clip-lint", title: "Rose Satin Swirl Clip (Pair)", price: 299, comparePrice: 449, category: "accessories", collection: "bow", variants: { type: "none", options: [] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/282.png?v=1770130960", description: "Handcrafted satin rosette, secure metal clip, multipurpose for heels, handbags & hair. Sold as a pair." },
  { slug: "satin-swirl-beige", title: "Satin Swirl Clip (Pair)", price: 359, comparePrice: 459, category: "accessories", collection: "bow", variants: { type: "color", options: ["Lint","Black","Beige"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/242.png?v=1767896660", description: "Handcrafted satin rosette, 3 color options, secure metal clip. Sold as a pair." },
  { slug: "fauxbow-maroon", title: "Ivory Pearl Bow Clip", price: 379, comparePrice: 479, category: "accessories", collection: "bow", variants: { type: "none", options: [] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/228.png?v=1767781810", description: "Organza fabric with lace, pearl drops & rhinestone detailing. Smooth back clip. Sold as a pair." },
  { slug: "fauxbow-black", title: "Gloss Bow Clip (Pair)", price: 399, comparePrice: 549, category: "accessories", collection: "bow", variants: { type: "color", options: ["Black","Brown","Maroon"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/189.png?v=1769796361", description: "High-gloss leather (PU) bow with rhinestone detailing. Sold as a pair." },
  { slug: "glitzknot", title: "Glitz Knot Bow Clip (Pair)", price: 399, comparePrice: 499, category: "accessories", collection: "bow", variants: { type: "none", options: [] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/219.png?v=1767780827", description: "Crystal bow-knot with high-shine rhinestone sheet detailing on metal alloy base. Sold as a pair." },

  // ── CRYSTAL CLIPS ─────────────────────────────────────────────────────
  { slug: "radiance-heart-crystal-clip-pair", title: "Radiance Heart Crystal Clip (Pair)", price: 399, comparePrice: 499, category: "accessories", collection: "clips", variants: { type: "color", options: ["Silver","Gold"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/155.png?v=1767726986", description: "Heart-shaped teardrop and round stone arrangement. Perfect for weddings & gifting. Sold as a pair." },
  { slug: "starlight-bloom-crystal-clip-pair", title: "Starlight Bloom Crystal Clip (Pair)", price: 299, comparePrice: 349, category: "accessories", collection: "clips", variants: { type: "color", options: ["Gold","Silver"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/181.png?v=1767734157", description: "Hand-set glass rhinestones in star-petal bloom. Polished metal alloy base. Sold as a pair." },
  { slug: "marquise-bloom-crystal-clip-pair", title: "Marquise Bloom Crystal Clip (Pair)", price: 449, comparePrice: 699, category: "accessories", collection: "clips", variants: { type: "color", options: ["Silver"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/138.png?v=1767706611", description: "Floral marquise-cut crystal blossom clip. Polished metal alloy base. Sold as a pair." },
  { slug: "radiant-frame-crystal-clip-pair", title: "Radiant Frame Crystal Clip (Pair)", price: 449, comparePrice: 649, category: "accessories", collection: "clips", variants: { type: "color", options: ["Silver","Gold"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/169.png?v=1767731563", description: "Vintage-inspired rectangular crystal frame clip. Polished metal alloy base. Sold as a pair." },
  { slug: "radiance-crown-crystal-clip-pair", title: "Radiance Crown Crystal Clip (Pair)", price: 429, comparePrice: 529, category: "accessories", collection: "clips", variants: { type: "color", options: ["Gold","Silver"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/143.png?v=1767707781", description: "Elongated crown-like clip with marquise and baguette stones. Sold as a pair." },
  { slug: "crystal-starburst-clip-pair", title: "Starburst Crystal Clip (Pair)", price: 449, comparePrice: 699, category: "accessories", collection: "clips", variants: { type: "color", options: ["Gold","Silver"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/133.png?v=1767705234", description: "Dramatic starburst with marquise, teardrop and round rhinestones. Sold as a pair." },
  { slug: "celestial-wings-crystal-clip-pair", title: "Celestial Wings Crystal Clip (Pair)", price: 559, comparePrice: 600, category: "accessories", collection: "clips", variants: { type: "color", options: ["Silver"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/129.png?v=1767702276", description: "Wing-motif crystal clip with marquise and round rhinestones. Sold as a pair." },
  { slug: "butterfly-bling-crystal-clip-pair", title: "Butterfly Bling Crystal Clip (Pair)", price: 399, comparePrice: 499, category: "accessories", collection: "clips", variants: { type: "color", options: ["Silver"] }, image: "https://cdn.shopify.com/s/files/1/0961/1286/9690/files/118_5686a03b-fc5e-4e7f-950e-9c676f178510.png?v=1767700791", description: "Butterfly-shaped precision-set rhinestone clip. Sold as a pair." },
];

// ── COLLECTION DEFINITIONS ────────────────────────────────────────────────
export const CURATED_COLLECTIONS = {
  "the-date-edit": {
    title: "The Date Edit",
    subtitle: "Dressed to impress, effortlessly",
    slugs: ["clessia","crovia","butterfly-bling-crystal-clip-pair","radiance-heart-crystal-clip-pair","starlight-bloom-crystal-clip-pair","fauxbow-black","fauxbow-maroon","velora-milk","modiva-bgn","satin-swirl-clip-lint"],
  },
  "the-everyday-edit": {
    title: "The Everyday Edit",
    subtitle: "Comfort for the every-day woman",
    slugs: ["crovia-choclate-brown","fauxbow-brown","crovia","gloss-belle-mocha","tressa-teal","satin-swirl-beige","fauxbow-maroon","butterfly-bling-crystal-clip-pair","gloss-belle"],
  },
  "the-festive-edit": {
    title: "The Festive Edit",
    subtitle: "Celebrate in style",
    slugs: ["clessia-wine","crovia-choclate-brown","modiva-bgn","fauxbow-black","radiant-frame-crystal-clip-pair","radiance-crown-crystal-clip-pair","marquise-bloom-crystal-clip-pair","crystal-starburst-clip-pair","celestial-wings-crystal-clip-pair","modiva","velora","tressa","clessia"],
  },
} as const;

export type CuratedCollectionKey = keyof typeof CURATED_COLLECTIONS;

// ── HELPERS ───────────────────────────────────────────────────────────────
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCollection(key: string): Product[] {
  const col = CURATED_COLLECTIONS[key as CuratedCollectionKey];
  if (!col) return [];
  return col.slugs.map((s) => products.find((p) => p.slug === s)!).filter(Boolean);
}

export function getByCollection(col: "heels" | "clips" | "bow"): Product[] {
  return products.filter((p) => p.collection === col);
}

export function getClipons(): Product[] {
  return products.filter((p) => p.category === "accessories");
}

export function getHotDeals(): Product[] {
  return products.filter((p) => p.comparePrice > p.price).sort(
    (a, b) => (b.comparePrice - b.price) / b.comparePrice - (a.comparePrice - a.price) / a.comparePrice
  );
}
