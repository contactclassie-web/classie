// ── Pure Server Component — no "use client", no hydration flash ──────────────

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
  const hasMedia = hero.bgType !== "none";

  const textAlignClass =
    hero.textPos === "left" ? "items-start text-left" :
    hero.textPos === "right" ? "items-end text-right" :
    "items-center text-center";

  const textContent = (dark = false) => (
    <div className={`flex flex-col ${textAlignClass} ${hero.textPos === "center" ? "max-w-2xl mx-auto" : "max-w-xl"}`}>
      {hero.eyebrow && (
        <p className={`text-[10px] tracking-[0.55em] uppercase mb-4 ${dark ? "text-white/70" : "text-[#888]"}`}>
          {hero.eyebrow}
        </p>
      )}
      <h1 className={`font-serif text-5xl md:text-6xl leading-tight mb-4 ${dark ? "text-white" : "text-[#1a1a1a]"}`}>
        {hero.title}
        {hero.titleItalic && (
          <>
            <br />
            <em className={`italic ${dark ? "text-white" : "text-[#3B5373]"}`}>{hero.titleItalic}</em>
          </>
        )}
      </h1>
      {hero.subtitle && (
        <p className={`text-sm leading-relaxed mt-1 max-w-md ${dark ? "text-white/75" : "text-[#888]"}`}>
          {hero.subtitle}
        </p>
      )}
      {hero.showStats && (
        <div className="flex gap-8 mt-8 flex-wrap">
          {[
            { val: hero.stat1Val, label: hero.stat1Label },
            { val: hero.stat2Val, label: hero.stat2Label },
            { val: hero.stat3Val, label: hero.stat3Label },
          ].filter(s => s.val || s.label).map((s, i) => (
            <div key={i} className="flex flex-col">
              <span className={`font-serif text-3xl font-semibold ${dark ? "text-white" : "text-[#3B5373]"}`}>{s.val}</span>
              <span className={`text-[10px] uppercase tracking-widest mt-1 ${dark ? "text-white/60" : "text-[#888]"}`}>{s.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ── Plain Color hero (cream background, no media)
  if (!hasMedia) {
    return (
      <div className="bg-[#faf8f6] border-b border-[#e8e4de] py-16 px-6">
        {textContent(false)}
      </div>
    );
  }

  // ── Video hero
  if (hero.bgType === "video" && hero.bgUrl) {
    return (
      <div className="relative w-full overflow-hidden" style={{ minHeight: "60vh", height: "70vh" }}>
        <video
          src={hero.bgUrl}
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className={`relative z-10 h-full flex flex-col justify-center px-8 md:px-16 ${textAlignClass}`}>
          {textContent(true)}
        </div>
      </div>
    );
  }

  // ── Single Image hero
  if (hero.bgType === "image" && hero.bgUrl) {
    return (
      <div className="relative w-full overflow-hidden" style={{ minHeight: "60vh", height: "70vh" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero.bgUrl}
          alt="Style Ideas Hero"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className={`relative z-10 h-full flex flex-col justify-center px-8 md:px-16 ${textAlignClass}`}>
          {textContent(true)}
        </div>
      </div>
    );
  }

  // ── CSS Image Slider (no JS, no hydration)
  if (hero.bgType === "slider" && hero.slides.length > 0) {
    const count = hero.slides.length;
    const duration = count * 4; // 4s per slide

    return (
      <div className="relative w-full overflow-hidden" style={{ minHeight: "60vh", height: "70vh" }}>
        {/* CSS keyframe per slide */}
        <style>{`
          @keyframes si-fade {
            0%, ${(100 / count).toFixed(1)}% { opacity: 1; }
            ${((100 / count) + 5).toFixed(1)}%, 100% { opacity: 0; }
          }
        `}</style>

        {hero.slides.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt={`Slide ${i + 1}`}
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{
              animation: `si-fade ${duration}s ease-in-out infinite`,
              animationDelay: `${i * 4}s`,
              opacity: i === 0 ? 1 : 0,
            }}
          />
        ))}

        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className={`relative z-10 h-full flex flex-col justify-center px-8 md:px-16 ${textAlignClass}`}>
          {textContent(true)}
        </div>
      </div>
    );
  }

  // ── Fallback: cream strip
  return (
    <div className="bg-[#faf8f6] border-b border-[#e8e4de] py-16 px-6">
      {textContent(false)}
    </div>
  );
}
