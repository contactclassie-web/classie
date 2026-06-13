"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Cat { name: string; slug: string; }

export default function CategoryLinks() {
  const [cats, setCats]         = useState<Cat[]>([]);
  const [bold, setBold]         = useState(true);
  const [hover, setHover]       = useState("navy-fill");

  useEffect(() => {
    supabase.from("site_categories").select("name,slug,display_order").eq("active", true)
      .order("display_order").then(({ data }) => { if (data) setCats(data); });
    supabase.from("site_settings").select("key,value")
      .in("key", ["cat_links_bold", "cat_links_hover"])
      .then(({ data }) => {
        if (!data) return;
        data.forEach(({ key, value }) => {
          if (key === "cat_links_bold") setBold(value === "true");
          if (key === "cat_links_hover") setHover(value);
        });
      });
  }, []);

  if (cats.length === 0) return null;

  const hoverClass = {
    "navy-fill": "hover:bg-[#3B5373] hover:text-white [&:hover_.cat-num]:text-white/60 [&:hover_.cat-arrow]:opacity-100",
    "zoom":      "hover:scale-[1.03] hover:shadow-lg hover:z-10 hover:bg-white [&:hover_.cat-arrow]:opacity-100",
    "text-blue": "hover:bg-[#f7f7f7] [&:hover_.cat-name]:text-[#3B5373] [&:hover_.cat-arrow]:opacity-100",
    "blur":      "hover:bg-white/80 backdrop-blur-sm hover:shadow-md [&:hover_.cat-name]:text-[#3B5373] [&:hover_.cat-arrow]:opacity-100",
  }[hover] ?? "";

  return (
    <div className="grid border border-[#e8e8e8] mt-5 overflow-hidden rounded-sm"
      style={{ gridTemplateColumns: `repeat(${Math.min(cats.length, 4)}, 1fr)` }}>
      {cats.slice(0, 4).map((cat, idx) => (
        <Link key={cat.slug} href={`/shop/${cat.slug}`}
          className={`group relative flex items-center justify-between px-6 py-5 bg-white transition-all duration-300 border-r border-[#e8e8e8] last:border-r-0 ${hoverClass}`}>
          <div>
            <p className="cat-num font-sans text-[9px] tracking-[0.2em] uppercase text-[#9ca3af] mb-1 transition-colors">
              0{idx + 1}
            </p>
            <p className={`cat-name font-serif text-[1.1rem] text-[#1a1a1a] transition-colors tracking-wide ${bold ? "font-semibold" : "font-normal"}`}>
              {cat.name}
            </p>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
            className="cat-arrow opacity-0 group-hover:translate-x-1 transition-all duration-300">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      ))}
    </div>
  );
}
