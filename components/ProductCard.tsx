"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const discount =
    product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : 0;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      {/* ── Image container — 4:5 editorial ratio */}
      <div
        className="relative overflow-hidden bg-[#faf8f6]"
        style={{ aspectRatio: "4/5" }}
      >
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* ── Hover overlay — dark with "Shop Now" */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-white text-xs tracking-[0.3em] uppercase">
            Shop Now
          </span>
        </div>
      </div>

      {/* ── Product info */}
      <div className="pt-3 pb-1">
        <p className="text-sm font-light text-gray-800 leading-snug line-clamp-2" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300 }}>
          {product.title}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm text-[#1a1a1a]">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {discount > 0 && (
            <>
              <span className="line-through text-gray-400 text-xs">
                ₹{product.comparePrice.toLocaleString("en-IN")}
              </span>
              <span className="text-[#3B5373] text-xs">
                -{discount}%
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
