import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

const LINKS = [
  { label: "Shoe clips & charms", href: "/shop/clips" },
  { label: "Heels", href: "/shop/heels" },
  { label: "Gift sets", href: "/gift-sets" },
  { label: "Custom designs", href: "/custom-designs" },
];

export default function NotFound() {
  return (
    <section className="bg-[#F7F4EF]">
      <div className="max-w-2xl mx-auto px-5 py-16 md:py-24 text-center grid gap-4 justify-items-center">
        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#3B5373]">Error 404</span>
        <h1 className="font-serif font-light text-[38px] md:text-[56px] leading-[1.05] text-[#1a1a1a]">
          This page has <em className="italic text-[#3B5373]">slipped off.</em>
        </h1>
        <p className="font-sans text-[13.5px] md:text-[15px] text-[#555] max-w-[44ch]">
          The link may be old or the product may have moved. Try one of these instead — or use the search at the top.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}
              className="font-sans text-[11px] tracking-[0.14em] uppercase px-4 py-3 border border-[#3B5373] text-[#3B5373] hover:bg-[#3B5373] hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
        <Link href="/" className="mt-3 font-sans text-[12px] text-[#6b6b6b] underline underline-offset-4 hover:text-[#3B5373]">
          Back to the homepage
        </Link>
      </div>
    </section>
  );
}
