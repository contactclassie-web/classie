"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Cat { name: string; slug: string; }
interface Style {
  bold: boolean;
  hoverBg: string;
  hoverText: string;
  numColor: string;
  textSize: string;
}

const DEFAULTS: Style = { bold: true, hoverBg: "#3B5373", hoverText: "#ffffff", numColor: "#9ca3af", textSize: "1.1" };

export default function CategoryLinks() {
  const [cats, setCats]   = useState<Cat[]>([]);
  const [style, setStyle] = useState<Style>(DEFAULTS);

  useEffect(() => {
    supabase.from("site_categories").select("name,slug,display_order").eq("active", true)
      .order("display_order").then(({ data }) => { if (data) setCats(data); });

    supabase.from("site_settings").select("key,value")
      .in("key", ["cat_links_bold","cat_links_hover_bg","cat_links_hover_text","cat_num_color","cat_text_size"])
      .then(({ data }) => {
        if (!data) return;
        const m: Record<string, string> = {};
        data.forEach(({ key, value }) => { m[key] = value; });
        setStyle({
          bold:      (m.cat_links_bold ?? "true") === "true",
          hoverBg:   m.cat_links_hover_bg   ?? "#3B5373",
          hoverText: m.cat_links_hover_text ?? "#ffffff",
          numColor:  m.cat_num_color        ?? "#9ca3af",
          textSize:  m.cat_text_size        ?? "1.1",
        });
      });
  }, []);

  if (cats.length === 0) return null;

  return (
    <div className="grid border border-[#e8e8e8] mt-5 overflow-hidden rounded-sm"
      style={{ gridTemplateColumns: `repeat(${Math.min(cats.length, 4)}, 1fr)` }}>
      {cats.slice(0, 4).map((cat, idx) => (
        <Link key={cat.slug} href={`/shop/${cat.slug}`}
          className="group flex items-center justify-between px-6 py-5 bg-white transition-all duration-300 border-r border-[#e8e8e8] last:border-r-0"
          onMouseEnter={e => {
            const el = e.currentTarget;
            el.style.backgroundColor = style.hoverBg;
            el.querySelectorAll<HTMLElement>("[data-cat-name],[data-cat-arrow]").forEach(c => {
              c.style.color = style.hoverText;
              c.style.opacity = "1";
            });
            el.querySelector<HTMLElement>("[data-cat-num]")!.style.color = style.hoverText + "99";
          }}
          onMouseLeave={e => {
            const el = e.currentTarget;
            el.style.backgroundColor = "";
            el.querySelectorAll<HTMLElement>("[data-cat-name],[data-cat-arrow]").forEach(c => {
              c.style.color = "";
              c.style.opacity = "";
            });
            el.querySelector<HTMLElement>("[data-cat-num]")!.style.color = "";
          }}>
          <div>
            <p data-cat-num className="font-sans text-[9px] tracking-[0.2em] uppercase mb-1 transition-colors"
              style={{ color: style.numColor }}>
              0{idx + 1}
            </p>
            <p data-cat-name className="font-serif text-[#1a1a1a] transition-colors tracking-wide"
              style={{ fontSize: `${style.textSize}rem`, fontWeight: style.bold ? 600 : 400 }}>
              {cat.name}
            </p>
          </div>
          <svg data-cat-arrow width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            className="opacity-0 translate-x-0 group-hover:translate-x-1 transition-all duration-300">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      ))}
    </div>
  );
}
