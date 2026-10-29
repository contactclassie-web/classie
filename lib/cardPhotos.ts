// Shop-card photo per product (site_settings → "card_photos_v1"), picked in
// Admin → Products → Manage products. Cards show it first (the "heel + clips on
// white" photo) and the product's main photo on hover.
//
// Each entry remembers the main photo it was picked against. When the main
// photo is changed later (or the card photo is deleted from the product), the
// card photo is ignored, so new photos always show without extra steps.

export const CARD_PHOTOS_KEY = "card_photos_v1";
export type CardPhoto = { url: string; main?: string };
export type CardPhotos = Record<string, CardPhoto>;

export function parseCardPhotos(raw: string | null | undefined): CardPhotos {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw);
    if (!v || typeof v !== "object" || Array.isArray(v)) return {};
    const out: CardPhotos = {};
    for (const [k, e] of Object.entries(v)) {
      if (typeof e === "string" && e.startsWith("http")) out[k] = { url: e };
      else if (e && typeof e === "object" && typeof (e as CardPhoto).url === "string" && (e as CardPhoto).url.startsWith("http")) {
        const m = (e as CardPhoto).main;
        out[k] = { url: (e as CardPhoto).url, ...(typeof m === "string" ? { main: m } : {}) };
      }
    }
    return out;
  } catch {
    return {};
  }
}

/** The card photo to use, or undefined when none is set or it is out of date. */
export function cardPhotoFor(cards: CardPhotos, slug: string, main: string, photos?: string[]): string | undefined {
  const c = cards[slug];
  if (!c) return undefined;
  if (c.main !== undefined && c.main !== main) return undefined;          // main photo changed since
  if (photos && c.url !== main && !photos.includes(c.url)) return undefined; // card photo was removed
  return c.url;
}

/** First and hover photo for a card: the card photo (if valid) then the main photo. */
export function cardImages(cards: CardPhotos, slug: string, main: string, second: string, photos?: string[]): [string, string, boolean] {
  const c = cardPhotoFor(cards, slug, main, photos);
  if (!c) return [main, second, false];
  if (c === main) return [main, second, true];
  return [c, main, true];
}
