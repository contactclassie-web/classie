"use client";

import { useState, useEffect, useRef } from "react";

interface Slide {
  image_url: string;
}

function isVideo(url: string) {
  return (
    url.includes(".mp4") ||
    url.includes(".webm") ||
    url.includes(".ogg") ||
    url.includes("video/upload")
  );
}

export default function HeroImageSlider({
  slides,
  fallbackUrl,
}: {
  slides: Slide[];
  fallbackUrl: string;
}) {
  const items =
    slides.length > 0
      ? slides.map((s) => s.image_url).filter(Boolean)
      : fallbackUrl
      ? [fallbackUrl]
      : [];

  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (items.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  if (items.length === 0) return <div className="absolute inset-0 bg-[#F9F9F9]" />;

  return (
    <>
      {items.map((src, i) =>
        isVideo(src) ? (
          <video
            key={i}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover object-top"
            style={{
              opacity: i === current ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
            }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt="Classie"
            className="absolute inset-0 w-full h-full object-cover object-top"
            style={{
              opacity: i === current ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
            }}
          />
        )
      )}

      {/* Dot indicators */}
      {items.length > 1 && (
        <div
          className="absolute bottom-5 left-1/2 flex gap-1.5 z-10"
          style={{ transform: "translateX(-50%)" }}
        >
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? "20px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background:
                  i === current ? "#3B5373" : "rgba(59,83,115,0.35)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
