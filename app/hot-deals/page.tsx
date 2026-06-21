"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ── Types ─────────────────────────────────────────────────────────────────
type Coupon = {
  id: string;
  code: string;
  title: string;
  description: string;
  image_url: string;
  discount_type: "percent" | "flat";
  discount_value: number;
  active: boolean;
  valid_from: string | null;
  valid_until: string | null;
  uses_count: number;
  max_uses_total: number | null;
  min_order_value: number;
  display_order: number;
};

function getStatus(coupon: Coupon): { label: string; color: string } {
  const now = new Date();
  if (!coupon.active) return { label: "Inactive", color: "#9ca3af" };
  if (coupon.valid_until && new Date(coupon.valid_until) < now) return { label: "Expired", color: "#ef4444" };
  if (coupon.valid_from && new Date(coupon.valid_from) > now) return { label: "Upcoming", color: "#94a3b8" };
  if (coupon.valid_until) {
    const h = (new Date(coupon.valid_until).getTime() - now.getTime()) / 3600000;
    if (h < 48) return { label: "Ending Soon", color: "#f97316" };
  }
  return { label: "Ongoing", color: "#22c55e" };
}

// ── DealCard ─────────────────────────────────────────────────────────────
function DealCard({ coupon, cardH }: { coupon: Coupon; cardH: number }) {
  const [copied, setCopied] = useState(false);
  const status = getStatus(coupon);

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(coupon.code); }
    catch {
      const el = document.createElement("textarea");
      el.value = coupon.code;
      document.body.appendChild(el); el.select();
      document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const discountLabel = coupon.discount_type === "percent"
    ? `${coupon.discount_value}% OFF`
    : `₹${coupon.discount_value} OFF`;

  return (
    <div className="overflow-hidden flex transition-all duration-300 hover:-translate-y-1 group"
      style={{ background: "#fff", boxShadow: "0 4px 28px rgba(59,83,115,0.10)", border: "1px solid #ece9e3", minHeight: "260px" }}>

      {/* Left — Image */}
      <div className="relative flex-shrink-0 overflow-hidden" style={{ width: "44%" }}>
        {coupon.image_url ? (
          <img src={coupon.image_url} alt={coupon.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center relative" style={{ background: "#3B5373", minHeight: "260px" }}>
            <span className="text-white font-serif absolute select-none pointer-events-none"
              style={{ fontSize: "4rem", fontWeight: 700, opacity: 0.07, letterSpacing: "-2px" }}>DEAL</span>
            <span className="text-white font-bold relative z-10" style={{ fontSize: "1.8rem", letterSpacing: "-1px" }}>{discountLabel}</span>
            <span className="text-white text-[9px] tracking-[0.2em] uppercase mt-1 relative z-10" style={{ opacity: 0.5 }}>use code</span>
          </div>
        )}
        {/* Status badge — top left */}
        <span className="absolute top-3 left-3 text-white text-[8px] font-bold tracking-[0.12em] uppercase px-2.5 py-1"
          style={{ background: status.color, borderRadius: "2px" }}>● {status.label}</span>
        {/* Discount badge — bottom left (only when image) */}
        {coupon.image_url && (
          <span className="absolute bottom-3 left-3 text-white text-[10px] font-bold px-2.5 py-1"
            style={{ background: "#3B5373", borderRadius: "2px" }}>{discountLabel}</span>
        )}
      </div>

      {/* Right — Content */}
      <div className="flex flex-col flex-1 justify-between p-5">
        <div className="mb-4">
          {coupon.title && (
            <h3 className="font-serif mb-1.5" style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.25 }}>{coupon.title}</h3>
          )}
          {coupon.description && (
            <p className="text-[12px] leading-relaxed" style={{ color: "#888" }}>{coupon.description}</p>
          )}
          {coupon.min_order_value > 0 && (
            <p className="text-[10px] mt-2 font-semibold" style={{ color: "#3B5373" }}>Min. ₹{coupon.min_order_value}</p>
          )}
        </div>
        <div>
          <p className="text-[8px] tracking-[0.25em] uppercase mb-1.5 font-medium" style={{ color: "#bbb" }}>Use Code</p>
          <div className="flex items-stretch" style={{ border: "1.5px dashed #b8c5d1", borderRadius: "3px", overflow: "hidden" }}>
            <span className="flex-1 font-mono font-bold tracking-[0.1em] px-3 py-2.5 text-[13px]"
              style={{ color: "#3B5373", background: "#f8fafc" }}>{coupon.code}</span>
            <button onClick={handleCopy}
              className="px-3 text-[9px] font-bold tracking-[0.12em] uppercase transition-all flex-shrink-0"
              style={{ background: copied ? "#22c55e" : "#3B5373", color: "#fff", minWidth: "52px" }}>
              {copied ? "✓" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Section Divider (replaces stray circle) ───────────────────────────────
function SectionDivider({ heading, sub }: { heading: string; sub: string }) {
  return (
    <div className="text-center mb-12">
      <h2 className="font-serif mb-2" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#1a1a1a" }}>
        {heading}
      </h2>
      {sub && (
        <p className="text-xs tracking-widest uppercase" style={{ color: "#888" }}>{sub}</p>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function HotDealsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const [{ data: sRows }, { data: cData }] = await Promise.all([
      sb.from("site_settings").select("key,value").like("key", "hd_%"),
      sb.from("coupons").select("*").eq("active", true).order("display_order", { ascending: true }),
    ]);
    const cfg: Record<string, string> = {};
    (sRows ?? []).forEach((r: { key: string; value: string }) => { cfg[r.key] = r.value; });
    setSettings(cfg);
    setCoupons((cData ?? []) as Coupon[]);
    setReady(true);
  }, []);

  useEffect(() => { load(); }, [load]);

  const cols       = parseInt(settings.hd_cols || "2") || 2;
  const mobileCols = parseInt(settings.hd_mobile_cols || "1") || 1;
  const cardH      = parseInt(settings.hd_card_h || "280") || 280;
  const gap        = parseInt(settings.hd_card_gap || "28") || 28;
  const heroEyebrow   = settings.hd_hero_eyebrow || "Limited Time";
  const heroHeading   = settings.hd_hero_heading || "HOT\nDEALS";
  const heroSub       = settings.hd_hero_sub || "OFFERS YOU DON'T WANT TO MISS";
  const heroImg       = settings.hd_hero_img || "";
  const sectionHeading = settings.hd_section_heading || "Current Offers";
  const sectionSub     = settings.hd_section_sub || "Use the code at checkout · Limited stock";

  return (
    <>
      {/* ── Hero ── */}
      <section style={{ background: "#f7f7f7" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: "480px" }}>
            {/* Left */}
            <div className="flex flex-col justify-center py-16 md:py-20 pr-0 md:pr-16">
              {heroEyebrow && (
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-px" style={{ background: "#3B5373" }} />
                  <span className="text-[9px] tracking-[0.35em] uppercase font-semibold" style={{ color: "#3B5373" }}>{heroEyebrow}</span>
                </div>
              )}
              <h1 className="font-serif mb-5" style={{ fontSize: "clamp(3.5rem,10vw,7rem)", lineHeight: 0.88, color: "#3B5373", fontWeight: 700, letterSpacing: "-2px" }}>
                {heroHeading.split("\n").map((line, i) => <span key={i} className="block">{line}</span>)}
              </h1>
              <div className="h-px mb-5 max-w-[120px]" style={{ background: "#3B5373", opacity: 0.2 }} />
              <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: "#888" }}>{heroSub}</p>
            </div>
            {/* Right */}
            <div className="relative hidden md:block overflow-hidden" style={{ background: "#3B5373" }}>
              {heroImg ? (
                <img src={heroImg} alt="Hot Deals" className="w-full h-full object-cover object-center" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="select-none pointer-events-none font-serif font-bold"
                    style={{ fontSize: "9rem", color: "rgba(255,255,255,0.06)", letterSpacing: "-6px" }}>HOT</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Deals Section ── */}
      <section style={{ background: "#fafafa" }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionDivider heading={sectionHeading} sub={sectionSub} />

          {!ready ? (
            /* Skeleton cards while loading */
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols || 2}, 1fr)`, gap: "28px" }}>
              {[1, 2].map(i => (
                <div key={i} className="overflow-hidden animate-pulse" style={{ border: "1px solid #ece9e3", background: "#fff" }}>
                  <div style={{ height: "280px", background: "#f0f0f0" }} />
                  <div className="p-5 space-y-3">
                    <div className="h-4 rounded" style={{ background: "#f0f0f0", width: "70%" }} />
                    <div className="h-3 rounded" style={{ background: "#f0f0f0", width: "90%" }} />
                    <div className="h-10 rounded mt-4" style={{ background: "#f0f0f0" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-sm" style={{ color: "#888" }}>No deals right now. Check back soon!</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: `${gap}px` }}
              className={`[&]:grid-cols-${mobileCols} md:[&]:grid-cols-${cols}`}>
              {coupons.map(c => <DealCard key={c.id} coupon={c} cardH={cardH} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
