"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Occasion {
  title: string;
  slug: string;
  image: string;
  tag_label?: string;
  image_position?: string;
}

interface Props {
  activeOccasion: string | null;
  onOccasionClick: (slug: string | null) => void;
}

function OccasionFilterCard({
  occ,
  active,
  onClick,
}: {
  occ: Occasion;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group relative overflow-hidden cursor-pointer flex-shrink-0"
      style={{
        aspectRatio: "3 / 4",
        maxHeight: "520px",
        outline: active ? "3px solid #3B5373" : "3px solid transparent",
        outlineOffset: "-3px",
        transition: "outline 0.2s",
      }}
    >
      {occ.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={occ.image}
          alt={occ.title}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.06] group-hover:brightness-75"
          style={{ objectPosition: occ.image_position ?? "50% 50%" }}
        />
      ) : (
        <div className="absolute inset-0 bg-[#c8d6e5]" />
      )}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, transparent 38%, rgba(26,26,26,0.75) 100%)",
        }}
      />
      {/* Active overlay */}
      {active && (
        <div className="absolute inset-0 bg-[#3B5373]/20 pointer-events-none" />
      )}
      <div className="absolute bottom-0 left-0 p-6 pb-7">
        <p
          style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "9px",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.55)",
            marginBottom: "8px",
          }}
        >
          {occ.tag_label || "For Her"}
        </p>
        <h3
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "26px",
            fontWeight: 300,
            color: "white",
            lineHeight: 1.1,
            marginBottom: "12px",
          }}
        >
          {occ.title}
        </h3>
        <span
          className="inline-flex items-center gap-1 text-xs tracking-wide transition-all duration-300 group-hover:text-white group-hover:gap-2"
          style={{
            color: active ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)",
            fontSize: "11px",
            letterSpacing: "0.1em",
          }}
        >
          {active ? "Filtering ✓" : "Filter by this"}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  );
}

export default function OccasionFilterSection({ activeOccasion, onOccasionClick }: Props) {
  const [occasions, setOccasions] = useState<Occasion[]>([]);

  useEffect(() => {
    supabase
      .from("collections")
      .select("*")
      .eq("active", true)
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setOccasions(
            data.map((c) => ({
              title: c.title,
              slug: c.slug,
              image: c.image_url ?? "",
              tag_label: c.tag_label ?? "",
              image_position: c.image_position ?? "50% 50%",
            }))
          );
        }
      });
  }, []);

  if (occasions.length === 0) return null;

  const show = occasions.slice(0, 3);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10">
        <div className="text-center mb-10">
          <span className="font-sans text-[10px] font-light tracking-[0.38em] uppercase text-[#3B5373]">
            Curated Edits
          </span>
          <h2 className="font-serif text-[clamp(2rem,3.5vw,3.2rem)] font-light leading-[1.08] text-[#1a1a1a] mt-3">
            Shop by <em className="italic text-[#3B5373]">Occasion</em>
          </h2>
          <p className="text-[11px] text-gray-400 mt-2 tracking-[0.08em]">
            Click to filter heels by occasion
          </p>
        </div>

        {/* 3-col grid */}
        <div className="grid gap-[3px]" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {show.map((occ) => (
            <OccasionFilterCard
              key={occ.slug}
              occ={occ}
              active={activeOccasion === occ.slug}
              onClick={() =>
                onOccasionClick(activeOccasion === occ.slug ? null : occ.slug)
              }
            />
          ))}
        </div>

        {/* Active filter pill */}
        {activeOccasion && (
          <div className="flex justify-center mt-5">
            <span className="inline-flex items-center gap-2 bg-[#3B5373] text-white text-[11px] tracking-[0.15em] uppercase px-4 py-2 rounded-full">
              {occasions.find((o) => o.slug === activeOccasion)?.title ?? activeOccasion}
              <button
                onClick={() => onOccasionClick(null)}
                className="opacity-70 hover:opacity-100 text-sm leading-none"
              >
                ✕
              </button>
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
