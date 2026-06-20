"use client";

import { useEffect, useState, useRef } from "react";

interface HeroConfig {
  bgType: "none" | "image" | "video" | "slider";
  bgUrl: string;
  slides: string[];
  textPos: "left" | "center" | "right";
  eyebrow: string;
  title: string;
  titleItalic: string;
  subtitle: string;
  showStats: boolean;
  stat1Val: string; stat1Label: string;
  stat2Val: string; stat2Label: string;
  stat3Val: string; stat3Label: string;
}

export default function StyleIdeasHero({ hero }: { hero: HeroConfig }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasMedia = hero.bgType !== "none";
  const isSlider = hero.bgType === "slider" && hero.slides.length > 1;

  // Auto-advance slider
  useEffect(() => {
    if (!isSlider) return;
    timerRef.current = setInterval(() => {
      setCurrentSlide((i) => (i + 1) % hero.slides.length);
    }, 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isSlider, hero.slides.length]);

  const textAlign = hero.textPos === "left"
    ? "items-start text-left"
    : hero.textPos === "right"
    ? "items-end text-right"
    : "items-center text-center";

  // ── No media: cream strip (Design A default)
  if (!hasMedia) {
    return (
      <div className="bg-[#faf8f6] border-b border-[#e8e4de]">
        <div className={`py-16 px-6 flex flex-col ${textAlign} max-w-3xl mx-auto`}>
          <p className="text-[10px] tracking-[0.55em] uppercase text-[#888] mb-4">{hero.eyebrow}</p>
          <h1 className="font-serif text-5xl md:text-6xl text-[#1a1a1a] leading-tight mb-4">
            {hero.title}
            {hero.titleItalic && (
              <>
                <br />
                <em className="italic text-[#3B5373]">{hero.titleItalic}</em>
              </>
            )}
          </h1>
          <p className="text-[#888] text-sm max-w-md mt-2 leading-relaxed">{hero.subtitle}</p>
          {hero.showStats && (
            <div className="flex gap-8 mt-8 flex-wrap">
              {[
                { val: hero.stat1Val, label: hero.stat1Label },
                { val: hero.stat2Val, label: hero.stat2Label },
                { val: hero.stat3Val, label: hero.stat3Label },
              ].filter(s => s.val || s.label).map((s, i) => (
                <div key={i} className="flex flex-col">
                  <span className="font-serif text-3xl text-[#3B5373] font-semibold">{s.val}</span>
                  <span className="text-[10px] uppercase tracking-widest text-[#888] mt-1">{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── With media: full-bleed hero
  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: "60vh", maxHeight: "85vh", height: "70vh" }}>
      {/* Background */}
      {hero.bgType === "image" && hero.bgUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={hero.bgUrl}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      )}
      {hero.bgType === "video" && hero.bgUrl && (
        <video
          src={hero.bgUrl}
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      )}
      {hero.bgType === "slider" && hero.slides.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={src}
          alt={`Slide ${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${i === currentSlide ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

      {/* Text */}
      <div className={`relative z-10 h-full flex flex-col justify-center px-8 md:px-16 ${textAlign}`}>
        <p className="text-[10px] tracking-[0.55em] uppercase text-white/70 mb-4">{hero.eyebrow}</p>
        <h1 className="font-serif text-5xl md:text-6xl text-white leading-tight mb-4">
          {hero.title}
          {hero.titleItalic && (
            <>
              <br />
              <em className="italic">{hero.titleItalic}</em>
            </>
          )}
        </h1>
        <p className="text-white/75 text-sm max-w-md mt-2 leading-relaxed">{hero.subtitle}</p>

        {hero.showStats && (
          <div className="flex gap-8 mt-8 flex-wrap">
            {[
              { val: hero.stat1Val, label: hero.stat1Label },
              { val: hero.stat2Val, label: hero.stat2Label },
              { val: hero.stat3Val, label: hero.stat3Label },
            ].filter(s => s.val || s.label).map((s, i) => (
              <div key={i} className="flex flex-col">
                <span className="font-serif text-3xl text-white font-semibold">{s.val}</span>
                <span className="text-[10px] uppercase tracking-widest text-white/60 mt-1">{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Slider dots */}
      {isSlider && (
        <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-10">
          {hero.slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-6 h-1 rounded-full transition-all ${i === currentSlide ? "bg-white w-8" : "bg-white/40"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
