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

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden flex flex-col"
      style={{ boxShadow: "0 2px 16px rgba(59,83,115,0.10)" }}
    >
      {/* Image */}
      <div className="relative flex-shrink-0 bg-[#f0eee9] overflow-hidden" style={{ height: `${cardH}px` }}>
        {coupon.image_url ? (
          <img
            src={coupon.image_url}
            alt={coupon.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl">🏷️</span>
          </div>
        )}
        {/* Status badge */}
        <span
          className="absolute top-3 left-3 text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full"
          style={{ background: status.color }}
        >
          {status.label}
        </span>
        {/* Discount badge */}
        <span
          className="absolute top-3 right-3 text-white text-[11px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: "#3B5373" }}
        >
          {discountLabel}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-semibold text-[#1a1a1a] text-sm leading-snug">{coupon.title}</h3>
          {coupon.description && (
            <p className="text-[12px] text-[#888] mt-1 leading-relaxed">{coupon.description}</p>
          )}
        </div>

        {/* Coupon code box */}
        <div
          className="flex items-center justify-between gap-2 rounded-lg px-3 py-2"
          style={{ border: "2px dashed #3B5373", background: "#f0eee9" }}
        >
          <span className="font-mono font-bold text-[#3B5373] text-sm tracking-widest">
            {coupon.code}
          </span>
          <button
            onClick={handleCopy}
            className="text-[11px] font-semibold uppercase tracking-wider transition-all flex-shrink-0"
            style={{ color: copied ? "#22c55e" : "#3B5373" }}
          >
            {copied ? "✓ Copied!" : "Copy"}
          </button>
        </div>

        {/* Copy Code button */}
        <button
          onClick={handleCopy}
          className="mt-auto w-full py-2.5 text-white text-[12px] font-semibold tracking-widest uppercase transition-all"
          style={{ background: copied ? "#22c55e" : "#3B5373", borderRadius: "8px" }}
        >
          {copied ? "✓ Copied!" : "Copy Code"}
        </button>
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
      <section style={{ background: "#f0eee9" }}>
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
            <div className="relative hidden md:block overflow-hidden" style={{ background: "#e8e4de" }}>
              {heroImg ? (
                <img
                  src={heroImg}
                  alt="Hot Deals"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full" style={{ background: "linear-gradient(135deg, #e8e4de 0%, #d5cfc6 100%)" }} />
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
