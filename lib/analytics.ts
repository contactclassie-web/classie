"use client";

// Lightweight first-party event tracker feeding the Admin > Live Tracker dashboard.
// Fire-and-forget by design: a failed/slow write here must never block the UI.

const SESSION_KEY = "classie_session_id";
const SOURCE_KEY = "classie_source";

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

// First-touch source for this browser session — utm_source, or referrer domain, or "direct".
export function getSource(): string {
  if (typeof window === "undefined") return "";
  try {
    const stored = sessionStorage.getItem(SOURCE_KEY);
    if (stored) return stored;

    const params = new URLSearchParams(window.location.search);
    const utm = params.get("utm_source");
    let source = "direct";
    if (utm) {
      source = utm;
    } else if (document.referrer) {
      try {
        const host = new URL(document.referrer).hostname.replace(/^www\./, "");
        if (host && host !== window.location.hostname) source = host;
      } catch { /* ignore malformed referrer */ }
    }
    sessionStorage.setItem(SOURCE_KEY, source);
    return source;
  } catch {
    return "direct";
  }
}

export type TrackEvent =
  | { type: "page_view"; path: string }
  | { type: "add_to_cart"; productSlug: string; productTitle: string; value: number }
  | { type: "begin_checkout"; value: number }
  | { type: "purchase"; orderId: string; value: number }
  | { type: "error"; message: string; path?: string };

export function track(event: TrackEvent) {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({
      event_type: event.type,
      path: "path" in event ? event.path : window.location.pathname,
      product_slug: "productSlug" in event ? event.productSlug : undefined,
      product_title: "productTitle" in event ? event.productTitle : undefined,
      value: "value" in event ? event.value : undefined,
      message: "message" in event ? event.message : undefined,
      source: getSource(),
      session_id: getSessionId(),
      meta: "orderId" in event ? { order_id: event.orderId } : undefined,
    });

    // sendBeacon survives page unload (important for page_view on fast navigations);
    // falls back to fetch with keepalive where unavailable.
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/track", blob);
    } else {
      fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
    }
  } catch {
    // Tracking must never break the app.
  }
}
