"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Lock, LogOut, RefreshCw, Package, IndianRupee, Clock,
  CheckCircle2, Truck, AlertCircle,
  Plus, Pencil, Trash2, Eye, EyeOff, X, Save, Mail, Users,
  Image as ImageIcon, Settings, LayoutTemplate, MessageSquare,
  LayoutDashboard, ShoppingCart, Layers, Grid3x3, Sparkles,
  Star, Camera, Palette, Home,
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
  variant_type: string;
  variants: string[];
  heel_type?: string;
  toe_style?: string;
  heel_height?: string;
  ankle_strap?: boolean;
  shoe_fit?: string;
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

interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at?: string;
  subscribed_at?: string;
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
}

const EMPTY_TESTIMONIAL: Testimonial = {
  customer_name: "", location: "", review_text: "", rating: 5, active: true, display_order: 0,
};

const EMPTY_INSTAGRAM: InstagramImage = {
  image_url: "", link_url: "https://www.instagram.com/_classie_in/", display_order: 0, active: true,
};

const EMPTY_STYLE_INSPO: StyleInspo = {
  title: "", image_url: "", link_url: "", tag: "", display_order: 0, active: true,
};

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
  category: "heels", description: "", image: "", images: [],
  variant_type: "none", variants: [], heel_type: "", toe_style: "",
  heel_height: "", ankle_strap: false, shoe_fit: "",
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

type TabId = "dashboard" | "orders" | "products" | "slides" | "collections" | "categories" | "featured-picks" | "settings" | "messages" | "testimonials" | "instagram" | "style-inspo" | "announcement" | "trust-band";
type MainSection = "dashboard" | "homepage" | "catalog" | "orders" | "settings" | "messages";

