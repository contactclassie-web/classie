"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { Metadata } from "next";

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

// ── Status badge logic ────────────────────────────────────────────────────

function getStatus(coupon: Coupon): { label: string; color: string } {
  const now = new Date();
  if (!coupon.active) return { label: "Inactive", color: "#9ca3af" };
  if (coupon.valid_until && new Date(coupon.valid_until) < now) return { label: "Expired", color: "#ef4444" };
  if (coupon.valid_from && new Date(coupon.valid_from) > now) return { label: "Upcoming", color: "#9ca3af" };
  if (coupon.valid_until) {
    const hoursLeft = (new Date(coupon.valid_until).getTime() - now.getTime()) / 3600000;
    if (hoursLeft < 48) return { label: "Ending Soon", color: "#f97316" };
  }
  return { label: "Ongoing", color: "#22c55e" };
}

// ── DealCard ─────────────────────────────────────────────────────────────

function DealCard({ coupon, cardH }: { coupon: Coupon; cardH: number }) {
  const [copied, setCopied] = useState(false);
  const status = getStatus(coupon);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = coupon.code;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const discountLabel =
    coupon.discount_type === "percent"
      ? `${coupon.discount_value}% OFF`
      : `₹${coupon.discount_value} OFF`;

  const statusColors: Record<string, string> = {
    green: "#22c55e", orange: "#f97316", gray: "#94a3b8", red: "#ef4444"
  };

  return (
    <div
      className="overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1"
      style={{ background: "#fff", boxShadow: "0 4px 24px rgba(59,83,115,0.10)", borderRadius: "0px", border: "1px solid #ece9e3" }}
    >
      {/* Image / Fallback */}
      <div className="relative flex-shrink-0 overflow-hidden" style={{ height: `${cardH}px` }}>
        {coupon.image_url ? (
          <img src={coupon.image_url} alt={coupon.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        ) : (
          /* No image — show navy bg with big discount text */
          <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: "#3B5373" }}>
            <span className="text-white font-serif" style={{ fontSize: "clamp(3rem,8vw,5rem)", fontWeight: 700, lineHeight: 1, opacity: 0.15, letterSpacing: "-2px", position: "absolute" }}>DEAL</span>
            <span className="text-white font-bold relative z-10" style={{ fontSize: "clamp(2rem,6vw,3.5rem)", letterSpacing: "-1px" }}>{discountLabel}</span>
            <span className="text-white text-xs tracking-[0.2em] uppercase mt-2 relative z-10" style={{ opacity: 0.6 }}>use code below</span>
          </div>
        )}
        {/* Status badge — top left */}
        <span
          className="absolute top-3 left-3 text-white text-[9px] font-bold tracking-[0.15em] uppercase px-3 py-1"
          style={{ background: statusColors[status.color] || "#22c55e", borderRadius: "2px" }}
        >● {status.label}</span>
        {/* Discount badge — top right (only when image present) */}
        {coupon.image_url && (
          <span className="absolute top-3 right-3 text-white text-[11px] font-bold px-3 py-1" style={{ background: "#3B5373", borderRadius: "2px" }}>
            {discountLabel}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 gap-0">
        {/* Title + desc */}
        <div className="px-5 pt-5 pb-4 border-b" style={{ borderColor: "#f0ede8" }}>
          {coupon.title && <h3 className="font-serif text-[#1a1a1a] mb-1" style={{ fontSize: "1.15rem", fontWeight: 700 }}>{coupon.title}</h3>}
          {coupon.description && <p className="text-[12px] leading-relaxed" style={{ color: "#888" }}>{coupon.description}</p>}
          {coupon.min_order_value > 0 && (
            <p className="text-[10px] mt-2 font-medium" style={{ color: "#3B5373" }}>Min. order: ₹{coupon.min_order_value}</p>
          )}
        </div>

        {/* Coupon code row */}
        <div className="px-5 py-4">
          <p className="text-[9px] tracking-[0.2em] uppercase mb-2" style={{ color: "#bbb" }}>Coupon Code</p>
          <div className="flex items-center gap-0" style={{ border: "1.5px dashed #c0ccd8", borderRadius: "4px", overflow: "hidden" }}>
            <span className="flex-1 font-mono font-bold tracking-[0.15em] px-4 py-3 text-sm" style={{ color: "#3B5373", background: "#f8f9fb" }}>
              {coupon.code}
            </span>
            <button
              onClick={handleCopy}
              className="px-4 py-3 text-[10px] font-bold tracking-[0.15em] uppercase transition-all flex-shrink-0"
              style={{ background: copied ? "#22c55e" : "#3B5373", color: "#fff", borderLeft: "1.5px dashed #c0ccd8" }}
            >
              {copied ? "✓" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── HotDealsGrid (client) ─────────────────────────────────────────────────

function HotDealsGrid({
  coupons,
  settings,
}: {
  coupons: Coupon[];
  settings: Record<string, string>;
}) {
  const cols = parseInt(settings.hd_cols || "3") || 3;
  const mobileCols = parseInt(settings.hd_mobile_cols || "1") || 1;
  const cardH = parseInt(settings.hd_card_h || "280") || 280;
  const gap = parseInt(settings.hd_card_gap || "28") || 28;

  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth > 0 && windowWidth < 768;
  const activeCols = isMobile ? mobileCols : cols;

  if (coupons.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[#888] text-sm">No deals right now. Check back soon!</p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${activeCols}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {coupons.map((c) => (
        <DealCard key={c.id} coupon={c} cardH={cardH} />
      ))}
    </div>
  );
}

// ── Ticker ────────────────────────────────────────────────────────────────

function TickerBar({ text }: { text: string }) {
  const items = text.split("|").map((s) => s.trim()).filter(Boolean);
  const repeated = [...items, ...items, ...items];
  return (
    <div
      className="overflow-hidden py-2.5"
      style={{ background: "#3B5373" }}
    >
      <div
        className="flex gap-8 whitespace-nowrap"
        style={{ animation: "ticker 24s linear infinite" }}
      >
        {repeated.map((item, i) => (
          <span key={i} className="text-white text-[11px] font-semibold tracking-[0.3em] uppercase flex-shrink-0">
            {item}
            <span className="ml-8 text-white/30">✦</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────

export default function HotDealsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function load() {
      const [{ data: settingsRows }, { data: couponsData }] = await Promise.all([
        sb.from("site_settings").select("key,value").like("key", "hd_%"),
        sb
          .from("coupons")
          .select("*")
          .eq("active", true)
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false }),
      ]);

      const cfg: Record<string, string> = {};
      (settingsRows ?? []).forEach((r: { key: string; value: string }) => {
        cfg[r.key] = r.value;
      });
      setSettings(cfg);
      setCoupons((couponsData ?? []) as Coupon[]);
      setLoading(false);
    }

    load();
  }, []);

  // Defaults
  const ticker = settings.hd_ticker || "ONGOING & UPCOMING|NEW OFFERS INSIDE|DON'T MISS OUT";
  const heroHeading = settings.hd_hero_heading || "HOT\nDEALS";
  const heroEyebrow = settings.hd_hero_eyebrow || "Limited Time";
  const heroSub = settings.hd_hero_sub || "OFFERS YOU DON'T WANT TO MISS";
  const heroImg = settings.hd_hero_img || "";
  const sectionHeading = settings.hd_section_heading || "Current Offers";
  const sectionSub = settings.hd_section_sub || "Use the code at checkout · Limited stock";

  const heroLines = heroHeading.split("\n");

  return (
    <>
      {/* ── Hero ── */}
      <section style={{ background: "#f7f7f7" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[420px] md:min-h-[520px]">
            {/* Left: text */}
            <div className="flex flex-col justify-center py-16 md:py-20 pr-0 md:pr-12">
              {heroEyebrow && (
                <p
                  className="text-[10px] font-semibold tracking-[0.5em] uppercase mb-5"
                  style={{ color: "#3B5373" }}
                >
                  {heroEyebrow}
                </p>
              )}
              <h1
                className="font-serif leading-none mb-5"
                style={{ fontSize: "clamp(4rem, 10vw, 7rem)", color: "#3B5373" }}
              >
                {heroLines.map((line, i) => (
                  <span key={i} className={i > 0 ? "block italic" : "block"}>
                    {line}
                  </span>
                ))}
              </h1>
              {heroSub && (
                <p
                  className="text-[11px] font-semibold tracking-[0.35em] uppercase"
                  style={{ color: "#3B5373", opacity: 0.7 }}
                >
                  {heroSub}
                </p>
              )}
              {coupons.length > 0 && (
                <div className="mt-8 flex gap-4">
                  <div className="text-center">
                    <p className="font-bold text-2xl" style={{ color: "#3B5373" }}>
                      {coupons.length}
                    </p>
                    <p className="text-[10px] tracking-widest uppercase" style={{ color: "#3B5373", opacity: 0.6 }}>
                      Active Deals
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: image */}
            <div className="relative hidden md:block overflow-hidden" style={{ background: "#3B5373" }}>
              {heroImg ? (
                <img
                  src={heroImg}
                  alt="Hot Deals"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: "#3B5373" }}>
                  <span style={{ fontSize: "8rem", fontWeight: 800, color: "rgba(255,255,255,0.06)", letterSpacing: "-4px", fontFamily: "serif" }}>HOT</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Deals section ── */}
      <section style={{ background: "#faf9f7" }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <div className="text-center mb-12">
            <h2
              className="font-serif mb-2"
              style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#1a1a1a" }}
            >
              {sectionHeading}
            </h2>
            {sectionSub && (
              <p className="text-xs tracking-widest uppercase" style={{ color: "#888" }}>
                {sectionSub}
              </p>
            )}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div
                className="inline-block w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                style={{ borderColor: "#3B5373", borderTopColor: "transparent" }}
              />
            </div>
          ) : (
            <HotDealsGrid coupons={coupons} settings={settings} />
          )}
        </div>
      </section>
    </>
  );
}
