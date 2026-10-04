"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { optimizeCloudinary } from "@/lib/cloudinary";
import type { HomeConfig, HeroSlide } from "@/lib/homeConfig";

interface Props {
  hero: HomeConfig["hero"];
  // Photos from Admin → Homepage → Hero, used for image slides left empty.
  fallbackImages: string[];
}

// Image slides with no URL borrow the next photo from the old Hero tab; slides
// that still have nothing to show are dropped so the slider never shows a blank.
function resolveSlides(slides: HeroSlide[], fallback: string[]): HeroSlide[] {
  const pool = [...fallback];
  const out: HeroSlide[] = [];
  for (const s of slides) {
    if (s.type === "beforeafter") {
      if (s.before && s.after) out.push(s);
    } else if (s.type === "video") {
      if (s.url) out.push(s);
    } else {
      const url = s.url || pool.shift() || "";
      if (url) out.push({ ...s, url });
    }
  }
  return out;
}

export default function HomeHero({ hero, fallbackImages }: Props) {
  const slides = resolveSlides(hero.slides, fallbackImages);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const touchX = useRef<number | null>(null);
  const count = slides.length;

  const go = useCallback((n: number) => setIdx((n + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      if (document.visibilityState === "visible") setIdx((i) => (i + 1) % count);
    }, hero.intervalSec * 1000);
    return () => clearInterval(t);
  }, [count, paused, hero.intervalSec]);

  // Only the visible video plays; the rest stay paused to save data.
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === idx) { v.play().catch(() => {}); } else { v.pause(); }
    });
  }, [idx]);

  return (
    <section className="bg-[#F7F4EF] md:grid md:grid-cols-12 md:items-center">
      {/* Media */}
      <div
        className="relative md:col-span-7 md:order-2"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
          touchX.current = null;
        }}
      >
        <div className="relative w-full aspect-[3/2] overflow-hidden bg-[#efe9e1]">
          {slides.map((s, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? "opacity-100 z-[1]" : "opacity-0 z-0"}`}
              aria-hidden={i !== idx}
            >
              {s.type === "beforeafter" && (
                <div className="grid grid-cols-2 gap-[3px] h-full">
                  {[{ src: s.before, label: s.beforeLabel, on: false }, { src: s.after, label: s.afterLabel, on: true }].map((h, k) => (
                    <figure key={k} className="relative m-0 h-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={optimizeCloudinary(h.src, 900)}
                        alt={h.label || (h.on ? "With clip" : "Without clip")}
                        className="w-full h-full object-cover"
                        loading={i === 0 ? "eager" : "lazy"}
                      />
                      {h.label && (
                        <figcaption className={`absolute left-2 bottom-2 md:left-3 md:bottom-3 text-[9.5px] md:text-[10px] tracking-[0.12em] uppercase px-2 py-1.5 ${h.on ? "bg-[#3B5373] text-white" : "bg-white/90 text-[#1a1a1a]"}`}>
                          {h.label}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white text-[#3B5373] font-serif text-2xl leading-9 md:leading-[44px] text-center shadow-md" aria-hidden>+</span>
                </div>
              )}
              {s.type === "image" && (() => {
                const img = (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={optimizeCloudinary(s.url, 1400)}
                    alt=""
                    className="w-full h-full object-cover"
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                );
                return s.link ? <Link href={s.link} tabIndex={i === idx ? 0 : -1}>{img}</Link> : img;
              })()}
              {s.type === "video" && (
                <video
                  ref={(el) => { videoRefs.current[i] = el; }}
                  src={s.url}
                  poster={s.poster ? optimizeCloudinary(s.poster, 1400) : undefined}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  autoPlay={i === 0}
                  preload={i === 0 ? "auto" : "none"}
                />
              )}
            </div>
          ))}

          {count > 1 && (
            <>
              <button type="button" aria-label="Previous slide" onClick={() => go(idx - 1)}
                className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-[2] w-9 h-9 rounded-full bg-white/85 items-center justify-center text-[#1a1a1a] hover:bg-white">‹</button>
              <button type="button" aria-label="Next slide" onClick={() => go(idx + 1)}
                className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-[2] w-9 h-9 rounded-full bg-white/85 items-center justify-center text-[#1a1a1a] hover:bg-white">›</button>
            </>
          )}
        </div>
        {count > 1 && (
          <div className="flex justify-center gap-2 py-3 md:absolute md:bottom-3 md:right-5 md:z-[2] md:py-0">
            {slides.map((_, i) => (
              <button key={i} type="button" aria-label={`Slide ${i + 1}`} onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all ${i === idx ? "w-6 bg-[#3B5373]" : "w-1.5 bg-[#3B5373]/30"}`} />
            ))}
          </div>
        )}
      </div>

      {/* Text */}
      <div className="md:col-span-5 md:order-1 px-5 pt-2 pb-8 md:px-14 md:py-12 grid gap-3 md:gap-5">
        {hero.eyebrow && (
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#3B5373]">{hero.eyebrow}</span>
        )}
        <h1 className="font-serif font-light text-[40px] leading-[1.02] md:text-[clamp(3rem,5vw,4.75rem)] text-[#1a1a1a]">
          {hero.title1}
          {(hero.titleItalic || hero.title2) && <br />}
          {hero.titleItalic && <em className="italic text-[#3B5373]">{hero.titleItalic}</em>} {hero.title2}
        </h1>
        {hero.subtitle && <p className="font-sans text-[13.5px] md:text-[15px] text-[#4a4a4a] leading-relaxed max-w-[44ch]">{hero.subtitle}</p>}
        <div className="flex flex-wrap gap-2 mt-1">
          {hero.cta1Text && (
            <Link href={hero.cta1Url || "/shop/clips"} className="inline-flex items-center bg-[#3B5373] text-white text-[11px] tracking-[0.16em] uppercase px-5 py-3.5 hover:bg-[#2a3d55] transition-colors">
              {hero.cta1Text}
            </Link>
          )}
          {hero.cta2Text && (
            <Link href={hero.cta2Url || "/shop/heels"} className="inline-flex items-center border border-[#3B5373] text-[#3B5373] text-[11px] tracking-[0.16em] uppercase px-5 py-3.5 hover:bg-[#3B5373] hover:text-white transition-colors">
              {hero.cta2Text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
