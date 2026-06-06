"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface Slide {
  image_url: string;
  title?: string;
}

function isVideo(url: string) {
  return (
    url.includes(".mp4") ||
    url.includes(".webm") ||
    url.includes(".ogg") ||
    url.includes("video/upload") // Cloudinary video
  );
}

function SlideMedia({ src, active }: { src: string; active: boolean }) {
  if (isVideo(src)) {
    return (
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-500"
        style={{ opacity: active ? 1 : 0 }}
      />
    );
  }
  return (
    <Image
      src={src}
      alt="Classie"
      fill
      className="object-cover object-top transition-opacity duration-500"
      style={{ opacity: active ? 1 : 0 }}
      sizes="46vw"
    />
  );
}

export default function HeroImageSlider({
  slides,
  fallbackUrl,
}: {
  slides: Slide[];
  fallbackUrl: string;
}) {
  const items = slides.length > 0
    ? slides.map((s) => s.image_url).filter(Boolean)
    : [fallbackUrl].filter(Boolean);

  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % items.length);
        setFading(false);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (items.length === 0) return <div className="absolute inset-0 bg-[#F9F9F9]" />;

  return (
    <>
      {items.map((src, i) => (
        <SlideMedia key={src + i} src={src} active={i === current && !fading} />
      ))}

      {/* Dot indicators (only if multiple) */}
      {items.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? "20px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: i === current ? "#3B5373" : "rgba(59,83,115,0.35)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
