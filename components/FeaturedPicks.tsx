"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/products";

interface FeaturedPicksProps {
  latestProducts: Product[];
  bestSellers: Product[];
}

export default function FeaturedPicks({ latestProducts, bestSellers }: FeaturedPicksProps) {
  const [activeTab, setActiveTab] = useState<"latest" | "bestsellers">("latest");
  const router = useRouter();

  const products = (activeTab === "latest" ? latestProducts : bestSellers).slice(0, 4);

  return (
    <section className="pt-12 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Heading — LEFT aligned, Mango style */}
        <h2
          className="mb-5"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
            fontWeight: 400,
            color: "#111",
            letterSpacing: "0.01em",
          }}
        >
          Featured Picks
        </h2>

        {/* Tab Bar — LEFT aligned */}
        <div className="relative mb-10">
          <div className="absolute bottom-0 left-0 right-0 border-b border-gray-200" />
          <div className="relative flex gap-10">
            {(["latest", "bestsellers"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-3 text-xs tracking-widest uppercase transition-colors duration-200 ${
                  activeTab === tab
                    ? "text-gray-900 border-b-2 border-[#3B5373]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 300 }}
              >
                {tab === "latest" ? "Latest Styles" : "Best Sellers"}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid — exactly 4 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {products.map((product) => {
            const hasDiscount =
              product.comparePrice && product.comparePrice > product.price;
            const discountPct = hasDiscount
              ? Math.round((1 - product.price / product.comparePrice) * 100)
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
                      className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  )}

                  {/* SALE Badge — top-left, only if compare_price > price */}
                  {hasDiscount && (
                    <div className="absolute top-3 left-3 bg-white text-gray-700 text-[10px] tracking-widest uppercase px-2 py-1 font-light border border-gray-200 z-10">
                      Sale
                    </div>
                  )}

                  {/* Shop Now hover overlay */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-white text-gray-800 text-xs tracking-[0.2em] uppercase px-4 py-2 font-light">
                      Shop Now
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="mt-3">
                  <p
                    className="text-sm font-normal text-gray-800 truncate"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {product.title}
                  </p>
                  <div className="flex items-center flex-wrap mt-1">
                    <span
                      className="text-sm text-gray-800"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="text-xs text-gray-400 line-through ml-2">
                          ₹{product.comparePrice.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs font-medium text-[#3B5373] ml-2">
                          -{discountPct}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* EXPLORE ALL button — gray style, links to /shop/heels */}
        <div className="text-center mt-10">
          <Link
            href="/shop/heels"
            className="inline-block border border-gray-300 bg-gray-50 text-gray-600 px-12 py-3 text-xs tracking-[0.3em] uppercase font-light hover:bg-gray-100 transition-all"
          >
            Explore All
          </Link>
        </div>
      </div>
    </section>
  );
}
