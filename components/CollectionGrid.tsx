"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/products";

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "discount", label: "Biggest Discount" },
];

interface Props {
  title: string;
  subtitle?: string;
  products: Product[];
  tabs?: { key: string; label: string; products: Product[] }[];
}

export default function CollectionGrid({ title, subtitle, products: initial, tabs }: Props) {
  const [sort, setSort] = useState("default");
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.key ?? "all");

  const source = tabs ? (tabs.find((t) => t.key === activeTab)?.products ?? initial) : initial;

  const sorted = [...source].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "discount")
      return (b.comparePrice - b.price) / b.comparePrice - (a.comparePrice - a.price) / a.comparePrice;
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        {subtitle && (
          <p className="text-[11px] tracking-[0.4em] uppercase text-classie-gray mb-3">{subtitle}</p>
        )}
        <h1 className="font-serif text-4xl md:text-5xl text-classie-black">{title}</h1>
        <p className="text-classie-gray text-sm mt-3">{sorted.length} products</p>
      </div>

      {/* Tabs + Sort row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-classie-border">
        {tabs && tabs.length > 1 ? (
          <div className="flex gap-2 flex-wrap">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-medium border rounded-full transition-colors ${
                  activeTab === t.key
                    ? "bg-classie-black text-white border-classie-black"
                    : "border-classie-border text-classie-gray hover:border-classie-black hover:text-classie-black"
                }`}
              >
                {t.label} ({t.products.length})
              </button>
            ))}
          </div>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-3">
          <span className="text-xs text-classie-gray uppercase tracking-wider">Sort:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm border border-classie-border px-3 py-2 focus:outline-none focus:border-classie-black bg-white"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {sorted.length === 0 ? (
        <p className="text-center text-classie-gray py-24">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {sorted.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
