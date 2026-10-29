// The photo to show for a cart line: the first photo of the chosen colour
// (product_color_variants), else the product's main photo. Used by the cart
// drawer, /cart, /checkout and the order API, so a Gold item always shows
// gold, even for items added to the bag before their photos changed.

export type ColourRow = { product_slug: string; color_name: string; image: string | null };

export function firstColourPhotos(rows: ColourRow[]): Map<string, string> {
  const out = new Map<string, string>();
  for (const r of rows) {
    if (!r.product_slug || !r.color_name || !r.image?.startsWith("[")) continue;
    try {
      const first = (JSON.parse(r.image) as unknown[]).find((u): u is string => typeof u === "string" && u.trim() !== "");
      const key = `${r.product_slug}|${r.color_name.trim().toLowerCase()}`;
      if (first && !out.has(key)) out.set(key, first);
    } catch { /* ignore bad rows */ }
  }
  return out;
}

export const colourPhotoKey = (slug: string, variant?: string | null) => `${slug}|${(variant || "").trim().toLowerCase()}`;
