"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Product } from "@/lib/products";
import { useCart } from "./CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const discount = Math.round(
    ((product.comparePrice - product.price) / product.comparePrice) * 100
  );

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
      {/* Image container */}
      <div className="relative overflow-hidden rounded-xl bg-[#f5f5f5] aspect-[3/4]">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Sale badge — navy, top-left */}
        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 bg-[#3D4F5F] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
            -{discount}%
          </span>
        )}

        {/* Quick Add — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleQuickAdd}
            className="w-full flex items-center justify-center gap-2 bg-[#3D4F5F] text-white text-xs font-medium py-3 tracking-wider hover:bg-[#2e3c49] transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 px-0.5">
        <p className="text-[10px] text-classie-gray uppercase tracking-widest mb-1">
          {product.category === "heels" ? "Heels" : "Accessories"}
        </p>
        <h3 className="text-sm font-medium text-classie-black group-hover:text-[#3D4F5F] transition-colors leading-snug line-clamp-2">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-sm font-semibold text-classie-black">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-classie-gray line-through">
            ₹{product.comparePrice.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </Link>
  );
}
