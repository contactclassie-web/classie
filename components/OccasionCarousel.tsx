"use client";

import Link from "next/link";
import Image from "next/image";

interface Occasion {
  title: string;
  href: string;
  image: string;
  tag_label?: string;
}

const toTitleCase = (str: string) =>
  str.replace(/\b\w/g, (c) => c.toUpperCase());

function OccasionCard({ occ, large }: { occ: Occasion; large: boolean }) {
  return (
    <Link
      href={occ.href}
      className="group relative overflow-hidden block w-full h-full"
    >
      {/* Background image */}
      {occ.image ? (
        <Image
          src={occ.image}
          alt={occ.title}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-[1.06] group-hover:brightness-75"
          sizes={large ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 100vw, 20vw"}
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
            gridTemplateColumns: "1.65fr 1fr",
            gridTemplateRows: "1fr 1fr",
            height: "580px",
            gap: "3px",
          }}
        >
          <div style={{ gridRow: "1 / 3", position: "relative" }}>
            <OccasionCard occ={displayItems[0]} large={true} />
          </div>
          {displayItems.slice(1, 5).map((occ) => (
            <div key={occ.href} className="relative">
              <OccasionCard occ={occ} large={false} />
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

  // 3–4 items → 1 big left + rest stacked right
  if (displayItems.length >= 3) {
    const rightItems = displayItems.slice(1);
    return (
      <>
        <div
          className="hidden md:grid"
          style={{
            gridTemplateColumns: "1.65fr 1fr",
            gridTemplateRows: `repeat(${rightItems.length}, 1fr)`,
            height: "580px",
            gap: "3px",
          }}
        >
          <div style={{ gridRow: `1 / ${rightItems.length + 1}`, position: "relative" }}>
            <OccasionCard occ={displayItems[0]} large={true} />
          </div>
          {rightItems.map((occ) => (
            <div key={occ.href} className="relative">
              <OccasionCard occ={occ} large={false} />
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
