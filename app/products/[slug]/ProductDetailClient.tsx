"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Check, ChevronRight, Plus, Minus } from "lucide-react";
import { Product } from "@/lib/products";
import { useCart } from "@/components/CartContext";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";
import { BundleOfferWithProduct, FeatureTile, ColorVariant } from "./page";

// ── Types ──────────────────────────────────────────────────────────────────

const DEFAULT_FEATURE_TILES: FeatureTile[] = [
  { icon: "🤍", title: "Made with Care", desc: "Handcrafted details for lasting elegance" },
  { icon: "🌤", title: "All-Season Wear", desc: "Versatile style for every season" },
  { icon: "👗", title: "Casual to Formal", desc: "Effortlessly transitions day to evening" },
  { icon: "🌙", title: "Day to Night", desc: "From morning meetings to evening soirées" },
];

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

const FEATURE_CHECKS = [
  "Genuine Leather Finish",
  "COD Available",
  "Comfortable for long wear",
  "High Quality Product",
];

const STATIC_REVIEWS = [
  { name: "Akshita", date: "05/04/2026", rating: 5, text: "Loved the heels and the wine colour. Very comfortable for long wear and quality is exactly as shown.", initial: "A" },
  { name: "Priya",   date: "12/04/2026", rating: 5, text: "Beautiful design, fits perfectly. Got so many compliments at the wedding. Delivery was fast too!", initial: "P" },
];

// ── Component ─────────────────────────────────────────────────────────────

