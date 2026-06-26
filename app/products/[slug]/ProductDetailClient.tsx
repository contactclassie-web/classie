"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Check, ChevronRight, Plus, Minus } from "lucide-react";
import { Product } from "@/lib/products";
import { useCart } from "@/components/CartContext";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";
import { BundleOfferWithProduct, FeatureTile, ColorVariant, ProductReview } from "./page";

// ── Types ──────────────────────────────────────────────────────────────────

const GOLD = "#C9A84C";

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

// ── Component ─────────────────────────────────────────────────────────────

export default function ProductDetailClient({
  product,
  related,
  bundleOffers = [],
  featureTiles = [],
  latestProducts = [],
  bestsellerProducts = [],
  colorVariants = [],
  initialReviews = [],
}: {
  product: Product;
  related: Product[];
  bundleOffers?: BundleOfferWithProduct[];
  featureTiles?: FeatureTile[];
  latestProducts?: Product[];
  bestsellerProducts?: Product[];
  colorVariants?: ColorVariant[];
  initialReviews?: ProductReview[];
}) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  // Prefetch color variant pages on mount for instant navigation
  useEffect(() => {
    colorVariants.forEach(v => {
      if (v.product_slug !== product.slug) router.prefetch(`/products/${v.product_slug}`);
    });
  }, [colorVariants, product.slug, router]);

  // Preload all gallery images for instant switching
  useEffect(() => {
    const imgs = [product.image, ...(product.images ?? [])].filter(Boolean).slice(0, 10);
    imgs.forEach(src => {
      if (src) { const img = new window.Image(); img.src = src; }
    });
  }, [product.image, product.images]);
  const [selectedVariant, setSelectedVariant] = useState(product.variants.options[0] ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [addedBundle, setAddedBundle] = useState<Record<string, boolean>>({});
  const [bundleVariants, setBundleVariants] = useState<Record<string, string>>({});
  const [openAcc, setOpenAcc] = useState<string | null>("description");
  const [collTab, setCollTab] = useState<"latest" | "bestseller">("latest");

  // ── Reviews state ──────────────────────────────────────────────────────
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, text: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const reviewsRef = useRef<HTMLDivElement>(null);

  // Gallery images: main + additional (up to 10), plus optional video
  const rawImages = [product.image, ...(product.images ?? [])].filter(Boolean);
  const galleryImages = rawImages.slice(0, 10);
  const hasVideo = !!product.video_url;
  const [currentIndex, setCurrentIndex] = useState(0);
  const mainImage = galleryImages[currentIndex] ?? galleryImages[0];
  const [showVideo, setShowVideo] = useState(false);

  const goPrev = () => { setShowVideo(false); setCurrentIndex(i => (i - 1 + galleryImages.length) % galleryImages.length); };
  const goNext = () => { setShowVideo(false); setCurrentIndex(i => (i + 1) % galleryImages.length); };

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

  const specs: string[][] = (product.specs && product.specs.length > 0)
    ? product.specs.map((r: {label:string;value:string}) => [r.label, r.value])
    : (SPECS[product.category] ?? []);
  const featureChecks = (product.feature_checks && product.feature_checks.trim())
    ? product.feature_checks.split("|").map((s: string) => s.trim()).filter(Boolean)
    : FEATURE_CHECKS;
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
            {/* Main image carousel with left/right arrows */}
            <div className="relative rounded-[4px] overflow-hidden mb-3" style={{ aspectRatio: "1/1", background: "#F9F9F9" }}>
              {showVideo && product.video_url ? (
                <video
                  src={product.video_url}
                  controls autoPlay
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ background: "#000" }}
                />
              ) : (
                <Image
                  src={mainImage}
                  alt={product.title}
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 768px) 100vw, 52vw"
                  priority
                />
              )}
              {discount > 0 && !showVideo && (
                <span className="absolute top-4 left-4 text-white text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "#3B5373", fontSize: "11px", letterSpacing: "0.04em" }}>
                  -{discount}% OFF
                </span>
              )}
              {/* Left arrow */}
              {(galleryImages.length > 1 || hasVideo) && !showVideo && (
                <button
                  onClick={goPrev}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center"
                  style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.85)", border: "1px solid #e0e0e0", boxShadow: "0 1px 6px rgba(0,0,0,0.10)", cursor: "pointer", zIndex: 10, transition: "background 0.2s" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
              )}
              {/* Right arrow */}
              {(galleryImages.length > 1 || hasVideo) && !showVideo && (
                <button
                  onClick={hasVideo && currentIndex === galleryImages.length - 1 ? () => setShowVideo(true) : goNext}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center"
                  style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.85)", border: "1px solid #e0e0e0", boxShadow: "0 1px 6px rgba(0,0,0,0.10)", cursor: "pointer", zIndex: 10, transition: "background 0.2s" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              )}
              {/* Dot indicators */}
              {/* dots removed — thumbnails shown below */}
            </div>

            {/* Thumbnails row */}
            {(galleryImages.length > 1 || hasVideo) && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setShowVideo(false); setCurrentIndex(i); }}
                    style={{
                      flexShrink: 0,
                      width: "68px", height: "68px",
                      borderRadius: "6px",
                      overflow: "hidden",
                      border: i === currentIndex && !showVideo ? "2px solid #3B5373" : "2px solid transparent",
                      padding: 0,
                      background: "#f5f5f5",
                      cursor: "pointer",
                      transition: "border-color 0.2s",
                      position: "relative",
                    }}
                  >
                    <img src={img} alt={`Image ${i + 1}`} loading="eager" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
                  </button>
                ))}
                {hasVideo && product.video_url && (
                  <button
                    onClick={() => setShowVideo(true)}
                    style={{
                      flexShrink: 0,
                      width: "68px", height: "68px",
                      borderRadius: "6px",
                      overflow: "hidden",
                      border: showVideo ? "2px solid #3B5373" : "2px solid transparent",
                      padding: 0,
                      background: "#1a1a1a",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "border-color 0.2s",
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
                  </button>
                )}
              </div>
            )}
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

            {/* Stars — dynamic from reviews */}
            {reviews.length > 0 && (() => {
              const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
              return (
                <div className="flex items-center gap-2" style={{ marginBottom: "18px" }}>
                  <span style={{ color: GOLD, fontSize: "14px", letterSpacing: "2px" }}>{"★".repeat(Math.round(avg))}{"☆".repeat(5 - Math.round(avg))}</span>
                  <button
                    onClick={() => reviewsRef.current?.scrollIntoView({ behavior: "smooth" })}
                    style={{ fontSize: "12px", color: "#888", textDecoration: "underline", cursor: "pointer", background: "none", border: "none", padding: 0 }}
                  >
                    {avg.toFixed(1)} · {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                  </button>
                </div>
              );
            })()}

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
              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontSize: "13px", fontWeight: 500, color: "#1a1a1a", marginBottom: "2px" }}>Available in</p>
                <p style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: "12px" }}>
                  {colorVariants.find(v => v.product_slug === product.slug)?.color_name || ""}
                </p>
                <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "flex-start" }}>
                  {colorVariants.map((v) => {
                    const isActive = v.product_slug === product.slug;
                    const circle = (
                      <div style={{
                        width: "64px", height: "64px", borderRadius: "50%", overflow: "hidden",
                        border: isActive ? "2px solid #3B5373" : "1.5px solid #D8D8D8",
                        background: "#F5F5F5", flexShrink: 0,
                        boxShadow: isActive ? "0 0 0 3px #fff, 0 0 0 5px #3B5373" : "none",
                        cursor: isActive ? "default" : "pointer",
                        transition: "box-shadow 0.15s",
                      }}>
                        {v.image ? (
                          <img src={v.image} alt={v.color_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", background: v.color_hex }} />
                        )}
                      </div>
                    );
                    return isActive ? (
                      <div key={v.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                        {circle}
                        <span style={{ fontSize: "10px", color: "#3B5373", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{v.color_name}</span>
                      </div>
                    ) : (
                      <button key={v.id} onClick={() => { setNavigatingTo(v.product_slug); router.push(`/products/${v.product_slug}`); }}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", background: "none", border: "none", padding: 0, cursor: "pointer", opacity: navigatingTo === v.product_slug ? 0.6 : 1, transition: "opacity 0.15s" }}>
                        {circle}
                        <span style={{ fontSize: "10px", color: navigatingTo === v.product_slug ? "#3B5373" : "#888", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: navigatingTo === v.product_slug ? 700 : 400 }}>{v.color_name}</span>
                      </button>
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
                    {product.variant_label || "Shoe Size (EU)"}
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
              {featureChecks.map((feat) => (
                <div key={feat} className="flex items-center gap-1.5" style={{ fontSize: "12.5px", color: "#444" }}>
                  <span style={{ color: "#3B5373", fontWeight: 700, fontSize: "14px" }}>✓</span>
                  {feat}
                </div>
              ))}
            </div>

            {/* Promo line — admin editable */}
            {product.promo_line && (
              <p className="flex items-center gap-1.5" style={{ fontSize: "12.5px", color: "#3B5373", fontWeight: 500, marginBottom: "16px" }}>
                {product.promo_line}
              </p>
            )}

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
            { id: "key-features", label: "Key Features",  content: product.key_features || `Signature handcrafted detailing. Classie Comfort cushioned insole. Premium material finish. Anti-slip durable sole. Refined quality construction.` },
            { id: "other-info",   label: "Other Info",    content: product.other_info || `Clean with a soft, dry cloth only. Avoid contact with water, perfumes, or harsh chemicals. Store in a dust bag or box to preserve the finish.` },
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
      <div style={{ background: "#f7f7f7", padding: "40px 0" }}>
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
      <div style={{ padding: "40px 0 60px" }}>
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
      <div id="reviews" ref={reviewsRef} style={{ background: "#f7f7f7", padding: reviews.length > 0 ? "40px 0" : "24px 0" }}>
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-14">
          {/* Header: score + bars */}
          {(() => {
            const total = reviews.length;
            const avg = total > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
            const starCounts = [5, 4, 3, 2, 1].map(star => ({ star, count: reviews.filter(r => r.rating === star).length }));
            return (
              <>
                <div className="flex gap-10 items-start" style={{ marginBottom: "32px", flexWrap: "wrap" }}>
                  <div>
                    <h2 className="font-serif" style={{ fontSize: "26px", color: "#3B5373", marginBottom: "8px" }}>Customer Reviews</h2>
                    {total > 0 ? (
                      <>
                        <div style={{ fontSize: "48px", fontWeight: 700, color: "#1a1a1a", lineHeight: 1 }}>{avg.toFixed(1)}</div>
                        <div style={{ color: GOLD, fontSize: "18px", margin: "4px 0" }}>{"★".repeat(Math.round(avg))}{"☆".repeat(5 - Math.round(avg))}</div>
                        <div style={{ fontSize: "13px", color: "#888" }}>{total} {total === 1 ? "review" : "reviews"}</div>
                      </>
                    ) : (
                      <p style={{ fontSize: "13px", color: "#888", marginTop: "8px" }}>Be the first to review this product!</p>
                    )}
                    <button
                      onClick={() => setShowWriteReview(true)}
                      style={{ marginTop: "14px", padding: "12px 28px", border: "1.5px solid #3B5373", color: "#3B5373", background: "#fff", borderRadius: "4px", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer" }}
                    >
                      Write a Review
                    </button>
                  </div>
                  {total > 0 && (
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      {starCounts.map(({ star, count }) => {
                        const pct = total > 0 ? (count / total) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-2.5" style={{ marginBottom: "6px" }}>
                            <span style={{ fontSize: "12px", width: "24px", textAlign: "right" }}>{star} ★</span>
                            <div style={{ flex: 1, height: "6px", background: "#E8E3DD", borderRadius: "3px", overflow: "hidden" }}>
                              <div style={{ height: "100%", width: `${pct}%`, background: GOLD, borderRadius: "3px" }} />
                            </div>
                            <span style={{ fontSize: "12px", color: "#888", width: "16px" }}>{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Review cards */}
                {reviews.length > 0 && (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
                    {reviews.map((rev) => {
                      const dateStr = rev.review_date
                        ? new Date(rev.review_date).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })
                        : "";
                      return (
                        <div key={rev.id} style={{ background: "#fff", borderRadius: "8px", padding: "24px", border: "1px solid #E8E3DD" }}>
                          <div className="flex items-center gap-3" style={{ marginBottom: "8px" }}>
                            <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: "36px", height: "36px", background: "#3B5373", color: "#fff", fontSize: "14px", fontWeight: 600 }}>
                              {rev.customer_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a1a" }}>{rev.customer_name}</div>
                              <div style={{ fontSize: "11px", color: "#888" }}>{dateStr}</div>
                            </div>
                            <div style={{ color: GOLD, fontSize: "12px", marginLeft: "auto" }}>{"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}</div>
                          </div>
                          {rev.review_text && <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7 }}>{rev.review_text}</p>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>

      {/* ── Write a Review Modal ── */}
      {showWriteReview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowWriteReview(false); }}
        >
          <div style={{ background: "#fff", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "480px", margin: "16px", position: "relative" }}>
            <button
              onClick={() => { setShowWriteReview(false); setReviewSubmitted(false); setReviewForm({ name: "", rating: 5, text: "" }); }}
              style={{ position: "absolute", top: "16px", right: "16px", background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#888" }}
            >×</button>
            <h3 className="font-serif" style={{ fontSize: "20px", color: "#3B5373", marginBottom: "20px" }}>Write a Review</h3>
            {reviewSubmitted ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>🌟</div>
                <p style={{ fontSize: "15px", color: "#3B5373", fontWeight: 600 }}>Thank you!</p>
                <p style={{ fontSize: "13px", color: "#888", marginTop: "6px" }}>Your review will appear after approval.</p>
                <button
                  onClick={() => { setShowWriteReview(false); setReviewSubmitted(false); setReviewForm({ name: "", rating: 5, text: "" }); }}
                  style={{ marginTop: "20px", padding: "10px 28px", background: "#3B5373", color: "#fff", border: "none", borderRadius: "100px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!reviewForm.name.trim()) return;
                setReviewSubmitting(true);
                try {
                  const res = await fetch("/api/reviews", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      product_slug: product.slug,
                      customer_name: reviewForm.name.trim(),
                      rating: reviewForm.rating,
                      review_text: reviewForm.text.trim(),
                    }),
                  });
                  if (res.ok) setReviewSubmitted(true);
                } finally {
                  setReviewSubmitting(false);
                }
              }}>
                {/* Name */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#888", marginBottom: "6px" }}>Your Name *</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm(f => ({ ...f, name: e.target.value }))}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E8E3DD", borderRadius: "8px", fontSize: "13px", outline: "none" }}
                    placeholder="e.g. Priya S."
                  />
                </div>
                {/* Rating */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#888", marginBottom: "8px" }}>Rating *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm(f => ({ ...f, rating: star }))}
                        style={{ fontSize: "28px", background: "none", border: "none", cursor: "pointer", padding: "0", color: star <= reviewForm.rating ? GOLD : "#D8D8D8", transition: "color 0.15s" }}
                      >★</button>
                    ))}
                  </div>
                </div>
                {/* Review text */}
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#888", marginBottom: "6px" }}>Review</label>
                  <textarea
                    rows={4}
                    value={reviewForm.text}
                    onChange={(e) => setReviewForm(f => ({ ...f, text: e.target.value }))}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #E8E3DD", borderRadius: "8px", fontSize: "13px", resize: "vertical", outline: "none" }}
                    placeholder="Share your experience with this product…"
                  />
                </div>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  style={{ width: "100%", height: "48px", background: "#3B5373", color: "#fff", border: "none", borderRadius: "100px", fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: reviewSubmitting ? "not-allowed" : "pointer", opacity: reviewSubmitting ? 0.7 : 1 }}
                >
                  {reviewSubmitting ? "Submitting…" : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── Related Products (You May Also Like) — hidden ── */}
    </>
  );
}
