"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Product } from "@/lib/products";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { useWishlist } from "@/components/WishlistContext";

export default function ProductCard({ product, cardStyle }: { product: Product; cardStyle?: { aspectRatio?: string; borderRadius?: string; height?: number } }) {
  const { isWished, toggle } = useWishlist();
  const wished = isWished(product.slug);
  const discount =
    product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : 0;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      {/* ── Image container */}
      <div
        className={`relative overflow-hidden bg-[#faf8f6] ${cardStyle?.borderRadius || ""}`}
        style={{
          aspectRatio: cardStyle?.height ? undefined : (cardStyle?.aspectRatio || "1/1"),
          height: cardStyle?.height ? `${cardStyle.height}px` : undefined,
        }}
      >
        <Image
          src={optimizeCloudinary(product.image, 600)}
          alt={product.title}
          fill
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* ── Subtle hover overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* ── Wishlist heart button */}
        <button
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(product.slug); }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 hover:bg-white"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${wished ? "fill-red-500 stroke-red-500" : "stroke-gray-500"}`}
            strokeWidth={1.8}
          />
        </button>
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
