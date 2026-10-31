import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { ProductCard, type ListingProduct } from "@/components/shop/ShopListing";
import { loadAllListingProducts } from "@/lib/shopListingServer";
import { publicSupabase } from "@/lib/supabasePublic";
import { searchItems } from "@/lib/productSearch";

// Results page for /search?q=… (the search box in the header shows live results;
// this page is for shared links, Google's search box and pressing Enter with no match).
export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

const LINKS = [
  { label: "Shoe clips & charms", href: "/shop/clips" },
  { label: "Heels", href: "/shop/heels" },
  { label: "Gift sets", href: "/gift-sets" },
];

export default async function SearchPage({ searchParams }: { searchParams: { q?: string | string[] } }) {
  const q = (Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q ?? "").trim().slice(0, 80);

  let results: { p: ListingProduct; heel: boolean }[] = [];
  if (q) {
    const [{ heels, charms }, { data }] = await Promise.all([
      loadAllListingProducts(),
      publicSupabase(300).from("products").select("slug,title,category,tags,description").eq("active", true),
    ]);
    const bySlug = new Map<string, { p: ListingProduct; heel: boolean }>([
      ...heels.map((p) => [p.slug, { p, heel: true }] as const),
      ...charms.map((p) => [p.slug, { p, heel: false }] as const),
    ]);
    const found = searchItems((data ?? []) as { slug: string; title: string; category: string; tags: string[] | null; description: string | null }[], q);
    results = found.map((it) => bySlug.get(it.slug)).filter((x): x is { p: ListingProduct; heel: boolean } => !!x);
  }

  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <form action="/search" className="flex items-center gap-3 border-b border-[#1a1a1a] pb-2 max-w-xl">
          <Search className="w-4 h-4 text-[#888] shrink-0" strokeWidth={1.5} />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search shoe charms and heels"
            aria-label="Search"
            className="flex-1 min-w-0 bg-transparent text-[15px] text-[#1a1a1a] placeholder-[#aaa] outline-none py-1.5"
          />
          <button type="submit" className="font-sans text-[11px] tracking-[0.14em] uppercase text-[#3B5373]">Search</button>
        </form>

        {q && (
          <p className="mt-6 font-sans text-[13px] text-[#555]">
            {results.length
              ? <>{results.length} {results.length === 1 ? "result" : "results"} for <strong className="text-[#1a1a1a]">&ldquo;{q}&rdquo;</strong></>
              : <>No products match <strong className="text-[#1a1a1a]">&ldquo;{q}&rdquo;</strong>. Try another word, or browse:</>}
          </p>
        )}

        {results.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-8 md:gap-x-5">
            {results.map(({ p, heel }) => (
              <ProductCard key={p.slug} p={p} mode={heel ? "heels" : "charms"} wornFirst={false} hidePair />
            ))}
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap gap-2">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href}
                className="font-sans text-[11px] tracking-[0.14em] uppercase px-4 py-3 border border-[#3B5373] text-[#3B5373] hover:bg-[#3B5373] hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
