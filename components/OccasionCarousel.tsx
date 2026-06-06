"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Occasion {
  title: string;
  href: string;
  image: string;
}

const toTitleCase = (str: string) =>
  str.replace(/\b\w/g, (c) => c.toUpperCase());

export default function OccasionCarousel({ occasions }: { occasions: Occasion[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    el?.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el?.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [occasions]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 260 : -260, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-8 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:border-[#3B5373] hover:text-[#3B5373] transition-all duration-200 -translate-x-1/2"
          aria-label="Scroll left"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-8 z-10 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:border-[#3B5373] hover:text-[#3B5373] transition-all duration-200 translate-x-1/2"
          aria-label="Scroll right"
        >
          <ChevronRight size={18} />
        </button>
      )}

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onScroll={checkScroll}
      >
        {occasions.map((occ) => (
          <Link
            key={occ.href}
            href={occ.href}
            className="group flex flex-col items-center gap-4 flex-shrink-0"
            style={{ width: "calc((100vw - 7rem) / 5)", maxWidth: "210px", minWidth: "130px" }}
          >
            <div
              className="relative rounded-full overflow-hidden ring-2 ring-gray-100 shadow-lg group-hover:shadow-2xl group-hover:ring-[#3B5373]/30 transition-all duration-500 w-full"
              style={{ aspectRatio: "1/1" }}
            >
              {occ.image ? (
                <Image
                  src={occ.image}
                  alt={occ.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 40vw, 210px"
                />
              ) : (
                <div className="w-full h-full bg-[#f0eef8] flex items-center justify-center">
                  <span className="font-serif text-3xl text-[#3B5373]/40">{occ.title.charAt(0)}</span>
                </div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#3B5373]/0 group-hover:bg-[#3B5373]/15 transition-all duration-500 rounded-full" />
            </div>
            <div className="text-center px-1">
              <span className="text-sm text-gray-700 group-hover:text-[#3B5373] transition-colors tracking-wide block leading-tight" style={{fontFamily:"'Poppins', sans-serif", fontWeight:300}}>
                {toTitleCase(occ.title)}
              </span>
              <span className="text-[10px] tracking-widest uppercase text-gray-400 mt-1 block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Shop Now →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
