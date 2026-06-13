"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Feature { icon: string; title: string; active: boolean; display_order: number; }

export default function TrustBand() {
  const [items, setItems] = useState<Feature[]>([]);

  useEffect(() => {
    supabase.from("features_bar").select("icon,title,active,display_order")
      .eq("active", true).order("display_order", { ascending: true })
      .then(({ data }) => { if (data && data.length > 0) setItems(data as Feature[]); });
  }, []);

  if (items.length === 0) return null;

  const doubled = [...items, ...items, ...items];

  return (
    <div className="bg-[#3B5373] py-[6px] overflow-hidden border-y border-[rgba(255,255,255,0.08)]">
      <div className="flex animate-ticker w-max">
        {doubled.map((item, i) => (
          <span key={i} className="whitespace-nowrap flex items-center gap-2 px-8">
            <span className="text-base leading-none">{item.icon}</span>
            <span className="font-sans text-[10px] font-normal tracking-[0.18em] uppercase text-white/90">
              {item.title}
            </span>
            <span className="text-white/25 text-[7px] ml-4">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
