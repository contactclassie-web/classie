"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { products } from "@/lib/products";

const slides = [
  {
    id: 1,
    bg: "#2d3748",
    textAlign: "left" as const,
    overlay: "bg-gradient-to-r from-black/70 via-black/40 to-transparent",
    eyebrow: "New Collection 2025",
    heading: "ONE HEEL,\nENDLESS\nLOOKS",
    sub: "Crafted for comfort. Styled for impact.",
    cta: { label: "SHOP NOW", href: "/shop/heels", ghost: true },
    image: products[0].image,
  },
  {
    id: 2,
    bg: "#e8e4de",
    textAlign: "center" as const,
    overlay: "bg-gradient-to-t from-white/30 via-white/10 to-transparent",
    eyebrow: "Clip-ons Collection",
    heading: "MULTI-STYLE\nCLIP-ONS",
    sub: "Transform any heel in seconds — your style, your rules.",
    cta: { label: "EXPLORE CLIP-ONS", href: "/shop/clips", ghost: false },
    image: products.find((p) => p.collection === "clips")!.image,
  },
];

export default function HeroSlider() {
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

  const prev = () => go((current - 1 + slides.length) % slides.length);
  const next = useCallback(() => go((current + 1) % slides.length), [current, go]);

  // Auto-advance
  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative w-full min-h-[85vh] md:min-h-[90vh] overflow-hidden" style={{ background: slide.bg }}>
      {/* Background image */}
      <div key={slide.id} className="absolute inset-0 hero-slide">
        <Image
          src={slide.image}
          alt={slide.heading}
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div className={`absolute inset-0 ${slide.overlay}`} />
      </div>

      {/* Content */}
      <div
        className={`relative h-full min-h-[85vh] md:min-h-[90vh] flex items-center max-w-7xl mx-auto px-6 sm:px-10 ${
          slide.textAlign === "center" ? "justify-center" : "justify-start"
        }`}
      >
        <div
          className={`max-w-xl ${slide.textAlign === "center" ? "text-center" : "text-left"} hero-slide`}
          key={`content-${slide.id}`}
        >
          <p
            className="text-[11px] tracking-[0.5em] uppercase mb-5 font-medium"
            style={{ color: slide.textAlign === "center" ? "#3D4F5F" : "rgba(255,255,255,0.75)" }}
          >
            {slide.eyebrow}
          </p>
          <h1
            className="font-serif leading-[1.0] mb-6 whitespace-pre-line"
            style={{
              fontSize: "clamp(3rem, 8vw, 6rem)",
              color: slide.textAlign === "center" ? "#1a1a1a" : "#ffffff",
            }}
          >
            {slide.heading}
          </h1>
          <p
            className="text-base md:text-lg mb-10 max-w-md leading-relaxed"
            style={{ color: slide.textAlign === "center" ? "#3D4F5F" : "rgba(255,255,255,0.80)" }}
          >
            {slide.sub}
          </p>
          <Link
            href={slide.cta.href}
            className={slide.cta.ghost ? "btn-ghost-white" : "btn-primary"}
          >
            {slide.cta.label}
          </Link>
        </div>
      </div>

      {/* Prev / Next arrows */}
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

      {/* Dot indicators */}
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
    </section>
  );
}
