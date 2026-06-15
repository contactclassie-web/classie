"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { Product } from "@/lib/products";

interface Category {
  name: string;
  slug: string;
  image_url?: string;
  description?: string;
}

interface Props {
  initialProducts: Product[];
  categories: Category[];
}

const SORT_OPTIONS = [
  { label: "Newest First",    value: "newest" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
];

export default function CollectionsClient({ initialProducts, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sort, setSort]                     = useState("newest");
  const [sortOpen, setSortOpen]             = useState(false);

  const filtered = useMemo(() => {
    let list = activeCategory === "all"
      ? initialProducts
      : initialProducts.filter((p) => p.category === activeCategory);

    if (sort === "price_asc")  list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price_desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [initialProducts, activeCategory, sort]);

  const sortLabel = SORT_OPTIONS.find((s) => s.value === sort)?.label ?? "Sort";

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #3B5373 0%, #2d3f57 60%, #1e2d3e 100%)" }}>
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10" style={{ background: "#ffffff" }} />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full opacity-5" style={{ background: "#ffffff" }} />

        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <p className="text-[11px] tracking-[0.35em] uppercase text-white/60 mb-4 font-light">Classie × All Collections</p>
          <h1 className="font-serif text-5xl md:text-6xl font-light text-white mb-4 leading-tight">
            Explore <span className="italic">our</span> Collection
          </h1>
          <p className="text-white/60 text-sm tracking-wide max-w-md mx-auto leading-relaxed">
            Curated styles for every occasion — from everyday elegance to statement evenings.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/shop/${cat.slug}`}
                className="px-5 py-2 text-[11px] tracking-[0.15em] uppercase border border-white/30 text-white/80 hover:bg-white hover:text-[#3B5373] transition-all duration-300 rounded-sm">
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Filter + Sort bar ─────────────────────────────────── */}
      <div className="sticky top-[68px] z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between" style={{ height: "56px" }}>
            {/* Category tabs */}
            <div className="flex items-center gap-0 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-5 py-4 text-[11px] tracking-[0.15em] uppercase border-b-2 transition-all whitespace-nowrap ${
                  activeCategory === "all"
                    ? "border-[#3B5373] text-[#3B5373] font-medium"
                    : "border-transparent text-gray-400 hover:text-gray-700"
                }`}>
                All ({initialProducts.length})
              </button>
              {categories.map((cat) => {
                const count = initialProducts.filter((p) => p.category === cat.slug).length;
                return (
                  <button key={cat.slug}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`px-5 py-4 text-[11px] tracking-[0.15em] uppercase border-b-2 transition-all whitespace-nowrap ${
                      activeCategory === cat.slug
                        ? "border-[#3B5373] text-[#3B5373] font-medium"
                        : "border-transparent text-gray-400 hover:text-gray-700"
                    }`}>
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* Sort */}
            <div className="relative flex-shrink-0 ml-4">
              <button onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 px-4 py-2 text-[11px] tracking-[0.12em] uppercase text-gray-500 border border-gray-200 hover:border-[#3B5373] hover:text-[#3B5373] transition-all rounded-sm">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {sortLabel}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 shadow-lg rounded-sm z-50 min-w-[180px]">
                  {SORT_OPTIONS.map((opt) => (
                    <button key={opt.value}
                      onClick={() => { setSort(opt.value); setSortOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-[11px] tracking-[0.12em] uppercase transition-colors ${
                        sort === opt.value
                          ? "text-[#3B5373] bg-[#f8f7ff]"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Product Grid ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        {/* Active category banner */}
        {activeCategory !== "all" && (() => {
          const cat = categories.find((c) => c.slug === activeCategory);
          if (!cat) return null;
          return (
            <div className="mb-8 flex items-center gap-4 p-5 bg-[#faf9ff] border border-[#e8e4f8] rounded-sm">
              {cat.image_url && (
                <div className="relative w-14 h-14 rounded-sm overflow-hidden flex-shrink-0">
                  <Image src={cat.image_url} alt={cat.name} fill className="object-cover" sizes="56px" />
                </div>
              )}
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#3B5373] mb-0.5">Collection</p>
                <h2 className="font-serif text-xl text-[#1a1a1a]">{cat.name}</h2>
                {cat.description && <p className="text-xs text-gray-400 mt-0.5">{cat.description}</p>}
              </div>
            </div>
          );
        })()}

        {filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-300">
            <p className="text-5xl mb-4">✦</p>
            <p className="text-sm tracking-widest uppercase">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {filtered.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}

        {/* Result count */}
        {filtered.length > 0 && (
          <p className="text-center text-[10px] tracking-[0.2em] uppercase text-gray-300 mt-12">
            Showing {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>
        )}
      </section>
    </main>
  );
}

/* ── Product Card ───────────────────────────────────────── */
function ProductCard({ product }: { product: Product }) {
  const discount = product.comparePrice > product.price
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      {/* Image container */}
      <div className="relative overflow-hidden bg-[#f8f7ff] rounded-sm mb-3" style={{ aspectRatio: "3/4" }}>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-200">
            <span className="text-3xl">✦</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="px-2 py-0.5 text-[9px] tracking-[0.15em] uppercase bg-[#3B5373] text-white rounded-sm">
              -{discount}%
            </span>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end justify-center pb-5 opacity-0 group-hover:opacity-100">
          <span className="px-6 py-2 bg-white text-[#1a1a1a] text-[10px] tracking-[0.2em] uppercase font-medium shadow-md translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            View Product
          </span>
        </div>
      </div>

      {/* Info */}
      <div>
        <p className="text-[10px] tracking-[0.15em] uppercase text-gray-400 mb-1 capitalize">
          {product.category}
        </p>
        <h3 className="font-serif text-[0.95rem] text-[#1a1a1a] leading-snug group-hover:text-[#3B5373] transition-colors line-clamp-2 mb-2">
          {product.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#1a1a1a]">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.comparePrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.comparePrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
