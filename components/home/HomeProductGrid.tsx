"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { optimizeCloudinary } from "@/lib/cloudinary";
import type { Product } from "@/lib/products";

interface Props {
  products: Product[];
  // product slug → { colour name (lowercase) → hex } from product_color_variants
  colors?: Record<string, Record<string, string>>;
}

function QuickCard({ p, colors }: { p: Product; colors?: Record<string, string> }) {
  const { addToCart } = useCart();
  const [choosing, setChoosing] = useState(false);
  const [added, setAdded] = useState(false);
  const options = p.variants?.options ?? [];
  const second = (p.images ?? []).find((u) => u && u !== p.image);
  const off = p.comparePrice > p.price ? Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100) : 0;

  const add = (variant?: string) => {
    addToCart({ slug: p.slug, title: p.title, price: p.price, image: p.image, quantity: 1, variant });
    setChoosing(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };
  const onAdd = () => {
    if (options.length > 1) { setChoosing((c) => !c); return; }
    add(options[0]);
  };

  const dots = options
    .map((o) => colors?.[o.toLowerCase()])
    .filter((h): h is string => !!h);

  return (
    <div className="group grid gap-1.5 content-start">
      <div className="relative bg-[#f6f6f6] overflow-hidden">
        <Link href={`/products/${p.slug}`} aria-label={p.title} className="block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={optimizeCloudinary(p.image, 600)} alt={p.title} loading="lazy" decoding="async"
            className="w-full aspect-square object-cover" />
          {second && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={optimizeCloudinary(second, 600)} alt="" loading="lazy" decoding="async"
              className="hidden md:block absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </Link>
        {choosing && (
          <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-2.5 grid gap-2 border-t border-[#ECEAE6]">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] tracking-[0.12em] uppercase text-[#6b6b6b]">
                {p.variants.type === "size" ? "Choose size" : "Choose colour"}
              </span>
              <button type="button" onClick={() => setChoosing(false)} aria-label="Close" className="text-[#6b6b6b] text-sm leading-none px-1">✕</button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {options.map((o) => (
                <button key={o} type="button" onClick={() => add(o)}
                  className="flex items-center gap-1.5 border border-[#d9d6d0] bg-white px-2.5 py-1.5 text-[11px] capitalize hover:border-[#3B5373] hover:text-[#3B5373]">
                  {colors?.[o.toLowerCase()] && <i className="w-2.5 h-2.5 rounded-full border border-black/15" style={{ background: colors[o.toLowerCase()] }} />}
                  {o}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <Link href={`/products/${p.slug}`} className="font-sans text-[12.5px] md:text-[13.5px] leading-snug text-[#1a1a1a] line-clamp-2 min-h-[2.7em]">
        {p.title}
      </Link>
      <div className="flex items-center justify-between gap-2">
        <span className="font-sans text-[13.5px] font-semibold text-[#1a1a1a] tabular-nums">
          ₹{p.price.toLocaleString("en-IN")}
          {off > 0 && (
            <span className="ml-1.5 font-normal text-[11px] text-[#9a9a9a] line-through">₹{p.comparePrice.toLocaleString("en-IN")}</span>
          )}
        </span>
        {dots.length > 0 && (
          <span className="flex items-center gap-[3px]">
            {dots.slice(0, 4).map((h, i) => <i key={i} className="w-[11px] h-[11px] rounded-full border border-black/15" style={{ background: h }} />)}
            {dots.length > 4 && <span className="text-[10px] text-[#6b6b6b] ml-0.5">+{dots.length - 4}</span>}
          </span>
        )}
      </div>
      <button type="button" onClick={onAdd}
        className={`w-full border text-[10.5px] font-semibold tracking-[0.12em] uppercase py-2.5 transition-colors ${added ? "border-[#1E7A4C] bg-[#1E7A4C] text-white" : "border-[#3B5373] text-[#3B5373] hover:bg-[#3B5373] hover:text-white"}`}>
        {added ? "✓ Added to cart" : "+ Add"}
      </button>
    </div>
  );
}

export default function HomeProductGrid({ products, colors }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-2.5 gap-y-5 md:gap-x-6 md:gap-y-9">
      {products.map((p) => <QuickCard key={p.slug} p={p} colors={colors?.[p.slug]} />)}
    </div>
  );
}