export default function ProductDetailClient({
  product,
  related,
  bundleOffers = [],
  featureTiles = [],
  latestProducts = [],
  bestsellerProducts = [],
  colorVariants = [],
}: {
  product: Product;
  related: Product[];
  bundleOffers?: BundleOfferWithProduct[];
  featureTiles?: FeatureTile[];
  latestProducts?: Product[];
  bestsellerProducts?: Product[];
  colorVariants?: ColorVariant[];
}) {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product.variants.options[0] ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [addedBundle, setAddedBundle] = useState<Record<string, boolean>>({});
  const [bundleVariants, setBundleVariants] = useState<Record<string, string>>({});
  const [openAcc, setOpenAcc] = useState<string | null>("description");
  const [collTab, setCollTab] = useState<"latest" | "bestseller">("latest");

  // Gallery images: main + additional
  const rawImages = [product.image, ...(product.images ?? [])].filter(Boolean);
  const galleryImages = rawImages.length >= 4 ? rawImages.slice(0, 4) : [...rawImages, ...Array(4 - rawImages.length).fill(product.image)];
  const [mainImage, setMainImage] = useState(galleryImages[0]);

  // Adv related grid settings
  const [advDesktop, setAdvDesktop] = useState(4);
  const [advGap, setAdvGap] = useState(16);
  const [advAspect, setAdvAspect] = useState("4/5");
  const [advRadius, setAdvRadius] = useState("sharp");
  const [advCardH, setAdvCardH] = useState(0);
  const radiusMap: Record<string, string> = { sharp: "", slight: "rounded", rounded: "rounded-xl", pill: "rounded-3xl" };

  useEffect(() => {
    supabase.from("site_settings").select("key,value")
      .in("key", ["adv_related_desktop", "adv_related_gap", "adv_related_aspect", "adv_related_radius", "adv_related_card_h"])
      .then(({ data }) => {
        if (!data) return;
        const m: Record<string, string> = {};
        data.forEach(({ key, value }: { key: string; value: string }) => { m[key] = value; });
        if (m.adv_related_desktop) setAdvDesktop(parseInt(m.adv_related_desktop) || 4);
        if (m.adv_related_gap)     setAdvGap(parseInt(m.adv_related_gap) || 16);
        if (m.adv_related_aspect)  setAdvAspect(m.adv_related_aspect);
        if (m.adv_related_radius)  setAdvRadius(m.adv_related_radius);
        if (m.adv_related_card_h)  setAdvCardH(parseInt(m.adv_related_card_h) || 0);
      });
  }, []);

  const discount = product.comparePrice > product.price
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const specs = SPECS[product.category] ?? [];
  const tiles = featureTiles.length > 0 ? featureTiles : DEFAULT_FEATURE_TILES;

  const doAdd = () => {
    addToCart({ slug: product.slug, title: product.title, price: product.price, image: product.image, quantity: qty, variant: selectedVariant || undefined });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const addBundleItem = (offer: BundleOfferWithProduct) => {
    const discountedPrice = offer.discount_type === "percentage"
      ? Math.round(offer.product.price * (1 - offer.discount_value / 100))
      : Math.max(0, Math.round(offer.product.price - offer.discount_value));
    addToCart({ slug: offer.product.slug, title: offer.product.title, price: discountedPrice, image: offer.product.image, quantity: 1 });
    setAddedBundle((prev) => ({ ...prev, [offer.id]: true }));
    setTimeout(() => setAddedBundle((prev) => ({ ...prev, [offer.id]: false })), 2500);
  };

  const collProducts = collTab === "latest" ? latestProducts : bestsellerProducts;

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Breadcrumb ── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-14 pt-5 pb-0">
        <nav className="flex items-center gap-2 text-xs flex-wrap" style={{ color: "#888" }}>
          <Link href="/" className="hover:text-[#3B5373] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <Link href={`/shop/${product.collection}`} className="hover:text-[#3B5373] transition-colors capitalize">
            {product.collection === "heels" ? "Heels" : product.collection === "clips" ? "Clips" : "Bow"}
          </Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <span style={{ color: "#1a1a1a" }} className="truncate max-w-[200px]">{product.title}</span>
        </nav>
      </div>

      {/* ── 2-COLUMN PRODUCT SECTION ── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-14 py-6 lg:py-10">
        <div className="grid grid-cols-1 md:grid-cols-[52%_48%] gap-0">

          {/* LEFT — Image Column */}
          <div className="pr-0 md:pr-12 mb-8 md:mb-0">
            {/* Main image */}
            <div className="relative rounded-[4px] overflow-hidden mb-3" style={{ aspectRatio: "3/4", background: "#F0EBE4" }}>
              <Image
                src={mainImage}
                alt={product.title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 52vw"
                priority
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 text-white text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "#3B5373", fontSize: "11px", letterSpacing: "0.04em" }}>
                  -{discount}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className="relative overflow-hidden rounded-[4px] p-0 m-0 cursor-pointer"
                  style={{ aspectRatio: "3/4", border: `2px solid ${mainImage === img ? "#3B5373" : "transparent"}`, background: "#EDE8E1", transition: "border-color 0.2s" }}
                >
                  <Image src={img} alt={`View ${i + 1}`} fill className="object-cover object-center" sizes="100px" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT — Info Column */}
          <div style={{ paddingTop: "8px" }}>
            {/* Category label */}
            <p style={{ fontSize: "10.5px", letterSpacing: "0.35em", textTransform: "uppercase", color: "#888", marginBottom: "10px" }}>
              {product.category === "heels" ? "Women's Heels" : "Accessories"}
            </p>

            {/* Product name */}
            <h1 className="font-serif" style={{ fontSize: "clamp(1.6rem, 3vw, 2rem)", lineHeight: 1.25, color: "#1a1a1a", marginBottom: "4px" }}>
              {product.title}
            </h1>

            {/* Subtitle / description short */}
            <p style={{ fontSize: "13px", color: "#888", marginBottom: "14px", fontStyle: "italic" }}>
              {product.category === "heels" ? "Premium Heel Collection" : "Accessory Collection"}
            </p>

            {/* Stars */}
            <div className="flex items-center gap-2" style={{ marginBottom: "18px" }}>
              <span style={{ color: "#D4A843", fontSize: "14px", letterSpacing: "2px" }}>★★★★★</span>
              <span style={{ fontSize: "12px", color: "#888", textDecoration: "underline", cursor: "pointer" }}>5.0 · 2 reviews</span>
            </div>

            {/* Price row */}
            <div className="flex items-baseline gap-3" style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid #E8E3DD" }}>
              <span style={{ fontSize: "24px", fontWeight: 600, color: "#1a1a1a" }}>₹{product.price.toLocaleString("en-IN")}</span>
              {discount > 0 && (
                <span style={{ fontSize: "15px", color: "#888", textDecoration: "line-through" }}>₹{product.comparePrice.toLocaleString("en-IN")}</span>
              )}
              {discount > 0 && (
                <span style={{ background: "#ECFDF5", color: "#059669", fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "100px" }}>
                  {discount}% OFF
                </span>
              )}
            </div>

            {/* ── Color Variants ── */}
            {colorVariants.length > 1 && (
              <div style={{ marginBottom: "16px" }}>
                <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888", marginBottom: "8px" }}>Color</p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-start" }}>
                  {colorVariants.map((v) => {
                    const isActive = v.product_slug === product.slug;
                    return isActive ? (
                      <div key={v.id} title={v.color_name}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                        <div style={{
                          width: "28px", height: "28px", borderRadius: "50%", background: v.color_hex,
                          border: "2.5px solid #3B5373", boxShadow: "0 0 0 2px #fff inset",
                          cursor: "default"
                        }} />
                        <span style={{ fontSize: "10px", color: "#3B5373", fontWeight: 600 }}>{v.color_name}</span>
                      </div>
                    ) : (
                      <Link key={v.id} href={`/products/${v.product_slug}`} title={v.color_name}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", textDecoration: "none" }}>
                        <div style={{
                          width: "28px", height: "28px", borderRadius: "50%", background: v.color_hex,
                          border: "1.5px solid #D0D0D0", cursor: "pointer"
                        }} />
                        <span style={{ fontSize: "10px", color: "#888" }}>{v.color_name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color thumbnails */}
            {product.variants.type === "color" && (
              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#1a1a1a", marginBottom: "10px" }}>
                  Available in
                </p>
                <div className="flex gap-2.5 flex-wrap">
                  {product.variants.options.map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelectedVariant(col)}
                      title={col}
                      className="flex flex-col items-center gap-1 p-0 bg-transparent border-0 cursor-pointer"
                    >
                      <span
                        className="relative overflow-hidden"
                        style={{
                          width: "56px", height: "56px", borderRadius: "4px", display: "block",
                          border: `2px solid ${selectedVariant === col ? "#3B5373" : "transparent"}`,
                          background: "#EDE8E1",
                          transform: selectedVariant === col ? "scale(1.05)" : "scale(1)",
                          transition: "all 0.2s",
                        }}
                      >
                        <Image src={product.image} alt={col} fill className="object-cover object-center" sizes="56px" />
                      </span>
                      <span style={{ fontSize: "10px", color: "#888" }}>{col}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size selector */}
            {product.variants.type === "size" && (
              <div style={{ marginBottom: "20px" }}>
                <div className="flex items-center justify-between" style={{ marginBottom: "10px" }}>
                  <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#1a1a1a" }}>
                    Shoe Size (EU)
                  </p>
                  <Link href="/faq#size-guide" style={{ fontSize: "11px", color: "#3B5373", textDecoration: "underline" }}>Size Guide</Link>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.options.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedVariant(sz)}
                      style={{
                        width: "48px", height: "48px", borderRadius: "50%",
                        border: `1.5px solid ${selectedVariant === sz ? "#3B5373" : "#E8E3DD"}`,
                        background: selectedVariant === sz ? "#3B5373" : "#fff",
                        color: selectedVariant === sz ? "#fff" : "#1a1a1a",
                        fontSize: "13px", fontWeight: selectedVariant === sz ? 600 : 500,
                        cursor: "pointer", transition: "all 0.2s",
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Specs table */}
            {specs.length > 0 && (
              <table className="w-full" style={{ marginBottom: "20px", borderTop: "1px solid #E8E3DD" }}>
                <tbody>
                  {specs.map(([key, val]) => (
                    <tr key={key} style={{ borderBottom: "1px solid #E8E3DD" }}>
                      <td style={{ padding: "9px 0", paddingRight: "16px", fontSize: "12.5px", color: "#888", fontWeight: 500, width: "42%" }}>{key}</td>
                      <td style={{ padding: "9px 0", fontSize: "12.5px", color: "#1a1a1a" }}>{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Feature checkmarks (2-col grid) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px", marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid #E8E3DD" }}>
              {FEATURE_CHECKS.map((feat) => (
                <div key={feat} className="flex items-center gap-1.5" style={{ fontSize: "12.5px", color: "#444" }}>
                  <span style={{ color: "#3B5373", fontWeight: 700, fontSize: "14px" }}>✓</span>
                  {feat}
                </div>
              ))}
            </div>

            {/* Free shipping */}
            <p className="flex items-center gap-1.5" style={{ fontSize: "12.5px", color: "#3B5373", fontWeight: 500, marginBottom: "16px" }}>
              🚚 Free Shipping Included
            </p>

            {/* Qty + Add to Cart */}
            <div className="flex items-center gap-2.5" style={{ marginBottom: "10px" }}>
              <div className="flex items-center overflow-hidden" style={{ border: "1.5px solid #E8E3DD", borderRadius: "100px", height: "52px" }}>
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex items-center justify-center hover:bg-gray-50 transition-colors"
                  style={{ width: "42px", height: "52px", background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#1a1a1a" }}
                >
                  −
                </button>
                <span style={{ width: "36px", textAlign: "center", fontSize: "15px", fontWeight: 600 }}>{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="flex items-center justify-center hover:bg-gray-50 transition-colors"
                  style={{ width: "42px", height: "52px", background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#1a1a1a" }}
                >
                  +
                </button>
              </div>
              <button
                onClick={doAdd}
                className="flex-1 flex items-center justify-center gap-2 transition-all duration-300"
                style={{
                  height: "52px", borderRadius: "100px", border: "none",
                  background: added ? "#16a34a" : "#3B5373",
                  color: "#fff", fontSize: "12.5px", fontWeight: 600,
                  letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer",
                }}
              >
                {added ? <><Check className="w-4 h-4" /> Added!</> : <><ShoppingBag className="w-4 h-4" /> Add to Cart</>}
              </button>
            </div>

            {/* Buy Now */}
            <button
              onClick={doAdd}
              className="w-full transition-all duration-200 hover:bg-[#3B5373] hover:text-white"
              style={{
                height: "52px", borderRadius: "100px",
                border: "1.5px solid #3B5373", color: "#3B5373",
                background: "#fff", fontSize: "12.5px", fontWeight: 600,
                letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer",
                marginBottom: "22px",
              }}
            >
              Buy it Now
            </button>

            {/* ── Buy 2 Get X% Off ── */}
            {bundleOffers.filter(o => o.accessory_slug === product.slug).map((offer) => {
              const disc = offer.discount_type === "percentage" ? `${offer.discount_value}%` : `₹${offer.discount_value}`;
              const discPrice = offer.discount_type === "percentage"
                ? Math.round(product.price * (1 - offer.discount_value / 100))
                : Math.max(0, Math.round(product.price - offer.discount_value));
              return (
                <div key={offer.id} style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #D8DFE8" }}>
                  {/* Top strip — light blue-gray, subtle */}
                  <div style={{ background: "#EEF1F6", padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5A6E84" }}>Limited Offer</span>
                    <span style={{ background: "#fff", color: "#3B5373", fontSize: "11px", fontWeight: 700, padding: "3px 12px", borderRadius: "100px", border: "1px solid #C8D4E0" }}>Save {disc}</span>
                  </div>
                  {/* White body */}
                  <div style={{ background: "#fff", padding: "18px 18px 16px" }}>
                    <p style={{ fontFamily: "Georgia, serif", fontSize: "17px", fontWeight: 600, color: "#1a1a1a", marginBottom: "6px" }}>Buy 2, Get {disc} Off</p>
                    <p style={{ fontSize: "12px", color: "#888", lineHeight: 1.5, marginBottom: "0" }}>
                      {offer.custom_label || `Purchase 2 pairs and enjoy ${disc} off each — automatically applied at checkout.`}
                    </p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "14px", paddingTop: "14px", borderTop: "1px solid #F0EDEA" }}>
                      <span style={{ fontSize: "22px", fontWeight: 700, color: "#1a1a1a" }}>₹{discPrice.toLocaleString("en-IN")}</span>
                      <span style={{ fontSize: "12px", color: "#bbb", textDecoration: "line-through" }}>₹{product.price.toLocaleString("en-IN")}</span>
                      <span style={{ fontSize: "11px", color: "#888" }}>each × 2 pairs</span>
                    </div>
                  </div>
                  {/* CTA bar — medium navy, not too dark */}
                  <button
                    onClick={() => {
                      addToCart({ slug: product.slug, title: product.title, price: discPrice, image: product.image, quantity: 2, variant: selectedVariant || undefined });
                    }}
                    style={{ width: "100%", padding: "14px", background: "#4A6580", color: "#fff", border: "none", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", cursor: "pointer" }}
                  >
                    Add 2 to Cart — Save {disc}
                  </button>
                </div>
              );
            })}

            {/* ── Style it with Clip-ons ── */}
            {bundleOffers.filter(o => o.accessory_slug !== product.slug).length > 0 && (
              <div style={{ border: "1px solid #E8E3DD", borderRadius: "12px", overflow: "hidden", marginTop: "8px" }}>
                <div style={{ padding: "12px 18px", borderBottom: "1px solid #E8E3DD", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff" }}>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: "14px", fontWeight: 600, color: "#1a1a1a" }}>Style it with Clip-ons</p>
                  <span style={{ fontSize: "10px", color: "#888", letterSpacing: "0.08em", textTransform: "uppercase" }}>Exclusive bundle savings</span>
                </div>
                <div style={{ background: "#fff", padding: "0 18px" }}>
                {bundleOffers.filter(o => o.accessory_slug !== product.slug).map((offer) => {
                  const discountedPrice = offer.discount_type === "percentage"
                    ? Math.round(offer.product.price * (1 - offer.discount_value / 100))
                    : Math.max(0, Math.round(offer.product.price - offer.discount_value));
                  const bundleDiscount = Math.round(((offer.product.price - discountedPrice) / offer.product.price) * 100);
                  const bundleVariant = bundleVariants[offer.id] ?? offer.product.variants.options[0] ?? "";

                  return (
                    <div key={offer.id} className="flex items-center gap-3" style={{ padding: "14px 0", borderBottom: "1px solid #F0EDEA" }}>
                      {/* Thumbnail */}
                      <div className="rounded-[8px] overflow-hidden flex-shrink-0" style={{ width: "64px", height: "64px", background: "#EDE8E1" }}>
                        <img src={offer.product.image} alt={offer.product.title} style={{ width: "64px", height: "64px", objectFit: "cover", display: "block" }} />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: "13px", fontWeight: 500, color: "#1a1a1a", marginBottom: "3px" }} className="truncate">
                          {offer.product.title}
                        </p>
                        {offer.product.variants.type !== "none" && offer.product.variants.options.length > 0 && (
                          <select
                            value={bundleVariant}
                            onChange={(e) => setBundleVariants((prev) => ({ ...prev, [offer.id]: e.target.value }))}
                            style={{ fontSize: "11px", color: "#888", border: "none", background: "transparent", cursor: "pointer", padding: 0, marginBottom: "3px" }}
                          >
                            {offer.product.variants.options.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        )}
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a1a" }}>₹{discountedPrice.toLocaleString("en-IN")}</span>
                          <span style={{ fontSize: "11px", color: "#bbb", textDecoration: "line-through" }}>₹{offer.product.price.toLocaleString("en-IN")}</span>
                          {bundleDiscount > 0 && (
                            <span style={{ fontSize: "10px", background: "#ECFDF5", color: "#059669", fontWeight: 600, padding: "2px 7px", borderRadius: "100px" }}>{bundleDiscount}% off</span>
                          )}
                        </div>
                      </div>
                      {/* Add button */}
                      <button
                        onClick={() => addBundleItem(offer)}
                        className="flex-shrink-0 transition-all"
                        style={{
                          padding: "8px 18px", borderRadius: "100px",
                          border: addedBundle[offer.id] ? "1.5px solid #16a34a" : "1.5px solid #3B5373",
                          background: "transparent",
                          color: addedBundle[offer.id] ? "#16a34a" : "#3B5373",
                          fontSize: "12px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.04em",
                        }}
                      >
                        {addedBundle[offer.id] ? "✓ Added" : "+ Add"}
                      </button>
                    </div>
                  );
                })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          FULL-WIDTH BELOW FOLD
      ══════════════════════════════════════════ */}

      {/* ── Trust Badges Strip ── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-14 mb-0">
        <div className="overflow-hidden" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", border: "1px solid #E8E3DD", borderRadius: "12px" }}>
          {[
            { icon: "🚚", text: "Free Shipping", sub: "on orders ₹999+" },
            { icon: "↩", text: "Easy Returns",   sub: "7-day policy" },
            { icon: "💳", text: "COD Available", sub: "all orders" },
          ].map((item, i) => (
            <div key={item.text} className="text-center" style={{ padding: "16px 10px", borderRight: i < 2 ? "1px solid #E8E3DD" : "none" }}>
              <div style={{ fontSize: "22px", marginBottom: "6px" }}>{item.icon}</div>
              <div style={{ fontSize: "12px", fontWeight: 500, color: "#1a1a1a", marginBottom: "2px" }}>{item.text}</div>
              <div style={{ fontSize: "11px", color: "#888" }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Accordion ── */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-14 mt-8">
        <div style={{ borderTop: "1px solid #E8E3DD" }}>
          {[
            { id: "description",  label: "Description",  content: product.description },
            { id: "key-features", label: "Key Features",  content: `Signature handcrafted detailing | Classie Comfort cushioned insole | Premium material finish | Anti-slip durable sole | Refined quality construction.` },
            { id: "other-info",   label: "Other Info",    content: `Clean with a soft, dry cloth only. Avoid contact with water, perfumes, or harsh chemicals. Store in a dust bag or box to preserve the finish.` },
          ].map((acc) => (
            <div key={acc.id} style={{ borderBottom: "1px solid #E8E3DD" }}>
              <button
                className="w-full flex items-center justify-between text-left"
                style={{ padding: "16px 0", fontSize: "13.5px", fontWeight: 500, color: "#1a1a1a", background: "none", border: "none", cursor: "pointer" }}
                onClick={() => setOpenAcc(openAcc === acc.id ? null : acc.id)}
              >
                <span>{acc.label}</span>
                <span style={{ fontSize: "18px", color: "#888" }}>{openAcc === acc.id ? "−" : "+"}</span>
              </button>
              {openAcc === acc.id && (
                <div style={{ paddingBottom: "18px", fontSize: "13px", color: "#555", lineHeight: 1.85 }}>
                  {acc.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Feature Tiles ── */}
      <div style={{ background: "#f7f7f7", padding: "60px 0" }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-14">
          <h2 className="font-serif text-center" style={{ fontSize: "28px", color: "#3B5373", marginBottom: "32px" }}>
            Designed for Every Moment
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {tiles.map((tile, i) => (
              <div key={i} className="text-center" style={{ padding: "28px 20px", border: "1.5px solid #3B5373", borderRadius: "8px", background: "#fff" }}>
                <div style={{ fontSize: "30px", marginBottom: "12px" }}>{tile.icon}</div>
                <div style={{ fontSize: "12.5px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#3B5373", marginBottom: "8px" }}>{tile.title}</div>
                <div style={{ fontSize: "12px", color: "#888", lineHeight: 1.6 }}>{tile.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Shop the Full Collection ── */}
      <div style={{ padding: "60px 0 80px" }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-14">
          {/* Header */}
          <div className="text-center" style={{ marginBottom: "32px" }}>
            <h2 className="font-serif" style={{ fontSize: "30px", letterSpacing: "0.06em", textTransform: "uppercase", color: "#3B5373", marginBottom: "16px" }}>
              Shop the Full Collection
            </h2>
            <div style={{ display: "inline-flex", borderBottom: "2px solid #E8E3DD" }}>
              {(["latest", "bestseller"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setCollTab(t)}
                  style={{
                    padding: "8px 24px", fontSize: "12px", fontWeight: 600,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    cursor: "pointer", background: "none", border: "none",
                    borderBottom: collTab === t ? "2px solid #3B5373" : "2px solid transparent",
                    marginBottom: "-2px",
                    color: collTab === t ? "#3B5373" : "#888",
                    transition: "all 0.2s",
                  }}
                >
                  {t === "latest" ? "Latest Styles" : "Best Sellers"}
                </button>
              ))}
            </div>
          </div>

          {/* Product grid */}
          {collProducts.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: `${advGap}px` }}>
              {collProducts.slice(0, 4).map((p) => (
                <ProductCard
                  key={p.slug}
                  product={p}
                  cardStyle={{
                    aspectRatio: advAspect !== "none" ? advAspect : undefined,
                    borderRadius: radiusMap[advRadius] || "",
                    height: advCardH || undefined,
                  }}
                />
              ))}
            </div>
          ) : related.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: `${advGap}px` }}>
              {related.slice(0, 4).map((p) => (
                <ProductCard
                  key={p.slug}
                  product={p}
                  cardStyle={{
                    aspectRatio: advAspect !== "none" ? advAspect : undefined,
                    borderRadius: radiusMap[advRadius] || "",
                    height: advCardH || undefined,
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-sm" style={{ color: "#888" }}>No products found.</p>
          )}
        </div>
      </div>

      {/* ── Customer Reviews ── */}
      <div style={{ background: "#f7f7f7", padding: "60px 0" }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-14">
          {/* Header: score + bars */}
          <div className="flex gap-10 items-start" style={{ marginBottom: "32px", flexWrap: "wrap" }}>
            <div>
              <h2 className="font-serif" style={{ fontSize: "26px", color: "#3B5373", marginBottom: "8px" }}>Customer Reviews</h2>
              <div style={{ fontSize: "48px", fontWeight: 700, color: "#1a1a1a", lineHeight: 1 }}>5.0</div>
              <div style={{ color: "#D4A843", fontSize: "18px", margin: "4px 0" }}>★★★★★</div>
              <div style={{ fontSize: "13px", color: "#888" }}>{STATIC_REVIEWS.length} reviews</div>
              <button
                style={{ marginTop: "12px", padding: "12px 28px", border: "1.5px solid #3B5373", color: "#3B5373", background: "#fff", borderRadius: "4px", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}
              >
                Write a Review
              </button>
            </div>
            <div style={{ flex: 1, minWidth: "200px" }}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = star === 5 ? STATIC_REVIEWS.length : 0;
                const pct = STATIC_REVIEWS.length > 0 ? (count / STATIC_REVIEWS.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2.5" style={{ marginBottom: "6px" }}>
                    <span style={{ fontSize: "12px", width: "24px", textAlign: "right" }}>{star} ★</span>
                    <div style={{ flex: 1, height: "6px", background: "#E8E3DD", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "#D4A843", borderRadius: "3px" }} />
                    </div>
                    <span style={{ fontSize: "12px", color: "#888", width: "16px" }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
            {STATIC_REVIEWS.map((rev) => (
              <div key={rev.name} style={{ background: "#fff", borderRadius: "8px", padding: "24px", border: "1px solid #E8E3DD" }}>
                <div className="flex items-center gap-3" style={{ marginBottom: "8px" }}>
                  <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: "36px", height: "36px", background: "#3B5373", color: "#fff", fontSize: "14px", fontWeight: 600 }}>
                    {rev.initial}
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a1a" }}>{rev.name}</div>
                    <div style={{ fontSize: "11px", color: "#888" }}>{rev.date}</div>
                  </div>
                  <div style={{ color: "#D4A843", fontSize: "12px", marginLeft: "auto" }}>{"★".repeat(rev.rating)}</div>
                </div>
                <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7 }}>{rev.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Related Products (You May Also Like) — hidden ── */}
    </>
  );
}
