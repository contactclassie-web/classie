"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Music2, Facebook } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface FooterLink {
  text: string;
  url: string;
}

interface FooterData {
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
  footer_tiktok_url: "", footer_fb_url: "", footer_pinterest_url: "", footer_whatsapp_url: "",
  footer_shop_links: "",
  footer_help_links: "",
  footer_company_links: "",
  footer_copyright: `© ${new Date().getFullYear()} Classie. All rights reserved.`,
  footer_shop_heading: "SHOP",
  footer_help_heading: "HELP",
  footer_company_heading: "COMPANY",
};

interface FooterProps { initialSettings?: Record<string, string>; }

export default function Footer({ initialSettings }: FooterProps) {
  const buildData = (s?: Record<string, string>): FooterData => {
    if (!s) return DEFAULT_DATA;
    const merged = { ...DEFAULT_DATA };
    Object.keys(DEFAULT_DATA).forEach(k => {
      if (s[k] !== undefined) (merged as Record<string, string>)[k] = s[k];
    });
    return merged;
  };

  const [data, setData] = useState<FooterData>(buildData(initialSettings));

  useEffect(() => {
    if (initialSettings && Object.keys(initialSettings).length > 0) return;
    const keys = [
      "footer_logo_url", "footer_tagline", "footer_desc",
      "footer_ig_url", "footer_tiktok_url", "footer_fb_url", "footer_pinterest_url", "footer_whatsapp_url",
      "footer_shop_links", "footer_help_links", "footer_company_links",
      "footer_copyright", "footer_shop_heading", "footer_help_heading", "footer_company_heading",
    ];
    supabase.from("site_settings").select("*").in("key", keys)
      .then(({ data: rows }) => {
        if (!rows) return;
        const update: Partial<FooterData> = {};
        rows.forEach((row: { key: string; value: string }) => {
          (update as Record<string, string>)[row.key] = row.value;
        });
        setData((prev) => ({ ...prev, ...update }));
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <a href={data.footer_tiktok_url} target="_blank" rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors duration-200" aria-label="TikTok">
                  <Music2 className="w-4 h-4" />
                </a>
              )}
              {data.footer_fb_url && (
                <a href={data.footer_fb_url} target="_blank" rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors duration-200" aria-label="Facebook">
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {data.footer_pinterest_url && (
                <a href={data.footer_pinterest_url} target="_blank" rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors duration-200" aria-label="Pinterest">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                  </svg>
                </a>
              )}
              {data.footer_whatsapp_url && (
                <a href={data.footer_whatsapp_url} target="_blank" rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors duration-200" aria-label="WhatsApp">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
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