const TAB_TO_SECTION: Record<TabId, MainSection> = {
  "dashboard":      "dashboard",
  "slides":         "homepage",
  "featured-picks": "homepage",
  "testimonials":   "homepage",
  "instagram":      "homepage",
  "style-inspo":    "homepage",
  "announcement":   "homepage",
  "trust-band":     "homepage",
  "products":       "catalog",
  "collections":    "catalog",
  "categories":     "catalog",
  "orders":         "orders",
  "settings":       "settings",
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
  ],
  catalog: [
    { id: "products",    label: "Products" },
    { id: "collections", label: "Collections" },
    { id: "categories",  label: "Categories" },
  ],
  orders:   [],
  settings: [],
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
      const { data, error } = await supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false });
      if (!error && data) setSubscribers(data as NewsletterSubscriber[]);
    } catch { /* ignore */ }
    finally { setSubsLoading(false); }
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
    if (tab === "messages") { fetchMessages(); fetchSubscribers(); }
    if (tab === "collections") fetchCollections();
    if (tab === "categories") fetchCategories();
    if (tab === "featured-picks") { fetchFeaturedPicks(); fetchSettings(); }
    if (tab === "testimonials") fetchTestimonials();
    if (tab === "instagram") fetchInstagramImages();
    if (tab === "style-inspo") fetchStyleInspos();
  }, [authed, tab, fetchSlides, fetchSettings, fetchFeaturesBar, fetchMessages, fetchSubscribers, fetchCollections, fetchCategories, fetchFeaturedPicks, fetchTestimonials, fetchInstagramImages, fetchStyleInspos]);

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

  const openAddProduct = () => setProductModal({ open: true, mode: "add", data: { ...EMPTY_PRODUCT } });
  const openEditProduct = (p: DbProduct) => setProductModal({ open: true, mode: "edit", data: { ...p } });
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
      closeSlideModal();
    } catch { /* ignore */ }
    finally { setSlideSaving(false); }
  };

  const deleteSlide = async (id: string) => {
    await supabase.from("hero_slides").delete().eq("id", id);
    setSlides((prev) => prev.filter((s) => s.id !== id));
    setDeleteSlideConfirm(null);
  };

  const toggleSlideActive = async (s: HeroSlide) => {
    await supabase.from("hero_slides").update({ active: !s.active }).eq("id", s.id);
    setSlides((prev) => prev.map((x) => (x.id === s.id ? { ...x, active: !x.active } : x)));
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
      await fetchCategories();
      closeCategoryModal();
    } catch (e: unknown) { alert("Save failed: " + (e instanceof Error ? e.message : String(e))); }
    finally { setCategorySaving(false); }
  };

  const deleteCategory = async (id: string) => {
    await supabase.from("site_categories").delete().eq("id", id);
    setSiteCategories((prev) => prev.filter((c) => c.id !== id));
    setDeleteCategoryConfirm(null);
  };

  const toggleCategoryActive = async (c: SiteCategory) => {
    await supabase.from("site_categories").update({ active: !c.active }).eq("id", c.id);
    setSiteCategories((prev) => prev.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x)));
  };

  const setCategoryField = (key: keyof SiteCategory, val: unknown) =>
    setCategoryModal((m) => ({ ...m, data: { ...m.data, [key]: val } }));

  // ── Category Products actions ─────────────────────────────────────────────

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
      await fetchFeaturesBar();
      closeFeaturesBarModal();
    } catch { /* ignore */ }
    finally { setFeaturesBarSaving(false); }
  };

  const deleteFeature = async (id: string) => {
    await supabase.from("features_bar").delete().eq("id", id);
    setFeaturesBarItems((prev) => prev.filter((f) => f.id !== id));
    setDeleteFeatureConfirm(null);
  };

  const toggleFeatureActive = async (f: FeatureBarItem) => {
    await supabase.from("features_bar").update({ active: !f.active }).eq("id", f.id);
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

  const MAIN_SECTIONS: { id: MainSection; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "dashboard", label: "Dashboard",  icon: LayoutDashboard },
    { id: "homepage",  label: "Homepage",   icon: Home },
    { id: "catalog",   label: "Catalog",    icon: ImageIcon, badge: dbProducts.length },
    { id: "orders",    label: "Orders",     icon: ShoppingCart, badge: orders.length },
    { id: "settings",  label: "Settings",   icon: Settings },
    { id: "messages",  label: "Messages",   icon: MessageSquare, badge: messages.length },
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
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          {MAIN_SECTIONS.map(({ id, label, icon: Icon, badge }) => {
            const active = mainSection === id;
            const firstTab: TabId = id === "dashboard" ? "dashboard" :
              id === "orders" ? "orders" :
              id === "settings" ? "settings" :
              id === "messages" ? "messages" :
              (SECTION_SUBTABS[id][0]?.id ?? "dashboard");
            return (
              <button
                key={id}
                onClick={() => setTab(firstTab)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                  active
                    ? "bg-white/15 text-white border-l-2 border-white pl-[10px]"
                    : "text-white/65 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {badge !== undefined && badge > 0 && (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${active ? "bg-white text-[#3B5373]" : "bg-white/20 text-white/80"}`}>
                    {badge}
                  </span>
                )}
              </button>
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
               mainSection === "orders" ? "Orders" :
               mainSection === "settings" ? "Settings" : "Messages"}
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

              {/* ── Sub-section B: Features Bar Manager ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[#3B5373]" />
                    <h2 className="font-semibold text-gray-700">Features Bar Manager</h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs text-gray-500 font-medium">Scroll Speed:</label>
                    <select
                      className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#3B5373] bg-white"
                      defaultValue="35"
                      onChange={async (e) => {
                        await upsertSettings([{ key: "features_bar_speed", value: e.target.value }]);
                      }}
                    >
                      <option value="50">🐢 Slow</option>
                      <option value="35">⚡ Normal</option>
                      <option value="20">🚀 Fast</option>
                    </select>
                  </div>
                  <button
                    onClick={openAddFeature}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3B5373] text-white rounded-xl text-xs font-medium hover:bg-[#2d3f4f] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Feature
                  </button>
                </div>

                {featuresBarLoading ? (
                  <p className="text-gray-400 text-sm">Loading features…</p>
                ) : featuresBarItems.length === 0 ? (
                  <p className="text-gray-400 text-sm py-4 text-center">
                    No features yet. Click &ldquo;Add Feature&rdquo; to create one.<br />
                    <span className="text-xs text-gray-300">(Table must be created in Supabase first — see SQL below)</span>
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          {["Icon", "Title", "Subtitle", "Order", "Active", "Actions"].map((h) => (
                            <th key={h} className="text-left px-3 py-2.5 text-xs uppercase tracking-wider text-gray-400 font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {featuresBarItems.map((f) => (
                          <tr key={f.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                            <td className="px-3 py-3 text-xl">{f.icon}</td>
                            <td className="px-3 py-3 font-medium text-gray-700 text-xs">{f.title}</td>
                            <td className="px-3 py-3 text-xs text-gray-400">{f.subtitle || "—"}</td>
                            <td className="px-3 py-3 text-xs text-gray-400">{f.display_order}</td>
                            <td className="px-3 py-3">
                              <button
                                onClick={() => toggleFeatureActive(f)}
                                className={`w-9 h-5 rounded-full transition-colors flex-shrink-0 relative ${f.active ? "bg-emerald-500" : "bg-gray-300"}`}
                                title={f.active ? "Deactivate" : "Activate"}
                              >
                                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${f.active ? "left-4" : "left-0.5"}`} />
                              </button>
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-1.5">
                                <button onClick={() => openEditFeature(f)} title="Edit"
                                  className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#3B5373] transition-colors">
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => setDeleteFeatureConfirm(f.id!)} title="Delete"
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                                  <Trash2 className="w-3.5 h-3.5" />
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

              {/* ── Philosophy Section ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <h2 className="font-semibold text-gray-700">Philosophy Section</h2>
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
                        setDeleteStyleInspoConfirm(null);
                        await fetchStyleInspos();
                      }} className="px-5 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600">Delete</button>
                    </div>
                  </div>
                </div>
              )}
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
                <label className={labelCls}>Main Image URL</label>
                <input type="text" value={productModal.data.image} onChange={(e) => setProductField("image", e.target.value)} className={inputCls} placeholder="https://…" />
              </div>
              <div>
                <label className={labelCls}>Additional Images (comma separated)</label>
                <input
                  type="text"
                  value={productModal.data.images?.join(", ") ?? ""}
                  onChange={(e) => setProductField("images", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))}
                  className={inputCls} placeholder="https://…, https://…"
                />
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">{styleInspoModal.mode === "add" ? "Add Style Inspo" : "Edit Style Inspo"}</h2>
              <button onClick={() => setStyleInspoModal(m => ({ ...m, open: false }))} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className={labelCls}>Title</label>
                <input className={inputCls} value={styleInspoModal.data.title}
                  onChange={e => setStyleInspoModal(m => ({ ...m, data: { ...m.data, title: e.target.value } }))} placeholder="e.g. Date Night Look" />
              </div>
              <div>
                <label className={labelCls}>Image URL *</label>
                <input className={inputCls} value={styleInspoModal.data.image_url}
                  onChange={e => setStyleInspoModal(m => ({ ...m, data: { ...m.data, image_url: e.target.value } }))} placeholder="https://..." />
              </div>
              <div>
                <label className={labelCls}>Link URL</label>
                <input className={inputCls} value={styleInspoModal.data.link_url}
                  onChange={e => setStyleInspoModal(m => ({ ...m, data: { ...m.data, link_url: e.target.value } }))} placeholder="/shop/..." />
              </div>
              <div>
                <label className={labelCls}>Tag Label</label>
                <input className={inputCls} value={styleInspoModal.data.tag}
                  onChange={e => setStyleInspoModal(m => ({ ...m, data: { ...m.data, tag: e.target.value } }))} placeholder="e.g. NEW, TRENDING" />
              </div>
              <div>
                <label className={labelCls}>Display Order</label>
                <input type="number" className={inputCls} value={styleInspoModal.data.display_order}
                  onChange={e => setStyleInspoModal(m => ({ ...m, data: { ...m.data, display_order: parseInt(e.target.value) || 0 } }))} />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={styleInspoModal.data.active}
                  onChange={e => setStyleInspoModal(m => ({ ...m, data: { ...m.data, active: e.target.checked } }))}
                  className="w-4 h-4 accent-[#3B5373]" />
                <span className="text-sm text-gray-600">Active</span>
              </label>
            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setStyleInspoModal(m => ({ ...m, open: false }))} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
              <button disabled={styleInspoSaving} onClick={async () => {
                setStyleInspoSaving(true);
                try {
                  const d = styleInspoModal.data;
                  if (styleInspoModal.mode === "add") {
                    await supabase.from("style_inspo").insert([{ ...d }]);
                  } else {
                    await supabase.from("style_inspo").update({ ...d }).eq("id", d.id!);
                  }
                  await fetchStyleInspos();
                  setStyleInspoModal(m => ({ ...m, open: false }));
                } catch { /* ignore */ }
                finally { setStyleInspoSaving(false); }
              }} className="px-6 py-2 bg-[#3B5373] text-white rounded-xl text-sm font-medium hover:bg-[#2d3f4f] disabled:opacity-50">
                {styleInspoSaving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
