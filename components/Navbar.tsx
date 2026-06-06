"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import AnnouncementBar from "./AnnouncementBar";
import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const navLinks = [
  { label: "Heels",       href: "/shop/heels" },
  { label: "Clip-ons",    href: "/shop/clips" },
  { label: "Style Ideas", href: "/style-ideas" },
  { label: "Hot Deals",   href: "/hot-deals" },
  { label: "Contact Us",  href: "/contact" },
  { label: "About Us",    href: "/about" },
];

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
    <header
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
        scrolled ? "border-b border-gray-100" : "border-b border-transparent"
      }`}
    >
      {/* ── Scrolling Announcement Bar ── */}
      <AnnouncementBar />

      {/* ── Main nav row ── */}
      <div className="px-6 md:px-20">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo */}
          <Link href="/" className="flex-shrink-0">
            {logoUrl ? (
              <div className="relative h-10 w-32">
                <Image src={logoUrl} alt="Classie" fill className="object-contain object-left" sizes="128px" />
              </div>
            ) : (
              <span className="font-serif text-xl tracking-[0.48em] font-normal text-[#1a1a1a] select-none flex items-center gap-2">
                <span className="text-[#3B5373]">✦</span>CLASSIE
              </span>
            )}
          </Link>

          {/* ── Desktop links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="nav-link text-[12px] font-light text-[#1a1a1a] hover:text-[#3B5373] transition-colors tracking-[0.12em] uppercase"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* ── Cart + burger */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative p-1 text-[#1a1a1a] hover:text-[#3B5373] transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#3B5373] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-medium">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>
            <button
              className="lg:hidden p-1 text-[#1a1a1a]"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer — slides in from right */}
      <div
        className={`lg:hidden fixed inset-y-0 right-0 w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <span className="text-sm tracking-[0.3em] uppercase font-light text-[#3B5373]">Menu</span>
          <button onClick={() => setOpen(false)} className="text-[#1a1a1a]" aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex flex-col px-6 py-4">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-4 text-sm font-light text-[#1a1a1a] border-b border-gray-50 last:border-0 tracking-[0.15em] uppercase hover:text-[#3B5373] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 pt-4">
          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 text-sm font-light text-[#3B5373] tracking-wider uppercase"
          >
            <ShoppingBag className="w-4 h-4" />
            Cart {count > 0 && `(${count})`}
          </Link>
        </div>
      </div>

      {/* ── Mobile overlay */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}
    </header>
  );
}
