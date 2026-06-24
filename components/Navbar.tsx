"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X, Search, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import AnnouncementBar from "./AnnouncementBar";
import { supabase } from "@/lib/supabase";

// Static nav links (non-category)
const leftLinks = [
  { label: "Style Ideas", href: "/style-ideas" },
];
const rightLinks = [
  { label: "Hot Deals", href: "/hot-deals" },
  { label: "About",     href: "/about" },
];

const NAV_LINK_CLS = "text-[11px] font-normal text-[#1a1a1a] hover:text-[#3B5373] transition-colors tracking-[0.14em] uppercase relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-[#3B5373] hover:after:w-full after:transition-all after:duration-300";

interface Category { name: string; slug: string; display_order: number; image_url?: string; description?: string; }

interface NavbarProps {
  initialSettings?: Record<string, string>;
  initialCategories?: Category[];
}

const LOGO_FALLBACK = "https://res.cloudinary.com/dbzt3soyi/image/upload/v1780757501/unnamed_5_nzzrwl.jpg";
const DEFAULT_CATS: Category[] = [
  { name: "Heels", slug: "heels", display_order: 1 },
  { name: "Clip-ons", slug: "clips", display_order: 2 },
];

export default function Navbar({ initialSettings, initialCategories }: NavbarProps) {
  const { count } = useCart();
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoUrl, setLogoUrl]   = useState(initialSettings?.logo_image_url || LOGO_FALLBACK);
  const [categories, setCategories] = useState<Category[]>(
    initialCategories && initialCategories.length > 0 ? initialCategories : DEFAULT_CATS
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Skip client fetch if server provided data
    if (initialSettings && initialCategories && initialCategories.length > 0) return;

    supabase.from("site_settings").select("value").eq("key", "logo_image_url").single()
      .then(({ data }) => { if (data?.value) setLogoUrl(data.value); });

    supabase.from("site_categories").select("name,slug,display_order,image_url,description")
      .eq("active", true).order("display_order")
      .then(({ data }) => { if (data) setCategories(data); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // First 2 categories shown as direct links, rest in Collections dropdown
  const directLinks = categories.slice(0, 2);
  const dropdownLinks = categories;

  return (
    <header className={`sticky top-0 z-50 bg-white transition-all duration-300 ${scrolled ? "border-b border-gray-100 shadow-sm" : "border-b border-gray-100"}`}>
      {/* ── Announcement Bar ── */}
      <AnnouncementBar initialSettings={initialSettings} />

      {/* ── Desktop Nav ── */}
      <div className="hidden lg:block" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 40px" }}>
        <div className="flex items-center justify-between" style={{ height: "68px" }}>

          {/* Left links: direct category links + Collections dropdown + Style Ideas */}
          <div className="flex items-center gap-8">
            {/* Direct category links (first 2 from DB) */}
            {directLinks.map((cat) => (
              <Link key={cat.slug} href={`/shop/${cat.slug}`} className={NAV_LINK_CLS}>
                {cat.name}
              </Link>
            ))}

            {/* Collections mega-menu */}
            {dropdownLinks.length > 0 && (
              <div className="relative group">
                <button className={`${NAV_LINK_CLS} flex items-center gap-1 bg-transparent border-none cursor-pointer`}>
                  Collections
                  <svg className="w-3 h-3 mt-[1px] transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                {/* Premium mega-menu panel */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-white border border-gray-100 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50"
                  style={{ width: `${Math.max(dropdownLinks.length * 180, 380)}px`, borderTop: "2px solid #3B5373" }}>
                  {/* Top accent line */}
                  <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${dropdownLinks.length}, 1fr)` }}>
                    {dropdownLinks.map((cat) => (
                      <Link key={cat.slug} href={`/shop/${cat.slug}`}
                        className="group/card relative flex flex-col overflow-hidden border-r border-gray-50 last:border-r-0 hover:bg-[#faf9ff] transition-all duration-300">
                        {/* Category image */}
                        <div className="relative overflow-hidden" style={{ height: "140px", backgroundColor: "#f8f7ff" }}>
                          {cat.image_url ? (
                            <Image src={cat.image_url} alt={cat.name} fill
                              className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                              sizes="200px" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-4xl opacity-20">✦</span>
                            </div>
                          )}
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-[#3B5373] opacity-0 group-hover/card:opacity-10 transition-opacity duration-300" />
                        </div>
                        {/* Text */}
                        <div className="px-4 py-4">
                          <p className="text-[11px] tracking-[0.18em] uppercase font-medium text-[#1a1a1a] group-hover/card:text-[#3B5373] transition-colors">
                            {cat.name}
                          </p>
                          {cat.description && (
                            <p className="text-[10px] text-[#1a1a1a] mt-1 leading-relaxed tracking-wide line-clamp-2">
                              {cat.description}
                            </p>
                          )}
                          <p className="text-[9px] tracking-[0.2em] uppercase text-[#3B5373] mt-2 opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex items-center gap-1">
                            Shop now <span>→</span>
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {/* Bottom bar */}
                  <div className="px-5 py-3 bg-[#faf9ff] border-t border-gray-100 flex items-center justify-between">
                    <p className="text-[9px] tracking-[0.2em] uppercase text-[#1a1a1a]">All Collections</p>
                    <Link href="/collections" className="text-[9px] tracking-[0.2em] uppercase text-[#3B5373] hover:underline">
                      View All →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Static left links */}
            {leftLinks.map((l) => (
              <Link key={l.href} href={l.href} className={NAV_LINK_CLS}>{l.label}</Link>
            ))}
          </div>

          {/* Center logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex-shrink-0">
            {logoUrl ? (
              <div className="relative h-10 w-32">
                <Image src={logoUrl} alt="Classie" fill className="object-contain" sizes="128px" />
              </div>
            ) : (
              <span className="font-serif text-[1.5rem] tracking-[0.1em] font-normal text-[#000] select-none flex items-center gap-1">
                ✦ CLASSIE
              </span>
            )}
          </Link>

          {/* Right links + icons */}
          <div className="flex items-center gap-7">
            {rightLinks.map((l) => (
              <Link key={l.href} href={l.href} className={NAV_LINK_CLS}>{l.label}</Link>
            ))}
            <button aria-label="Search" className="text-[#1a1a1a] hover:text-[#3B5373] transition-colors">
              <Search className="w-[18px] h-[18px]" strokeWidth={1.6} />
            </button>
            <button aria-label="Wishlist" className="text-[#1a1a1a] hover:text-[#3B5373] transition-colors">
              <Heart className="w-[18px] h-[18px]" strokeWidth={1.6} />
            </button>
            <Link href="/cart" aria-label="Cart" className="relative text-[#1a1a1a] hover:text-[#3B5373] transition-colors">
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.6} />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#3B5373] text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-medium">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile Nav ── */}
      <div className="lg:hidden px-5">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex-shrink-0">
            {logoUrl ? (
              <div className="relative h-8 w-24">
                <Image src={logoUrl} alt="Classie" fill className="object-contain object-left" sizes="96px" />
              </div>
            ) : (
              <span className="font-serif text-lg tracking-[0.1em] text-[#000]">✦ CLASSIE</span>
            )}
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative text-[#1a1a1a]">
              <ShoppingBag className="w-5 h-5" strokeWidth={1.6} />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#3B5373] text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
            <button className="text-[#1a1a1a]" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      <div className={`lg:hidden fixed inset-y-0 right-0 w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <span className="text-sm tracking-[0.3em] uppercase font-light text-[#3B5373]">Menu</span>
          <button onClick={() => setOpen(false)} className="text-[#1a1a1a]"><X className="w-5 h-5" /></button>
        </div>
        <nav className="flex flex-col px-6 py-4">
          {/* Direct category links */}
          {directLinks.map((cat) => (
            <Link key={cat.slug} href={`/shop/${cat.slug}`} onClick={() => setOpen(false)}
              className="py-4 text-sm font-light text-[#1a1a1a] border-b border-gray-50 tracking-[0.15em] uppercase hover:text-[#3B5373] transition-colors">
              {cat.name}
            </Link>
          ))}
          {/* Collections section in mobile */}
          {dropdownLinks.length > 0 && (
            <div className="py-4 border-b border-gray-50">
              <p className="text-sm font-light text-[#1a1a1a] tracking-[0.15em] uppercase mb-2">Collections</p>
              <div className="flex flex-col pl-3 gap-1">
                {dropdownLinks.map((cat) => (
                  <Link key={cat.slug} href={`/shop/${cat.slug}`} onClick={() => setOpen(false)}
                    className="py-1.5 text-xs font-light text-[#1a1a1a] tracking-[0.12em] uppercase hover:text-[#3B5373] transition-colors">
                    — {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
          {/* Static links */}
          {[...leftLinks, ...rightLinks].map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="py-4 text-sm font-light text-[#1a1a1a] border-b border-gray-50 last:border-0 tracking-[0.15em] uppercase hover:text-[#3B5373] transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      {open && <div className="lg:hidden fixed inset-0 bg-black/20 z-40 backdrop-blur-sm" onClick={() => setOpen(false)} />}
    </header>
  );
}
