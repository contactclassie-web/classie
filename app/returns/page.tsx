import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 0;
export const metadata: Metadata = { title: "Returns & Exchanges – Classie" };

export default async function ReturnsPage() {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await sb
    .from("site_settings")
    .select("key,value")
    .like("key", "re_%");
  const cfg: Record<string, string> = {};
  (data ?? []).forEach((r: { key: string; value: string }) => {
    cfg[r.key] = r.value;
  });

  const eyebrow = cfg.re_eyebrow ?? "CLASSIE";
  const heading = cfg.re_heading ?? "Returns & Exchanges";
  const sub     = cfg.re_sub     ?? "Hassle-free returns within 7 days of delivery";
  const updated = cfg.re_updated ?? "Last updated: June 2025";

  const tile1Title = cfg.re_tile1_title ?? "7-Day Returns";
  const tile1Sub   = cfg.re_tile1_sub   ?? "Return within 7 days of delivery";
  const tile2Title = cfg.re_tile2_title ?? "Free Size Exchange";
  const tile2Sub   = cfg.re_tile2_sub   ?? "Subject to stock availability";
  const tile3Title = cfg.re_tile3_title ?? "Refund in 5–7 Days";
  const tile3Sub   = cfg.re_tile3_sub   ?? "After product inspection";

  const eligibleHeading   = cfg.re_eligible_heading   ?? "Eligible Returns";
  const eligibleBody      = cfg.re_eligible_body      ?? `Products are eligible for return if:\n\n• Returned within 7 days of delivery\n• Unused, unworn, and in original condition\n• In original packaging with all tags attached\n• Accompanied by the original invoice`;
  const nonreturnHeading  = cfg.re_nonreturn_heading  ?? "Non-Returnable Items";
  const nonreturnBody     = cfg.re_nonreturn_body     ?? `• Style Clips and accessories (not eligible for return)\n• Items worn or used\n• Items without original packaging\n• Products purchased during clearance or final sale`;
  const initiateHeading   = cfg.re_initiate_heading   ?? "How to Initiate a Return";
  const initiateBody      = cfg.re_initiate_body      ?? `1. WhatsApp us at +91-9468147781 with your Order ID and reason\n2. We'll confirm eligibility and schedule a free pickup\n3. Pack the product securely in original packaging\n4. Refund or exchange is processed after inspection (2–3 business days)`;
  const exchangeHeading   = cfg.re_exchange_heading   ?? "Exchanges";
  const exchangeBody      = cfg.re_exchange_body      ?? `Size exchanges are free within 7 days of delivery, subject to stock availability.\n\nContact us to check availability before initiating. Only heels are eligible for size exchange — Style Clips cannot be exchanged.`;
  const refundHeading     = cfg.re_refund_heading     ?? "Refunds";
  const refundBody        = cfg.re_refund_body        ?? `Once we receive and inspect the returned product (2–3 business days), refunds are processed within 5–7 business days.\n\nFor COD orders, refunds are issued via bank transfer. For online payments, the refund is credited back to the original payment method.`;

  const ctaText = cfg.re_cta_text ?? "Need help with a return or exchange?";

  const tiles = [
    { emoji: "♻️", title: tile1Title, sub: tile1Sub },
    { emoji: "🔄", title: tile2Title, sub: tile2Sub },
    { emoji: "💰", title: tile3Title, sub: tile3Sub },
  ];

  const sections = [
    { heading: eligibleHeading,  body: eligibleBody },
    { heading: nonreturnHeading, body: nonreturnBody },
    { heading: initiateHeading,  body: initiateBody },
    { heading: exchangeHeading,  body: exchangeBody },
    { heading: refundHeading,    body: refundBody },
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
        <p className="mt-3 text-base" style={{ color: "rgba(255,255,255,0.75)" }}>
          {sub}
        </p>
        <p className="mt-3 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
          {updated}
        </p>
      </section>

      {/* ── KPI Tiles ────────────────────────────────── */}
      <section className="py-14 px-4" style={{ backgroundColor: "#fff" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">
          {tiles.map(({ emoji, title, sub: tileSub }) => (
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
                  {tileSub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Policy Cards ─────────────────────────────── */}
      <section className="py-14 px-4" style={{ backgroundColor: "#f7f7f7" }}>
        <div className="max-w-3xl mx-auto space-y-5">
          {sections.map(({ heading: sh, body }) => (
            <div
              key={sh}
              className="bg-white rounded-xl shadow-sm px-7 py-6"
              style={{ borderLeft: "3px solid #3B5373" }}
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
