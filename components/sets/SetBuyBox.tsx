"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { needsChoice, type GiftSet, type SetProduct } from "@/lib/giftSets";

interface Props {
  set: GiftSet;
  products: Record<string, SetProduct>;
  compare: number;
  kind: string;
  image: string;
  whatsapp: string;
  freeAmount: number | null;
}

const short = (t: string) => t.replace(/\s*\((pair)\)\s*$/i, "");

export default function SetBuyBox({ set, products, compare, kind, image, whatsapp, freeAmount }: Props) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [choice, setChoice] = useState<Record<number, string>>({});
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [missing, setMissing] = useState<number[]>([]);
  const save = compare - set.price;

  // "Ivory Pearl Bow (White) + Starlight Bloom (Silver) + 2 × Pearl Anklet"
  const describe = () => set.items.map((it, i) => {
    const p = products[it.slug];
    const v = it.variant || choice[i] || (p && p.options.length === 1 ? p.options[0] : "");
    const label = p?.variantType === "size" && v ? `Size ${v}` : v;
    return `${it.qty > 1 ? `${it.qty} × ` : ""}${short(p?.title ?? it.slug)}${label ? ` (${label})` : ""}`;
  }).join(" + ");

  const add = (then?: () => void) => {
    const miss = set.items.map((it, i) => (needsChoice(it, products) && !choice[i] ? i : -1)).filter((i) => i >= 0);
    setMissing(miss);
    if (miss.length) return;
    addToCart({ slug: `set-${set.slug}`, title: `${set.name} (Gift Set)`, price: set.price, image, quantity: qty, variant: describe() });
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
    then?.();
  };

  const waText = encodeURIComponent(`Hi Classie, I'm interested in the ${set.name}. ${set.description}`);
  const waLink = whatsapp ? `${whatsapp}${whatsapp.includes("?") ? "&" : "?"}text=${waText}` : "/contact";

  return (
    <div className="grid gap-4 md:gap-5">
      <div className="grid gap-2">
        <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-[#6b6b6b]">Gift set · {kind}{set.tag ? ` · ${set.tag}` : ""}</span>
        <h1 className="font-serif font-normal text-[30px] md:text-[42px] leading-[1.08] text-[#1a1a1a]">{set.name}</h1>
        {set.askOnly ? (
          <span className="font-sans text-[16px] font-semibold text-[#1a1a1a]">Price on request</span>
        ) : (
          <div className="flex flex-wrap items-baseline gap-2.5">
            <span className="font-sans text-[24px] font-semibold text-[#1a1a1a] tabular-nums">₹{set.price.toLocaleString("en-IN")}</span>
            {save > 0 && <span className="font-sans text-[14px] text-[#9a9a9a] line-through tabular-nums">₹{compare.toLocaleString("en-IN")}</span>}
            {save > 0 && <span className="bg-[#E6F4EC] text-[#1E7A4C] font-sans text-[11.5px] font-semibold px-2 py-1">Save ₹{save.toLocaleString("en-IN")}</span>}
          </div>
        )}
        {!set.askOnly && (
          <span className="font-sans text-[11.5px] text-[#6b6b6b]">
            Inclusive of all taxes{freeAmount && set.price >= freeAmount ? " · FREE delivery" : ""}
          </span>
        )}
      </div>

      <div className="border border-[#ECEAE6] p-3.5 md:p-4 grid gap-3">
        <h2 className="font-sans text-[12px] font-semibold tracking-[0.06em] text-[#1a1a1a]">Inside this set</h2>
        {set.items.map((it, i) => {
          const p = products[it.slug];
          if (!p) return null;
          const choose = needsChoice(it, products);
          const fixed = it.variant || (p.options.length === 1 ? p.options[0] : "");
          return (
            <div key={i} className="grid grid-cols-[56px_1fr_auto] gap-3 items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={optimizeCloudinary(p.image, 160)} alt={p.title} className="w-14 h-14 object-cover bg-[#f6f6f6]" />
              <div className="min-w-0 grid gap-1">
                <b className="font-sans text-[12.5px] font-semibold text-[#1a1a1a] leading-snug">{it.qty > 1 ? `${it.qty} × ` : ""}{short(p.title)}</b>
                {choose ? (
                  <label className="flex items-center gap-2 font-sans text-[11.5px] text-[#6b6b6b]">
                    {p.variantType === "size" ? "Size" : "Colour"}
                    <select value={choice[i] ?? ""} onChange={(e) => { setChoice((c) => ({ ...c, [i]: e.target.value })); setMissing((m) => m.filter((x) => x !== i)); }}
                      className={`border bg-white px-2 py-1 text-[12px] text-[#1a1a1a] ${missing.includes(i) ? "border-red-400" : "border-[#d9d6d0]"}`}>
                      <option value="">Choose</option>
                      {p.options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </label>
                ) : (
                  <span className="font-sans text-[11.5px] text-[#6b6b6b] capitalize">
                    {fixed ? `${p.variantType === "size" ? "Size " : ""}${fixed} · ` : ""}₹{p.price.toLocaleString("en-IN")} alone
                  </span>
                )}
              </div>
              <Link href={`/products/${p.slug}`} className="font-sans text-[10.5px] tracking-[0.1em] uppercase text-[#3B5373] border-b border-[#3B5373]">View</Link>
            </div>
          );
        })}
        {missing.length > 0 && <p className="font-sans text-[12px] text-red-600">Please choose the colour or size for each piece above.</p>}
      </div>

      {set.askOnly ? (
        <a href={waLink} target="_blank" rel="noopener noreferrer"
          className="bg-[#1E7A4C] text-white text-center font-sans text-[11.5px] tracking-[0.16em] uppercase py-4 hover:bg-[#186540] transition-colors">
          Ask on WhatsApp
        </a>
      ) : (
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <div className="flex items-center border border-[#ECEAE6]">
            <button type="button" aria-label="Less" onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-full text-lg">−</button>
            <span className="w-8 text-center font-sans font-semibold tabular-nums">{qty}</span>
            <button type="button" aria-label="More" onClick={() => setQty((q) => Math.min(20, q + 1))} className="w-10 h-full text-lg">+</button>
          </div>
          <button type="button" onClick={() => add()}
            className={`font-sans text-[11.5px] tracking-[0.16em] uppercase py-4 transition-colors ${added ? "bg-[#1E7A4C] text-white" : "bg-[#3B5373] text-white hover:bg-[#2a3d55]"}`}>
            {added ? "✓ Added to cart" : "Add set to cart"}
          </button>
          <button type="button" onClick={() => add(() => router.push("/checkout"))}
            className="col-span-2 border border-[#3B5373] text-[#3B5373] font-sans text-[11.5px] tracking-[0.16em] uppercase py-3.5 hover:bg-[#3B5373] hover:text-white transition-colors">
            Buy it now
          </button>
        </div>
      )}
    </div>
  );
}
