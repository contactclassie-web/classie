"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Instagram } from "lucide-react";

interface IgImage { image_url: string; link_url: string; display_order: number; active: boolean; }
interface IgSettings { handle: string; heading: string; subtext: string; followText: string; followUrl: string; }

const IG_KEYS = ["ig_handle","ig_heading","ig_subtext","ig_follow_text","ig_follow_url"];
const IG_DEFAULTS: IgSettings = {
  handle: "@classie_in", heading: "Style Inspo", subtext: "Tag us to be featured",
  followText: "Follow @classie_in →", followUrl: "https://www.instagram.com/_classie_in/",
};

export default function StyleInspoSection() {
  const [images, setImages] = useState<IgImage[]>([]);
  const [cfg, setCfg] = useState<IgSettings>(IG_DEFAULTS);

  useEffect(() => {
    supabase.from("instagram_images").select("*").eq("active", true)
      .order("display_order", { ascending: true }).limit(6)
      .then(({ data }) => { if (data && data.length > 0) setImages(data as IgImage[]); });

    supabase.from("site_settings").select("key,value").in("key", IG_KEYS)
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        const m: Record<string, string> = {};
        data.forEach(({ key, value }) => { m[key] = value; });
        setCfg({
          handle:     m.ig_handle      || IG_DEFAULTS.handle,
          heading:    m.ig_heading     || IG_DEFAULTS.heading,
          subtext:    m.ig_subtext     || IG_DEFAULTS.subtext,
          followText: m.ig_follow_text || IG_DEFAULTS.followText,
          followUrl:  m.ig_follow_url  || IG_DEFAULTS.followUrl,
        });
      });
  }, []);

  if (images.length === 0) return null;

  // Split heading into normal + italic last word
  const parts = cfg.heading.trim().split(" ");
  const italic = parts.pop() || "";
  const normal = parts.join(" ");

  return (
    <section className="py-20 bg-white border-t border-gray-100 px-6 md:px-20">
      <div>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-px bg-[#3B5373]" />
            <span className="font-sans text-[10px] font-light tracking-[0.36em] uppercase text-[#3B5373]">{cfg.handle}</span>
            <div className="w-8 h-px bg-[#3B5373]" />
          </div>
          <h2 className="font-serif text-[clamp(1.6rem,3vw,2.5rem)] font-light leading-[1.15] text-[#1a1a1a] mb-2">
            {normal}{normal ? " " : ""}<em className="italic text-[#3B5373]">{italic}</em>
          </h2>
          <p className="text-[#9ca3af] text-xs tracking-wide font-light">{cfg.subtext}</p>
        </div>

        {/* Grid */}
        <div className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${Math.min(images.length, 6)}, 1fr)` }}>
          {images.map((item, i) => (
            <a key={i} href={item.link_url || "#"} target="_blank" rel="noopener noreferrer"
              className="group relative overflow-hidden bg-[#c8d6e5]" style={{ aspectRatio: "1 / 1" }}>
              {item.image_url && (
                <Image src={item.image_url} alt="Style Inspo" fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 16vw" />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </a>
          ))}
        </div>

        {/* Follow link */}
        <div className="text-center mt-8">
          <a href={cfg.followUrl} target="_blank" rel="noopener noreferrer"
            className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#3B5373] border-b border-[#3B5373] pb-0.5 hover:text-[#2a3d55] transition-colors">
            {cfg.followText}
          </a>
        </div>
      </div>
    </section>
  );
}
