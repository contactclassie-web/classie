"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface Slide {
  image_url: string;
  title?: string;
}

export default function HeroImageSlider({ slides, fallbackUrl }: { slides: Slide[]; fallbackUrl: string }) {
  const images = slides.length > 0 ? slides.map(s => s.image_url).filter(Boolean) : [fallbackUrl].filter(Boolean);
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % images.length);
        setFading(false);
      }, 500);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) return <div className="absolute inset-0 bg-[#F9F9F9]" />;

  return (
    <>
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt="Classie"
          fill
          priority={i === 0}
          className="object-cover object-top transition-opacity duration-500"
          style={{ opacity: i === current ? (fading ? 0 : 1) : 0 }}
          sizes="46vw"
        />
      ))}
      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="transition-all duration-300"
              style={{
                width: i === current ? "20px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: i === current ? "#3B5373" : "rgba(59,83,115,0.3)",
                border: "none",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}
