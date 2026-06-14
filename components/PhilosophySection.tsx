"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

interface PhilData {
  eyebrow: string; headline: string; body: string;
  ctaText: string; ctaUrl: string; imageUrl: string;
  f1Title: string; f1Desc: string;
  f2Title: string; f2Desc: string;
  f3Title: string; f3Desc: string;
}

const DEFAULTS: PhilData = {
  eyebrow: "Our Philosophy", headline: "One Heel. Endless Possibilities.",
  body: "Classie was born from a simple idea — every woman deserves to feel powerful in her heels. Comfort-first design, premium quality, styled your way.",
  ctaText: "Our Story", ctaUrl: "/about", imageUrl: "",
  f1Title: "Comfort-First Design",  f1Desc: "Engineered for all-day wear without sacrificing elegance.",
  f2Title: "Premium Quality",        f2Desc: "Curated materials, careful craftsmanship in every pair.",
  f3Title: "Free Exchange",          f3Desc: "Not the right fit? Exchange hassle-free, always.",
};

const KEYS = ["philosophy_eyebrow","philosophy_headline","philosophy_body","philosophy_cta_text","philosophy_cta_url","philosophy_image_url",
  "phil_f1_title","phil_f1_desc","phil_f2_title","phil_f2_desc","phil_f3_title","phil_f3_desc"];

export default function PhilosophySection() {
  const [d, setD] = useState<PhilData>(DEFAULTS);

  useEffect(() => {
    supabase.from("site_settings").select("key,value").in("key", KEYS).then(({ data }) => {
      if (!data || data.length === 0) return;
      const m: Record<string, string> = {};
      data.forEach(({ key, value }) => { m[key] = value; });
      setD({
        eyebrow:  m.philosophy_eyebrow   || DEFAULTS.eyebrow,
        headline: m.philosophy_headline  || DEFAULTS.headline,
        body:     m.philosophy_body      || DEFAULTS.body,
        ctaText:  m.philosophy_cta_text  || DEFAULTS.ctaText,
        ctaUrl:   m.philosophy_cta_url   || DEFAULTS.ctaUrl,
        imageUrl: m.philosophy_image_url || "",
        f1Title:  m.phil_f1_title || DEFAULTS.f1Title, f1Desc: m.phil_f1_desc || DEFAULTS.f1Desc,
        f2Title:  m.phil_f2_title || DEFAULTS.f2Title, f2Desc: m.phil_f2_desc || DEFAULTS.f2Desc,
        f3Title:  m.phil_f3_title || DEFAULTS.f3Title, f3Desc: m.phil_f3_desc || DEFAULTS.f3Desc,
      });
    });
  }, []);

  const features = [
    { icon: "✦", title: d.f1Title, desc: d.f1Desc },
    { icon: "⬡", title: d.f2Title, desc: d.f2Desc },
    { icon: "↩", title: d.f3Title, desc: d.f3Desc },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: "82vh" }}>
      {/* Left: image or ghost C */}
      <div className="relative overflow-hidden bg-[#f0f0ee]" style={{ minHeight: "400px" }}>
        {d.imageUrl ? (
          <Image src={d.imageUrl} alt="Philosophy" fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-32 h-32 rounded-full border border-[rgba(59,83,115,0.2)] flex items-center justify-center mb-6">
              <span className="font-serif text-4xl text-[rgba(59,83,115,0.25)] font-light">C</span>
            </div>
            <span className="font-serif text-6xl text-[rgba(59,83,115,0.08)] font-light tracking-widest">Classie</span>
          </div>
        )}
      </div>

      {/* Right: dark content */}
      <div className="bg-[#1a1a1a] flex flex-col justify-center px-8 md:px-16 py-16">
        {/* Eyebrow */}
        <div className="flex items-center gap-4 mb-7">
          <div className="w-8 h-px bg-[rgba(59,83,115,0.6)]" />
          <span className="font-sans text-[10px] font-light tracking-[0.36em] uppercase text-[rgba(59,83,115,0.8)]">{d.eyebrow}</span>
        </div>

        {/* Heading */}
        <h2 className="font-serif text-[clamp(32px,4vw,58px)] font-light leading-[1.08] text-white mb-8">
          {d.headline}
        </h2>

        {/* Body */}
        <p className="font-sans text-sm font-light leading-[1.85] text-white/50 mb-10 max-w-[420px] tracking-[0.03em]">
          {d.body}
        </p>

        {/* Features */}
        <div className="space-y-7 mb-12">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-5">
              <span className="text-[#3B5373] text-lg mt-0.5 flex-shrink-0">{f.icon}</span>
              <div>
                <div className="font-sans text-[11px] font-light tracking-[0.24em] uppercase text-white/80 mb-1.5">{f.title}</div>
                <div className="font-sans text-xs font-light text-white/40 leading-[1.7]">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link href={d.ctaUrl}
          className="inline-flex items-center gap-3 border border-white/20 text-white/70 px-8 py-3.5 text-[10px] tracking-[0.3em] uppercase font-light hover:border-white/50 hover:text-white transition-all self-start">
          {d.ctaText} <span>→</span>
        </Link>
      </div>
    </section>
  );
}
