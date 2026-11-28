// Meta (Facebook) Pixel helpers. The base code is loaded by components/MetaPixel.tsx;
// nothing here sends personal data (no name, phone, email, address or pincode).

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    // Events fired before the base code ran (e.g. ViewContent on first load) —
    // MetaPixel.tsx sends them right after init + PageView.
    __fbqPending?: unknown[][];
  }
}

type Params = Record<string, unknown>;

// Safe fbq('track', ...): no-ops without a Pixel ID or outside the browser.
export function track(event: string, params: Params = {}, opts?: { eventID?: string }) {
  if (!META_PIXEL_ID || typeof window === "undefined") return;
  const args: unknown[] = ["track", event, params];
  if (opts?.eventID) args.push({ eventID: opts.eventID });
  try {
    if (typeof window.fbq === "function") window.fbq(...args);
    else (window.__fbqPending ||= []).push(args);
  } catch { /* tracking must never break the store */ }
}

// content_ids are always the product slug (same in every event); the chosen
// colour or size goes in contents[].variant.
type Line = { slug: string; quantity: number; variant?: string };

export function line(i: Line) {
  return i.variant ? { id: i.slug, quantity: i.quantity, variant: i.variant } : { id: i.slug, quantity: i.quantity };
}

export function cartContents(items: Line[]) {
  return {
    content_ids: Array.from(new Set(items.map((i) => i.slug))),
    contents: items.map(line),
    content_type: "product",
    num_items: items.reduce((n, i) => n + i.quantity, 0),
  };
}

// Checkout empties the cart before going to /order-success, so the order's
// lines are kept here (this browser only) for the Purchase event.
const ORDER_KEY = "classie_fb_order";

export function rememberOrderLines(orderId: string, items: Line[]) {
  try {
    sessionStorage.setItem(ORDER_KEY, JSON.stringify({ id: orderId, items: items.map((i) => ({ slug: i.slug, quantity: i.quantity, variant: i.variant || undefined })) }));
  } catch { /* storage unavailable */ }
}

export function orderLines(orderId: string): Line[] {
  try {
    const saved = JSON.parse(sessionStorage.getItem(ORDER_KEY) || "null");
    return saved?.id === orderId && Array.isArray(saved.items) ? saved.items : [];
  } catch {
    return [];
  }
}
