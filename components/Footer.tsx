"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Music2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface FooterLink {
  text: string;
  url: string;
}

interface FooterData {
  footer_logo_url: string;
  footer_tagline: string;
  footer_desc: string;
  footer_ig_url: string;
  footer_tiktok_url: string;
  footer_shop_links: string;
  footer_help_links: string;
  footer_company_links: string;
  footer_copyright: string;
  footer_shop_heading: string;
  footer_help_heading: string;
  footer_company_heading: string;
}

const DEFAULT_SHOP_LINKS: FooterLink[] = [
  { text: "Heels", url: "/shop/heels" },
  { text: "Clip-ons", url: "/shop/clips" },
  { text: "Bow Collection", url: "/shop/bow" },
  { text: "The Date Edit", url: "/the-date-edit" },
  { text: "The Festive Edit", url: "/the-festive-edit" },
  { text: "Hot Deals", url: "/hot-deals" },
];

const DEFAULT_HELP_LINKS: FooterLink[] = [
  { text: "Size Guide", url: "/size-guide" },
  { text: "Shipping Info", url: "/shipping" },
  { text: "Returns & Exchanges", url: "/returns" },
  { text: "Track Order", url: "/track-order" },
  { text: "FAQ", url: "/faq" },
  { text: "Contact Us", url: "/contact" },
];

const DEFAULT_COMPANY_LINKS: FooterLink[] = [
  { text: "About Classie", url: "/about" },
  { text: "Style Ideas", url: "/style-ideas" },
  { text: "Press", url: "/press" },
  { text: "Privacy Policy", url: "/privacy-policy" },
  { text: "Terms of Use", url: "/terms" },
];

function parseLinks(json: string, fallback: FooterLink[]): FooterLink[] {
  if (!json) return fallback;
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) return parsed as FooterLink[];
  } catch {
    // ignore
  }
  return fallback;
}

const DEFAULT_DATA: FooterData = {
  footer_logo_url: "",
  footer_tagline: "One Heel. Endless Looks.",
  footer_desc: "Premium heels crafted for the modern woman. Made with ♥ in India.",
  footer_ig_url: "https://www.instagram.com/_classie_in/",
  footer_tiktok_url: "",
  footer_shop_links: "",
  footer_help_links: "",
  footer_company_links: "",
  footer_copyright: `© ${new Date().getFullYear()} Classie. All rights reserved.`,
  footer_shop_heading: "SHOP",
  footer_help_heading: "HELP",
  footer_company_heading: "COMPANY",
};

export default function Footer() {
  const [data, setData] = useState<FooterData>(DEFAULT_DATA);

  useEffect(() => {
    const keys = [
      "footer_logo_url", "footer_tagline", "footer_desc",
      "footer_ig_url", "footer_tiktok_url",
      "footer_shop_links", "footer_help_links", "footer_company_links",
      "footer_copyright", "footer_shop_heading", "footer_help_heading", "footer_company_heading",
    ];
    supabase
      .from("site_settings")
      .select("*")
      .in("key", keys)
      .then(({ data: rows }) => {
        if (!rows) return;
        const update: Partial<FooterData> = {};
        rows.forEach((row: { key: string; value: string }) => {
          (update as Record<string, string>)[row.key] = row.value;
        });
        setData((prev) => ({ ...prev, ...update }));
      });
  }, []);

  const shopLinks = parseLinks(data.footer_shop_links, DEFAULT_SHOP_LINKS);
  const helpLinks = parseLinks(data.footer_help_links, DEFAULT_HELP_LINKS);
  const companyLinks = parseLinks(data.footer_company_links, DEFAULT_COMPANY_LINKS);

  const headingCls = "text-[10px] tracking-[0.3em] uppercase text-white/40 mb-6 font-light";
  const linkCls = "text-sm font-light text-white/60 hover:text-white transition-colors duration-200";

  return (
    <footer style={{ backgroundColor: "#12192c" }} className="text-white">
      {/* ── Main body ── */}
      <div className="px-6 md:px-20 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand col */}
          <div>
            {data.footer_logo_url ? (
              <div className="mb-6">
                <Image
                  src={data.footer_logo_url}
                  alt="Classie"
                  width={140}
                  height={40}
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="border border-white/30 px-3 py-1 inline-block mb-6">
                <span className="text-base tracking-[0.4em] font-light text-white/90 select-none">
                  ✦ CLASSIE
                </span>
              </div>
            )}

            {data.footer_tagline && (
              <p className="font-serif italic text-white/60 text-base leading-relaxed mb-3">
                {data.footer_tagline}
              </p>
            )}

            {data.footer_desc && (
              <p className="text-xs text-white/40 leading-relaxed mb-8">
                {data.footer_desc}
              </p>
            )}

            {/* Social icons */}
            <div className="flex items-center gap-5">
              {data.footer_ig_url && (
                <a
                  href={data.footer_ig_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors duration-200"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {data.footer_tiktok_url && (
                <a
                  href={data.footer_tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors duration-200"
                  aria-label="TikTok"
                >
                  <Music2 className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* SHOP col */}
          <div>
            <h3 className={headingCls}>{data.footer_shop_heading || "SHOP"}</h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.url}>
                  <Link href={link.url} className={linkCls}>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* HELP col */}
          <div>
            <h3 className={headingCls}>{data.footer_help_heading || "HELP"}</h3>
            <ul className="space-y-3">
              {helpLinks.map((link) => (
                <li key={link.url}>
                  <Link href={link.url} className={linkCls}>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COMPANY col */}
          <div>
            <h3 className={headingCls}>{data.footer_company_heading || "COMPANY"}</h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.url}>
                  <Link href={link.url} className={linkCls}>
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-white/10" />

      {/* ── Bottom bar ── */}
      <div className="px-6 md:px-20 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* WE ACCEPT + payment badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/30 font-light mr-1">
            WE ACCEPT
          </span>
          {["Visa", "Mastercard", "UPI", "COD", "Net Banking"].map((method) => (
            <span
              key={method}
              className="px-2 py-1 border border-white/10 text-[10px] font-light text-white/30 tracking-widest"
            >
              {method}
            </span>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs font-light text-white/30 text-center sm:text-right tracking-wide">
          {data.footer_copyright || `© ${new Date().getFullYear()} Classie. All rights reserved.`}
        </p>
      </div>
    </footer>
  );
}
