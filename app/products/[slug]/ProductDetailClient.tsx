"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Check, ChevronRight, Truck, RefreshCw, Shield, Star } from "lucide-react";
import { Product } from "@/lib/products";
import { useCart } from "@/components/CartContext";
import ProductCard from "@/components/ProductCard";

const SPECS: Record<string, string[][]> = {
  heels: [
    ["Heel Type",  "Block / Sculpted / Slim"],
    ["Sole",       "Anti-slip rubber"],
    ["Insole",     "Classie Comfort Insole™"],
    ["Closure",    "Slip-on / Slingback"],
    ["Material",   "Premium vegan leather / Satin"],
    ["Care",       "Wipe with soft dry cloth"],
  ],
  accessories: [
    ["Material",   "Satin / Organza / Metal alloy"],
    ["Closure",    "Secure back clip"],
    ["Sold as",    "Pair"],
    ["Use",        "Heels, handbags & hair"],
    ["Care",       "Gentle hand wash, air dry"],
  ],
};

export default function ProductDetailClient({ product, related }: { product: Product; related: Product[] }) {
  const { addToCart } = useCart();
  const [selected, setSelected] = useState(product.variants.options[0] ?? "");
  const [added, setAdded] = useState(false);

  const discount = Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100);
  const specs = SPECS[product.category] ?? [];

  const doAdd = () => {
    addToCart({ slug: product.slug, title: product.title, price: product.price, image: product.image, quantity: 1, variant: selected || undefined });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-0">
        <nav className="flex items-center gap-2 text-xs text-classie-gray flex-wrap">
          <Link href="/" className="hover:text-[#3D4F5F] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <Link href={`/shop/${product.collection}`} className="hover:text-[#3D4F5F] transition-colors capitalize">
            {product.collection === "heels" ? "Heels" : product.collection === "clips" ? "Clips" : "Bow"}
          </Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <span className="text-classie-black truncate max-w-[200px]">{product.title}</span>
        </nav>
      </div>

      {/* ── Main product section ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-8 lg:gap-14">

          {/* LEFT — 55% : Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden bg-[#f5f5f5]" style={{ aspectRatio: "1 / 1.1" }}>
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 55vw"
                priority
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-[#3D4F5F] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  -{discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* RIGHT — 45% : Details */}
          <div className="flex flex-col">
            {/* Category label */}
            <p className="text-[11px] tracking-[0.4em] uppercase text-classie-gray mb-2">
              {product.category === "heels" ? "Women's Heels" : "Accessories"}
            </p>

            {/* Product name — serif 36px */}
            <h1 className="font-serif text-3xl md:text-4xl text-classie-black leading-tight mb-4" style={{ fontSize: "clamp(1.8rem, 3vw, 2.25rem)" }}>
              {product.title}
            </h1>

            {/* Rating stars (static) */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs text-classie-gray">4.9 (38 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-semibold text-classie-black">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <span className="text-lg text-classie-gray line-through">
                ₹{product.comparePrice.toLocaleString("en-IN")}
              </span>
              {discount > 0 && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {discount}% off
                </span>
              )}
            </div>

            <p className="text-sm text-classie-gray leading-relaxed mb-6 border-t border-classie-border pt-5">
              {product.description}
            </p>

            {/* ── SIZE PILLS ── */}
            {product.variants.type === "size" && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-classie-black uppercase tracking-wider">
                    Size — <span className="font-normal text-classie-gray">EU {selected}</span>
                  </p>
                  <Link href="/faq#size-guide" className="text-xs text-[#3D4F5F] underline">
                    Size guide
                  </Link>
                </div>
                <div className="flex gap-2.5 flex-wrap">
                  {product.variants.options.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelected(sz)}
                      className={`w-12 h-12 rounded-full text-sm font-medium border-2 transition-all ${
                        selected === sz
                          ? "bg-[#3D4F5F] border-[#3D4F5F] text-white"
                          : "border-classie-border text-classie-black hover:border-[#3D4F5F]"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── COLOUR THUMBNAILS (circular 60px) ── */}
            {product.variants.type === "color" && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-classie-black uppercase tracking-wider mb-3">
                  Colour — <span className="font-normal text-classie-gray">{selected}</span>
                </p>
                <div className="flex gap-3 flex-wrap">
                  {product.variants.options.map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelected(col)}
                      title={col}
                      className={`relative w-[60px] h-[60px] rounded-full border-2 flex items-center justify-center text-[10px] font-medium overflow-hidden transition-all ${
                        selected === col
                          ? "border-[#3D4F5F] scale-110 shadow-md"
                          : "border-classie-border hover:border-[#3D4F5F]"
                      }`}
                    >
                      <Image
                        src={product.image}
                        alt={col}
                        fill
                        className="object-cover object-center rounded-full"
                        sizes="60px"
                      />
                      {selected === col && (
                        <span className="absolute inset-0 bg-[#3D4F5F]/20 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white drop-shadow" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── ADD TO CART ── */}
            <button
              onClick={doAdd}
              className={`w-full py-4 text-sm font-semibold tracking-widest uppercase flex items-center justify-center gap-3 rounded-[24px] transition-all duration-300 ${
                added
                  ? "bg-emerald-600 text-white"
                  : "bg-[#3D4F5F] text-white hover:bg-[#2e3c49] active:scale-[0.98]"
              }`}
            >
              {added ? <><Check className="w-5 h-5" /> Added!</> : <><ShoppingBag className="w-5 h-5" /> Add to Cart</>}
            </button>

            {/* ── Trust badges ── */}
            <div className="flex gap-3 mt-5">
              {[
                { icon: Truck,     text: "Free shipping above ₹999" },
                { icon: RefreshCw, text: "7-day easy returns" },
                { icon: Shield,    text: "COD available" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex-1 flex flex-col items-center gap-1.5 text-center bg-[#faf8f6] rounded-xl py-3 px-1">
                  <Icon className="w-4 h-4 text-[#3D4F5F]" />
                  <span className="text-[10px] text-classie-gray leading-tight">{text}</span>
                </div>
              ))}
            </div>

            {/* ── SPEC TABLE ── */}
            <div className="mt-7 border-t border-classie-border pt-6">
              <h3 className="font-serif text-lg text-classie-black mb-4">Product Details</h3>
              <table className="w-full text-sm">
                <tbody>
                  {specs.map(([key, val]) => (
                    <tr key={key} className="border-b border-classie-border last:border-0">
                      <td className="py-2.5 pr-4 text-classie-gray font-medium w-[40%]">{key}</td>
                      <td className="py-2.5 text-classie-black">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Related products ── */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-classie-border pt-14">
            <h2 className="font-serif text-2xl md:text-3xl text-classie-black mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
