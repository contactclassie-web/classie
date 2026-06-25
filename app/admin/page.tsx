"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Lock, LogOut, RefreshCw, Package, IndianRupee, Clock,
  CheckCircle2, Truck, AlertCircle,
  Plus, Pencil, Trash2, Eye, EyeOff, X, Save, Mail, Users,
  Image as ImageIcon, Settings, LayoutTemplate, MessageSquare,
  LayoutDashboard, ShoppingCart, Layers, Grid3x3, Sparkles,
  Star, Camera, Palette, Home, Layout, Tag, Ruler,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// ── Interfaces ─────────────────────────────────────────────────────────────

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: Array<{ title: string; quantity: number; price: number; variant?: string }>;
  total_amount: number;
  status: string;
  payment_method: string;
  created_at: string;
}

interface DbProduct {
  id?: string;
  title: string;
  slug: string;
  price: number;
  compare_price: number;
  category: string;
  description: string;
  image: string;
  images: string[];
  video_url?: string;
  variant_type: string;
  variants: string[];
  heel_type?: string;
  toe_style?: string;
  heel_height?: string;
  ankle_strap?: boolean;
  shoe_fit?: string;
  tags?: string[];
  key_features?: string;
  other_info?: string;
  cod_available: boolean;
  free_shipping: boolean;
  is_featured: boolean;
  featured_tab?: string | null;
  active: boolean;
  created_at?: string;
}

interface HeroSlide {
  id?: string;
  headline: string;
  subheadline: string;
  cta_text: string;
  cta_url: string;
  bg_color: string;
  text_align: string;
  display_order: number;
  active: boolean;
  image_url?: string;
  video_url?: string;
  page?: string;
}

interface SiteSettings {
  logo_image_url: string;
  announcement_text: string;
  announcement_1: string;
  announcement_2: string;
  announcement_3: string;
  announcement_4: string;
  announcement_5: string;
  announcement_6: string;
  announcement_speed: string;
  announcement_mode: string;
  whatsapp_number: string;
  instagram_url: string;
  ig_handle: string; ig_heading: string; ig_subtext: string;
  ig_follow_text: string; ig_follow_url: string;
  nl_eyebrow: string; nl_heading: string; nl_heading_italic: string; nl_subtext: string;
  nl_placeholder: string; nl_btn_text: string; nl_success_text: string;
  philosophy_eyebrow: string;
  philosophy_headline: string;
  philosophy_headline_italic: string;
  philosophy_headline2: string;
  phil_stat1_number: string; phil_stat1_label: string;
  phil_stat2_number: string; phil_stat2_label: string;
  phil_stat3_number: string; phil_stat3_label: string;
  philosophy_body: string;
  philosophy_cta_text: string;
  philosophy_cta_url: string;
  phil_f1_title: string; phil_f1_desc: string;
  phil_f2_title: string; phil_f2_desc: string;
  phil_f3_title: string; phil_f3_desc: string;
  philosophy_image_url: string;
  // Hero section
  hero_eyebrow: string;
  hero_heading_line1: string;
  hero_heading_italic: string;
  hero_heading_line3: string;
  hero_subtitle: string;
  hero_cta1_text: string;
  hero_cta1_url: string;
  hero_cta2_text: string;
  hero_cta2_url: string;
  hero_image_url: string;
  hero_stat1_number: string;
  hero_stat1_label: string;
  hero_stat2_number: string;
  hero_stat2_label: string;
  hero_stat3_number: string;
  hero_stat3_label: string;
  hero_chip_code: string;
  hero_chip_text: string;
  hero_badge_text: string;
  hero_badge_sub: string;
  hero_badge_active: string;
  hero_pill_text: string;
  hero_pill_sub: string;
  hero_pill_active: string;
  band_text: string;
  fp_tab1_label: string; fp_tab1_active: string;
  fp_tab2_label: string; fp_tab2_active: string;
  fp_tab3_label: string; fp_tab3_active: string;
  fp_eyebrow: string; fp_heading: string; fp_heading_italic: string;
  cat_links_bold: string;
  cat_links_hover: string;
  cat_links_hover_bg: string;
  cat_links_hover_text: string;
  cat_num_color: string;
  cat_text_size: string;
  // Footer
  footer_logo_url: string;
  footer_tagline: string;
  footer_desc: string;
  footer_ig_url: string; footer_tiktok_url: string;
  footer_fb_url: string; footer_pinterest_url: string; footer_whatsapp_url: string;
  footer_shop_links: string;
  footer_help_links: string;
  footer_company_links: string;
  footer_copyright: string;
  footer_shop_heading: string;
  footer_help_heading: string;
  footer_company_heading: string;
}

interface FeatureBarItem {
  id?: string;
  icon: string;
  title: string;
  subtitle?: string;
  display_order: number;
  active: boolean;
}

interface Collection {
  id?: string;
  title: string;
  slug: string;
  description?: string;
  image_url?: string;
  hover_image_url?: string;
  tag_label?: string;
  image_position?: string;
  display_order: number;
  active: boolean;
}

interface SiteCategory {
  id?: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  display_order: number;
  active: boolean;
  created_at?: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

interface CtSubmission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at?: string;
  subscribed_at?: string;
}

interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  image_url: string;
  discount_type: "percent" | "flat";
  discount_value: number;
  active: boolean;
  require_phone: boolean;
  require_email: boolean;
  max_uses_total: number | null;
  max_uses_per_user: number;
  valid_from: string | null;
  valid_until: string | null;
  uses_count: number;
  min_order_value: number;
  display_order: number;
}

interface CouponUse {
  id: string;
  coupon_id: string;
  coupon_code?: string;
  user_phone: string | null;
  user_email: string | null;
  user_name: string | null;
  order_id: string | null;
  order_total: number | null;
  discount_applied: number | null;
  final_amount: number | null;
  products_json: Array<{ name: string; qty: number; price: number; variant?: string }> | null;
  items_count: number | null;
  used_at: string;
}

interface Testimonial {
  id?: string;
  customer_name: string;
  location: string;
  review_text: string;
  rating: number;
  active: boolean;
  display_order: number;
}

interface InstagramImage {
  id?: string;
  image_url: string;
  link_url: string;
  display_order: number;
  active: boolean;
}

interface StyleInspo {
  id?: string;
  title: string;
  image_url: string;
  link_url: string;
  tag: string;
  display_order: number;
  active: boolean;
  description?: string;
  media_type?: string;  // "image" | "video"
  look_number?: number;
}

const EMPTY_TESTIMONIAL: Testimonial = {
  customer_name: "", location: "", review_text: "", rating: 5, active: true, display_order: 0,
};

const EMPTY_INSTAGRAM: InstagramImage = {
  image_url: "", link_url: "https://www.instagram.com/_classie_in/", display_order: 0, active: true,
};

const EMPTY_STYLE_INSPO: StyleInspo = {
  title: "", image_url: "", link_url: "", tag: "", display_order: 0, active: true,
  description: "", media_type: "image", look_number: 0,
};

interface BundleOffer {
  id?: string;
  main_product_slug: string;
  accessory_slug: string;
  discount_type: string;
  discount_value: number;
  sort_order: number;
  active: boolean;
  custom_label?: string;
}

interface FeatureTileItem {
  icon: string;
  title: string;
  desc: string;
}

const DEFAULT_FEATURE_TILES_ADMIN: FeatureTileItem[] = [
  { icon: "🤍", title: "Made with Care", desc: "Handcrafted details for lasting elegance" },
  { icon: "🌤", title: "All-Season Wear", desc: "Versatile style for every season" },
  { icon: "👗", title: "Casual to Formal", desc: "Effortlessly transitions day to evening" },
  { icon: "🌙", title: "Day to Night", desc: "From morning meetings to evening soirées" },
];

// ── Constants ──────────────────────────────────────────────────────────────

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

const STATUS_STYLES: Record<string, string> = {
  pending:    "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped:    "bg-purple-100 text-purple-700",
  delivered:  "bg-emerald-100 text-emerald-700",
  cancelled:  "bg-red-100 text-red-700",
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  pending:    Clock,
  processing: Package,
  shipped:    Truck,
  delivered:  CheckCircle2,
  cancelled:  AlertCircle,
};

const EMPTY_PRODUCT: DbProduct = {
  title: "", slug: "", price: 0, compare_price: 0,
  category: "heels", description: "", image: "", images: [], video_url: "",
  variant_type: "none", variants: [], heel_type: "", toe_style: "",
  heel_height: "", ankle_strap: false, shoe_fit: "", tags: [],
  key_features: "", other_info: "",
  cod_available: true, free_shipping: false, is_featured: false, featured_tab: null, active: true,
};

const EMPTY_SLIDE: HeroSlide = {
  headline: "", subheadline: "", cta_text: "", cta_url: "",
  bg_color: "#3B5373", text_align: "left", display_order: 0, active: true,
  image_url: "", video_url: "", page: "home",
};

// ── Helpers ────────────────────────────────────────────────────────────────

const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3B5373] transition-colors bg-white";
const labelCls = "block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1";

interface FooterLinkItem { text: string; url: string; }

type TabId = "dashboard" | "orders" | "products" | "slides" | "collections" | "categories" | "featured-picks" | "settings" | "footer" | "messages" | "testimonials" | "instagram" | "style-inspo" | "announcement" | "trust-band" | "heels-page" | "clips-page" | "bow-page" | "collections-page" | "style-ideas-page" | "style-ideas-featured" | "style-ideas-reels" | "adv-shop" | "adv-coll" | "adv-picks" | "adv-inspo" | "adv-related" | "hd-page" | "hd-coupons" | "hd-stats" | "au-hero" | "au-banner" | "au-story" | "au-features" | "au-founder" | "ct-hero" | "ct-help" | "ct-faq" | "ct-info" | "ct-inbox" | "sp-hero" | "sp-tiles" | "sp-content" | "sp-cta" | "sg-hero" | "sg-measure" | "sg-chart" | "sg-tips" | "sg-cta" | "re-hero" | "re-tiles" | "re-policy" | "re-cta" | "philosophy" | "product-page";
type MainSection = "dashboard" | "homepage" | "catalog" | "heels" | "clips-page" | "bow-page" | "collections-page" | "style-ideas-page" | "advanced-settings" | "orders" | "settings" | "footer" | "messages" | "hot-deals" | "about-us" | "contact-us" | "shipping-policy" | "size-guide" | "returns";

const TAB_TO_SECTION: Record<TabId, MainSection> = {
  "dashboard":      "dashboard",
  "slides":         "homepage",
  "featured-picks": "homepage",
  "testimonials":   "homepage",
  "instagram":      "homepage",
  "style-inspo":    "homepage",
  "announcement":   "homepage",
  "trust-band":     "homepage",
  "philosophy":     "homepage",
  "products":       "catalog",
  "collections":    "catalog",
  "categories":     "catalog",
  "product-page":   "catalog",
  "heels-page":     "heels",
  "clips-page":     "clips-page",
  "bow-page":           "bow-page",
  "collections-page":   "collections-page",
  "style-ideas-page":     "style-ideas-page",
  "style-ideas-featured": "style-ideas-page",
  "style-ideas-reels":    "style-ideas-page",

  "adv-shop":    "advanced-settings",
  "adv-coll":    "advanced-settings",
  "adv-picks":   "advanced-settings",
  "adv-inspo":   "advanced-settings",
  "adv-related": "advanced-settings",

  "hd-page":    "hot-deals",
  "hd-coupons": "hot-deals",
  "hd-stats":   "hot-deals",

  "au-hero":     "about-us",
  "au-banner":   "about-us",
  "au-story":    "about-us",
  "au-features": "about-us",
  "au-founder":  "about-us",

  "ct-hero":  "contact-us",
  "ct-help":  "contact-us",
  "ct-faq":   "contact-us",
  "ct-info":  "contact-us",
  "ct-inbox": "contact-us",

  "sp-hero":    "shipping-policy",
  "sp-tiles":   "shipping-policy",
  "sp-content": "shipping-policy",
  "sp-cta":     "shipping-policy",
  "sg-hero":    "size-guide",
  "sg-measure": "size-guide",
  "sg-chart":   "size-guide",
  "sg-tips":    "size-guide",
  "sg-cta":     "size-guide",

  "re-hero":   "returns",
  "re-tiles":  "returns",
  "re-policy": "returns",
  "re-cta":    "returns",

  "orders":         "orders",
  "settings":       "settings",
  "footer":         "footer",
  "messages":       "messages",
};

const SECTION_SUBTABS: Record<MainSection, { id: TabId; label: string }[]> = {
  dashboard: [],
  homepage: [
    { id: "slides",         label: "Hero" },
    { id: "announcement",   label: "Announcement" },
    { id: "featured-picks", label: "Featured Picks" },
    { id: "testimonials",   label: "Reviews" },
    { id: "instagram",      label: "Instagram" },
    { id: "style-inspo",    label: "Style Inspo" },
    { id: "trust-band",     label: "Trust Band" },
    { id: "philosophy",      label: "Philosophy" },
  ],
  catalog: [
    { id: "products",     label: "Products" },
    { id: "collections",  label: "Collections" },
    { id: "categories",   label: "Categories" },
    { id: "product-page", label: "Product Page" },
  ],
  heels:       [{ id: "heels-page", label: "Heels Page" }],
  "clips-page": [{ id: "clips-page", label: "Clips Page" }],
  "bow-page":          [{ id: "bow-page",         label: "Bow Page" }],
  "collections-page":  [{ id: "collections-page", label: "Collections Page" }],
  "style-ideas-page": [
    { id: "style-ideas-page",     label: "Style Ideas" },
    { id: "style-ideas-featured", label: "Featured Look" },
    { id: "style-ideas-reels",    label: "Style Reels" },
  ],
  "advanced-settings": [
    { id: "adv-shop",    label: "Shop Grid" },
    { id: "adv-coll",    label: "Collections Grid" },
    { id: "adv-picks",   label: "Featured Picks" },
    { id: "adv-inspo",   label: "Style Inspo" },
    { id: "adv-related", label: "Related Products" },
  ],
  "hot-deals": [
    { id: "hd-page",    label: "Page Settings" },
    { id: "hd-coupons", label: "Coupons" },
    { id: "hd-stats",   label: "Usage Stats" },
  ],
  "about-us": [
    { id: "au-hero",     label: "Hero" },
    { id: "au-banner",   label: "Banner" },
    { id: "au-story",    label: "Our Story" },
    { id: "au-features", label: "Features" },
    { id: "au-founder",  label: "Founder" },
  ],
  "contact-us": [
    { id: "ct-hero",  label: "Hero" },
    { id: "ct-help",  label: "Quick Help" },
    { id: "ct-faq",   label: "FAQ" },
    { id: "ct-info",  label: "Contact Info" },
    { id: "ct-inbox", label: "Inbox" },
  ],
  "shipping-policy": [
    { id: "sp-hero",    label: "Hero" },
    { id: "sp-tiles",   label: "Tiles" },
    { id: "sp-content", label: "Content" },
    { id: "sp-cta",     label: "CTA" },
  ],
  "size-guide": [
    { id: "sg-hero",    label: "Hero" },
    { id: "sg-measure", label: "How to Measure" },
    { id: "sg-chart",   label: "Size Chart" },
    { id: "sg-tips",    label: "Fit Tips" },
    { id: "sg-cta",     label: "CTA" },
  ],
  "returns": [
    { id: "re-hero",   label: "Hero" },
    { id: "re-tiles",  label: "Tiles" },
    { id: "re-policy", label: "Policy" },
    { id: "re-cta",    label: "CTA" },
  ],
  orders:   [],
  settings: [],
  footer:   [],
  messages: [],
};

// ── Main Component ─────────────────────────────────────────────────────────

export default function AdminPage() {
  // Auth
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState("");

  // Active tab
  const [tab, setTab] = useState<TabId>("dashboard");

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Products
  const [dbProducts, setDbProducts] = useState<DbProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>("all");
  const [productSearch, setProductSearch] = useState("");
  const [productModal, setProductModal] = useState<{ open: boolean; mode: "add" | "edit"; data: DbProduct }>({
    open: false, mode: "add", data: EMPTY_PRODUCT,
  });
  const [productSaving, setProductSaving] = useState(false);

  // Bundle Offers (inside product modal)
  const [bundleOffers, setBundleOffers] = useState<BundleOffer[]>([]);
  const [bundleOffersLoading, setBundleOffersLoading] = useState(false);
  const [newBundleOffer, setNewBundleOffer] = useState<{ accessory_slug: string; discount_type: string; discount_value: number; custom_label: string }>({ accessory_slug: "", discount_type: "percentage", discount_value: 0, custom_label: "" });
  const [bundleSearch, setBundleSearch] = useState("");
  const [bundleOfferSaving, setBundleOfferSaving] = useState(false);

  // Color Variants (inside product modal)
  const [colorVariants, setColorVariants] = useState<Array<{id:string;group_id:string;product_slug:string;color_name:string;color_hex:string;sort_order:number}>>([]);
  const [colorVariantsLoading, setColorVariantsLoading] = useState(false);
  const [colorVariantSaving, setColorVariantSaving] = useState(false);
  const [newColorVariant, setNewColorVariant] = useState({ product_slug: "", color_name: "", color_hex: "#000000" });
  const [myColorInfo, setMyColorInfo] = useState({ color_name: "", color_hex: "#000000" });

  // Feature tiles (product page settings)
  const [featureTiles, setFeatureTiles] = useState<FeatureTileItem[]>(DEFAULT_FEATURE_TILES_ADMIN);
  const [featureTilesSaving, setFeatureTilesSaving] = useState(false);

  // ── Heels Page state ──────────────────────────────────────────────────
  const [heelsPageProducts, setHeelsPageProducts] = useState<DbProduct[]>([]);
  const [heelsPageLoading, setHeelsPageLoading] = useState(false);
  const [heelsFilterTypes, setHeelsFilterTypes] = useState<string[]>([]);
  const [newFilterType, setNewFilterType] = useState("");
  const [heelsFilterSaving, setHeelsFilterSaving] = useState(false);
  // Hero settings
  const [heelsHeroBgType, setHeelsHeroBgType] = useState<"none"|"image"|"video"|"slider">("none");
  const [heelsHeroBgUrl, setHeelsHeroBgUrl] = useState("");
  const [heelsHeroSlides, setHeelsHeroSlides] = useState<string[]>([]);
  const [heelsHeroTextPos, setHeelsHeroTextPos] = useState<"left"|"center"|"right">("center");
  const [heelsHeroEyebrow, setHeelsHeroEyebrow] = useState("New Collection · SS25");
  const [heelsHeroTitle, setHeelsHeroTitle] = useState("Heels");
  const [heelsHeroSubtitle, setHeelsHeroSubtitle] = useState("Step into your story");
  const [heelsHeroShowStats, setHeelsHeroShowStats] = useState(true);
  const [heelsHeroStat1Val, setHeelsHeroStat1Val] = useState(""); // empty = auto (product count)
  const [heelsHeroStat1Label, setHeelsHeroStat1Label] = useState("Styles");
  const [heelsHeroStat2Val, setHeelsHeroStat2Val] = useState(""); // empty = auto (heel types)
  const [heelsHeroStat2Label, setHeelsHeroStat2Label] = useState("Heel Types");
  const [heelsHeroStat3Val, setHeelsHeroStat3Val] = useState("Free");
  const [heelsHeroStat3Label, setHeelsHeroStat3Label] = useState("Shipping ₹999+");
  const [heelsHeroSaving, setHeelsHeroSaving] = useState(false);
  // Why Choose section
  const [whyHeading, setWhyHeading] = useState("Why Choose");
  const [whyHeadingItalic, setWhyHeadingItalic] = useState("Classie?");
  const [whyCard1Icon, setWhyCard1Icon] = useState("✨");
  const [whyCard1Title, setWhyCard1Title] = useState("Designed to Transform");
  const [whyCard1Desc, setWhyCard1Desc] = useState("Interchangeable clip-ons let one heel match every look.");
  const [whyCard2Icon, setWhyCard2Icon] = useState("👠");
  const [whyCard2Title, setWhyCard2Title] = useState("Made for Everyday Wear");
  const [whyCard2Desc, setWhyCard2Desc] = useState("Comfort-first designs made for real movement, all day long.");
  const [whyCard3Icon, setWhyCard3Icon] = useState("♻️");
  const [whyCard3Title, setWhyCard3Title] = useState("Style That Lasts");
  const [whyCard3Desc, setWhyCard3Desc] = useState("Premium materials. Reusable clip-ons worn again and again.");
  const [whyFooterText, setWhyFooterText] = useState("Discover our curated collections designed to move seamlessly from everyday wear to special occasions.");
  const [whyVisible, setWhyVisible] = useState(true);
  const [whySaving, setWhySaving] = useState(false);

  // ── Clips Page state ──────────────────────────────────────────────────
  const [clipsPageProducts, setClipsPageProducts] = useState<DbProduct[]>([]);
  const [clipsPageLoading, setClipsPageLoading] = useState(false);
  const [clipsFilterTypes, setClipsFilterTypes] = useState<string[]>([]);
  const [newClipsFilterType, setNewClipsFilterType] = useState("");
  const [clipsFilterSaving, setClipsFilterSaving] = useState(false);
  const [clipsHeroBgType, setClipsHeroBgType] = useState<"none"|"image"|"video"|"slider">("none");
  const [clipsHeroBgUrl, setClipsHeroBgUrl] = useState("");
  const [clipsHeroSlides, setClipsHeroSlides] = useState<string[]>([]);
  const [clipsHeroTextPos, setClipsHeroTextPos] = useState<"left"|"center"|"right">("center");
  const [clipsHeroEyebrow, setClipsHeroEyebrow] = useState("New Collection · SS25");
  const [clipsHeroTitle, setClipsHeroTitle] = useState("Clip-ons");
  const [clipsHeroSubtitle, setClipsHeroSubtitle] = useState("Transform any look instantly");
  const [clipsHeroShowStats, setClipsHeroShowStats] = useState(true);
  const [clipsHeroStat1Val, setClipsHeroStat1Val] = useState("");
  const [clipsHeroStat1Label, setClipsHeroStat1Label] = useState("Styles");
  const [clipsHeroStat2Val, setClipsHeroStat2Val] = useState("");
  const [clipsHeroStat2Label, setClipsHeroStat2Label] = useState("Filter Types");
  const [clipsHeroStat3Val, setClipsHeroStat3Val] = useState("Free");
  const [clipsHeroStat3Label, setClipsHeroStat3Label] = useState("Shipping ₹999+");
  const [clipsHeroSaving, setClipsHeroSaving] = useState(false);
  const [clipsWhyHeading, setClipsWhyHeading] = useState("Why Choose");
  const [clipsWhyHeadingItalic, setClipsWhyHeadingItalic] = useState("Classie?");
  const [clipsWhyCard1Icon, setClipsWhyCard1Icon] = useState("✨");
  const [clipsWhyCard1Title, setClipsWhyCard1Title] = useState("Mix & Match");
  const [clipsWhyCard1Desc, setClipsWhyCard1Desc] = useState("Swap styles in seconds.");
  const [clipsWhyCard2Icon, setClipsWhyCard2Icon] = useState("💎");
  const [clipsWhyCard2Title, setClipsWhyCard2Title] = useState("Rhinestone Finish");
  const [clipsWhyCard2Desc, setClipsWhyCard2Desc] = useState("Handcrafted crystals.");
  const [clipsWhyCard3Icon, setClipsWhyCard3Icon] = useState("🔗");
  const [clipsWhyCard3Title, setClipsWhyCard3Title] = useState("Fits Any Heel");
  const [clipsWhyCard3Desc, setClipsWhyCard3Desc] = useState("Clips onto any Classie heel.");
  const [clipsWhyFooterText, setClipsWhyFooterText] = useState("Discover our curated clip-ons designed to transform any look instantly.");
  const [clipsWhyVisible, setClipsWhyVisible] = useState(true);
  const [clipsWhySaving, setClipsWhySaving] = useState(false);

  // ── Bow Page state ────────────────────────────────────────────────────
  const [bowPageProducts, setBowPageProducts] = useState<DbProduct[]>([]);
  const [bowPageLoading, setBowPageLoading] = useState(false);
  const [bowFilterTypes, setBowFilterTypes] = useState<string[]>([]);
  const [newBowFilterType, setNewBowFilterType] = useState("");
  const [bowFilterSaving, setBowFilterSaving] = useState(false);
  const [bowHeroBgType, setBowHeroBgType] = useState<"none"|"image"|"video"|"slider">("none");
  const [bowHeroBgUrl, setBowHeroBgUrl] = useState("");
  const [bowHeroSlides, setBowHeroSlides] = useState<string[]>([]);
  const [bowHeroTextPos, setBowHeroTextPos] = useState<"left"|"center"|"right">("center");
  const [bowHeroEyebrow, setBowHeroEyebrow] = useState("New Collection · SS25");
  const [bowHeroTitle, setBowHeroTitle] = useState("Bow Collection");
  const [bowHeroSubtitle, setBowHeroSubtitle] = useState("Romance in every step");
  const [bowHeroShowStats, setBowHeroShowStats] = useState(true);
  const [bowHeroStat1Val, setBowHeroStat1Val] = useState("");
  const [bowHeroStat1Label, setBowHeroStat1Label] = useState("Styles");
  const [bowHeroStat2Val, setBowHeroStat2Val] = useState("");
  const [bowHeroStat2Label, setBowHeroStat2Label] = useState("Filter Types");
  const [bowHeroStat3Val, setBowHeroStat3Val] = useState("Free");
  const [bowHeroStat3Label, setBowHeroStat3Label] = useState("Shipping ₹999+");
  const [bowHeroSaving, setBowHeroSaving] = useState(false);

  // ── Style Ideas Page state ─────────────────────────────────────────────
  const [siPageLoading, setSiPageLoading] = useState(false);
  const [siHeroBgType, setSiHeroBgType] = useState<"none"|"image"|"video"|"slider">("none");
  const [siHeroBgUrl, setSiHeroBgUrl] = useState("");
  const [siHeroSlides, setSiHeroSlides] = useState<string[]>([]);
  const [siHeroTextPos, setSiHeroTextPos] = useState<"left"|"center"|"right">("center");
  const [siHeroEyebrow, setSiHeroEyebrow] = useState("Lookbook 2024");
  const [siHeroTitle, setSiHeroTitle] = useState("One Pair.");
  const [siHeroTitleItalic, setSiHeroTitleItalic] = useState("Every Occasion.");
  const [siHeroSubtitle, setSiHeroSubtitle] = useState("Style ideas, outfit inspo, and the looks our team is loving right now.");
  const [siHeroShowStats, setSiHeroShowStats] = useState(false);
  const [siHeroStat1Val, setSiHeroStat1Val] = useState("");
  const [siHeroStat1Label, setSiHeroStat1Label] = useState("Looks");
  const [siHeroStat2Val, setSiHeroStat2Val] = useState("");
  const [siHeroStat2Label, setSiHeroStat2Label] = useState("Styles");
  const [siHeroStat3Val, setSiHeroStat3Val] = useState("Free");
  const [siHeroStat3Label, setSiHeroStat3Label] = useState("Shipping ₹999+");
  const [siHeroSaving, setSiHeroSaving] = useState(false);
  const [siOccasions, setSiOccasions] = useState<string[]>(["All Looks","Date Night","Work & Play","Festive","Casual","Wedding"]);
  const [siOccasionsVisible, setSiOccasionsVisible] = useState(true);
  const [siOccasionsSaving, setSiOccasionsSaving] = useState(false);
  const [newSiOccasion, setNewSiOccasion] = useState("");
  const [siCardsPerRow, setSiCardsPerRow] = useState(4);
  const [siCardsShowTag, setSiCardsShowTag] = useState(true);
  const [siLooksHeading, setSiLooksHeading] = useState("Shop the Look");
  const [siLooksHeadingSaving, setSiLooksHeadingSaving] = useState(false);
  // Look Cards advanced controls
  const [siLooksMobile, setSiLooksMobile] = useState(2);
  const [siLooksGap, setSiLooksGap] = useState(16);
  const [siLooksAspect, setSiLooksAspect] = useState("3/4");
  const [siLooksRadius, setSiLooksRadius] = useState("sharp");
  const [siLooksCardH, setSiLooksCardH] = useState(0); // 0 = auto (aspect controls)
  const [siLooksAdvSaving, setSiLooksAdvSaving] = useState(false);
  const [siCardsPerRowSaving, setSiCardsPerRowSaving] = useState(false);

  // Featured Look section state
  const [siFeaturedVisible, setSiFeaturedVisible] = useState(true);
  const [siFeaturedLabel, setSiFeaturedLabel] = useState("EDITOR'S PICK");
  const [siFeaturedHeading, setSiFeaturedHeading] = useState("The Look Everyone's Asking About");
  const [siFeaturedDesc, setSiFeaturedDesc] = useState("Our bestselling heel paired with our top clip-ons — worn at brunches, weddings, and rooftop parties across the country.");
  const [siFeaturedImage, setSiFeaturedImage] = useState("");
  const [siFeaturedMediaType, setSiFeaturedMediaType] = useState<"image"|"video">("image");
  const [siFeaturedProducts, setSiFeaturedProducts] = useState<string[]>([]); // array of product IDs
  const [siFeaturedSearch, setSiFeaturedSearch] = useState("");
  const [siFeaturedCta1Text, setSiFeaturedCta1Text] = useState("SHOP THIS LOOK");
  const [siFeaturedCta1Url, setSiFeaturedCta1Url] = useState("/shop/heels");
  const [siFeaturedCta2Text, setSiFeaturedCta2Text] = useState("VIEW ALL HEELS");
  const [siFeaturedCta2Url, setSiFeaturedCta2Url] = useState("/shop/heels");
  const [siFeaturedSaving, setSiFeaturedSaving] = useState(false);
  // Style Reels section
  const [siReelsVisible,   setSiReelsVisible]   = useState(true);
  const [siReelsHeading,   setSiReelsHeading]   = useState('"Because Your Style Never Stays the Same."');
  const [siReelsSubtitle,  setSiReelsSubtitle]  = useState('Watch how real women are styling their Classie heels');
  const [siReelsCols,      setSiReelsCols]      = useState(4);
  const [siReelsCards,     setSiReelsCards]     = useState<{title:string;tag:string;media_url:string;media_type:"image"|"video"}[]>([]);
  const [siReelsCardH,     setSiReelsCardH]     = useState(480);
  const [siReelsCardW,     setSiReelsCardW]     = useState(0);
  const [siReelsGap,       setSiReelsGap]       = useState(12);
  const [siReelsAspect,    setSiReelsAspect]    = useState("none"); // none|9/16|4/5|3/4|1/1|16/9
  const [siReelsRadius,    setSiReelsRadius]    = useState("sharp"); // sharp|slight|rounded|pill
  const [siReelsMobileCols,setSiReelsMobileCols] = useState(2);
  const [siReelsSaving,    setSiReelsSaving]    = useState(false);

  // ── Advanced Settings state ───────────────────────────────────────────────
  const [advShopMobile,    setAdvShopMobile]    = useState(2);
  const [advShopDesktop,   setAdvShopDesktop]   = useState(4);
  const [advShopGap,       setAdvShopGap]       = useState(16);
  const [advCollMobile,    setAdvCollMobile]    = useState(2);
  const [advCollDesktop,   setAdvCollDesktop]   = useState(4);
  const [advCollGap,       setAdvCollGap]       = useState(12);
  const [advPicksMobile,   setAdvPicksMobile]   = useState(2);
  const [advPicksDesktop,  setAdvPicksDesktop]  = useState(4);
  const [advPicksGap,      setAdvPicksGap]      = useState(12);
  const [advInspoDesktop,  setAdvInspoDesktop]  = useState(4);
  const [advInspoGap,      setAdvInspoGap]      = useState(4);
  const [advRelatedMobile, setAdvRelatedMobile] = useState(2);
  const [advRelatedDesktop,setAdvRelatedDesktop]= useState(4);
  const [advRelatedGap,    setAdvRelatedGap]    = useState(16);
  const [advShopAspect,    setAdvShopAspect]    = useState("4/5");
  const [advShopRadius,    setAdvShopRadius]    = useState("sharp");
  const [advShopCardH,     setAdvShopCardH]     = useState(0);
  const [advCollAspect,    setAdvCollAspect]    = useState("4/5");
  const [advCollRadius,    setAdvCollRadius]    = useState("sharp");
  const [advCollCardH,     setAdvCollCardH]     = useState(0);
  const [advPicksAspect,   setAdvPicksAspect]   = useState("4/5");
  const [advPicksRadius,   setAdvPicksRadius]   = useState("sharp");
  const [advPicksCardH,    setAdvPicksCardH]    = useState(0);
  const [advInspoAspect,   setAdvInspoAspect]   = useState("none");
  const [advInspoRadius,   setAdvInspoRadius]   = useState("sharp");
  const [advInspoCardH,    setAdvInspoCardH]    = useState(0);
  const [advRelatedAspect, setAdvRelatedAspect] = useState("4/5");
  const [advRelatedRadius, setAdvRelatedRadius] = useState("sharp");
  const [advRelatedCardH,  setAdvRelatedCardH]  = useState(0);
  const [advSaving,        setAdvSaving]        = useState(false);

  // ── Hot Deals state ───────────────────────────────────────────────────────
  const [hdTicker, setHdTicker] = useState("ONGOING & UPCOMING|NEW OFFERS INSIDE|DON'T MISS OUT");
  const [hdHeroHeading, setHdHeroHeading] = useState("HOT\nDEALS");
  const [hdHeroEyebrow, setHdHeroEyebrow] = useState("Limited Time");
  const [hdHeroSub, setHdHeroSub] = useState("OFFERS YOU DON'T WANT TO MISS");
  const [hdHeroImg, setHdHeroImg] = useState("");
  const [hdSectionHeading, setHdSectionHeading] = useState("Current Offers");
  const [hdSectionSub, setHdSectionSub] = useState("Use the code at checkout · Limited stock");
  const [hdCols, setHdCols] = useState(3);
  const [hdMobileCols, setHdMobileCols] = useState(1);
  const [hdCardH, setHdCardH] = useState(280);
  const [hdCardGap, setHdCardGap] = useState(28);
  const [hdPageSaving, setHdPageSaving] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // ── About Us state ────────────────────────────────────────────────────────
  const [auHeroHeading,  setAuHeroHeading]  = useState("About CLASSIE");
  const [auHeroEyebrow,  setAuHeroEyebrow]  = useState("Our Story");
  const [auHeroText,     setAuHeroText]     = useState("We've all had that moment —\n\nstanding in front of a wardrobe full of shoes, yet feeling like nothing fits the vibe.\n\nBecause the truth is, it's never about how many pairs we own. It's about having the right pair for the right moment — a wedding, a festival, a big meeting, or a brunch date.\n\nAnd too often, we end up buying a new pair just to match a single outfit.");
  const [auBannerImg,    setAuBannerImg]    = useState("");
  const [auS1Heading,    setAuS1Heading]    = useState("Where It All Began — The Classic Clip-On Idea");
  const [auS1Text,       setAuS1Text]       = useState("Classie began with a simple thought — fashion should be yours.\n\nFlexible. Creative. Timeless.\n\nWe asked ourselves:\nWhy should one outfit need a new heel?\nWhy shouldn't your footwear change as easily as your moods?\n\nThat's when we imagined something different.\n\nWhat if one pair of heels could transform into multiple looks just by swapping an accessory?\n\nA Classie heel — designed to shift from minimal to festive, formal to playful with just one small change, using our signature clip on accessories.");
  const [auS1Img,        setAuS1Img]        = useState("");
  const [auS2Heading,    setAuS2Heading]    = useState("Classic Heels — Easy to Love");
  const [auS2Text,       setAuS2Text]       = useState("The real challenge began when we took a closer look at the market.\n\nHeels were either beautiful but uncomfortable, or priced far beyond everyday reach.\n\nSo, we decided to create our own solution.\n\nAt Classie, we design heels that balance everything that matters — thoughtful design, lasting comfort, premium finishing, and pricing that feels fair.");
  const [auS2Img,        setAuS2Img]        = useState("");
  const [auS3Heading,    setAuS3Heading]    = useState("Classie Is More Than Heels");
  const [auS3Text,       setAuS3Text]       = useState("Classie is more than just heels or clip-ons.\n\nIt's an idea that keeps growing.\n\nWe believe style shouldn't feel fixed or limited. It should change with your mood, your plans, and your personality.\n\nStyle it your way, with Classie.");
  const [auS3Img,        setAuS3Img]        = useState("");
  const [auFeatsHeading, setAuFeatsHeading] = useState("What Makes Classie Different");
  const [auFeat1Icon,    setAuFeat1Icon]    = useState("👠");
  const [auFeat1Title,   setAuFeat1Title]   = useState("Handcrafted With Purpose");
  const [auFeat1Desc,    setAuFeat1Desc]    = useState("Every Classie heel and clip-on is shaped by skilled hands, with careful human detailing at every stage.");
  const [auFeat2Icon,    setAuFeat2Icon]    = useState("✨");
  const [auFeat2Title,   setAuFeat2Title]   = useState("Premium Materials, Refined Finish");
  const [auFeat2Desc,    setAuFeat2Desc]    = useState("We choose our materials the same way you choose your outfits — with care. Our heels are finished with premium materials.");
  const [auFeat3Icon,    setAuFeat3Icon]    = useState("🎀");
  const [auFeat3Title,   setAuFeat3Title]   = useState("Heel + Clip On");
  const [auFeat3Desc,    setAuFeat3Desc]    = useState("One thoughtfully designed heel. Interchangeable clip-ons that change the look, without changing the pair.");
  const [auFounderQuote, setAuFounderQuote] = useState("Classie was created to give women the freedom I always wanted — the freedom to style your look, your way. Fashion shouldn't limit you. It should move with you, match your moments, and celebrate your creativity. This is just the beginning, and I'm so grateful you're here.");
  const [auFounderName,  setAuFounderName]  = useState("Ishika Garg");
  const [auFounderTitle, setAuFounderTitle] = useState("Founder, Classie");
  const [auFounderImg,   setAuFounderImg]   = useState("");
  const [auHeroSaving,    setAuHeroSaving]    = useState(false);
  const [auBannerSaving,  setAuBannerSaving]  = useState(false);
  const [auStorySaving,   setAuStorySaving]   = useState(false);
  const [auFeatsSaving,   setAuFeatsSaving]   = useState(false);
  const [auFounderSaving, setAuFounderSaving] = useState(false);

  // ── Contact Us state ──────────────────────────────────────────────────────
  const [ctHeroImg,      setCtHeroImg]      = useState("");
  const [ctHeading,      setCtHeading]      = useState("Contact Us");
  const [ctSubtext,      setCtSubtext]      = useState("Your perfect look deserves the perfect heel. Whether you need help with sizing, styling, orders, or customisation — our team is here to assist you.\n\nDrop us a message and we'll get back to you within 24–48 hours.");
  const [ctTrackText,    setCtTrackText]    = useState("Log in to check the status of your order.");
  const [ctTrackUrl,     setCtTrackUrl]     = useState("/track");
  const [ctReturnText,   setCtReturnText]   = useState("We make it easy to return and exchange styles.");
  const [ctReturnUrl,    setCtReturnUrl]    = useState("/returns");
  const [ctFaqHeading,   setCtFaqHeading]   = useState("Popular Searched Questions");
  const [ctFaq1Q, setCtFaq1Q] = useState(""); const [ctFaq1A, setCtFaq1A] = useState("");
  const [ctFaq2Q, setCtFaq2Q] = useState(""); const [ctFaq2A, setCtFaq2A] = useState("");
  const [ctFaq3Q, setCtFaq3Q] = useState(""); const [ctFaq3A, setCtFaq3A] = useState("");
  const [ctFaq4Q, setCtFaq4Q] = useState(""); const [ctFaq4A, setCtFaq4A] = useState("");
  const [ctFaq5Q, setCtFaq5Q] = useState(""); const [ctFaq5A, setCtFaq5A] = useState("");
  const [ctFaq6Q, setCtFaq6Q] = useState(""); const [ctFaq6A, setCtFaq6A] = useState("");
  const [ctFaq7Q, setCtFaq7Q] = useState(""); const [ctFaq7A, setCtFaq7A] = useState("");
  const [ctFaq8Q, setCtFaq8Q] = useState(""); const [ctFaq8A, setCtFaq8A] = useState("");
  const [ctInfoHeading,  setCtInfoHeading]  = useState("Any other questions?");
  const [ctInfoSub,      setCtInfoSub]      = useState("We're here to help! Contact us any time Monday–Saturday, 9 AM–9 PM.");
  const [ctPhone,        setCtPhone]        = useState("91- 9468147781");
  const [ctEmail,        setCtEmail]        = useState("contact.classie@gmail.com");
  const [ctSocial,       setCtSocial]       = useState("@classsie.in");
  const [ctHeroSaving,   setCtHeroSaving]   = useState(false);
  const [ctHelpSaving,   setCtHelpSaving]   = useState(false);
  const [ctFaqSaving,    setCtFaqSaving]    = useState(false);
  const [ctInfoSaving,   setCtInfoSaving]   = useState(false);

  const [ctInbox,        setCtInbox]        = useState<CtSubmission[]>([]);
  const [ctInboxLoading, setCtInboxLoading] = useState(false);

  // ── Shipping Policy state ─────────────────────────────────────────────────
  const [spHeading,        setSpHeading]        = useState("Shipping Policy");
  const [spEyebrow,        setSpEyebrow]        = useState("CLASSIE");
  const [spUpdated,        setSpUpdated]        = useState("Last updated: June 2025");
  const [spTile1Title,     setSpTile1Title]     = useState("Free Shipping");
  const [spTile1Sub,       setSpTile1Sub]       = useState("On all orders above ₹999");
  const [spTile2Title,     setSpTile2Title]     = useState("Delivery Time");
  const [spTile2Sub,       setSpTile2Sub]       = useState("4–5 business days standard");
  const [spTile3Title,     setSpTile3Title]     = useState("Pan-India");
  const [spTile3Sub,       setSpTile3Sub]       = useState("All serviceable pincodes");
  const [spTile4Title,     setSpTile4Title]     = useState("Processing");
  const [spTile4Sub,       setSpTile4Sub]       = useState("1–2 business days before dispatch");
  const [spRatesHeading,   setSpRatesHeading]   = useState("Shipping Rates");
  const [spRatesBody,      setSpRatesBody]      = useState("Free shipping on all orders above ₹999\n₹99 flat fee on orders below ₹999\nCash on Delivery (COD) is available across India");
  const [spTimelineHeading,setSpTimelineHeading]= useState("Delivery Timelines");
  const [spTimelineBody,   setSpTimelineBody]   = useState("Metro cities: 3–5 business days\nTier 2 cities: 5–7 business days\nRemote areas: 7–10 business days\n\nOrders placed before 12 PM IST are processed the same day. Weekend orders are processed on Monday.");
  const [spTrackingHeading,setSpTrackingHeading]= useState("Order Tracking");
  const [spTrackingBody,   setSpTrackingBody]   = useState("Once dispatched, you'll receive tracking details via SMS/WhatsApp.\n\nUse our Track Order page for real-time updates.");
  const [spAddressHeading, setSpAddressHeading] = useState("Incorrect Address");
  const [spAddressBody,    setSpAddressBody]    = useState("Please ensure your delivery address and phone number are correct at checkout.\n\nClassie is not responsible for failed deliveries due to incorrect address details.");
  const [spLostHeading,    setSpLostHeading]    = useState("Lost or Damaged Packages");
  const [spLostBody,       setSpLostBody]       = useState("If your order arrives damaged or is lost in transit, please contact us within 48 hours of the expected delivery date at contact.classie@gmail.com or WhatsApp us.");
  const [spCtaText,        setSpCtaText]        = useState("Have questions about your order?");
  const [spHeroSaving,     setSpHeroSaving]     = useState(false);
  const [spTilesSaving,    setSpTilesSaving]    = useState(false);
  const [spContentSaving,  setSpContentSaving]  = useState(false);
  const [spCtaSaving,      setSpCtaSaving]      = useState(false);

  // ── Size Guide state ──────────────────────────────────────────────────────
  const [sgEyebrow,       setSgEyebrow]       = useState("CLASSIE");
  const [sgHeading,       setSgHeading]       = useState("Size Guide");
  const [sgSub,           setSgSub]           = useState("Find your perfect fit — every time");
  const [sgMeasureHeading,setSgMeasureHeading]= useState("How to Measure Your Foot");
  const [sgMeasureSteps,  setSgMeasureSteps]  = useState("Step 1: Place a blank sheet of paper on a flat floor\nStep 2: Stand on the paper with your heel against a wall\nStep 3: Mark the tip of your longest toe with a pencil\nStep 4: Measure the distance from the wall to the mark in centimetres\nStep 5: Use the chart below to find your size");
  const [sgChartHeading,  setSgChartHeading]  = useState("Heel Size Chart");
  const [sgChartSub,      setSgChartSub]      = useState("All measurements are in centimetres (cm)");
  const [sgChartJson,     setSgChartJson]     = useState('[{"eu":"35","uk":"2","in":"3","cm":"22.0"},{"eu":"36","uk":"3","in":"4","cm":"22.5–23.0"},{"eu":"37","uk":"4","in":"5","cm":"23.5"},{"eu":"38","uk":"5","in":"6","cm":"24.0–24.5"},{"eu":"39","uk":"6","in":"7","cm":"25.0"},{"eu":"40","uk":"7","in":"8","cm":"25.5–26.0"},{"eu":"41","uk":"8","in":"9","cm":"26.5"}]');
  const [sgTipsHeading,   setSgTipsHeading]   = useState("Tips for the Perfect Fit");
  const [sgTip1Icon,      setSgTip1Icon]      = useState("📏");
  const [sgTip1Title,     setSgTip1Title]     = useState("Measure in the Evening");
  const [sgTip1Body,      setSgTip1Body]      = useState("Feet tend to swell throughout the day. Measure in the evening for the most accurate size.");
  const [sgTip2Icon,      setSgTip2Icon]      = useState("👟");
  const [sgTip2Title,     setSgTip2Title]     = useState("If Between Sizes");
  const [sgTip2Body,      setSgTip2Body]      = useState("We recommend sizing up. A slightly larger heel is easier to style than one that's too tight.");
  const [sgTip3Icon,      setSgTip3Icon]      = useState("💬");
  const [sgTip3Title,     setSgTip3Title]     = useState("Need Help?");
  const [sgTip3Body,      setSgTip3Body]      = useState("Contact our team via WhatsApp or email — we're happy to help you find the right size.");
  const [sgCtaText,       setSgCtaText]       = useState("Still not sure about your size?");
  const [sgHeroSaving,    setSgHeroSaving]    = useState(false);
  const [sgMeasureSaving, setSgMeasureSaving] = useState(false);
  const [sgChartSaving,   setSgChartSaving]   = useState(false);
  const [sgTipsSaving,    setSgTipsSaving]    = useState(false);
  const [sgCtaSaving,     setSgCtaSaving]     = useState(false);

  // ── Returns & Exchanges state ─────────────────────────────────────────────
  const [reEyebrow,          setReEyebrow]          = useState("CLASSIE");
  const [reHeading,          setReHeading]          = useState("Returns & Exchanges");
  const [reSub,              setReSub]              = useState("Hassle-free returns within 7 days of delivery");
  const [reUpdated,          setReUpdated]          = useState("Last updated: June 2025");
  const [reTile1Title,       setReTile1Title]       = useState("7-Day Returns");
  const [reTile1Sub,         setReTile1Sub]         = useState("Return within 7 days of delivery");
  const [reTile2Title,       setReTile2Title]       = useState("Free Size Exchange");
  const [reTile2Sub,         setReTile2Sub]         = useState("Subject to stock availability");
  const [reTile3Title,       setReTile3Title]       = useState("Refund in 5–7 Days");
  const [reTile3Sub,         setReTile3Sub]         = useState("After product inspection");
  const [reEligibleHeading,  setReEligibleHeading]  = useState("Eligible Returns");
  const [reEligibleBody,     setReEligibleBody]     = useState("Products are eligible for return if:\n\n• Returned within 7 days of delivery\n• Unused, unworn, and in original condition\n• In original packaging with all tags attached\n• Accompanied by the original invoice");
  const [reNonreturnHeading, setReNonreturnHeading] = useState("Non-Returnable Items");
  const [reNonreturnBody,    setReNonreturnBody]    = useState("• Style Clips and accessories (not eligible for return)\n• Items worn or used\n• Items without original packaging\n• Products purchased during clearance or final sale");
  const [reInitiateHeading,  setReInitiateHeading]  = useState("How to Initiate a Return");
  const [reInitiateBody,     setReInitiateBody]     = useState("1. WhatsApp us at +91-9468147781 with your Order ID and reason\n2. We'll confirm eligibility and schedule a free pickup\n3. Pack the product securely in original packaging\n4. Refund or exchange is processed after inspection (2–3 business days)");
  const [reExchangeHeading,  setReExchangeHeading]  = useState("Exchanges");
  const [reExchangeBody,     setReExchangeBody]     = useState("Size exchanges are free within 7 days of delivery, subject to stock availability.\n\nContact us to check availability before initiating. Only heels are eligible for size exchange — Style Clips cannot be exchanged.");
  const [reRefundHeading,    setReRefundHeading]    = useState("Refunds");
  const [reRefundBody,       setReRefundBody]       = useState("Once we receive and inspect the returned product (2–3 business days), refunds are processed within 5–7 business days.\n\nFor COD orders, refunds are issued via bank transfer. For online payments, the refund is credited back to the original payment method.");
  const [reCtaText,          setReCtaText]          = useState("Need help with a return or exchange?");
  const [reHeroSaving,       setReHeroSaving]       = useState(false);
  const [reTilesSaving,      setReTilesSaving]      = useState(false);
  const [rePolicySaving,     setRePolicySaving]     = useState(false);
  const [reCtaSaving,        setReCtaSaving]        = useState(false);

  const [couponModal, setCouponModal] = useState<{ open: boolean; mode: "add" | "edit"; data: Partial<Coupon> }>({ open: false, mode: "add", data: {} });
  const [couponSaving, setCouponSaving] = useState(false);
  const [couponStats, setCouponStats] = useState<CouponUse[]>([]);

  const [bowWhyHeading, setBowWhyHeading] = useState("Why Choose");
  const [bowWhyHeadingItalic, setBowWhyHeadingItalic] = useState("Classie?");
  const [bowWhyCard1Icon, setBowWhyCard1Icon] = useState("🎀");
  const [bowWhyCard1Title, setBowWhyCard1Title] = useState("Delicate Design");
  const [bowWhyCard1Desc, setBowWhyCard1Desc] = useState("Soft ribbon bows.");
  const [bowWhyCard2Icon, setBowWhyCard2Icon] = useState("🌸");
  const [bowWhyCard2Title, setBowWhyCard2Title] = useState("Versatile Style");
  const [bowWhyCard2Desc, setBowWhyCard2Desc] = useState("From brunch to events.");
  const [bowWhyCard3Icon, setBowWhyCard3Icon] = useState("👛");
  const [bowWhyCard3Title, setBowWhyCard3Title] = useState("Gift-Ready");
  const [bowWhyCard3Desc, setBowWhyCard3Desc] = useState("Perfect as a gift.");
  const [bowWhyFooterText, setBowWhyFooterText] = useState("Discover our curated bow collection designed for romance in every step.");
  const [bowWhyVisible, setBowWhyVisible] = useState(true);
  const [bowWhySaving, setBowWhySaving] = useState(false);


  // ── Collections Page state ────────────────────────────────────────────────
  const [collHeroEyebrow,    setCollHeroEyebrow]    = useState("Summer Edit 2025");
  const [collHeroLine1,      setCollHeroLine1]      = useState("Explore");
  const [collHeroLine2,      setCollHeroLine2]      = useState("our");
  const [collHeroLine3,      setCollHeroLine3]      = useState("Collection");
  const [collHeroTagline,    setCollHeroTagline]    = useState("One heel. Endless looks.");
  const [collHeroSub,        setCollHeroSub]        = useState("India's first interchangeable heel brand — where a single shoe becomes four different styles with our signature clip-on collection.");
  const [collHeroImage,      setCollHeroImage]      = useState("");
  const [collStat1Val,       setCollStat1Val]       = useState("24+");
  const [collStat1Label,     setCollStat1Label]     = useState("Styles");
  const [collStat2Val,       setCollStat2Val]       = useState("3");
  const [collStat2Label,     setCollStat2Label]     = useState("Collections");
  const [collStat3Val,       setCollStat3Val]       = useState("₹399+");
  const [collStat3Label,     setCollStat3Label]     = useState("Starting At");
  const [collBadgeLabel,     setCollBadgeLabel]     = useState("New Arrivals");
  const [collBadgeSub,       setCollBadgeSub]       = useState("Styles this season");
  const [collCtaText,        setCollCtaText]        = useState("Explore All Styles →");
  const [collCta2Text,       setCollCta2Text]       = useState("Style Guide");
  const [collStrip1Title,    setCollStrip1Title]    = useState("Designed to Transform");
  const [collStrip1Desc,     setCollStrip1Desc]     = useState("Interchangeable clip-ons that let one heel match every look.");
  const [collStrip2Title,    setCollStrip2Title]    = useState("Made for Everyday Wear");
  const [collStrip2Desc,     setCollStrip2Desc]     = useState("Comfort-focused designs made for real movement and real life.");
  const [collStrip3Title,    setCollStrip3Title]    = useState("Style That Lasts");
  const [collStrip3Desc,     setCollStrip3Desc]     = useState("Reusable clip-ons designed to be worn again and again.");
  const [collTestText,       setCollTestText]       = useState("\"I bought one pair of Classie heels and three clip-on sets — it's like having ten shoes in one box. Absolute game changer.\"");
  const [collTestAuthor,     setCollTestAuthor]     = useState("— Priya S., Mumbai");
  const [collSectionLabel,   setCollSectionLabel]   = useState("Curated for you this season");
  const [collHeroSaving,     setCollHeroSaving]     = useState(false);
  const [collStripSaving,    setCollStripSaving]    = useState(false);
  const [collTestSaving,     setCollTestSaving]     = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [slidePageFilter, setSlidePageFilter] = useState<string>("all");
  // Hero Slides
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [slidesLoading, setSlidesLoading] = useState(false);
  const [slideModal, setSlideModal] = useState<{ open: boolean; mode: "add" | "edit"; data: HeroSlide }>({
    open: false, mode: "add", data: EMPTY_SLIDE,
  });
  const [slideSaving, setSlideSaving] = useState(false);
  const [deleteSlideConfirm, setDeleteSlideConfirm] = useState<string | null>(null);

  // Site Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    logo_image_url: "", announcement_text: "", whatsapp_number: "", instagram_url: "",
    ig_handle: "@classie_in", ig_heading: "Style Inspo", ig_subtext: "Tag us to be featured",
    ig_follow_text: "Follow @classie_in →", ig_follow_url: "https://www.instagram.com/_classie_in/",
    nl_eyebrow: "STAY CONNECTED", nl_heading: "Be the First to", nl_heading_italic: "Know",
    nl_subtext: "New arrivals and exclusive edits — straight to your inbox.",
    nl_placeholder: "Your email address", nl_btn_text: "Subscribe",
    nl_success_text: "✓ You're on the list. We'll be in touch soon.",
    announcement_1: "", announcement_2: "", announcement_3: "",
    announcement_4: "", announcement_5: "", announcement_6: "",
    announcement_speed: "15",
    announcement_mode: "rotate",
    philosophy_eyebrow: "Our Philosophy",
    philosophy_headline: "One Heel.", philosophy_headline_italic: "Endless", philosophy_headline2: "Possibilities.",
    philosophy_body: "Classie was born from a simple idea — every woman deserves to feel powerful in her heels. Comfort-first design, premium quality, styled your way.",
    philosophy_cta_text: "Our Story",
    philosophy_cta_url: "/about",
    phil_stat1_number: "10K+", phil_stat1_label: "Happy Customers",
    phil_stat2_number: "50+",  phil_stat2_label: "Styles Available",
    phil_stat3_number: "4.9★", phil_stat3_label: "Avg. Rating",
    phil_f1_title: "Comfort-First Design",  phil_f1_desc: "Engineered for all-day wear without sacrificing elegance.",
    phil_f2_title: "Premium Quality",        phil_f2_desc: "Curated materials, careful craftsmanship in every pair.",
    phil_f3_title: "Free Exchange",          phil_f3_desc: "Not the right fit? Exchange hassle-free, always.",
    philosophy_image_url: "",
    hero_eyebrow: "New Collection 2025",
    hero_heading_line1: "Step Into",
    hero_heading_italic: "Elegance",
    hero_heading_line3: "Redefined",
    hero_subtitle: "Premium heels crafted for the modern woman.",
    hero_cta1_text: "Shop Now",
    hero_cta1_url: "/shop",
    hero_cta2_text: "View Collection",
    hero_cta2_url: "/shop",
    hero_image_url: "",
    hero_stat1_number: "500+",
    hero_stat1_label: "Styles",
    hero_stat2_number: "10k+",
    hero_stat2_label: "Happy Customers",
    hero_stat3_number: "4.9★",
    hero_stat3_label: "Avg Rating",
    hero_chip_code: "",
    hero_chip_text: "",
    hero_badge_text: "SS25",
    hero_badge_sub: "New In",
    hero_badge_active: "true",
    hero_pill_text: "247 sold today",
    hero_pill_sub: "Limited stock",
    hero_pill_active: "true",
    band_text: "Free Shipping on Orders Above ₹999 · Easy Returns · Premium Quality · Comfort-First Design",
    fp_tab1_label: "Latest Styles", fp_tab1_active: "true",
    fp_tab2_label: "Best Sellers",  fp_tab2_active: "true",
    fp_tab3_label: "On Sale",       fp_tab3_active: "true",
    fp_eyebrow: "New Arrivals", fp_heading: "Featured", fp_heading_italic: "Picks",
    cat_links_bold: "true",
    cat_links_hover: "custom",
    cat_links_hover_bg: "#3B5373",
    cat_links_hover_text: "#ffffff",
    cat_num_color: "#9ca3af",
    cat_text_size: "1.1",
    footer_logo_url: "",
    footer_tagline: "One Heel. Endless Looks.",
    footer_desc: "Premium heels crafted for the modern woman. Made with ♥ in India.",
    footer_ig_url: "https://www.instagram.com/_classie_in/",
    footer_tiktok_url: "", footer_fb_url: "", footer_pinterest_url: "", footer_whatsapp_url: "",
    footer_shop_links: "",
    footer_help_links: "",
    footer_company_links: "",
    footer_copyright: `© ${new Date().getFullYear()} Classie. All rights reserved.`,
    footer_shop_heading: "SHOP",
    footer_help_heading: "HELP",
    footer_company_heading: "COMPANY",
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Announcement dynamic list (up to 6)
  const [announcementList, setAnnouncementList] = useState<string[]>(["", "", ""]);
  const [announcementSpeed, setAnnouncementSpeed] = useState("25");

  // Features Bar
  const [featuresBarItems, setFeaturesBarItems] = useState<FeatureBarItem[]>([]);
  const [featuresBarLoading, setFeaturesBarLoading] = useState(false);
  const EMPTY_FEATURE: FeatureBarItem = { icon: "⭐", title: "", subtitle: "", display_order: 0, active: true };
  const [featuresBarModal, setFeaturesBarModal] = useState<{
    open: boolean; mode: "add" | "edit"; data: FeatureBarItem;
  }>({ open: false, mode: "add", data: { ...EMPTY_FEATURE } });
  const [featuresBarSaving, setFeaturesBarSaving] = useState(false);
  const [deleteFeatureConfirm, setDeleteFeatureConfirm] = useState<string | null>(null);

  // Collections
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [collectionModal, setCollectionModal] = useState<{ open: boolean; data: Collection }>({
    open: false,
    data: { title: "", slug: "", description: "", image_url: "", tag_label: "", display_order: 0, active: true },
  });
  const [collectionSaving, setCollectionSaving] = useState(false);
  const [collectionModalMode, setCollectionModalMode] = useState<"add"|"edit">("edit");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Site Categories
  const EMPTY_CATEGORY: SiteCategory = { name: "", slug: "", description: "", image_url: "", display_order: 0, active: true };
  const [siteCategories, setSiteCategories] = useState<SiteCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoryModal, setCategoryModal] = useState<{ open: boolean; mode: "add" | "edit"; data: SiteCategory }>({
    open: false, mode: "add", data: { ...EMPTY_CATEGORY },
  });
  const [categorySaving, setCategorySaving] = useState(false);
  const [deleteCategoryConfirm, setDeleteCategoryConfirm] = useState<string | null>(null);
  const [categorySlugManuallyEdited, setCategorySlugManuallyEdited] = useState(false);

  // Manage Category Products modal
  const [manageCategoryProductsModal, setManageCategoryProductsModal] = useState<{
    open: boolean;
    category: SiteCategory | null;
    saving: boolean;
    search: string;
  }>({ open: false, category: null, saving: false, search: "" });
  const [categoryProductIds, setCategoryProductIds] = useState<string[]>([]);
  const [allProductsForCategoryModal, setAllProductsForCategoryModal] = useState<DbProduct[]>([]);

  // Manage Products modal
  const [manageProductsModal, setManageProductsModal] = useState<{
    open: boolean;
    collection: Collection | null;
    selectedSlugs: string[];
    saving: boolean;
  }>({ open: false, collection: null, selectedSlugs: [], saving: false });

  // Featured Picks
  const [latestProducts, setLatestProducts] = useState<DbProduct[]>([]);
  const [bestSellerProducts, setBestSellerProducts] = useState<DbProduct[]>([]);
  const [saleProducts, setSaleProducts] = useState<DbProduct[]>([]);
  const [allActiveProducts, setAllActiveProducts] = useState<DbProduct[]>([]);
  const [featuredPicksModal, setFeaturedPicksModal] = useState<{
    open: boolean;
    tab: 'latest' | 'bestseller' | 'sale';
    selectedIds: string[];
    search: string;
    saving: boolean;
  }>({ open: false, tab: 'latest', selectedIds: [], search: '', saving: false });

  // Messages
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [msgSubTab, setMsgSubTab] = useState<"messages" | "newsletter">("messages");

  // Testimonials
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(false);
  const [testimonialModal, setTestimonialModal] = useState<{ open: boolean; mode: "add" | "edit"; data: Testimonial }>({
    open: false, mode: "add", data: { ...EMPTY_TESTIMONIAL },
  });
  const [testimonialSaving, setTestimonialSaving] = useState(false);
  const [deleteTestimonialConfirm, setDeleteTestimonialConfirm] = useState<string | null>(null);

  // Instagram Images
  const [instagramImages, setInstagramImages] = useState<InstagramImage[]>([]);
  const [instagramLoading, setInstagramLoading] = useState(false);
  const [instagramModal, setInstagramModal] = useState<{ open: boolean; mode: "add" | "edit"; data: InstagramImage }>({
    open: false, mode: "add", data: { ...EMPTY_INSTAGRAM },
  });
  const [instagramSaving, setInstagramSaving] = useState(false);
  const [deleteInstagramConfirm, setDeleteInstagramConfirm] = useState<string | null>(null);

  // Style Inspo
  const [styleInspos, setStyleInspos] = useState<StyleInspo[]>([]);
  const [styleInspoLoading, setStyleInspoLoading] = useState(false);
  const [styleInspoModal, setStyleInspoModal] = useState<{ open: boolean; mode: "add" | "edit"; data: StyleInspo }>({
    open: false, mode: "add", data: { ...EMPTY_STYLE_INSPO },
  });
  const [styleInspoSaving, setStyleInspoSaving] = useState(false);
  const [deleteStyleInspoConfirm, setDeleteStyleInspoConfirm] = useState<string | null>(null);

  // Footer link editors
  const DEFAULT_FOOTER_SHOP: FooterLinkItem[] = [
    { text: "Heels", url: "/shop/heels" },
    { text: "Clip-ons", url: "/shop/clips" },
    { text: "Bow Collection", url: "/shop/bow" },
    { text: "The Date Edit", url: "/the-date-edit" },
    { text: "The Festive Edit", url: "/the-festive-edit" },
    { text: "Hot Deals", url: "/hot-deals" },
  ];
  const DEFAULT_FOOTER_HELP: FooterLinkItem[] = [
    { text: "Size Guide", url: "/size-guide" },
    { text: "Shipping Info", url: "/shipping" },
    { text: "Returns & Exchanges", url: "/returns" },
    { text: "Track Order", url: "/track-order" },
    { text: "FAQ", url: "/faq" },
    { text: "Contact Us", url: "/contact" },
  ];
  const DEFAULT_FOOTER_COMPANY: FooterLinkItem[] = [
    { text: "About Classie", url: "/about" },
    { text: "Style Ideas", url: "/style-ideas" },
    { text: "Press", url: "/press" },
    { text: "Privacy Policy", url: "/privacy-policy" },
    { text: "Terms of Use", url: "/terms" },
    { text: "", url: "" },
  ];
  const [footerShopLinks, setFooterShopLinks] = useState<FooterLinkItem[]>(DEFAULT_FOOTER_SHOP);
  const [footerHelpLinks, setFooterHelpLinks] = useState<FooterLinkItem[]>(DEFAULT_FOOTER_HELP);
  const [footerCompanyLinks, setFooterCompanyLinks] = useState<FooterLinkItem[]>(DEFAULT_FOOTER_COMPANY);

  // ── Fetch functions ──────────────────────────────────────────────────────

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch { /* ignore */ }
    finally { setOrdersLoading(false); }
  }, []);

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (!error && data) setDbProducts(data as DbProduct[]);
    } catch { /* ignore */ }
    finally { setProductsLoading(false); }
  }, []);

  const fetchHeelsPage = useCallback(async () => {
    setHeelsPageLoading(true);
    try {
      const [{ data }, { data: settings }] = await Promise.all([
        supabase.from("products").select("*").eq("category", "heels").order("created_at", { ascending: false }),
        supabase.from("site_settings").select("key,value").in("key", ["heels_filter_heel_types","heels_hero_bg_type","heels_hero_bg_url","heels_hero_slides","heels_hero_text_pos","heels_hero_eyebrow","heels_hero_title","heels_hero_subtitle","heels_hero_show_stats","heels_hero_stat1_val","heels_hero_stat1_label","heels_hero_stat2_val","heels_hero_stat2_label","heels_hero_stat3_val","heels_hero_stat3_label","heels_why_heading","heels_why_heading_italic","heels_why_card1_icon","heels_why_card1_title","heels_why_card1_desc","heels_why_card2_icon","heels_why_card2_title","heels_why_card2_desc","heels_why_card3_icon","heels_why_card3_title","heels_why_card3_desc","heels_why_footer_text","heels_why_visible"]),
      ]);
      if (data) setHeelsPageProducts(data as DbProduct[]);
      const m: Record<string,string> = {};
      (settings ?? []).forEach(({key,value}) => { m[key]=value; });
      if (m.heels_filter_heel_types) { try { setHeelsFilterTypes(JSON.parse(m.heels_filter_heel_types)); } catch { setHeelsFilterTypes([]); } }
      else if (data) {
        const types = new Set<string>();
        (data as DbProduct[]).forEach((p) => { if (p.heel_type) types.add(p.heel_type); });
        setHeelsFilterTypes(Array.from(types).sort());
      }
      if (m.heels_hero_bg_type) setHeelsHeroBgType(m.heels_hero_bg_type as "none"|"image"|"video"|"slider");
      if (m.heels_hero_bg_url) setHeelsHeroBgUrl(m.heels_hero_bg_url);
      if (m.heels_hero_slides) { try { setHeelsHeroSlides(JSON.parse(m.heels_hero_slides)); } catch { setHeelsHeroSlides([]); } }
      if (m.heels_hero_text_pos) setHeelsHeroTextPos(m.heels_hero_text_pos as "left"|"center"|"right");
      if (m.heels_hero_eyebrow) setHeelsHeroEyebrow(m.heels_hero_eyebrow);
      if (m.heels_hero_title) setHeelsHeroTitle(m.heels_hero_title);
      if (m.heels_hero_subtitle) setHeelsHeroSubtitle(m.heels_hero_subtitle);
      if (m.heels_hero_show_stats !== undefined) setHeelsHeroShowStats(m.heels_hero_show_stats !== "false");
      if (m.heels_hero_stat1_val !== undefined) setHeelsHeroStat1Val(m.heels_hero_stat1_val);
      if (m.heels_hero_stat1_label) setHeelsHeroStat1Label(m.heels_hero_stat1_label);
      if (m.heels_hero_stat2_val !== undefined) setHeelsHeroStat2Val(m.heels_hero_stat2_val);
      if (m.heels_hero_stat2_label) setHeelsHeroStat2Label(m.heels_hero_stat2_label);
      if (m.heels_hero_stat3_val) setHeelsHeroStat3Val(m.heels_hero_stat3_val);
      if (m.heels_hero_stat3_label) setHeelsHeroStat3Label(m.heels_hero_stat3_label);
      if (m.heels_why_heading) setWhyHeading(m.heels_why_heading);
      if (m.heels_why_heading_italic) setWhyHeadingItalic(m.heels_why_heading_italic);
      if (m.heels_why_card1_icon) setWhyCard1Icon(m.heels_why_card1_icon);
      if (m.heels_why_card1_title) setWhyCard1Title(m.heels_why_card1_title);
      if (m.heels_why_card1_desc) setWhyCard1Desc(m.heels_why_card1_desc);
      if (m.heels_why_card2_icon) setWhyCard2Icon(m.heels_why_card2_icon);
      if (m.heels_why_card2_title) setWhyCard2Title(m.heels_why_card2_title);
      if (m.heels_why_card2_desc) setWhyCard2Desc(m.heels_why_card2_desc);
      if (m.heels_why_card3_icon) setWhyCard3Icon(m.heels_why_card3_icon);
      if (m.heels_why_card3_title) setWhyCard3Title(m.heels_why_card3_title);
      if (m.heels_why_card3_desc) setWhyCard3Desc(m.heels_why_card3_desc);
      if (m.heels_why_footer_text) setWhyFooterText(m.heels_why_footer_text);
      if (m.heels_why_visible !== undefined) setWhyVisible(m.heels_why_visible !== "false");
    } catch { /* ignore */ }
    finally { setHeelsPageLoading(false); }
  }, []);

  const saveHeelsHero = async () => {
    setHeelsHeroSaving(true);
    try {
      const pairs = [
        { key: "heels_hero_bg_type",  value: heelsHeroBgType },
        { key: "heels_hero_bg_url",   value: heelsHeroBgUrl },
        { key: "heels_hero_slides",   value: JSON.stringify(heelsHeroSlides) },
        { key: "heels_hero_text_pos", value: heelsHeroTextPos },
        { key: "heels_hero_eyebrow",     value: heelsHeroEyebrow },
        { key: "heels_hero_title",       value: heelsHeroTitle },
        { key: "heels_hero_subtitle",    value: heelsHeroSubtitle },
        { key: "heels_hero_show_stats",  value: heelsHeroShowStats ? "true" : "false" },
        { key: "heels_hero_stat1_val",   value: heelsHeroStat1Val },
        { key: "heels_hero_stat1_label", value: heelsHeroStat1Label },
        { key: "heels_hero_stat2_val",   value: heelsHeroStat2Val },
        { key: "heels_hero_stat2_label", value: heelsHeroStat2Label },
        { key: "heels_hero_stat3_val",   value: heelsHeroStat3Val },
        { key: "heels_hero_stat3_label", value: heelsHeroStat3Label },
      ];
      for (const p of pairs) {
        await supabase.from("site_settings").delete().eq("key", p.key);
        await supabase.from("site_settings").insert(p);
      }
      await revalidateSite();
    } catch { /* ignore */ }
    finally { setHeelsHeroSaving(false); }
  };

  const saveWhySection = async () => {
    setWhySaving(true);
    try {
      const pairs = [
        { key: "heels_why_heading",        value: whyHeading },
        { key: "heels_why_heading_italic",  value: whyHeadingItalic },
        { key: "heels_why_card1_icon",      value: whyCard1Icon },
        { key: "heels_why_card1_title",     value: whyCard1Title },
        { key: "heels_why_card1_desc",      value: whyCard1Desc },
        { key: "heels_why_card2_icon",      value: whyCard2Icon },
        { key: "heels_why_card2_title",     value: whyCard2Title },
        { key: "heels_why_card2_desc",      value: whyCard2Desc },
        { key: "heels_why_card3_icon",      value: whyCard3Icon },
        { key: "heels_why_card3_title",     value: whyCard3Title },
        { key: "heels_why_card3_desc",      value: whyCard3Desc },
        { key: "heels_why_footer_text",     value: whyFooterText },
        { key: "heels_why_visible",         value: whyVisible ? "true" : "false" },
      ];
      for (const p of pairs) {
        await supabase.from("site_settings").delete().eq("key", p.key);
        await supabase.from("site_settings").insert(p);
      }
      await revalidateSite();
    } catch { /* ignore */ }
    finally { setWhySaving(false); }
  };

  const saveHeelsFilterTypes = async (types: string[]) => {
    setHeelsFilterSaving(true);
    try {
      await supabase.from("site_settings").delete().eq("key", "heels_filter_heel_types");
      await supabase.from("site_settings").insert({ key: "heels_filter_heel_types", value: JSON.stringify(types) });
      await revalidateSite();
    } catch { /* ignore */ }
    finally { setHeelsFilterSaving(false); }
  };

  // ── Clips Page fetch/save ─────────────────────────────────────────────────
  const fetchClipsPage = useCallback(async () => {
    setClipsPageLoading(true);
    try {
      const settingsKeys = ["clips_filter_types","clips_hero_bg_type","clips_hero_bg_url","clips_hero_slides","clips_hero_text_pos","clips_hero_eyebrow","clips_hero_title","clips_hero_subtitle","clips_hero_show_stats","clips_hero_stat1_val","clips_hero_stat1_label","clips_hero_stat2_val","clips_hero_stat2_label","clips_hero_stat3_val","clips_hero_stat3_label","clips_why_heading","clips_why_heading_italic","clips_why_card1_icon","clips_why_card1_title","clips_why_card1_desc","clips_why_card2_icon","clips_why_card2_title","clips_why_card2_desc","clips_why_card3_icon","clips_why_card3_title","clips_why_card3_desc","clips_why_footer_text","clips_why_visible"];
      const [{ data }, { data: settings }] = await Promise.all([
        supabase.from("products").select("*").eq("category", "clips").order("created_at", { ascending: false }),
        supabase.from("site_settings").select("key,value").in("key", settingsKeys),
      ]);
      if (data) setClipsPageProducts(data as DbProduct[]);
      const m: Record<string,string> = {};
      (settings ?? []).forEach(({key,value}) => { m[key]=value; });
      if (m.clips_filter_types) { try { setClipsFilterTypes(JSON.parse(m.clips_filter_types)); } catch { setClipsFilterTypes([]); } }
      if (m.clips_hero_bg_type) setClipsHeroBgType(m.clips_hero_bg_type as "none"|"image"|"video"|"slider");
      if (m.clips_hero_bg_url) setClipsHeroBgUrl(m.clips_hero_bg_url);
      if (m.clips_hero_slides) { try { setClipsHeroSlides(JSON.parse(m.clips_hero_slides)); } catch { setClipsHeroSlides([]); } }
      if (m.clips_hero_text_pos) setClipsHeroTextPos(m.clips_hero_text_pos as "left"|"center"|"right");
      if (m.clips_hero_eyebrow) setClipsHeroEyebrow(m.clips_hero_eyebrow);
      if (m.clips_hero_title) setClipsHeroTitle(m.clips_hero_title);
      if (m.clips_hero_subtitle) setClipsHeroSubtitle(m.clips_hero_subtitle);
      if (m.clips_hero_show_stats !== undefined) setClipsHeroShowStats(m.clips_hero_show_stats !== "false");
      if (m.clips_hero_stat1_val !== undefined) setClipsHeroStat1Val(m.clips_hero_stat1_val);
      if (m.clips_hero_stat1_label) setClipsHeroStat1Label(m.clips_hero_stat1_label);
      if (m.clips_hero_stat2_val !== undefined) setClipsHeroStat2Val(m.clips_hero_stat2_val);
      if (m.clips_hero_stat2_label) setClipsHeroStat2Label(m.clips_hero_stat2_label);
      if (m.clips_hero_stat3_val) setClipsHeroStat3Val(m.clips_hero_stat3_val);
      if (m.clips_hero_stat3_label) setClipsHeroStat3Label(m.clips_hero_stat3_label);
      if (m.clips_why_heading) setClipsWhyHeading(m.clips_why_heading);
      if (m.clips_why_heading_italic) setClipsWhyHeadingItalic(m.clips_why_heading_italic);
      if (m.clips_why_card1_icon) setClipsWhyCard1Icon(m.clips_why_card1_icon);
      if (m.clips_why_card1_title) setClipsWhyCard1Title(m.clips_why_card1_title);
      if (m.clips_why_card1_desc) setClipsWhyCard1Desc(m.clips_why_card1_desc);
      if (m.clips_why_card2_icon) setClipsWhyCard2Icon(m.clips_why_card2_icon);
      if (m.clips_why_card2_title) setClipsWhyCard2Title(m.clips_why_card2_title);
      if (m.clips_why_card2_desc) setClipsWhyCard2Desc(m.clips_why_card2_desc);
      if (m.clips_why_card3_icon) setClipsWhyCard3Icon(m.clips_why_card3_icon);
      if (m.clips_why_card3_title) setClipsWhyCard3Title(m.clips_why_card3_title);
      if (m.clips_why_card3_desc) setClipsWhyCard3Desc(m.clips_why_card3_desc);
      if (m.clips_why_footer_text) setClipsWhyFooterText(m.clips_why_footer_text);
      if (m.clips_why_visible !== undefined) setClipsWhyVisible(m.clips_why_visible !== "false");
    } catch { /* ignore */ }
    finally { setClipsPageLoading(false); }
  }, []);

  const saveClipsHero = async () => {
    setClipsHeroSaving(true);
    try {
      const pairs = [
        { key: "clips_hero_bg_type",  value: clipsHeroBgType },
        { key: "clips_hero_bg_url",   value: clipsHeroBgUrl },
        { key: "clips_hero_slides",   value: JSON.stringify(clipsHeroSlides) },
        { key: "clips_hero_text_pos", value: clipsHeroTextPos },
        { key: "clips_hero_eyebrow",     value: clipsHeroEyebrow },
        { key: "clips_hero_title",       value: clipsHeroTitle },
        { key: "clips_hero_subtitle",    value: clipsHeroSubtitle },
        { key: "clips_hero_show_stats",  value: clipsHeroShowStats ? "true" : "false" },
        { key: "clips_hero_stat1_val",   value: clipsHeroStat1Val },
        { key: "clips_hero_stat1_label", value: clipsHeroStat1Label },
        { key: "clips_hero_stat2_val",   value: clipsHeroStat2Val },
        { key: "clips_hero_stat2_label", value: clipsHeroStat2Label },
        { key: "clips_hero_stat3_val",   value: clipsHeroStat3Val },
        { key: "clips_hero_stat3_label", value: clipsHeroStat3Label },
      ];
      for (const p of pairs) {
        await supabase.from("site_settings").delete().eq("key", p.key);
        await supabase.from("site_settings").insert(p);
      }
      await revalidateSite();
    } catch { /* ignore */ }
    finally { setClipsHeroSaving(false); }
  };

  const saveClipsWhy = async () => {
    setClipsWhySaving(true);
    try {
      const pairs = [
        { key: "clips_why_heading",        value: clipsWhyHeading },
        { key: "clips_why_heading_italic",  value: clipsWhyHeadingItalic },
        { key: "clips_why_card1_icon",      value: clipsWhyCard1Icon },
        { key: "clips_why_card1_title",     value: clipsWhyCard1Title },
        { key: "clips_why_card1_desc",      value: clipsWhyCard1Desc },
        { key: "clips_why_card2_icon",      value: clipsWhyCard2Icon },
        { key: "clips_why_card2_title",     value: clipsWhyCard2Title },
        { key: "clips_why_card2_desc",      value: clipsWhyCard2Desc },
        { key: "clips_why_card3_icon",      value: clipsWhyCard3Icon },
        { key: "clips_why_card3_title",     value: clipsWhyCard3Title },
        { key: "clips_why_card3_desc",      value: clipsWhyCard3Desc },
        { key: "clips_why_footer_text",     value: clipsWhyFooterText },
        { key: "clips_why_visible",         value: clipsWhyVisible ? "true" : "false" },
      ];
      for (const p of pairs) {
        await supabase.from("site_settings").delete().eq("key", p.key);
        await supabase.from("site_settings").insert(p);
      }
      await revalidateSite();
    } catch { /* ignore */ }
    finally { setClipsWhySaving(false); }
  };

  const saveClipsFilterTypes = async (types: string[]) => {
    setClipsFilterSaving(true);
    try {
      await supabase.from("site_settings").delete().eq("key", "clips_filter_types");
      await supabase.from("site_settings").insert({ key: "clips_filter_types", value: JSON.stringify(types) });
      await revalidateSite();
    } catch { /* ignore */ }
    finally { setClipsFilterSaving(false); }
  };

  // ── Bow Page fetch/save ───────────────────────────────────────────────────
  const fetchBowPage = useCallback(async () => {
    setBowPageLoading(true);
    try {
      const settingsKeys = ["bow_filter_types","bow_hero_bg_type","bow_hero_bg_url","bow_hero_slides","bow_hero_text_pos","bow_hero_eyebrow","bow_hero_title","bow_hero_subtitle","bow_hero_show_stats","bow_hero_stat1_val","bow_hero_stat1_label","bow_hero_stat2_val","bow_hero_stat2_label","bow_hero_stat3_val","bow_hero_stat3_label","bow_why_heading","bow_why_heading_italic","bow_why_card1_icon","bow_why_card1_title","bow_why_card1_desc","bow_why_card2_icon","bow_why_card2_title","bow_why_card2_desc","bow_why_card3_icon","bow_why_card3_title","bow_why_card3_desc","bow_why_footer_text","bow_why_visible"];
      const [{ data }, { data: settings }] = await Promise.all([
        supabase.from("products").select("*").eq("category", "bow").order("created_at", { ascending: false }),
        supabase.from("site_settings").select("key,value").in("key", settingsKeys),
      ]);
      if (data) setBowPageProducts(data as DbProduct[]);
      const m: Record<string,string> = {};
      (settings ?? []).forEach(({key,value}) => { m[key]=value; });
      if (m.bow_filter_types) { try { setBowFilterTypes(JSON.parse(m.bow_filter_types)); } catch { setBowFilterTypes([]); } }
      if (m.bow_hero_bg_type) setBowHeroBgType(m.bow_hero_bg_type as "none"|"image"|"video"|"slider");
      if (m.bow_hero_bg_url) setBowHeroBgUrl(m.bow_hero_bg_url);
      if (m.bow_hero_slides) { try { setBowHeroSlides(JSON.parse(m.bow_hero_slides)); } catch { setBowHeroSlides([]); } }
      if (m.bow_hero_text_pos) setBowHeroTextPos(m.bow_hero_text_pos as "left"|"center"|"right");
      if (m.bow_hero_eyebrow) setBowHeroEyebrow(m.bow_hero_eyebrow);
      if (m.bow_hero_title) setBowHeroTitle(m.bow_hero_title);
      if (m.bow_hero_subtitle) setBowHeroSubtitle(m.bow_hero_subtitle);
      if (m.bow_hero_show_stats !== undefined) setBowHeroShowStats(m.bow_hero_show_stats !== "false");
      if (m.bow_hero_stat1_val !== undefined) setBowHeroStat1Val(m.bow_hero_stat1_val);
      if (m.bow_hero_stat1_label) setBowHeroStat1Label(m.bow_hero_stat1_label);
      if (m.bow_hero_stat2_val !== undefined) setBowHeroStat2Val(m.bow_hero_stat2_val);
      if (m.bow_hero_stat2_label) setBowHeroStat2Label(m.bow_hero_stat2_label);
      if (m.bow_hero_stat3_val) setBowHeroStat3Val(m.bow_hero_stat3_val);
      if (m.bow_hero_stat3_label) setBowHeroStat3Label(m.bow_hero_stat3_label);
      if (m.bow_why_heading) setBowWhyHeading(m.bow_why_heading);
      if (m.bow_why_heading_italic) setBowWhyHeadingItalic(m.bow_why_heading_italic);
      if (m.bow_why_card1_icon) setBowWhyCard1Icon(m.bow_why_card1_icon);
      if (m.bow_why_card1_title) setBowWhyCard1Title(m.bow_why_card1_title);
      if (m.bow_why_card1_desc) setBowWhyCard1Desc(m.bow_why_card1_desc);
      if (m.bow_why_card2_icon) setBowWhyCard2Icon(m.bow_why_card2_icon);
      if (m.bow_why_card2_title) setBowWhyCard2Title(m.bow_why_card2_title);
      if (m.bow_why_card2_desc) setBowWhyCard2Desc(m.bow_why_card2_desc);
      if (m.bow_why_card3_icon) setBowWhyCard3Icon(m.bow_why_card3_icon);
      if (m.bow_why_card3_title) setBowWhyCard3Title(m.bow_why_card3_title);
      if (m.bow_why_card3_desc) setBowWhyCard3Desc(m.bow_why_card3_desc);
      if (m.bow_why_footer_text) setBowWhyFooterText(m.bow_why_footer_text);
      if (m.bow_why_visible !== undefined) setBowWhyVisible(m.bow_why_visible !== "false");
    } catch { /* ignore */ }
    finally { setBowPageLoading(false); }
  }, []);

  // ── Collections Page fetch/save ──────────────────────────────────────────
  const fetchCollectionsPage = useCallback(async () => {
    try {
      const keys = [
        "coll_hero_eyebrow","coll_hero_line1","coll_hero_line2","coll_hero_line3",
        "coll_hero_tagline","coll_hero_sub","coll_hero_image",
        "coll_stat1_val","coll_stat1_label","coll_stat2_val","coll_stat2_label","coll_stat3_val","coll_stat3_label",
        "coll_badge_label","coll_badge_sub","coll_cta_text","coll_cta2_text",
        "coll_strip1_title","coll_strip1_desc","coll_strip2_title","coll_strip2_desc","coll_strip3_title","coll_strip3_desc",
        "coll_testimonial_text","coll_testimonial_author","coll_section_label",
      ];
      const { data } = await supabase.from("site_settings").select("key,value").in("key", keys);
      const m: Record<string,string> = {};
      (data ?? []).forEach((r: {key:string;value:string}) => { m[r.key] = r.value; });
      if (m.coll_hero_eyebrow !== undefined)   setCollHeroEyebrow(m.coll_hero_eyebrow);
      if (m.coll_hero_line1 !== undefined)     setCollHeroLine1(m.coll_hero_line1);
      if (m.coll_hero_line2 !== undefined)     setCollHeroLine2(m.coll_hero_line2);
      if (m.coll_hero_line3 !== undefined)     setCollHeroLine3(m.coll_hero_line3);
      if (m.coll_hero_tagline !== undefined)   setCollHeroTagline(m.coll_hero_tagline);
      if (m.coll_hero_sub !== undefined)       setCollHeroSub(m.coll_hero_sub);
      if (m.coll_hero_image !== undefined)     setCollHeroImage(m.coll_hero_image);
      if (m.coll_stat1_val !== undefined)      setCollStat1Val(m.coll_stat1_val);
      if (m.coll_stat1_label !== undefined)    setCollStat1Label(m.coll_stat1_label);
      if (m.coll_stat2_val !== undefined)      setCollStat2Val(m.coll_stat2_val);
      if (m.coll_stat2_label !== undefined)    setCollStat2Label(m.coll_stat2_label);
      if (m.coll_stat3_val !== undefined)      setCollStat3Val(m.coll_stat3_val);
      if (m.coll_stat3_label !== undefined)    setCollStat3Label(m.coll_stat3_label);
      if (m.coll_badge_label !== undefined)    setCollBadgeLabel(m.coll_badge_label);
      if (m.coll_badge_sub !== undefined)      setCollBadgeSub(m.coll_badge_sub);
      if (m.coll_cta_text !== undefined)       setCollCtaText(m.coll_cta_text);
      if (m.coll_cta2_text !== undefined)      setCollCta2Text(m.coll_cta2_text);
      if (m.coll_strip1_title !== undefined)   setCollStrip1Title(m.coll_strip1_title);
      if (m.coll_strip1_desc !== undefined)    setCollStrip1Desc(m.coll_strip1_desc);
      if (m.coll_strip2_title !== undefined)   setCollStrip2Title(m.coll_strip2_title);
      if (m.coll_strip2_desc !== undefined)    setCollStrip2Desc(m.coll_strip2_desc);
      if (m.coll_strip3_title !== undefined)   setCollStrip3Title(m.coll_strip3_title);
      if (m.coll_strip3_desc !== undefined)    setCollStrip3Desc(m.coll_strip3_desc);
      if (m.coll_testimonial_text !== undefined)   setCollTestText(m.coll_testimonial_text);
      if (m.coll_testimonial_author !== undefined) setCollTestAuthor(m.coll_testimonial_author);
      if (m.coll_section_label !== undefined)  setCollSectionLabel(m.coll_section_label);
    } catch { /* ignore */ }
  }, []);

  // ── Revalidate all pages after any admin save ────────────────────────────
  const revalidateSite = async () => {
    try {
      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: "classie-revalidate-2024" }),
      });
    } catch { /* silent fail — page will still update on next visit */ }
  };

  const saveCollSettingsBatch = async (pairs: {key:string;value:string}[], setSaving: (v:boolean)=>void) => {
    setSaving(true);
    try {
      for (const p of pairs) {
        await supabase.from("site_settings").delete().eq("key", p.key);
        await supabase.from("site_settings").insert(p);
      }
      await revalidateSite();
    } finally { setSaving(false); }
  };

  const saveCollHero = () => saveCollSettingsBatch([
    { key: "coll_hero_eyebrow",  value: collHeroEyebrow },
    { key: "coll_hero_line1",    value: collHeroLine1 },
    { key: "coll_hero_line2",    value: collHeroLine2 },
    { key: "coll_hero_line3",    value: collHeroLine3 },
    { key: "coll_hero_tagline",  value: collHeroTagline },
    { key: "coll_hero_sub",      value: collHeroSub },
    { key: "coll_hero_image",    value: collHeroImage },
    { key: "coll_stat1_val",     value: collStat1Val },
    { key: "coll_stat1_label",   value: collStat1Label },
    { key: "coll_stat2_val",     value: collStat2Val },
    { key: "coll_stat2_label",   value: collStat2Label },
    { key: "coll_stat3_val",     value: collStat3Val },
    { key: "coll_stat3_label",   value: collStat3Label },
    { key: "coll_badge_label",   value: collBadgeLabel },
    { key: "coll_badge_sub",     value: collBadgeSub },
    { key: "coll_cta_text",      value: collCtaText },
    { key: "coll_cta2_text",     value: collCta2Text },
    { key: "coll_section_label", value: collSectionLabel },
  ], setCollHeroSaving);

  const saveCollStrip = () => saveCollSettingsBatch([
    { key: "coll_strip1_title", value: collStrip1Title },
    { key: "coll_strip1_desc",  value: collStrip1Desc },
    { key: "coll_strip2_title", value: collStrip2Title },
    { key: "coll_strip2_desc",  value: collStrip2Desc },
    { key: "coll_strip3_title", value: collStrip3Title },
    { key: "coll_strip3_desc",  value: collStrip3Desc },
  ], setCollStripSaving);

  const saveCollTest = () => saveCollSettingsBatch([
    { key: "coll_testimonial_text",   value: collTestText },
    { key: "coll_testimonial_author", value: collTestAuthor },
  ], setCollTestSaving);

  // ── Style Ideas Page fetch + save ─────────────────────────────────────
  const fetchStyleIdeasPage = useCallback(async () => {
    setSiPageLoading(true);
    try {
      const keys = ["si_hero_bg_type","si_hero_bg_url","si_hero_slides","si_hero_text_pos","si_hero_eyebrow","si_hero_title","si_hero_title_italic","si_hero_subtitle","si_hero_show_stats","si_hero_stat1_val","si_hero_stat1_label","si_hero_stat2_val","si_hero_stat2_label","si_hero_stat3_val","si_hero_stat3_label","si_occasions","si_occasions_visible","si_cards_per_row","si_cards_show_tag","si_looks_heading","si_looks_mobile","si_looks_gap","si_looks_aspect","si_looks_radius","si_looks_card_h","si_featured_visible","si_featured_label","si_featured_heading","si_featured_desc","si_featured_image","si_featured_media_type","si_featured_products","si_featured_cta1_text","si_featured_cta1_url","si_featured_cta2_text","si_featured_cta2_url","si_reels_visible","si_reels_heading","si_reels_subtitle","si_reels_cols","si_reels_cards","si_reels_card_h","si_reels_card_w","si_reels_gap","si_reels_aspect","si_reels_radius","si_reels_mobile_cols"];;;;
      const { data } = await supabase.from("site_settings").select("key,value").in("key", keys);
      const m: Record<string,string> = {};
      (data ?? []).forEach((r: { key: string; value: string }) => { m[r.key] = r.value; });
      if (m.si_hero_bg_type) setSiHeroBgType(m.si_hero_bg_type as "none"|"image"|"video"|"slider");
      if (m.si_hero_bg_url) setSiHeroBgUrl(m.si_hero_bg_url);
      if (m.si_hero_slides) { try { setSiHeroSlides(JSON.parse(m.si_hero_slides)); } catch { setSiHeroSlides([]); } }
      if (m.si_hero_text_pos) setSiHeroTextPos(m.si_hero_text_pos as "left"|"center"|"right");
      if (m.si_hero_eyebrow) setSiHeroEyebrow(m.si_hero_eyebrow);
      if (m.si_hero_title) setSiHeroTitle(m.si_hero_title);
      if (m.si_hero_title_italic) setSiHeroTitleItalic(m.si_hero_title_italic);
      if (m.si_hero_subtitle) setSiHeroSubtitle(m.si_hero_subtitle);
      if (m.si_hero_show_stats !== undefined) setSiHeroShowStats(m.si_hero_show_stats === "true");
      if (m.si_hero_stat1_val) setSiHeroStat1Val(m.si_hero_stat1_val);
      if (m.si_hero_stat1_label) setSiHeroStat1Label(m.si_hero_stat1_label);
      if (m.si_hero_stat2_val) setSiHeroStat2Val(m.si_hero_stat2_val);
      if (m.si_hero_stat2_label) setSiHeroStat2Label(m.si_hero_stat2_label);
      if (m.si_hero_stat3_val) setSiHeroStat3Val(m.si_hero_stat3_val);
      if (m.si_hero_stat3_label) setSiHeroStat3Label(m.si_hero_stat3_label);
      if (m.si_occasions) { try { setSiOccasions(JSON.parse(m.si_occasions)); } catch { /* ignore */ } }
      if (m.si_occasions_visible !== undefined) setSiOccasionsVisible(m.si_occasions_visible !== "false");
      if (m.si_cards_per_row) setSiCardsPerRow(parseInt(m.si_cards_per_row) || 4);
      if (m.si_cards_show_tag !== undefined) setSiCardsShowTag(m.si_cards_show_tag !== "false");
      if (m.si_looks_heading !== undefined) setSiLooksHeading(m.si_looks_heading);
      if (m.si_looks_mobile)  setSiLooksMobile(parseInt(m.si_looks_mobile)||2);
      if (m.si_looks_gap)     setSiLooksGap(parseInt(m.si_looks_gap)||16);
      if (m.si_looks_aspect)  setSiLooksAspect(m.si_looks_aspect);
      if (m.si_looks_radius)  setSiLooksRadius(m.si_looks_radius);
      if (m.si_looks_card_h)  setSiLooksCardH(parseInt(m.si_looks_card_h)||0);
      if (m.si_featured_visible !== undefined) setSiFeaturedVisible(m.si_featured_visible !== "false");
      if (m.si_reels_visible !== undefined) setSiReelsVisible(m.si_reels_visible !== "false");
      if (m.si_reels_heading)  setSiReelsHeading(m.si_reels_heading);
      if (m.si_reels_subtitle) setSiReelsSubtitle(m.si_reels_subtitle);
      if (m.si_reels_cols)     setSiReelsCols(parseInt(m.si_reels_cols) || 4);
      if (m.si_reels_cards)    { try { setSiReelsCards(JSON.parse(m.si_reels_cards)); } catch { /* ignore */ } }
      if (m.si_reels_card_h)     setSiReelsCardH(parseInt(m.si_reels_card_h) || 480);
      if (m.si_reels_card_w)     setSiReelsCardW(parseInt(m.si_reels_card_w) || 0);
      if (m.si_reels_gap)        setSiReelsGap(parseInt(m.si_reels_gap) || 12);
      if (m.si_reels_aspect)     setSiReelsAspect(m.si_reels_aspect);
      if (m.si_reels_radius)     setSiReelsRadius(m.si_reels_radius);
      if (m.si_reels_mobile_cols) setSiReelsMobileCols(parseInt(m.si_reels_mobile_cols) || 2);
      if (m.si_featured_label) setSiFeaturedLabel(m.si_featured_label);
      if (m.si_featured_heading) setSiFeaturedHeading(m.si_featured_heading);
      if (m.si_featured_desc) setSiFeaturedDesc(m.si_featured_desc);
      if (m.si_featured_image) setSiFeaturedImage(m.si_featured_image);
      if (m.si_featured_media_type) setSiFeaturedMediaType(m.si_featured_media_type as "image"|"video");
      if (m.si_featured_products) { try { const p = JSON.parse(m.si_featured_products); setSiFeaturedProducts(Array.isArray(p) ? p : []); } catch { /* ignore */ } }
      if (m.si_featured_cta1_text) setSiFeaturedCta1Text(m.si_featured_cta1_text);
      if (m.si_featured_cta1_url) setSiFeaturedCta1Url(m.si_featured_cta1_url);
      if (m.si_featured_cta2_text) setSiFeaturedCta2Text(m.si_featured_cta2_text);
      if (m.si_featured_cta2_url) setSiFeaturedCta2Url(m.si_featured_cta2_url);
    } catch { /* ignore */ }
    finally { setSiPageLoading(false); }
  }, []);

  const saveSiOccasions = async (list: string[]) => {
    setSiOccasionsSaving(true);
    try {
      await supabase.from("site_settings").delete().eq("key", "si_occasions");
      await supabase.from("site_settings").insert({ key: "si_occasions", value: JSON.stringify(list) });
      await supabase.from("site_settings").delete().eq("key", "si_occasions_visible");
      await supabase.from("site_settings").insert({ key: "si_occasions_visible", value: siOccasionsVisible ? "true" : "false" });
      await revalidateSite();
    } catch { /* ignore */ }
    finally { setSiOccasionsSaving(false); }
  };

  const saveSiLooksAdv = async () => {
    setSiLooksAdvSaving(true);
    const pairs = [
      { key: "si_looks_mobile",  value: String(siLooksMobile) },
      { key: "si_looks_gap",     value: String(siLooksGap) },
      { key: "si_looks_aspect",  value: siLooksAspect },
      { key: "si_looks_radius",  value: siLooksRadius },
      { key: "si_looks_card_h",  value: String(siLooksCardH) },
    ];
    for (const p of pairs) {
      await supabase.from("site_settings").delete().eq("key", p.key);
      await supabase.from("site_settings").insert(p);
    }
    await revalidateSite();
    setSiLooksAdvSaving(false);
  };

  const saveSiLooksHeading = async (val: string) => {
    setSiLooksHeadingSaving(true);
    await supabase.from("site_settings").delete().eq("key", "si_looks_heading");
    await supabase.from("site_settings").insert({ key: "si_looks_heading", value: val });
    await revalidateSite();
    setSiLooksHeadingSaving(false);
  };

  const saveSiCardsPerRow = async (n: number) => {
    setSiCardsPerRowSaving(true);
    try {
      await supabase.from("site_settings").delete().eq("key", "si_cards_show_tag");
      await supabase.from("site_settings").insert({ key: "si_cards_show_tag", value: siCardsShowTag ? "true" : "false" });
      await supabase.from("site_settings").delete().eq("key", "si_cards_per_row");
      await supabase.from("site_settings").insert({ key: "si_cards_per_row", value: String(n) });
      await revalidateSite();
    } catch { /* ignore */ }
    finally { setSiCardsPerRowSaving(false); }
  };

  const saveSiFeatured = async () => {
    setSiFeaturedSaving(true);
    try {
      const pairs = [
        { key: "si_featured_visible",    value: siFeaturedVisible ? "true" : "false" },
        { key: "si_featured_label",      value: siFeaturedLabel },
        { key: "si_featured_heading",    value: siFeaturedHeading },
        { key: "si_featured_desc",       value: siFeaturedDesc },
        { key: "si_featured_image",      value: siFeaturedImage },
        { key: "si_featured_media_type", value: siFeaturedMediaType },
        { key: "si_featured_products",   value: JSON.stringify(siFeaturedProducts) },
        { key: "si_featured_cta1_text",  value: siFeaturedCta1Text },
        { key: "si_featured_cta1_url",   value: siFeaturedCta1Url },
        { key: "si_featured_cta2_text",  value: siFeaturedCta2Text },
        { key: "si_featured_cta2_url",   value: siFeaturedCta2Url },
      ];
      for (const p of pairs) {
        await supabase.from("site_settings").delete().eq("key", p.key);
        await supabase.from("site_settings").insert(p);
      }
      await revalidateSite();
    } catch { /* ignore */ }
    finally { setSiFeaturedSaving(false); }
  };

  const saveSiReels = async () => {
    setSiReelsSaving(true);
    try {
      const pairs = [
        { key: "si_reels_visible",  value: siReelsVisible ? "true" : "false" },
        { key: "si_reels_heading",  value: siReelsHeading },
        { key: "si_reels_subtitle", value: siReelsSubtitle },
        { key: "si_reels_cols",     value: String(siReelsCols) },
        { key: "si_reels_card_h",     value: String(siReelsCardH) },
        { key: "si_reels_card_w",     value: String(siReelsCardW) },
        { key: "si_reels_gap",        value: String(siReelsGap) },
        { key: "si_reels_aspect",     value: siReelsAspect },
        { key: "si_reels_radius",     value: siReelsRadius },
        { key: "si_reels_mobile_cols",value: String(siReelsMobileCols) },
        { key: "si_reels_cards",    value: JSON.stringify(siReelsCards) },
      ];
      for (const p of pairs) {
        await supabase.from("site_settings").delete().eq("key", p.key);
        await supabase.from("site_settings").insert(p);
      }
      await revalidateSite();
    } catch { /* ignore */ }
    finally { setSiReelsSaving(false); }
  };

  const saveStyleIdeasHero = async () => {
    setSiHeroSaving(true);
    try {
      const pairs = [
        { key: "si_hero_bg_type",      value: siHeroBgType },
        { key: "si_hero_bg_url",       value: siHeroBgUrl },
        { key: "si_hero_slides",       value: JSON.stringify(siHeroSlides) },
        { key: "si_hero_text_pos",     value: siHeroTextPos },
        { key: "si_hero_eyebrow",      value: siHeroEyebrow },
        { key: "si_hero_title",        value: siHeroTitle },
        { key: "si_hero_title_italic", value: siHeroTitleItalic },
        { key: "si_hero_subtitle",     value: siHeroSubtitle },
        { key: "si_hero_show_stats",   value: siHeroShowStats ? "true" : "false" },
        { key: "si_hero_stat1_val",    value: siHeroStat1Val },
        { key: "si_hero_stat1_label",  value: siHeroStat1Label },
        { key: "si_hero_stat2_val",    value: siHeroStat2Val },
        { key: "si_hero_stat2_label",  value: siHeroStat2Label },
        { key: "si_hero_stat3_val",    value: siHeroStat3Val },
        { key: "si_hero_stat3_label",  value: siHeroStat3Label },
      ];
      for (const p of pairs) {
        await supabase.from("site_settings").delete().eq("key", p.key);
        await supabase.from("site_settings").insert(p);
      }
      await revalidateSite();
    } catch { /* ignore */ }
    finally { setSiHeroSaving(false); }
  };

  const saveBowHero = async () => {
    setBowHeroSaving(true);
    try {
      const pairs = [
        { key: "bow_hero_bg_type",  value: bowHeroBgType },
        { key: "bow_hero_bg_url",   value: bowHeroBgUrl },
        { key: "bow_hero_slides",   value: JSON.stringify(bowHeroSlides) },
        { key: "bow_hero_text_pos", value: bowHeroTextPos },
        { key: "bow_hero_eyebrow",     value: bowHeroEyebrow },
        { key: "bow_hero_title",       value: bowHeroTitle },
        { key: "bow_hero_subtitle",    value: bowHeroSubtitle },
        { key: "bow_hero_show_stats",  value: bowHeroShowStats ? "true" : "false" },
        { key: "bow_hero_stat1_val",   value: bowHeroStat1Val },
        { key: "bow_hero_stat1_label", value: bowHeroStat1Label },
        { key: "bow_hero_stat2_val",   value: bowHeroStat2Val },
        { key: "bow_hero_stat2_label", value: bowHeroStat2Label },
        { key: "bow_hero_stat3_val",   value: bowHeroStat3Val },
        { key: "bow_hero_stat3_label", value: bowHeroStat3Label },
      ];
      for (const p of pairs) {
        await supabase.from("site_settings").delete().eq("key", p.key);
        await supabase.from("site_settings").insert(p);
      }
      await revalidateSite();
    } catch { /* ignore */ }
    finally { setBowHeroSaving(false); }
  };

  const saveBowWhy = async () => {
    setBowWhySaving(true);
    try {
      const pairs = [
        { key: "bow_why_heading",        value: bowWhyHeading },
        { key: "bow_why_heading_italic",  value: bowWhyHeadingItalic },
        { key: "bow_why_card1_icon",      value: bowWhyCard1Icon },
        { key: "bow_why_card1_title",     value: bowWhyCard1Title },
        { key: "bow_why_card1_desc",      value: bowWhyCard1Desc },
        { key: "bow_why_card2_icon",      value: bowWhyCard2Icon },
        { key: "bow_why_card2_title",     value: bowWhyCard2Title },
        { key: "bow_why_card2_desc",      value: bowWhyCard2Desc },
        { key: "bow_why_card3_icon",      value: bowWhyCard3Icon },
        { key: "bow_why_card3_title",     value: bowWhyCard3Title },
        { key: "bow_why_card3_desc",      value: bowWhyCard3Desc },
        { key: "bow_why_footer_text",     value: bowWhyFooterText },
        { key: "bow_why_visible",         value: bowWhyVisible ? "true" : "false" },
      ];
      for (const p of pairs) {
        await supabase.from("site_settings").delete().eq("key", p.key);
        await supabase.from("site_settings").insert(p);
      }
      await revalidateSite();
    } catch { /* ignore */ }
    finally { setBowWhySaving(false); }
  };

  const saveBowFilterTypes = async (types: string[]) => {
    setBowFilterSaving(true);
    try {
      await supabase.from("site_settings").delete().eq("key", "bow_filter_types");
      await supabase.from("site_settings").insert({ key: "bow_filter_types", value: JSON.stringify(types) });
      await revalidateSite();
    } catch { /* ignore */ }
    finally { setBowFilterSaving(false); }
  };

  const fetchSlides = useCallback(async () => {
    setSlidesLoading(true);
    try {
      const { data, error } = await supabase.from("hero_slides").select("*").order("display_order", { ascending: true });
      if (!error && data) setSlides(data as HeroSlide[]);
    } catch { /* ignore */ }
    finally { setSlidesLoading(false); }
  }, []);

  const fetchSettings = useCallback(async () => {
    setSettingsLoading(true);
    try {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (!error && data) {
        const merged: SiteSettings = {
          logo_image_url: "", announcement_text: "", whatsapp_number: "", instagram_url: "",
          ig_handle: "@classie_in", ig_heading: "Style Inspo", ig_subtext: "Tag us to be featured",
          ig_follow_text: "Follow @classie_in →", ig_follow_url: "https://www.instagram.com/_classie_in/",
          nl_eyebrow: "STAY CONNECTED", nl_heading: "Be the First to", nl_heading_italic: "Know",
          nl_subtext: "New arrivals and exclusive edits — straight to your inbox.",
          nl_placeholder: "Your email address", nl_btn_text: "Subscribe",
          nl_success_text: "✓ You're on the list. We'll be in touch soon.",
          announcement_1: "", announcement_2: "", announcement_3: "",
          announcement_4: "", announcement_5: "", announcement_6: "",
          announcement_speed: "15",
    announcement_mode: "rotate",
          philosophy_eyebrow: "Our Philosophy",
          philosophy_headline: "One Heel.", philosophy_headline_italic: "Endless", philosophy_headline2: "Possibilities.",
          philosophy_body: "Classie was born from a simple idea — every woman deserves to feel powerful in her heels. Comfort-first design, premium quality, styled your way.",
          philosophy_cta_text: "Our Story",
          philosophy_cta_url: "/about",
          phil_stat1_number: "10K+", phil_stat1_label: "Happy Customers",
          phil_stat2_number: "50+",  phil_stat2_label: "Styles Available",
          phil_stat3_number: "4.9★", phil_stat3_label: "Avg. Rating",
          phil_f1_title: "Comfort-First Design",  phil_f1_desc: "Engineered for all-day wear without sacrificing elegance.",
          phil_f2_title: "Premium Quality",        phil_f2_desc: "Curated materials, careful craftsmanship in every pair.",
          phil_f3_title: "Free Exchange",          phil_f3_desc: "Not the right fit? Exchange hassle-free, always.",
          philosophy_image_url: "",
          hero_eyebrow: "New Collection 2025",
          hero_heading_line1: "Step Into",
          hero_heading_italic: "Elegance",
          hero_heading_line3: "Redefined",
          hero_subtitle: "Premium heels crafted for the modern woman.",
          hero_cta1_text: "Shop Now",
          hero_cta1_url: "/shop",
          hero_cta2_text: "View Collection",
          hero_cta2_url: "/shop",
          hero_image_url: "",
          hero_stat1_number: "500+",
          hero_stat1_label: "Styles",
          hero_stat2_number: "10k+",
          hero_stat2_label: "Happy Customers",
          hero_stat3_number: "4.9★",
          hero_stat3_label: "Avg Rating",
          hero_chip_code: "",
          hero_chip_text: "",
          hero_badge_text: "SS25",
          hero_badge_sub: "New In",
          hero_badge_active: "true",
          hero_pill_text: "247 sold today",
          hero_pill_sub: "Limited stock",
          hero_pill_active: "true",
          band_text: "Free Shipping on Orders Above ₹999 · Easy Returns · Premium Quality · Comfort-First Design",
          fp_tab1_label: "Latest Styles", fp_tab1_active: "true",
          fp_tab2_label: "Best Sellers",  fp_tab2_active: "true",
          fp_tab3_label: "On Sale",       fp_tab3_active: "true",
          fp_eyebrow: "New Arrivals", fp_heading: "Featured", fp_heading_italic: "Picks",
          cat_links_bold: "true",
          cat_links_hover: "custom",
          cat_links_hover_bg: "#3B5373",
          cat_links_hover_text: "#ffffff",
          cat_num_color: "#9ca3af",
          cat_text_size: "1.1",
          footer_logo_url: "",
          footer_tagline: "One Heel. Endless Looks.",
          footer_desc: "Premium heels crafted for the modern woman. Made with ♥ in India.",
          footer_ig_url: "https://www.instagram.com/_classie_in/",
          footer_tiktok_url: "", footer_fb_url: "", footer_pinterest_url: "", footer_whatsapp_url: "",
          footer_shop_links: "",
          footer_help_links: "",
          footer_company_links: "",
          footer_copyright: `© ${new Date().getFullYear()} Classie. All rights reserved.`,
          footer_shop_heading: "SHOP",
          footer_help_heading: "HELP",
          footer_company_heading: "COMPANY",
        };
        data.forEach((row: { key: string; value: string }) => {
          if (row.key in merged) (merged as unknown as Record<string, string>)[row.key] = row.value;
        });
        setSiteSettings(merged);

        // Populate dynamic announcement list
        const list: string[] = [];
        for (let i = 1; i <= 6; i++) {
          const val = (merged as unknown as Record<string, string>)[`announcement_${i}`];
          if (val) list.push(val);
        }
        setAnnouncementList(list.length >= 1 ? list : ["", "", ""]);
        setAnnouncementSpeed(merged.announcement_speed || "25");
      }
    } catch { /* ignore */ }
    finally { setSettingsLoading(false); }
  }, []);

  const fetchCollections = useCallback(async () => {
    setCollectionsLoading(true);
    try {
      const { data, error } = await supabase.from("collections").select("*").order("display_order", { ascending: true });
      if (!error && data) setCollections(data as Collection[]);
    } catch { /* ignore */ }
    finally { setCollectionsLoading(false); }
  }, []);

  const fetchFeaturedPicks = useCallback(async () => {
    const [{ data: latest }, { data: best }, { data: sale }, { data: all }] = await Promise.all([
      supabase.from('products').select('*').eq('featured_tab', 'latest').eq('active', true),
      supabase.from('products').select('*').eq('featured_tab', 'bestseller').eq('active', true),
      supabase.from('products').select('*').eq('featured_tab', 'sale').eq('active', true),
      supabase.from('products').select('*').eq('active', true).order('title'),
    ]);
    if (latest) setLatestProducts(latest as DbProduct[]);
    if (best) setBestSellerProducts(best as DbProduct[]);
    if (sale) setSaleProducts(sale as DbProduct[]);
    if (all) setAllActiveProducts(all as DbProduct[]);
  }, []);

  const fetchMessages = useCallback(async () => {
    setMessagesLoading(true);
    try {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (!error && data) setMessages(data as ContactMessage[]);
    } catch { /* ignore */ }
    finally { setMessagesLoading(false); }
  }, []);

  const fetchSubscribers = useCallback(async () => {
    setSubsLoading(true);
    try {
      const { data, error } = await supabase.from("newsletter_subscribers").select("*").order("id", { ascending: false });
      if (!error && data) setSubscribers(data as NewsletterSubscriber[]);
    } catch { /* ignore */ }
    finally { setSubsLoading(false); }
  }, []);

  // Sync footer link editor state when settings are fetched
  useEffect(() => {
    if (tab !== "footer") return;
    const tryParse = (json: string, fallback: FooterLinkItem[]): FooterLinkItem[] => {
      if (!json) return fallback;
      try {
        const parsed = JSON.parse(json);
        if (Array.isArray(parsed)) {
          // Ensure 6 rows for the editor
          const arr = (parsed as FooterLinkItem[]).slice(0, 6);
          while (arr.length < 6) arr.push({ text: "", url: "" });
          return arr;
        }
      } catch { /* ignore */ }
      return fallback;
    };
    setFooterShopLinks(tryParse(siteSettings.footer_shop_links, DEFAULT_FOOTER_SHOP));
    setFooterHelpLinks(tryParse(siteSettings.footer_help_links, DEFAULT_FOOTER_HELP));
    setFooterCompanyLinks(tryParse(siteSettings.footer_company_links, DEFAULT_FOOTER_COMPANY));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, siteSettings.footer_shop_links, siteSettings.footer_help_links, siteSettings.footer_company_links]);

  // Real-time subscriber updates
  useEffect(() => {
    const channel = supabase.channel("newsletter_realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "newsletter_subscribers" },
        (payload) => {
          setSubscribers(prev => [payload.new as NewsletterSubscriber, ...prev]);
        }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchFeaturesBar = useCallback(async () => {
    setFeaturesBarLoading(true);
    try {
      const { data, error } = await supabase.from("features_bar").select("*").order("display_order", { ascending: true });
      if (!error && data) setFeaturesBarItems(data as FeatureBarItem[]);
    } catch { /* ignore */ }
    finally { setFeaturesBarLoading(false); }
  }, []);

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const { data, error } = await supabase.from("site_categories").select("*").order("display_order", { ascending: true });
      if (!error && data) setSiteCategories(data as SiteCategory[]);
    } catch { /* ignore */ }
    finally { setCategoriesLoading(false); }
  }, []);

  const fetchTestimonials = useCallback(async () => {
    setTestimonialsLoading(true);
    try {
      const { data, error } = await supabase.from("testimonials").select("*").order("display_order", { ascending: true });
      if (!error && data) setTestimonials(data as Testimonial[]);
    } catch { /* ignore */ }
    finally { setTestimonialsLoading(false); }
  }, []);

  const fetchInstagramImages = useCallback(async () => {
    setInstagramLoading(true);
    try {
      const { data, error } = await supabase.from("instagram_images").select("*").order("display_order", { ascending: true });
      if (!error && data) setInstagramImages(data as InstagramImage[]);
    } catch { /* ignore */ }
    finally { setInstagramLoading(false); }
  }, []);

  const fetchStyleInspos = useCallback(async () => {
    setStyleInspoLoading(true);
    try {
      const { data, error } = await supabase.from("style_inspo").select("*").order("display_order", { ascending: true });
      if (!error && data) setStyleInspos(data as StyleInspo[]);
    } catch { /* ignore */ }
    finally { setStyleInspoLoading(false); }
  }, []);

  const fetchAdvSettings = useCallback(async () => {
    const keys = ["adv_shop_mobile","adv_shop_desktop","adv_shop_gap","adv_coll_mobile","adv_coll_desktop","adv_coll_gap","adv_picks_mobile","adv_picks_desktop","adv_picks_gap","adv_inspo_desktop","adv_inspo_gap","adv_related_mobile","adv_related_desktop","adv_related_gap","adv_shop_aspect","adv_shop_radius","adv_shop_card_h","adv_coll_aspect","adv_coll_radius","adv_coll_card_h","adv_picks_aspect","adv_picks_radius","adv_picks_card_h","adv_inspo_aspect","adv_inspo_radius","adv_inspo_card_h","adv_related_aspect","adv_related_radius","adv_related_card_h"];
    const { data } = await supabase.from("site_settings").select("key,value").in("key", keys);
    const m: Record<string,string> = {};
    (data ?? []).forEach((r: {key:string;value:string}) => { m[r.key] = r.value; });
    if (m.adv_shop_mobile)    setAdvShopMobile(parseInt(m.adv_shop_mobile)||2);
    if (m.adv_shop_desktop)   setAdvShopDesktop(parseInt(m.adv_shop_desktop)||4);
    if (m.adv_shop_gap)       setAdvShopGap(parseInt(m.adv_shop_gap)||16);
    if (m.adv_coll_mobile)    setAdvCollMobile(parseInt(m.adv_coll_mobile)||2);
    if (m.adv_coll_desktop)   setAdvCollDesktop(parseInt(m.adv_coll_desktop)||4);
    if (m.adv_coll_gap)       setAdvCollGap(parseInt(m.adv_coll_gap)||12);
    if (m.adv_picks_mobile)   setAdvPicksMobile(parseInt(m.adv_picks_mobile)||2);
    if (m.adv_picks_desktop)  setAdvPicksDesktop(parseInt(m.adv_picks_desktop)||4);
    if (m.adv_picks_gap)      setAdvPicksGap(parseInt(m.adv_picks_gap)||12);
    if (m.adv_inspo_desktop)  setAdvInspoDesktop(parseInt(m.adv_inspo_desktop)||4);
    if (m.adv_inspo_gap)      setAdvInspoGap(parseInt(m.adv_inspo_gap)||4);
    if (m.adv_related_mobile) setAdvRelatedMobile(parseInt(m.adv_related_mobile)||2);
    if (m.adv_related_desktop)setAdvRelatedDesktop(parseInt(m.adv_related_desktop)||4);
    if (m.adv_related_gap)    setAdvRelatedGap(parseInt(m.adv_related_gap)||16);
    if (m.adv_shop_aspect)    setAdvShopAspect(m.adv_shop_aspect);
    if (m.adv_shop_radius)    setAdvShopRadius(m.adv_shop_radius);
    if (m.adv_shop_card_h)    setAdvShopCardH(parseInt(m.adv_shop_card_h)||0);
    if (m.adv_coll_aspect)    setAdvCollAspect(m.adv_coll_aspect);
    if (m.adv_coll_radius)    setAdvCollRadius(m.adv_coll_radius);
    if (m.adv_coll_card_h)    setAdvCollCardH(parseInt(m.adv_coll_card_h)||0);
    if (m.adv_picks_aspect)   setAdvPicksAspect(m.adv_picks_aspect);
    if (m.adv_picks_radius)   setAdvPicksRadius(m.adv_picks_radius);
    if (m.adv_picks_card_h)   setAdvPicksCardH(parseInt(m.adv_picks_card_h)||0);
    if (m.adv_inspo_aspect)   setAdvInspoAspect(m.adv_inspo_aspect);
    if (m.adv_inspo_radius)   setAdvInspoRadius(m.adv_inspo_radius);
    if (m.adv_inspo_card_h)   setAdvInspoCardH(parseInt(m.adv_inspo_card_h)||0);
    if (m.adv_related_aspect) setAdvRelatedAspect(m.adv_related_aspect);
    if (m.adv_related_radius) setAdvRelatedRadius(m.adv_related_radius);
    if (m.adv_related_card_h) setAdvRelatedCardH(parseInt(m.adv_related_card_h)||0);
  }, []);

  // ── Hot Deals fetchers ────────────────────────────────────────────────────
  const fetchHdPage = useCallback(async () => {
    const { data } = await supabase.from("site_settings").select("key,value").like("key", "hd_%");
    const m: Record<string, string> = {};
    (data ?? []).forEach((r: { key: string; value: string }) => { m[r.key] = r.value; });
    if (m.hd_ticker)          setHdTicker(m.hd_ticker);
    if (m.hd_hero_heading)    setHdHeroHeading(m.hd_hero_heading);
    if (m.hd_hero_eyebrow)    setHdHeroEyebrow(m.hd_hero_eyebrow);
    if (m.hd_hero_sub)        setHdHeroSub(m.hd_hero_sub);
    if (m.hd_hero_img !== undefined) setHdHeroImg(m.hd_hero_img || "");
    if (m.hd_section_heading) setHdSectionHeading(m.hd_section_heading);
    if (m.hd_section_sub)     setHdSectionSub(m.hd_section_sub);
    if (m.hd_cols)            setHdCols(parseInt(m.hd_cols) || 3);
    if (m.hd_mobile_cols)     setHdMobileCols(parseInt(m.hd_mobile_cols) || 1);
    if (m.hd_card_h)          setHdCardH(parseInt(m.hd_card_h) || 280);
    if (m.hd_card_gap)        setHdCardGap(parseInt(m.hd_card_gap) || 28);
  }, []);

  const saveHdPage = async () => {
    setHdPageSaving(true);
    const pairs = [
      { key: "hd_ticker",          value: hdTicker },
      { key: "hd_hero_heading",    value: hdHeroHeading },
      { key: "hd_hero_eyebrow",    value: hdHeroEyebrow },
      { key: "hd_hero_sub",        value: hdHeroSub },
      { key: "hd_hero_img",        value: hdHeroImg },
      { key: "hd_section_heading", value: hdSectionHeading },
      { key: "hd_section_sub",     value: hdSectionSub },
      { key: "hd_cols",            value: String(hdCols) },
      { key: "hd_mobile_cols",     value: String(hdMobileCols) },
      { key: "hd_card_h",          value: String(hdCardH) },
      { key: "hd_card_gap",        value: String(hdCardGap) },
    ];
    for (const p of pairs) {
      await supabase.from("site_settings").delete().eq("key", p.key);
      await supabase.from("site_settings").insert(p);
    }
    await revalidateSite();
    setHdPageSaving(false);
  };

  // ── About Us fetcher & savers ─────────────────────────────────────────────
  const fetchAboutUs = useCallback(async () => {
    const { data } = await supabase.from("site_settings").select("key,value").like("key", "au_%");
    const m: Record<string, string> = {};
    (data ?? []).forEach((r: { key: string; value: string }) => { m[r.key] = r.value; });
    if (m.au_hero_heading  !== undefined) setAuHeroHeading(m.au_hero_heading || "About CLASSIE");
    if (m.au_hero_eyebrow  !== undefined) setAuHeroEyebrow(m.au_hero_eyebrow || "Our Story");
    if (m.au_hero_text     !== undefined) setAuHeroText(m.au_hero_text);
    if (m.au_banner_img    !== undefined) setAuBannerImg(m.au_banner_img || "");
    if (m.au_s1_heading    !== undefined) setAuS1Heading(m.au_s1_heading);
    if (m.au_s1_text       !== undefined) setAuS1Text(m.au_s1_text);
    if (m.au_s1_img        !== undefined) setAuS1Img(m.au_s1_img || "");
    if (m.au_s2_heading    !== undefined) setAuS2Heading(m.au_s2_heading);
    if (m.au_s2_text       !== undefined) setAuS2Text(m.au_s2_text);
    if (m.au_s2_img        !== undefined) setAuS2Img(m.au_s2_img || "");
    if (m.au_s3_heading    !== undefined) setAuS3Heading(m.au_s3_heading);
    if (m.au_s3_text       !== undefined) setAuS3Text(m.au_s3_text);
    if (m.au_s3_img        !== undefined) setAuS3Img(m.au_s3_img || "");
    if (m.au_feats_heading !== undefined) setAuFeatsHeading(m.au_feats_heading);
    if (m.au_feat1_icon    !== undefined) setAuFeat1Icon(m.au_feat1_icon || "👠");
    if (m.au_feat1_title   !== undefined) setAuFeat1Title(m.au_feat1_title);
    if (m.au_feat1_desc    !== undefined) setAuFeat1Desc(m.au_feat1_desc);
    if (m.au_feat2_icon    !== undefined) setAuFeat2Icon(m.au_feat2_icon || "✨");
    if (m.au_feat2_title   !== undefined) setAuFeat2Title(m.au_feat2_title);
    if (m.au_feat2_desc    !== undefined) setAuFeat2Desc(m.au_feat2_desc);
    if (m.au_feat3_icon    !== undefined) setAuFeat3Icon(m.au_feat3_icon || "🎀");
    if (m.au_feat3_title   !== undefined) setAuFeat3Title(m.au_feat3_title);
    if (m.au_feat3_desc    !== undefined) setAuFeat3Desc(m.au_feat3_desc);
    if (m.au_founder_quote !== undefined) setAuFounderQuote(m.au_founder_quote);
    if (m.au_founder_name  !== undefined) setAuFounderName(m.au_founder_name || "Ishika Garg");
    if (m.au_founder_title !== undefined) setAuFounderTitle(m.au_founder_title || "Founder, Classie");
    if (m.au_founder_img   !== undefined) setAuFounderImg(m.au_founder_img || "");
  }, []);

  const saveAuBatch = async (pairs: { key: string; value: string }[], setSaving: (v: boolean) => void) => {
    setSaving(true);
    for (const p of pairs) {
      await supabase.from("site_settings").delete().eq("key", p.key);
      await supabase.from("site_settings").insert(p);
    }
    await revalidateSite();
    setSaving(false);
  };

  const saveAuHero = () => saveAuBatch([
    { key: "au_hero_heading", value: auHeroHeading },
    { key: "au_hero_eyebrow", value: auHeroEyebrow },
    { key: "au_hero_text",    value: auHeroText },
  ], setAuHeroSaving);

  const saveAuBanner = () => saveAuBatch([
    { key: "au_banner_img", value: auBannerImg },
  ], setAuBannerSaving);

  const saveAuStory = () => saveAuBatch([
    { key: "au_s1_heading", value: auS1Heading },
    { key: "au_s1_text",    value: auS1Text },
    { key: "au_s1_img",     value: auS1Img },
    { key: "au_s2_heading", value: auS2Heading },
    { key: "au_s2_text",    value: auS2Text },
    { key: "au_s2_img",     value: auS2Img },
    { key: "au_s3_heading", value: auS3Heading },
    { key: "au_s3_text",    value: auS3Text },
    { key: "au_s3_img",     value: auS3Img },
  ], setAuStorySaving);

  const saveAuFeatures = () => saveAuBatch([
    { key: "au_feats_heading", value: auFeatsHeading },
    { key: "au_feat1_icon",    value: auFeat1Icon },
    { key: "au_feat1_title",   value: auFeat1Title },
    { key: "au_feat1_desc",    value: auFeat1Desc },
    { key: "au_feat2_icon",    value: auFeat2Icon },
    { key: "au_feat2_title",   value: auFeat2Title },
    { key: "au_feat2_desc",    value: auFeat2Desc },
    { key: "au_feat3_icon",    value: auFeat3Icon },
    { key: "au_feat3_title",   value: auFeat3Title },
    { key: "au_feat3_desc",    value: auFeat3Desc },
  ], setAuFeatsSaving);

  const saveAuFounder = () => saveAuBatch([
    { key: "au_founder_quote", value: auFounderQuote },
    { key: "au_founder_name",  value: auFounderName },
    { key: "au_founder_title", value: auFounderTitle },
    { key: "au_founder_img",   value: auFounderImg },
  ], setAuFounderSaving);

  // ── Contact Us fetcher & savers ───────────────────────────────────────────
  const fetchContactUs = useCallback(async () => {
    const { data } = await supabase.from("site_settings").select("key,value").like("key", "ct_%");
    const m: Record<string, string> = {};
    (data ?? []).forEach((r: { key: string; value: string }) => { m[r.key] = r.value; });
    if (m.ct_hero_img     !== undefined) setCtHeroImg(m.ct_hero_img || "");
    if (m.ct_heading      !== undefined) setCtHeading(m.ct_heading || "Contact Us");
    if (m.ct_subtext      !== undefined) setCtSubtext(m.ct_subtext);
    if (m.ct_track_text   !== undefined) setCtTrackText(m.ct_track_text);
    if (m.ct_track_url    !== undefined) setCtTrackUrl(m.ct_track_url || "/track");
    if (m.ct_return_text  !== undefined) setCtReturnText(m.ct_return_text);
    if (m.ct_return_url   !== undefined) setCtReturnUrl(m.ct_return_url || "/returns");
    if (m.ct_faq_heading  !== undefined) setCtFaqHeading(m.ct_faq_heading || "Popular Searched Questions");
    if (m.ct_faq_1_q !== undefined) setCtFaq1Q(m.ct_faq_1_q); if (m.ct_faq_1_a !== undefined) setCtFaq1A(m.ct_faq_1_a);
    if (m.ct_faq_2_q !== undefined) setCtFaq2Q(m.ct_faq_2_q); if (m.ct_faq_2_a !== undefined) setCtFaq2A(m.ct_faq_2_a);
    if (m.ct_faq_3_q !== undefined) setCtFaq3Q(m.ct_faq_3_q); if (m.ct_faq_3_a !== undefined) setCtFaq3A(m.ct_faq_3_a);
    if (m.ct_faq_4_q !== undefined) setCtFaq4Q(m.ct_faq_4_q); if (m.ct_faq_4_a !== undefined) setCtFaq4A(m.ct_faq_4_a);
    if (m.ct_faq_5_q !== undefined) setCtFaq5Q(m.ct_faq_5_q); if (m.ct_faq_5_a !== undefined) setCtFaq5A(m.ct_faq_5_a);
    if (m.ct_faq_6_q !== undefined) setCtFaq6Q(m.ct_faq_6_q); if (m.ct_faq_6_a !== undefined) setCtFaq6A(m.ct_faq_6_a);
    if (m.ct_faq_7_q !== undefined) setCtFaq7Q(m.ct_faq_7_q); if (m.ct_faq_7_a !== undefined) setCtFaq7A(m.ct_faq_7_a);
    if (m.ct_faq_8_q !== undefined) setCtFaq8Q(m.ct_faq_8_q); if (m.ct_faq_8_a !== undefined) setCtFaq8A(m.ct_faq_8_a);
    if (m.ct_info_heading !== undefined) setCtInfoHeading(m.ct_info_heading || "Any other questions?");
    if (m.ct_info_sub     !== undefined) setCtInfoSub(m.ct_info_sub);
    if (m.ct_phone        !== undefined) setCtPhone(m.ct_phone || "91- 9468147781");
    if (m.ct_email        !== undefined) setCtEmail(m.ct_email || "contact.classie@gmail.com");
    if (m.ct_social       !== undefined) setCtSocial(m.ct_social || "@classsie.in");
  }, []);

  const saveCtBatch = async (pairs: { key: string; value: string }[], setSaving: (v: boolean) => void) => {
    setSaving(true);
    for (const p of pairs) {
      await supabase.from("site_settings").delete().eq("key", p.key);
      await supabase.from("site_settings").insert(p);
    }
    await revalidateSite();
    setSaving(false);
  };

  const saveCtHero = () => saveCtBatch([
    { key: "ct_hero_img", value: ctHeroImg },
    { key: "ct_heading",  value: ctHeading },
    { key: "ct_subtext",  value: ctSubtext },
  ], setCtHeroSaving);

  const saveCtHelp = () => saveCtBatch([
    { key: "ct_track_text",  value: ctTrackText },
    { key: "ct_track_url",   value: ctTrackUrl },
    { key: "ct_return_text", value: ctReturnText },
    { key: "ct_return_url",  value: ctReturnUrl },
  ], setCtHelpSaving);

  const saveCtFaq = () => saveCtBatch([
    { key: "ct_faq_heading", value: ctFaqHeading },
    { key: "ct_faq_1_q", value: ctFaq1Q }, { key: "ct_faq_1_a", value: ctFaq1A },
    { key: "ct_faq_2_q", value: ctFaq2Q }, { key: "ct_faq_2_a", value: ctFaq2A },
    { key: "ct_faq_3_q", value: ctFaq3Q }, { key: "ct_faq_3_a", value: ctFaq3A },
    { key: "ct_faq_4_q", value: ctFaq4Q }, { key: "ct_faq_4_a", value: ctFaq4A },
    { key: "ct_faq_5_q", value: ctFaq5Q }, { key: "ct_faq_5_a", value: ctFaq5A },
    { key: "ct_faq_6_q", value: ctFaq6Q }, { key: "ct_faq_6_a", value: ctFaq6A },
    { key: "ct_faq_7_q", value: ctFaq7Q }, { key: "ct_faq_7_a", value: ctFaq7A },
    { key: "ct_faq_8_q", value: ctFaq8Q }, { key: "ct_faq_8_a", value: ctFaq8A },
  ], setCtFaqSaving);

  const saveCtInfo = () => saveCtBatch([
    { key: "ct_info_heading", value: ctInfoHeading },
    { key: "ct_info_sub",     value: ctInfoSub },
    { key: "ct_phone",        value: ctPhone },
    { key: "ct_email",        value: ctEmail },
    { key: "ct_social",       value: ctSocial },
  ], setCtInfoSaving);

  const fetchCtInbox = useCallback(async () => {
    setCtInboxLoading(true);
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setCtInbox((data ?? []) as CtSubmission[]);
    setCtInboxLoading(false);
  }, []);

  // ── Shipping Policy fetch + save ─────────────────────────────────────────
  const fetchShippingPolicy = useCallback(async () => {
    const { data } = await supabase.from("site_settings").select("key,value").like("key", "sp_%");
    const m: Record<string, string> = {};
    (data ?? []).forEach((r: { key: string; value: string }) => { m[r.key] = r.value; });
    if (m.sp_heading  !== undefined) setSpHeading(m.sp_heading  || "Shipping Policy");
    if (m.sp_eyebrow  !== undefined) setSpEyebrow(m.sp_eyebrow  || "CLASSIE");
    if (m.sp_updated  !== undefined) setSpUpdated(m.sp_updated  || "Last updated: June 2025");
    if (m.sp_tile1_title !== undefined) setSpTile1Title(m.sp_tile1_title);
    if (m.sp_tile1_sub   !== undefined) setSpTile1Sub(m.sp_tile1_sub);
    if (m.sp_tile2_title !== undefined) setSpTile2Title(m.sp_tile2_title);
    if (m.sp_tile2_sub   !== undefined) setSpTile2Sub(m.sp_tile2_sub);
    if (m.sp_tile3_title !== undefined) setSpTile3Title(m.sp_tile3_title);
    if (m.sp_tile3_sub   !== undefined) setSpTile3Sub(m.sp_tile3_sub);
    if (m.sp_tile4_title !== undefined) setSpTile4Title(m.sp_tile4_title);
    if (m.sp_tile4_sub   !== undefined) setSpTile4Sub(m.sp_tile4_sub);
    if (m.sp_rates_heading    !== undefined) setSpRatesHeading(m.sp_rates_heading);
    if (m.sp_rates_body       !== undefined) setSpRatesBody(m.sp_rates_body);
    if (m.sp_timeline_heading !== undefined) setSpTimelineHeading(m.sp_timeline_heading);
    if (m.sp_timeline_body    !== undefined) setSpTimelineBody(m.sp_timeline_body);
    if (m.sp_tracking_heading !== undefined) setSpTrackingHeading(m.sp_tracking_heading);
    if (m.sp_tracking_body    !== undefined) setSpTrackingBody(m.sp_tracking_body);
    if (m.sp_address_heading  !== undefined) setSpAddressHeading(m.sp_address_heading);
    if (m.sp_address_body     !== undefined) setSpAddressBody(m.sp_address_body);
    if (m.sp_lost_heading     !== undefined) setSpLostHeading(m.sp_lost_heading);
    if (m.sp_lost_body        !== undefined) setSpLostBody(m.sp_lost_body);
    if (m.sp_cta_text         !== undefined) setSpCtaText(m.sp_cta_text);
  }, []);

  const saveSpBatch = async (pairs: { key: string; value: string }[], setSaving: (v: boolean) => void) => {
    setSaving(true);
    for (const p of pairs) {
      await supabase.from("site_settings").delete().eq("key", p.key);
      await supabase.from("site_settings").insert(p);
    }
    await revalidateSite();
    setSaving(false);
  };

  const saveSpHero    = () => saveSpBatch([
    { key: "sp_heading", value: spHeading },
    { key: "sp_eyebrow", value: spEyebrow },
    { key: "sp_updated", value: spUpdated },
  ], setSpHeroSaving);

  const saveSpTiles   = () => saveSpBatch([
    { key: "sp_tile1_title", value: spTile1Title },
    { key: "sp_tile1_sub",   value: spTile1Sub },
    { key: "sp_tile2_title", value: spTile2Title },
    { key: "sp_tile2_sub",   value: spTile2Sub },
    { key: "sp_tile3_title", value: spTile3Title },
    { key: "sp_tile3_sub",   value: spTile3Sub },
    { key: "sp_tile4_title", value: spTile4Title },
    { key: "sp_tile4_sub",   value: spTile4Sub },
  ], setSpTilesSaving);

  const saveSpContent = () => saveSpBatch([
    { key: "sp_rates_heading",    value: spRatesHeading },
    { key: "sp_rates_body",       value: spRatesBody },
    { key: "sp_timeline_heading", value: spTimelineHeading },
    { key: "sp_timeline_body",    value: spTimelineBody },
    { key: "sp_tracking_heading", value: spTrackingHeading },
    { key: "sp_tracking_body",    value: spTrackingBody },
    { key: "sp_address_heading",  value: spAddressHeading },
    { key: "sp_address_body",     value: spAddressBody },
    { key: "sp_lost_heading",     value: spLostHeading },
    { key: "sp_lost_body",        value: spLostBody },
  ], setSpContentSaving);

  const saveSpCta     = () => saveSpBatch([
    { key: "sp_cta_text", value: spCtaText },
  ], setSpCtaSaving);

  // ── Size Guide fetcher & savers ───────────────────────────────────────────
  const fetchSizeGuide = useCallback(async () => {
    const { data } = await supabase.from("site_settings").select("key,value").like("key", "sg_%");
    const m: Record<string, string> = {};
    (data ?? []).forEach((r: { key: string; value: string }) => { m[r.key] = r.value; });
    if (m.sg_eyebrow        !== undefined) setSgEyebrow(m.sg_eyebrow        || "CLASSIE");
    if (m.sg_heading        !== undefined) setSgHeading(m.sg_heading        || "Size Guide");
    if (m.sg_sub            !== undefined) setSgSub(m.sg_sub                || "Find your perfect fit — every time");
    if (m.sg_measure_heading !== undefined) setSgMeasureHeading(m.sg_measure_heading || "How to Measure Your Foot");
    if (m.sg_measure_steps  !== undefined) setSgMeasureSteps(m.sg_measure_steps);
    if (m.sg_chart_heading  !== undefined) setSgChartHeading(m.sg_chart_heading || "Heel Size Chart");
    if (m.sg_chart_sub      !== undefined) setSgChartSub(m.sg_chart_sub     || "All measurements are in centimetres (cm)");
    if (m.sg_chart_json     !== undefined) setSgChartJson(m.sg_chart_json);
    if (m.sg_tips_heading   !== undefined) setSgTipsHeading(m.sg_tips_heading || "Tips for the Perfect Fit");
    if (m.sg_tip1_icon      !== undefined) setSgTip1Icon(m.sg_tip1_icon     || "📏");
    if (m.sg_tip1_title     !== undefined) setSgTip1Title(m.sg_tip1_title   || "Measure in the Evening");
    if (m.sg_tip1_body      !== undefined) setSgTip1Body(m.sg_tip1_body);
    if (m.sg_tip2_icon      !== undefined) setSgTip2Icon(m.sg_tip2_icon     || "👟");
    if (m.sg_tip2_title     !== undefined) setSgTip2Title(m.sg_tip2_title   || "If Between Sizes");
    if (m.sg_tip2_body      !== undefined) setSgTip2Body(m.sg_tip2_body);
    if (m.sg_tip3_icon      !== undefined) setSgTip3Icon(m.sg_tip3_icon     || "💬");
    if (m.sg_tip3_title     !== undefined) setSgTip3Title(m.sg_tip3_title   || "Need Help?");
    if (m.sg_tip3_body      !== undefined) setSgTip3Body(m.sg_tip3_body);
    if (m.sg_cta_text       !== undefined) setSgCtaText(m.sg_cta_text       || "Still not sure about your size?");
  }, []);

  const saveSgBatch = async (pairs: { key: string; value: string }[], setSaving: (v: boolean) => void) => {
    setSaving(true);
    for (const p of pairs) {
      await supabase.from("site_settings").delete().eq("key", p.key);
      await supabase.from("site_settings").insert(p);
    }
    await revalidateSite();
    setSaving(false);
  };

  const saveSgHero    = () => saveSgBatch([
    { key: "sg_eyebrow", value: sgEyebrow },
    { key: "sg_heading", value: sgHeading },
    { key: "sg_sub",     value: sgSub },
  ], setSgHeroSaving);

  const saveSgMeasure = () => saveSgBatch([
    { key: "sg_measure_heading", value: sgMeasureHeading },
    { key: "sg_measure_steps",   value: sgMeasureSteps },
  ], setSgMeasureSaving);

  const saveSgChart   = () => saveSgBatch([
    { key: "sg_chart_heading", value: sgChartHeading },
    { key: "sg_chart_sub",     value: sgChartSub },
    { key: "sg_chart_json",    value: sgChartJson },
  ], setSgChartSaving);

  const saveSgTips    = () => saveSgBatch([
    { key: "sg_tips_heading", value: sgTipsHeading },
    { key: "sg_tip1_icon",    value: sgTip1Icon },
    { key: "sg_tip1_title",   value: sgTip1Title },
    { key: "sg_tip1_body",    value: sgTip1Body },
    { key: "sg_tip2_icon",    value: sgTip2Icon },
    { key: "sg_tip2_title",   value: sgTip2Title },
    { key: "sg_tip2_body",    value: sgTip2Body },
    { key: "sg_tip3_icon",    value: sgTip3Icon },
    { key: "sg_tip3_title",   value: sgTip3Title },
    { key: "sg_tip3_body",    value: sgTip3Body },
  ], setSgTipsSaving);

  const saveSgCta     = () => saveSgBatch([
    { key: "sg_cta_text", value: sgCtaText },
  ], setSgCtaSaving);

  // ── Returns & Exchanges fetcher & savers ──────────────────────────────────
  const fetchReturns = useCallback(async () => {
    const { data } = await supabase.from("site_settings").select("key,value").like("key", "re_%");
    const m: Record<string, string> = {};
    (data ?? []).forEach((r: { key: string; value: string }) => { m[r.key] = r.value; });
    if (m.re_eyebrow           !== undefined) setReEyebrow(m.re_eyebrow           || "CLASSIE");
    if (m.re_heading           !== undefined) setReHeading(m.re_heading           || "Returns & Exchanges");
    if (m.re_sub               !== undefined) setReSub(m.re_sub                   || "Hassle-free returns within 7 days of delivery");
    if (m.re_updated           !== undefined) setReUpdated(m.re_updated           || "Last updated: June 2025");
    if (m.re_tile1_title       !== undefined) setReTile1Title(m.re_tile1_title    || "7-Day Returns");
    if (m.re_tile1_sub         !== undefined) setReTile1Sub(m.re_tile1_sub        || "Return within 7 days of delivery");
    if (m.re_tile2_title       !== undefined) setReTile2Title(m.re_tile2_title    || "Free Size Exchange");
    if (m.re_tile2_sub         !== undefined) setReTile2Sub(m.re_tile2_sub        || "Subject to stock availability");
    if (m.re_tile3_title       !== undefined) setReTile3Title(m.re_tile3_title    || "Refund in 5–7 Days");
    if (m.re_tile3_sub         !== undefined) setReTile3Sub(m.re_tile3_sub        || "After product inspection");
    if (m.re_eligible_heading  !== undefined) setReEligibleHeading(m.re_eligible_heading  || "Eligible Returns");
    if (m.re_eligible_body     !== undefined) setReEligibleBody(m.re_eligible_body);
    if (m.re_nonreturn_heading !== undefined) setReNonreturnHeading(m.re_nonreturn_heading || "Non-Returnable Items");
    if (m.re_nonreturn_body    !== undefined) setReNonreturnBody(m.re_nonreturn_body);
    if (m.re_initiate_heading  !== undefined) setReInitiateHeading(m.re_initiate_heading  || "How to Initiate a Return");
    if (m.re_initiate_body     !== undefined) setReInitiateBody(m.re_initiate_body);
    if (m.re_exchange_heading  !== undefined) setReExchangeHeading(m.re_exchange_heading  || "Exchanges");
    if (m.re_exchange_body     !== undefined) setReExchangeBody(m.re_exchange_body);
    if (m.re_refund_heading    !== undefined) setReRefundHeading(m.re_refund_heading      || "Refunds");
    if (m.re_refund_body       !== undefined) setReRefundBody(m.re_refund_body);
    if (m.re_cta_text          !== undefined) setReCtaText(m.re_cta_text || "Need help with a return or exchange?");
  }, []);

  const saveReBatch = async (pairs: { key: string; value: string }[], setSaving: (v: boolean) => void) => {
    setSaving(true);
    for (const p of pairs) {
      await supabase.from("site_settings").delete().eq("key", p.key);
      await supabase.from("site_settings").insert(p);
    }
    await revalidateSite();
    setSaving(false);
  };

  const saveReHero   = () => saveReBatch([
    { key: "re_eyebrow", value: reEyebrow },
    { key: "re_heading", value: reHeading },
    { key: "re_sub",     value: reSub },
    { key: "re_updated", value: reUpdated },
  ], setReHeroSaving);

  const saveReTiles  = () => saveReBatch([
    { key: "re_tile1_title", value: reTile1Title },
    { key: "re_tile1_sub",   value: reTile1Sub },
    { key: "re_tile2_title", value: reTile2Title },
    { key: "re_tile2_sub",   value: reTile2Sub },
    { key: "re_tile3_title", value: reTile3Title },
    { key: "re_tile3_sub",   value: reTile3Sub },
  ], setReTilesSaving);

  const saveRePolicy = () => saveReBatch([
    { key: "re_eligible_heading",  value: reEligibleHeading },
    { key: "re_eligible_body",     value: reEligibleBody },
    { key: "re_nonreturn_heading", value: reNonreturnHeading },
    { key: "re_nonreturn_body",    value: reNonreturnBody },
    { key: "re_initiate_heading",  value: reInitiateHeading },
    { key: "re_initiate_body",     value: reInitiateBody },
    { key: "re_exchange_heading",  value: reExchangeHeading },
    { key: "re_exchange_body",     value: reExchangeBody },
    { key: "re_refund_heading",    value: reRefundHeading },
    { key: "re_refund_body",       value: reRefundBody },
  ], setRePolicySaving);

  const saveReCta    = () => saveReBatch([
    { key: "re_cta_text", value: reCtaText },
  ], setReCtaSaving);

  const fetchCoupons = useCallback(async () => {
    const { data } = await supabase.from("coupons").select("*").order("display_order", { ascending: true });
    setCoupons((data ?? []) as Coupon[]);
  }, []);

  const fetchCouponStats = useCallback(async () => {
    const { data } = await supabase
      .from("coupon_uses")
      .select("*, coupons(code)")
      .order("used_at", { ascending: false });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = (data ?? []).map((r: any) => ({
      ...r,
      coupon_code: r.coupons?.code || "",
    }));
    setCouponStats(rows);
  }, []);

  const saveCoupon = async () => {
    setCouponSaving(true);
    try {
      const d = couponModal.data;
      const payload = {
        code: (d.code || "").toUpperCase().trim(),
        title: d.title || "",
        description: d.description || "",
        image_url: d.image_url || "",
        discount_type: d.discount_type || "percent",
        discount_value: d.discount_value || 0,
        active: d.active !== false,
        require_phone: d.require_phone || false,
        require_email: d.require_email || false,
        max_uses_total: d.max_uses_total ?? null,
        max_uses_per_user: d.max_uses_per_user ?? 1,
        valid_from: d.valid_from || null,
        valid_until: d.valid_until || null,
        min_order_value: d.min_order_value || 0,
        display_order: d.display_order || 0,
      };
      if (couponModal.mode === "add") {
        await supabase.from("coupons").insert({ ...payload, uses_count: 0 });
      } else {
        await supabase.from("coupons").update(payload).eq("id", d.id!);
      }
      await fetchCoupons();
      await revalidateSite();
      setCouponModal(m => ({ ...m, open: false }));
    } finally {
      setCouponSaving(false);
    }
  };

  const deleteCoupon = async (id: string) => {
    await supabase.from("coupons").delete().eq("id", id);
    await fetchCoupons();
    await revalidateSite();
  };

  const toggleCouponActive = async (id: string, active: boolean) => {
    await supabase.from("coupons").update({ active }).eq("id", id);
    setCoupons(cs => cs.map(c => c.id === id ? { ...c, active } : c));
    await revalidateSite();
  };

  const saveAdvSection = async (section: string) => {
    setAdvSaving(true);
    let pairs: {key:string;value:string}[] = [];
    if (section==="shop")    pairs = [{key:"adv_shop_mobile",value:String(advShopMobile)},{key:"adv_shop_desktop",value:String(advShopDesktop)},{key:"adv_shop_gap",value:String(advShopGap)},{key:"adv_shop_aspect",value:advShopAspect},{key:"adv_shop_radius",value:advShopRadius},{key:"adv_shop_card_h",value:String(advShopCardH)}];
    if (section==="coll")    pairs = [{key:"adv_coll_mobile",value:String(advCollMobile)},{key:"adv_coll_desktop",value:String(advCollDesktop)},{key:"adv_coll_gap",value:String(advCollGap)},{key:"adv_coll_aspect",value:advCollAspect},{key:"adv_coll_radius",value:advCollRadius},{key:"adv_coll_card_h",value:String(advCollCardH)}];
    if (section==="picks")   pairs = [{key:"adv_picks_mobile",value:String(advPicksMobile)},{key:"adv_picks_desktop",value:String(advPicksDesktop)},{key:"adv_picks_gap",value:String(advPicksGap)},{key:"adv_picks_aspect",value:advPicksAspect},{key:"adv_picks_radius",value:advPicksRadius},{key:"adv_picks_card_h",value:String(advPicksCardH)}];
    if (section==="inspo")   pairs = [{key:"adv_inspo_desktop",value:String(advInspoDesktop)},{key:"adv_inspo_gap",value:String(advInspoGap)},{key:"adv_inspo_aspect",value:advInspoAspect},{key:"adv_inspo_radius",value:advInspoRadius},{key:"adv_inspo_card_h",value:String(advInspoCardH)}];
    if (section==="related") pairs = [{key:"adv_related_mobile",value:String(advRelatedMobile)},{key:"adv_related_desktop",value:String(advRelatedDesktop)},{key:"adv_related_gap",value:String(advRelatedGap)},{key:"adv_related_aspect",value:advRelatedAspect},{key:"adv_related_radius",value:advRelatedRadius},{key:"adv_related_card_h",value:String(advRelatedCardH)}];
    for (const p of pairs) {
      await supabase.from("site_settings").delete().eq("key",p.key);
      await supabase.from("site_settings").insert(p);
    }
    await revalidateSite();
    setAdvSaving(false);
  };

  // Load data when authenticated
  useEffect(() => {
    if (!authed) return;
    fetchOrders();
    fetchProducts();
  }, [authed, fetchOrders, fetchProducts]);

  useEffect(() => {
    if (!authed) return;
    if (tab === "slides") { fetchSlides(); fetchSettings(); }
    if (tab === "announcement") { fetchSettings(); }
    if (tab === "trust-band") { fetchSettings(); fetchFeaturesBar(); }
    if (tab === "settings") { fetchSettings(); fetchFeaturesBar(); }
    if (tab === "footer") { fetchSettings(); }
    if (tab === "messages") { fetchMessages(); fetchSubscribers(); }
    if (tab === "collections") fetchCollections();
    if (tab === "heels-page") fetchHeelsPage();
    if (tab === "clips-page") fetchClipsPage();
    if (tab === "bow-page") fetchBowPage();
    if (tab === "collections-page") fetchCollectionsPage();
    if (tab === "style-ideas-page") { fetchStyleIdeasPage(); fetchStyleInspos(); }
    if (tab === "style-ideas-featured") { fetchStyleIdeasPage(); fetchAllProducts(); }
    if (tab === "style-ideas-reels") fetchStyleIdeasPage();

    if (["adv-shop","adv-coll","adv-picks","adv-inspo","adv-related"].includes(tab)) fetchAdvSettings();

    if (tab === "hd-page")    fetchHdPage();
    if (tab === "hd-coupons") fetchCoupons();
    if (tab === "hd-stats")   fetchCouponStats();

    if (["au-hero","au-banner","au-story","au-features","au-founder"].includes(tab)) fetchAboutUs();

    if (["ct-hero","ct-help","ct-faq","ct-info"].includes(tab)) fetchContactUs();
    if (tab === "ct-inbox") fetchCtInbox();

    if (["sp-hero","sp-tiles","sp-content","sp-cta"].includes(tab)) fetchShippingPolicy();
    if (["sg-hero","sg-measure","sg-chart","sg-tips","sg-cta"].includes(tab)) fetchSizeGuide();
    if (["re-hero","re-tiles","re-policy","re-cta"].includes(tab)) fetchReturns();

    if (tab === "categories") fetchCategories();
    if (tab === "product-page") loadFeatureTiles();
    if (tab === "featured-picks") { fetchFeaturedPicks(); fetchSettings(); }
    if (tab === "testimonials") fetchTestimonials();
    if (tab === "instagram") fetchInstagramImages();
    if (tab === "style-inspo") fetchStyleInspos();
  }, [authed, tab, fetchSlides, fetchSettings, fetchFeaturesBar, fetchMessages, fetchSubscribers, fetchCollections, fetchCategories, fetchFeaturedPicks, fetchTestimonials, fetchInstagramImages, fetchStyleInspos, fetchClipsPage, fetchBowPage, fetchCollectionsPage, fetchStyleIdeasPage, fetchAdvSettings, fetchHdPage, fetchCoupons, fetchCouponStats, fetchAboutUs, fetchContactUs, fetchCtInbox, fetchShippingPolicy, fetchSizeGuide, fetchReturns]);

  // ── Auth ─────────────────────────────────────────────────────────────────

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === "classie@admin123") { setAuthed(true); setPwError(""); }
    else setPwError("Incorrect password. Please try again.");
  };

  // ── Order actions ─────────────────────────────────────────────────────────

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } finally { setUpdatingId(null); }
  };

  // ── Product actions ───────────────────────────────────────────────────────

  const openAddProduct = () => { setBundleOffers([]); setProductModal({ open: true, mode: "add", data: { ...EMPTY_PRODUCT } }); };
  const openEditProduct = (p: DbProduct) => { setProductModal({ open: true, mode: "edit", data: { ...p } }); if (p.slug) { loadBundleOffers(p.slug); loadColorVariants(p.slug); } };
  const closeProductModal = () => setProductModal((m) => ({ ...m, open: false }));

  const handleProductSave = async () => {
    setProductSaving(true);
    try {
      const { id, created_at, ...rest } = productModal.data;
      if (productModal.mode === "add") {
        await supabase.from("products").insert([rest]);
      } else {
        await supabase.from("products").update(rest).eq("id", id);
      }
      await fetchProducts();
      closeProductModal();
      await revalidateSite();
    } catch { /* ignore */ }
    finally { setProductSaving(false); }
  };

  const deleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    setDbProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  };

  const toggleProductActive = async (p: DbProduct) => {
    await supabase.from("products").update({ active: !p.active }).eq("id", p.id);
    setDbProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, active: !x.active } : x)));
  };

  const setProductField = (key: keyof DbProduct, val: unknown) =>
    setProductModal((m) => ({ ...m, data: { ...m.data, [key]: val } }));

  // ── Bundle Offer actions ───────────────────────────────────────────────────

  const loadBundleOffers = async (mainSlug: string) => {
    if (!mainSlug) return;
    setBundleOffersLoading(true);
    try {
      const { data } = await supabase
        .from("product_bundle_offers")
        .select("*")
        .eq("main_product_slug", mainSlug)
        .order("sort_order");
      setBundleOffers((data as BundleOffer[]) ?? []);
    } finally {
      setBundleOffersLoading(false);
    }
  };

  const addBundleOffer = async () => {
    if (!newBundleOffer.accessory_slug || !productModal.data.slug) return;
    setBundleOfferSaving(true);
    try {
      await supabase.from("product_bundle_offers").insert([{
        main_product_slug: productModal.data.slug,
        accessory_slug: newBundleOffer.accessory_slug,
        discount_type: newBundleOffer.discount_type,
        discount_value: newBundleOffer.discount_value,
        custom_label: newBundleOffer.custom_label || "",
        sort_order: bundleOffers.length,
        active: true,
      }]);
      await loadBundleOffers(productModal.data.slug);
      setNewBundleOffer({ accessory_slug: "", discount_type: "percentage", discount_value: 0, custom_label: "" });
      await revalidateSite();
    } finally {
      setBundleOfferSaving(false);
    }
  };

  const deleteBundleOffer = async (id: string) => {
    await supabase.from("product_bundle_offers").delete().eq("id", id);
    setBundleOffers((prev) => prev.filter((o) => o.id !== id));
    await revalidateSite();
  };

  // ── Color Variant actions ──────────────────────────────────────────────────

  const loadColorVariants = async (slug: string) => {
    setColorVariantsLoading(true);
    try {
      const { data: myRow } = await supabase.from("product_color_variants").select("*").eq("product_slug", slug).maybeSingle();
      if (myRow) {
        setMyColorInfo({ color_name: myRow.color_name, color_hex: myRow.color_hex });
        const { data: groupRows } = await supabase.from("product_color_variants").select("*").eq("group_id", myRow.group_id).order("sort_order");
        setColorVariants(groupRows || []);
      } else {
        setMyColorInfo({ color_name: "", color_hex: "#000000" });
        setColorVariants([]);
      }
    } finally {
      setColorVariantsLoading(false);
    }
  };

  const saveMyColorInfo = async () => {
    if (!productModal.data?.slug || !myColorInfo.color_name) return;
    setColorVariantSaving(true);
    try {
      const slug = productModal.data.slug;
      const { data: myRow } = await supabase.from("product_color_variants").select("*").eq("product_slug", slug).maybeSingle();
      if (myRow) {
        await supabase.from("product_color_variants").update({ color_name: myColorInfo.color_name, color_hex: myColorInfo.color_hex }).eq("id", myRow.id);
      } else {
        const newGroupId = crypto.randomUUID();
        await supabase.from("product_color_variants").insert({ group_id: newGroupId, product_slug: slug, color_name: myColorInfo.color_name, color_hex: myColorInfo.color_hex, sort_order: 0 });
      }
      await loadColorVariants(slug);
    } finally {
      setColorVariantSaving(false);
    }
  };

  const addColorVariant = async () => {
    if (!productModal.data?.slug || !newColorVariant.product_slug || !newColorVariant.color_name) return;
    setColorVariantSaving(true);
    try {
      const slug = productModal.data.slug;
      const { data: myRow } = await supabase.from("product_color_variants").select("*").eq("product_slug", slug).maybeSingle();
      let groupId: string;
      if (myRow) {
        groupId = myRow.group_id;
      } else {
        groupId = crypto.randomUUID();
        await supabase.from("product_color_variants").insert({ group_id: groupId, product_slug: slug, color_name: myColorInfo.color_name || "Default", color_hex: myColorInfo.color_hex || "#000000", sort_order: 0 });
      }
      const { data: targetRow } = await supabase.from("product_color_variants").select("*").eq("product_slug", newColorVariant.product_slug).maybeSingle();
      if (targetRow) {
        await supabase.from("product_color_variants").update({ group_id: groupId, color_name: newColorVariant.color_name, color_hex: newColorVariant.color_hex }).eq("id", targetRow.id);
      } else {
        await supabase.from("product_color_variants").insert({ group_id: groupId, product_slug: newColorVariant.product_slug, color_name: newColorVariant.color_name, color_hex: newColorVariant.color_hex, sort_order: colorVariants.length });
      }
      setNewColorVariant({ product_slug: "", color_name: "", color_hex: "#000000" });
      await loadColorVariants(slug);
    } finally {
      setColorVariantSaving(false);
    }
  };

  const removeColorVariant = async (id: string) => {
    if (!productModal.data?.slug) return;
    await supabase.from("product_color_variants").delete().eq("id", id);
    await loadColorVariants(productModal.data.slug);
  };

  // ── Feature Tiles actions ──────────────────────────────────────────────────

  const loadFeatureTiles = async () => {
    try {
      const { data } = await supabase.from("site_settings").select("value").eq("key", "feature_tiles").maybeSingle();
      if (data?.value) {
        const parsed = JSON.parse(data.value);
        if (Array.isArray(parsed) && parsed.length > 0) setFeatureTiles(parsed);
      }
    } catch { /* use defaults */ }
  };

  const saveFeatureTiles = async () => {
    setFeatureTilesSaving(true);
    try {
      await supabase.from("site_settings").delete().eq("key", "feature_tiles");
      await supabase.from("site_settings").insert({ key: "feature_tiles", value: JSON.stringify(featureTiles) });
      await revalidateSite();
      alert("Feature tiles saved!");
    } finally {
      setFeatureTilesSaving(false);
    }
  };

  // ── Slide actions ─────────────────────────────────────────────────────────

  const openAddSlide = () => setSlideModal({ open: true, mode: "add", data: { ...EMPTY_SLIDE } });
  const openEditSlide = (s: HeroSlide) => setSlideModal({ open: true, mode: "edit", data: { ...s } });
  const closeSlideModal = () => setSlideModal((m) => ({ ...m, open: false }));

  const handleSlideSave = async () => {
    setSlideSaving(true);
    try {
      const { id, ...rest } = slideModal.data;
      if (slideModal.mode === "add") {
        await supabase.from("hero_slides").insert([rest]);
      } else {
        await supabase.from("hero_slides").update(rest).eq("id", id);
      }
      await fetchSlides();
      await revalidateSite(); // ← was missing! now website updates instantly
      closeSlideModal();
    } catch { /* ignore */ }
    finally { setSlideSaving(false); }
  };

  const deleteSlide = async (id: string) => {
    await supabase.from("hero_slides").delete().eq("id", id);
    setSlides((prev) => prev.filter((s) => s.id !== id));
    setDeleteSlideConfirm(null);
    await revalidateSite();
  };

  const toggleSlideActive = async (s: HeroSlide) => {
    await supabase.from("hero_slides").update({ active: !s.active }).eq("id", s.id);
    setSlides((prev) => prev.map((x) => (x.id === s.id ? { ...x, active: !x.active } : x)));
    await revalidateSite();
  };

  const setSlideField = (key: keyof HeroSlide, val: unknown) =>
    setSlideModal((m) => ({ ...m, data: { ...m.data, [key]: val } }));

  // ── Collection actions ────────────────────────────────────────────────────

  const openEditCollection = (c: Collection) => setCollectionModal({ open: true, data: { ...c } });
  const closeCollectionModal = () => setCollectionModal((m) => ({ ...m, open: false }));

  const handleCollectionSave = async () => {
    const { title, slug } = collectionModal.data;
    if (!title.trim()) { alert("Title required!"); return; }
    if (!slug.trim()) { alert("Slug required! Example: summer-edit"); return; }
    setCollectionSaving(true);
    try {
      const { id, ...rest } = collectionModal.data;
      if (collectionModalMode === "add") {
        const { error } = await supabase.from("collections").insert([rest]);
        if (error) { alert("Error: " + error.message); return; }
      } else {
        const { error } = await supabase.from("collections").update(rest).eq("id", id);
        if (error) { alert("Error: " + error.message); return; }
      }
      await fetchCollections();
      closeCollectionModal();
      await revalidateSite();
    } catch (e: unknown) { alert("Save failed: " + (e instanceof Error ? e.message : String(e))); }
    finally { setCollectionSaving(false); }
  };

  const deleteCollection = async (id: string) => {
    if (!confirm("Delete this collection? This cannot be undone.")) return;
    await supabase.from("collections").delete().eq("id", id);
    setCollections((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleCollectionActive = async (c: Collection) => {
    await supabase.from("collections").update({ active: !c.active }).eq("id", c.id);
    setCollections((prev) => prev.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x)));
  };

  const setCollectionField = (key: keyof Collection, val: unknown) =>
    setCollectionModal((m) => ({ ...m, data: { ...m.data, [key]: val } }));

  // ── Site Category actions ─────────────────────────────────────────────────

  const openAddCategory = () => {
    setCategorySlugManuallyEdited(false);
    setCategoryModal({ open: true, mode: "add", data: { name: "", slug: "", description: "", image_url: "", display_order: siteCategories.length + 1, active: true } });
  };
  const openEditCategory = (c: SiteCategory) => setCategoryModal({ open: true, mode: "edit", data: { ...c } });
  const closeCategoryModal = () => setCategoryModal((m) => ({ ...m, open: false }));

  const handleCategorySave = async () => {
    const { name, slug } = categoryModal.data;
    if (!name.trim()) { alert("Name required!"); return; }
    if (!slug.trim()) { alert("Slug required! Example: heels"); return; }
    setCategorySaving(true);
    try {
      const { id, created_at, ...rest } = categoryModal.data;
      if (categoryModal.mode === "add") {
        const { error } = await supabase.from("site_categories").insert([rest]);
        if (error) { alert("Error: " + error.message); return; }
      } else {
        const { error } = await supabase.from("site_categories").update(rest).eq("id", id);
        if (error) { alert("Error: " + error.message); return; }
      }
      await revalidateSite();
      await fetchCategories();
      closeCategoryModal();
    } catch (e: unknown) { alert("Save failed: " + (e instanceof Error ? e.message : String(e))); }
    finally { setCategorySaving(false); }
  };

  const deleteCategory = async (id: string) => {
    await supabase.from("site_categories").delete().eq("id", id);
    await revalidateSite();
    setSiteCategories((prev) => prev.filter((c) => c.id !== id));
    setDeleteCategoryConfirm(null);
  };

  const toggleCategoryActive = async (c: SiteCategory) => {
    await supabase.from("site_categories").update({ active: !c.active }).eq("id", c.id);
    await revalidateSite();
    setSiteCategories((prev) => prev.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x)));
  };

  const setCategoryField = (key: keyof SiteCategory, val: unknown) =>
    setCategoryModal((m) => ({ ...m, data: { ...m.data, [key]: val } }));

  // ── Category Products actions ─────────────────────────────────────────────

  const fetchAllProducts = useCallback(async () => {
    if (allProductsForCategoryModal.length > 0) return; // already loaded
    const { data } = await supabase.from('products').select('*').eq('active', true).order('title');
    setAllProductsForCategoryModal((data as DbProduct[]) ?? []);
  }, [allProductsForCategoryModal.length]);

  const openManageCategoryProducts = async (c: SiteCategory) => {
    // Load all active products
    const { data: allProds } = await supabase.from('products').select('*').eq('active', true).order('title');
    setAllProductsForCategoryModal((allProds as DbProduct[]) ?? []);
    // Load existing links
    let linkedIds: string[] = [];
    if (c.id) {
      const { data: links } = await supabase
        .from('category_products')
        .select('product_id')
        .eq('category_id', c.id);
      linkedIds = (links ?? []).map((l: { product_id: string }) => l.product_id);
    }
    setCategoryProductIds(linkedIds);
    setManageCategoryProductsModal({ open: true, category: c, saving: false, search: "" });
  };

  const saveManageCategoryProducts = async () => {
    if (!manageCategoryProductsModal.category?.id) return;
    setManageCategoryProductsModal(m => ({ ...m, saving: true }));
    const catId = manageCategoryProductsModal.category!.id!;
    // Delete all existing links for this category
    await supabase.from('category_products').delete().eq('category_id', catId);
    // Insert checked products
    if (categoryProductIds.length > 0) {
      await supabase.from('category_products').insert(
        categoryProductIds.map((pid, i) => ({
          category_id: catId,
          product_id: pid,
          display_order: i + 1,
        }))
      );
    }
    setManageCategoryProductsModal(m => ({ ...m, open: false, saving: false }));
  };

  const openManageProducts = async (c: Collection) => {
    const { data: col } = await supabase.from('collections').select('id').eq('slug', c.slug).single();
    let selectedSlugs: string[] = [];
    if (col) {
      const { data: links } = await supabase
        .from('collection_products')
        .select('product_slug')
        .eq('collection_id', col.id);
      selectedSlugs = (links ?? []).map((l: any) => l.product_slug);
    }
    setManageProductsModal({ open: true, collection: c, selectedSlugs, saving: false });
  };

  const saveManageProducts = async () => {
    if (!manageProductsModal.collection) return;
    setManageProductsModal(m => ({ ...m, saving: true }));
    const { data: col } = await supabase.from('collections').select('id').eq('slug', manageProductsModal.collection.slug).single();
    if (!col) { setManageProductsModal(m => ({ ...m, saving: false })); return; }
    await supabase.from('collection_products').delete().eq('collection_id', col.id);
    if (manageProductsModal.selectedSlugs.length > 0) {
      await supabase.from('collection_products').insert(
        manageProductsModal.selectedSlugs.map((slug, i) => ({
          collection_id: col.id,
          product_slug: slug,
          display_order: i + 1,
        }))
      );
    }
    setManageProductsModal(m => ({ ...m, open: false, saving: false }));
  };

  // ── Settings actions ──────────────────────────────────────────────────────

  // Helper: delete-then-insert so it works even without UNIQUE constraint on key
  const upsertSettings = async (rows: { key: string; value: string }[]) => {
    const keys = rows.map((r) => r.key);
    await supabase.from("site_settings").delete().in("key", keys);
    await supabase.from("site_settings").insert(rows);
    await revalidateSite(); // ← instant page cache clear after every save
  };

  const saveAnnouncements = async () => {
    setSettingsSaving(true);
    try {
      const rows: { key: string; value: string }[] = [];
      // Save announcement_1 through announcement_6
      for (let i = 0; i < 6; i++) {
        rows.push({ key: `announcement_${i + 1}`, value: announcementList[i] ?? "" });
      }
      rows.push({ key: "announcement_speed", value: announcementSpeed });
      rows.push({ key: "announcement_mode",  value: siteSettings.announcement_mode });
      await upsertSettings(rows);
    } catch { /* ignore */ }
    finally { setSettingsSaving(false); }
  };

  const saveSettings = async () => {
    setSettingsSaving(true);
    try {
      const rows: { key: string; value: string }[] = [
        { key: "logo_image_url",  value: siteSettings.logo_image_url },
        { key: "whatsapp_number", value: siteSettings.whatsapp_number },
        { key: "instagram_url",   value: siteSettings.instagram_url },
      ];
      await upsertSettings(rows);
    } catch { /* ignore */ }
    finally { setSettingsSaving(false); }
  };

  const saveNewsletterSettings = async () => {
    setSettingsSaving(true);
    try {
      await upsertSettings([
        { key: "nl_eyebrow",         value: siteSettings.nl_eyebrow },
        { key: "nl_heading",         value: siteSettings.nl_heading },
        { key: "nl_heading_italic",  value: siteSettings.nl_heading_italic },
        { key: "nl_subtext",         value: siteSettings.nl_subtext },
        { key: "nl_placeholder",     value: siteSettings.nl_placeholder },
        { key: "nl_btn_text",        value: siteSettings.nl_btn_text },
        { key: "nl_success_text",    value: siteSettings.nl_success_text },
      ]);
    } catch { /* ignore */ }
    finally { setSettingsSaving(false); }
  };

  const saveInstagramSettings = async () => {
    setSettingsSaving(true);
    try {
      await upsertSettings([
        { key: "ig_handle",      value: siteSettings.ig_handle },
        { key: "ig_heading",     value: siteSettings.ig_heading },
        { key: "ig_subtext",     value: siteSettings.ig_subtext },
        { key: "ig_follow_text", value: siteSettings.ig_follow_text },
        { key: "ig_follow_url",  value: siteSettings.ig_follow_url },
      ]);
    } catch { /* ignore */ }
    finally { setSettingsSaving(false); }
  };

  const savePhilosophy = async () => {
    setSettingsSaving(true);
    try {
      const rows: { key: string; value: string }[] = [
        { key: "philosophy_eyebrow",   value: siteSettings.philosophy_eyebrow },
        { key: "philosophy_headline",  value: siteSettings.philosophy_headline },
        { key: "philosophy_body",      value: siteSettings.philosophy_body },
        { key: "philosophy_cta_text",  value: siteSettings.philosophy_cta_text },
        { key: "philosophy_cta_url",   value: siteSettings.philosophy_cta_url },
        { key: "philosophy_headline_italic", value: siteSettings.philosophy_headline_italic },
        { key: "philosophy_headline2",       value: siteSettings.philosophy_headline2 },
        { key: "philosophy_image_url",       value: siteSettings.philosophy_image_url },
        { key: "phil_stat1_number", value: siteSettings.phil_stat1_number }, { key: "phil_stat1_label", value: siteSettings.phil_stat1_label },
        { key: "phil_stat2_number", value: siteSettings.phil_stat2_number }, { key: "phil_stat2_label", value: siteSettings.phil_stat2_label },
        { key: "phil_stat3_number", value: siteSettings.phil_stat3_number }, { key: "phil_stat3_label", value: siteSettings.phil_stat3_label },
        { key: "phil_f1_title", value: siteSettings.phil_f1_title }, { key: "phil_f1_desc", value: siteSettings.phil_f1_desc },
        { key: "phil_f2_title", value: siteSettings.phil_f2_title }, { key: "phil_f2_desc", value: siteSettings.phil_f2_desc },
      ];
      await upsertSettings(rows);
    } catch { /* ignore */ }
    finally { setSettingsSaving(false); }
  };

  const saveHero = async () => {
    setSettingsSaving(true);
    try {
      const rows: { key: string; value: string }[] = [
        { key: "hero_eyebrow",        value: siteSettings.hero_eyebrow },
        { key: "hero_heading_line1",  value: siteSettings.hero_heading_line1 },
        { key: "hero_heading_italic", value: siteSettings.hero_heading_italic },
        { key: "hero_heading_line3",  value: siteSettings.hero_heading_line3 },
        { key: "hero_subtitle",       value: siteSettings.hero_subtitle },
        { key: "hero_cta1_text",      value: siteSettings.hero_cta1_text },
        { key: "hero_cta1_url",       value: siteSettings.hero_cta1_url },
        { key: "hero_cta2_text",      value: siteSettings.hero_cta2_text },
        { key: "hero_cta2_url",       value: siteSettings.hero_cta2_url },
        { key: "hero_image_url",      value: siteSettings.hero_image_url },
        { key: "hero_stat1_number",   value: siteSettings.hero_stat1_number },
        { key: "hero_stat1_label",    value: siteSettings.hero_stat1_label },
        { key: "hero_stat2_number",   value: siteSettings.hero_stat2_number },
        { key: "hero_stat2_label",    value: siteSettings.hero_stat2_label },
        { key: "hero_stat3_number",   value: siteSettings.hero_stat3_number },
        { key: "hero_stat3_label",    value: siteSettings.hero_stat3_label },
        { key: "hero_chip_code",      value: siteSettings.hero_chip_code },
        { key: "hero_chip_text",      value: siteSettings.hero_chip_text },
        { key: "hero_badge_text",     value: siteSettings.hero_badge_text },
        { key: "hero_badge_sub",      value: siteSettings.hero_badge_sub },
        { key: "hero_badge_active",   value: siteSettings.hero_badge_active },
        { key: "hero_pill_text",      value: siteSettings.hero_pill_text },
        { key: "hero_pill_sub",       value: siteSettings.hero_pill_sub },
        { key: "hero_pill_active",    value: siteSettings.hero_pill_active },

      ];
      await upsertSettings(rows);
    } catch { /* ignore */ }
    finally { setSettingsSaving(false); }
  };

  const saveFooter = async () => {
    setSettingsSaving(true);
    try {
      await upsertSettings([
        { key: "footer_logo_url",        value: siteSettings.footer_logo_url },
        { key: "footer_tagline",         value: siteSettings.footer_tagline },
        { key: "footer_desc",            value: siteSettings.footer_desc },
        { key: "footer_ig_url",          value: siteSettings.footer_ig_url },
        { key: "footer_tiktok_url",      value: siteSettings.footer_tiktok_url },
        { key: "footer_fb_url",          value: siteSettings.footer_fb_url },
        { key: "footer_pinterest_url",   value: siteSettings.footer_pinterest_url },
        { key: "footer_whatsapp_url",    value: siteSettings.footer_whatsapp_url },
        { key: "footer_shop_heading",    value: siteSettings.footer_shop_heading },
        { key: "footer_help_heading",    value: siteSettings.footer_help_heading },
        { key: "footer_company_heading", value: siteSettings.footer_company_heading },
        { key: "footer_shop_links",      value: JSON.stringify(footerShopLinks.filter(l => l.text || l.url)) },
        { key: "footer_help_links",      value: JSON.stringify(footerHelpLinks.filter(l => l.text || l.url)) },
        { key: "footer_company_links",   value: JSON.stringify(footerCompanyLinks.filter(l => l.text || l.url)) },
        { key: "footer_copyright",       value: siteSettings.footer_copyright },
      ]);
    } catch { /* ignore */ }
    finally { setSettingsSaving(false); }
  };

  // ── Features Bar actions ──────────────────────────────────────────────────

  const openAddFeature = () => setFeaturesBarModal({ open: true, mode: "add", data: { ...EMPTY_FEATURE } });
  const openEditFeature = (f: FeatureBarItem) => setFeaturesBarModal({ open: true, mode: "edit", data: { ...f } });
  const closeFeaturesBarModal = () => setFeaturesBarModal((m) => ({ ...m, open: false }));

  const handleFeatureSave = async () => {
    setFeaturesBarSaving(true);
    try {
      const { id, ...rest } = featuresBarModal.data;
      if (featuresBarModal.mode === "add") {
        await supabase.from("features_bar").insert([rest]);
      } else {
        await supabase.from("features_bar").update(rest).eq("id", id);
      }
      await revalidateSite();
      await fetchFeaturesBar();
      closeFeaturesBarModal();
    } catch { /* ignore */ }
    finally { setFeaturesBarSaving(false); }
  };

  const deleteFeature = async (id: string) => {
    await supabase.from("features_bar").delete().eq("id", id);
    await revalidateSite();
    setFeaturesBarItems((prev) => prev.filter((f) => f.id !== id));
    setDeleteFeatureConfirm(null);
  };

  const toggleFeatureActive = async (f: FeatureBarItem) => {
    await supabase.from("features_bar").update({ active: !f.active }).eq("id", f.id);
    await revalidateSite();
    setFeaturesBarItems((prev) => prev.map((x) => (x.id === f.id ? { ...x, active: !x.active } : x)));
  };

  const setFeatureField = (key: keyof FeatureBarItem, val: unknown) =>
    setFeaturesBarModal((m) => ({ ...m, data: { ...m.data, [key]: val } }));

  // ── Computed stats ────────────────────────────────────────────────────────

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((s, o) => s + o.total_amount, 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const recentOrders = [...orders].slice(0, 10);
  const featuredProducts = dbProducts.filter((p) => p.is_featured).slice(0, 6);

  // ── Login screen ──────────────────────────────────────────────────────────

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#3B5373] to-[#2a3a47] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-5 border border-white/20">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">✦ CLASSIE</h1>
            <p className="text-white/50 text-sm mt-1">Admin Panel</p>
          </div>
          <form onSubmit={handleLogin} className="bg-white rounded-2xl p-8 shadow-2xl space-y-4">
            <div>
              <label className={labelCls}>Password</label>
              <input
                type="password" value={pw} onChange={(e) => setPw(e.target.value)}
                placeholder="Enter admin password" required
                className={inputCls}
                autoFocus
              />
            </div>
            {pwError && (
              <p className="text-red-600 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {pwError}
              </p>
            )}
            <button type="submit" className="w-full py-3 bg-[#3B5373] text-white rounded-xl text-sm font-semibold hover:bg-[#2d3f4f] transition-colors">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Sidebar nav items ─────────────────────────────────────────────────────

  const mainSection: MainSection = TAB_TO_SECTION[tab];

  const SIDEBAR_GROUPS: {
    header?: string;
    items: { id: MainSection; label: string; icon: React.ElementType; badge?: number }[];
  }[] = [
    {
      items: [
        { id: "dashboard", label: "Dashboard",  icon: LayoutDashboard },
        { id: "orders",    label: "Orders",     icon: ShoppingCart, badge: orders.filter(o => o.status === "pending").length },
      ],
    },
    {
      header: "CATALOG",
      items: [
        { id: "catalog", label: "Products",  icon: ImageIcon, badge: dbProducts.length },
      ],
    },
    {
      header: "CONTENT",
      items: [
        { id: "homepage",   label: "Homepage",  icon: Home },
        { id: "hot-deals",  label: "Hot Deals", icon: Tag },
      ],
    },
    {
      header: "SHOP PAGES",
      items: [
        { id: "heels",             label: "Heels",           icon: Layers },
        { id: "clips-page",        label: "Clip-ons",        icon: Sparkles },
        { id: "bow-page",          label: "Bow Collection",  icon: Star },
        { id: "collections-page",  label: "Collections",     icon: Grid3x3 },
        { id: "style-ideas-page",  label: "Style Ideas",     icon: Camera },
      ],
    },
    {
      header: "INFO PAGES",
      items: [
        { id: "about-us",    label: "About Us",    icon: Users },
        { id: "contact-us",  label: "Contact Us",  icon: MessageSquare },
      ],
    },
    {
      header: "POLICIES",
      items: [
        { id: "shipping-policy", label: "Shipping",         icon: Truck },
        { id: "size-guide",      label: "Size Guide",       icon: Ruler },
        { id: "returns",         label: "Returns",          icon: RefreshCw },
      ],
    },
    {
      header: "SYSTEM",
      items: [
        { id: "settings",          label: "Settings",  icon: Settings },
        { id: "footer",            label: "Footer",    icon: Layout },
        { id: "advanced-settings", label: "Advanced",  icon: Palette },
        { id: "messages",          label: "Messages",  icon: MessageSquare, badge: messages.length },
      ],
    },
  ];

  // ── Main layout ───────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ══════════════════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════════════════ */}
      <aside
        className="w-56 flex-shrink-0 flex flex-col"
        style={{ background: "#3B5373" }}
      >
        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/10">
          <p className="text-white font-bold text-lg tracking-wide">✦ CLASSIE</p>
          <p className="text-white/40 text-xs mt-0.5">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2.5 overflow-y-auto">
          {SIDEBAR_GROUPS.map((group, gi) => {
            const getFirstTab = (id: MainSection): TabId => {
              if (id === "dashboard") return "dashboard";
              if (id === "orders") return "orders";
              if (id === "settings") return "settings";
              if (id === "footer") return "footer";
              if (id === "messages") return "messages";
              if (id === "clips-page") return "clips-page";
              if (id === "bow-page") return "bow-page";
              if (id === "collections-page") return "collections-page";
              if (id === "style-ideas-page") return "style-ideas-page";
              if (id === "hot-deals") return "hd-page";
              if (id === "about-us") return "au-hero";
              if (id === "contact-us") return "ct-hero";
              if (id === "shipping-policy") return "sp-hero";
              if (id === "size-guide") return "sg-hero";
              if (id === "returns") return "re-hero";
              return (SECTION_SUBTABS[id as keyof typeof SECTION_SUBTABS][0]?.id ?? "dashboard");
            };
            return (
              <div key={gi} className={gi > 0 ? "mt-1" : ""}>
                {group.header && (
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/35 px-3 pt-4 pb-1.5">
                    {group.header}
                  </p>
                )}
                <div className="space-y-0.5">
                  {group.items.map(({ id, label, icon: Icon, badge }) => {
                    const active = mainSection === id;
                    return (
                      <button
                        key={id}
                        onClick={() => setTab(getFirstTab(id))}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                          active
                            ? "bg-white/15 text-white"
                            : "text-white/60 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {active && <span className="absolute left-0 w-0.5 h-5 bg-white rounded-r-full" style={{marginLeft: "0px"}} />}
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="flex-1 text-[13px]">{label}</span>
                        {badge !== undefined && badge > 0 && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${active ? "bg-white text-[#3B5373]" : "bg-white/20 text-white/70"}`}>
                            {badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={() => setAuthed(false)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════ */}
      <main className="flex-1 overflow-auto">
        {/* Top header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="font-semibold text-gray-800 capitalize">
              {mainSection === "dashboard" ? "Dashboard" :
               mainSection === "homepage" ? "Homepage" :
               mainSection === "catalog" ? "Catalog" :
               mainSection === "heels" ? "Heels Page" :
               mainSection === "clips-page" ? "Clips Page" :
               mainSection === "bow-page" ? "Bow Page" :
               mainSection === "collections-page" ? "Collections Page" :
               mainSection === "style-ideas-page" ? "Style Ideas Page" :
               mainSection === "advanced-settings" ? "Advanced Settings" :
               mainSection === "hot-deals" ? "Hot Deals" :
               mainSection === "about-us" ? "About Us" :
               mainSection === "contact-us" ? "Contact Us" :
               mainSection === "shipping-policy" ? "Shipping Policy" :
               mainSection === "size-guide" ? "Size Guide" :
               mainSection === "returns" ? "Returns & Exchanges" :
               mainSection === "orders" ? "Orders" :
               mainSection === "settings" ? "Settings" :
               mainSection === "footer" ? "Footer" : "Messages"}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">Classie Admin Panel</p>
          </div>
          <div className="flex items-center gap-3">
            {tab === "orders" && (
              <button
                onClick={fetchOrders} disabled={ordersLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-[#3B5373] border border-gray-200 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${ordersLoading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            )}
          </div>
        </div>

        {/* Sub-tab navigation */}
        {SECTION_SUBTABS[mainSection].length > 0 && (
          <div className="bg-white border-b border-gray-100 px-8 flex gap-0">
            {SECTION_SUBTABS[mainSection].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`px-5 py-3 text-xs font-medium tracking-widest uppercase transition-colors border-b-2 -mb-px ${
                  tab === id
                    ? "border-[#3B5373] text-[#3B5373]"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        <div className="p-8">

          {/* ══════════════════════════════════════
              DASHBOARD TAB
          ══════════════════════════════════════ */}
          {tab === "dashboard" && (
            <div className="space-y-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  {
                    label: "Total Revenue",
                    value: `₹${totalRevenue.toLocaleString("en-IN")}`,
                    icon: IndianRupee,
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                    sub: "Excl. cancelled orders",
                  },
                  {
                    label: "Total Orders",
                    value: orders.length.toString(),
                    icon: ShoppingCart,
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                    sub: "All time",
                  },
                  {
                    label: "Total Products",
                    value: dbProducts.length.toString(),
                    icon: Package,
                    color: "text-purple-600",
                    bg: "bg-purple-50",
                    sub: `${dbProducts.filter(p => p.active).length} active`,
                  },
                  {
                    label: "Pending Orders",
                    value: pendingCount.toString(),
                    icon: Clock,
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                    sub: "Awaiting processing",
                  },
                ].map(({ label, value, icon: Icon, color, bg, sub }) => (
                  <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{value}</p>
                    <p className="text-sm font-medium text-gray-600 mt-0.5">{label}</p>
                    <p className="text-xs text-gray-400 mt-1">{sub}</p>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-700">Recent Orders</h2>
                  <button onClick={() => setTab("orders")} className="text-xs text-[#3B5373] hover:underline">
                    View all →
                  </button>
                </div>
                {ordersLoading ? (
                  <div className="p-8 text-center text-gray-400 text-sm">Loading…</div>
                ) : recentOrders.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">No orders yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          {["Order ID", "Customer", "Amount", "Status", "Date"].map((h) => (
                            <th key={h} className="text-left px-5 py-3 text-xs uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => {
                          const StatusIcon = STATUS_ICONS[order.status] ?? Clock;
                          return (
                            <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                              <td className="px-5 py-3.5">
                                <span className="font-mono text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{order.id.slice(0, 8)}</span>
                              </td>
                              <td className="px-5 py-3.5">
                                <p className="font-medium text-gray-700 text-xs">{order.customer_name}</p>
                                <p className="text-[11px] text-gray-400">{order.city}</p>
                              </td>
                              <td className="px-5 py-3.5">
                                <p className="font-semibold text-gray-800 text-xs">₹{order.total_amount.toLocaleString("en-IN")}</p>
                              </td>
                              <td className="px-5 py-3.5">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                                  <StatusIcon className="w-3 h-3" />{order.status}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-xs text-gray-400">
                                {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-700">Featured Products</h2>
                  <button onClick={() => setTab("products")} className="text-xs text-[#3B5373] hover:underline">
                    Manage →
                  </button>
                </div>
                {featuredProducts.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">No featured products yet.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          {["Product", "Category", "Price"].map((h) => (
                            <th key={h} className="text-left px-5 py-3 text-xs uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {featuredProducts.map((p) => (
                          <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-3">
                                {p.image && (
                                  <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                    <Image src={p.image} alt={p.title} fill className="object-cover" sizes="32px" />
                                  </div>
                                )}
                                <p className="font-medium text-gray-700 text-xs">{p.title}</p>
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="text-xs text-gray-400 capitalize">{p.category}</span>
                            </td>
                            <td className="px-5 py-3.5">
                              <p className="text-xs font-semibold text-gray-700">₹{p.price.toLocaleString("en-IN")}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              ORDERS TAB
          ══════════════════════════════════════ */}
          {tab === "orders" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {ordersLoading ? (
                <div className="p-12 text-center text-gray-400 text-sm">Loading orders…</div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center">
                  <ShoppingCart className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No orders yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        {["Order","Customer","Items","Amount","Status","Date"].map((h) => (
                          <th key={h} className="text-left px-5 py-3.5 text-xs uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => {
                        const StatusIcon = STATUS_ICONS[order.status] ?? Clock;
                        return (
                          <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-4">
                              <span className="font-mono text-[11px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{order.id.slice(0, 8)}…</span>
                            </td>
                            <td className="px-5 py-4">
                              <p className="font-medium text-gray-700">{order.customer_name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{order.customer_phone}</p>
                              <p className="text-xs text-gray-400">{order.city}, {order.state}</p>
                            </td>
                            <td className="px-5 py-4">
                              <div className="space-y-1 max-w-[200px]">
                                {order.items.slice(0, 2).map((item, i) => (
                                  <p key={i} className="text-xs text-gray-400 truncate">
                                    {item.quantity}× {item.title}{item.variant ? ` (${item.variant})` : ""}
                                  </p>
                                ))}
                                {order.items.length > 2 && <p className="text-xs text-[#3B5373]">+{order.items.length - 2} more</p>}
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <p className="font-semibold text-gray-800">₹{order.total_amount.toLocaleString("en-IN")}</p>
                              <p className="text-[10px] uppercase text-gray-400 mt-0.5">{order.payment_method}</p>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1.5 mb-2">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                                  <StatusIcon className="w-3 h-3" />{order.status}
                                </span>
                              </div>
                              <select
                                value={order.status}
                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                disabled={updatingId === order.id}
                                className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-[#3B5373] bg-white disabled:opacity-50"
                              >
                                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </td>
                            <td className="px-5 py-4">
                              <p className="text-xs text-gray-400">
                                {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(order.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════
              PRODUCTS TAB
          ══════════════════════════════════════ */}
          {tab === "products" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-sm text-gray-500">{dbProducts.filter(p => (productCategoryFilter === "all" || p.category === productCategoryFilter) && (productSearch === "" || p.title.toLowerCase().includes(productSearch.toLowerCase()))).length} products</p>
                  <select value={productCategoryFilter} onChange={e => setProductCategoryFilter(e.target.value)} className="border border-gray-200 text-xs px-3 py-1.5 text-gray-600 focus:outline-none focus:border-[#3B5373]">
                    <option value="all">All Categories</option>
                    <option value="heels">Heels</option>
                    <option value="accessories">Accessories</option>
                    <option value="clips">Clips</option>
                    <option value="bow">Bow</option>
                  </select>
                  <input value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Search products..." className="border border-gray-200 text-xs px-3 py-1.5 text-gray-600 focus:outline-none focus:border-[#3B5373] w-44" />
                </div>
                <button onClick={openAddProduct} className="flex items-center gap-2 px-4 py-2 bg-[#3B5373] text-white text-sm font-medium hover:bg-[#2d3f4f] transition-colors shadow-sm">
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {productsLoading ? (
                  <div className="p-12 text-center text-gray-400 text-sm">Loading products…</div>
                ) : dbProducts.length === 0 ? (
                  <div className="p-12 text-center">
                    <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No products yet. Add your first product.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          {["Product","Category","Price","Variants","Status","Actions"].map((h) => (
                            <th key={h} className="text-left px-5 py-3.5 text-xs uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dbProducts.filter(p => (productCategoryFilter === "all" || p.category === productCategoryFilter) && (productSearch === "" || p.title.toLowerCase().includes(productSearch.toLowerCase()))).map((p) => (
                          <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                {p.image && (
                                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                    <Image src={p.image} alt={p.title} fill className="object-cover" sizes="40px" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-gray-700 text-xs leading-snug">{p.title}</p>
                                  <p className="text-[10px] text-gray-400 font-mono">{p.slug}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full capitalize">{p.category}</span>
                            </td>
                            <td className="px-5 py-4">
                              <p className="font-semibold text-gray-700 text-xs">₹{p.price.toLocaleString("en-IN")}</p>
                              <p className="text-[10px] text-gray-400 line-through">₹{p.compare_price.toLocaleString("en-IN")}</p>
                            </td>
                            <td className="px-5 py-4 text-xs text-gray-400">
                              {p.variant_type !== "none" ? `${p.variant_type}: ${p.variants?.join(", ")}` : "—"}
                            </td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${p.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                                {p.active ? "Active" : "Inactive"}
                              </span>
                              {p.is_featured && <span className="ml-1 text-[10px] text-amber-500 font-medium">★ Featured</span>}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1.5">
                                <button onClick={() => toggleProductActive(p)} title={p.active ? "Deactivate" : "Activate"}
                                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#3B5373] transition-colors">
                                  {p.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                                <button onClick={() => openEditProduct(p)} title="Edit"
                                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#3B5373] transition-colors">
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => setDeleteConfirm(p.id!)} title="Delete"
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              HERO SLIDES TAB
          ══════════════════════════════════════ */}
          {tab === "slides" && (
            <div className="space-y-6">

              {/* ── Hero Text Content ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4 text-[#3B5373]" />
                  <h2 className="font-semibold text-gray-700">Hero Text Content</h2>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Eyebrow Text</label>
                      <input type="text" value={siteSettings.hero_eyebrow} className={inputCls}
                        onChange={(e) => setSiteSettings((s) => ({ ...s, hero_eyebrow: e.target.value }))}
                        placeholder="e.g. New Collection" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className={labelCls}>Heading Line 1</label>
                        <input type="text" value={siteSettings.hero_heading_line1} className={inputCls}
                          onChange={(e) => setSiteSettings((s) => ({ ...s, hero_heading_line1: e.target.value }))}
                          placeholder="One Heel." />
                      </div>
                      <div>
                        <label className={labelCls}>Italic (navy)</label>
                        <input type="text" value={siteSettings.hero_heading_italic} className={inputCls}
                          onChange={(e) => setSiteSettings((s) => ({ ...s, hero_heading_italic: e.target.value }))}
                          placeholder="Endless" />
                      </div>
                      <div>
                        <label className={labelCls}>Heading Line 3</label>
                        <input type="text" value={siteSettings.hero_heading_line3} className={inputCls}
                          onChange={(e) => setSiteSettings((s) => ({ ...s, hero_heading_line3: e.target.value }))}
                          placeholder="Looks." />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Subtitle</label>
                      <textarea rows={2} value={siteSettings.hero_subtitle} className={`${inputCls} resize-none`}
                        onChange={(e) => setSiteSettings((s) => ({ ...s, hero_subtitle: e.target.value }))}
                        placeholder="Switch the clip-ons. Transform the story…" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Button 1 Text</label>
                        <input type="text" value={siteSettings.hero_cta1_text} className={inputCls}
                          onChange={(e) => setSiteSettings((s) => ({ ...s, hero_cta1_text: e.target.value }))}
                          placeholder="Shop Collection" />
                      </div>
                      <div>
                        <label className={labelCls}>Button 1 URL</label>
                        <input type="text" value={siteSettings.hero_cta1_url} className={inputCls}
                          onChange={(e) => setSiteSettings((s) => ({ ...s, hero_cta1_url: e.target.value }))}
                          placeholder="/shop/heels" />
                      </div>
                      <div>
                        <label className={labelCls}>Button 2 Text <span className="normal-case text-gray-400 font-normal">(leave empty to hide)</span></label>
                        <input type="text" value={siteSettings.hero_cta2_text} className={inputCls}
                          onChange={(e) => setSiteSettings((s) => ({ ...s, hero_cta2_text: e.target.value }))}
                          placeholder="View Lookbook" />
                      </div>
                      <div>
                        <label className={labelCls}>Button 2 URL</label>
                        <input type="text" value={siteSettings.hero_cta2_url} className={inputCls}
                          onChange={(e) => setSiteSettings((s) => ({ ...s, hero_cta2_url: e.target.value }))}
                          placeholder="/collections" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelCls}>Promo Code <span className="normal-case text-gray-400 font-normal">(empty = hide chip)</span></label>
                        <input type="text" value={siteSettings.hero_chip_code} className={inputCls}
                          onChange={(e) => setSiteSettings((s) => ({ ...s, hero_chip_code: e.target.value }))}
                          placeholder="FIRST10" />
                      </div>
                      <div>
                        <label className={labelCls}>Chip Text</label>
                        <input type="text" value={siteSettings.hero_chip_text} className={inputCls}
                          onChange={(e) => setSiteSettings((s) => ({ ...s, hero_chip_text: e.target.value }))}
                          placeholder="10% off · First order" />
                      </div>
                    </div>
                    {/* Badge + Pill */}
                    <div className="border border-gray-100 rounded-xl p-4 space-y-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Image Overlays</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Badge Text <span className="normal-case text-gray-400 font-normal">(bottom-left, e.g. SS25)</span></label>
                          <input type="text" value={siteSettings.hero_badge_text} className={inputCls}
                            onChange={(e) => setSiteSettings((s) => ({ ...s, hero_badge_text: e.target.value }))}
                            placeholder="SS25" />
                        </div>
                        <div>
                          <label className={labelCls}>Badge Sub <span className="normal-case text-gray-400 font-normal">(e.g. New In)</span></label>
                          <input type="text" value={siteSettings.hero_badge_sub} className={inputCls}
                            onChange={(e) => setSiteSettings((s) => ({ ...s, hero_badge_sub: e.target.value }))}
                            placeholder="New In" />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={siteSettings.hero_badge_active === "true"}
                          onChange={(e) => setSiteSettings((s) => ({ ...s, hero_badge_active: e.target.checked ? "true" : "false" }))}
                          className="w-4 h-4 accent-[#3B5373]" />
                        <span className="text-xs text-gray-600">Show Badge</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>Pill Text <span className="normal-case text-gray-400 font-normal">(top-right, e.g. 247 sold today)</span></label>
                          <input type="text" value={siteSettings.hero_pill_text} className={inputCls}
                            onChange={(e) => setSiteSettings((s) => ({ ...s, hero_pill_text: e.target.value }))}
                            placeholder="247 sold today" />
                        </div>
                        <div>
                          <label className={labelCls}>Pill Sub</label>
                          <input type="text" value={siteSettings.hero_pill_sub} className={inputCls}
                            onChange={(e) => setSiteSettings((s) => ({ ...s, hero_pill_sub: e.target.value }))}
                            placeholder="Limited stock" />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={siteSettings.hero_pill_active === "true"}
                          onChange={(e) => setSiteSettings((s) => ({ ...s, hero_pill_active: e.target.checked ? "true" : "false" }))}
                          className="w-4 h-4 accent-[#3B5373]" />
                        <span className="text-xs text-gray-600">Show Pill</span>
                      </label>
                    </div>

                    <div>
                      <label className={labelCls}>Stats (optional — leave empty to hide)</label>
                      <div className="grid grid-cols-3 gap-2">
                        {([1, 2, 3] as const).map((n) => (
                          <div key={n} className="space-y-1.5">
                            <input type="text"
                              value={(siteSettings as unknown as Record<string, string>)[`hero_stat${n}_number`]}
                              className={inputCls} placeholder={`e.g. 5K+`}
                              onChange={(e) => setSiteSettings((s) => ({ ...s, [`hero_stat${n}_number`]: e.target.value }))} />
                            <input type="text"
                              value={(siteSettings as unknown as Record<string, string>)[`hero_stat${n}_label`]}
                              className={inputCls} placeholder={`Label`}
                              onChange={(e) => setSiteSettings((s) => ({ ...s, [`hero_stat${n}_label`]: e.target.value }))} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <button onClick={saveHero} disabled={settingsSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#3B5373] text-white rounded-xl text-sm font-medium hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                  <Save className="w-4 h-4" />
                  {settingsSaving ? "Saving…" : "Save Hero Text"}
                </button>
              </div>

              {/* ── Hero Slides (images/videos) ── */}
              <div className="space-y-4">
              {/* Page filter buttons */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex flex-wrap gap-2">
                  {["all","home","heels","clips","bow","style-ideas","hot-deals","about"].map((p) => {
                    const labels: Record<string,string> = {all:"All",home:"🏠 Home",heels:"👠 Heels",clips:"💎 Clips",bow:"🎀 Bow","style-ideas":"✨ Style Ideas","hot-deals":"🔥 Hot Deals",about:"ℹ️ About"};
                    const count = p === "all" ? slides.length : slides.filter(s => (s.page ?? "home") === p).length;
                    return (
                      <button key={p} onClick={() => setSlidePageFilter(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${slidePageFilter === p ? "bg-[#3B5373] text-white border-[#3B5373]" : "bg-white text-gray-500 border-gray-200 hover:border-[#3B5373] hover:text-[#3B5373]"}`}>
                        {labels[p]} {count > 0 && <span className={`ml-1 ${slidePageFilter===p?"text-white/70":"text-gray-400"}`}>({count})</span>}
                      </button>
                    );
                  })}
                </div>
                <button onClick={openAddSlide} className="flex items-center gap-2 px-4 py-2 bg-[#3B5373] text-white rounded-xl text-sm font-medium hover:bg-[#2d3f4f] transition-colors shadow-sm">
                  <Plus className="w-4 h-4" /> Add Slide
                </button>
              </div>
              <p className="text-xs text-gray-400">{slidePageFilter === "all" ? slides.length : slides.filter(s=>(s.page??"home")===slidePageFilter).length} slides {slidePageFilter !== "all" ? `for "${slidePageFilter}"` : "total"}</p>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {slidesLoading ? (
                  <div className="p-12 text-center text-gray-400 text-sm">Loading slides…</div>
                ) : slides.length === 0 ? (
                  <div className="p-12 text-center">
                    <LayoutTemplate className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No hero slides yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          {["#","Preview","Headline","Page","CTA","Align","Status","Actions"].map((h) => (
                            <th key={h} className="text-left px-5 py-3.5 text-xs uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {slides.filter(s => slidePageFilter === "all" || (s.page ?? "home") === slidePageFilter).map((s) => (
                          <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-4">
                              <span className="text-xs font-mono text-gray-400">{s.display_order}</span>
                            </td>
                            <td className="px-5 py-4">
                              {s.image_url ? (
                                <div className="relative w-12 h-8 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={s.image_url} alt="" className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="w-12 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: s.bg_color }} />
                              )}
                            </td>
                            <td className="px-5 py-4">
                              <p className="font-medium text-gray-700 text-xs whitespace-pre-line">{s.headline || "—"}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[140px]">{s.subheadline}</p>
                            </td>
                            <td className="px-5 py-4">
                              <span className="inline-block px-2 py-1 bg-[#3B5373]/10 text-[#3B5373] text-[11px] rounded-full font-medium capitalize">{s.page ?? "home"}</span>
                            </td>
                            <td className="px-5 py-4">
                              <p className="text-xs text-gray-700">{s.cta_text || "—"}</p>
                              <p className="text-[10px] text-gray-400 truncate max-w-[100px]">{s.cta_url}</p>
                            </td>
                            <td className="px-5 py-4 text-xs text-gray-400 capitalize">{s.text_align}</td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${s.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                                {s.active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1.5">
                                <button onClick={() => toggleSlideActive(s)} title={s.active ? "Deactivate" : "Activate"}
                                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#3B5373] transition-colors">
                                  {s.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                </button>
                                <button onClick={() => openEditSlide(s)} title="Edit"
                                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#3B5373] transition-colors">
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => setDeleteSlideConfirm(s.id!)} title="Delete"
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>{/* closes bg-white table card */}
              </div>{/* closes inner space-y-4 slides wrapper */}
            </div>
          )}

          {/* ══════════════════════════════════════
              COLLECTIONS TAB
          ══════════════════════════════════════ */}

          {/* ── PRODUCT PAGE SETTINGS TAB ── */}
          {tab === "product-page" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">Feature Tiles</h3>
                    <p className="text-xs text-gray-400 mt-0.5">4 tiles shown on product page below the fold (icon + title + description)</p>
                  </div>
                  <button
                    onClick={saveFeatureTiles}
                    disabled={featureTilesSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-[#3B5373] text-white rounded-xl text-xs font-medium hover:bg-[#2d3f4f] transition-colors disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {featureTilesSaving ? "Saving…" : "Save Tiles"}
                  </button>
                </div>
                <div className="space-y-4">
                  {featureTiles.map((tile, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Tile {i + 1}</p>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className={labelCls}>Icon / Emoji</label>
                          <input
                            type="text"
                            value={tile.icon}
                            onChange={(e) => setFeatureTiles((prev) => prev.map((t, j) => j === i ? { ...t, icon: e.target.value } : t))}
                            className={inputCls}
                            placeholder="e.g. 🤍"
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Title</label>
                          <input
                            type="text"
                            value={tile.title}
                            onChange={(e) => setFeatureTiles((prev) => prev.map((t, j) => j === i ? { ...t, title: e.target.value } : t))}
                            className={inputCls}
                            placeholder="e.g. Made with Care"
                          />
                        </div>
                        <div>
                          <label className={labelCls}>Description</label>
                          <input
                            type="text"
                            value={tile.desc}
                            onChange={(e) => setFeatureTiles((prev) => prev.map((t, j) => j === i ? { ...t, desc: e.target.value } : t))}
                            className={inputCls}
                            placeholder="Short description…"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── HEELS PAGE TAB ───────────────────────────────── */}
          {tab === "heels-page" && (
            <div className="space-y-8">
              {heelsPageLoading ? <div className="p-12 text-center text-gray-400 text-sm">Loading…</div> : (
                <>
                  {/* ── Hero Settings ─────────────────────────────────── */}
                  <div>
                    <div className="mb-4">
                      <h2 className="text-base font-semibold text-gray-800">Hero Section</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Background image / video aur text position set karo. Save karte hi live ho jaata hai.</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
                      {/* Background type */}
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Background Type</label>
                        <div className="flex gap-2 flex-wrap">
                          {(["none","image","video","slider"] as const).map(t => (
                            <button key={t} onClick={()=>setHeelsHeroBgType(t)}
                              className={`px-4 py-1.5 text-xs font-medium border rounded-full transition-colors capitalize ${heelsHeroBgType===t?"bg-[#3B5373] text-white border-[#3B5373]":"border-gray-200 text-gray-500 hover:border-[#3B5373]"}`}>
                              {t === "none" ? "Plain Color" : t === "slider" ? "Image Slider" : t === "image" ? "Single Image" : "Video"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* URL input for image/video */}
                      {(heelsHeroBgType === "image" || heelsHeroBgType === "video") && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
                            {heelsHeroBgType === "image" ? "Image URL" : "Video URL (mp4 or YouTube)"}
                          </label>
                          <input type="text" value={heelsHeroBgUrl} onChange={e=>setHeelsHeroBgUrl(e.target.value)}
                            placeholder={heelsHeroBgType==="image" ? "https://cdn.shopify.com/..." : "https://...mp4 or YouTube URL"}
                            className="w-full border border-gray-200 text-sm px-3 py-2.5 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                          {heelsHeroBgUrl && heelsHeroBgType==="image" && (
                            <img src={heelsHeroBgUrl} alt="preview" className="mt-2 h-24 w-full object-cover rounded-lg object-top" onError={e=>{(e.target as HTMLImageElement).style.display="none"}}/>
                          )}
                        </div>
                      )}

                      {/* Slider URLs */}
                      {heelsHeroBgType === "slider" && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Slider Images (one per line)</label>
                          <textarea rows={4} value={heelsHeroSlides.join("\n")} onChange={e=>setHeelsHeroSlides(e.target.value.split("\n").map(x=>x.trim()).filter(Boolean))}
                            placeholder={"https://image1.jpg\nhttps://image2.jpg\nhttps://image3.jpg"}
                            className="w-full border border-gray-200 text-sm px-3 py-2.5 focus:outline-none focus:border-[#3B5373] rounded-lg font-mono"/>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {heelsHeroSlides.filter(Boolean).map((url,i)=>(
                              <img key={i} src={url} alt="" className="h-14 w-14 object-cover rounded object-top" onError={e=>{(e.target as HTMLImageElement).style.display="none"}}/>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Text content */}
                      <div className="space-y-3">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block">Hero Text</label>
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1">Eyebrow (small top text)</p>
                          <input type="text" value={heelsHeroEyebrow} onChange={e=>setHeelsHeroEyebrow(e.target.value)}
                            placeholder="New Collection · SS25"
                            className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1">Main Title (big heading)</p>
                          <input type="text" value={heelsHeroTitle} onChange={e=>setHeelsHeroTitle(e.target.value)}
                            placeholder="Heels"
                            className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1">Subtitle (italic line below)</p>
                          <input type="text" value={heelsHeroSubtitle} onChange={e=>setHeelsHeroSubtitle(e.target.value)}
                            placeholder="Step into your story"
                            className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        </div>
                      </div>

                      {/* Text position */}
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Text Position</label>
                        <div className="flex gap-2">
                          {(["left","center","right"] as const).map(pos => (
                            <button key={pos} onClick={()=>setHeelsHeroTextPos(pos)}
                              className={`px-4 py-1.5 text-xs font-medium border rounded-full transition-colors capitalize ${heelsHeroTextPos===pos?"bg-[#3B5373] text-white border-[#3B5373]":"border-gray-200 text-gray-500 hover:border-[#3B5373]"}`}>
                              {pos === "left" ? "⬅ Left" : pos === "right" ? "Right ➡" : "⬛ Center"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Stats section */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Stats Bar (12 STYLES | 4 HEEL TYPES | Free)</label>
                          <button onClick={()=>setHeelsHeroShowStats(v=>!v)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${heelsHeroShowStats?"bg-[#3B5373]":"bg-gray-200"}`}>
                            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${heelsHeroShowStats?"translate-x-6":"translate-x-1"}`}/>
                          </button>
                        </div>
                        {heelsHeroShowStats && (
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { val: heelsHeroStat1Val, setVal: setHeelsHeroStat1Val, label: heelsHeroStat1Label, setLabel: setHeelsHeroStat1Label, placeholder: "Auto (product count)", lph: "Styles" },
                              { val: heelsHeroStat2Val, setVal: setHeelsHeroStat2Val, label: heelsHeroStat2Label, setLabel: setHeelsHeroStat2Label, placeholder: "Auto (heel types)", lph: "Heel Types" },
                              { val: heelsHeroStat3Val, setVal: setHeelsHeroStat3Val, label: heelsHeroStat3Label, setLabel: setHeelsHeroStat3Label, placeholder: "Free", lph: "Shipping ₹999+" },
                            ].map((s, i) => (
                              <div key={i} className="border border-gray-100 rounded-lg p-3 space-y-2">
                                <p className="text-[10px] text-gray-400 font-medium">Stat {i+1}</p>
                                <input type="text" value={s.val} onChange={e=>s.setVal(e.target.value)}
                                  placeholder={s.placeholder}
                                  className="w-full border border-gray-200 text-xs px-2 py-1.5 focus:outline-none focus:border-[#3B5373] rounded"/>
                                <input type="text" value={s.label} onChange={e=>s.setLabel(e.target.value)}
                                  placeholder={s.lph}
                                  className="w-full border border-gray-200 text-xs px-2 py-1.5 focus:outline-none focus:border-[#3B5373] rounded"/>
                                <p className="text-[9px] text-gray-300">{i<2?"Value blank = auto count":""}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button onClick={saveHeelsHero} disabled={heelsHeroSaving}
                        className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                        <Save className="w-4 h-4"/>
                        {heelsHeroSaving ? "Saving…" : "Save Hero Settings"}
                      </button>
                    </div>
                  </div>

                  {/* ── Why Choose Section ──────────────────────────── */}
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-base font-semibold text-gray-800">"Why Choose" Section</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Page ke neeche 3 cards wala section — toggle ON/OFF ya edit karo</p>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{whyVisible ? "Visible" : "Hidden"}</span>
                        <button onClick={()=>setWhyVisible(v=>!v)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${whyVisible?"bg-[#3B5373]":"bg-gray-200"}`}>
                          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${whyVisible?"translate-x-6":"translate-x-1"}`}/>
                        </button>
                      </div>
                    </div>
                    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5 ${!whyVisible?"opacity-50 pointer-events-none":""}`}>
                      {/* Heading */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1">Heading (normal text)</p>
                          <input type="text" value={whyHeading} onChange={e=>setWhyHeading(e.target.value)}
                            className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1">Heading (italic/colored part)</p>
                          <input type="text" value={whyHeadingItalic} onChange={e=>setWhyHeadingItalic(e.target.value)}
                            className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        </div>
                      </div>

                      {/* 3 Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { icon: whyCard1Icon, setIcon: setWhyCard1Icon, title: whyCard1Title, setTitle: setWhyCard1Title, desc: whyCard1Desc, setDesc: setWhyCard1Desc, n: 1 },
                          { icon: whyCard2Icon, setIcon: setWhyCard2Icon, title: whyCard2Title, setTitle: setWhyCard2Title, desc: whyCard2Desc, setDesc: setWhyCard2Desc, n: 2 },
                          { icon: whyCard3Icon, setIcon: setWhyCard3Icon, title: whyCard3Title, setTitle: setWhyCard3Title, desc: whyCard3Desc, setDesc: setWhyCard3Desc, n: 3 },
                        ].map(c => (
                          <div key={c.n} className="border border-gray-100 rounded-xl p-4 space-y-2.5">
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Card {c.n}</p>
                            <div className="flex gap-2">
                              <input type="text" value={c.icon} onChange={e=>c.setIcon(e.target.value)}
                                placeholder="emoji" className="w-16 border border-gray-200 text-lg px-2 py-1.5 text-center focus:outline-none focus:border-[#3B5373] rounded"/>
                              <input type="text" value={c.title} onChange={e=>c.setTitle(e.target.value)}
                                placeholder="Card Title" className="flex-1 border border-gray-200 text-xs px-2 py-1.5 focus:outline-none focus:border-[#3B5373] rounded"/>
                            </div>
                            <textarea rows={2} value={c.desc} onChange={e=>c.setDesc(e.target.value)}
                              placeholder="Card description..."
                              className="w-full border border-gray-200 text-xs px-2 py-1.5 focus:outline-none focus:border-[#3B5373] rounded resize-none"/>
                          </div>
                        ))}
                      </div>

                      {/* Footer text */}
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1">Footer text (below cards)</p>
                        <textarea rows={2} value={whyFooterText} onChange={e=>setWhyFooterText(e.target.value)}
                          className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg resize-none"/>
                      </div>

                      <button onClick={saveWhySection} disabled={whySaving}
                        className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                        <Save className="w-4 h-4"/>
                        {whySaving ? "Saving…" : "Save Why Choose Section"}
                      </button>
                    </div>
                  </div>

                  {/* Products table */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-base font-semibold text-gray-800">Heels on Page</h2>
                        <p className="text-xs text-gray-400 mt-0.5">{heelsPageProducts.filter(p=>p.active).length} showing · {heelsPageProducts.filter(p=>!p.active).length} hidden · Toggle to show/hide on live site</p>
                      </div>
                      <a href="/shop/heels" target="_blank" className="text-xs text-[#3B5373] border border-[#3B5373] px-3 py-1.5 hover:bg-[#3B5373] hover:text-white transition-colors">
                        View Live Page →
                      </a>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50">
                            <th className="px-4 py-3 text-left text-[10px] tracking-widest uppercase text-gray-400 font-medium">Product</th>
                            <th className="px-4 py-3 text-left text-[10px] tracking-widest uppercase text-gray-400 font-medium hidden md:table-cell">Heel Type</th>
                            <th className="px-4 py-3 text-left text-[10px] tracking-widest uppercase text-gray-400 font-medium hidden md:table-cell">Tags</th>
                            <th className="px-4 py-3 text-left text-[10px] tracking-widest uppercase text-gray-400 font-medium">Price</th>
                            <th className="px-4 py-3 text-center text-[10px] tracking-widest uppercase text-gray-400 font-medium w-28">Show on Page</th>
                          </tr>
                        </thead>
                        <tbody>
                          {heelsPageProducts.map((p, i) => (
                            <tr key={p.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i%2===0?"":"bg-gray-50/30"}`}>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  {p.image && <img src={p.image} alt={p.title} className="w-11 h-11 object-cover object-top rounded flex-shrink-0" />}
                                  <div>
                                    <p className="font-medium text-gray-800 text-sm">{p.title}</p>
                                    {p.featured_tab && <span className={`text-[9px] tracking-wider uppercase px-1.5 py-0.5 rounded mt-0.5 inline-block ${p.featured_tab==="latest"?"bg-[#e8f0fe] text-blue-600":p.featured_tab==="bestseller"?"bg-[#fef3c7] text-yellow-700":"bg-[#fee2e2] text-red-600"}`}>{p.featured_tab}</span>}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">{p.heel_type ?? <span className="text-gray-300">—</span>}</td>
                              <td className="px-4 py-3 hidden md:table-cell">
                                <div className="flex flex-wrap gap-1">
                                  {(p.tags??[]).map((t:string)=><span key={t} className="text-[9px] tracking-wider uppercase bg-[#f0ecff] text-[#3B5373] px-1.5 py-0.5 rounded">{t}</span>)}
                                  {(!p.tags||p.tags.length===0)&&<span className="text-gray-300 text-xs">—</span>}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">₹{p.price?.toLocaleString("en-IN")}</td>
                              <td className="px-4 py-3 text-center">
                                <button onClick={async()=>{await supabase.from("products").update({active:!p.active}).eq("id",p.id);setHeelsPageProducts(prev=>prev.map(x=>x.id===p.id?{...x,active:!x.active}:x));}}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${p.active?"bg-[#3B5373]":"bg-gray-200"}`}>
                                  <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${p.active?"translate-x-6":"translate-x-1"}`}/>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {heelsPageProducts.length===0&&<div className="p-10 text-center text-gray-400 text-sm">No heels found. Add from Catalog → Products (category = heels).</div>}
                    </div>
                  </div>

                  {/* Filter types */}
                  <div>
                    <div className="mb-4">
                      <h2 className="text-base font-semibold text-gray-800">Filter Sidebar — Heel Types</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Heels page ke filter sidebar mein yeh options dikhte hain. Add/remove karo.</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                      <div className="flex flex-wrap gap-2 min-h-[36px]">
                        {heelsFilterTypes.map(ht=>(
                          <span key={ht} className="inline-flex items-center gap-1.5 bg-[#f0ecff] text-[#3B5373] text-xs font-medium px-3 py-1.5 rounded-full">
                            {ht}
                            <button onClick={async()=>{const u=heelsFilterTypes.filter(x=>x!==ht);setHeelsFilterTypes(u);await saveHeelsFilterTypes(u);}} className="text-[#3B5373]/60 hover:text-red-500 transition-colors text-sm leading-none">×</button>
                          </span>
                        ))}
                        {heelsFilterTypes.length===0&&<p className="text-xs text-gray-300">No filter types yet.</p>}
                      </div>
                      <div className="flex gap-2">
                        <input type="text" value={newFilterType} onChange={e=>setNewFilterType(e.target.value)}
                          onKeyDown={async e=>{if(e.key==="Enter"&&newFilterType.trim()){const u=[...heelsFilterTypes,newFilterType.trim()];setHeelsFilterTypes(u);setNewFilterType("");await saveHeelsFilterTypes(u);}}}
                          placeholder="e.g. Wedge Heel, Platform…" className="flex-1 border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        <button onClick={async()=>{if(!newFilterType.trim())return;const u=[...heelsFilterTypes,newFilterType.trim()];setHeelsFilterTypes(u);setNewFilterType("");await saveHeelsFilterTypes(u);}}
                          disabled={heelsFilterSaving||!newFilterType.trim()} className="px-4 py-2 bg-[#3B5373] text-white text-sm font-medium hover:bg-[#2d3f4f] rounded-lg disabled:opacity-50 transition-colors">
                          {heelsFilterSaving?"Saving…":"Add"}
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400">Enter dabao ya Add karo — live filter sidebar turant update hoti hai.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════
              CLIPS PAGE TAB
          ══════════════════════════════════════ */}
          {tab === "clips-page" && (
            <div className="space-y-8">
              {clipsPageLoading ? <div className="p-12 text-center text-gray-400 text-sm">Loading…</div> : (
                <>
                  {/* ── Hero Settings ─────────────────────────────────── */}
                  <div>
                    <div className="mb-4">
                      <h2 className="text-base font-semibold text-gray-800">Hero Section</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Clips page hero background aur text set karo.</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Background Type</label>
                        <div className="flex gap-2 flex-wrap">
                          {(["none","image","video","slider"] as const).map(t => (
                            <button key={t} onClick={()=>setClipsHeroBgType(t)}
                              className={`px-4 py-1.5 text-xs font-medium border rounded-full transition-colors capitalize ${clipsHeroBgType===t?"bg-[#3B5373] text-white border-[#3B5373]":"border-gray-200 text-gray-500 hover:border-[#3B5373]"}`}>
                              {t === "none" ? "Plain Color" : t === "slider" ? "Image Slider" : t === "image" ? "Single Image" : "Video"}
                            </button>
                          ))}
                        </div>
                      </div>
                      {(clipsHeroBgType === "image" || clipsHeroBgType === "video") && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
                            {clipsHeroBgType === "image" ? "Image URL" : "Video URL (mp4 or YouTube)"}
                          </label>
                          <input type="text" value={clipsHeroBgUrl} onChange={e=>setClipsHeroBgUrl(e.target.value)}
                            placeholder={clipsHeroBgType==="image" ? "https://cdn.shopify.com/..." : "https://...mp4 or YouTube URL"}
                            className="w-full border border-gray-200 text-sm px-3 py-2.5 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                          {clipsHeroBgUrl && clipsHeroBgType==="image" && (
                            <img src={clipsHeroBgUrl} alt="preview" className="mt-2 h-24 w-full object-cover rounded-lg object-top" onError={e=>{(e.target as HTMLImageElement).style.display="none"}}/>
                          )}
                        </div>
                      )}
                      {clipsHeroBgType === "slider" && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Slider Images (one per line)</label>
                          <textarea rows={4} value={clipsHeroSlides.join("\n")} onChange={e=>setClipsHeroSlides(e.target.value.split("\n").map(x=>x.trim()).filter(Boolean))}
                            placeholder={"https://image1.jpg\nhttps://image2.jpg"}
                            className="w-full border border-gray-200 text-sm px-3 py-2.5 focus:outline-none focus:border-[#3B5373] rounded-lg font-mono"/>
                        </div>
                      )}
                      <div className="space-y-3">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block">Hero Text</label>
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1">Eyebrow</p>
                          <input type="text" value={clipsHeroEyebrow} onChange={e=>setClipsHeroEyebrow(e.target.value)} placeholder="New Collection · SS25" className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1">Main Title</p>
                          <input type="text" value={clipsHeroTitle} onChange={e=>setClipsHeroTitle(e.target.value)} placeholder="Clip-ons" className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1">Subtitle</p>
                          <input type="text" value={clipsHeroSubtitle} onChange={e=>setClipsHeroSubtitle(e.target.value)} placeholder="Transform any look instantly" className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Text Position</label>
                        <div className="flex gap-2">
                          {(["left","center","right"] as const).map(pos => (
                            <button key={pos} onClick={()=>setClipsHeroTextPos(pos)}
                              className={`px-4 py-1.5 text-xs font-medium border rounded-full transition-colors capitalize ${clipsHeroTextPos===pos?"bg-[#3B5373] text-white border-[#3B5373]":"border-gray-200 text-gray-500 hover:border-[#3B5373]"}`}>
                              {pos === "left" ? "⬅ Left" : pos === "right" ? "Right ➡" : "⬛ Center"}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Stats Bar</label>
                          <button onClick={()=>setClipsHeroShowStats(v=>!v)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${clipsHeroShowStats?"bg-[#3B5373]":"bg-gray-200"}`}>
                            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${clipsHeroShowStats?"translate-x-6":"translate-x-1"}`}/>
                          </button>
                        </div>
                        {clipsHeroShowStats && (
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { val: clipsHeroStat1Val, setVal: setClipsHeroStat1Val, label: clipsHeroStat1Label, setLabel: setClipsHeroStat1Label, ph: "Auto (count)", lph: "Styles" },
                              { val: clipsHeroStat2Val, setVal: setClipsHeroStat2Val, label: clipsHeroStat2Label, setLabel: setClipsHeroStat2Label, ph: "Auto (types)", lph: "Filter Types" },
                              { val: clipsHeroStat3Val, setVal: setClipsHeroStat3Val, label: clipsHeroStat3Label, setLabel: setClipsHeroStat3Label, ph: "Free", lph: "Shipping ₹999+" },
                            ].map((s, i) => (
                              <div key={i} className="border border-gray-100 rounded-lg p-3 space-y-2">
                                <p className="text-[10px] text-gray-400 font-medium">Stat {i+1}</p>
                                <input type="text" value={s.val} onChange={e=>s.setVal(e.target.value)} placeholder={s.ph} className="w-full border border-gray-200 text-xs px-2 py-1.5 focus:outline-none focus:border-[#3B5373] rounded"/>
                                <input type="text" value={s.label} onChange={e=>s.setLabel(e.target.value)} placeholder={s.lph} className="w-full border border-gray-200 text-xs px-2 py-1.5 focus:outline-none focus:border-[#3B5373] rounded"/>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <button onClick={saveClipsHero} disabled={clipsHeroSaving}
                        className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                        <Save className="w-4 h-4"/>{clipsHeroSaving ? "Saving…" : "Save Hero Settings"}
                      </button>
                    </div>
                  </div>

                  {/* ── Why Choose Section ──────────────────────────── */}
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-base font-semibold text-gray-800">&ldquo;Why Choose&rdquo; Section</h2>
                        <p className="text-xs text-gray-400 mt-0.5">3 cards section — toggle ON/OFF ya edit karo</p>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{clipsWhyVisible ? "Visible" : "Hidden"}</span>
                        <button onClick={()=>setClipsWhyVisible(v=>!v)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${clipsWhyVisible?"bg-[#3B5373]":"bg-gray-200"}`}>
                          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${clipsWhyVisible?"translate-x-6":"translate-x-1"}`}/>
                        </button>
                      </div>
                    </div>
                    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5 ${!clipsWhyVisible?"opacity-50 pointer-events-none":""}`}>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1">Heading (normal)</p>
                          <input type="text" value={clipsWhyHeading} onChange={e=>setClipsWhyHeading(e.target.value)} className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1">Heading (italic/colored)</p>
                          <input type="text" value={clipsWhyHeadingItalic} onChange={e=>setClipsWhyHeadingItalic(e.target.value)} className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { icon: clipsWhyCard1Icon, setIcon: setClipsWhyCard1Icon, title: clipsWhyCard1Title, setTitle: setClipsWhyCard1Title, desc: clipsWhyCard1Desc, setDesc: setClipsWhyCard1Desc, n: 1 },
                          { icon: clipsWhyCard2Icon, setIcon: setClipsWhyCard2Icon, title: clipsWhyCard2Title, setTitle: setClipsWhyCard2Title, desc: clipsWhyCard2Desc, setDesc: setClipsWhyCard2Desc, n: 2 },
                          { icon: clipsWhyCard3Icon, setIcon: setClipsWhyCard3Icon, title: clipsWhyCard3Title, setTitle: setClipsWhyCard3Title, desc: clipsWhyCard3Desc, setDesc: setClipsWhyCard3Desc, n: 3 },
                        ].map(c => (
                          <div key={c.n} className="border border-gray-100 rounded-xl p-4 space-y-2.5">
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Card {c.n}</p>
                            <div className="flex gap-2">
                              <input type="text" value={c.icon} onChange={e=>c.setIcon(e.target.value)} placeholder="emoji" className="w-16 border border-gray-200 text-lg px-2 py-1.5 text-center focus:outline-none focus:border-[#3B5373] rounded"/>
                              <input type="text" value={c.title} onChange={e=>c.setTitle(e.target.value)} placeholder="Card Title" className="flex-1 border border-gray-200 text-xs px-2 py-1.5 focus:outline-none focus:border-[#3B5373] rounded"/>
                            </div>
                            <textarea rows={2} value={c.desc} onChange={e=>c.setDesc(e.target.value)} placeholder="Card description..." className="w-full border border-gray-200 text-xs px-2 py-1.5 focus:outline-none focus:border-[#3B5373] rounded resize-none"/>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1">Footer text (below cards)</p>
                        <textarea rows={2} value={clipsWhyFooterText} onChange={e=>setClipsWhyFooterText(e.target.value)} className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg resize-none"/>
                      </div>
                      <button onClick={saveClipsWhy} disabled={clipsWhySaving}
                        className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                        <Save className="w-4 h-4"/>{clipsWhySaving ? "Saving…" : "Save Why Choose Section"}
                      </button>
                    </div>
                  </div>

                  {/* Products table */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-base font-semibold text-gray-800">Clips on Page</h2>
                        <p className="text-xs text-gray-400 mt-0.5">{clipsPageProducts.filter(p=>p.active).length} showing · {clipsPageProducts.filter(p=>!p.active).length} hidden</p>
                      </div>
                      <a href="/shop/clips" target="_blank" className="text-xs text-[#3B5373] border border-[#3B5373] px-3 py-1.5 hover:bg-[#3B5373] hover:text-white transition-colors">
                        View Live Page →
                      </a>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50">
                            <th className="px-4 py-3 text-left text-[10px] tracking-widest uppercase text-gray-400 font-medium">Product</th>
                            <th className="px-4 py-3 text-left text-[10px] tracking-widest uppercase text-gray-400 font-medium hidden md:table-cell">Tags</th>
                            <th className="px-4 py-3 text-left text-[10px] tracking-widest uppercase text-gray-400 font-medium">Price</th>
                            <th className="px-4 py-3 text-center text-[10px] tracking-widest uppercase text-gray-400 font-medium w-28">Show on Page</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clipsPageProducts.map((p, i) => (
                            <tr key={p.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i%2===0?"":"bg-gray-50/30"}`}>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  {p.image && <img src={p.image} alt={p.title} className="w-11 h-11 object-cover object-top rounded flex-shrink-0" />}
                                  <div>
                                    <p className="font-medium text-gray-800 text-sm">{p.title}</p>
                                    {p.featured_tab && <span className={`text-[9px] tracking-wider uppercase px-1.5 py-0.5 rounded mt-0.5 inline-block ${p.featured_tab==="latest"?"bg-[#e8f0fe] text-blue-600":p.featured_tab==="bestseller"?"bg-[#fef3c7] text-yellow-700":"bg-[#fee2e2] text-red-600"}`}>{p.featured_tab}</span>}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 hidden md:table-cell">
                                <div className="flex flex-wrap gap-1">
                                  {(p.tags??[]).map((t:string)=><span key={t} className="text-[9px] tracking-wider uppercase bg-[#f0ecff] text-[#3B5373] px-1.5 py-0.5 rounded">{t}</span>)}
                                  {(!p.tags||p.tags.length===0)&&<span className="text-gray-300 text-xs">—</span>}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">₹{p.price?.toLocaleString("en-IN")}</td>
                              <td className="px-4 py-3 text-center">
                                <button onClick={async()=>{await supabase.from("products").update({active:!p.active}).eq("id",p.id);setClipsPageProducts(prev=>prev.map(x=>x.id===p.id?{...x,active:!x.active}:x));}}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${p.active?"bg-[#3B5373]":"bg-gray-200"}`}>
                                  <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${p.active?"translate-x-6":"translate-x-1"}`}/>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {clipsPageProducts.length===0&&<div className="p-10 text-center text-gray-400 text-sm">No clips found. Add from Catalog → Products (category = clips).</div>}
                    </div>
                  </div>

                  {/* Filter types */}
                  <div>
                    <div className="mb-4">
                      <h2 className="text-base font-semibold text-gray-800">Filter Sidebar — Clip Types</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Clips page ke filter sidebar mein yeh options dikhte hain.</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                      <div className="flex flex-wrap gap-2 min-h-[36px]">
                        {clipsFilterTypes.map(ft=>(
                          <span key={ft} className="inline-flex items-center gap-1.5 bg-[#f0ecff] text-[#3B5373] text-xs font-medium px-3 py-1.5 rounded-full">
                            {ft}
                            <button onClick={async()=>{const u=clipsFilterTypes.filter(x=>x!==ft);setClipsFilterTypes(u);await saveClipsFilterTypes(u);}} className="text-[#3B5373]/60 hover:text-red-500 transition-colors text-sm leading-none">×</button>
                          </span>
                        ))}
                        {clipsFilterTypes.length===0&&<p className="text-xs text-gray-300">No filter types yet.</p>}
                      </div>
                      <div className="flex gap-2">
                        <input type="text" value={newClipsFilterType} onChange={e=>setNewClipsFilterType(e.target.value)}
                          onKeyDown={async e=>{if(e.key==="Enter"&&newClipsFilterType.trim()){const u=[...clipsFilterTypes,newClipsFilterType.trim()];setClipsFilterTypes(u);setNewClipsFilterType("");await saveClipsFilterTypes(u);}}}
                          placeholder="e.g. Crystal, Floral…" className="flex-1 border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        <button onClick={async()=>{if(!newClipsFilterType.trim())return;const u=[...clipsFilterTypes,newClipsFilterType.trim()];setClipsFilterTypes(u);setNewClipsFilterType("");await saveClipsFilterTypes(u);}}
                          disabled={clipsFilterSaving||!newClipsFilterType.trim()} className="px-4 py-2 bg-[#3B5373] text-white text-sm font-medium hover:bg-[#2d3f4f] rounded-lg disabled:opacity-50 transition-colors">
                          {clipsFilterSaving?"Saving…":"Add"}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════
              BOW PAGE TAB
          ══════════════════════════════════════ */}
          {tab === "bow-page" && (
            <div className="space-y-8">
              {bowPageLoading ? <div className="p-12 text-center text-gray-400 text-sm">Loading…</div> : (
                <>
                  {/* ── Hero Settings ─────────────────────────────────── */}
                  <div>
                    <div className="mb-4">
                      <h2 className="text-base font-semibold text-gray-800">Hero Section</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Bow page hero background aur text set karo.</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Background Type</label>
                        <div className="flex gap-2 flex-wrap">
                          {(["none","image","video","slider"] as const).map(t => (
                            <button key={t} onClick={()=>setBowHeroBgType(t)}
                              className={`px-4 py-1.5 text-xs font-medium border rounded-full transition-colors capitalize ${bowHeroBgType===t?"bg-[#3B5373] text-white border-[#3B5373]":"border-gray-200 text-gray-500 hover:border-[#3B5373]"}`}>
                              {t === "none" ? "Plain Color" : t === "slider" ? "Image Slider" : t === "image" ? "Single Image" : "Video"}
                            </button>
                          ))}
                        </div>
                      </div>
                      {(bowHeroBgType === "image" || bowHeroBgType === "video") && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
                            {bowHeroBgType === "image" ? "Image URL" : "Video URL (mp4 or YouTube)"}
                          </label>
                          <input type="text" value={bowHeroBgUrl} onChange={e=>setBowHeroBgUrl(e.target.value)}
                            placeholder={bowHeroBgType==="image" ? "https://cdn.shopify.com/..." : "https://...mp4 or YouTube URL"}
                            className="w-full border border-gray-200 text-sm px-3 py-2.5 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                          {bowHeroBgUrl && bowHeroBgType==="image" && (
                            <img src={bowHeroBgUrl} alt="preview" className="mt-2 h-24 w-full object-cover rounded-lg object-top" onError={e=>{(e.target as HTMLImageElement).style.display="none"}}/>
                          )}
                        </div>
                      )}
                      {bowHeroBgType === "slider" && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Slider Images (one per line)</label>
                          <textarea rows={4} value={bowHeroSlides.join("\n")} onChange={e=>setBowHeroSlides(e.target.value.split("\n").map(x=>x.trim()).filter(Boolean))}
                            placeholder={"https://image1.jpg\nhttps://image2.jpg"}
                            className="w-full border border-gray-200 text-sm px-3 py-2.5 focus:outline-none focus:border-[#3B5373] rounded-lg font-mono"/>
                        </div>
                      )}
                      <div className="space-y-3">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block">Hero Text</label>
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1">Eyebrow</p>
                          <input type="text" value={bowHeroEyebrow} onChange={e=>setBowHeroEyebrow(e.target.value)} placeholder="New Collection · SS25" className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1">Main Title</p>
                          <input type="text" value={bowHeroTitle} onChange={e=>setBowHeroTitle(e.target.value)} placeholder="Bow Collection" className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1">Subtitle</p>
                          <input type="text" value={bowHeroSubtitle} onChange={e=>setBowHeroSubtitle(e.target.value)} placeholder="Romance in every step" className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Text Position</label>
                        <div className="flex gap-2">
                          {(["left","center","right"] as const).map(pos => (
                            <button key={pos} onClick={()=>setBowHeroTextPos(pos)}
                              className={`px-4 py-1.5 text-xs font-medium border rounded-full transition-colors capitalize ${bowHeroTextPos===pos?"bg-[#3B5373] text-white border-[#3B5373]":"border-gray-200 text-gray-500 hover:border-[#3B5373]"}`}>
                              {pos === "left" ? "⬅ Left" : pos === "right" ? "Right ➡" : "⬛ Center"}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Stats Bar</label>
                          <button onClick={()=>setBowHeroShowStats(v=>!v)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${bowHeroShowStats?"bg-[#3B5373]":"bg-gray-200"}`}>
                            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${bowHeroShowStats?"translate-x-6":"translate-x-1"}`}/>
                          </button>
                        </div>
                        {bowHeroShowStats && (
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { val: bowHeroStat1Val, setVal: setBowHeroStat1Val, label: bowHeroStat1Label, setLabel: setBowHeroStat1Label, ph: "Auto (count)", lph: "Styles" },
                              { val: bowHeroStat2Val, setVal: setBowHeroStat2Val, label: bowHeroStat2Label, setLabel: setBowHeroStat2Label, ph: "Auto (types)", lph: "Filter Types" },
                              { val: bowHeroStat3Val, setVal: setBowHeroStat3Val, label: bowHeroStat3Label, setLabel: setBowHeroStat3Label, ph: "Free", lph: "Shipping ₹999+" },
                            ].map((s, i) => (
                              <div key={i} className="border border-gray-100 rounded-lg p-3 space-y-2">
                                <p className="text-[10px] text-gray-400 font-medium">Stat {i+1}</p>
                                <input type="text" value={s.val} onChange={e=>s.setVal(e.target.value)} placeholder={s.ph} className="w-full border border-gray-200 text-xs px-2 py-1.5 focus:outline-none focus:border-[#3B5373] rounded"/>
                                <input type="text" value={s.label} onChange={e=>s.setLabel(e.target.value)} placeholder={s.lph} className="w-full border border-gray-200 text-xs px-2 py-1.5 focus:outline-none focus:border-[#3B5373] rounded"/>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <button onClick={saveBowHero} disabled={bowHeroSaving}
                        className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                        <Save className="w-4 h-4"/>{bowHeroSaving ? "Saving…" : "Save Hero Settings"}
                      </button>
                    </div>
                  </div>

                  {/* ── Why Choose Section ──────────────────────────── */}
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-base font-semibold text-gray-800">&ldquo;Why Choose&rdquo; Section</h2>
                        <p className="text-xs text-gray-400 mt-0.5">3 cards section — toggle ON/OFF ya edit karo</p>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{bowWhyVisible ? "Visible" : "Hidden"}</span>
                        <button onClick={()=>setBowWhyVisible(v=>!v)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${bowWhyVisible?"bg-[#3B5373]":"bg-gray-200"}`}>
                          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${bowWhyVisible?"translate-x-6":"translate-x-1"}`}/>
                        </button>
                      </div>
                    </div>
                    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5 ${!bowWhyVisible?"opacity-50 pointer-events-none":""}`}>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1">Heading (normal)</p>
                          <input type="text" value={bowWhyHeading} onChange={e=>setBowWhyHeading(e.target.value)} className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1">Heading (italic/colored)</p>
                          <input type="text" value={bowWhyHeadingItalic} onChange={e=>setBowWhyHeadingItalic(e.target.value)} className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { icon: bowWhyCard1Icon, setIcon: setBowWhyCard1Icon, title: bowWhyCard1Title, setTitle: setBowWhyCard1Title, desc: bowWhyCard1Desc, setDesc: setBowWhyCard1Desc, n: 1 },
                          { icon: bowWhyCard2Icon, setIcon: setBowWhyCard2Icon, title: bowWhyCard2Title, setTitle: setBowWhyCard2Title, desc: bowWhyCard2Desc, setDesc: setBowWhyCard2Desc, n: 2 },
                          { icon: bowWhyCard3Icon, setIcon: setBowWhyCard3Icon, title: bowWhyCard3Title, setTitle: setBowWhyCard3Title, desc: bowWhyCard3Desc, setDesc: setBowWhyCard3Desc, n: 3 },
                        ].map(c => (
                          <div key={c.n} className="border border-gray-100 rounded-xl p-4 space-y-2.5">
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Card {c.n}</p>
                            <div className="flex gap-2">
                              <input type="text" value={c.icon} onChange={e=>c.setIcon(e.target.value)} placeholder="emoji" className="w-16 border border-gray-200 text-lg px-2 py-1.5 text-center focus:outline-none focus:border-[#3B5373] rounded"/>
                              <input type="text" value={c.title} onChange={e=>c.setTitle(e.target.value)} placeholder="Card Title" className="flex-1 border border-gray-200 text-xs px-2 py-1.5 focus:outline-none focus:border-[#3B5373] rounded"/>
                            </div>
                            <textarea rows={2} value={c.desc} onChange={e=>c.setDesc(e.target.value)} placeholder="Card description..." className="w-full border border-gray-200 text-xs px-2 py-1.5 focus:outline-none focus:border-[#3B5373] rounded resize-none"/>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1">Footer text (below cards)</p>
                        <textarea rows={2} value={bowWhyFooterText} onChange={e=>setBowWhyFooterText(e.target.value)} className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg resize-none"/>
                      </div>
                      <button onClick={saveBowWhy} disabled={bowWhySaving}
                        className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                        <Save className="w-4 h-4"/>{bowWhySaving ? "Saving…" : "Save Why Choose Section"}
                      </button>
                    </div>
                  </div>

                  {/* Products table */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-base font-semibold text-gray-800">Bow Collection on Page</h2>
                        <p className="text-xs text-gray-400 mt-0.5">{bowPageProducts.filter(p=>p.active).length} showing · {bowPageProducts.filter(p=>!p.active).length} hidden</p>
                      </div>
                      <a href="/shop/bow" target="_blank" className="text-xs text-[#3B5373] border border-[#3B5373] px-3 py-1.5 hover:bg-[#3B5373] hover:text-white transition-colors">
                        View Live Page →
                      </a>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50">
                            <th className="px-4 py-3 text-left text-[10px] tracking-widest uppercase text-gray-400 font-medium">Product</th>
                            <th className="px-4 py-3 text-left text-[10px] tracking-widest uppercase text-gray-400 font-medium hidden md:table-cell">Tags</th>
                            <th className="px-4 py-3 text-left text-[10px] tracking-widest uppercase text-gray-400 font-medium">Price</th>
                            <th className="px-4 py-3 text-center text-[10px] tracking-widest uppercase text-gray-400 font-medium w-28">Show on Page</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bowPageProducts.map((p, i) => (
                            <tr key={p.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i%2===0?"":"bg-gray-50/30"}`}>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                  {p.image && <img src={p.image} alt={p.title} className="w-11 h-11 object-cover object-top rounded flex-shrink-0" />}
                                  <div>
                                    <p className="font-medium text-gray-800 text-sm">{p.title}</p>
                                    {p.featured_tab && <span className={`text-[9px] tracking-wider uppercase px-1.5 py-0.5 rounded mt-0.5 inline-block ${p.featured_tab==="latest"?"bg-[#e8f0fe] text-blue-600":p.featured_tab==="bestseller"?"bg-[#fef3c7] text-yellow-700":"bg-[#fee2e2] text-red-600"}`}>{p.featured_tab}</span>}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 hidden md:table-cell">
                                <div className="flex flex-wrap gap-1">
                                  {(p.tags??[]).map((t:string)=><span key={t} className="text-[9px] tracking-wider uppercase bg-[#f0ecff] text-[#3B5373] px-1.5 py-0.5 rounded">{t}</span>)}
                                  {(!p.tags||p.tags.length===0)&&<span className="text-gray-300 text-xs">—</span>}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">₹{p.price?.toLocaleString("en-IN")}</td>
                              <td className="px-4 py-3 text-center">
                                <button onClick={async()=>{await supabase.from("products").update({active:!p.active}).eq("id",p.id);setBowPageProducts(prev=>prev.map(x=>x.id===p.id?{...x,active:!x.active}:x));}}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${p.active?"bg-[#3B5373]":"bg-gray-200"}`}>
                                  <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${p.active?"translate-x-6":"translate-x-1"}`}/>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {bowPageProducts.length===0&&<div className="p-10 text-center text-gray-400 text-sm">No bow items found. Add from Catalog → Products (category = bow).</div>}
                    </div>
                  </div>

                  {/* Filter types */}
                  <div>
                    <div className="mb-4">
                      <h2 className="text-base font-semibold text-gray-800">Filter Sidebar — Bow Types</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Bow page ke filter sidebar mein yeh options dikhte hain.</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                      <div className="flex flex-wrap gap-2 min-h-[36px]">
                        {bowFilterTypes.map(ft=>(
                          <span key={ft} className="inline-flex items-center gap-1.5 bg-[#f0ecff] text-[#3B5373] text-xs font-medium px-3 py-1.5 rounded-full">
                            {ft}
                            <button onClick={async()=>{const u=bowFilterTypes.filter(x=>x!==ft);setBowFilterTypes(u);await saveBowFilterTypes(u);}} className="text-[#3B5373]/60 hover:text-red-500 transition-colors text-sm leading-none">×</button>
                          </span>
                        ))}
                        {bowFilterTypes.length===0&&<p className="text-xs text-gray-300">No filter types yet.</p>}
                      </div>
                      <div className="flex gap-2">
                        <input type="text" value={newBowFilterType} onChange={e=>setNewBowFilterType(e.target.value)}
                          onKeyDown={async e=>{if(e.key==="Enter"&&newBowFilterType.trim()){const u=[...bowFilterTypes,newBowFilterType.trim()];setBowFilterTypes(u);setNewBowFilterType("");await saveBowFilterTypes(u);}}}
                          placeholder="e.g. Satin, Organza…" className="flex-1 border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        <button onClick={async()=>{if(!newBowFilterType.trim())return;const u=[...bowFilterTypes,newBowFilterType.trim()];setBowFilterTypes(u);setNewBowFilterType("");await saveBowFilterTypes(u);}}
                          disabled={bowFilterSaving||!newBowFilterType.trim()} className="px-4 py-2 bg-[#3B5373] text-white text-sm font-medium hover:bg-[#2d3f4f] rounded-lg disabled:opacity-50 transition-colors">
                          {bowFilterSaving?"Saving…":"Add"}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {tab === "collections" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <p className="text-sm text-gray-500">{collections.length} collections</p>
                <div className="flex items-center gap-2">
                  <button onClick={fetchCollections} disabled={collectionsLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-[#3B5373] border border-gray-200 rounded-lg transition-colors">
                    <RefreshCw className={`w-3.5 h-3.5 ${collectionsLoading ? "animate-spin" : ""}`} /> Refresh
                  </button>
                  <button onClick={() => { setCollectionModalMode("add"); setCollectionModal({ open: true, data: { title: "", slug: "", description: "", image_url: "", hover_image_url: "", tag_label: "", image_position: "top", display_order: collections.length + 1, active: true } }); setSlugManuallyEdited(false); }}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-[#3B5373] text-white rounded-lg text-xs font-medium hover:bg-[#2d3f4f] transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add Collection
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {collectionsLoading ? (
                  <div className="p-12 text-center text-gray-400 text-sm">Loading collections…</div>
                ) : collections.length === 0 ? (
                  <div className="p-12 text-center">
                    <Layers className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No collections found.</p>
                    <p className="text-xs text-gray-300 mt-1">Run the seed script or add an image_url column to your collections table.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          {["Image", "Title", "Slug", "Order", "Active", "Actions"].map((h) => (
                            <th key={h} className="text-left px-5 py-3.5 text-xs uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {collections.map((c) => (
                          <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-4">
                              {c.image_url ? (
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={c.image_url} alt={c.title} className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                                  <Layers className="w-5 h-5 text-gray-300" />
                                </div>
                              )}
                            </td>
                            <td className="px-5 py-4">
                              <p className="font-medium text-gray-700 text-sm">{c.title}</p>
                              {c.description && <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">{c.description}</p>}
                            </td>
                            <td className="px-5 py-4">
                              <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{c.slug}</span>
                            </td>
                            <td className="px-5 py-4 text-xs text-gray-400">{c.display_order}</td>
                            <td className="px-5 py-4">
                              <button
                                onClick={() => toggleCollectionActive(c)}
                                className={`w-9 h-5 rounded-full transition-colors flex-shrink-0 relative ${c.active ? "bg-emerald-500" : "bg-gray-300"}`}
                                title={c.active ? "Deactivate" : "Activate"}
                              >
                                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${c.active ? "left-4" : "left-0.5"}`} />
                              </button>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1">
                                <button onClick={() => openManageProducts(c)}
                                  className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-300 hover:text-blue-500 transition-colors" title="Manage Products">
                                  <Package className="w-4 h-4" />
                                </button>
                                <button onClick={() => { setCollectionModalMode("edit"); openEditCollection(c); }}
                                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#3B5373] transition-colors" title="Edit">
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => deleteCollection(c.id!)}
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors" title="Delete">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              COLLECTIONS PAGE TAB
          ══════════════════════════════════════ */}
          {tab === "collections-page" && (
            <div className="space-y-8">

              {/* ── Hero Section ─────────────────────────────────── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h2 className="text-base font-semibold text-gray-800">Hero Section</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Collections page ka hero text, image aur stats.</p>
                  </div>
                  <button onClick={saveCollHero} disabled={collHeroSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-[#3B5373] text-white text-xs rounded-lg hover:bg-[#2c4159] disabled:opacity-50 transition-colors">
                    <Save className="w-4 h-4"/>{collHeroSaving ? "Saving…" : "Save Hero"}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Eyebrow Text</label>
                    <input value={collHeroEyebrow} onChange={e=>setCollHeroEyebrow(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3B5373]" placeholder="Summer Edit 2025" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Hero Image URL (blank = full width text)</label>
                    <input value={collHeroImage} onChange={e=>setCollHeroImage(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3B5373]" placeholder="https://..." />
                  </div>
                </div>
                {/* Title 3 lines */}
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-2">Big Heading (3 lines — blank = skip that line)</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-1">Line 1</label>
                      <input value={collHeroLine1} onChange={e=>setCollHeroLine1(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3B5373]" placeholder="Explore" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-1">Line 2 (italic navy)</label>
                      <input value={collHeroLine2} onChange={e=>setCollHeroLine2(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3B5373]" placeholder="our" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-1">Line 3</label>
                      <input value={collHeroLine3} onChange={e=>setCollHeroLine3(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3B5373]" placeholder="Collection" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Tagline (italic, below heading)</label>
                    <input value={collHeroTagline} onChange={e=>setCollHeroTagline(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3B5373]" placeholder="One heel. Endless looks." />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Section Label (below filter bar)</label>
                    <input value={collSectionLabel} onChange={e=>setCollSectionLabel(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3B5373]" placeholder="Curated for you this season" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Hero Sub Text</label>
                  <textarea value={collHeroSub} onChange={e=>setCollHeroSub(e.target.value)} rows={2}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3B5373] resize-none" />
                </div>
                {/* CTA buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">CTA Button 1 Text</label>
                    <input value={collCtaText} onChange={e=>setCollCtaText(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3B5373]" placeholder="Explore All Styles →" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">CTA Button 2 Text</label>
                    <input value={collCta2Text} onChange={e=>setCollCta2Text(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3B5373]" placeholder="Style Guide" />
                  </div>
                </div>
                {/* Float badge */}
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-2">Float Badge (bottom-left of image — only shows if image is set)</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-1">Badge Label</label>
                      <input value={collBadgeLabel} onChange={e=>setCollBadgeLabel(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3B5373]" placeholder="New Arrivals" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400 mb-1">Badge Sub text</label>
                      <input value={collBadgeSub} onChange={e=>setCollBadgeSub(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3B5373]" placeholder="Styles this season" />
                    </div>
                  </div>
                </div>
                {/* Stats */}
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-2">Stats Row (3 numbers)</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { val: collStat1Val, setVal: setCollStat1Val, label: collStat1Label, setLabel: setCollStat1Label, ph: "24+" },
                      { val: collStat2Val, setVal: setCollStat2Val, label: collStat2Label, setLabel: setCollStat2Label, ph: "3" },
                      { val: collStat3Val, setVal: setCollStat3Val, label: collStat3Label, setLabel: setCollStat3Label, ph: "₹399+" },
                    ].map((st, i) => (
                      <div key={i} className="border border-gray-100 rounded-lg p-3 space-y-2">
                        <input value={st.val} onChange={e=>st.setVal(e.target.value)}
                          className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#3B5373]" placeholder={st.ph} />
                        <input value={st.label} onChange={e=>st.setLabel(e.target.value)}
                          className="w-full border border-gray-200 rounded px-2 py-1.5 text-xs text-gray-500 focus:outline-none focus:border-[#3B5373]" placeholder="Label" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Brand Strip ──────────────────────────────────── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h2 className="text-base font-semibold text-gray-800">Brand Strip</h2>
                    <p className="text-xs text-gray-400 mt-0.5">3 brand pillars — navy background section.</p>
                  </div>
                  <button onClick={saveCollStrip} disabled={collStripSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-[#3B5373] text-white text-xs rounded-lg hover:bg-[#2c4159] disabled:opacity-50 transition-colors">
                    <Save className="w-4 h-4"/>{collStripSaving ? "Saving…" : "Save Strip"}
                  </button>
                </div>
                {[
                  { title: collStrip1Title, setTitle: setCollStrip1Title, desc: collStrip1Desc, setDesc: setCollStrip1Desc, n: 1 },
                  { title: collStrip2Title, setTitle: setCollStrip2Title, desc: collStrip2Desc, setDesc: setCollStrip2Desc, n: 2 },
                  { title: collStrip3Title, setTitle: setCollStrip3Title, desc: collStrip3Desc, setDesc: setCollStrip3Desc, n: 3 },
                ].map((strip) => (
                  <div key={strip.n} className="border border-gray-100 rounded-xl p-4 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Pillar {strip.n} Title</label>
                      <input value={strip.title} onChange={e=>strip.setTitle(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3B5373]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                      <input value={strip.desc} onChange={e=>strip.setDesc(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3B5373]" />
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Testimonial ───────────────────────────────────── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <h2 className="text-base font-semibold text-gray-800">Testimonial</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Customer quote section below brand strip.</p>
                  </div>
                  <button onClick={saveCollTest} disabled={collTestSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-[#3B5373] text-white text-xs rounded-lg hover:bg-[#2c4159] disabled:opacity-50 transition-colors">
                    <Save className="w-4 h-4"/>{collTestSaving ? "Saving…" : "Save Testimonial"}
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Quote Text</label>
                  <textarea value={collTestText} onChange={e=>setCollTestText(e.target.value)} rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3B5373] resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Author</label>
                  <input value={collTestAuthor} onChange={e=>setCollTestAuthor(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3B5373]" placeholder="— Priya S., Mumbai" />
                </div>
              </div>

            </div>
          )}

          {/* ══════════════════════════════════════
              STYLE IDEAS PAGE TAB
          ══════════════════════════════════════ */}
          {tab === "style-ideas-page" && (
            <div className="space-y-8">
              {siPageLoading ? <div className="p-12 text-center text-gray-400 text-sm">Loading…</div> : (
                <>
                  {/* Hero Settings */}
                  <div>
                    <div className="mb-4">
                      <h2 className="text-base font-semibold text-gray-800">Hero Section</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Style Ideas page hero background aur text set karo.</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
                      {/* Background Type */}
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Background Type</label>
                        <div className="flex gap-2 flex-wrap">
                          {(["none","image","video","slider"] as const).map(t => (
                            <button key={t} onClick={() => setSiHeroBgType(t)}
                              className={`px-4 py-1.5 text-xs font-medium border rounded-full transition-colors capitalize ${siHeroBgType===t?"bg-[#3B5373] text-white border-[#3B5373]":"border-gray-200 text-gray-500 hover:border-[#3B5373]"}`}>
                              {t === "none" ? "Plain Color" : t === "slider" ? "Image Slider" : t === "image" ? "Single Image" : "Video"}
                            </button>
                          ))}
                        </div>
                      </div>
                      {(siHeroBgType === "image" || siHeroBgType === "video") && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">
                            {siHeroBgType === "image" ? "Image URL" : "Video URL (mp4 or YouTube)"}
                          </label>
                          <input type="text" value={siHeroBgUrl} onChange={e => setSiHeroBgUrl(e.target.value)}
                            placeholder={siHeroBgType==="image" ? "https://cdn.example.com/image.jpg" : "https://...mp4 or YouTube URL"}
                            className="w-full border border-gray-200 text-sm px-3 py-2.5 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                          {siHeroBgUrl && siHeroBgType==="image" && (
                            <img src={siHeroBgUrl} alt="preview" className="mt-2 h-24 w-full object-cover rounded-lg object-top" onError={e=>{(e.target as HTMLImageElement).style.display="none"}}/>
                          )}
                        </div>
                      )}
                      {siHeroBgType === "slider" && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Slider Images (one per line)</label>
                          <textarea rows={4} value={siHeroSlides.join("\n")} onChange={e => setSiHeroSlides(e.target.value.split("\n").map(x=>x.trim()).filter(Boolean))}
                            placeholder={"https://image1.jpg\nhttps://image2.jpg"}
                            className="w-full border border-gray-200 text-sm px-3 py-2.5 focus:outline-none focus:border-[#3B5373] rounded-lg font-mono"/>
                        </div>
                      )}
                      {/* Hero Text */}
                      <div className="space-y-3">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block">Hero Text</label>
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1">Eyebrow</p>
                          <input type="text" value={siHeroEyebrow} onChange={e => setSiHeroEyebrow(e.target.value)} placeholder="Lookbook 2024" className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1">Main Title (normal)</p>
                          <input type="text" value={siHeroTitle} onChange={e => setSiHeroTitle(e.target.value)} placeholder="One Pair." className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1">Main Title (italic/colored line)</p>
                          <input type="text" value={siHeroTitleItalic} onChange={e => setSiHeroTitleItalic(e.target.value)} placeholder="Every Occasion." className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1">Subtitle</p>
                          <input type="text" value={siHeroSubtitle} onChange={e => setSiHeroSubtitle(e.target.value)} placeholder="Style ideas, outfit inspo, and the looks our team is loving." className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        </div>
                      </div>
                      {/* Text Position */}
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Text Position</label>
                        <div className="flex gap-2">
                          {(["left","center","right"] as const).map(pos => (
                            <button key={pos} onClick={() => setSiHeroTextPos(pos)}
                              className={`px-4 py-1.5 text-xs font-medium border rounded-full transition-colors capitalize ${siHeroTextPos===pos?"bg-[#3B5373] text-white border-[#3B5373]":"border-gray-200 text-gray-500 hover:border-[#3B5373]"}`}>
                              {pos === "left" ? "⬅ Left" : pos === "right" ? "Right ➡" : "⬛ Center"}
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* Stats Bar */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Stats Bar</label>
                          <button onClick={() => setSiHeroShowStats(v => !v)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${siHeroShowStats?"bg-[#3B5373]":"bg-gray-200"}`}>
                            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${siHeroShowStats?"translate-x-6":"translate-x-1"}`}/>
                          </button>
                        </div>
                        {siHeroShowStats && (
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { val: siHeroStat1Val, setVal: setSiHeroStat1Val, label: siHeroStat1Label, setLabel: setSiHeroStat1Label, ph: "4", lph: "Looks" },
                              { val: siHeroStat2Val, setVal: setSiHeroStat2Val, label: siHeroStat2Label, setLabel: setSiHeroStat2Label, ph: "12+", lph: "Styles" },
                              { val: siHeroStat3Val, setVal: setSiHeroStat3Val, label: siHeroStat3Label, setLabel: setSiHeroStat3Label, ph: "Free", lph: "Shipping ₹999+" },
                            ].map((s, i) => (
                              <div key={i} className="border border-gray-100 rounded-lg p-3 space-y-2">
                                <p className="text-[10px] text-gray-400 font-medium">Stat {i+1}</p>
                                <input type="text" value={s.val} onChange={e=>s.setVal(e.target.value)} placeholder={s.ph} className="w-full border border-gray-200 text-xs px-2 py-1.5 focus:outline-none focus:border-[#3B5373] rounded"/>
                                <input type="text" value={s.label} onChange={e=>s.setLabel(e.target.value)} placeholder={s.lph} className="w-full border border-gray-200 text-xs px-2 py-1.5 focus:outline-none focus:border-[#3B5373] rounded"/>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <button onClick={saveStyleIdeasHero} disabled={siHeroSaving}
                        className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                        <Save className="w-4 h-4"/>{siHeroSaving ? "Saving…" : "Save Hero Settings"}
                      </button>
                    </div>
                  </div>

                  {/* ── Occasions / Filter Tabs ─────────────────────── */}
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-base font-semibold text-gray-800">Occasions / Filter Tabs</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Style Ideas page pe filter tabs — add/remove occasions.</p>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-gray-400">{siOccasionsVisible ? "Visible" : "Hidden"}</span>
                        <button onClick={async () => { setSiOccasionsVisible(v => !v); }} 
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${siOccasionsVisible ? "bg-[#3B5373]" : "bg-gray-200"}`}>
                          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${siOccasionsVisible ? "translate-x-6" : "translate-x-1"}`}/>
                        </button>
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                      <div className="flex flex-wrap gap-2 min-h-[36px]">
                        {siOccasions.map((occ, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 bg-[#f0ecff] text-[#3B5373] text-xs font-medium px-3 py-1.5 rounded-full">
                            {occ}
                            {occ !== "All Looks" && (
                              <button onClick={async () => { const u = siOccasions.filter((_,j)=>j!==i); setSiOccasions(u); await saveSiOccasions(u); }} className="text-[#3B5373]/60 hover:text-red-500 transition-colors text-sm leading-none">×</button>
                            )}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input type="text" value={newSiOccasion} onChange={e=>setNewSiOccasion(e.target.value)}
                          onKeyDown={async e=>{if(e.key==="Enter"&&newSiOccasion.trim()){const u=[...siOccasions,newSiOccasion.trim()];setSiOccasions(u);setNewSiOccasion("");await saveSiOccasions(u);}}}
                          placeholder="e.g. Wedding, Party, Brunch…"
                          className="flex-1 border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        <button onClick={async()=>{if(!newSiOccasion.trim())return;const u=[...siOccasions,newSiOccasion.trim()];setSiOccasions(u);setNewSiOccasion("");await saveSiOccasions(u);}}
                          disabled={siOccasionsSaving||!newSiOccasion.trim()}
                          className="px-4 py-2 bg-[#3B5373] text-white text-sm font-medium hover:bg-[#2d3f4f] rounded-lg disabled:opacity-50 transition-colors">
                          {siOccasionsSaving ? "Saving…" : "Add"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ── Look Cards Heading ─────────────────────────── */}
                  <div>
                    <div className="mb-3">
                      <h2 className="text-base font-semibold text-gray-800">Look Cards Heading</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Cards grid ke upar ka title</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-3">
                      <input type="text" value={siLooksHeading} onChange={e => setSiLooksHeading(e.target.value)}
                        placeholder="Shop the Look"
                        className="flex-1 border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                      <button onClick={() => saveSiLooksHeading(siLooksHeading)} disabled={siLooksHeadingSaving}
                        className="px-4 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] disabled:opacity-60 flex-shrink-0">
                        {siLooksHeadingSaving ? "Saving…" : "Save"}
                      </button>
                    </div>
                  </div>

                  {/* ── Cards per Row ──────────────────────────────── */}
                  <div>
                    <div className="mb-4">
                      <h2 className="text-base font-semibold text-gray-800">Cards per Row</h2>
                      <p className="text-xs text-gray-400 mt-0.5">1 row mein kitni cards dikhengi? (Desktop)</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                      <div className="flex gap-2 flex-wrap">
                        {[2,3,4,5,6].map(n=>(
                          <button key={n} onClick={async()=>{setSiCardsPerRow(n);await saveSiCardsPerRow(n);}}
                            className={`w-12 h-12 text-sm font-semibold border rounded-xl transition-colors ${siCardsPerRow===n?"bg-[#3B5373] text-white border-[#3B5373]":"border-gray-200 text-gray-500 hover:border-[#3B5373]"}`}>
                            {n}
                          </button>
                        ))}
                        {siCardsPerRowSaving && <span className="text-xs text-gray-400 self-center">Saving…</span>}
                      </div>
                      {/* Tag visibility toggle */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Occasion Tag on Cards</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Card pe "DATE NIGHT", "CASUAL" waala label</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">{siCardsShowTag ? "Visible" : "Hidden"}</span>
                          <button onClick={async () => {
                            const next = !siCardsShowTag;
                            setSiCardsShowTag(next);
                            await supabase.from("site_settings").delete().eq("key","si_cards_show_tag");
                            await supabase.from("site_settings").insert({key:"si_cards_show_tag", value: next ? "true" : "false"});
                            await revalidateSite();
                          }}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${siCardsShowTag ? "bg-[#3B5373]" : "bg-gray-200"}`}>
                            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${siCardsShowTag ? "translate-x-6" : "translate-x-1"}`}/>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Look Cards Advanced Controls ───────────────── */}
                  <div>
                    <div className="mb-3">
                      <h2 className="text-base font-semibold text-gray-800">Look Cards — Advanced</h2>
                      <p className="text-xs text-gray-400 mt-0.5">Card ka size, shape, spacing, mobile columns</p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">Mobile Columns</p>
                          <div className="flex gap-2">
                            {[1,2,3].map(n=>(
                              <button key={n} type="button" onClick={()=>setSiLooksMobile(n)}
                                className={`w-10 h-10 text-sm font-semibold border rounded-lg transition-colors ${siLooksMobile===n?"bg-[#3B5373] text-white border-[#3B5373]":"border-gray-200 text-gray-500 hover:border-[#3B5373]"}`}>{n}</button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">Gap (px)</p>
                          <input type="number" min={0} max={60} value={siLooksGap} onChange={e=>setSiLooksGap(parseInt(e.target.value)||0)}
                            className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">Aspect Ratio</p>
                        <div className="flex flex-wrap gap-2">
                          {[["none","Free"],["3/4","3:4"],["4/5","4:5"],["9/16","9:16"],["1/1","1:1"],["16/9","16:9"]].map(([val,label])=>(
                            <button key={val} type="button" onClick={()=>setSiLooksAspect(val)}
                              className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${siLooksAspect===val?"bg-[#3B5373] text-white border-[#3B5373]":"border-gray-200 text-gray-500 hover:border-[#3B5373]"}`}>{label}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">Border Radius</p>
                        <div className="flex gap-2">
                          {[["sharp","Sharp ◼"],["slight","Slight ▪"],["rounded","Rounded ◻"],["pill","Pill ⬜"]].map(([val,label])=>(
                            <button key={val} type="button" onClick={()=>setSiLooksRadius(val)}
                              className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${siLooksRadius===val?"bg-[#3B5373] text-white border-[#3B5373]":"border-gray-200 text-gray-500 hover:border-[#3B5373]"}`}>{label}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider">Card Height (px) <span className="text-gray-300">— 0 = aspect ratio se auto</span></p>
                        <input type="number" min={0} max={900} value={siLooksCardH} onChange={e=>setSiLooksCardH(parseInt(e.target.value)||0)}
                          className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                      </div>
                      <button onClick={saveSiLooksAdv} disabled={siLooksAdvSaving}
                        className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] disabled:opacity-60">
                        <Save className="w-4 h-4"/>{siLooksAdvSaving?"Saving…":"Save Advanced Settings"}
                      </button>
                    </div>
                  </div>

                  {/* ── Look Cards CRUD ────────────────────────────── */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-base font-semibold text-gray-800">Look Cards</h2>
                        <p className="text-xs text-gray-400 mt-0.5">{styleInspos.filter(s=>s.active).length} active · {styleInspos.length} total</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={fetchStyleInspos} disabled={styleInspoLoading} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg">
                          <RefreshCw className="w-3 h-3"/>Refresh
                        </button>
                        <button onClick={()=>setStyleInspoModal({open:true,mode:"add",data:{...EMPTY_STYLE_INSPO}})}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#3B5373] text-white text-xs font-medium rounded-lg hover:bg-[#2d3f4f]">
                          <Plus className="w-3.5 h-3.5"/>Add Look
                        </button>
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      {styleInspoLoading ? (
                        <div className="p-10 text-center text-gray-400 text-sm">Loading…</div>
                      ) : styleInspos.length === 0 ? (
                        <div className="p-10 text-center">
                          <Camera className="w-8 h-8 text-gray-200 mx-auto mb-3"/>
                          <p className="text-sm text-gray-400">No looks yet. Add your first look!</p>
                        </div>
                      ) : (
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                              <th className="px-4 py-3 text-left text-[10px] tracking-widest uppercase text-gray-400 font-medium">Look</th>
                              <th className="px-4 py-3 text-left text-[10px] tracking-widest uppercase text-gray-400 font-medium hidden md:table-cell">Occasion</th>
                              <th className="px-4 py-3 text-left text-[10px] tracking-widest uppercase text-gray-400 font-medium hidden md:table-cell">Media</th>
                              <th className="px-4 py-3 text-center text-[10px] tracking-widest uppercase text-gray-400 font-medium w-20">Active</th>
                              <th className="px-4 py-3 w-20"/>
                            </tr>
                          </thead>
                          <tbody>
                            {styleInspos.map((inspo,i)=>(
                              <tr key={inspo.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i%2===0?"":"bg-gray-50/30"}`}>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-3">
                                    {inspo.image_url && (
                                      inspo.media_type === "video"
                                        ? <div className="w-11 h-11 bg-gray-900 rounded flex items-center justify-center flex-shrink-0"><span className="text-white text-xs">▶</span></div>
                                        : <img src={inspo.image_url} alt={inspo.title} className="w-11 h-11 object-cover object-top rounded flex-shrink-0"/>
                                    )}
                                    <div>
                                      <p className="font-medium text-gray-800 text-sm">{inspo.title}</p>
                                      {inspo.description && <p className="text-xs text-gray-400 truncate max-w-[180px]">{inspo.description}</p>}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell">
                                  {inspo.tag ? <span className="text-[10px] tracking-wider uppercase bg-[#f0ecff] text-[#3B5373] px-2 py-1 rounded-full">{inspo.tag}</span> : <span className="text-gray-300 text-xs">—</span>}
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell">
                                  <span className={`text-[10px] tracking-wider uppercase px-2 py-1 rounded-full ${inspo.media_type==="video"?"bg-orange-50 text-orange-600":"bg-blue-50 text-blue-600"}`}>
                                    {inspo.media_type==="video"?"📹 Video":"🖼 Image"}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <button onClick={async()=>{await supabase.from("style_inspo").update({active:!inspo.active}).eq("id",inspo.id);await revalidateSite();setStyleInspos(prev=>prev.map(x=>x.id===inspo.id?{...x,active:!x.active}:x));}}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${inspo.active?"bg-[#3B5373]":"bg-gray-200"}`}>
                                    <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${inspo.active?"translate-x-6":"translate-x-1"}`}/>
                                  </button>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex gap-1 justify-end">
                                    <button onClick={()=>setStyleInspoModal({open:true,mode:"edit",data:{...inspo}})} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600"><Pencil className="w-3.5 h-3.5"/></button>
                                    <button onClick={()=>setDeleteStyleInspoConfirm(inspo.id!)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5"/></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>

                    {/* Delete confirm */}
                    {deleteStyleInspoConfirm && (
                      <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                          <p className="font-semibold text-gray-800 mb-2">Delete this look?</p>
                          <p className="text-sm text-gray-500 mb-5">This cannot be undone.</p>
                          <div className="flex gap-3">
                            <button onClick={()=>setDeleteStyleInspoConfirm(null)} className="flex-1 px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
                            <button onClick={async()=>{await supabase.from("style_inspo").delete().eq("id",deleteStyleInspoConfirm);setDeleteStyleInspoConfirm(null);await fetchStyleInspos();await revalidateSite();}} className="flex-1 px-4 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600">Delete</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════
              FEATURED LOOK TAB (separate)
          ══════════════════════════════════════ */}
          {tab === "style-ideas-featured" && (
            <div className="space-y-8">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-base font-semibold text-gray-800">Featured Look (Editor&apos;s Pick)</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Style Ideas page pe ek highlighted look — left text + right image + products.</p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{siFeaturedVisible?"Visible":"Hidden"}</span>
                    <button onClick={()=>setSiFeaturedVisible(v=>!v)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${siFeaturedVisible?"bg-[#3B5373]":"bg-gray-200"}`}>
                      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${siFeaturedVisible?"translate-x-6":"translate-x-1"}`}/>
                    </button>
                  </div>
                </div>
                <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5 ${!siFeaturedVisible?"opacity-50 pointer-events-none":""}`}>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1">Eyebrow Label (e.g. EDITOR&apos;S PICK)</p>
                      <input type="text" value={siFeaturedLabel} onChange={e=>setSiFeaturedLabel(e.target.value)} className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1">Heading</p>
                      <input type="text" value={siFeaturedHeading} onChange={e=>setSiFeaturedHeading(e.target.value)} placeholder="The Look Everyone's Asking About" className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1">Description</p>
                      <textarea rows={2} value={siFeaturedDesc} onChange={e=>setSiFeaturedDesc(e.target.value)} className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg resize-none"/>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mb-2">Featured Image / Video</label>
                    <div className="flex gap-2 mb-2">
                      {(["image","video"] as const).map(t=>(
                        <button key={t} type="button" onClick={()=>setSiFeaturedMediaType(t)}
                          className={`px-3 py-1.5 text-xs font-medium border rounded-lg capitalize transition-colors ${siFeaturedMediaType===t?"bg-[#3B5373] text-white border-[#3B5373]":"border-gray-200 text-gray-500"}`}>
                          {t==="image"?"🖼 Image":"📹 Video"}
                        </button>
                      ))}
                    </div>
                    <input type="text" value={siFeaturedImage} onChange={e=>setSiFeaturedImage(e.target.value)} placeholder="https://..." className="w-full border border-gray-200 text-sm px-3 py-2.5 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                    {siFeaturedImage && siFeaturedMediaType==="image" && (
                      <img src={siFeaturedImage} alt="preview" className="mt-2 h-24 w-full object-cover rounded-lg object-top" onError={e=>{(e.target as HTMLImageElement).style.display="none"}}/>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Products — Select up to 3</label>
                      <span className="text-[10px] text-[#3B5373] font-medium">{siFeaturedProducts.length}/3</span>
                    </div>
                    <div className="max-h-56 overflow-y-auto rounded-xl border border-gray-100 divide-y divide-gray-50">
                      {allProductsForCategoryModal.map(p => {
                        const selected = siFeaturedProducts.includes(p.id!);
                        const disabled = !selected && siFeaturedProducts.length >= 3;
                        return (
                          <button key={p.id} type="button" disabled={disabled}
                            onClick={()=> selected
                              ? setSiFeaturedProducts(prev => prev.filter(x => x !== p.id))
                              : setSiFeaturedProducts(prev => [...prev, p.id!])
                            }
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors
                              ${selected ? "bg-[#f0edff] border-l-4 border-[#3B5373]" : "hover:bg-gray-50"}
                              ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}>
                            {p.image && <img src={p.image} alt={p.title} className="w-9 h-9 object-cover rounded flex-shrink-0"/>}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-800 truncate">{p.title}</p>
                              <p className="text-[10px] text-gray-400">₹{p.price}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                              ${selected ? "bg-[#3B5373] border-[#3B5373]" : "border-gray-300"}`}>
                              {selected && <span className="text-white text-[10px]">✓</span>}
                            </div>
                          </button>
                        );
                      })}
                      {allProductsForCategoryModal.length === 0 && (
                        <p className="text-xs text-gray-300 text-center py-6">Loading products…</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1">CTA Button 1 Text</p>
                      <input type="text" value={siFeaturedCta1Text} onChange={e=>setSiFeaturedCta1Text(e.target.value)} className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                      <input type="text" value={siFeaturedCta1Url} onChange={e=>setSiFeaturedCta1Url(e.target.value)} placeholder="/shop/heels" className="w-full border border-gray-200 text-sm px-3 py-2 mt-1 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1">CTA Button 2 Text</p>
                      <input type="text" value={siFeaturedCta2Text} onChange={e=>setSiFeaturedCta2Text(e.target.value)} className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                      <input type="text" value={siFeaturedCta2Url} onChange={e=>setSiFeaturedCta2Url(e.target.value)} placeholder="/shop/heels" className="w-full border border-gray-200 text-sm px-3 py-2 mt-1 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                    </div>
                  </div>
                  <button onClick={saveSiFeatured} disabled={siFeaturedSaving}
                    className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                    <Save className="w-4 h-4"/>{siFeaturedSaving?"Saving…":"Save Featured Look"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              STYLE REELS TAB
          ══════════════════════════════════════ */}
          {tab === "style-ideas-reels" && (
            <div className="space-y-6">
              {/* Header toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-800">Style Reels Section</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Portrait card grid — image ya video, with title + tag overlay.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{siReelsVisible ? "Visible" : "Hidden"}</span>
                  <button onClick={() => setSiReelsVisible(v => !v)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${siReelsVisible ? "bg-[#3B5373]" : "bg-gray-200"}`}>
                    <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${siReelsVisible ? "translate-x-6" : "translate-x-1"}`}/>
                  </button>
                </div>
              </div>

              {/* Section text */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Section Text</h3>
                <div>
                  <p className="text-[10px] text-gray-400 mb-1">Heading / Quote</p>
                  <input type="text" value={siReelsHeading} onChange={e => setSiReelsHeading(e.target.value)}
                    className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 mb-1">Subtitle</p>
                  <input type="text" value={siReelsSubtitle} onChange={e => setSiReelsSubtitle(e.target.value)}
                    className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 mb-1">Columns per Row</p>
                  <div className="flex gap-2">
                    {[3,4,5,6].map(n => (
                      <button key={n} type="button" onClick={() => setSiReelsCols(n)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium border transition-colors ${siReelsCols === n ? "bg-[#3B5373] text-white border-[#3B5373]" : "border-gray-200 text-gray-500 hover:border-[#3B5373]"}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Size controls */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1">Height (px)</p>
                    <input type="number" min={100} max={1000} value={siReelsCardH}
                      onChange={e => setSiReelsCardH(parseInt(e.target.value) || 480)}
                      className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                    <p className="text-[10px] text-gray-300 mt-1">Default: 480</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1">Width (px)</p>
                    <input type="number" min={0} max={600} value={siReelsCardW}
                      onChange={e => setSiReelsCardW(parseInt(e.target.value) || 0)}
                      className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                    <p className="text-[10px] text-gray-300 mt-1">0 = auto</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1">Gap (px)</p>
                    <input type="number" min={0} max={60} value={siReelsGap}
                      onChange={e => setSiReelsGap(parseInt(e.target.value) || 12)}
                      className="w-full border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                    <p className="text-[10px] text-gray-300 mt-1">Default: 12</p>
                  </div>
                </div>

                {/* Aspect Ratio */}
                <div>
                  <p className="text-[10px] text-gray-400 mb-1">Aspect Ratio <span className="text-gray-300">(height se override hoga agar set hai)</span></p>
                  <div className="flex flex-wrap gap-2">
                    {[["none","Free"],["9/16","9:16"],["4/5","4:5"],["3/4","3:4"],["1/1","1:1"],["16/9","16:9"]].map(([val,label]) => (
                      <button key={val} type="button" onClick={() => setSiReelsAspect(val)}
                        className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${siReelsAspect===val?"bg-[#3B5373] text-white border-[#3B5373]":"border-gray-200 text-gray-500 hover:border-[#3B5373]"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Border Radius */}
                <div>
                  <p className="text-[10px] text-gray-400 mb-1">Border Radius (corners)</p>
                  <div className="flex gap-2">
                    {[["sharp","Sharp ◼"],["slight","Slight ▪"],["rounded","Rounded ◻"],["pill","Pill ⬜"]].map(([val,label]) => (
                      <button key={val} type="button" onClick={() => setSiReelsRadius(val)}
                        className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${siReelsRadius===val?"bg-[#3B5373] text-white border-[#3B5373]":"border-gray-200 text-gray-500 hover:border-[#3B5373]"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Columns */}
                <div>
                  <p className="text-[10px] text-gray-400 mb-1">Mobile Columns (phone pe)</p>
                  <div className="flex gap-2">
                    {[1,2,3].map(n => (
                      <button key={n} type="button" onClick={() => setSiReelsMobileCols(n)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium border transition-colors ${siReelsMobileCols===n?"bg-[#3B5373] text-white border-[#3B5373]":"border-gray-200 text-gray-500 hover:border-[#3B5373]"}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cards */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cards ({siReelsCards.length})</h3>
                  <button onClick={() => setSiReelsCards(c => [...c, { title: "", tag: "", media_url: "", media_type: "video" }])}
                    className="flex items-center gap-1 text-xs text-[#3B5373] hover:underline">
                    <Plus className="w-3 h-3"/>Add Card
                  </button>
                </div>
                <div className="space-y-3">
                  {siReelsCards.map((card, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase">Card {i + 1}</p>
                        <div className="flex items-center gap-2">
                          {/* Move up/down */}
                          {i > 0 && <button onClick={() => { const a=[...siReelsCards]; [a[i-1],a[i]]=[a[i],a[i-1]]; setSiReelsCards(a); }} className="text-gray-300 hover:text-gray-500 text-xs">↑</button>}
                          {i < siReelsCards.length-1 && <button onClick={() => { const a=[...siReelsCards]; [a[i],a[i+1]]=[a[i+1],a[i]]; setSiReelsCards(a); }} className="text-gray-300 hover:text-gray-500 text-xs">↓</button>}
                          <button onClick={() => setSiReelsCards(c => c.filter((_,j) => j !== i))} className="text-gray-300 hover:text-red-400 text-xs">✕</button>
                        </div>
                      </div>
                      {/* Media type toggle */}
                      <div className="flex gap-2">
                        {(["image","video"] as const).map(t => (
                          <button key={t} type="button"
                            onClick={() => { const a=[...siReelsCards]; a[i]={...a[i], media_type:t}; setSiReelsCards(a); }}
                            className={`px-3 py-1 text-[11px] font-medium border rounded-md transition-colors ${card.media_type===t?"bg-[#3B5373] text-white border-[#3B5373]":"border-gray-200 text-gray-500"}`}>
                            {t==="image"?"🖼 Image":"📹 Video"}
                          </button>
                        ))}
                      </div>
                      {/* URL */}
                      <input type="text" value={card.media_url}
                        onChange={e => { const a=[...siReelsCards]; a[i]={...a[i],media_url:e.target.value}; setSiReelsCards(a); }}
                        placeholder={card.media_type==="video" ? "https://... video URL" : "https://... image URL"}
                        className="w-full border border-gray-200 text-xs px-2 py-1.5 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                      {/* Preview */}
                      {card.media_url && card.media_type==="image" && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={card.media_url} alt="preview" className="h-16 w-full object-cover rounded-lg object-top" onError={e=>{(e.target as HTMLImageElement).style.display="none"}}/>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" value={card.title}
                          onChange={e => { const a=[...siReelsCards]; a[i]={...a[i],title:e.target.value}; setSiReelsCards(a); }}
                          placeholder="Caption (e.g. Festive, but effortless)"
                          className="border border-gray-200 text-xs px-2 py-1.5 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                        <input type="text" value={card.tag}
                          onChange={e => { const a=[...siReelsCards]; a[i]={...a[i],tag:e.target.value}; setSiReelsCards(a); }}
                          placeholder="Tag (e.g. WEDDING SEASON)"
                          className="border border-gray-200 text-xs px-2 py-1.5 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
                      </div>
                    </div>
                  ))}
                  {siReelsCards.length === 0 && (
                    <p className="text-xs text-gray-300 text-center py-6">No cards yet — click &quot;Add Card&quot; above</p>
                  )}
                </div>
                <button onClick={saveSiReels} disabled={siReelsSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                  <Save className="w-4 h-4"/>{siReelsSaving ? "Saving…" : "Save Style Reels"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              ADVANCED SETTINGS TABS
          ══════════════════════════════════════ */}
          {tab === "adv-shop" && (
            <AdvGridPanel
              title="Shop Grid (/shop page)"
              desc="Product grid on the main shop page"
              section="shop"
              mobile={advShopMobile} setMobile={setAdvShopMobile}
              desktop={advShopDesktop} setDesktop={setAdvShopDesktop}
              gap={advShopGap} setGap={setAdvShopGap}
              aspect={advShopAspect} setAspect={setAdvShopAspect}
              radius={advShopRadius} setRadius={setAdvShopRadius}
              cardH={advShopCardH} setCardH={setAdvShopCardH}
              saving={advSaving} onSave={() => saveAdvSection("shop")}
            />
          )}
          {tab === "adv-coll" && (
            <AdvGridPanel
              title="Collections Grid (/shop/heels etc.)"
              desc="Product grid on collection/category pages"
              section="coll"
              mobile={advCollMobile} setMobile={setAdvCollMobile}
              desktop={advCollDesktop} setDesktop={setAdvCollDesktop}
              gap={advCollGap} setGap={setAdvCollGap}
              aspect={advCollAspect} setAspect={setAdvCollAspect}
              radius={advCollRadius} setRadius={setAdvCollRadius}
              cardH={advCollCardH} setCardH={setAdvCollCardH}
              saving={advSaving} onSave={() => saveAdvSection("coll")}
            />
          )}
          {tab === "adv-picks" && (
            <AdvGridPanel
              title="Featured Picks Grid (Homepage)"
              desc="Product grid in the Featured Picks section"
              section="picks"
              mobile={advPicksMobile} setMobile={setAdvPicksMobile}
              desktop={advPicksDesktop} setDesktop={setAdvPicksDesktop}
              gap={advPicksGap} setGap={setAdvPicksGap}
              aspect={advPicksAspect} setAspect={setAdvPicksAspect}
              radius={advPicksRadius} setRadius={setAdvPicksRadius}
              cardH={advPicksCardH} setCardH={setAdvPicksCardH}
              saving={advSaving} onSave={() => saveAdvSection("picks")}
            />
          )}
          {tab === "adv-inspo" && (
            <AdvGridPanel
              title="Style Inspo Grid (Homepage)"
              desc="The style inspo photo grid on homepage"
              section="inspo"
              desktop={advInspoDesktop} setDesktop={setAdvInspoDesktop}
              gap={advInspoGap} setGap={setAdvInspoGap}
              aspect={advInspoAspect} setAspect={setAdvInspoAspect}
              radius={advInspoRadius} setRadius={setAdvInspoRadius}
              cardH={advInspoCardH} setCardH={setAdvInspoCardH}
              saving={advSaving} onSave={() => saveAdvSection("inspo")}
              noMobile
            />
          )}
          {tab === "adv-related" && (
            <AdvGridPanel
              title="Related Products Grid (Product Page)"
              desc="Related products grid on individual product pages"
              section="related"
              mobile={advRelatedMobile} setMobile={setAdvRelatedMobile}
              desktop={advRelatedDesktop} setDesktop={setAdvRelatedDesktop}
              gap={advRelatedGap} setGap={setAdvRelatedGap}
              aspect={advRelatedAspect} setAspect={setAdvRelatedAspect}
              radius={advRelatedRadius} setRadius={setAdvRelatedRadius}
              cardH={advRelatedCardH} setCardH={setAdvRelatedCardH}
              saving={advSaving} onSave={() => saveAdvSection("related")}
            />
          )}

          {/* ══════════════════════════════════════
              HOT DEALS — hd-page TAB
          ══════════════════════════════════════ */}
          {tab === "hd-page" && (
            <div className="space-y-8">
              {/* Hero */}
              <div>
                <h2 className="text-base font-semibold text-gray-800 mb-1">Hero Section</h2>
                <p className="text-xs text-gray-400 mb-4">Left-side text + right-side product image (Design A layout).</p>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Eyebrow Text</p>
                    <input type="text" value={hdHeroEyebrow} onChange={e => setHdHeroEyebrow(e.target.value)} className={inputCls} placeholder="Limited Time" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Hero Heading <span className="normal-case text-gray-300">— use \n for line break (e.g. HOT\nDEALS)</span></p>
                    <textarea rows={2} value={hdHeroHeading} onChange={e => setHdHeroHeading(e.target.value)} className={inputCls + " resize-none font-mono"} placeholder={"HOT\nDEALS"} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Subtitle</p>
                    <input type="text" value={hdHeroSub} onChange={e => setHdHeroSub(e.target.value)} className={inputCls} placeholder="OFFERS YOU DON'T WANT TO MISS" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Hero Image URL <span className="normal-case text-gray-300">— right side of the hero</span></p>
                    <input type="text" value={hdHeroImg} onChange={e => setHdHeroImg(e.target.value)} className={inputCls} placeholder="https://..." />
                    {hdHeroImg && (
                      <img src={hdHeroImg} alt="preview" className="mt-2 h-24 w-full object-cover rounded-lg object-center" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    )}
                  </div>
                </div>
              </div>

              {/* Section Header */}
              <div>
                <h2 className="text-base font-semibold text-gray-800 mb-1">Section Header</h2>
                <p className="text-xs text-gray-400 mb-4">Heading and subtitle above the deals grid.</p>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Heading</p>
                    <input type="text" value={hdSectionHeading} onChange={e => setHdSectionHeading(e.target.value)} className={inputCls} placeholder="Current Offers" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Subtitle</p>
                    <input type="text" value={hdSectionSub} onChange={e => setHdSectionSub(e.target.value)} className={inputCls} placeholder="Use the code at checkout · Limited stock" />
                  </div>
                </div>
              </div>

              {/* Grid Settings */}
              <div>
                <h2 className="text-base font-semibold text-gray-800 mb-1">Grid Settings</h2>
                <p className="text-xs text-gray-400 mb-4">Layout of the deal cards grid.</p>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
                  <div>
                    <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">Mobile Columns</p>
                    <div className="flex gap-2">
                      {[1, 2].map(n => (
                        <button key={n} type="button" onClick={() => setHdMobileCols(n)}
                          className={`w-12 h-12 text-sm font-semibold border rounded-xl transition-colors ${hdMobileCols === n ? "bg-[#3B5373] text-white border-[#3B5373]" : "border-gray-200 text-gray-500 hover:border-[#3B5373]"}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">Desktop Columns</p>
                    <div className="flex gap-2">
                      {[2, 3, 4, 5, 6].map(n => (
                        <button key={n} type="button" onClick={() => setHdCols(n)}
                          className={`w-12 h-12 text-sm font-semibold border rounded-xl transition-colors ${hdCols === n ? "bg-[#3B5373] text-white border-[#3B5373]" : "border-gray-200 text-gray-500 hover:border-[#3B5373]"}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Card Height (px)</p>
                      <input type="number" min={100} max={600} value={hdCardH} onChange={e => setHdCardH(parseInt(e.target.value) || 280)}
                        className="w-32 border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Gap (px)</p>
                      <input type="number" min={0} max={80} value={hdCardGap} onChange={e => setHdCardGap(parseInt(e.target.value) || 28)}
                        className="w-32 border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg" />
                    </div>
                  </div>
                  <button onClick={saveHdPage} disabled={hdPageSaving}
                    className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                    <Save className="w-4 h-4" />{hdPageSaving ? "Saving…" : "Save Page Settings"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              HOT DEALS — hd-coupons TAB
          ══════════════════════════════════════ */}
          {tab === "hd-coupons" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-800">Coupon Codes</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{coupons.length} coupon{coupons.length !== 1 ? "s" : ""} total · {coupons.filter(c => c.active).length} active</p>
                </div>
                <button
                  onClick={() => setCouponModal({ open: true, mode: "add", data: { discount_type: "percent", active: true, require_phone: false, require_email: false, max_uses_per_user: 1, min_order_value: 0, display_order: coupons.length, uses_count: 0 } })}
                  className="flex items-center gap-2 px-4 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Coupon
                </button>
              </div>

              {/* List */}
              {coupons.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                  <Tag className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">No coupons yet. Add your first one.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {coupons.map(c => (
                    <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-4">
                      {/* Code + title */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-[#3B5373] text-sm tracking-widest">{c.code}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: "#3B5373" }}>
                            {c.discount_type === "percent" ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-0.5 truncate">{c.title}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {c.max_uses_total != null ? `${c.uses_count}/${c.max_uses_total} used` : `${c.uses_count} used`}
                          {c.valid_until && ` · Expires ${new Date(c.valid_until).toLocaleDateString("en-IN")}`}
                        </p>
                      </div>
                      {/* Active toggle */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[11px] text-gray-400">{c.active ? "Active" : "Inactive"}</span>
                        <button onClick={() => toggleCouponActive(c.id, !c.active)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${c.active ? "bg-[#3B5373]" : "bg-gray-200"}`}>
                          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${c.active ? "translate-x-6" : "translate-x-1"}`} />
                        </button>
                      </div>
                      {/* Edit / Delete */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => setCouponModal({ open: true, mode: "edit", data: { ...c } })}
                          className="p-2 text-gray-400 hover:text-[#3B5373] hover:bg-gray-50 rounded-lg transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { if (confirm(`Delete coupon ${c.code}?`)) deleteCoupon(c.id); }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════
              HOT DEALS — hd-stats TAB
          ══════════════════════════════════════ */}
          {tab === "hd-stats" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-800">Usage Stats</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Every time a coupon was used at checkout.</p>
                </div>
                <button onClick={fetchCouponStats}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-[#3B5373] border border-gray-200 rounded-lg transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
              </div>

              {/* Summary cards */}
              {couponStats.length > 0 && (() => {
                const totalUses = couponStats.length;
                const totalDiscount = couponStats.reduce((s, r) => s + (r.discount_applied || 0), 0);
                const totalRevenue = couponStats.reduce((s, r) => s + (r.final_amount || 0), 0);
                return (
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Total Uses", value: String(totalUses), icon: "🏷️" },
                      { label: "Total Discount Given", value: `₹${totalDiscount.toLocaleString("en-IN")}`, icon: "💸" },
                      { label: "Revenue from Coupon Orders", value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: "💰" },
                    ].map(card => (
                      <div key={card.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                        <p className="text-2xl mb-1">{card.icon}</p>
                        <p className="font-bold text-xl text-[#3B5373]">{card.value}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{card.label}</p>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {couponStats.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                  <p className="text-sm text-gray-400">No coupon usage yet.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100">
                          {["Date", "Code", "Customer", "Contact", "Products", "Items", "Order Total", "Discount", "Final"].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {couponStats.map(r => (
                          <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-[11px] text-gray-500 whitespace-nowrap">
                              {new Date(r.used_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                              <br />
                              <span className="text-gray-400">{new Date(r.used_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-mono font-bold text-[#3B5373] text-xs">{r.coupon_code || "—"}</span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">{r.user_name || "—"}</td>
                            <td className="px-4 py-3 text-[11px] text-gray-500">
                              {r.user_phone && <div>{r.user_phone}</div>}
                              {r.user_email && <div className="text-gray-400">{r.user_email}</div>}
                              {!r.user_phone && !r.user_email && "—"}
                            </td>
                            <td className="px-4 py-3 text-[11px] text-gray-600 max-w-[200px]">
                              {r.products_json && r.products_json.length > 0
                                ? r.products_json.map((p, i) => (
                                    <div key={i} className="whitespace-nowrap">{p.name}{p.variant ? ` (${p.variant})` : ""} × {p.qty}</div>
                                  ))
                                : "—"}
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-700 text-center">{r.items_count ?? "—"}</td>
                            <td className="px-4 py-3 text-xs text-gray-700 whitespace-nowrap">
                              {r.order_total != null ? `₹${r.order_total.toLocaleString("en-IN")}` : "—"}
                            </td>
                            <td className="px-4 py-3 text-xs font-semibold text-emerald-600 whitespace-nowrap">
                              {r.discount_applied != null ? `−₹${r.discount_applied.toLocaleString("en-IN")}` : "—"}
                            </td>
                            <td className="px-4 py-3 text-xs font-bold text-[#3B5373] whitespace-nowrap">
                              {r.final_amount != null ? `₹${r.final_amount.toLocaleString("en-IN")}` : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════
              CATEGORIES TAB
          ══════════════════════════════════════ */}
          {tab === "categories" && (
            <div className="space-y-4">
              {/* Style Options */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
                <h3 className="font-semibold text-gray-700 text-sm">Quick Link Style</h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Bold toggle */}
                  <div className="space-y-1.5">
                    <label className={labelCls}>Bold Text</label>
                    <button onClick={() => setSiteSettings(s => ({ ...s, cat_links_bold: s.cat_links_bold === "true" ? "false" : "true" }))}
                      className={`w-10 h-5 rounded-full relative transition-all ${siteSettings.cat_links_bold === "true" ? "bg-[#3B5373]" : "bg-gray-300"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${siteSettings.cat_links_bold === "true" ? "left-5" : "left-0.5"}`} />
                    </button>
                  </div>

                  {/* Text size */}
                  <div className="space-y-1.5">
                    <label className={labelCls}>Text Size (rem)</label>
                    <input type="number" step="0.05" min="0.8" max="2" value={siteSettings.cat_text_size}
                      onChange={e => setSiteSettings(s => ({ ...s, cat_text_size: e.target.value }))}
                      className={inputCls} />
                  </div>

                  {/* Number color */}
                  <div className="space-y-1.5">
                    <label className={labelCls}>Number Color (01, 02…)</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={siteSettings.cat_num_color}
                        onChange={e => setSiteSettings(s => ({ ...s, cat_num_color: e.target.value }))}
                        className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                      <input type="text" value={siteSettings.cat_num_color}
                        onChange={e => setSiteSettings(s => ({ ...s, cat_num_color: e.target.value }))}
                        className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#3B5373]" />
                    </div>
                  </div>

                  {/* Hover BG */}
                  <div className="space-y-1.5">
                    <label className={labelCls}>Hover Background</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={siteSettings.cat_links_hover_bg}
                        onChange={e => setSiteSettings(s => ({ ...s, cat_links_hover_bg: e.target.value }))}
                        className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                      <input type="text" value={siteSettings.cat_links_hover_bg}
                        onChange={e => setSiteSettings(s => ({ ...s, cat_links_hover_bg: e.target.value }))}
                        className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#3B5373]" />
                    </div>
                  </div>

                  {/* Hover text color */}
                  <div className="space-y-1.5">
                    <label className={labelCls}>Hover Text Color</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={siteSettings.cat_links_hover_text}
                        onChange={e => setSiteSettings(s => ({ ...s, cat_links_hover_text: e.target.value }))}
                        className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                      <input type="text" value={siteSettings.cat_links_hover_text}
                        onChange={e => setSiteSettings(s => ({ ...s, cat_links_hover_text: e.target.value }))}
                        className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#3B5373]" />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <div className="px-5 py-3 bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-medium">Preview</div>
                  <div className="grid grid-cols-3 border-t border-gray-100">
                    {["Heels", "Clip-ons", "Collections"].map((name, i) => (
                      <div key={name} className="group flex items-center justify-between px-5 py-4 border-r border-gray-100 last:border-r-0 cursor-pointer transition-all duration-300"
                        style={{ ["--hover-bg" as string]: siteSettings.cat_links_hover_bg } as React.CSSProperties}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = siteSettings.cat_links_hover_bg; (e.currentTarget as HTMLDivElement).querySelectorAll("[data-cat-name]").forEach((el) => { (el as HTMLElement).style.color = siteSettings.cat_links_hover_text; }); }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = ""; (e.currentTarget as HTMLDivElement).querySelectorAll("[data-cat-name]").forEach((el) => { (el as HTMLElement).style.color = ""; }); }}>
                        <div>
                          <p className="text-[9px] tracking-widest uppercase mb-0.5" style={{ color: siteSettings.cat_num_color }}>0{i+1}</p>
                          <p data-cat-name className={`font-serif text-[#1a1a1a] transition-colors`} style={{ fontSize: `${siteSettings.cat_text_size}rem`, fontWeight: siteSettings.cat_links_bold === "true" ? 600 : 400 }}>{name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={async () => {
                  setSettingsSaving(true);
                  await upsertSettings([
                    { key: "cat_links_bold",       value: siteSettings.cat_links_bold },
                    { key: "cat_links_hover_bg",   value: siteSettings.cat_links_hover_bg },
                    { key: "cat_links_hover_text", value: siteSettings.cat_links_hover_text },
                    { key: "cat_num_color",        value: siteSettings.cat_num_color },
                    { key: "cat_text_size",        value: siteSettings.cat_text_size },
                  ]);
                  setSettingsSaving(false);
                }} disabled={settingsSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#3B5373] text-white rounded-xl text-sm font-medium hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                  <Save className="w-4 h-4" />{settingsSaving ? "Saving…" : "Save Style"}
                </button>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Shop by Category</h2>
                  <p className="text-sm text-gray-400 mt-0.5">{siteCategories.length} categories</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={fetchCategories} disabled={categoriesLoading}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-[#3B5373] border border-gray-200 rounded-lg transition-colors">
                    <RefreshCw className={`w-3.5 h-3.5 ${categoriesLoading ? "animate-spin" : ""}`} /> Refresh
                  </button>
                  <button onClick={openAddCategory}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-[#3B5373] text-white rounded-lg text-xs font-medium hover:bg-[#2d3f4f] transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add Category
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {categoriesLoading ? (
                  <div className="p-12 text-center text-gray-400 text-sm">Loading categories…</div>
                ) : siteCategories.length === 0 ? (
                  <div className="p-12 text-center">
                    <Grid3x3 className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No categories found.</p>
                    <p className="text-xs text-gray-300 mt-1">Create the <code className="bg-gray-100 px-1 rounded">site_categories</code> table in Supabase first, then add categories here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          {["Image", "Name", "Slug", "Description", "Order", "Active", "Actions"].map((h) => (
                            <th key={h} className="text-left px-5 py-3.5 text-xs uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {siteCategories.map((c) => (
                          <tr key={c.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-4">
                              {c.image_url ? (
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={c.image_url} alt={c.name} className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                                  <Grid3x3 className="w-5 h-5 text-gray-300" />
                                </div>
                              )}
                            </td>
                            <td className="px-5 py-4">
                              <p className="font-medium text-gray-700 text-sm">{c.name}</p>
                            </td>
                            <td className="px-5 py-4">
                              <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{c.slug}</span>
                            </td>
                            <td className="px-5 py-4">
                              <p className="text-xs text-gray-400 max-w-[180px] truncate">{c.description || "—"}</p>
                            </td>
                            <td className="px-5 py-4 text-xs text-gray-400">{c.display_order}</td>
                            <td className="px-5 py-4">
                              <button
                                onClick={() => toggleCategoryActive(c)}
                                className={`w-9 h-5 rounded-full transition-colors flex-shrink-0 relative ${c.active ? "bg-emerald-500" : "bg-gray-300"}`}
                                title={c.active ? "Deactivate" : "Activate"}
                              >
                                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${c.active ? "left-4" : "left-0.5"}`} />
                              </button>
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-1">
                                <button onClick={() => openManageCategoryProducts(c)}
                                  className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-300 hover:text-blue-500 transition-colors" title="Manage Products">
                                  <Package className="w-4 h-4" />
                                </button>
                                <button onClick={() => openEditCategory(c)}
                                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#3B5373] transition-colors" title="Edit">
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => setDeleteCategoryConfirm(c.id!)}
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors" title="Delete">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              FEATURED PICKS TAB
          ══════════════════════════════════════ */}
          {tab === "featured-picks" && (
            <div className="space-y-5">
              {/* Tab Settings */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <h3 className="font-semibold text-gray-700 text-sm">Section Text & Tabs</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className={labelCls}>Eyebrow</label><input type="text" value={siteSettings.fp_eyebrow} className={inputCls} onChange={e => setSiteSettings(s => ({ ...s, fp_eyebrow: e.target.value }))} /></div>
                  <div><label className={labelCls}>Heading</label><input type="text" value={siteSettings.fp_heading} className={inputCls} onChange={e => setSiteSettings(s => ({ ...s, fp_heading: e.target.value }))} /></div>
                  <div><label className={labelCls}>Heading Italic</label><input type="text" value={siteSettings.fp_heading_italic} className={inputCls} onChange={e => setSiteSettings(s => ({ ...s, fp_heading_italic: e.target.value }))} /></div>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <p className={labelCls + " mb-3"}>Tabs</p>
                  <div className="space-y-3">
                    {([
                      { labelKey: "fp_tab1_label" as const, activeKey: "fp_tab1_active" as const, num: "Tab 1" },
                      { labelKey: "fp_tab2_label" as const, activeKey: "fp_tab2_active" as const, num: "Tab 2" },
                      { labelKey: "fp_tab3_label" as const, activeKey: "fp_tab3_active" as const, num: "Tab 3" },
                    ]).map(({ labelKey, activeKey, num }) => (
                      <div key={num} className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 w-10">{num}</span>
                        <input type="text" value={siteSettings[labelKey]} className={inputCls + " flex-1"}
                          onChange={e => setSiteSettings(s => ({ ...s, [labelKey]: e.target.value }))} />
                        <button onClick={() => setSiteSettings(s => ({ ...s, [activeKey]: s[activeKey] === "true" ? "false" : "true" }))}
                          className={`w-10 h-5 rounded-full relative flex-shrink-0 transition-all ${siteSettings[activeKey] === "true" ? "bg-[#3B5373]" : "bg-gray-300"}`}>
                          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${siteSettings[activeKey] === "true" ? "left-5" : "left-0.5"}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={async () => {
                  setSettingsSaving(true);
                  await upsertSettings([
                    { key: "fp_eyebrow",         value: siteSettings.fp_eyebrow },
                    { key: "fp_heading",          value: siteSettings.fp_heading },
                    { key: "fp_heading_italic",   value: siteSettings.fp_heading_italic },
                    { key: "fp_tab1_label",       value: siteSettings.fp_tab1_label },
                    { key: "fp_tab1_active",      value: siteSettings.fp_tab1_active },
                    { key: "fp_tab2_label",       value: siteSettings.fp_tab2_label },
                    { key: "fp_tab2_active",      value: siteSettings.fp_tab2_active },
                    { key: "fp_tab3_label",       value: siteSettings.fp_tab3_label },
                    { key: "fp_tab3_active",      value: siteSettings.fp_tab3_active },
                  ]);
                  setSettingsSaving(false);
                }} disabled={settingsSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#3B5373] text-white rounded-xl text-sm font-medium hover:bg-[#2d3f4f] disabled:opacity-60 transition-colors">
                  <Save className="w-4 h-4" />{settingsSaving ? "Saving…" : "Save Settings"}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Manage products shown in Latest Styles and Best Sellers sections</p>
                <button onClick={fetchFeaturedPicks} className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-[#3B5373] border border-gray-200 rounded-lg transition-colors">
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {/* Latest Styles Panel */}
                <div className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#3B5373]" />
                      <h2 className="font-semibold text-gray-700 text-sm">Latest Styles</h2>
                      <span className="text-xs bg-[#3B5373]/10 text-[#3B5373] px-2 py-0.5 rounded-full font-medium">{latestProducts.length}</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2 min-h-[200px]">
                    {latestProducts.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-8">No products assigned yet.</p>
                    ) : (
                      latestProducts.map((p) => (
                        <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 group">
                          {p.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.image} alt={p.title} className="w-10 h-10 object-cover rounded flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-800 truncate">{p.title}</p>
                            <p className="text-[11px] text-gray-400">₹{p.price.toLocaleString('en-IN')}</p>
                          </div>
                          <button
                            onClick={async () => {
                              await supabase.from('products').update({ featured_tab: null }).eq('id', p.id);
                              setLatestProducts(prev => prev.filter(x => x.id !== p.id));
                            }}
                            className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => {
                        setFeaturedPicksModal({
                          open: true,
                          tab: 'latest',
                          selectedIds: latestProducts.map(p => p.id!),
                          search: '',
                          saving: false,
                        });
                      }}
                      className="w-full py-2 border border-[#3B5373] text-[#3B5373] text-xs font-medium rounded-lg hover:bg-[#3B5373] hover:text-white transition-colors"
                    >
                      Manage Latest Styles
                    </button>
                  </div>
                </div>

                {/* Best Sellers Panel */}
                <div className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <h2 className="font-semibold text-gray-700 text-sm">Best Sellers</h2>
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{bestSellerProducts.length}</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2 min-h-[200px]">
                    {bestSellerProducts.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-8">No products assigned yet.</p>
                    ) : (
                      bestSellerProducts.map((p) => (
                        <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 group">
                          {p.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.image} alt={p.title} className="w-10 h-10 object-cover rounded flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-800 truncate">{p.title}</p>
                            <p className="text-[11px] text-gray-400">₹{p.price.toLocaleString('en-IN')}</p>
                          </div>
                          <button
                            onClick={async () => {
                              await supabase.from('products').update({ featured_tab: null }).eq('id', p.id);
                              setBestSellerProducts(prev => prev.filter(x => x.id !== p.id));
                            }}
                            className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => {
                        setFeaturedPicksModal({
                          open: true,
                          tab: 'bestseller',
                          selectedIds: bestSellerProducts.map(p => p.id!),
                          search: '',
                          saving: false,
                        });
                      }}
                      className="w-full py-2 border border-amber-400 text-amber-600 text-xs font-medium rounded-lg hover:bg-amber-50 transition-colors"
                    >
                      Manage Best Sellers
                    </button>
                  </div>
                </div>

                {/* On Sale Panel */}
                <div className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden col-span-2 md:col-span-1">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-red-500" />
                      <h2 className="font-semibold text-gray-700 text-sm">On Sale</h2>
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">{saleProducts.length}</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2 min-h-[200px]">
                    {saleProducts.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-8">No products assigned yet.</p>
                    ) : (
                      saleProducts.map((p) => (
                        <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 group">
                          {p.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.image} alt={p.title} className="w-10 h-10 object-cover rounded flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-800 truncate">{p.title}</p>
                            <p className="text-[11px] text-gray-400">₹{p.price.toLocaleString('en-IN')}</p>
                          </div>
                          <button onClick={async () => {
                            await supabase.from('products').update({ featured_tab: null }).eq('id', p.id);
                            setSaleProducts(prev => prev.filter(x => x.id !== p.id));
                          }} className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100" title="Remove">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-4 pb-4">
                    <button onClick={() => setFeaturedPicksModal({ open: true, tab: 'sale', selectedIds: saleProducts.map(p => p.id!), search: '', saving: false })}
                      className="w-full py-2 border border-red-300 text-red-500 text-xs font-medium rounded-lg hover:bg-red-50 transition-colors">
                      Manage On Sale
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              ANNOUNCEMENT TAB
          ══════════════════════════════════════ */}
          {tab === "announcement" && (
            <div className="max-w-2xl space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#3B5373]" />
                  <h2 className="font-semibold text-gray-700">Announcement Bar</h2>
                </div>
                {settingsLoading ? <p className="text-gray-400 text-sm">Loading…</p> : (
                  <>
                    {/* Mode */}
                    <div>
                      <label className={labelCls}>Display Mode</label>
                      <div className="flex gap-3 mt-1">
                        {(["rotate","scroll"] as const).map(m => (
                          <button key={m} onClick={() => setSiteSettings(s => ({ ...s, announcement_mode: m }))}
                            className={`px-5 py-2.5 rounded-xl text-sm font-medium border transition-all ${siteSettings.announcement_mode === m ? "bg-[#3B5373] text-white border-[#3B5373]" : "bg-white text-gray-600 border-gray-200 hover:border-[#3B5373]"}`}>
                            {m === "rotate" ? "🔄 Rotate / Blink" : "📜 Scroll (Ticker)"}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-1.5">
                        {siteSettings.announcement_mode === "scroll" ? "All messages scroll left continuously like a ticker" : "One message at a time — fades in/out every few seconds"}
                      </p>
                    </div>
                    {/* Speed */}
                    <div>
                      <label className={labelCls}>{siteSettings.announcement_mode === "scroll" ? "Scroll Speed" : "Rotation Speed"}</label>
                      <select value={announcementSpeed} onChange={(e) => setAnnouncementSpeed(e.target.value)} className={`${inputCls} max-w-[200px]`}>
                        <option value="40">🐢 Slow (40s)</option>
                        <option value="25">🚶 Normal (25s)</option>
                        <option value="15">🚀 Fast (15s)</option>
                      </select>
                    </div>
                    {/* Messages */}
                    <div>
                      <label className={labelCls}>Messages (up to 6)</label>
                      <div className="space-y-2 mt-1">
                        {announcementList.map((text, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <span className="text-xs font-medium text-gray-400 w-5 flex-shrink-0 text-center">{i + 1}.</span>
                            <input type="text" value={text} className={`${inputCls} flex-1`}
                              placeholder={i === 0 ? "✦ Welcome to Classie — One Heel. Endless Looks." : i === 1 ? "Use code FIRST10 for 10% OFF!" : "🚢 Free Shipping above ₹999"}
                              onChange={(e) => { const n = [...announcementList]; n[i] = e.target.value; setAnnouncementList(n); }} />
                            <button onClick={() => { const n = announcementList.filter((_,j) => j !== i); setAnnouncementList(n.length === 0 ? [""] : n); }}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      {announcementList.length < 6 && (
                        <button onClick={() => setAnnouncementList(p => [...p, ""])} className="mt-2 flex items-center gap-1.5 text-xs text-[#3B5373] hover:underline">
                          <Plus className="w-3.5 h-3.5" /> Add More
                        </button>
                      )}
                    </div>
                    <button onClick={saveAnnouncements} disabled={settingsSaving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-[#3B5373] text-white rounded-xl text-sm font-medium hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                      <Save className="w-4 h-4" />
                      {settingsSaving ? "Saving…" : "Save Announcements"}
                    </button>
                  </>
                )}
              </div>

              {/* ── Logo ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#3B5373]" />
                  <h2 className="font-semibold text-gray-700">Logo</h2>
                </div>
                <div>
                  <label className={labelCls}>Logo Image URL</label>
                  <input type="text" value={siteSettings.logo_image_url} className={inputCls}
                    onChange={(e) => setSiteSettings((s) => ({ ...s, logo_image_url: e.target.value }))}
                    placeholder="https://res.cloudinary.com/…" />
                </div>
                {siteSettings.logo_image_url && (
                  <div className="border border-gray-100 rounded-xl p-3 inline-block bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={siteSettings.logo_image_url} alt="Logo preview" className="h-10 object-contain" />
                  </div>
                )}
                <button onClick={async () => {
                  setSettingsSaving(true);
                  await upsertSettings([{ key: "logo_image_url", value: siteSettings.logo_image_url }]);
                  setSettingsSaving(false);
                }} disabled={settingsSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#3B5373] text-white rounded-xl text-sm font-medium hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                  <Save className="w-4 h-4" />
                  {settingsSaving ? "Saving…" : "Save Logo"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              PHILOSOPHY TAB
          ══════════════════════════════════════ */}
          {tab === "philosophy" && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <h2 className="font-semibold text-gray-700">Philosophy Section</h2>
                <div>
                  <label className={labelCls}>Eyebrow Text</label>
                  <input type="text" value={siteSettings.philosophy_eyebrow} className={inputCls}
                    onChange={(e) => setSiteSettings((s) => ({ ...s, philosophy_eyebrow: e.target.value }))}
                    placeholder="e.g. Our Philosophy" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className={labelCls}>Heading Line 1</label>
                    <input type="text" value={siteSettings.philosophy_headline} className={inputCls}
                      onChange={e => setSiteSettings(s => ({ ...s, philosophy_headline: e.target.value }))} placeholder="One Heel." />
                  </div>
                  <div><label className={labelCls}>Italic Word (navy)</label>
                    <input type="text" value={siteSettings.philosophy_headline_italic} className={inputCls}
                      onChange={e => setSiteSettings(s => ({ ...s, philosophy_headline_italic: e.target.value }))} placeholder="Endless" />
                  </div>
                  <div><label className={labelCls}>Heading Line 2</label>
                    <input type="text" value={siteSettings.philosophy_headline2} className={inputCls}
                      onChange={e => setSiteSettings(s => ({ ...s, philosophy_headline2: e.target.value }))} placeholder="Possibilities." />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Body Text</label>
                  <textarea value={siteSettings.philosophy_body} rows={4}
                    className={`${inputCls} resize-none`}
                    onChange={(e) => setSiteSettings((s) => ({ ...s, philosophy_body: e.target.value }))}
                    placeholder="Describe your brand philosophy…" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>CTA Button Text</label>
                    <input type="text" value={siteSettings.philosophy_cta_text} className={inputCls}
                      onChange={(e) => setSiteSettings((s) => ({ ...s, philosophy_cta_text: e.target.value }))}
                      placeholder="e.g. Our Story" />
                  </div>
                  <div>
                    <label className={labelCls}>CTA Button URL</label>
                    <input type="text" value={siteSettings.philosophy_cta_url} className={inputCls}
                      onChange={(e) => setSiteSettings((s) => ({ ...s, philosophy_cta_url: e.target.value }))}
                      placeholder="e.g. /about" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Image URL <span className="normal-case text-gray-400 font-normal">(leave empty to hide image)</span></label>
                  <input type="text" value={siteSettings.philosophy_image_url} className={inputCls}
                    onChange={(e) => setSiteSettings((s) => ({ ...s, philosophy_image_url: e.target.value }))}
                    placeholder="https://cdn.shopify.com/…/image.jpg" />
                  {siteSettings.philosophy_image_url && (
                    <div className="mt-3 relative w-40 h-24 overflow-hidden border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={siteSettings.philosophy_image_url} alt="Philosophy preview" className="w-full h-full object-cover object-center" />
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <p className={labelCls + " text-sm font-semibold text-gray-700"}>Stats (leave empty to hide)</p>
                  {([
                    { nKey: "phil_stat1_number" as const, lKey: "phil_stat1_label" as const },
                    { nKey: "phil_stat2_number" as const, lKey: "phil_stat2_label" as const },
                    { nKey: "phil_stat3_number" as const, lKey: "phil_stat3_label" as const },
                  ]).map(({ nKey, lKey }, i) => (
                    <div key={i} className="grid grid-cols-2 gap-3">
                      <div><label className={labelCls}>Stat {i+1} Number</label>
                        <input type="text" value={siteSettings[nKey]} className={inputCls} onChange={e => setSiteSettings(s => ({ ...s, [nKey]: e.target.value }))} placeholder="10K+" />
                      </div>
                      <div><label className={labelCls}>Stat {i+1} Label</label>
                        <input type="text" value={siteSettings[lKey]} className={inputCls} onChange={e => setSiteSettings(s => ({ ...s, [lKey]: e.target.value }))} placeholder="Happy Customers" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-4">
                  <p className={labelCls + " text-sm font-semibold text-gray-700"}>2 Feature Points</p>
                  {([
                    { tKey: "phil_f1_title" as const, dKey: "phil_f1_desc" as const, num: "1" },
                    { tKey: "phil_f2_title" as const, dKey: "phil_f2_desc" as const, num: "2" },
                  ]).map(({ tKey, dKey, num }) => (
                    <div key={num} className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl">
                      <div><label className={labelCls}>Feature {num} Title</label>
                        <input type="text" value={siteSettings[tKey]} className={inputCls} onChange={e => setSiteSettings(s => ({ ...s, [tKey]: e.target.value }))} />
                      </div>
                      <div><label className={labelCls}>Feature {num} Description</label>
                        <input type="text" value={siteSettings[dKey]} className={inputCls} onChange={e => setSiteSettings(s => ({ ...s, [dKey]: e.target.value }))} />
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={savePhilosophy} disabled={settingsSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#3B5373] text-white rounded-xl text-sm font-medium hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                  <Save className="w-4 h-4" />
                  {settingsSaving ? "Saving…" : "Save Philosophy"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              TRUST BAND TAB
          ══════════════════════════════════════ */}
          {tab === "trust-band" && (
            <div className="space-y-6 max-w-3xl">
              {/* Features Bar Manager */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[#3B5373]" />
                    <h2 className="font-semibold text-gray-700">Trust Band Items</h2>
                    <span className="text-xs text-gray-400 font-normal">(icon + text scrolling in navy bar)</span>
                  </div>
                  <button onClick={openAddFeature}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#3B5373] text-white rounded-xl text-sm font-medium hover:bg-[#2d3f4f] transition-colors">
                    <Plus className="w-4 h-4" /> Add Feature
                  </button>
                </div>
                {featuresBarLoading ? <p className="text-gray-400 text-sm">Loading…</p> : (
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-gray-100">
                      {["Icon","Title","Subtitle","Order","Active","Actions"].map(h => (
                        <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {featuresBarItems.map((f: FeatureBarItem) => (
                        <tr key={f.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-3 py-3 text-xl">{f.icon}</td>
                          <td className="px-3 py-3 font-medium text-gray-800">{f.title}</td>
                          <td className="px-3 py-3 text-xs text-gray-400">{f.subtitle || "—"}</td>
                          <td className="px-3 py-3 text-xs text-gray-500">{f.display_order}</td>
                          <td className="px-3 py-3">
                            <button onClick={() => toggleFeatureActive(f)}
                              className={`w-10 h-5 rounded-full transition-all ${f.active ? "bg-green-500" : "bg-gray-300"} relative`}>
                              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${f.active ? "left-5" : "left-0.5"}`} />
                            </button>
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex gap-2">
                              <button onClick={() => openEditFeature(f)} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-500"><Pencil className="w-4 h-4" /></button>
                              <button onClick={() => deleteFeature(f.id!)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              SETTINGS TAB
          ══════════════════════════════════════ */}
          {tab === "settings" && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">

              {/* ── Other Settings ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <h2 className="font-semibold text-gray-700">Other Settings</h2>
                <div>
                  <label className={labelCls}>WhatsApp Number</label>
                  <input
                    type="text" value={siteSettings.whatsapp_number} className={inputCls}
                    onChange={(e) => setSiteSettings((s) => ({ ...s, whatsapp_number: e.target.value }))}
                    placeholder="e.g. 919876543210"
                  />
                </div>
                <div>
                  <label className={labelCls}>Instagram URL</label>
                  <input
                    type="text" value={siteSettings.instagram_url} className={inputCls}
                    onChange={(e) => setSiteSettings((s) => ({ ...s, instagram_url: e.target.value }))}
                    placeholder="e.g. https://instagram.com/classie.in"
                  />
                </div>
                <button
                  onClick={saveSettings} disabled={settingsSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#3B5373] text-white rounded-xl text-sm font-medium hover:bg-[#2d3f4f] transition-colors disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  {settingsSaving ? "Saving…" : "Save Settings"}
                </button>
              </div>

              {/* Philosophy moved to Homepage → Philosophy tab */}
              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4 text-sm text-blue-700">
                Philosophy section settings have moved to <strong>Homepage → Philosophy tab</strong>.
                <div>
                  <label className={labelCls}>Eyebrow Text</label>
                  <input
                    type="text" value={siteSettings.philosophy_eyebrow} className={inputCls}
                    onChange={(e) => setSiteSettings((s) => ({ ...s, philosophy_eyebrow: e.target.value }))}
                    placeholder="e.g. Our Philosophy"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className={labelCls}>Heading Line 1</label>
                    <input type="text" value={siteSettings.philosophy_headline} className={inputCls}
                      onChange={e => setSiteSettings(s => ({ ...s, philosophy_headline: e.target.value }))} placeholder="One Heel." />
                  </div>
                  <div><label className={labelCls}>Italic Word (navy)</label>
                    <input type="text" value={siteSettings.philosophy_headline_italic} className={inputCls}
                      onChange={e => setSiteSettings(s => ({ ...s, philosophy_headline_italic: e.target.value }))} placeholder="Endless" />
                  </div>
                  <div><label className={labelCls}>Heading Line 2</label>
                    <input type="text" value={siteSettings.philosophy_headline2} className={inputCls}
                      onChange={e => setSiteSettings(s => ({ ...s, philosophy_headline2: e.target.value }))} placeholder="Possibilities." />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Body Text</label>
                  <textarea
                    value={siteSettings.philosophy_body} rows={4}
                    className={`${inputCls} resize-none`}
                    onChange={(e) => setSiteSettings((s) => ({ ...s, philosophy_body: e.target.value }))}
                    placeholder="Describe your brand philosophy…"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>CTA Button Text</label>
                    <input
                      type="text" value={siteSettings.philosophy_cta_text} className={inputCls}
                      onChange={(e) => setSiteSettings((s) => ({ ...s, philosophy_cta_text: e.target.value }))}
                      placeholder="e.g. Our Story"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>CTA Button URL</label>
                    <input
                      type="text" value={siteSettings.philosophy_cta_url} className={inputCls}
                      onChange={(e) => setSiteSettings((s) => ({ ...s, philosophy_cta_url: e.target.value }))}
                      placeholder="e.g. /about"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Image URL <span className="normal-case text-gray-400 font-normal">(leave empty to hide image)</span></label>
                  <input
                    type="text" value={siteSettings.philosophy_image_url} className={inputCls}
                    onChange={(e) => setSiteSettings((s) => ({ ...s, philosophy_image_url: e.target.value }))}
                    placeholder="https://cdn.shopify.com/…/image.jpg"
                  />
                  {siteSettings.philosophy_image_url && (
                    <div className="mt-3 relative w-40 h-24 overflow-hidden border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={siteSettings.philosophy_image_url} alt="Philosophy preview" className="w-full h-full object-cover object-center" />
                    </div>
                  )}
                </div>
                {/* Stats */}
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <p className={labelCls + " text-sm font-semibold text-gray-700"}>Stats (leave empty to hide)</p>
                  {([
                    { nKey: "phil_stat1_number" as const, lKey: "phil_stat1_label" as const },
                    { nKey: "phil_stat2_number" as const, lKey: "phil_stat2_label" as const },
                    { nKey: "phil_stat3_number" as const, lKey: "phil_stat3_label" as const },
                  ]).map(({ nKey, lKey }, i) => (
                    <div key={i} className="grid grid-cols-2 gap-3">
                      <div><label className={labelCls}>Stat {i+1} Number</label>
                        <input type="text" value={siteSettings[nKey]} className={inputCls} onChange={e => setSiteSettings(s => ({ ...s, [nKey]: e.target.value }))} placeholder="10K+" />
                      </div>
                      <div><label className={labelCls}>Stat {i+1} Label</label>
                        <input type="text" value={siteSettings[lKey]} className={inputCls} onChange={e => setSiteSettings(s => ({ ...s, [lKey]: e.target.value }))} placeholder="Happy Customers" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Feature Items */}
                <div className="border-t border-gray-100 pt-4 space-y-4">
                  <p className={labelCls + " text-sm font-semibold text-gray-700"}>2 Feature Points</p>
                  {([
                    { tKey: "phil_f1_title" as const, dKey: "phil_f1_desc" as const, num: "1" },
                    { tKey: "phil_f2_title" as const, dKey: "phil_f2_desc" as const, num: "2" },

                  ]).map(({ tKey, dKey, num }) => (
                    <div key={num} className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-xl">
                      <div><label className={labelCls}>Feature {num} Title</label>
                        <input type="text" value={siteSettings[tKey]} className={inputCls} onChange={e => setSiteSettings(s => ({ ...s, [tKey]: e.target.value }))} />
                      </div>
                      <div><label className={labelCls}>Feature {num} Description</label>
                        <input type="text" value={siteSettings[dKey]} className={inputCls} onChange={e => setSiteSettings(s => ({ ...s, [dKey]: e.target.value }))} />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={savePhilosophy} disabled={settingsSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#3B5373] text-white rounded-xl text-sm font-medium hover:bg-[#2d3f4f] transition-colors disabled:opacity-60"
                >
                  <Save className="w-4 h-4" />
                  {settingsSaving ? "Saving…" : "Save Philosophy"}
                </button>
              </div>

            </div>
          )}

          {/* ══════════════════════════════════════
              FOOTER TAB
          ══════════════════════════════════════ */}
          {tab === "footer" && (
            <div className="space-y-6 max-w-4xl">

              {/* Brand */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Layout className="w-4 h-4 text-[#3B5373]" />
                  <h2 className="font-semibold text-gray-700">Brand</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Logo URL <span className="normal-case text-gray-400 font-normal">(leave empty for ✦ CLASSIE text)</span></label>
                    <input type="text" value={siteSettings.footer_logo_url} className={inputCls}
                      onChange={(e) => setSiteSettings((s) => ({ ...s, footer_logo_url: e.target.value }))}
                      placeholder="https://cdn.example.com/logo.png" />
                  </div>
                  <div>
                    <label className={labelCls}>Tagline (italic serif)</label>
                    <input type="text" value={siteSettings.footer_tagline} className={inputCls}
                      onChange={(e) => setSiteSettings((s) => ({ ...s, footer_tagline: e.target.value }))}
                      placeholder="One Heel. Endless Looks." />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>Description</label>
                    <textarea rows={2} value={siteSettings.footer_desc} className={`${inputCls} resize-none`}
                      onChange={(e) => setSiteSettings((s) => ({ ...s, footer_desc: e.target.value }))}
                      placeholder="Premium heels crafted for the modern woman." />
                  </div>
                  <div>
                    <label className={labelCls}>Instagram URL</label>
                    <input type="text" value={siteSettings.footer_ig_url} className={inputCls}
                      onChange={(e) => setSiteSettings((s) => ({ ...s, footer_ig_url: e.target.value }))}
                      placeholder="https://www.instagram.com/_classie_in/" />
                  </div>
                  <div>
                    <label className={labelCls}>TikTok URL</label>
                    <input type="text" value={siteSettings.footer_tiktok_url} className={inputCls}
                      onChange={(e) => setSiteSettings((s) => ({ ...s, footer_tiktok_url: e.target.value }))}
                      placeholder="https://www.tiktok.com/@classie_in" />
                  </div>
                  <div>
                    <label className={labelCls}>Facebook URL</label>
                    <input type="text" value={siteSettings.footer_fb_url} className={inputCls}
                      onChange={(e) => setSiteSettings((s) => ({ ...s, footer_fb_url: e.target.value }))}
                      placeholder="https://www.facebook.com/classie.co.in" />
                  </div>
                  <div>
                    <label className={labelCls}>Pinterest URL</label>
                    <input type="text" value={siteSettings.footer_pinterest_url} className={inputCls}
                      onChange={(e) => setSiteSettings((s) => ({ ...s, footer_pinterest_url: e.target.value }))}
                      placeholder="https://pinterest.com/classie_in" />
                  </div>
                  <div>
                    <label className={labelCls}>WhatsApp URL</label>
                    <input type="text" value={siteSettings.footer_whatsapp_url} className={inputCls}
                      onChange={(e) => setSiteSettings((s) => ({ ...s, footer_whatsapp_url: e.target.value }))}
                      placeholder="https://wa.me/919999999999" />
                  </div>
                  <p className="text-[11px] text-gray-400">Leave any field empty to hide that icon in footer</p>
                </div>
              </div>

              {/* Link Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* SHOP */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                  <div>
                    <label className={labelCls}>Shop Column Heading</label>
                    <input type="text" value={siteSettings.footer_shop_heading} className={inputCls}
                      onChange={(e) => setSiteSettings((s) => ({ ...s, footer_shop_heading: e.target.value }))}
                      placeholder="SHOP" />
                  </div>
                  <p className={labelCls}>Links</p>
                  {footerShopLinks.map((link, i) => (
                    <div key={i} className="flex gap-1.5">
                      <input type="text" value={link.text} placeholder="Text"
                        className={`${inputCls} flex-1`}
                        onChange={(e) => { const n = [...footerShopLinks]; n[i] = { ...n[i], text: e.target.value }; setFooterShopLinks(n); }} />
                      <input type="text" value={link.url} placeholder="/url"
                        className={`${inputCls} flex-1`}
                        onChange={(e) => { const n = [...footerShopLinks]; n[i] = { ...n[i], url: e.target.value }; setFooterShopLinks(n); }} />
                    </div>
                  ))}
                </div>

                {/* HELP */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                  <div>
                    <label className={labelCls}>Help Column Heading</label>
                    <input type="text" value={siteSettings.footer_help_heading} className={inputCls}
                      onChange={(e) => setSiteSettings((s) => ({ ...s, footer_help_heading: e.target.value }))}
                      placeholder="HELP" />
                  </div>
                  <p className={labelCls}>Links</p>
                  {footerHelpLinks.map((link, i) => (
                    <div key={i} className="flex gap-1.5">
                      <input type="text" value={link.text} placeholder="Text"
                        className={`${inputCls} flex-1`}
                        onChange={(e) => { const n = [...footerHelpLinks]; n[i] = { ...n[i], text: e.target.value }; setFooterHelpLinks(n); }} />
                      <input type="text" value={link.url} placeholder="/url"
                        className={`${inputCls} flex-1`}
                        onChange={(e) => { const n = [...footerHelpLinks]; n[i] = { ...n[i], url: e.target.value }; setFooterHelpLinks(n); }} />
                    </div>
                  ))}
                </div>

                {/* COMPANY */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                  <div>
                    <label className={labelCls}>Company Column Heading</label>
                    <input type="text" value={siteSettings.footer_company_heading} className={inputCls}
                      onChange={(e) => setSiteSettings((s) => ({ ...s, footer_company_heading: e.target.value }))}
                      placeholder="COMPANY" />
                  </div>
                  <p className={labelCls}>Links</p>
                  {footerCompanyLinks.map((link, i) => (
                    <div key={i} className="flex gap-1.5">
                      <input type="text" value={link.text} placeholder="Text"
                        className={`${inputCls} flex-1`}
                        onChange={(e) => { const n = [...footerCompanyLinks]; n[i] = { ...n[i], text: e.target.value }; setFooterCompanyLinks(n); }} />
                      <input type="text" value={link.url} placeholder="/url"
                        className={`${inputCls} flex-1`}
                        onChange={(e) => { const n = [...footerCompanyLinks]; n[i] = { ...n[i], url: e.target.value }; setFooterCompanyLinks(n); }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom bar */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h2 className="font-semibold text-gray-700 text-sm">Bottom Bar</h2>
                <div>
                  <label className={labelCls}>Copyright Text</label>
                  <input type="text" value={siteSettings.footer_copyright} className={inputCls}
                    onChange={(e) => setSiteSettings((s) => ({ ...s, footer_copyright: e.target.value }))}
                    placeholder={`© ${new Date().getFullYear()} Classie. All rights reserved.`} />
                </div>
                <p className="text-xs text-gray-400">Payment badges (Visa, Mastercard, UPI, COD, Net Banking) are shown automatically.</p>
              </div>

              {/* Save button */}
              <div>
                <button onClick={saveFooter} disabled={settingsSaving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#3B5373] text-white rounded-xl text-sm font-medium hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                  <Save className="w-4 h-4" />
                  {settingsSaving ? "Saving…" : "Save Footer"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              MESSAGES TAB
          ══════════════════════════════════════ */}
          {tab === "messages" && (
            <div className="space-y-4">
              <div className="flex gap-2 items-center">
                {([
                  { id: "messages", label: `Contact Messages (${messages.length})`, icon: Mail },
                  { id: "newsletter", label: `Newsletter (${subscribers.length})`, icon: Users },
                ] as const).map(({ id, label, icon: Icon }) => (
                  <button
                    key={id} onClick={() => setMsgSubTab(id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      msgSubTab === id ? "bg-[#3B5373] text-white" : "bg-white text-gray-500 border border-gray-200 hover:border-[#3B5373]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />{label}
                  </button>
                ))}
                <button
                  onClick={() => { fetchMessages(); fetchSubscribers(); }}
                  className="ml-auto flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-[#3B5373] border border-gray-200 rounded-xl transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${messagesLoading || subsLoading ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>

              {msgSubTab === "messages" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {messagesLoading ? (
                    <div className="p-12 text-center text-gray-400 text-sm">Loading messages…</div>
                  ) : messages.length === 0 ? (
                    <div className="p-12 text-center">
                      <Mail className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">No contact messages yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50">
                            {["Name","Email","Message","Date"].map((h) => (
                              <th key={h} className="text-left px-5 py-3.5 text-xs uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {messages.map((m) => (
                            <tr key={m.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                              <td className="px-5 py-4 font-medium text-gray-700">{m.name}</td>
                              <td className="px-5 py-4 text-xs text-gray-400">{m.email}</td>
                              <td className="px-5 py-4 text-xs text-gray-500 max-w-[300px]">
                                <p className="line-clamp-2">{m.message}</p>
                              </td>
                              <td className="px-5 py-4 text-xs text-gray-400">
                                {new Date(m.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {msgSubTab === "newsletter" && (
                <div className="space-y-4">
                {/* Newsletter Section Text Controls */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                  <h2 className="font-semibold text-gray-700">Newsletter Section Text</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls}>Eyebrow</label>
                      <input type="text" value={siteSettings.nl_eyebrow} className={inputCls}
                        onChange={e => setSiteSettings(s => ({ ...s, nl_eyebrow: e.target.value }))} placeholder="STAY CONNECTED" />
                    </div>
                    <div><label className={labelCls}>Heading (italic last word)</label>
                      <div className="flex gap-2">
                        <input type="text" value={siteSettings.nl_heading} className={inputCls}
                          onChange={e => setSiteSettings(s => ({ ...s, nl_heading: e.target.value }))} placeholder="Be the First to" />
                        <input type="text" value={siteSettings.nl_heading_italic} className={inputCls}
                          onChange={e => setSiteSettings(s => ({ ...s, nl_heading_italic: e.target.value }))} placeholder="Know" />
                      </div>
                    </div>
                    <div className="col-span-2"><label className={labelCls}>Subtext</label>
                      <input type="text" value={siteSettings.nl_subtext} className={inputCls}
                        onChange={e => setSiteSettings(s => ({ ...s, nl_subtext: e.target.value }))} placeholder="New arrivals and exclusive edits…" />
                    </div>
                    <div><label className={labelCls}>Placeholder Text</label>
                      <input type="text" value={siteSettings.nl_placeholder} className={inputCls}
                        onChange={e => setSiteSettings(s => ({ ...s, nl_placeholder: e.target.value }))} placeholder="Your email address" />
                    </div>
                    <div><label className={labelCls}>Button Text</label>
                      <input type="text" value={siteSettings.nl_btn_text} className={inputCls}
                        onChange={e => setSiteSettings(s => ({ ...s, nl_btn_text: e.target.value }))} placeholder="Subscribe" />
                    </div>
                    <div className="col-span-2"><label className={labelCls}>Success Message</label>
                      <input type="text" value={siteSettings.nl_success_text} className={inputCls}
                        onChange={e => setSiteSettings(s => ({ ...s, nl_success_text: e.target.value }))} placeholder="✓ You're on the list." />
                    </div>
                  </div>
                  <button onClick={saveNewsletterSettings} disabled={settingsSaving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#3B5373] text-white rounded-xl text-sm font-medium hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                    <Save className="w-4 h-4" />{settingsSaving ? "Saving…" : "Save Newsletter Text"}
                  </button>
                </div>

                {/* Subscribers List */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {subsLoading ? (
                    <div className="p-12 text-center text-gray-400 text-sm">Loading subscribers…</div>
                  ) : subscribers.length === 0 ? (
                    <div className="p-12 text-center">
                      <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">No subscribers yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50">
                            {["#","Email","Subscribed On"].map((h) => (
                              <th key={h} className="text-left px-5 py-3.5 text-xs uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {subscribers.map((s, i) => (
                            <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                              <td className="px-5 py-4 text-xs text-gray-400">{i + 1}</td>
                              <td className="px-5 py-4 font-medium text-gray-700">{s.email}</td>
                              <td className="px-5 py-4 text-xs text-gray-400">
                                {new Date(s.subscribed_at ?? s.created_at ?? "").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                </div>
              )}
            </div>
          )}

          {/* ══ TESTIMONIALS TAB ══════════════════════════════════════════ */}
          {tab === "testimonials" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Customer Reviews</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{testimonials.length} reviews</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={fetchTestimonials} disabled={testimonialsLoading}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-400 hover:text-[#3B5373] border border-gray-200 rounded-xl transition-colors">
                    <RefreshCw className={`w-3.5 h-3.5 ${testimonialsLoading ? "animate-spin" : ""}`} />Refresh
                  </button>
                  <button onClick={() => setTestimonialModal({ open: true, mode: "add", data: { ...EMPTY_TESTIMONIAL } })}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#3B5373] text-white rounded-xl text-xs font-medium hover:bg-[#2d3f4f] transition-colors">
                    <Plus className="w-3.5 h-3.5" />Add Review
                  </button>
                </div>
              </div>
              {testimonialsLoading ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 text-sm">Loading…</div>
              ) : testimonials.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <Star className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No reviews yet. Add your first review!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimonials.map(t => (
                    <div key={t.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{t.customer_name}</p>
                          {t.location && <p className="text-xs text-gray-400">{t.location}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${t.active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                            {t.active ? "Active" : "Hidden"}
                          </span>
                          <button onClick={() => setTestimonialModal({ open: true, mode: "edit", data: { ...t } })}
                            className="p-1.5 text-gray-400 hover:text-[#3B5373] hover:bg-gray-50 rounded-lg transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteTestimonialConfirm(t.id!)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="text-[#3B5373] text-xs mb-2">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
                      <p className="text-sm text-gray-600 italic leading-relaxed">&quot;{t.review_text}&quot;</p>
                    </div>
                  ))}
                </div>
              )}
              {deleteTestimonialConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                  <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
                    <p className="font-semibold text-gray-800 mb-2">Delete Review?</p>
                    <p className="text-sm text-gray-500 mb-6">This cannot be undone.</p>
                    <div className="flex gap-3 justify-center">
                      <button onClick={() => setDeleteTestimonialConfirm(null)} className="px-5 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
                      <button onClick={async () => {
                        await supabase.from("testimonials").delete().eq("id", deleteTestimonialConfirm);
                        setDeleteTestimonialConfirm(null);
                        await fetchTestimonials();
                      }} className="px-5 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600">Delete</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ INSTAGRAM TAB ══════════════════════════════════════════════ */}
          {tab === "instagram" && (
            <div className="space-y-6">

              {/* Section Header Settings */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <h2 className="font-semibold text-gray-700">Section Header & Link</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className={labelCls}>Handle (shown above heading)</label>
                    <input type="text" value={siteSettings.ig_handle} className={inputCls}
                      onChange={e => setSiteSettings(s => ({ ...s, ig_handle: e.target.value }))} placeholder="@classie_in" />
                  </div>
                  <div><label className={labelCls}>Section Heading (last word = italic)</label>
                    <input type="text" value={siteSettings.ig_heading} className={inputCls}
                      onChange={e => setSiteSettings(s => ({ ...s, ig_heading: e.target.value }))} placeholder="Style Inspo" />
                  </div>
                  <div><label className={labelCls}>Subtext</label>
                    <input type="text" value={siteSettings.ig_subtext} className={inputCls}
                      onChange={e => setSiteSettings(s => ({ ...s, ig_subtext: e.target.value }))} placeholder="Tag us to be featured" />
                  </div>
                  <div><label className={labelCls}>Follow Button Text</label>
                    <input type="text" value={siteSettings.ig_follow_text} className={inputCls}
                      onChange={e => setSiteSettings(s => ({ ...s, ig_follow_text: e.target.value }))} placeholder="Follow @classie_in →" />
                  </div>
                </div>
                <div><label className={labelCls}>Follow Button URL</label>
                  <input type="url" value={siteSettings.ig_follow_url} className={inputCls}
                    onChange={e => setSiteSettings(s => ({ ...s, ig_follow_url: e.target.value }))} placeholder="https://www.instagram.com/..." />
                </div>
                <button onClick={saveInstagramSettings} disabled={settingsSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#3B5373] text-white rounded-xl text-sm font-medium hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                  <Save className="w-4 h-4" />
                  {settingsSaving ? "Saving…" : "Save Section Settings"}
                </button>
              </div>

              {/* Images list */}
              <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Instagram Feed Images</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{instagramImages.length} images (4 shown on homepage)</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={fetchInstagramImages} disabled={instagramLoading}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-400 hover:text-[#3B5373] border border-gray-200 rounded-xl transition-colors">
                    <RefreshCw className={`w-3.5 h-3.5 ${instagramLoading ? "animate-spin" : ""}`} />Refresh
                  </button>
                  <button onClick={() => setInstagramModal({ open: true, mode: "add", data: { ...EMPTY_INSTAGRAM } })}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#3B5373] text-white rounded-xl text-xs font-medium hover:bg-[#2d3f4f] transition-colors">
                    <Plus className="w-3.5 h-3.5" />Add Image
                  </button>
                </div>
              </div>
              {instagramLoading ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 text-sm">Loading…</div>
              ) : instagramImages.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <Camera className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No images yet. Add Instagram images to show on homepage!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {instagramImages.map((img, idx) => (
                    <div key={img.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                      <div className="relative aspect-square bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {img.image_url ? <img src={img.image_url} alt="Instagram" className="w-full h-full object-cover" /> :
                          <div className="w-full h-full flex items-center justify-center text-gray-300"><Camera className="w-8 h-8" /></div>}
                        <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">#{idx + 1}</span>
                        <span className={`absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded ${img.active ? "bg-green-500/80 text-white" : "bg-gray-400/80 text-white"}`}>
                          {img.active ? "ON" : "OFF"}
                        </span>
                      </div>
                      <div className="p-3 flex justify-end gap-2">
                        <button onClick={() => setInstagramModal({ open: true, mode: "edit", data: { ...img } })}
                          className="p-1.5 text-gray-400 hover:text-[#3B5373] hover:bg-gray-50 rounded-lg transition-colors">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setDeleteInstagramConfirm(img.id!)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {deleteInstagramConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                  <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
                    <p className="font-semibold text-gray-800 mb-2">Delete Image?</p>
                    <div className="flex gap-3 justify-center">
                      <button onClick={() => setDeleteInstagramConfirm(null)} className="px-5 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
                      <button onClick={async () => {
                        await supabase.from("instagram_images").delete().eq("id", deleteInstagramConfirm);
                        await revalidateSite();
                        setDeleteInstagramConfirm(null);
                        await fetchInstagramImages();
                      }} className="px-5 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600">Delete</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            </div>
          )}

          {/* ══ STYLE INSPO TAB ════════════════════════════════════════════ */}
          {tab === "style-inspo" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Style Inspiration</h2>
                  <p className="text-xs text-gray-400 mt-0.5">{styleInspos.length} items</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={fetchStyleInspos} disabled={styleInspoLoading}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-400 hover:text-[#3B5373] border border-gray-200 rounded-xl transition-colors">
                    <RefreshCw className={`w-3.5 h-3.5 ${styleInspoLoading ? "animate-spin" : ""}`} />Refresh
                  </button>
                  <button onClick={() => setStyleInspoModal({ open: true, mode: "add", data: { ...EMPTY_STYLE_INSPO } })}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#3B5373] text-white rounded-xl text-xs font-medium hover:bg-[#2d3f4f] transition-colors">
                    <Plus className="w-3.5 h-3.5" />Add Inspo
                  </button>
                </div>
              </div>
              {styleInspoLoading ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 text-sm">Loading…</div>
              ) : styleInspos.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                  <Palette className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">No style inspo yet. Add your first look!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {styleInspos.map(inspo => (
                    <div key={inspo.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                      <div className="relative aspect-square bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {inspo.image_url ? <img src={inspo.image_url} alt={inspo.title || "Style"} className="w-full h-full object-cover" /> :
                          <div className="w-full h-full flex items-center justify-center text-gray-300"><Palette className="w-8 h-8" /></div>}
                        {inspo.tag && <span className="absolute top-2 left-2 bg-[#3B5373] text-white text-xs px-2 py-0.5 rounded">{inspo.tag}</span>}
                        <span className={`absolute top-2 right-2 text-xs px-1.5 py-0.5 rounded ${inspo.active ? "bg-green-500/80 text-white" : "bg-gray-400/80 text-white"}`}>
                          {inspo.active ? "ON" : "OFF"}
                        </span>
                      </div>
                      <div className="p-3">
                        {inspo.title && <p className="text-xs font-medium text-gray-700 truncate mb-2">{inspo.title}</p>}
                        <div className="flex justify-end gap-2">
                          <button onClick={() => setStyleInspoModal({ open: true, mode: "edit", data: { ...inspo } })}
                            className="p-1.5 text-gray-400 hover:text-[#3B5373] hover:bg-gray-50 rounded-lg transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteStyleInspoConfirm(inspo.id!)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {deleteStyleInspoConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                  <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center">
                    <p className="font-semibold text-gray-800 mb-2">Delete Style Inspo?</p>
                    <div className="flex gap-3 justify-center">
                      <button onClick={() => setDeleteStyleInspoConfirm(null)} className="px-5 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
                      <button onClick={async () => {
                        await supabase.from("style_inspo").delete().eq("id", deleteStyleInspoConfirm);
                        await revalidateSite();
                        setDeleteStyleInspoConfirm(null);
                        await fetchStyleInspos();
                      }} className="px-5 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600">Delete</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════
              ABOUT US — au-hero TAB
          ══════════════════════════════════════ */}
          {tab === "au-hero" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-base font-semibold text-gray-800 mb-1">Hero Section</h2>
                <p className="text-xs text-gray-400 mb-4">Split layout — large heading on the left, story text on the right.</p>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Eyebrow Text</p>
                    <input type="text" value={auHeroEyebrow} onChange={e => setAuHeroEyebrow(e.target.value)} className={inputCls} placeholder="Our Story" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Hero Heading</p>
                    <input type="text" value={auHeroHeading} onChange={e => setAuHeroHeading(e.target.value)} className={inputCls} placeholder="About CLASSIE" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Story Text <span className="normal-case text-gray-300">— use \n\n for new paragraph, \n for line break</span></p>
                    <textarea rows={8} value={auHeroText} onChange={e => setAuHeroText(e.target.value)} className={inputCls + " resize-y font-mono text-xs"} />
                  </div>
                  <button onClick={saveAuHero} disabled={auHeroSaving}
                    className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                    <Save className="w-4 h-4" />{auHeroSaving ? "Saving…" : "Save Hero"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              ABOUT US — au-banner TAB
          ══════════════════════════════════════ */}
          {tab === "au-banner" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-base font-semibold text-gray-800 mb-1">Full-Width Banner</h2>
                <p className="text-xs text-gray-400 mb-4">Image shown between the hero and story sections. Leave empty for a navy placeholder.</p>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Banner Image URL</p>
                    <input type="text" value={auBannerImg} onChange={e => setAuBannerImg(e.target.value)} className={inputCls} placeholder="https://..." />
                    {auBannerImg && (
                      <img src={auBannerImg} alt="banner preview" className="mt-2 h-32 w-full object-cover rounded-lg object-center" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    )}
                  </div>
                  <button onClick={saveAuBanner} disabled={auBannerSaving}
                    className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                    <Save className="w-4 h-4" />{auBannerSaving ? "Saving…" : "Save Banner"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              ABOUT US — au-story TAB
          ══════════════════════════════════════ */}
          {tab === "au-story" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-base font-semibold text-gray-800 mb-1">Our Story Sections</h2>
                <p className="text-xs text-gray-400 mb-4">Three alternating text + image sections. Leave image URL empty to hide the image.</p>

                {/* Story 1 */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 mb-6">
                  <p className="text-xs font-semibold text-[#3B5373] uppercase tracking-wider">Section 1 — Text Left, Image Right</p>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Heading</p>
                    <input type="text" value={auS1Heading} onChange={e => setAuS1Heading(e.target.value)} className={inputCls} placeholder="Where It All Began" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Text <span className="normal-case text-gray-300">— \n\n = new paragraph</span></p>
                    <textarea rows={6} value={auS1Text} onChange={e => setAuS1Text(e.target.value)} className={inputCls + " resize-y font-mono text-xs"} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Image URL</p>
                    <input type="text" value={auS1Img} onChange={e => setAuS1Img(e.target.value)} className={inputCls} placeholder="https://..." />
                    {auS1Img && (
                      <img src={auS1Img} alt="s1 preview" className="mt-2 h-24 w-full object-cover rounded-lg" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    )}
                  </div>
                </div>

                {/* Story 2 */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 mb-6">
                  <p className="text-xs font-semibold text-[#3B5373] uppercase tracking-wider">Section 2 — Image Left, Text Right</p>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Heading</p>
                    <input type="text" value={auS2Heading} onChange={e => setAuS2Heading(e.target.value)} className={inputCls} placeholder="Classic Heels — Easy to Love" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Text</p>
                    <textarea rows={6} value={auS2Text} onChange={e => setAuS2Text(e.target.value)} className={inputCls + " resize-y font-mono text-xs"} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Image URL</p>
                    <input type="text" value={auS2Img} onChange={e => setAuS2Img(e.target.value)} className={inputCls} placeholder="https://..." />
                    {auS2Img && (
                      <img src={auS2Img} alt="s2 preview" className="mt-2 h-24 w-full object-cover rounded-lg" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    )}
                  </div>
                </div>

                {/* Story 3 */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                  <p className="text-xs font-semibold text-[#3B5373] uppercase tracking-wider">Section 3 — Text Left, Image Right</p>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Heading</p>
                    <input type="text" value={auS3Heading} onChange={e => setAuS3Heading(e.target.value)} className={inputCls} placeholder="Classie Is More Than Heels" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Text</p>
                    <textarea rows={5} value={auS3Text} onChange={e => setAuS3Text(e.target.value)} className={inputCls + " resize-y font-mono text-xs"} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Image URL</p>
                    <input type="text" value={auS3Img} onChange={e => setAuS3Img(e.target.value)} className={inputCls} placeholder="https://..." />
                    {auS3Img && (
                      <img src={auS3Img} alt="s3 preview" className="mt-2 h-24 w-full object-cover rounded-lg" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <button onClick={saveAuStory} disabled={auStorySaving}
                    className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                    <Save className="w-4 h-4" />{auStorySaving ? "Saving…" : "Save All Story Sections"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              ABOUT US — au-features TAB
          ══════════════════════════════════════ */}
          {tab === "au-features" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-base font-semibold text-gray-800 mb-1">Features Section</h2>
                <p className="text-xs text-gray-400 mb-4">3-card grid highlighting what makes Classie different.</p>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-6">
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Section Heading</p>
                    <input type="text" value={auFeatsHeading} onChange={e => setAuFeatsHeading(e.target.value)} className={inputCls} placeholder="What Makes Classie Different" />
                  </div>

                  {/* Feature 1 */}
                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <p className="text-xs font-semibold text-[#3B5373] uppercase tracking-wider">Feature 1</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Icon (emoji)</p>
                        <input type="text" value={auFeat1Icon} onChange={e => setAuFeat1Icon(e.target.value)} className={inputCls} placeholder="👠" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Title</p>
                        <input type="text" value={auFeat1Title} onChange={e => setAuFeat1Title(e.target.value)} className={inputCls} placeholder="Handcrafted With Purpose" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Description</p>
                      <textarea rows={2} value={auFeat1Desc} onChange={e => setAuFeat1Desc(e.target.value)} className={inputCls + " resize-none"} />
                    </div>
                  </div>

                  {/* Feature 2 */}
                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <p className="text-xs font-semibold text-[#3B5373] uppercase tracking-wider">Feature 2</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Icon (emoji)</p>
                        <input type="text" value={auFeat2Icon} onChange={e => setAuFeat2Icon(e.target.value)} className={inputCls} placeholder="✨" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Title</p>
                        <input type="text" value={auFeat2Title} onChange={e => setAuFeat2Title(e.target.value)} className={inputCls} placeholder="Premium Materials, Refined Finish" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Description</p>
                      <textarea rows={2} value={auFeat2Desc} onChange={e => setAuFeat2Desc(e.target.value)} className={inputCls + " resize-none"} />
                    </div>
                  </div>

                  {/* Feature 3 */}
                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <p className="text-xs font-semibold text-[#3B5373] uppercase tracking-wider">Feature 3</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Icon (emoji)</p>
                        <input type="text" value={auFeat3Icon} onChange={e => setAuFeat3Icon(e.target.value)} className={inputCls} placeholder="🎀" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Title</p>
                        <input type="text" value={auFeat3Title} onChange={e => setAuFeat3Title(e.target.value)} className={inputCls} placeholder="Heel + Clip On" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Description</p>
                      <textarea rows={2} value={auFeat3Desc} onChange={e => setAuFeat3Desc(e.target.value)} className={inputCls + " resize-none"} />
                    </div>
                  </div>

                  <button onClick={saveAuFeatures} disabled={auFeatsSaving}
                    className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                    <Save className="w-4 h-4" />{auFeatsSaving ? "Saving…" : "Save Features"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              ABOUT US — au-founder TAB
          ══════════════════════════════════════ */}
          {tab === "au-founder" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-base font-semibold text-gray-800 mb-1">Founder Section</h2>
                <p className="text-xs text-gray-400 mb-4">Centered quote with founder photo and name.</p>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Founder Quote</p>
                    <textarea rows={5} value={auFounderQuote} onChange={e => setAuFounderQuote(e.target.value)} className={inputCls + " resize-y"} placeholder="Classie was created to give women the freedom…" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Founder Name</p>
                      <input type="text" value={auFounderName} onChange={e => setAuFounderName(e.target.value)} className={inputCls} placeholder="Ishika Garg" />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Title / Role</p>
                      <input type="text" value={auFounderTitle} onChange={e => setAuFounderTitle(e.target.value)} className={inputCls} placeholder="Founder, Classie" />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Photo URL <span className="normal-case text-gray-300">— circular, shown below the quote</span></p>
                    <input type="text" value={auFounderImg} onChange={e => setAuFounderImg(e.target.value)} className={inputCls} placeholder="https://..." />
                    {auFounderImg && (
                      <img src={auFounderImg} alt="founder preview" className="mt-2 h-20 w-20 object-cover rounded-full border-2 border-[#3B5373]" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    )}
                  </div>
                  <button onClick={saveAuFounder} disabled={auFounderSaving}
                    className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                    <Save className="w-4 h-4" />{auFounderSaving ? "Saving…" : "Save Founder Section"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              CONTACT US — ct-hero TAB
          ══════════════════════════════════════════════════ */}
          {tab === "ct-hero" && (
            <div className="max-w-2xl space-y-5">
              <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                <h2 className="font-semibold text-gray-700 text-sm">Hero Section</h2>
                <div>
                  <label className={labelCls}>Hero Image URL</label>
                  <input type="text" value={ctHeroImg} onChange={e => setCtHeroImg(e.target.value)} className={inputCls} placeholder="https://... (leave blank for navy fallback)" />
                  {ctHeroImg && <img src={ctHeroImg} alt="hero preview" className="mt-2 h-24 object-cover rounded" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />}
                </div>
                <div>
                  <label className={labelCls}>Heading</label>
                  <input type="text" value={ctHeading} onChange={e => setCtHeading(e.target.value)} className={inputCls} placeholder="Contact Us" />
                </div>
                <div>
                  <label className={labelCls}>Subtext</label>
                  <textarea rows={4} value={ctSubtext} onChange={e => setCtSubtext(e.target.value)} className={inputCls + " resize-y"} />
                </div>
                <button onClick={saveCtHero} disabled={ctHeroSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                  <Save className="w-4 h-4" />{ctHeroSaving ? "Saving…" : "Save Hero"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              CONTACT US — ct-help TAB
          ══════════════════════════════════════════════════ */}
          {tab === "ct-help" && (
            <div className="max-w-2xl space-y-5">
              <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                <h2 className="font-semibold text-gray-700 text-sm">Quick Help Cards</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Order Tracking Text</label>
                    <input type="text" value={ctTrackText} onChange={e => setCtTrackText(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Track URL</label>
                    <input type="text" value={ctTrackUrl} onChange={e => setCtTrackUrl(e.target.value)} className={inputCls} placeholder="/track" />
                  </div>
                  <div>
                    <label className={labelCls}>Return & Exchange Text</label>
                    <input type="text" value={ctReturnText} onChange={e => setCtReturnText(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Return URL</label>
                    <input type="text" value={ctReturnUrl} onChange={e => setCtReturnUrl(e.target.value)} className={inputCls} placeholder="/returns" />
                  </div>
                </div>
                <button onClick={saveCtHelp} disabled={ctHelpSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                  <Save className="w-4 h-4" />{ctHelpSaving ? "Saving…" : "Save Quick Help"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              CONTACT US — ct-faq TAB
          ══════════════════════════════════════════════════ */}
          {tab === "ct-faq" && (
            <div className="max-w-2xl space-y-5">
              <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                <h2 className="font-semibold text-gray-700 text-sm">FAQ Accordion</h2>
                <div>
                  <label className={labelCls}>Section Heading</label>
                  <input type="text" value={ctFaqHeading} onChange={e => setCtFaqHeading(e.target.value)} className={inputCls} placeholder="Popular Searched Questions" />
                </div>
                <p className="text-xs text-gray-400">Leave all FAQ fields blank to use hardcoded defaults on the page.</p>
                {[
                  [ctFaq1Q, setCtFaq1Q, ctFaq1A, setCtFaq1A],
                  [ctFaq2Q, setCtFaq2Q, ctFaq2A, setCtFaq2A],
                  [ctFaq3Q, setCtFaq3Q, ctFaq3A, setCtFaq3A],
                  [ctFaq4Q, setCtFaq4Q, ctFaq4A, setCtFaq4A],
                  [ctFaq5Q, setCtFaq5Q, ctFaq5A, setCtFaq5A],
                  [ctFaq6Q, setCtFaq6Q, ctFaq6A, setCtFaq6A],
                  [ctFaq7Q, setCtFaq7Q, ctFaq7A, setCtFaq7A],
                  [ctFaq8Q, setCtFaq8Q, ctFaq8A, setCtFaq8A],
                ].map(([q, setQ, a, setA], idx) => (
                  <div key={idx} className="border border-gray-100 rounded-lg p-4 space-y-2">
                    <p className="text-xs font-medium text-gray-500">FAQ {idx + 1}</p>
                    <input type="text" value={q as string} onChange={e => (setQ as (v: string) => void)(e.target.value)} className={inputCls} placeholder={`Question ${idx + 1}`} />
                    <textarea rows={2} value={a as string} onChange={e => (setA as (v: string) => void)(e.target.value)} className={inputCls + " resize-y"} placeholder={`Answer ${idx + 1}`} />
                  </div>
                ))}
                <button onClick={saveCtFaq} disabled={ctFaqSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                  <Save className="w-4 h-4" />{ctFaqSaving ? "Saving…" : "Save FAQ"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              CONTACT US — ct-info TAB
          ══════════════════════════════════════════════════ */}
          {tab === "ct-info" && (
            <div className="max-w-2xl space-y-5">
              <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                <h2 className="font-semibold text-gray-700 text-sm">Contact Info Section</h2>
                <div>
                  <label className={labelCls}>Section Heading</label>
                  <input type="text" value={ctInfoHeading} onChange={e => setCtInfoHeading(e.target.value)} className={inputCls} placeholder="Any other questions?" />
                </div>
                <div>
                  <label className={labelCls}>Subtext</label>
                  <input type="text" value={ctInfoSub} onChange={e => setCtInfoSub(e.target.value)} className={inputCls} placeholder="We're here to help!…" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input type="text" value={ctPhone} onChange={e => setCtPhone(e.target.value)} className={inputCls} placeholder="91- 9468147781" />
                  </div>
                  <div>
                    <label className={labelCls}>Email</label>
                    <input type="text" value={ctEmail} onChange={e => setCtEmail(e.target.value)} className={inputCls} placeholder="contact.classie@gmail.com" />
                  </div>
                  <div>
                    <label className={labelCls}>Social Handle</label>
                    <input type="text" value={ctSocial} onChange={e => setCtSocial(e.target.value)} className={inputCls} placeholder="@classsie.in" />
                  </div>
                </div>
                <button onClick={saveCtInfo} disabled={ctInfoSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
                  <Save className="w-4 h-4" />{ctInfoSaving ? "Saving…" : "Save Contact Info"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              CONTACT US — ct-inbox TAB
          ══════════════════════════════════════════════════ */}
          {tab === "ct-inbox" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-700">Contact Submissions</h2>
                <button onClick={fetchCtInbox} className="flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <RefreshCw className="w-3 h-3" /> Refresh
                </button>
              </div>
              {ctInboxLoading ? (
                <p className="text-sm text-gray-400">Loading…</p>
              ) : ctInbox.length === 0 ? (
                <p className="text-sm text-gray-400">No submissions yet.</p>
              ) : (
                <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left">
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ctInbox.map((row) => (
                        <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                            {new Date(row.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">
                            {row.first_name} {row.last_name}
                          </td>
                          <td className="px-4 py-3 text-gray-600">{row.email}</td>
                          <td className="px-4 py-3 text-gray-600">{row.phone || "—"}</td>
                          <td className="px-4 py-3 text-gray-600 max-w-xs">
                            <p className="line-clamp-2">{row.message}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════
              SHIPPING POLICY — sp-hero TAB
          ══════════════════════════════════════ */}
          {tab === "sp-hero" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-base font-semibold text-gray-800">Hero Section</h2>
                <p className="text-xs text-gray-400 mt-0.5">Controls the full-navy top section of the shipping page.</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div>
                  <label className={labelCls}>Eyebrow Label</label>
                  <input type="text" value={spEyebrow} onChange={e => setSpEyebrow(e.target.value)} className={inputCls} placeholder="CLASSIE" />
                </div>
                <div>
                  <label className={labelCls}>Page Heading</label>
                  <input type="text" value={spHeading} onChange={e => setSpHeading(e.target.value)} className={inputCls} placeholder="Shipping Policy" />
                </div>
                <div>
                  <label className={labelCls}>Last Updated Text</label>
                  <input type="text" value={spUpdated} onChange={e => setSpUpdated(e.target.value)} className={inputCls} placeholder="Last updated: June 2025" />
                </div>
                <button onClick={saveSpHero} disabled={spHeroSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] disabled:opacity-60">
                  <Save className="w-4 h-4" />{spHeroSaving ? "Saving…" : "Save Hero"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              SHIPPING POLICY — sp-tiles TAB
          ══════════════════════════════════════ */}
          {tab === "sp-tiles" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-base font-semibold text-gray-800">KPI Tiles</h2>
                <p className="text-xs text-gray-400 mt-0.5">4 highlight tiles shown below the hero section.</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                {[
                  { emoji: "🚚", label: "Tile 1", titleVal: spTile1Title, setTitle: setSpTile1Title, subVal: spTile1Sub, setSub: setSpTile1Sub },
                  { emoji: "⏱️", label: "Tile 2", titleVal: spTile2Title, setTitle: setSpTile2Title, subVal: spTile2Sub, setSub: setSpTile2Sub },
                  { emoji: "🗺️", label: "Tile 3", titleVal: spTile3Title, setTitle: setSpTile3Title, subVal: spTile3Sub, setSub: setSpTile3Sub },
                  { emoji: "⚡", label: "Tile 4", titleVal: spTile4Title, setTitle: setSpTile4Title, subVal: spTile4Sub, setSub: setSpTile4Sub },
                ].map(({ emoji, label, titleVal, setTitle, subVal, setSub }) => (
                  <div key={label} className="border border-gray-100 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{emoji} {label}</p>
                    <div>
                      <label className={labelCls}>Title</label>
                      <input type="text" value={titleVal} onChange={e => setTitle(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Subtitle</label>
                      <input type="text" value={subVal} onChange={e => setSub(e.target.value)} className={inputCls} />
                    </div>
                  </div>
                ))}
                <button onClick={saveSpTiles} disabled={spTilesSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] disabled:opacity-60">
                  <Save className="w-4 h-4" />{spTilesSaving ? "Saving…" : "Save Tiles"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              SHIPPING POLICY — sp-content TAB
          ══════════════════════════════════════ */}
          {tab === "sp-content" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-base font-semibold text-gray-800">Content Sections</h2>
                <p className="text-xs text-gray-400 mt-0.5">5 accordion-style cards. Use line breaks in the body for new lines.</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                {[
                  { num: 1, label: "Shipping Rates",          headingVal: spRatesHeading,    setHeading: setSpRatesHeading,    bodyVal: spRatesBody,    setBody: setSpRatesBody },
                  { num: 2, label: "Delivery Timelines",      headingVal: spTimelineHeading, setHeading: setSpTimelineHeading, bodyVal: spTimelineBody, setBody: setSpTimelineBody },
                  { num: 3, label: "Order Tracking",          headingVal: spTrackingHeading, setHeading: setSpTrackingHeading, bodyVal: spTrackingBody, setBody: setSpTrackingBody },
                  { num: 4, label: "Incorrect Address",       headingVal: spAddressHeading,  setHeading: setSpAddressHeading,  bodyVal: spAddressBody,  setBody: setSpAddressBody },
                  { num: 5, label: "Lost or Damaged Packages",headingVal: spLostHeading,     setHeading: setSpLostHeading,     bodyVal: spLostBody,     setBody: setSpLostBody },
                ].map(({ num, label, headingVal, setHeading, bodyVal, setBody }) => (
                  <div key={num} className="border border-gray-100 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Section {num} — {label}</p>
                    <div>
                      <label className={labelCls}>Section Heading</label>
                      <input type="text" value={headingVal} onChange={e => setHeading(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Body Text</label>
                      <textarea value={bodyVal} onChange={e => setBody(e.target.value)} rows={4}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3B5373] transition-colors bg-white resize-y" />
                    </div>
                  </div>
                ))}
                <button onClick={saveSpContent} disabled={spContentSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] disabled:opacity-60">
                  <Save className="w-4 h-4" />{spContentSaving ? "Saving…" : "Save Content"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              SHIPPING POLICY — sp-cta TAB
          ══════════════════════════════════════ */}
          {tab === "sp-cta" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-base font-semibold text-gray-800">CTA Strip</h2>
                <p className="text-xs text-gray-400 mt-0.5">The navy bottom strip with a "Contact Us" button.</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div>
                  <label className={labelCls}>CTA Text</label>
                  <input type="text" value={spCtaText} onChange={e => setSpCtaText(e.target.value)} className={inputCls} placeholder="Have questions about your order?" />
                  <p className="text-xs text-gray-400 mt-1">The button always links to /contact and reads "Contact Us →".</p>
                </div>
                <button onClick={saveSpCta} disabled={spCtaSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] disabled:opacity-60">
                  <Save className="w-4 h-4" />{spCtaSaving ? "Saving…" : "Save CTA"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              SIZE GUIDE — sg-hero TAB
          ══════════════════════════════════════ */}
          {tab === "sg-hero" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-base font-semibold text-gray-800">Hero Section</h2>
                <p className="text-xs text-gray-400 mt-0.5">Full navy top section of the size guide page.</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div>
                  <label className={labelCls}>Eyebrow Label</label>
                  <input type="text" value={sgEyebrow} onChange={e => setSgEyebrow(e.target.value)} className={inputCls} placeholder="CLASSIE" />
                </div>
                <div>
                  <label className={labelCls}>Page Heading</label>
                  <input type="text" value={sgHeading} onChange={e => setSgHeading(e.target.value)} className={inputCls} placeholder="Size Guide" />
                </div>
                <div>
                  <label className={labelCls}>Subheading</label>
                  <input type="text" value={sgSub} onChange={e => setSgSub(e.target.value)} className={inputCls} placeholder="Find your perfect fit — every time" />
                </div>
                <button onClick={saveSgHero} disabled={sgHeroSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] disabled:opacity-60">
                  <Save className="w-4 h-4" />{sgHeroSaving ? "Saving…" : "Save Hero"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              SIZE GUIDE — sg-measure TAB
          ══════════════════════════════════════ */}
          {tab === "sg-measure" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-base font-semibold text-gray-800">How to Measure</h2>
                <p className="text-xs text-gray-400 mt-0.5">Section heading and measurement steps.</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div>
                  <label className={labelCls}>Section Heading</label>
                  <input type="text" value={sgMeasureHeading} onChange={e => setSgMeasureHeading(e.target.value)} className={inputCls} placeholder="How to Measure Your Foot" />
                </div>
                <div>
                  <label className={labelCls}>Steps (one step per line)</label>
                  <textarea
                    rows={7}
                    value={sgMeasureSteps}
                    onChange={e => setSgMeasureSteps(e.target.value)}
                    className={inputCls + " resize-y"}
                    placeholder={"Step 1: Place a blank sheet of paper on a flat floor\nStep 2: Stand on the paper with your heel against a wall"}
                  />
                  <p className="text-xs text-gray-400 mt-1">Each line becomes a numbered step. "Step N:" prefix is stripped automatically.</p>
                </div>
                <button onClick={saveSgMeasure} disabled={sgMeasureSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] disabled:opacity-60">
                  <Save className="w-4 h-4" />{sgMeasureSaving ? "Saving…" : "Save Measure Section"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              SIZE GUIDE — sg-chart TAB
          ══════════════════════════════════════ */}
          {tab === "sg-chart" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-base font-semibold text-gray-800">Size Chart</h2>
                <p className="text-xs text-gray-400 mt-0.5">Table heading, subtext, and size data.</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div>
                  <label className={labelCls}>Chart Heading</label>
                  <input type="text" value={sgChartHeading} onChange={e => setSgChartHeading(e.target.value)} className={inputCls} placeholder="Heel Size Chart" />
                </div>
                <div>
                  <label className={labelCls}>Chart Subtext</label>
                  <input type="text" value={sgChartSub} onChange={e => setSgChartSub(e.target.value)} className={inputCls} placeholder="All measurements are in centimetres (cm)" />
                </div>
                <div>
                  <label className={labelCls}>Chart Data (JSON)</label>
                  <textarea
                    rows={10}
                    value={sgChartJson}
                    onChange={e => setSgChartJson(e.target.value)}
                    className={inputCls + " resize-y font-mono text-xs"}
                  />
                  <p className="text-xs text-gray-400 mt-1">Edit as JSON array with <code className="bg-gray-100 px-1 rounded">eu</code>, <code className="bg-gray-100 px-1 rounded">uk</code>, <code className="bg-gray-100 px-1 rounded">in</code>, <code className="bg-gray-100 px-1 rounded">cm</code> fields.</p>
                </div>
                <button onClick={saveSgChart} disabled={sgChartSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] disabled:opacity-60">
                  <Save className="w-4 h-4" />{sgChartSaving ? "Saving…" : "Save Chart"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              SIZE GUIDE — sg-tips TAB
          ══════════════════════════════════════ */}
          {tab === "sg-tips" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-base font-semibold text-gray-800">Fit Tips</h2>
                <p className="text-xs text-gray-400 mt-0.5">3 tip cards shown below the size chart.</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <div>
                  <label className={labelCls}>Section Heading</label>
                  <input type="text" value={sgTipsHeading} onChange={e => setSgTipsHeading(e.target.value)} className={inputCls} placeholder="Tips for the Perfect Fit" />
                </div>
                {[
                  { num: 1, icon: sgTip1Icon, setIcon: setSgTip1Icon, title: sgTip1Title, setTitle: setSgTip1Title, body: sgTip1Body, setBody: setSgTip1Body },
                  { num: 2, icon: sgTip2Icon, setIcon: setSgTip2Icon, title: sgTip2Title, setTitle: setSgTip2Title, body: sgTip2Body, setBody: setSgTip2Body },
                  { num: 3, icon: sgTip3Icon, setIcon: setSgTip3Icon, title: sgTip3Title, setTitle: setSgTip3Title, body: sgTip3Body, setBody: setSgTip3Body },
                ].map(({ num, icon, setIcon, title, setTitle, body, setBody }) => (
                  <div key={num} className="border border-gray-100 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tip {num}</p>
                    <div className="grid grid-cols-4 gap-3">
                      <div>
                        <label className={labelCls}>Icon</label>
                        <input type="text" value={icon} onChange={e => setIcon(e.target.value)} className={inputCls} placeholder="📏" />
                      </div>
                      <div className="col-span-3">
                        <label className={labelCls}>Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Body Text</label>
                      <textarea rows={2} value={body} onChange={e => setBody(e.target.value)} className={inputCls + " resize-y"} />
                    </div>
                  </div>
                ))}
                <button onClick={saveSgTips} disabled={sgTipsSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] disabled:opacity-60">
                  <Save className="w-4 h-4" />{sgTipsSaving ? "Saving…" : "Save Fit Tips"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              SIZE GUIDE — sg-cta TAB
          ══════════════════════════════════════ */}
          {tab === "sg-cta" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-base font-semibold text-gray-800">CTA Strip</h2>
                <p className="text-xs text-gray-400 mt-0.5">Navy bottom strip. Button always reads "Chat With Us →" and links to /contact.</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div>
                  <label className={labelCls}>CTA Text</label>
                  <input type="text" value={sgCtaText} onChange={e => setSgCtaText(e.target.value)} className={inputCls} placeholder="Still not sure about your size?" />
                </div>
                <button onClick={saveSgCta} disabled={sgCtaSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] disabled:opacity-60">
                  <Save className="w-4 h-4" />{sgCtaSaving ? "Saving…" : "Save CTA"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              RETURNS & EXCHANGES — re-hero TAB
          ══════════════════════════════════════ */}
          {tab === "re-hero" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-base font-semibold text-gray-800">Hero Section</h2>
                <p className="text-xs text-gray-400 mt-0.5">The navy hero banner at the top of the Returns & Exchanges page.</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div>
                  <label className={labelCls}>Eyebrow Label</label>
                  <input type="text" value={reEyebrow} onChange={e => setReEyebrow(e.target.value)} className={inputCls} placeholder="CLASSIE" />
                </div>
                <div>
                  <label className={labelCls}>Page Heading</label>
                  <input type="text" value={reHeading} onChange={e => setReHeading(e.target.value)} className={inputCls} placeholder="Returns & Exchanges" />
                </div>
                <div>
                  <label className={labelCls}>Subtitle</label>
                  <input type="text" value={reSub} onChange={e => setReSub(e.target.value)} className={inputCls} placeholder="Hassle-free returns within 7 days of delivery" />
                </div>
                <div>
                  <label className={labelCls}>Last Updated Text</label>
                  <input type="text" value={reUpdated} onChange={e => setReUpdated(e.target.value)} className={inputCls} placeholder="Last updated: June 2025" />
                </div>
                <button onClick={saveReHero} disabled={reHeroSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] disabled:opacity-60">
                  <Save className="w-4 h-4" />{reHeroSaving ? "Saving…" : "Save Hero"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              RETURNS & EXCHANGES — re-tiles TAB
          ══════════════════════════════════════ */}
          {tab === "re-tiles" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-base font-semibold text-gray-800">KPI Tiles</h2>
                <p className="text-xs text-gray-400 mt-0.5">3 highlight tiles shown below the hero section.</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                {[
                  { emoji: "♻️", label: "Tile 1", titleVal: reTile1Title, setTitle: setReTile1Title, subVal: reTile1Sub, setSub: setReTile1Sub },
                  { emoji: "🔄", label: "Tile 2", titleVal: reTile2Title, setTitle: setReTile2Title, subVal: reTile2Sub, setSub: setReTile2Sub },
                  { emoji: "💰", label: "Tile 3", titleVal: reTile3Title, setTitle: setReTile3Title, subVal: reTile3Sub, setSub: setReTile3Sub },
                ].map(({ emoji, label, titleVal, setTitle, subVal, setSub }) => (
                  <div key={label} className="border border-gray-100 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{emoji} {label}</p>
                    <div>
                      <label className={labelCls}>Title</label>
                      <input type="text" value={titleVal} onChange={e => setTitle(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Subtitle</label>
                      <input type="text" value={subVal} onChange={e => setSub(e.target.value)} className={inputCls} />
                    </div>
                  </div>
                ))}
                <button onClick={saveReTiles} disabled={reTilesSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] disabled:opacity-60">
                  <Save className="w-4 h-4" />{reTilesSaving ? "Saving…" : "Save Tiles"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              RETURNS & EXCHANGES — re-policy TAB
          ══════════════════════════════════════ */}
          {tab === "re-policy" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-base font-semibold text-gray-800">Policy Cards</h2>
                <p className="text-xs text-gray-400 mt-0.5">5 policy sections. Use line breaks in the body for new lines.</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                {[
                  { num: 1, label: "Eligible Returns",       headingVal: reEligibleHeading,  setHeading: setReEligibleHeading,  bodyVal: reEligibleBody,  setBody: setReEligibleBody },
                  { num: 2, label: "Non-Returnable Items",   headingVal: reNonreturnHeading, setHeading: setReNonreturnHeading, bodyVal: reNonreturnBody, setBody: setReNonreturnBody },
                  { num: 3, label: "How to Initiate Return", headingVal: reInitiateHeading,  setHeading: setReInitiateHeading,  bodyVal: reInitiateBody,  setBody: setReInitiateBody },
                  { num: 4, label: "Exchanges",              headingVal: reExchangeHeading,  setHeading: setReExchangeHeading,  bodyVal: reExchangeBody,  setBody: setReExchangeBody },
                  { num: 5, label: "Refunds",                headingVal: reRefundHeading,    setHeading: setReRefundHeading,    bodyVal: reRefundBody,    setBody: setReRefundBody },
                ].map(({ num, label, headingVal, setHeading, bodyVal, setBody }) => (
                  <div key={num} className="border border-gray-100 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Section {num} — {label}</p>
                    <div>
                      <label className={labelCls}>Section Heading</label>
                      <input type="text" value={headingVal} onChange={e => setHeading(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Body Text</label>
                      <textarea value={bodyVal} onChange={e => setBody(e.target.value)} rows={4}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3B5373] transition-colors bg-white resize-y" />
                    </div>
                  </div>
                ))}
                <button onClick={saveRePolicy} disabled={rePolicySaving}
                  className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] disabled:opacity-60">
                  <Save className="w-4 h-4" />{rePolicySaving ? "Saving…" : "Save Policy"}
                </button>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              RETURNS & EXCHANGES — re-cta TAB
          ══════════════════════════════════════ */}
          {tab === "re-cta" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-base font-semibold text-gray-800">CTA Strip</h2>
                <p className="text-xs text-gray-400 mt-0.5">The navy bottom strip with a "Contact Us →" button.</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div>
                  <label className={labelCls}>CTA Text</label>
                  <input type="text" value={reCtaText} onChange={e => setReCtaText(e.target.value)} className={inputCls} placeholder="Need help with a return or exchange?" />
                  <p className="text-xs text-gray-400 mt-1">The button always links to /contact and reads "Contact Us →".</p>
                </div>
                <button onClick={saveReCta} disabled={reCtaSaving}
                  className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] disabled:opacity-60">
                  <Save className="w-4 h-4" />{reCtaSaving ? "Saving…" : "Save CTA"}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ══════════════════════════════════════════════════
          PRODUCT MODAL
      ══════════════════════════════════════════════════ */}
      {productModal.open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">
                {productModal.mode === "add" ? "Add Product" : "Edit Product"}
              </h2>
              <button onClick={closeProductModal} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Title *</label>
                  <input type="text" value={productModal.data.title} onChange={(e) => setProductField("title", e.target.value)} className={inputCls} placeholder="e.g. Clessia Wine" />
                </div>
                <div>
                  <label className={labelCls}>Slug *</label>
                  <input type="text" value={productModal.data.slug} onChange={(e) => setProductField("slug", e.target.value)} className={inputCls} placeholder="e.g. clessia-wine" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Price (₹) *</label>
                  <input type="number" value={productModal.data.price} onChange={(e) => setProductField("price", Number(e.target.value))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Compare Price (₹)</label>
                  <input type="number" value={productModal.data.compare_price} onChange={(e) => setProductField("compare_price", Number(e.target.value))} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <select value={productModal.data.category} onChange={(e) => setProductField("category", e.target.value)} className={inputCls}>
                    {["heels","accessories","bow","clips"].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea rows={3} value={productModal.data.description} onChange={(e) => setProductField("description", e.target.value)} className={inputCls} placeholder="Product description…" />
              </div>
              <div>
                <label className={labelCls}>✨ Key Features <span className="text-gray-400 font-normal normal-case">(use | to separate points)</span></label>
                <textarea rows={3} value={productModal.data.key_features ?? ""} onChange={(e) => setProductField("key_features", e.target.value)} className={inputCls} placeholder="Classie Comfort cushioned insole | Premium material finish | Anti-slip sole | …" />
              </div>
              <div>
                <label className={labelCls}>ℹ️ Other Info <span className="text-gray-400 font-normal normal-case">(care, storage, etc.)</span></label>
                <textarea rows={2} value={productModal.data.other_info ?? ""} onChange={(e) => setProductField("other_info", e.target.value)} className={inputCls} placeholder="Clean with a soft dry cloth. Avoid water and perfumes. Store in dust bag…" />
              </div>
              {/* ── Images + Video ── */}
              <div className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50/50">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">📸 Images &amp; Video</p>
                <div>
                  <label className={labelCls}>Image 1 — Main</label>
                  <input type="text" value={productModal.data.image} onChange={(e) => setProductField("image", e.target.value)} className={inputCls} placeholder="https://…" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Image 2</label>
                    <input type="text" value={productModal.data.images?.[0] ?? ""} onChange={(e) => { const arr = [...(productModal.data.images || [])]; arr[0] = e.target.value; setProductField("images", arr.filter((_, i) => i < 3 || e.target.value)); }} className={inputCls} placeholder="https://…" />
                  </div>
                  <div>
                    <label className={labelCls}>Image 3</label>
                    <input type="text" value={productModal.data.images?.[1] ?? ""} onChange={(e) => { const arr = [...(productModal.data.images || [])]; arr[1] = e.target.value; setProductField("images", arr); }} className={inputCls} placeholder="https://…" />
                  </div>
                  <div>
                    <label className={labelCls}>Image 4</label>
                    <input type="text" value={productModal.data.images?.[2] ?? ""} onChange={(e) => { const arr = [...(productModal.data.images || [])]; arr[2] = e.target.value; setProductField("images", arr); }} className={inputCls} placeholder="https://…" />
                  </div>
                  <div>
                    <label className={labelCls}>🎬 Video URL (mp4 / YouTube)</label>
                    <input type="text" value={productModal.data.video_url ?? ""} onChange={(e) => setProductField("video_url", e.target.value)} className={inputCls} placeholder="https://… or youtube.com/…" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Variant Type</label>
                  <select value={productModal.data.variant_type} onChange={(e) => setProductField("variant_type", e.target.value)} className={inputCls}>
                    {["none","size","color"].map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Variants (comma separated)</label>
                  <input
                    type="text"
                    value={productModal.data.variants?.join(", ") ?? ""}
                    onChange={(e) => setProductField("variants", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))}
                    className={inputCls} placeholder="35,36,37 or Black,Brown"
                  />
                </div>
              </div>
              {productModal.data.category === "heels" && (
                <div className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Heel Details</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Heel Type</label>
                      <input type="text" value={productModal.data.heel_type ?? ""} onChange={(e) => setProductField("heel_type", e.target.value)} className={inputCls} placeholder="e.g. Block, Stiletto" />
                    </div>
                    <div>
                      <label className={labelCls}>Toe Style</label>
                      <input type="text" value={productModal.data.toe_style ?? ""} onChange={(e) => setProductField("toe_style", e.target.value)} className={inputCls} placeholder="e.g. Pointed, Round" />
                    </div>
                    <div>
                      <label className={labelCls}>Heel Height</label>
                      <input type="text" value={productModal.data.heel_height ?? ""} onChange={(e) => setProductField("heel_height", e.target.value)} className={inputCls} placeholder="e.g. 3 inch" />
                    </div>
                    <div>
                      <label className={labelCls}>Shoe Fit</label>
                      <input type="text" value={productModal.data.shoe_fit ?? ""} onChange={(e) => setProductField("shoe_fit", e.target.value)} className={inputCls} placeholder="e.g. True to size" />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                    <input type="checkbox" checked={productModal.data.ankle_strap ?? false} onChange={(e) => setProductField("ankle_strap", e.target.checked)} className="w-4 h-4 accent-[#3B5373]" />
                    Ankle Strap
                  </label>
                  <div>
                    <label className={labelCls}>Tags (comma separated) — used for occasion filter</label>
                    <input
                      type="text"
                      value={productModal.data.tags?.join(", ") ?? ""}
                      onChange={(e) => setProductField("tags", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))}
                      className={inputCls}
                      placeholder="e.g. heels, date, festive, block heel, black"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Tip: add &quot;date&quot;, &quot;festive&quot; or &quot;everyday&quot; to match occasion filters</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                {([
                  ["cod_available",  "COD Available"],
                  ["free_shipping",  "Free Shipping"],
                  ["is_featured",    "Is Featured"],
                  ["active",         "Active"],
                ] as [keyof DbProduct, string][]).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(productModal.data[key])}
                      onChange={(e) => setProductField(key, e.target.checked)}
                      className="w-4 h-4 accent-[#3B5373]"
                    />
                    {label}
                  </label>
                ))}
              </div>

              {/* ── Bundle Offers (Edit mode only) ── */}
              {productModal.mode === "edit" && (
                <div className="border border-[#3B5373]/20 rounded-xl overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-[#3B5373]/5 border-b border-[#3B5373]/10">
                    <span className="text-base">🎀</span>
                    <p className="text-xs font-semibold text-[#3B5373] uppercase tracking-wider">Style it with Clip-ons</p>
                    {bundleOffers.length > 0 && (
                      <span className="ml-auto bg-[#3B5373] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{bundleOffers.length} added</span>
                    )}
                  </div>

                  <div className="p-4 space-y-3">
                    {/* Existing offers — card list */}
                    {bundleOffersLoading ? (
                      <p className="text-xs text-gray-400 text-center py-2">Loading…</p>
                    ) : bundleOffers.length === 0 ? (
                      <p className="text-xs text-gray-400 text-center py-2">No accessories linked yet</p>
                    ) : (
                      <div className="space-y-2">
                        {bundleOffers.map((offer) => {
                          const acc = dbProducts.find(p => p.slug === offer.accessory_slug);
                          return (
                            <div key={offer.id} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 px-3 py-2.5 shadow-sm">
                              {/* Thumbnail */}
                              {acc?.image ? (
                                <img src={acc.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-gray-100" />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-lg">🎀</div>
                              )}
                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate">{acc?.title || offer.accessory_slug}</p>
                                <span className="inline-block mt-0.5 bg-green-50 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                  {offer.discount_value}{offer.discount_type === "percentage" ? "%" : "₹"} off when bought together
                                </span>
                              </div>
                              {/* Remove */}
                              <button
                                onClick={() => offer.id && deleteBundleOffer(offer.id)}
                                className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors group"
                                title="Remove"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-gray-300 group-hover:text-red-400 transition-colors" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Add new — inline row */}
                    <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">+ Add Accessory</p>
                      <input
                        type="text"
                        placeholder="Search product…"
                        value={bundleSearch}
                        onChange={(e) => setBundleSearch(e.target.value)}
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#3B5373]"
                      />
                      <select
                        value={newBundleOffer.accessory_slug}
                        onChange={(e) => setNewBundleOffer((prev) => ({ ...prev, accessory_slug: e.target.value }))}
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#3B5373]"
                        size={5}
                      >
                        <option value="">Choose product…</option>
                        {dbProducts
                          .filter((p) => !bundleSearch || p.title.toLowerCase().includes(bundleSearch.toLowerCase()))
                          .map((p) => (
                            <option key={p.slug} value={p.slug}>[{p.category}] {p.title}</option>
                          ))}
                      </select>
                      <div className="flex gap-2">
                        <select
                          value={newBundleOffer.discount_type}
                          onChange={(e) => setNewBundleOffer((prev) => ({ ...prev, discount_type: e.target.value }))}
                          className="flex-shrink-0 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#3B5373]"
                        >
                          <option value="percentage">% off</option>
                          <option value="flat">₹ off</option>
                        </select>
                        <input
                          type="number"
                          min={0}
                          value={newBundleOffer.discount_value || ""}
                          onChange={(e) => setNewBundleOffer((prev) => ({ ...prev, discount_value: Number(e.target.value) }))}
                          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#3B5373]"
                          placeholder="e.g. 20"
                        />
                        </div>
                      <input
                        type="text"
                        placeholder="Custom text (optional) e.g. 'Do pair khareedo aur bachao!'"
                        value={newBundleOffer.custom_label}
                        onChange={(e) => setNewBundleOffer((prev) => ({ ...prev, custom_label: e.target.value }))}
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#3B5373]"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={addBundleOffer}
                          disabled={bundleOfferSaving || !newBundleOffer.accessory_slug}
                          className="flex-shrink-0 flex items-center gap-1 px-4 py-2 bg-[#3B5373] text-white rounded-lg text-xs font-semibold hover:bg-[#2d3f4f] transition-colors disabled:opacity-40"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          {bundleOfferSaving ? "…" : "Add"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Color Variants (Edit mode only) ── */}
              {productModal.mode === "edit" && (
                <div className="border border-[#3B5373]/20 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 bg-[#3B5373]/5 border-b border-[#3B5373]/10">
                    <span className="text-base">🎨</span>
                    <p className="text-xs font-semibold text-[#3B5373] uppercase tracking-wider">Color Variants</p>
                    {colorVariants.length > 0 && (
                      <span className="ml-auto bg-[#3B5373] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{colorVariants.length}</span>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    {colorVariantsLoading ? (
                      <p className="text-xs text-gray-400 text-center py-2">Loading…</p>
                    ) : (
                      <>
                        <div>
                          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">This product&apos;s color</p>
                          <div className="flex gap-2 items-center">
                            <input type="text" placeholder="Color name (e.g. Black)" value={myColorInfo.color_name}
                              onChange={(e) => setMyColorInfo(p => ({ ...p, color_name: e.target.value }))}
                              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3B5373]" />
                            <input type="color" value={myColorInfo.color_hex}
                              onChange={(e) => setMyColorInfo(p => ({ ...p, color_hex: e.target.value }))}
                              className="w-10 h-9 rounded border border-gray-200 cursor-pointer p-0.5" />
                            <button onClick={saveMyColorInfo} disabled={colorVariantSaving || !myColorInfo.color_name}
                              className="px-3 py-2 bg-[#3B5373] text-white text-xs rounded-lg disabled:opacity-50">Set</button>
                          </div>
                        </div>
                        {colorVariants.filter(v => v.product_slug !== productModal.data?.slug).length > 0 && (
                          <div>
                            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Linked colors</p>
                            <div className="space-y-2">
                              {colorVariants.filter(v => v.product_slug !== productModal.data?.slug).map(v => (
                                <div key={v.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                  <div className="w-5 h-5 rounded-full border border-gray-200 flex-shrink-0" style={{ background: v.color_hex }} />
                                  <span className="text-xs font-medium text-gray-700 flex-1">{v.color_name}</span>
                                  <span className="text-xs text-gray-400">{v.product_slug}</span>
                                  <button onClick={() => removeColorVariant(v.id)} className="text-red-400 hover:text-red-600 text-xs px-2">×</button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div>
                          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Link another color variant</p>
                          <div className="space-y-2">
                            {/* Product selector */}
                            <select
                              value={newColorVariant.product_slug}
                              onChange={(e) => setNewColorVariant(p => ({ ...p, product_slug: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3B5373] bg-white"
                            >
                              <option value="">— Select a product —</option>
                              {dbProducts
                                .filter(p => p.slug !== productModal.data?.slug && !colorVariants.some(v => v.product_slug === p.slug))
                                .map(p => (
                                  <option key={p.slug} value={p.slug}>{p.title} ({p.slug})</option>
                                ))
                              }
                            </select>
                            {/* Color name + picker + link button */}
                            <div className="flex gap-2 items-center">
                              <input type="text" placeholder="Color name (e.g. Milk)" value={newColorVariant.color_name}
                                onChange={(e) => setNewColorVariant(p => ({ ...p, color_name: e.target.value }))}
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3B5373]" />
                              <input type="color" value={newColorVariant.color_hex}
                                onChange={(e) => setNewColorVariant(p => ({ ...p, color_hex: e.target.value }))}
                                className="w-10 h-9 rounded border border-gray-200 cursor-pointer p-0.5" title="Pick color" />
                              <div className="w-6 h-6 rounded-full border border-gray-200 flex-shrink-0" style={{ background: newColorVariant.color_hex }} />
                              <button onClick={addColorVariant} disabled={colorVariantSaving || !newColorVariant.product_slug || !newColorVariant.color_name}
                                className="px-4 py-2 bg-[#3B5373] text-white text-xs rounded-lg disabled:opacity-50 font-medium">Link</button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={closeProductModal} className="px-5 py-2 rounded-xl text-sm text-gray-500 border border-gray-200 hover:border-[#3B5373] transition-colors">
                Cancel
              </button>
              <button
                onClick={handleProductSave} disabled={productSaving}
                className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white rounded-xl text-sm font-medium hover:bg-[#2d3f4f] transition-colors disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {productSaving ? "Saving…" : productModal.mode === "add" ? "Add Product" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          HERO SLIDE MODAL
      ══════════════════════════════════════════════════ */}
      {slideModal.open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg my-8 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">
                {slideModal.mode === "add" ? "Add Hero Slide" : "Edit Hero Slide"}
              </h2>
              <button onClick={closeSlideModal} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className={labelCls}>Headline</label>
                <input type="text" value={slideModal.data.headline} onChange={(e) => setSlideField("headline", e.target.value)} className={inputCls} placeholder="e.g. Step Into Elegance" />
              </div>
              <div>
                <label className={labelCls}>Subheadline</label>
                <input type="text" value={slideModal.data.subheadline} onChange={(e) => setSlideField("subheadline", e.target.value)} className={inputCls} placeholder="e.g. Discover our latest collection" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>CTA Text</label>
                  <input type="text" value={slideModal.data.cta_text} onChange={(e) => setSlideField("cta_text", e.target.value)} className={inputCls} placeholder="e.g. Shop Now" />
                </div>
                <div>
                  <label className={labelCls}>CTA URL</label>
                  <input type="text" value={slideModal.data.cta_url} onChange={(e) => setSlideField("cta_url", e.target.value)} className={inputCls} placeholder="/shop/heels" />
                </div>
              </div>

              {/* Image URL with preview */}
              <div>
                <label className={labelCls}>Background Image URL</label>
                <input
                  type="text"
                  value={slideModal.data.image_url ?? ""}
                  onChange={(e) => setSlideField("image_url", e.target.value)}
                  className={inputCls}
                  placeholder="https://cdn.shopify.com/…"
                />
                {slideModal.data.image_url && (
                  <div className="mt-2 relative w-full h-24 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slideModal.data.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <p className="absolute top-1 left-2 text-[10px] text-white bg-black/50 px-1.5 py-0.5 rounded">Preview</p>
                  </div>
                )}
              </div>

              {/* Video URL */}
              <div>
                <label className={labelCls}>Background Video URL <span className="text-gray-400 normal-case font-normal">(optional, overrides image)</span></label>
                <input
                  type="text"
                  value={slideModal.data.video_url ?? ""}
                  onChange={(e) => setSlideField("video_url", e.target.value)}
                  className={inputCls}
                  placeholder="https://…/video.mp4"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Background Color (fallback)</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={slideModal.data.bg_color} onChange={(e) => setSlideField("bg_color", e.target.value)} className="w-10 h-9 rounded border border-gray-200 cursor-pointer flex-shrink-0" />
                    <input type="text" value={slideModal.data.bg_color} onChange={(e) => setSlideField("bg_color", e.target.value)} className={`${inputCls} flex-1`} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Text Align</label>
                  <select value={slideModal.data.text_align} onChange={(e) => setSlideField("text_align", e.target.value)} className={inputCls}>
                    {["left","center","right"].map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Display Order</label>
                <input type="number" value={slideModal.data.display_order} onChange={(e) => setSlideField("display_order", Number(e.target.value))} className={inputCls} />

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Page (kahan dikhega yeh slide?)</label>
                  <select value={slideModal.data.page ?? "home"} onChange={(e) => setSlideField("page", e.target.value)} className={inputCls}>
                    <option value="home">🏠 Home Page</option>
                    <option value="heels">👠 Heels Shop</option>
                    <option value="clips">💎 Clips Shop</option>
                    <option value="bow">🎀 Bow Shop</option>
                    <option value="style-ideas">✨ Style Ideas</option>
                    <option value="hot-deals">🔥 Hot Deals</option>
                    <option value="about">ℹ️ About Us</option>
                  </select>
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                <input type="checkbox" checked={slideModal.data.active} onChange={(e) => setSlideField("active", e.target.checked)} className="w-4 h-4 accent-[#3B5373]" />
                Active
              </label>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={closeSlideModal} className="px-5 py-2 rounded-xl text-sm text-gray-500 border border-gray-200 hover:border-[#3B5373] transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSlideSave} disabled={slideSaving}
                className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white rounded-xl text-sm font-medium hover:bg-[#2d3f4f] transition-colors disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {slideSaving ? "Saving…" : slideModal.mode === "add" ? "Add Slide" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          DELETE CONFIRM — PRODUCT
      ══════════════════════════════════════════════════ */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h2 className="font-semibold text-gray-800 mb-2">Delete Product?</h2>
            <p className="text-sm text-gray-400 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-5 py-2 rounded-xl text-sm border border-gray-200 text-gray-500 hover:border-[#3B5373] transition-colors">
                Cancel
              </button>
              <button onClick={() => deleteProduct(deleteConfirm)} className="px-5 py-2 rounded-xl text-sm bg-red-600 text-white hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          DELETE CONFIRM — SLIDE
      ══════════════════════════════════════════════════ */}
      {deleteSlideConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h2 className="font-semibold text-gray-800 mb-2">Delete Slide?</h2>
            <p className="text-sm text-gray-400 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteSlideConfirm(null)} className="px-5 py-2 rounded-xl text-sm border border-gray-200 text-gray-500 hover:border-[#3B5373] transition-colors">
                Cancel
              </button>
              <button onClick={() => deleteSlide(deleteSlideConfirm)} className="px-5 py-2 rounded-xl text-sm bg-red-600 text-white hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          FEATURES BAR MODAL
      ══════════════════════════════════════════════════ */}
      {featuresBarModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">
                {featuresBarModal.mode === "add" ? "Add Feature" : "Edit Feature"}
              </h2>
              <button onClick={closeFeaturesBarModal} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className={labelCls}>Icon (emoji)</label>
                <input type="text" value={featuresBarModal.data.icon} onChange={(e) => setFeatureField("icon", e.target.value)} className={inputCls} placeholder="e.g. 🚚" />
              </div>
              <div>
                <label className={labelCls}>Title *</label>
                <input type="text" value={featuresBarModal.data.title} onChange={(e) => setFeatureField("title", e.target.value)} className={inputCls} placeholder="e.g. Free Shipping" />
              </div>
              <div>
                <label className={labelCls}>Subtitle</label>
                <input type="text" value={featuresBarModal.data.subtitle ?? ""} onChange={(e) => setFeatureField("subtitle", e.target.value)} className={inputCls} placeholder="e.g. On orders above ₹999" />
              </div>
              <div>
                <label className={labelCls}>Display Order</label>
                <input type="number" value={featuresBarModal.data.display_order} onChange={(e) => setFeatureField("display_order", Number(e.target.value))} className={inputCls} />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                <input type="checkbox" checked={featuresBarModal.data.active} onChange={(e) => setFeatureField("active", e.target.checked)} className="w-4 h-4 accent-[#3B5373]" />
                Active
              </label>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={closeFeaturesBarModal} className="px-5 py-2 rounded-xl text-sm text-gray-500 border border-gray-200 hover:border-[#3B5373] transition-colors">
                Cancel
              </button>
              <button
                onClick={handleFeatureSave} disabled={featuresBarSaving}
                className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white rounded-xl text-sm font-medium hover:bg-[#2d3f4f] transition-colors disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {featuresBarSaving ? "Saving…" : featuresBarModal.mode === "add" ? "Add Feature" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          COLLECTION EDIT MODAL
      ══════════════════════════════════════════════════ */}
      {collectionModal.open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg my-8 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">{collectionModalMode === "add" ? "Add Collection" : "Edit Collection"}</h2>
              <button onClick={closeCollectionModal} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Title</label>
                  <input type="text" value={collectionModal.data.title} onChange={(e) => {
                    const title = e.target.value;
                    setCollectionField("title", title);
                    // Auto-fill slug only if user hasn't manually typed one
                    if (collectionModalMode === "add" && !slugManuallyEdited) {
                      const autoSlug = title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                      setCollectionField("slug", autoSlug);
                    }
                  }} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Slug</label>
                  <input type="text" value={collectionModal.data.slug} onChange={(e) => {
                    setSlugManuallyEdited(true);
                    setCollectionField("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
                  }} className={inputCls} placeholder="e.g. summer-edit" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea rows={2} value={collectionModal.data.description ?? ""} onChange={(e) => setCollectionField("description", e.target.value)} className={inputCls} placeholder="Collection description…" />
              </div>
              <div>
                <label className={labelCls}>Main Image URL</label>
                <input type="text" value={collectionModal.data.image_url ?? ""} onChange={(e) => setCollectionField("image_url", e.target.value)} className={inputCls} placeholder="https://cdn.shopify.com/…" />
                {collectionModal.data.image_url && (
                  <div className="mt-3 space-y-3">
                    {/* Crop position selector */}
                    <p className="text-[10px] font-medium tracking-[0.15em] uppercase text-gray-400">Focal Point — image pe tap karo jahan focus chahiye</p>
                    <div className="grid grid-cols-2 gap-3">
                      {/* LEFT: Full image with draggable focal dot */}
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1">👆 Yahan click karo</p>
                        <div
                          className="relative overflow-hidden bg-gray-100 cursor-crosshair"
                          style={{ width: "100%", paddingBottom: "130%" }}
                          onClick={(e) => {
                            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                            const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                            const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
                            setCollectionField("image_position", `${x}% ${y}%`);
                          }}
                        >
                          <div style={{
                            position: "absolute", inset: 0,
                            backgroundImage: `url(${collectionModal.data.image_url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat"
                          }} />
                          {/* Focal point dot */}
                          {(() => {
                            const pos = collectionModal.data.image_position ?? "50% 50%";
                            const parts = pos.replace(/%/g, "").split(" ");
                            const fx = parseFloat(parts[0]) || 50;
                            const fy = parseFloat(parts[1]) || 50;
                            return (
                              <div style={{
                                position: "absolute",
                                left: `${fx}%`, top: `${fy}%`,
                                transform: "translate(-50%, -50%)",
                                width: 22, height: 22,
                                border: "3px solid white",
                                borderRadius: "50%",
                                background: "#3B5373",
                                boxShadow: "0 0 0 2px rgba(0,0,0,0.4)",
                                pointerEvents: "none"
                              }} />
                            );
                          })()}
                        </div>
                      </div>
                      {/* RIGHT: Card preview showing crop result */}
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1">📱 Site pe aise dikhega</p>
                        <div className="relative overflow-hidden bg-gray-900" style={{ width: "100%", paddingBottom: "130%" }}>
                          <div className="absolute inset-0">
                            <div style={{
                              position: "absolute", inset: 0,
                              backgroundImage: `url(${collectionModal.data.image_url})`,
                              backgroundSize: "cover",
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: collectionModal.data.image_position ?? "50% 50%"
                            }} />
                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, transparent 35%, rgba(26,26,26,0.82) 100%)" }} />
                            <div style={{ position: "absolute", bottom: 0, left: 0, padding: "14px" }}>
                              {collectionModal.data.tag_label && (
                                <p style={{ fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginBottom: "5px" }}>
                                  {collectionModal.data.tag_label}
                                </p>
                              )}
                              <p style={{ fontFamily: "Georgia,serif", fontSize: "15px", fontWeight: 300, color: "white", lineHeight: 1.2, marginBottom: "7px" }}>
                                {collectionModal.data.title || "Title"}
                              </p>
                              <p style={{ fontFamily: "monospace", fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
                                Shop Now →
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className={labelCls}>Hover Image URL (optional — hover pe swap hogi)</label>
                <input type="text" value={collectionModal.data.hover_image_url ?? ""} onChange={(e) => setCollectionField("hover_image_url", e.target.value)} className={inputCls} placeholder="https://… (optional)" />
                {collectionModal.data.hover_image_url && (
                  <div className="relative h-28 rounded-xl overflow-hidden mt-2 bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={collectionModal.data.hover_image_url} alt="Hover Preview" className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <p className="absolute top-1 left-2 text-[10px] text-white bg-black/50 px-1.5 py-0.5 rounded">Hover Preview</p>
                  </div>
                )}
              </div>
              <div>
                <label className={labelCls}>Tag Label <span className="normal-case text-gray-400 font-normal">(shown as eyebrow on card — e.g. NEW IN / FESTIVE / EXCLUSIVE)</span></label>
                <input type="text" value={collectionModal.data.tag_label ?? ""} onChange={(e) => setCollectionField("tag_label", e.target.value)} className={inputCls} placeholder="NEW IN / FESTIVE / EXCLUSIVE" />
              </div>
              <div>
                <label className={labelCls}>Display Order</label>
                <input type="number" value={collectionModal.data.display_order} onChange={(e) => setCollectionField("display_order", Number(e.target.value))} className={`${inputCls} max-w-[120px]`} />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                <input type="checkbox" checked={collectionModal.data.active} onChange={(e) => setCollectionField("active", e.target.checked)} className="w-4 h-4 accent-[#3B5373]" />
                Active
              </label>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={closeCollectionModal} className="px-5 py-2 rounded-xl text-sm text-gray-500 border border-gray-200 hover:border-[#3B5373] transition-colors">
                Cancel
              </button>
              <button
                onClick={handleCollectionSave} disabled={collectionSaving}
                className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white rounded-xl text-sm font-medium hover:bg-[#2d3f4f] transition-colors disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {collectionSaving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          DELETE CONFIRM — FEATURE
      ══════════════════════════════════════════════════ */}
      {deleteFeatureConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h2 className="font-semibold text-gray-800 mb-2">Delete Feature?</h2>
            <p className="text-sm text-gray-400 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteFeatureConfirm(null)} className="px-5 py-2 rounded-xl text-sm border border-gray-200 text-gray-500 hover:border-[#3B5373] transition-colors">
                Cancel
              </button>
              <button onClick={() => deleteFeature(deleteFeatureConfirm)} className="px-5 py-2 rounded-xl text-sm bg-red-600 text-white hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          SITE CATEGORY MODAL
      ══════════════════════════════════════════════════ */}
      {categoryModal.open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg my-8 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">{categoryModal.mode === "add" ? "Add Category" : "Edit Category"}</h2>
              <button onClick={closeCategoryModal} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Name *</label>
                  <input type="text" value={categoryModal.data.name} onChange={(e) => {
                    const name = e.target.value;
                    setCategoryField("name", name);
                    if (categoryModal.mode === "add" && !categorySlugManuallyEdited) {
                      const autoSlug = name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                      setCategoryField("slug", autoSlug);
                    }
                  }} className={inputCls} placeholder="e.g. Heels" />
                </div>
                <div>
                  <label className={labelCls}>Slug *</label>
                  <input type="text" value={categoryModal.data.slug} onChange={(e) => {
                    setCategorySlugManuallyEdited(true);
                    setCategoryField("slug", e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
                  }} className={inputCls} placeholder="e.g. heels" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea rows={2} value={categoryModal.data.description} onChange={(e) => setCategoryField("description", e.target.value)} className={inputCls} placeholder="Short description…" />
              </div>
              <div>
                <label className={labelCls}>Image URL</label>
                <input type="text" value={categoryModal.data.image_url} onChange={(e) => setCategoryField("image_url", e.target.value)} className={inputCls} placeholder="https://cdn.shopify.com/…" />
                {categoryModal.data.image_url && (
                  <div className="mt-2 relative w-full h-28 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={categoryModal.data.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <p className="absolute top-1 left-2 text-[10px] text-white bg-black/50 px-1.5 py-0.5 rounded">Preview</p>
                  </div>
                )}
              </div>
              <div>
                <label className={labelCls}>Display Order</label>
                <input type="number" value={categoryModal.data.display_order} onChange={(e) => setCategoryField("display_order", Number(e.target.value))} className={`${inputCls} max-w-[120px]`} />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                <input type="checkbox" checked={categoryModal.data.active} onChange={(e) => setCategoryField("active", e.target.checked)} className="w-4 h-4 accent-[#3B5373]" />
                Active
              </label>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={closeCategoryModal} className="px-5 py-2 rounded-xl text-sm text-gray-500 border border-gray-200 hover:border-[#3B5373] transition-colors">
                Cancel
              </button>
              <button
                onClick={handleCategorySave} disabled={categorySaving}
                className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white rounded-xl text-sm font-medium hover:bg-[#2d3f4f] transition-colors disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {categorySaving ? "Saving…" : categoryModal.mode === "add" ? "Add Category" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          DELETE CONFIRM — CATEGORY
      ══════════════════════════════════════════════════ */}
      {deleteCategoryConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h2 className="font-semibold text-gray-800 mb-2">Delete Category?</h2>
            <p className="text-sm text-gray-400 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteCategoryConfirm(null)} className="px-5 py-2 rounded-xl text-sm border border-gray-200 text-gray-500 hover:border-[#3B5373] transition-colors">
                Cancel
              </button>
              <button onClick={() => deleteCategory(deleteCategoryConfirm)} className="px-5 py-2 rounded-xl text-sm bg-red-600 text-white hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          FEATURED PICKS MANAGE MODAL
      ══════════════════════════════════════════════════ */}
      {featuredPicksModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="font-semibold text-gray-800">
                  {featuredPicksModal.tab === 'latest' ? 'Manage Latest Styles' : featuredPicksModal.tab === 'bestseller' ? 'Manage Best Sellers' : 'Manage On Sale'}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">{featuredPicksModal.selectedIds.length} selected</p>
              </div>
              <button onClick={() => setFeaturedPicksModal(m => ({ ...m, open: false }))} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            {/* Search */}
            <div className="px-5 py-3 border-b border-gray-50">
              <input
                type="text"
                value={featuredPicksModal.search}
                onChange={(e) => setFeaturedPicksModal(m => ({ ...m, search: e.target.value }))}
                placeholder="Search products…"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3B5373] transition-colors"
              />
            </div>
            {/* Product list */}
            <div className="overflow-y-auto flex-1 p-5 space-y-1">
              {allActiveProducts
                .filter(p => !featuredPicksModal.search || p.title.toLowerCase().includes(featuredPicksModal.search.toLowerCase()))
                .map(p => {
                  const checked = featuredPicksModal.selectedIds.includes(p.id!);
                  return (
                    <label key={p.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer group">
                      <input type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFeaturedPicksModal(m => ({ ...m, selectedIds: [...m.selectedIds, p.id!] }));
                          } else {
                            setFeaturedPicksModal(m => ({ ...m, selectedIds: m.selectedIds.filter(id => id !== p.id) }));
                          }
                        }}
                        className="w-4 h-4 accent-[#3B5373] cursor-pointer flex-shrink-0"
                      />
                      {p.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image} alt={p.title} className="w-10 h-10 object-cover rounded flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                        <p className="text-xs text-gray-400">₹{p.price.toLocaleString('en-IN')} · {p.category}</p>
                      </div>
                      {p.featured_tab && p.featured_tab !== featuredPicksModal.tab && (
                        <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full flex-shrink-0">
                          {p.featured_tab === 'latest' ? 'Latest' : p.featured_tab === 'bestseller' ? 'Best Seller' : 'On Sale'}
                        </span>
                      )}
                    </label>
                  );
                })}
            </div>
            {/* Footer */}
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setFeaturedPicksModal(m => ({ ...m, open: false }))} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
              <button
                onClick={async () => {
                  setFeaturedPicksModal(m => ({ ...m, saving: true }));
                  const { tab: picksTab, selectedIds } = featuredPicksModal;
                  // Products that were in this tab before
                  const wasInTab = (picksTab === 'latest' ? latestProducts : picksTab === 'bestseller' ? bestSellerProducts : saleProducts).map(p => p.id!);
                  // Assign selected ones
                  for (const id of selectedIds) {
                    await supabase.from('products').update({ featured_tab: picksTab }).eq('id', id);
                  }
                  // Clear ones that were in tab but are now unchecked (don't touch the other tab)
                  const toRemove = wasInTab.filter(id => !selectedIds.includes(id));
                  for (const id of toRemove) {
                    await supabase.from('products').update({ featured_tab: null }).eq('id', id);
                  }
                  await fetchFeaturedPicks();
                  setFeaturedPicksModal(m => ({ ...m, open: false, saving: false }));
                }}
                disabled={featuredPicksModal.saving}
                className="px-6 py-2 bg-[#3B5373] text-white rounded-lg text-sm font-medium hover:bg-[#2d3f4f] disabled:opacity-50"
              >
                {featuredPicksModal.saving ? 'Saving…' : `Save (${featuredPicksModal.selectedIds.length} selected)`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          MANAGE CATEGORY PRODUCTS MODAL
      ══════════════════════════════════════════════════ */}
      {manageCategoryProductsModal.open && manageCategoryProductsModal.category && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="font-semibold text-gray-800">Manage Products</h2>
                <p className="text-xs text-gray-400 mt-0.5">{manageCategoryProductsModal.category.name} — {categoryProductIds.length} selected</p>
              </div>
              <button onClick={() => setManageCategoryProductsModal(m => ({ ...m, open: false }))} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            {/* Search + select controls */}
            <div className="px-5 py-3 border-b border-gray-50 flex items-center gap-3">
              <input
                type="text"
                placeholder="Search products…"
                value={manageCategoryProductsModal.search}
                onChange={e => setManageCategoryProductsModal(m => ({ ...m, search: e.target.value }))}
                className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#3B5373]"
              />
              <button onClick={() => setCategoryProductIds(allProductsForCategoryModal.map(p => p.id!))}
                className="text-xs text-[#3B5373] hover:underline">Select All</button>
              <span className="text-gray-300">|</span>
              <button onClick={() => setCategoryProductIds([])}
                className="text-xs text-gray-400 hover:underline">Clear</button>
            </div>
            {/* Product list */}
            <div className="overflow-y-auto flex-1 p-5 space-y-2">
              {allProductsForCategoryModal
                .filter(p => !manageCategoryProductsModal.search || p.title.toLowerCase().includes(manageCategoryProductsModal.search.toLowerCase()))
                .map(p => (
                <label key={p.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer group">
                  <input type="checkbox"
                    checked={categoryProductIds.includes(p.id!)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setCategoryProductIds(prev => [...prev, p.id!]);
                      } else {
                        setCategoryProductIds(prev => prev.filter(id => id !== p.id));
                      }
                    }}
                    className="w-4 h-4 accent-[#3B5373] cursor-pointer"
                  />
                  {p.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.title} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                    <p className="text-xs text-gray-400">₹{p.price.toLocaleString('en-IN')} · {p.category}</p>
                  </div>
                </label>
              ))}
            </div>
            {/* Footer */}
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setManageCategoryProductsModal(m => ({ ...m, open: false }))}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
              <button onClick={saveManageCategoryProducts} disabled={manageCategoryProductsModal.saving}
                className="px-6 py-2 bg-[#3B5373] text-white rounded-lg text-sm font-medium hover:bg-[#2d3f4f] disabled:opacity-50">
                {manageCategoryProductsModal.saving ? "Saving…" : `Save (${categoryProductIds.length} products)`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          MANAGE PRODUCTS MODAL
      ══════════════════════════════════════════════════ */}
      {manageProductsModal.open && manageProductsModal.collection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="font-semibold text-gray-800">Manage Products</h2>
                <p className="text-xs text-gray-400 mt-0.5">{manageProductsModal.collection.title} — {manageProductsModal.selectedSlugs.length} selected</p>
              </div>
              <button onClick={() => setManageProductsModal(m => ({ ...m, open: false }))} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            {/* Select all / clear */}
            <div className="px-5 py-3 border-b border-gray-50 flex items-center gap-3">
              <button onClick={() => setManageProductsModal(m => ({ ...m, selectedSlugs: dbProducts.map(p => p.slug) }))}
                className="text-xs text-[#3B5373] hover:underline">Select All</button>
              <span className="text-gray-300">|</span>
              <button onClick={() => setManageProductsModal(m => ({ ...m, selectedSlugs: [] }))}
                className="text-xs text-gray-400 hover:underline">Clear All</button>
            </div>
            {/* Product list */}
            <div className="overflow-y-auto flex-1 p-5 space-y-2">
              {dbProducts.map(p => (
                <label key={p.slug} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer group">
                  <input type="checkbox"
                    checked={manageProductsModal.selectedSlugs.includes(p.slug)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setManageProductsModal(m => ({ ...m, selectedSlugs: [...m.selectedSlugs, p.slug] }));
                      } else {
                        setManageProductsModal(m => ({ ...m, selectedSlugs: m.selectedSlugs.filter(s => s !== p.slug) }));
                      }
                    }}
                    className="w-4 h-4 accent-[#3B5373] cursor-pointer"
                  />
                  {p.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.title} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                    <p className="text-xs text-gray-400">₹{p.price.toLocaleString('en-IN')} · {p.category}</p>
                  </div>
                </label>
              ))}
            </div>
            {/* Footer */}
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setManageProductsModal(m => ({ ...m, open: false }))} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
              <button onClick={saveManageProducts} disabled={manageProductsModal.saving}
                className="px-6 py-2 bg-[#3B5373] text-white rounded-xl text-sm font-medium hover:bg-[#2d3f4f] disabled:opacity-50">
                {manageProductsModal.saving ? "Saving…" : `Save (${manageProductsModal.selectedSlugs.length} products)`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          TESTIMONIAL MODAL
      ══════════════════════════════════════════════════ */}
      {testimonialModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">{testimonialModal.mode === "add" ? "Add Review" : "Edit Review"}</h2>
              <button onClick={() => setTestimonialModal(m => ({ ...m, open: false }))} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className={labelCls}>Customer Name *</label>
                <input className={inputCls} value={testimonialModal.data.customer_name}
                  onChange={e => setTestimonialModal(m => ({ ...m, data: { ...m.data, customer_name: e.target.value } }))} placeholder="e.g. Priya S." />
              </div>
              <div>
                <label className={labelCls}>Location</label>
                <input className={inputCls} value={testimonialModal.data.location}
                  onChange={e => setTestimonialModal(m => ({ ...m, data: { ...m.data, location: e.target.value } }))} placeholder="e.g. Mumbai" />
              </div>
              <div>
                <label className={labelCls}>Review Text *</label>
                <textarea className={inputCls} rows={3} value={testimonialModal.data.review_text}
                  onChange={e => setTestimonialModal(m => ({ ...m, data: { ...m.data, review_text: e.target.value } }))} placeholder="Customer review..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Rating (1-5)</label>
                  <input type="number" min={1} max={5} className={inputCls} value={testimonialModal.data.rating}
                    onChange={e => setTestimonialModal(m => ({ ...m, data: { ...m.data, rating: parseInt(e.target.value) || 5 } }))} />
                </div>
                <div>
                  <label className={labelCls}>Display Order</label>
                  <input type="number" className={inputCls} value={testimonialModal.data.display_order}
                    onChange={e => setTestimonialModal(m => ({ ...m, data: { ...m.data, display_order: parseInt(e.target.value) || 0 } }))} />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={testimonialModal.data.active}
                  onChange={e => setTestimonialModal(m => ({ ...m, data: { ...m.data, active: e.target.checked } }))}
                  className="w-4 h-4 accent-[#3B5373]" />
                <span className="text-sm text-gray-600">Active (show on website)</span>
              </label>
            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setTestimonialModal(m => ({ ...m, open: false }))} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
              <button disabled={testimonialSaving} onClick={async () => {
                setTestimonialSaving(true);
                try {
                  const d = testimonialModal.data;
                  if (testimonialModal.mode === "add") {
                    await supabase.from("testimonials").insert([{ ...d }]);
                  } else {
                    await supabase.from("testimonials").update({ ...d }).eq("id", d.id!);
                  }
                  await fetchTestimonials();
                  setTestimonialModal(m => ({ ...m, open: false }));
                } catch { /* ignore */ }
                finally { setTestimonialSaving(false); }
              }} className="px-6 py-2 bg-[#3B5373] text-white rounded-xl text-sm font-medium hover:bg-[#2d3f4f] disabled:opacity-50">
                {testimonialSaving ? "Saving…" : "Save Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          INSTAGRAM IMAGE MODAL
      ══════════════════════════════════════════════════ */}
      {instagramModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">{instagramModal.mode === "add" ? "Add Instagram Image" : "Edit Instagram Image"}</h2>
              <button onClick={() => setInstagramModal(m => ({ ...m, open: false }))} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className={labelCls}>Image URL *</label>
                <input className={inputCls} value={instagramModal.data.image_url}
                  onChange={e => setInstagramModal(m => ({ ...m, data: { ...m.data, image_url: e.target.value } }))} placeholder="https://..." />
              </div>
              <div>
                <label className={labelCls}>Link URL</label>
                <input className={inputCls} value={instagramModal.data.link_url}
                  onChange={e => setInstagramModal(m => ({ ...m, data: { ...m.data, link_url: e.target.value } }))} placeholder="https://instagram.com/..." />
              </div>
              <div>
                <label className={labelCls}>Display Order</label>
                <input type="number" className={inputCls} value={instagramModal.data.display_order}
                  onChange={e => setInstagramModal(m => ({ ...m, data: { ...m.data, display_order: parseInt(e.target.value) || 0 } }))} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={instagramModal.data.active}
                  onChange={e => setInstagramModal(m => ({ ...m, data: { ...m.data, active: e.target.checked } }))}
                  className="w-4 h-4 accent-[#3B5373]" />
                <span className="text-sm text-gray-600">Active</span>
              </label>
            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setInstagramModal(m => ({ ...m, open: false }))} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
              <button disabled={instagramSaving} onClick={async () => {
                setInstagramSaving(true);
                try {
                  const d = instagramModal.data;
                  if (instagramModal.mode === "add") {
                    await supabase.from("instagram_images").insert([{ ...d }]);
                  } else {
                    await supabase.from("instagram_images").update({ ...d }).eq("id", d.id!);
                  }
                  await revalidateSite();
                  await fetchInstagramImages();
                  setInstagramModal(m => ({ ...m, open: false }));
                } catch { /* ignore */ }
                finally { setInstagramSaving(false); }
              }} className="px-6 py-2 bg-[#3B5373] text-white rounded-xl text-sm font-medium hover:bg-[#2d3f4f] disabled:opacity-50">
                {instagramSaving ? "Saving…" : "Save Image"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          STYLE INSPO MODAL
      ══════════════════════════════════════════════════ */}
      {styleInspoModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="font-semibold text-gray-800">{styleInspoModal.mode === "add" ? "Add Look Card" : "Edit Look Card"}</h2>
              <button onClick={() => setStyleInspoModal(m => ({ ...m, open: false }))} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Title */}
              <div>
                <label className={labelCls}>Look Title</label>
                <input className={inputCls} value={styleInspoModal.data.title}
                  onChange={e => setStyleInspoModal(m => ({ ...m, data: { ...m.data, title: e.target.value } }))} placeholder="e.g. The Date Night Look" />
              </div>
              {/* Description */}
              <div>
                <label className={labelCls}>Description</label>
                <textarea rows={2} className={`${inputCls} resize-none`} value={styleInspoModal.data.description || ""}
                  onChange={e => setStyleInspoModal(m => ({ ...m, data: { ...m.data, description: e.target.value } }))} placeholder="Short description of this look..." />
              </div>
              {/* Occasion */}
              <div>
                <label className={labelCls}>Occasion (Filter Tab)</label>
                <select className={inputCls} value={styleInspoModal.data.tag}
                  onChange={e => setStyleInspoModal(m => ({ ...m, data: { ...m.data, tag: e.target.value } }))}>
                  <option value="">— Select Occasion —</option>
                  {siOccasions.filter(o=>o!=="All Looks").map(o=>(
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              {/* Media Type */}
              <div>
                <label className={labelCls}>Media Type</label>
                <div className="flex gap-2">
                  {(["image","video"] as const).map(t=>(
                    <button key={t} type="button" onClick={()=>setStyleInspoModal(m=>({...m,data:{...m.data,media_type:t}}))}
                      className={`px-4 py-2 text-xs font-medium border rounded-lg capitalize transition-colors ${styleInspoModal.data.media_type===t?"bg-[#3B5373] text-white border-[#3B5373]":"border-gray-200 text-gray-500 hover:border-[#3B5373]"}`}>
                      {t==="image"?"🖼 Image":"📹 Video"}
                    </button>
                  ))}
                </div>
              </div>
              {/* Media URL */}
              <div>
                <label className={labelCls}>{styleInspoModal.data.media_type==="video"?"Video URL (mp4)":"Image URL"}</label>
                <input className={inputCls} value={styleInspoModal.data.image_url}
                  onChange={e => setStyleInspoModal(m => ({ ...m, data: { ...m.data, image_url: e.target.value } }))}
                  placeholder={styleInspoModal.data.media_type==="video"?"https://...mp4":"https://...jpg"} />
                {styleInspoModal.data.image_url && styleInspoModal.data.media_type==="image" && (
                  <img src={styleInspoModal.data.image_url} alt="preview" className="mt-2 h-24 w-full object-cover rounded-lg object-top" onError={e=>{(e.target as HTMLImageElement).style.display="none"}}/>
                )}
              </div>
              {/* Look Number + Order */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Look Number</label>
                  <input type="number" className={inputCls} value={styleInspoModal.data.look_number || 0}
                    onChange={e => setStyleInspoModal(m => ({ ...m, data: { ...m.data, look_number: parseInt(e.target.value)||0 } }))} placeholder="1" />
                </div>
                <div>
                  <label className={labelCls}>Display Order</label>
                  <input type="number" className={inputCls} value={styleInspoModal.data.display_order}
                    onChange={e => setStyleInspoModal(m => ({ ...m, data: { ...m.data, display_order: parseInt(e.target.value)||0 } }))} />
                </div>
              </div>
              {/* Active */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={styleInspoModal.data.active}
                  onChange={e => setStyleInspoModal(m => ({ ...m, data: { ...m.data, active: e.target.checked } }))}
                  className="w-4 h-4 accent-[#3B5373]" />
                <span className="text-sm text-gray-600">Active (show on website)</span>
              </label>
            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setStyleInspoModal(m => ({ ...m, open: false }))} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
              <button disabled={styleInspoSaving} onClick={async () => {
                setStyleInspoSaving(true);
                try {
                  const d = styleInspoModal.data;
                  const payload = { title: d.title, image_url: d.image_url, link_url: d.link_url || "", tag: d.tag, display_order: d.display_order, active: d.active, description: d.description || "", media_type: d.media_type || "image", look_number: d.look_number || 0 };
                  if (styleInspoModal.mode === "add") {
                    await supabase.from("style_inspo").insert([payload]);
                  } else {
                    await supabase.from("style_inspo").update(payload).eq("id", d.id!);
                  }
                  await fetchStyleInspos();
                  await revalidateSite();
                  setStyleInspoModal(m => ({ ...m, open: false }));
                } catch { /* ignore */ }
                finally { setStyleInspoSaving(false); }
              }} className="px-6 py-2 bg-[#3B5373] text-white rounded-xl text-sm font-medium hover:bg-[#2d3f4f] disabled:opacity-50">
                {styleInspoSaving ? "Saving…" : "Save Look"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          COUPON MODAL (Add / Edit)
      ══════════════════════════════════════════════════ */}
      {couponModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">{couponModal.mode === "add" ? "Add Coupon" : "Edit Coupon"}</h2>
              <button onClick={() => setCouponModal(m => ({ ...m, open: false }))} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {/* Code */}
                <div>
                  <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Code <span className="text-red-400">*</span></p>
                  <input type="text" value={couponModal.data.code || ""} onChange={e => setCouponModal(m => ({ ...m, data: { ...m.data, code: e.target.value.toUpperCase() } }))}
                    className={inputCls + " font-mono tracking-widest"} placeholder="SAVE10" />
                </div>
                {/* Display Order */}
                <div>
                  <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Display Order</p>
                  <input type="number" value={couponModal.data.display_order ?? 0} onChange={e => setCouponModal(m => ({ ...m, data: { ...m.data, display_order: parseInt(e.target.value) || 0 } }))}
                    className={inputCls} />
                </div>
              </div>
              {/* Title */}
              <div>
                <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Title</p>
                <input type="text" value={couponModal.data.title || ""} onChange={e => setCouponModal(m => ({ ...m, data: { ...m.data, title: e.target.value } }))}
                  className={inputCls} placeholder="10% Off Sitewide" />
              </div>
              {/* Description */}
              <div>
                <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Description</p>
                <textarea rows={2} value={couponModal.data.description || ""} onChange={e => setCouponModal(m => ({ ...m, data: { ...m.data, description: e.target.value } }))}
                  className={inputCls + " resize-none"} placeholder="Use at checkout to save on your order." />
              </div>
              {/* Image URL */}
              <div>
                <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Card Image URL <span className="normal-case text-gray-300">— shown on Hot Deals page</span></p>
                <input type="text" value={couponModal.data.image_url || ""} onChange={e => setCouponModal(m => ({ ...m, data: { ...m.data, image_url: e.target.value } }))}
                  className={inputCls} placeholder="https://..." />
                {couponModal.data.image_url && (
                  <img src={couponModal.data.image_url} alt="preview" className="mt-2 h-20 w-full object-cover rounded-lg" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                )}
              </div>
              {/* Discount Type + Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">Discount Type</p>
                  <div className="flex gap-2">
                    {(["percent", "flat"] as const).map(t => (
                      <button key={t} type="button" onClick={() => setCouponModal(m => ({ ...m, data: { ...m.data, discount_type: t } }))}
                        className={`flex-1 py-2 text-xs font-semibold border rounded-lg transition-colors ${couponModal.data.discount_type === t ? "bg-[#3B5373] text-white border-[#3B5373]" : "border-gray-200 text-gray-500 hover:border-[#3B5373]"}`}>
                        {t === "percent" ? "% Percent" : "₹ Flat Amount"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">
                    Discount Value {couponModal.data.discount_type === "percent" ? "(%)" : "(₹)"}
                  </p>
                  <input type="number" min={0} value={couponModal.data.discount_value ?? 0} onChange={e => setCouponModal(m => ({ ...m, data: { ...m.data, discount_value: parseFloat(e.target.value) || 0 } }))}
                    className={inputCls} />
                </div>
              </div>
              {/* Min Order Value */}
              <div>
                <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Min Order Value (₹) <span className="normal-case text-gray-300">— 0 = no minimum</span></p>
                <input type="number" min={0} value={couponModal.data.min_order_value ?? 0} onChange={e => setCouponModal(m => ({ ...m, data: { ...m.data, min_order_value: parseFloat(e.target.value) || 0 } }))}
                  className={inputCls} placeholder="0" />
              </div>
              {/* Uses */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Max Total Uses <span className="normal-case text-gray-300">— empty = unlimited</span></p>
                  <input type="number" min={0} value={couponModal.data.max_uses_total ?? ""} onChange={e => setCouponModal(m => ({ ...m, data: { ...m.data, max_uses_total: e.target.value === "" ? null : parseInt(e.target.value) } }))}
                    className={inputCls} placeholder="Unlimited" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Max Uses Per User</p>
                  <input type="number" min={1} value={couponModal.data.max_uses_per_user ?? 1} onChange={e => setCouponModal(m => ({ ...m, data: { ...m.data, max_uses_per_user: parseInt(e.target.value) || 1 } }))}
                    className={inputCls} />
                </div>
              </div>
              {/* Valid dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Valid From <span className="normal-case text-gray-300">— optional</span></p>
                  <input type="date" value={couponModal.data.valid_from ? couponModal.data.valid_from.slice(0, 10) : ""} onChange={e => setCouponModal(m => ({ ...m, data: { ...m.data, valid_from: e.target.value || null } }))}
                    className={inputCls} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Valid Until <span className="normal-case text-gray-300">— optional</span></p>
                  <input type="date" value={couponModal.data.valid_until ? couponModal.data.valid_until.slice(0, 10) : ""} onChange={e => setCouponModal(m => ({ ...m, data: { ...m.data, valid_until: e.target.value || null } }))}
                    className={inputCls} />
                </div>
              </div>
              {/* Toggles */}
              <div className="grid grid-cols-3 gap-4">
                {([
                  { key: "active", label: "Active" },
                  { key: "require_phone", label: "Require Phone" },
                  { key: "require_email", label: "Require Email" },
                ] as const).map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <button type="button" onClick={() => setCouponModal(m => ({ ...m, data: { ...m.data, [key]: !m.data[key] } }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${couponModal.data[key] ? "bg-[#3B5373]" : "bg-gray-200"}`}>
                      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${couponModal.data[key] ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                    <span className="text-xs text-gray-600">{label}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Footer */}
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setCouponModal(m => ({ ...m, open: false }))} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Cancel</button>
              <button disabled={couponSaving} onClick={saveCoupon}
                className="px-6 py-2 bg-[#3B5373] text-white rounded-xl text-sm font-medium hover:bg-[#2d3f4f] disabled:opacity-50">
                {couponSaving ? "Saving…" : couponModal.mode === "add" ? "Add Coupon" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── AdvGridPanel ──────────────────────────────────────────────────────────────

function AdvGridPanel({ title, desc, section, mobile, setMobile, desktop, setDesktop, gap, setGap, saving, onSave, noMobile, aspect, setAspect, radius, setRadius, cardH, setCardH }: {
  title: string; desc: string; section: string;
  mobile?: number; setMobile?: (n: number) => void;
  desktop: number; setDesktop: (n: number) => void;
  gap: number; setGap: (n: number) => void;
  saving: boolean; onSave: () => void;
  noMobile?: boolean;
  aspect?: string; setAspect?: (v: string) => void;
  radius?: string; setRadius?: (v: string) => void;
  cardH?: number; setCardH?: (v: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
        {!noMobile && (
          <div>
            <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">Mobile Columns</p>
            <div className="flex gap-2">
              {[1,2,3].map(n => (
                <button key={n} type="button" onClick={() => setMobile?.(n)}
                  className={`w-12 h-12 text-sm font-semibold border rounded-xl transition-colors ${mobile === n ? "bg-[#3B5373] text-white border-[#3B5373]" : "border-gray-200 text-gray-500 hover:border-[#3B5373]"}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        )}
        <div>
          <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">Desktop Columns</p>
          <div className="flex gap-2">
            {[2,3,4,5,6].map(n => (
              <button key={n} type="button" onClick={() => setDesktop(n)}
                className={`w-12 h-12 text-sm font-semibold border rounded-xl transition-colors ${desktop === n ? "bg-[#3B5373] text-white border-[#3B5373]" : "border-gray-200 text-gray-500 hover:border-[#3B5373]"}`}>
                {n}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">Gap (px)</p>
          <input type="number" min={0} max={60} value={gap} onChange={e => setGap(parseInt(e.target.value) || 0)}
            className="w-32 border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg" />
          <p className="text-[10px] text-gray-300 mt-1">Current default shown</p>
        </div>
        {/* Aspect Ratio */}
        {setAspect && (
          <div>
            <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">Aspect Ratio</p>
            <div className="flex flex-wrap gap-2">
              {[["none","Free"],["4/5","4:5"],["3/4","3:4"],["9/16","9:16"],["1/1","1:1"],["16/9","16:9"]].map(([val,label])=>(
                <button key={val} type="button" onClick={()=>setAspect(val)}
                  className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${aspect===val?"bg-[#3B5373] text-white border-[#3B5373]":"border-gray-200 text-gray-500 hover:border-[#3B5373]"}`}>{label}</button>
              ))}
            </div>
          </div>
        )}
        {/* Border Radius */}
        {setRadius && (
          <div>
            <p className="text-[10px] text-gray-400 mb-2 uppercase tracking-wider font-medium">Border Radius</p>
            <div className="flex gap-2">
              {[["sharp","Sharp"],["slight","Slight"],["rounded","Rounded"],["pill","Pill"]].map(([val,label])=>(
                <button key={val} type="button" onClick={()=>setRadius(val)}
                  className={`px-3 py-1.5 text-xs font-medium border rounded-lg transition-colors ${radius===val?"bg-[#3B5373] text-white border-[#3B5373]":"border-gray-200 text-gray-500 hover:border-[#3B5373]"}`}>{label}</button>
              ))}
            </div>
          </div>
        )}
        {/* Card Height */}
        {setCardH !== undefined && (
          <div>
            <p className="text-[10px] text-gray-400 mb-1 uppercase tracking-wider font-medium">Card Height (px) <span className="normal-case text-gray-300">— 0 = aspect ratio se auto</span></p>
            <input type="number" min={0} max={900} value={cardH} onChange={e=>setCardH(parseInt(e.target.value)||0)}
              className="w-32 border border-gray-200 text-sm px-3 py-2 focus:outline-none focus:border-[#3B5373] rounded-lg"/>
          </div>
        )}
        <button onClick={onSave} disabled={saving}
          className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] disabled:opacity-60">
          <span>{saving ? "Saving…" : "Save Settings"}</span>
        </button>
      </div>

    </div>
  );
}
