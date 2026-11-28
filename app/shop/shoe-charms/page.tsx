import { permanentRedirect } from "next/navigation";

// The Shoe Charms page lives at /shop/clips (the menu link). Old links to
// /shop/shoe-charms go there, so customers never see an outdated copy.
// Keeps the query string (utm_source etc.) so ad tracking survives the redirect.
export default function ShoeCharmsRedirect({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const qs = new URLSearchParams();
  Object.entries(searchParams).forEach(([k, v]) => (Array.isArray(v) ? v : v === undefined ? [] : [v]).forEach((x) => qs.append(k, x)));
  const q = qs.toString();
  permanentRedirect(q ? `/shop/clips?${q}` : "/shop/clips");
}
