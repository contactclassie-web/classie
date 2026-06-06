"use client";

import Link from "next/link";
// Using plain img to avoid next/image caching delays

interface Occasion {
  title: string;
  href: string;
  image: string;
  tag_label?: string;
  image_position?: string;
}

const toTitleCase = (str: string) =>
  str.replace(/\b\w/g, (c) => c.toUpperCase());

function OccasionCard({ occ, large }: { occ: Occasion; large: boolean }) {
  return (
    <Link
      href={occ.href}
      className="group absolute inset-0 overflow-hidden"
    >
      {/* Background image */}
      {occ.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={occ.image}
          alt={occ.title}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.06] group-hover:brightness-75"
          style={{ objectPosition: occ.image_position ?? "top" }}
        />
      ) : (
        <div className="absolute inset-0 bg-[#1a1a1a]" />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, transparent 38%, rgba(26,26,26,0.7) 100%)",
        }}
      />

      {/* Bottom-left text */}
      <div className="absolute bottom-0 left-0 p-6 pb-7">
        <p
          className="mb-2 occ-tag"
          style={{
            fontFamily: "var(--font-poppins)",
            fontSize: "9px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          {occ.tag_label || "Collection"}
        </p>
        <h3
          className="mb-3 leading-none"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: large ? "36px" : "24px",
            fontWeight: 300,
            color: "white",
            lineHeight: 1.1,
          }}
        >
          {toTitleCase(occ.title)}
        </h3>
        <span
          className="inline-block text-xs tracking-wide border-b transition-all duration-300 group-hover:text-white group-hover:pr-1"
          style={{
            color: "rgba(255,255,255,0.65)",
            borderColor: "currentColor",
            paddingBottom: "2px",
          }}
        >
          Shop Now →
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
  // Show all occasions that have an image, up to 5
  const displayItems = occasions.filter((o) => o.image).slice(0, 5);

  if (displayItems.length === 0) return null;

  // 5 items → full magazine: 1 big left (spans 2 rows) + 2x2 right
  if (displayItems.length === 5) {
    return (
      <>
        <div
          className="hidden md:grid"
          style={{
            gridTemplateColumns: "1.65fr 1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            height: "580px",
            gap: "3px",
          }}
        >
          {/* Big left: col 1, rows 1-2 */}
          <div style={{ gridColumn: "1/2", gridRow: "1/3", position: "relative" }}>
            <OccasionCard occ={displayItems[0]} large={true} />
          </div>
          {/* Top right: col 2 row 1, col 3 row 1 */}
          <div style={{ gridColumn: "2/3", gridRow: "1/2", position: "relative" }}>
            <OccasionCard occ={displayItems[1]} large={false} />
          </div>
          <div style={{ gridColumn: "3/4", gridRow: "1/2", position: "relative" }}>
            <OccasionCard occ={displayItems[2]} large={false} />
          </div>
          {/* Bottom right: col 2 row 2, col 3 row 2 */}
          <div style={{ gridColumn: "2/3", gridRow: "2/3", position: "relative" }}>
            <OccasionCard occ={displayItems[3]} large={false} />
          </div>
          <div style={{ gridColumn: "3/4", gridRow: "2/3", position: "relative" }}>
            <OccasionCard occ={displayItems[4]} large={false} />
          </div>
        </div>
        <div className="flex flex-col gap-[3px] md:hidden">
          {displayItems.map((occ) => (
            <div key={occ.href} className="relative" style={{ height: "220px" }}>
              <OccasionCard occ={occ} large={false} />
            </div>
          ))}
        </div>
      </>
    );
  }

  // 4 items → 1 big left + 2 top-right + 1 wide bottom-right
  if (displayItems.length === 4) {
    return (
      <>
        <div
          className="hidden md:grid"
          style={{
            gridTemplateColumns: "1.65fr 1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            height: "580px",
            gap: "3px",
          }}
        >
          {/* Date Edit: col 1, rows 1-2 */}
          <div style={{ gridColumn: "1/2", gridRow: "1/3", position: "relative" }}>
            <OccasionCard occ={displayItems[0]} large={true} />
          </div>
          {/* Everyday Edit: col 2, row 1 */}
          <div style={{ gridColumn: "2/3", gridRow: "1/2", position: "relative" }}>
            <OccasionCard occ={displayItems[1]} large={false} />
          </div>
          {/* Festive Edit: col 3, row 1 */}
          <div style={{ gridColumn: "3/4", gridRow: "1/2", position: "relative" }}>
            <OccasionCard occ={displayItems[2]} large={false} />
          </div>
          {/* 4th card: wide — spans cols 2-3, row 2 */}
          <div style={{ gridColumn: "2/4", gridRow: "2/3", position: "relative" }}>
            <OccasionCard occ={displayItems[3]} large={false} />
          </div>
        </div>
        <div className="flex flex-col gap-[3px] md:hidden">
          {displayItems.map((occ) => (
            <div key={occ.href} className="relative" style={{ height: "220px" }}>
              <OccasionCard occ={occ} large={false} />
            </div>
          ))}
        </div>
      </>
    );
  }

  // 3 items → 1 big left + 2 stacked right
  if (displayItems.length === 3) {
    return (
      <>
        <div
          className="hidden md:grid"
          style={{
            gridTemplateColumns: "1.65fr 1fr",
            gridTemplateRows: "1fr 1fr",
            height: "580px",
            gap: "3px",
          }}
        >
          <div style={{ gridRow: "1 / 3", position: "relative" }}>
            <OccasionCard occ={displayItems[0]} large={true} />
          </div>
          <div className="relative"><OccasionCard occ={displayItems[1]} large={false} /></div>
          <div className="relative"><OccasionCard occ={displayItems[2]} large={false} /></div>
        </div>
        <div className="flex flex-col gap-[3px] md:hidden">
          {displayItems.map((occ) => (
            <div key={occ.href} className="relative" style={{ height: "220px" }}>
              <OccasionCard occ={occ} large={false} />
            </div>
          ))}
        </div>
      </>
    );
  }

  // 1–2 items → simple full-width editorial cards
  return (
    <>
      <div
        className="hidden md:grid gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${displayItems.length}, 1fr)`, height: "480px" }}
      >
        {displayItems.map((occ) => (
          <div key={occ.href} className="relative">
            <OccasionCard occ={occ} large={true} />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-[3px] md:hidden">
        {displayItems.map((occ) => (
          <div key={occ.href} className="relative" style={{ height: "220px" }}>
            <OccasionCard occ={occ} large={false} />
          </div>
        ))}
      </div>
    </>
  );
}
