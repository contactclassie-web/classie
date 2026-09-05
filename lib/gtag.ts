declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// GA4 ecommerce event — layout.tsx loads gtag.js directly (not via GTM), so events
// must go through window.gtag('event', ...), not a raw dataLayer.push({event: ...}).
export function gtagEvent(name: string, params: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
