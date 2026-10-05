"use client";

import { useState } from "react";
import { SetCard } from "@/components/sets/SetCard";
import type { GiftSet, SetProduct } from "@/lib/giftSets";

export default function SetsGrid({ sets, products }: { sets: GiftSet[]; products: Record<string, SetProduct> }) {
  const tags = Array.from(new Set(sets.map((s) => s.tag).filter(Boolean)));
  const [tag, setTag] = useState<string>("");
  const shown = tag ? sets.filter((s) => s.tag === tag) : sets;

  return (
    <div className="grid gap-5 md:gap-8">
      {tags.length > 1 && (
        <div className="flex gap-2 overflow-x-auto md:flex-wrap -mx-4 px-4 md:mx-0 md:px-0 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Filter sets">
          {["", ...tags].map((t) => (
            <button key={t || "all"} type="button" role="tab" aria-selected={tag === t} onClick={() => setTag(t)}
              className={`flex-none rounded-full border px-4 py-2 font-sans text-[12px] transition-colors ${tag === t ? "bg-[#3B5373] border-[#3B5373] text-white" : "border-[#E6DFD4] text-[#1a1a1a] hover:border-[#3B5373]"}`}>
              {t || "All sets"}
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-8 md:gap-x-7 md:gap-y-12">
        {shown.map((s) => <SetCard key={s.id} set={s} products={products} />)}
      </div>
    </div>
  );
}
