"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { searchItems } from "@/lib/productSearch";

interface Item {
  slug: string;
  title: string;
  price: number;
  compare_price: number | null;
  image: string;
  category: string;
  tags: string[] | null;
  description: string | null;
}

const QUICK = [
  { label: "Shoe clips", href: "/shop/clips" },
  { label: "Heels", href: "/shop/heels" },
  { label: "Gift sets", href: "/gift-sets" },
  { label: "Custom designs", href: "/custom-designs" },
];
const SUGGEST = ["Bow", "Crystal", "Pearl", "Bridal", "Jute", "Black heels"];

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => inputRef.current?.focus(), 30);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    if (!items) {
      supabase.from("products").select("slug,title,price,compare_price,image,category,tags,description")
        .eq("active", true).order("created_at", { ascending: false })
        .then(({ data }) => setItems((data as Item[]) ?? []));
    }
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose, items]);

  const results = useMemo(() => (items ? searchItems(items, q) : []), [q, items]);

  if (!open) return null;

  const go = (href: string) => { onClose(); setQ(""); router.push(href); };

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Search products">
      <button type="button" aria-label="Close search" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-h-[85vh] overflow-y-auto shadow-xl">
        <div className="max-w-3xl mx-auto px-4 md:px-6 pt-4 pb-6">
          <form
            onSubmit={(e) => { e.preventDefault(); if (results[0]) go(`/products/${results[0].slug}`); else if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`); }}
            className="flex items-center gap-3 border-b border-[#1a1a1a] pb-2"
          >
            <Search className="w-5 h-5 text-[#6b6b6b] flex-shrink-0" strokeWidth={1.6} />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search clips, heels, colours…"
              className="flex-1 min-w-0 py-2 font-sans text-[16px] text-[#1a1a1a] outline-none bg-transparent"
              aria-label="Search"
              enterKeyHint="search"
            />
            <button type="button" onClick={onClose} aria-label="Close" className="p-1 text-[#1a1a1a]">
              <X className="w-5 h-5" />
            </button>
          </form>

          {!q.trim() && (
            <div className="pt-5 grid gap-4">
              <div className="flex flex-wrap gap-2">
                {SUGGEST.map((s) => (
                  <button key={s} type="button" onClick={() => setQ(s)}
                    className="font-sans text-[12px] px-3 py-1.5 border border-[#ECEAE6] hover:border-[#3B5373] text-[#1a1a1a]">{s}</button>
                ))}
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {QUICK.map((l) => (
                  <Link key={l.href} href={l.href} onClick={onClose}
                    className="font-sans text-[11px] tracking-[0.14em] uppercase text-[#3B5373] hover:underline">{l.label}</Link>
                ))}
              </div>
            </div>
          )}

          {q.trim() && items === null && <p className="pt-5 font-sans text-[13px] text-[#6b6b6b]">Searching…</p>}

          {q.trim() && items !== null && results.length === 0 && (
            <div className="pt-5 font-sans text-[13px] text-[#555] grid gap-2">
              <p>No products found for “{q.trim()}”.</p>
              <p>Try “bow”, “crystal” or “heels” — or <Link href="/custom-designs" onClick={onClose} className="text-[#3B5373] underline">ask us to make it</Link>.</p>
            </div>
          )}

          {results.length > 0 && (
            <ul className="pt-3 divide-y divide-[#F0EEEA]">
              {results.slice(0, 12).map((it) => (
                <li key={it.slug}>
                  <Link href={`/products/${it.slug}`} onClick={() => { onClose(); setQ(""); }}
                    className="flex items-center gap-3 py-2.5 hover:bg-[#F7F4EF] -mx-2 px-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={optimizeCloudinary(it.image, 120)} alt="" className="w-14 h-14 object-cover bg-[#f6f6f6] flex-shrink-0" loading="lazy" />
                    <span className="flex-1 min-w-0">
                      <span className="block font-sans text-[13.5px] text-[#1a1a1a] truncate">{it.title.trim()}</span>
                      <span className="block font-sans text-[11px] text-[#6b6b6b] capitalize">{it.category === "heels" ? "Heels" : "Shoe clips & charms"}</span>
                    </span>
                    <span className="font-sans text-[13px] font-medium text-[#1a1a1a] whitespace-nowrap">
                      ₹{Number(it.price).toLocaleString("en-IN")}
                      {it.compare_price && it.compare_price > it.price && (
                        <s className="ml-1.5 text-[11px] text-[#9a9a9a] font-normal">₹{Number(it.compare_price).toLocaleString("en-IN")}</s>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
