"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Instagram, Facebook, Mail, Send } from "lucide-react";

const footerColumns = [
  {
    heading: "About Us",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Style Ideas", href: "/style-ideas" },
      { label: "Hot Deals", href: "/hot-deals" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    heading: "Resource",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Track Order", href: "/track-order" },
      { label: "Support", href: "/support" },
      { label: "Size Guide", href: "/faq#size-guide" },
    ],
  },
  {
    heading: "Information",
    links: [
      { label: "Shipping Policy", href: "/shipping" },
      { label: "Returns & Exchanges", href: "/returns" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "WhatsApp Us", href: "https://wa.me/919999999999" },
      { label: "Email Us", href: "mailto:hello@classie.co.in" },
      { label: "Instagram", href: "https://www.instagram.com/_classie_in/" },
      { label: "Track My Order", href: "/track-order" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#2d3748] text-white">
      {/* Main footer body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand + newsletter */}
          <div className="lg:col-span-2">
            <Link href="/">
              <Image
                src="/logo.jpg"
                alt="Classie"
                width={110}
                height={36}
                className="h-10 w-auto object-contain mb-4 brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-gray-300 leading-relaxed mb-6 max-w-xs">
              Sign up for sales, new arrivals, and more
            </p>
            {subscribed ? (
              <p className="text-sm text-green-400 font-medium">
                ✓ Thank you for subscribing!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="flex-1 min-w-0 px-3 py-2 text-sm bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white/50 transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-[#2d3748] text-sm font-semibold rounded hover:bg-gray-100 transition-colors flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  Sign Up
                </button>
              </form>
            )}

            {/* Social icons */}
            <div className="flex items-center gap-4 mt-8">
              <a
                href="https://www.facebook.com/classie.co.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/_classie_in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://pinterest.com/classie_in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Pinterest"
              >
                {/* Pinterest SVG */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
              </a>
              <a
                href="mailto:hello@classie.co.in"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((col) => (
            <div key={col.heading} className="lg:col-span-1">
              <h3 className="text-sm font-semibold uppercase tracking-widest mb-4 text-white">
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith("http") || link.href.startsWith("mailto") || link.href.startsWith("https://wa") ? (
                      <a
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            © {new Date().getFullYear()} Classie. All rights reserved. Designed with ♥ in India.
          </p>
          {/* Payment icons */}
          <div className="flex items-center gap-2">
            {["VISA", "MC", "UPI", "COD"].map((method) => (
              <span
                key={method}
                className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold text-gray-300 border border-white/10 tracking-wider"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
