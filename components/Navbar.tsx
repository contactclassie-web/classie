"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "./CartContext";

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

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-classie-border">
      {/* ── Announcement Bar ── */}
      <div className="bg-[#3D4F5F] text-white text-center text-[11px] py-2 px-4 leading-snug">
        Welcome to Classie — Use code{" "}
        <span className="font-semibold">FIRST10</span> for 10% OFF &nbsp;|&nbsp;
        Free Shipping above ₹999 &nbsp;|&nbsp; Easy Returns &amp; Exchange
      </div>

      {/* ── Main nav row ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo.jpg"
              alt="Classie"
              width={130}
              height={44}
              className="h-11 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[13px] font-medium text-[#1a1a1a] hover:text-[#3D4F5F] transition-colors tracking-wider"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Cart + burger */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              aria-label="Cart"
              className="relative p-1 text-[#1a1a1a] hover:text-[#3D4F5F] transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#3D4F5F] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
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

      {/* ── Mobile drawer ── */}
      {open && (
        <div className="lg:hidden bg-white border-t border-classie-border">
          <nav className="flex flex-col px-6 py-2">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-4 text-sm font-medium text-[#1a1a1a] border-b border-classie-border last:border-0 tracking-wider hover:text-[#3D4F5F] transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
