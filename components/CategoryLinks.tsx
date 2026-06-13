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
    <div className="mt-5 border border-[#e5e5e5] rounded-sm overflow-hidden"
      style={{ gridTemplateColumns: `repeat(${Math.min(cats.length, 4)}, 1fr)`, display: "grid" }}>
      {cats.slice(0, 4).map((cat, idx) => (
        <Link key={cat.slug} href={`/shop/${cat.slug}`}
          className="group flex flex-col justify-center px-7 py-5 bg-white border-r border-[#e5e5e5] last:border-r-0 transition-all duration-300"
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.backgroundColor = style.hoverBg;
            el.querySelectorAll<HTMLElement>("[data-cat-name]").forEach(c => { c.style.color = style.hoverText; });
            el.querySelectorAll<HTMLElement>("[data-cat-num]").forEach(c => { c.style.color = style.hoverText + "80"; });
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.backgroundColor = "";
            el.querySelectorAll<HTMLElement>("[data-cat-name],[data-cat-num]").forEach(c => { c.style.color = ""; });
          }}>
          <p data-cat-num className="font-sans text-[10px] tracking-[0.15em] mb-1.5 transition-colors"
            style={{ color: style.numColor }}>
            0{idx + 1}
          </p>
          <p data-cat-name className="font-serif text-[#1a1a1a] transition-colors"
            style={{ fontSize: `${style.textSize}rem`, fontWeight: style.bold ? 600 : 400, letterSpacing: "0.01em" }}>
            {cat.name}
          </p>
        </Link>
      ))}
    </div>
  );
}
