"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/products";

interface FeaturedPicksProps {
  latestProducts: Product[];
  bestSellers: Product[];
}

export default function FeaturedPicks({ latestProducts, bestSellers }: FeaturedPicksProps) {
  const [activeTab, setActiveTab] = useState<"latest" | "bestsellers">("latest");
  const router = useRouter();

  const products = activeTab === "latest" ? latestProducts : bestSellers;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <p className="text-[11px] tracking-[0.5em] uppercase text-gray-400 mb-2">
          New &amp; Trending
        </p>
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
            fontWeight: 400,
            color: "#111",
            letterSpacing: "0.01em",
            marginBottom: "1.5rem",
          }}
        >
          Featured Picks
        </h2>

        {/* Tab Bar */}
        <div className="relative mb-8">
          {/* Full-width gray underline */}
          <div className="absolute bottom-0 left-0 right-0 border-b border-gray-200" />
          <div className="flex gap-8">
            {(["latest", "bestsellers"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-3 text-xs tracking-[0.3em] uppercase font-light transition-colors duration-200 ${
                  activeTab === tab
                    ? "text-[#111] border-b-2 border-[#3B5373]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {tab === "latest" ? "Latest Styles" : "Best Sellers"}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => {
            const hasDiscount =
              product.comparePrice && product.comparePrice > product.price;
            const discountPct = hasDiscount
              ? Math.round(
                  ((product.comparePrice - product.price) / product.comparePrice) * 100
                )
              : 0;

            return (
              <div
                key={product.slug}
                className="group cursor-pointer"
                onClick={() => router.push(`/products/${product.slug}`)}
              >
                {/* Image Container */}
                <div
                  className="relative overflow-hidden bg-[#f5f5f5]"
                  style={{ aspectRatio: "3 / 4" }}
                >
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Shop Now →
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="pt-3 pb-1">
                  <p
                    className="text-sm text-[#111] mb-1 truncate"
                    style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}
                  >
                    {product.title}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {hasDiscount ? (
                      <>
                        <span className="text-gray-400 text-xs line-through">
                          ₹{product.comparePrice.toLocaleString("en-IN")}
                        </span>
                        <span
                          className="text-sm font-medium text-[#111]"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        <span
                          className="text-xs font-medium text-[#3B5373]"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          -{discountPct}%
                        </span>
                      </>
                    ) : (
                      <span
                        className="text-sm text-[#111]"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <a href="/shop" className="btn-outline">
            View All
          </a>
        </div>
      </div>
    </section>
  );
}
