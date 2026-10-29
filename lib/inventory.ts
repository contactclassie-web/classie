// Stock counts kept in site_settings → "inventory_v1" (edited in Admin →
// Products → Manage products): { slug: { variant: qty } }. A product or
// variant with no number is not tracked and is always available. The key "_"
// is used for products without colours or sizes.

export const INVENTORY_KEY = "inventory_v1";
export const NO_VARIANT = "_";
export type Inventory = Record<string, Record<string, number>>;

export function parseInventory(raw: string | null | undefined): Inventory {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw);
    return v && typeof v === "object" ? (v as Inventory) : {};
  } catch {
    return {};
  }
}

/** Stock for one variant, or undefined when it isn't tracked. Variant names match regardless of capitals. */
export function stockOf(inv: Inventory, slug: string, variant?: string | null): number | undefined {
  const row = inv[slug];
  if (!row) return undefined;
  const want = (variant || NO_VARIANT).trim().toLowerCase();
  for (const [k, n] of Object.entries(row)) {
    if (k.trim().toLowerCase() === want && typeof n === "number") return n;
  }
  return undefined;
}

/** True when every tracked option of the product is at 0 (and at least one is tracked). */
export function isSoldOut(inv: Inventory, slug: string, options: string[]): boolean {
  const keys = options.length ? options : [NO_VARIANT];
  const counts = keys.map((k) => stockOf(inv, slug, k));
  if (counts.every((n) => n === undefined)) return false;
  return counts.every((n) => n === undefined ? false : n <= 0);
}

/** Per-option stock for a product page: option → qty (only tracked options). */
export function stockMap(inv: Inventory, slug: string, options: string[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const o of options.length ? options : [NO_VARIANT]) {
    const n = stockOf(inv, slug, o);
    if (n !== undefined) out[o] = n;
  }
  return out;
}
