"use client";
import { useEffect, useState } from "react";

export interface TestimonialItem {
  quote: string;
  author: string;
}

interface Props {
  items: TestimonialItem[];
  intervalMs?: number; // default 5000
}

export default function TestimonialCarousel({ items, intervalMs = 5000 }: Props) {
  const [active, setActive] = useState(0);
  const valid = items.filter(i => i.quote?.trim());

  useEffect(() => {
    if (valid.length <= 1) return;
    const id = setInterval(() => setActive(p => (p + 1) % valid.length), intervalMs);
    return () => clearInterval(id);
  }, [valid.length, intervalMs]);

  if (!valid.length) return null;

  const cur = valid[active];

  return (
    <section className="bg-[#faf9f7] border-t border-[#e8e0d5] py-20 text-center">
      <div className="max-w-[560px] mx-auto px-6">
        <p className="font-serif text-[56px] text-[#e8e0d5] leading-[0.5] mb-5">&ldquo;</p>
        <p className="text-[#3B5373] text-sm tracking-[3px] mb-5">★★★★★</p>

        {/* Animated quote */}
        <div className="min-h-[96px] flex items-center justify-center">
          <p
            key={active}
            className="font-serif text-[21px] italic text-[#1a1a1a] leading-[1.55] mb-4 font-light animate-fade-in"
          >
            {cur.quote}
          </p>
        </div>

        {cur.author && (
          <p className="text-[10px] tracking-[0.18em] uppercase text-gray-400 mt-1">{cur.author}</p>
        )}

        {/* Dots */}
        {valid.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {valid.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? "bg-[#3B5373] w-4" : "bg-[#ccc]"
                }`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
