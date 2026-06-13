"use client";

import Link from "next/link";
import { useRef } from "react";

interface Occasion {
  title: string;
  href: string;
  image: string;
  tag_label?: string;
  image_position?: string;
}

const toTitleCase = (str: string) => str.replace(/\b\w/g, (c) => c.toUpperCase());

function OccasionCard({ occ }: { occ: Occasion }) {
  return (
    <Link href={occ.href} className="group relative overflow-hidden block flex-shrink-0"
      style={{ aspectRatio: "3 / 4", maxHeight: "520px" }}>
      {occ.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={occ.image} alt={occ.title}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.06] group-hover:brightness-75"
          style={{ objectPosition: occ.image_position ?? "50% 50%" }} />
      ) : (
        <div className="absolute inset-0 bg-[#c8d6e5]" />
      )}
      <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, transparent 38%, rgba(26,26,26,0.75) 100%)" }} />
      <div className="absolute bottom-0 left-0 p-6 pb-7">
        <p style={{ fontFamily: "var(--font-poppins)", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: "8px" }}>
          {occ.tag_label || "For Her"}
        </p>
        <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "26px", fontWeight: 300, color: "white", lineHeight: 1.1, marginBottom: "12px" }}>
          {toTitleCase(occ.title)}
        </h3>
        <span className="inline-flex items-center gap-1 text-xs tracking-wide transition-all duration-300 group-hover:text-white group-hover:gap-2"
          style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", letterSpacing: "0.1em" }}>
          Shop Now
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </span>
      </div>
    </Link>
  );
}

export default function OccasionCarousel({ occasions }: { occasions: Occasion[] }) {
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef  = useRef<HTMLDivElement>(null);
  const allItems = occasions.filter((o) => o.image);
  const show3 = allItems.slice(0, 3);
  const hasMore = allItems.length > 3;

  if (show3.length === 0) return null;

  const scroll = (dir: "left" | "right", ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return;
    const w = ref.current.clientWidth / (hasMore ? 1 : 3);
    ref.current.scrollBy({ left: dir === "left" ? -w : w, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Desktop: 3 equal columns (no scroll needed for ≤3), scrollable for >3 */}
      {!hasMore ? (
        <div className="hidden md:grid gap-[3px]" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {show3.map((occ) => <OccasionCard key={occ.href} occ={occ} />)}
        </div>
      ) : (
        <>
          {/* Arrow button LEFT */}
          <button onClick={() => scroll("left", desktopRef)}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full items-center justify-center shadow-md hover:bg-[#3B5373] hover:text-white hover:border-[#3B5373] transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          {/* Scrollable desktop */}
          <div ref={desktopRef} className="hidden md:flex gap-[3px] overflow-x-auto snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
            {allItems.map((occ) => (
              <div key={occ.href} className="snap-start flex-shrink-0" style={{ width: "calc(33.333% - 2px)" }}>
                <OccasionCard occ={occ} />
              </div>
            ))}
          </div>
          {/* Arrow button RIGHT */}
          <button onClick={() => scroll("right", desktopRef)}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full items-center justify-center shadow-md hover:bg-[#3B5373] hover:text-white hover:border-[#3B5373] transition-all">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </>
      )}

      {/* Mobile: horizontal scroll with arrows */}
      <div className="md:hidden relative">
        {hasMore && (
          <button onClick={() => scroll("left", mobileRef)}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        )}
        <div ref={mobileRef} className="flex gap-2 overflow-x-auto snap-x snap-mandatory pb-2" style={{ scrollbarWidth: "none" }}>
          {allItems.map((occ) => (
            <div key={occ.href} className="snap-start flex-shrink-0" style={{ width: show3.length === 1 ? "100%" : "82vw" }}>
              <OccasionCard occ={occ} />
            </div>
          ))}
        </div>
        {hasMore && (
          <button onClick={() => scroll("right", mobileRef)}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        )}
      </div>
    </div>
  );
}
