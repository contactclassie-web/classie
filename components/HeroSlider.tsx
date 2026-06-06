"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type HeroSlide } from "@/lib/slides";

interface HeroSliderProps {
  slides: HeroSlide[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const go = useCallback(
    (idx: number) => {
      if (animating) return;
      setAnimating(true);
      setCurrent(idx);
      setTimeout(() => setAnimating(false), 650);
    },
    [animating]
  );

  const next = useCallback(
    () => go((current + 1) % Math.max(slides.length, 1)),
    [current, slides.length, go]
  );

  const prev = () => go((current - 1 + slides.length) % Math.max(slides.length, 1));

  // Auto-advance every 5s
  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, slides.length]);

  if (!slides || slides.length === 0) return null;

  const slide = slides[current];
  const isCenter = slide.text_align === "center";
  const hasMedia = !!(slide.video_url || slide.image_url);
  // When no media + center + light bg_color → dark text; otherwise white text
  const useDarkText = isCenter && !hasMedia && isLightColor(slide.bg_color ?? "#3D4F5F");

  const overlay = isCenter
    ? "bg-gradient-to-t from-white/30 via-white/10 to-transparent"
    : "bg-gradient-to-r from-black/70 via-black/40 to-transparent";

  return (
    <section
      className="relative w-full min-h-[85vh] md:min-h-[90vh] overflow-hidden"
      style={{ background: slide.bg_color ?? "#3D4F5F" }}
    >
      {/* ── Background: Video → Image → solid color ── */}
      <div key={slide.id} className="absolute inset-0 hero-slide">
        {slide.video_url ? (
          <>
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover object-center"
            >
              <source src={slide.video_url} />
            </video>
            <div className={`absolute inset-0 ${overlay}`} />
          </>
        ) : slide.image_url ? (
          <>
            <Image
              src={slide.image_url}
              alt={slide.headline}
              fill
              className="object-cover object-center"
              sizes="100vw"
              priority
            />
            <div className={`absolute inset-0 ${overlay}`} />
          </>
        ) : null}
      </div>

      {/* ── Content ── */}
      <div
        className={`relative h-full min-h-[85vh] md:min-h-[90vh] flex items-center max-w-7xl mx-auto px-6 sm:px-10 ${
          isCenter ? "justify-center" : "justify-start"
        }`}
      >
        <div
          className={`max-w-xl ${isCenter ? "text-center" : "text-left"} hero-slide`}
          key={`content-${slide.id}`}
        >
          <h1
            className="font-serif leading-[1.0] mb-6 whitespace-pre-line"
            style={{
              fontSize: "clamp(3rem, 8vw, 6rem)",
              color: useDarkText ? "#1a1a1a" : "#ffffff",
            }}
          >
            {slide.headline}
          </h1>
          <p
            className="text-base md:text-lg mb-10 max-w-md leading-relaxed"
            style={{
              color: useDarkText ? "#3D4F5F" : "rgba(255,255,255,0.85)",
            }}
          >
            {slide.subheadline}
          </p>
          {slide.cta_text && slide.cta_url && (
            <Link
              href={slide.cta_url}
              className={useDarkText ? "btn-primary" : "btn-ghost-white"}
            >
              {slide.cta_text}
            </Link>
          )}
        </div>
      </div>

      {/* ── Arrows ── */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* ── Dots ── */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/** Returns true if a hex color is perceptually "light" */
function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length < 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 186;
}
