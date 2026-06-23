import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 0;
export const metadata: Metadata = { title: "Shipping Policy – Classie" };

export default async function ShippingPage() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { global: { fetch: (url: RequestInfo | URL, options?: RequestInit) => fetch(url, { ...options, cache: "no-store" }) } });
  const { data } = await sb
    .from("site_settings")
    .select("key,value")
    .like("key", "sp_%");
  const cfg: Record<string, string> = {};
  (data ?? []).forEach((r: { key: string; value: string }) => {
    cfg[r.key] = r.value;
  });

  const heading  = cfg.sp_heading  ?? "Shipping Policy";
  const eyebrow  = cfg.sp_eyebrow  ?? "CLASSIE";
  const updated  = cfg.sp_updated  ?? "Last updated: June 2025";

  const tile1Title = cfg.sp_tile1_title ?? "Free Shipping";
  const tile1Sub   = cfg.sp_tile1_sub   ?? "On all orders above ₹999";
  const tile2Title = cfg.sp_tile2_title ?? "Delivery Time";
  const tile2Sub   = cfg.sp_tile2_sub   ?? "4–5 business days standard";
  const tile3Title = cfg.sp_tile3_title ?? "Pan-India";
  const tile3Sub   = cfg.sp_tile3_sub   ?? "All serviceable pincodes";
  const tile4Title = cfg.sp_tile4_title ?? "Processing";
  const tile4Sub   = cfg.sp_tile4_sub   ?? "1–2 business days before dispatch";

  const ratesHeading   = cfg.sp_rates_heading   ?? "Shipping Rates";
  const ratesBody      = cfg.sp_rates_body      ?? "Free shipping on all orders above ₹999\n₹99 flat fee on orders below ₹999\nCash on Delivery (COD) is available across India";
  const timelineHeading= cfg.sp_timeline_heading?? "Delivery Timelines";
  const timelineBody   = cfg.sp_timeline_body   ?? "Metro cities: 3–5 business days\nTier 2 cities: 5–7 business days\nRemote areas: 7–10 business days\n\nOrders placed before 12 PM IST are processed the same day. Weekend orders are processed on Monday.";
  const trackingHeading= cfg.sp_tracking_heading?? "Order Tracking";
  const trackingBody   = cfg.sp_tracking_body   ?? "Once dispatched, you'll receive tracking details via SMS/WhatsApp.\n\nUse our Track Order page for real-time updates.";
  const addressHeading = cfg.sp_address_heading ?? "Incorrect Address";
  const addressBody    = cfg.sp_address_body    ?? "Please ensure your delivery address and phone number are correct at checkout.\n\nClassie is not responsible for failed deliveries due to incorrect address details.";
  const lostHeading    = cfg.sp_lost_heading    ?? "Lost or Damaged Packages";
  const lostBody       = cfg.sp_lost_body       ?? "If your order arrives damaged or is lost in transit, please contact us within 48 hours of the expected delivery date at contact.classie@gmail.com or WhatsApp us.";

  const ctaText = cfg.sp_cta_text ?? "Have questions about your order?";

  const tiles = [
    { emoji: "🚚", title: tile1Title, sub: tile1Sub },
    { emoji: "⏱️", title: tile2Title, sub: tile2Sub },
    { emoji: "🗺️", title: tile3Title, sub: tile3Sub },
    { emoji: "⚡", title: tile4Title, sub: tile4Sub },
  ];

  const sections = [
    { heading: ratesHeading,    body: ratesBody },
    { heading: timelineHeading, body: timelineBody },
    { heading: trackingHeading, body: trackingBody },
    { heading: addressHeading,  body: addressBody },
    { heading: lostHeading,     body: lostBody },
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section
        style={{ backgroundColor: "#3B5373" }}
        className="py-20 text-center px-4"
      >
        <p
          className="text-xs font-semibold tracking-[0.25em] uppercase mb-4"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          {eyebrow}
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl text-white leading-tight">
          {heading}
        </h1>
        <p className="mt-4 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
          {updated}
        </p>
      </section>

      {/* ── KPI Tiles ────────────────────────────────── */}
      <section className="py-14 px-4" style={{ backgroundColor: "#fff" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5">
          {tiles.map(({ emoji, title, sub }) => (
            <div
              key={title}
              className="flex items-center gap-5 bg-white rounded-xl shadow-sm px-6 py-5"
              style={{ borderLeft: "3px solid #3B5373" }}
            >
              <span className="text-3xl flex-shrink-0">{emoji}</span>
              <div>
                <p className="font-bold text-base" style={{ color: "#1a1a1a" }}>
                  {title}
                </p>
                <p className="text-sm mt-0.5" style={{ color: "#666" }}>
                  {sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Content Sections ─────────────────────────── */}
      <section className="py-14 px-4" style={{ backgroundColor: "#f7f7f7" }}>
        <div className="max-w-5xl mx-auto space-y-5">
          {sections.map(({ heading: sh, body }) => (
            <div
              key={sh}
              className="bg-white rounded-xl shadow-sm px-7 py-6"
              style={{ borderLeft: "4px solid #3B5373" }}
            >
              <h2
                className="font-serif text-xl font-semibold mb-3"
                style={{ color: "#3B5373" }}
              >
                {sh}
              </h2>
              <p
                className="text-sm leading-relaxed whitespace-pre-line"
                style={{ color: "#666" }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Strip ────────────────────────────────── */}
      <section
        style={{ backgroundColor: "#3B5373" }}
        className="py-12 text-center px-4"
      >
        <p className="text-white text-lg font-medium mb-5">{ctaText}</p>
        <a
          href="/contact"
          className="inline-block px-8 py-3 rounded-xl text-sm font-semibold transition-colors hover:bg-gray-100"
          style={{ backgroundColor: "#fff", color: "#3B5373" }}
        >
          Contact Us →
        </a>
      </section>
    </>
  );
}
