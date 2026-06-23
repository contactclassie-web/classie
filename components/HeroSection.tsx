"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import HeroImageSlider from "./HeroImageSlider";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const DEFAULTS = {
  hero_eyebrow:         "New Collection",
  hero_heading_line1:   "One Heel.",
  hero_heading_italic:  "Endless",
  hero_heading_line3:   "Looks.",
  hero_subtitle:        "",
  hero_cta1_text:       "Shop Collection",
  hero_cta1_url:        "/shop",
  hero_cta2_text:       "Explore Edits",
  hero_cta2_url:        "/collections",
  hero_stat1_number:    "",
  hero_stat1_label:     "",
  hero_stat2_number:    "",
  hero_stat2_label:     "",
  hero_stat3_number:    "",
  hero_stat3_label:     "",
  hero_chip_code:       "",
  hero_chip_text:       "",
  hero_badge_text:      "SS25",
  hero_badge_sub:       "New In",
  hero_badge_active:    "true",
  hero_pill_text:       "247 sold today",
  hero_pill_sub:        "Limited stock",
  hero_pill_active:     "true",
};

const HERO_KEYS = Object.keys(DEFAULTS);

interface Slide { image_url: string; }

interface Props {
  heroSlides: Slide[];
  heroImageUrl: string;
  initialSettings?: Record<string, string>;
}

export default function HeroSection({ heroSlides, heroImageUrl, initialSettings }: Props) {
  // If server passes settings as props, use them directly — no client fetch needed (eliminates blink)
  const [cfg, setCfg] = useState<Record<string, string>>(
    initialSettings ? { ...DEFAULTS, ...initialSettings } : DEFAULTS
  );

  useEffect(() => {
    // Skip client fetch if server already provided settings — prevents flash
    if (initialSettings && Object.keys(initialSettings).length > 0) return;
    sb.from("site_settings")
      .select("key,value")
      .in("key", HERO_KEYS)
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        const merged = { ...DEFAULTS };
        data.forEach((r: { key: string; value: string }) => {
          if (r.key in merged) merged[r.key as keyof typeof DEFAULTS] = r.value;
        });
        setCfg(merged);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const eyebrow   = cfg.hero_eyebrow;
  const line1     = cfg.hero_heading_line1;
  const italic    = cfg.hero_heading_italic;
  const line3     = cfg.hero_heading_line3;
  const subtitle  = cfg.hero_subtitle;
  const cta1Text  = cfg.hero_cta1_text;
  const cta1Url   = cfg.hero_cta1_url || "/shop";
  const cta2Text  = cfg.hero_cta2_text;
  const cta2Url   = cfg.hero_cta2_url || "/collections";
  const stat1Num  = cfg.hero_stat1_number;
  const stat1Lab  = cfg.hero_stat1_label;
  const stat2Num  = cfg.hero_stat2_number;
  const stat2Lab  = cfg.hero_stat2_label;
  const stat3Num  = cfg.hero_stat3_number;
  const stat3Lab  = cfg.hero_stat3_label;
  const chipCode    = cfg.hero_chip_code;
  const chipText    = cfg.hero_chip_text;
  const badgeText   = cfg.hero_badge_text;
  const badgeSub    = cfg.hero_badge_sub;
  const badgeActive = cfg.hero_badge_active !== "false";
  const pillText    = cfg.hero_pill_text;
  const pillSub     = cfg.hero_pill_sub;
  const pillActive  = cfg.hero_pill_active !== "false";
  const showStats = !!(stat1Num || stat2Num || stat3Num);
  const stats     = [
    { number: stat1Num, label: stat1Lab },
    { number: stat2Num, label: stat2Lab },
    { number: stat3Num, label: stat3Lab },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-[42%_58%] min-h-[calc(100vh-72px)]">
      {/* Left: text */}
      <div className="flex flex-col justify-center px-6 md:px-20 py-16 md:py-24 bg-[#f7f7f7] relative">
        <div className="absolute right-0 top-[12%] bottom-[12%] w-px bg-gradient-to-b from-transparent via-[rgba(59,83,115,0.2)] to-transparent hidden md:block" />

        {eyebrow && (
          <div className="flex items-center gap-4 mb-7">
            <div className="w-8 h-px bg-[#3B5373]" />
            <span className="font-sans text-[10px] font-light tracking-[0.36em] uppercase text-[#3B5373]">{eyebrow}</span>
          </div>
        )}

        <h1 className="font-serif text-[clamp(52px,6.2vw,94px)] font-light leading-[1.02] text-[#1a1a1a] mb-8">
          {line1}
          <br />
          <em className="italic text-[#3B5373]">{italic}</em>
          <br />
          {line3}
        </h1>

        {subtitle && (
          <p className="font-sans text-sm font-light leading-[1.85] text-[#6b7280] max-w-[360px] mb-12 tracking-[0.04em]">
            {subtitle}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-6 mb-16">
          {cta1Text && (
            <Link href={cta1Url} className="bg-[#3B5373] text-white px-10 py-4 text-[10px] font-light tracking-[0.28em] uppercase border border-[#3B5373] hover:bg-[#1a1a1a] hover:border-[#1a1a1a] transition-all duration-300">
              {cta1Text}
            </Link>
          )}
          {cta2Text && (
            <Link href={cta2Url} className="border border-[#3B5373] text-[#3B5373] px-10 py-4 text-[10px] font-light tracking-[0.28em] uppercase hover:bg-[#3B5373] hover:text-white transition-all duration-300">
              {cta2Text}
            </Link>
          )}
        </div>

        {showStats && (
          <div className="flex gap-8 pt-8 border-t border-[rgba(59,83,115,0.15)]">
            {stats.filter(s => s.number).map((stat) => (
              <div key={stat.label}>
                <div className="font-serif text-[1.4rem] font-normal text-[#3B5373] leading-none">{stat.number}</div>
                <div className="font-sans text-[10px] font-light tracking-[0.14em] uppercase text-[#9ca3af] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: image */}
      <div className="relative overflow-hidden bg-[#F9F9F9] min-h-[400px]">
        <HeroImageSlider slides={heroSlides} fallbackUrl={heroImageUrl} />
        {chipCode && (
          <div className="absolute bottom-12 left-0 bg-white px-7 py-5 border-l-[3px] border-[#3B5373] shadow-xl">
            <div className="font-serif text-xl font-normal text-[#3B5373] tracking-[0.08em]">{chipCode}</div>
            <div className="font-sans text-[9.5px] font-light tracking-[0.22em] uppercase text-[#6b7280] mt-1">{chipText}</div>
          </div>
        )}
        {badgeActive && badgeText && (
          <div className="absolute bottom-0 left-0 bg-[#3B5373] text-white px-5 py-4">
            <div className="font-sans text-[18px] font-semibold tracking-[0.08em] uppercase">{badgeText}</div>
            {badgeSub && <div className="font-sans text-[9px] tracking-[0.18em] uppercase text-white/70 mt-0.5">{badgeSub}</div>}
          </div>
        )}
        {pillActive && pillText && (
          <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm shadow-md px-4 py-2.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
            <div>
              <p className="font-sans text-[11px] font-medium text-[#1a1a1a]">{pillText}</p>
              {pillSub && <p className="font-sans text-[10px] text-[#9ca3af]">{pillSub}</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
