"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";
import { SlidersHorizontal, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "discount", label: "Biggest Discount" },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";

  const [category, setCategory] = useState(categoryParam);
  const [sort, setSort] = useState("default");
  const [filterOpen, setFilterOpen] = useState(false);
  const [advMobile,  setAdvMobile]  = useState(2);
  const [advDesktop, setAdvDesktop] = useState(4);
  const [advGap,     setAdvGap]     = useState(16);

  useEffect(() => {
    supabase.from("site_settings").select("key,value")
      .in("key", ["adv_shop_mobile","adv_shop_desktop","adv_shop_gap"])
      .then(({ data }) => {
        if (!data) return;
        const m: Record<string,string> = {};
        data.forEach(({ key, value }) => { m[key] = value; });
        if (m.adv_shop_mobile)  setAdvMobile(parseInt(m.adv_shop_mobile) || 2);
        if (m.adv_shop_desktop) setAdvDesktop(parseInt(m.adv_shop_desktop) || 4);
        if (m.adv_shop_gap)     setAdvGap(parseInt(m.adv_shop_gap) || 16);
      });
  }, []);

  useEffect(() => {
    setCategory(searchParams.get("category") || "all");
  }, [searchParams]);

  let filtered = category === "all" ? products : products.filter((p) => p.category === category);

  if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (sort === "discount")
    filtered = [...filtered].sort(
      (a, b) => (b.comparePrice - b.price) / b.comparePrice - (a.comparePrice - a.price) / a.comparePrice
    );

  const tabs = [
    { key: "all", label: `All (${products.length})` },
    { key: "heels", label: `Heels (${products.filter((p) => p.category === "heels").length})` },
    { key: "accessories", label: `Clip-ons (${products.filter((p) => p.category === "accessories").length})` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Page header */}
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-classie-gray mb-2">Classie Collection</p>
        <h1 className="font-serif text-4xl md:text-5xl text-classie-black">
          {category === "heels" ? "Women's Heels" : category === "accessories" ? "Clip-ons & Accessories" : "All Products"}
        </h1>
      </div>

      {/* Filters row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 border-b border-classie-border pb-6">
        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setCategory(tab.key)}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-medium border transition-colors rounded-full ${
                category === tab.key
                  ? "bg-classie-black text-white border-classie-black"
                  : "border-classie-border text-classie-gray hover:border-classie-black hover:text-classie-black"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-3">
          <label className="text-xs text-classie-gray uppercase tracking-wider">Sort:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm border border-classie-border px-3 py-2 focus:outline-none focus:border-classie-black bg-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-classie-gray text-lg">No products found.</p>
        </div>
      ) : (
        <div
          className={`grid grid-cols-${advMobile} sm:grid-cols-${advDesktop} md:grid-cols-${advDesktop}`}
          style={{ gap: advGap + "px" }}
        >
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-classie-gray text-sm">Loading products…</div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
