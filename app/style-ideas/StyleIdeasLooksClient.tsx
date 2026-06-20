"use client";

import { useState } from "react";
import Link from "next/link";

interface LookCard {
  id: string;
  title: string;
  description: string;
  tag: string;
  image_url: string;
  media_type: string;
  look_number: number;
  link_url: string;
  display_order: number;
}

interface Props {
  looks: LookCard[];
  occasions: string[];
  cardsPerRow: number;
  showTag?: boolean;
  heading?: string;
}

export default function StyleIdeasLooksClient({ looks, occasions, cardsPerRow, showTag = true, heading = "Shop the Look" }: Props) {
  const [activeTab, setActiveTab] = useState("All Looks");

  const filtered = activeTab === "All Looks"
    ? looks
    : looks.filter(l => l.tag === activeTab);

  const colClass =
    cardsPerRow === 2 ? "grid-cols-1 sm:grid-cols-2" :
    cardsPerRow === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" :
    cardsPerRow === 5 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" :
    cardsPerRow === 6 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" :
    "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"; // default 4

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section Heading */}
        {heading && (
          <h2 className="font-serif text-3xl md:text-4xl text-center text-[#1a1a1a] font-light mb-10">{heading}</h2>
        )}

        {/* Occasion Tabs */}
        {occasions.length > 1 && (
          <div className="flex gap-2 flex-wrap mb-10 justify-center">
            {occasions.map(occ => (
              <button
                key={occ}
                onClick={() => setActiveTab(occ)}
                className={`px-5 py-2 text-xs font-medium tracking-widest uppercase border transition-all ${
                  activeTab === occ
                    ? "bg-[#3B5373] text-white border-[#3B5373]"
                    : "border-gray-200 text-[#888] hover:border-[#3B5373] hover:text-[#3B5373]"
                }`}
              >
                {occ}
              </button>
            ))}
          </div>
        )}

        {/* Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#888] text-sm">No looks in this category yet.</div>
        ) : (
          <div className={`grid gap-5 ${colClass}`}>
            {filtered.map((look) => (
              <LookCard key={look.id} look={look} showTag={showTag} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function LookCard({ look, showTag = true }: { look: LookCard; showTag?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const href = look.link_url || "/shop/heels";

  return (
    <div
      className="relative cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Media */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5]">
        {look.media_type === "video" ? (
          <video
            src={look.image_url}
            autoPlay muted loop playsInline
            className="w-full h-full object-cover object-center"
          />
        ) : look.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={look.image_url}
            alt={look.title}
            className={`w-full h-full object-cover object-center transition-transform duration-500 ${hovered ? "scale-105" : "scale-100"}`}
          />
        ) : (
          <div className="w-full h-full bg-[#f0ece8] flex items-center justify-center text-[#ccc] text-xs">No Image</div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Occasion tag */}
        {showTag && look.tag && (
          <span className="absolute top-3 left-3 text-[9px] tracking-[0.2em] uppercase bg-[#3B5373] text-white px-2.5 py-1">
            {look.tag}
          </span>
        )}

        {/* Hover: image zoom only — no overlay */}
      </div>

      {/* Card Info */}
      <div className="pt-3 pb-1">
        {look.look_number ? (
          <p className="text-[9px] tracking-[0.4em] uppercase text-[#888] mb-1">Look {String(look.look_number).padStart(2,"0")}</p>
        ) : null}
        <h3 className="font-serif text-base text-[#1a1a1a]">{look.title}</h3>
        {look.description && (
          <p className="text-[11px] text-[#888] mt-1 leading-relaxed line-clamp-2">{look.description}</p>
        )}
      </div>
    </div>
  );
}
