// Shop-card photo per product (site_settings → "card_photos_v1": { slug: url }),
// picked in Admin → Products → Manage products. Cards show it first (the
// "heel + clips on white" photo) and the product's main photo on hover, so the
// grid looks like one catalogue instead of the same tray photo repeated.

export const CARD_PHOTOS_KEY = "card_photos_v1";
export type CardPhotos = Record<string, string>;

export function parseCardPhotos(raw: string | null | undefined): CardPhotos {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw);
    if (!v || typeof v !== "object" || Array.isArray(v)) return {};
    const out: CardPhotos = {};
    for (const [k, u] of Object.entries(v)) if (typeof u === "string" && u.startsWith("http")) out[k] = u;
    return out;
  } catch {
    return {};
  }
}

/** First and hover photo for a card: the card photo (if set) then the main photo. */
export function cardImages(cards: CardPhotos, slug: string, main: string, second: string): [string, string] {
  const c = cards[slug];
  if (!c || c === main) return [main, second];
  return [c, main];
}
