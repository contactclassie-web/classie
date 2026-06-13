"use client";

import Link from "next/link";

interface Occasion {
  title: string;
  href: string;
  image: string;
  tag_label?: string;
  image_position?: string;
}

const toTitleCase = (str: string) =>
  str.replace(/\b\w/g, (c) => c.toUpperCase());

function OccasionCard({ occ }: { occ: Occasion }) {
  return (
    <Link
      href={occ.href}
      className="group relative overflow-hidden block"
      style={{ aspectRatio: "3 / 4" }}
    >
      {/* Background image */}
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

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, transparent 38%, rgba(26,26,26,0.75) 100%)",
        }}
      />

      {/* Bottom-left text */}
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
          {toTitleCase(occ.title)}
        </h3>
        <span
          className="inline-flex items-center gap-1 text-xs tracking-wide transition-all duration-300 group-hover:text-white group-hover:gap-2"
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "11px",
            letterSpacing: "0.1em",
          }}
        >
          Shop Now
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default function OccasionCarousel({
  occasions,
}: {
  occasions: Occasion[];
}) {
  // Always show exactly 3 cards — match HTML design
  const displayItems = occasions.filter((o) => o.image).slice(0, 3);

  if (displayItems.length === 0) return null;

  return (
    <>
      {/* Desktop: 3 equal columns */}
      <div
        className="hidden md:grid gap-[3px]"
        style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
      >
        {displayItems.map((occ) => (
          <OccasionCard key={occ.href} occ={occ} />
        ))}
      </div>

      {/* Mobile: stacked */}
      <div className="flex flex-col gap-[3px] md:hidden">
        {displayItems.map((occ) => (
          <div key={occ.href} className="relative" style={{ height: "260px" }}>
            <div className="absolute inset-0">
              <OccasionCard occ={occ} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
