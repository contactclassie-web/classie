"use client";

import Link from "next/link";
import { Instagram, Facebook, Mail } from "lucide-react";

const shopLinks = [
  { label: "Women's Heels",      href: "/shop/heels" },
  { label: "Clip-ons",           href: "/shop/clips" },
  { label: "Bloom Bow",          href: "/shop/bow" },
  { label: "Hot Deals",          href: "/hot-deals" },
  { label: "Style Ideas",        href: "/style-ideas" },
];

const infoLinks = [
  { label: "About Us",           href: "/about" },
  { label: "FAQ",                href: "/faq" },
  { label: "Track Order",        href: "/track-order" },
  { label: "Shipping Policy",    href: "/shipping" },
  { label: "Returns & Exchanges",href: "/returns" },
  { label: "Privacy Policy",     href: "/privacy-policy" },
  { label: "Terms of Service",   href: "/terms" },
];

const connectLinks = [
  { label: "WhatsApp Us",        href: "https://wa.me/919999999999" },
  { label: "Email Us",           href: "mailto:hello@classie.co.in" },
  { label: "Instagram",          href: "https://www.instagram.com/_classie_in/" },
  { label: "Facebook",           href: "https://www.facebook.com/classie.co.in" },
  { label: "Contact Us",         href: "/contact" },
  { label: "Support",            href: "/support" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      {/* ── Main footer body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* ── Brand col */}
          <div>
            <div className="border border-white/30 px-3 py-1 inline-block mb-6">
              <span className="text-base tracking-[0.4em] font-light text-white/90 select-none">
                ✦ C L A S S I E
              </span>
            </div>
            <p className="font-serif italic text-white/60 text-base leading-relaxed mb-3">
              One Heel. Endless Looks.
            </p>
            <p className="text-xs tracking-widest uppercase text-white/30 mb-8">
              Made with ♥ in India
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-5">
              <a
                href="https://www.facebook.com/classie.co.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/_classie_in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://pinterest.com/classie_in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors duration-200"
                aria-label="Pinterest"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
              </a>
              <a
                href="mailto:hello@classie.co.in"
                className="text-white/40 hover:text-white transition-colors duration-200"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* ── Shop col */}
          <div>
            <h3 className="text-[10px] font-light uppercase tracking-[0.4em] text-white/40 mb-6">Shop</h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-light text-white/60 hover:text-white transition-colors duration-200 hover:underline underline-offset-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Info col */}
          <div>
            <h3 className="text-[10px] font-light uppercase tracking-[0.4em] text-white/40 mb-6">Info</h3>
            <ul className="space-y-3">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-light text-white/60 hover:text-white transition-colors duration-200 hover:underline underline-offset-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Connect col */}
          <div>
            <h3 className="text-[10px] font-light uppercase tracking-[0.4em] text-white/40 mb-6">Connect</h3>
            <ul className="space-y-3">
              {connectLinks.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("http") || link.href.startsWith("mailto") || link.href.startsWith("https://wa") ? (
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm font-light text-white/60 hover:text-white transition-colors duration-200 hover:underline underline-offset-2"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm font-light text-white/60 hover:text-white transition-colors duration-200 hover:underline underline-offset-2"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Divider */}
      <div className="border-t border-white/10" />

      {/* ── Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs font-light text-white/30 text-center sm:text-left tracking-wide">
          © {new Date().getFullYear()} Classie. All rights reserved.
        </p>
        {/* Payment method badges */}
        <div className="flex items-center gap-2">
          {["VISA", "MC", "UPI", "COD"].map((method) => (
            <span
              key={method}
              className="px-2 py-1 border border-white/10 text-[10px] font-light text-white/30 tracking-widest"
            >
              {method}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
