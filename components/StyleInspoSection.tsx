"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Instagram } from "lucide-react";

interface IgImage { image_url: string; link_url: string; display_order: number; active: boolean; }

export default function StyleInspoSection() {
  const [images, setImages] = useState<IgImage[]>([]);

  useEffect(() => {
    supabase.from("instagram_images").select("*").eq("active", true)
      .order("display_order", { ascending: true }).limit(6)
      .then(({ data }) => {
        if (data && data.length > 0) setImages(data as IgImage[]);
      });
  }, []);

  if (images.length === 0) return null;

  return (
    <section className="py-20 bg-white border-t border-gray-100 px-6 md:px-20">
      <div>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-px bg-[#3B5373]" />
            <span className="font-sans text-[10px] font-light tracking-[0.36em] uppercase text-[#3B5373]">@classie_in</span>
            <div className="w-8 h-px bg-[#3B5373]" />
          </div>
          <h2 className="font-serif text-[clamp(1.6rem,3vw,2.5rem)] font-light leading-[1.15] text-[#1a1a1a] mb-2">
            Style <em className="italic text-[#3B5373]">Inspo</em>
          </h2>
          <p className="text-[#9ca3af] text-xs tracking-wide font-light">Tag us to be featured</p>
        </div>

        {/* Grid — always fills full width regardless of image count */}
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
          <a href="https://www.instagram.com/_classie_in/" target="_blank" rel="noopener noreferrer"
            className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#3B5373] border-b border-[#3B5373] pb-0.5 hover:text-[#2a3d55] transition-colors">
            Follow @classie_in →
          </a>
        </div>
      </div>
    </section>
  );
}
