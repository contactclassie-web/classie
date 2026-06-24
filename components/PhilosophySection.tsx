"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

interface PhilData {
  eyebrow: string; headLine1: string; headItalic: string; headLine2: string;
  body: string; ctaText: string; ctaUrl: string; imageUrl: string;
  stat1n: string; stat1l: string; stat2n: string; stat2l: string; stat3n: string; stat3l: string;
  f1Title: string; f1Desc: string; f2Title: string; f2Desc: string;
}

const D: PhilData = {
  eyebrow: "Our Philosophy",
  headLine1: "One Heel.", headItalic: "Endless", headLine2: "Possibilities.",
  body: "Classie was born from a simple belief — every woman deserves to feel powerful in her heels. Comfort-first design, premium materials, and the freedom to switch your story with a single clip.\n\nDesigned and crafted in India, each pair is an invitation to move through the world on your own terms.",
  ctaText: "Read Our Story", ctaUrl: "/about", imageUrl: "",
  stat1n: "10K+", stat1l: "Happy Customers",
  stat2n: "50+",  stat2l: "Styles Available",
  stat3n: "4.9★", stat3l: "Avg. Rating",
  f1Title: "Comfort-First Design", f1Desc: "Engineered for all-day wear without compromise.",
  f2Title: "Premium Quality",       f2Desc: "Curated materials, meticulous craftsmanship.",
};

const KEYS = [
  "philosophy_eyebrow","philosophy_headline","philosophy_headline_italic","philosophy_headline2",
  "philosophy_body","philosophy_cta_text","philosophy_cta_url","philosophy_image_url",
  "phil_stat1_number","phil_stat1_label","phil_stat2_number","phil_stat2_label","phil_stat3_number","phil_stat3_label",
  "phil_f1_title","phil_f1_desc","phil_f2_title","phil_f2_desc",
];

interface Props { initialSettings?: Record<string, string>; }

function buildPhilData(m?: Record<string, string>): PhilData {
  if (!m) return D;
  return {
    eyebrow:    m.philosophy_eyebrow          || D.eyebrow,
    headLine1:  m.philosophy_headline         || D.headLine1,
    headItalic: m.philosophy_headline_italic  || D.headItalic,
    headLine2:  m.philosophy_headline2        || D.headLine2,
    body:       m.philosophy_body             || D.body,
    ctaText:    m.philosophy_cta_text         || D.ctaText,
    ctaUrl:     m.philosophy_cta_url          || D.ctaUrl,
    imageUrl:   m.philosophy_image_url        || "",
    stat1n: m.phil_stat1_number || D.stat1n, stat1l: m.phil_stat1_label || D.stat1l,
    stat2n: m.phil_stat2_number || D.stat2n, stat2l: m.phil_stat2_label || D.stat2l,
    stat3n: m.phil_stat3_number || D.stat3n, stat3l: m.phil_stat3_label || D.stat3l,
    f1Title: m.phil_f1_title || D.f1Title, f1Desc: m.phil_f1_desc || D.f1Desc,
    f2Title: m.phil_f2_title || D.f2Title, f2Desc: m.phil_f2_desc || D.f2Desc,
  };
}

export default function PhilosophySection({ initialSettings }: Props) {
  const [d, setD] = useState<PhilData>(buildPhilData(initialSettings));

  useEffect(() => {
    if (initialSettings && Object.keys(initialSettings).length > 0) return;
    supabase.from("site_settings").select("key,value").in("key", KEYS).then(({ data }) => {
      if (!data || data.length === 0) return;
      const m: Record<string, string> = {};
      data.forEach(({ key, value }) => { m[key] = value; });
      setD(buildPhilData(m));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bodyParagraphs = d.body.split("\n\n").filter(Boolean);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2" style={{ minHeight: "80vh" }}>
      {/* Left: blue gradient + ghost C */}
      <div className="relative overflow-hidden" style={{ minHeight: "400px", background: "linear-gradient(145deg, #3B5373 0%, #5a7a9a 60%, #7a9ab5 100%)" }}>
        {d.imageUrl ? (
          <Image src={d.imageUrl} alt="Philosophy" fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-28 h-28 rounded-full border border-white/25 flex items-center justify-center mb-5">
              <span className="font-serif text-3xl text-white/40 font-light">C</span>
            </div>
            <span className="font-serif text-7xl text-white/10 font-light tracking-widest">Classie</span>
          </div>
        )}
      </div>

      {/* Right: white content */}
      <div className="bg-white flex flex-col justify-center px-8 md:px-16 py-16">
        {/* Eyebrow */}
        <p className="font-sans text-[10px] tracking-[0.28em] uppercase text-[#3B5373] mb-6">{d.eyebrow}</p>

        {/* Heading */}
        <h2 className="font-serif text-[clamp(28px,3.5vw,52px)] font-normal leading-[1.15] text-[#1a1a1a] mb-6">
          {d.headLine1}<br />
          <em className="italic font-light text-[#3B5373]" style={{ fontStyle: "italic" }}>{d.headItalic}</em>{" "}
          <span className="font-normal not-italic">{d.headLine2}</span>
        </h2>

        {/* Body */}
        <div className="mb-8 space-y-3 max-w-[480px]">
          {bodyParagraphs.map((p, i) => (
            <p key={i} className="font-sans text-sm font-light leading-[1.8] text-[#1a1a1a]">{p}</p>
          ))}
        </div>

        {/* Stats */}
        {(d.stat1n || d.stat2n || d.stat3n) && (
          <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-gray-100 mb-8">
            {[{ n: d.stat1n, l: d.stat1l }, { n: d.stat2n, l: d.stat2l }, { n: d.stat3n, l: d.stat3l }]
              .filter(s => s.n).map((s, i) => (
              <div key={i}>
                <p className="font-serif text-[2rem] font-bold text-[#3B5373] leading-none mb-1">{s.n}</p>
                <p className="font-sans text-[9px] tracking-[0.18em] uppercase text-[#1a1a1a]">{s.l}</p>
              </div>
            ))}
          </div>
        )}

        {/* Features 2-col */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {[{ t: d.f1Title, desc: d.f1Desc }, { t: d.f2Title, desc: d.f2Desc }].map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-[#3B5373] text-base mt-0.5 flex-shrink-0">{i === 0 ? "✦" : "⬡"}</span>
              <div>
                <p className="font-sans text-[11px] font-semibold text-[#1a1a1a] mb-1 tracking-wide">{f.t}</p>
                <p className="font-sans text-[11px] text-[#1a1a1a] leading-[1.6]">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link href={d.ctaUrl}
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-[#3B5373] border-b border-[#3B5373] pb-0.5 hover:text-[#2a3d55] self-start font-medium transition-colors">
          {d.ctaText} →
        </Link>
      </div>
    </section>
  );
}
