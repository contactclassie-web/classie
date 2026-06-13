"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X, Search, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import AnnouncementBar from "./AnnouncementBar";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Left nav links
const leftLinks = [
  { label: "Heels",       href: "/shop/heels" },
  { label: "Clip-ons",    href: "/shop/clips" },
  { label: "Collections", href: "/collections" },
  { label: "Style Ideas", href: "/style-ideas" },
];

// Right nav links
const rightLinks = [
  { label: "Hot Deals", href: "/hot-deals" },
  { label: "About",     href: "/about" },
];

const NAV_LINK_CLS = "text-[11px] font-normal text-[#1a1a1a] hover:text-[#3B5373] transition-colors tracking-[0.14em] uppercase relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-[#3B5373] hover:after:w-full after:transition-all after:duration-300";

export default function Navbar() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    sb.from("site_settings").select("value").eq("key", "logo_image_url").single()
      .then(({ data }) => { if (data?.value) setLogoUrl(data.value); });
  }, []);

  return (
    <header className={`sticky top-0 z-50 bg-white transition-all duration-300 ${scrolled ? "border-b border-gray-100 shadow-sm" : "border-b border-gray-100"}`}>
      {/* ── Announcement Bar ── */}
      <AnnouncementBar />

      {/* ── Desktop Nav ── */}
      <div className="hidden lg:block" style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 40px" }}>
        <div className="flex items-center justify-between" style={{ height: "68px" }}>

          {/* Left links */}
          <div className="flex items-center gap-8">
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
