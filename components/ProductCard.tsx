"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/products";
import { useCart } from "./CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const discount =
    product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      slug: product.slug,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1,
      variant: product.variants.options[0] ?? undefined,
    });
  };

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      {/* ── Image container — editorial portrait ratio */}
      <div
        className="relative overflow-hidden bg-[#faf8f6]"
        style={{ aspectRatio: "3/4" }}
      >
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* ── Hover CTA — slides up */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300 cursor-pointer"
          onClick={handleQuickAdd}
        >
          <span className="text-xs tracking-[0.3em] uppercase text-[#3B5373] font-medium">
            Add to Cart
          </span>
        </div>

        {/* ── Sale badge — thin, elegant */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-[#3B5373] text-white text-[10px] tracking-widest uppercase px-2.5 py-1">
            -{discount}%
          </div>
        )}
      </div>

      {/* ── Product info */}
      <div className="pt-3 pb-1">
        <p className="font-serif text-sm tracking-wide text-[#1a1a1a] leading-snug line-clamp-2 group-hover:text-[#3B5373] transition-colors duration-200">
          {product.title}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-medium text-[#3B5373]">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {discount > 0 && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.comparePrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
