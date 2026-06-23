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

interface Props {
  excludeSlug?: string;
  activeSlug?: string;
  initialCategories?: Array<{ name: string; slug: string; display_order?: number }>;
  initialSettings?: Record<string, string>;
}

export default function CategoryLinks({ excludeSlug, activeSlug, initialCategories, initialSettings }: Props) {
  const buildStyle = (s?: Record<string, string>): Style => s ? {
    bold:      (s.cat_links_bold ?? "true") === "true",
    hoverBg:   s.cat_links_hover_bg   ?? "#3B5373",
    hoverText: s.cat_links_hover_text ?? "#ffffff",
    numColor:  s.cat_num_color        ?? "#9ca3af",
    textSize:  s.cat_text_size        ?? "1.1",
  } : DEFAULTS;

  const buildCats = (data?: Array<{ name: string; slug: string }>): Cat[] => {
    if (!data) return [];
    const filtered = excludeSlug ? data.filter((c) => c.slug !== excludeSlug) : data;
    return filtered.map(c => ({ name: c.name, slug: c.slug }));
  };

  const [cats, setCats]   = useState<Cat[]>(buildCats(initialCategories));
  const [style, setStyle] = useState<Style>(buildStyle(initialSettings));

  useEffect(() => {
    // Skip if server provided data
    if (initialCategories && initialCategories.length > 0 && initialSettings) return;

    supabase.from("site_categories").select("name,slug,display_order").eq("active", true)
      .order("display_order").then(({ data }) => {
        if (data) {
          const filtered = excludeSlug ? data.filter((c) => c.slug !== excludeSlug) : data;
          setCats(filtered);
        }
      });

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (cats.length === 0) return null;

  return (
    <div className="mt-5 border border-[#e5e5e5] rounded-sm overflow-hidden"
      style={{ gridTemplateColumns: `repeat(${Math.min(cats.length, 4)}, 1fr)`, display: "grid" }}>
      {cats.slice(0, 4).map((cat, idx) => {
        const isActive = activeSlug === cat.slug;
        return (
          <Link key={cat.slug} href={`/shop/${cat.slug}`}
            className="group flex flex-col justify-center px-7 py-5 border-r border-[#e5e5e5] last:border-r-0 transition-all duration-300"
            style={{ backgroundColor: isActive ? style.hoverBg : "white" }}
            onMouseEnter={e => {
              if (isActive) return;
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.backgroundColor = style.hoverBg;
              el.querySelectorAll<HTMLElement>("[data-cat-name]").forEach(c => { c.style.color = style.hoverText; });
              el.querySelectorAll<HTMLElement>("[data-cat-num]").forEach(c => { c.style.color = style.hoverText + "80"; });
            }}
            onMouseLeave={e => {
              if (isActive) return;
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.backgroundColor = "";
              el.querySelectorAll<HTMLElement>("[data-cat-name],[data-cat-num]").forEach(c => { c.style.color = ""; });
            }}>
            <p data-cat-num className="font-sans text-[10px] tracking-[0.15em] mb-1.5 transition-colors"
              style={{ color: isActive ? style.hoverText + "90" : style.numColor }}>
              0{idx + 1}
            </p>
            <div className="flex items-center gap-2">
              <p data-cat-name className="font-serif transition-colors"
                style={{ fontSize: `${style.textSize}rem`, fontWeight: style.bold ? 600 : 400, letterSpacing: "0.01em", color: isActive ? style.hoverText : "#1a1a1a" }}>
                {cat.name}
              </p>
              {isActive && (
                <span style={{ fontSize: "10px", color: style.hoverText, opacity: 0.7, letterSpacing: "0.15em", fontFamily: "'Poppins', sans-serif" }}>
                  ✓
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
