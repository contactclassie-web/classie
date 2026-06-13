"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TrustBand() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    supabase.from("site_settings").select("value").eq("key", "band_text").single()
      .then(({ data }) => {
        if (data?.value) setItems(data.value.split("·").map((s: string) => s.trim()).filter(Boolean));
      });
  }, []);

  if (items.length === 0) return null;
  const doubled = [...items, ...items];

  return (
    <div className="bg-[#3B5373] py-3 overflow-hidden">
      <div className="flex animate-ticker w-max">
        {[...doubled, ...doubled].map((item, i) => (
          <span key={i} className="whitespace-nowrap flex items-center">
            <span className="font-sans text-[10px] font-normal tracking-[0.18em] uppercase text-white/90 px-6">
              {item}
            </span>
            <span className="text-white/30 text-[8px]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
