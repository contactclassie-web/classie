import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { products } from "@/lib/products";
import StyleIdeasHero from "./StyleIdeasHero";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Style Ideas | Classie",
  description: "Outfit inspiration and styling tips from Classie — heels, clip-ons and more.",
};

const OCCASION_TAGS = ["All", "Date Night", "Work & Play", "Festive", "Casual", "Wedding"];

const looks = [
  {
    title: "The Date Night Look",
    tag: "Date Night",
    desc: "Pair our Modiva heels with a satin midi dress. Add crystal clip-ons to your heels and a Gloss Bow to your clutch — instant runway.",
    image: products[7].image,
    products: ["modiva", "radiance-heart-crystal-clip-pair", "fauxbow-black"],
  },
  {
    title: "Office to After-Hours",
    tag: "Work & Play",
    desc: "The Gloss Belle block heel pairs beautifully with tailored trousers. Swap to the Starlight Crystal Clip for your evening out — same heels, new personality.",
    image: products[5].image,
    products: ["gloss-belle", "starlight-bloom-crystal-clip-pair"],
  },
  {
    title: "The Festive Glow-Up",
    tag: "Festive",
    desc: "Go bold with the Clessia Wine heel. Stack the Crystal Starburst and Radiance Crown clips for maximum shimmer at weddings, receptions and festivals.",
    image: products[0].image,
    products: ["clessia-wine", "crystal-starburst-clip-pair", "radiance-crown-crystal-clip-pair"],
  },
  {
    title: "Everyday Effortless",
    tag: "Casual",
    desc: "Crovia block heels — your new daily staple. Add a Pearl Bloom Flower Clip for a soft, feminine touch that works from brunch to grocery run.",
    image: products[2].image,
    products: ["crovia-choclate-brown", "fauxbow-brown"],
  },
];

export default async function StyleIdeasPage() {
  // Fetch hero settings from Supabase
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const heroKeys = [
    "si_hero_bg_type","si_hero_bg_url","si_hero_slides","si_hero_text_pos",
    "si_hero_eyebrow","si_hero_title","si_hero_title_italic","si_hero_subtitle",
    "si_hero_show_stats","si_hero_stat1_val","si_hero_stat1_label",
    "si_hero_stat2_val","si_hero_stat2_label","si_hero_stat3_val","si_hero_stat3_label",
  ];

  const { data: settingsRows } = await sb
    .from("site_settings")
    .select("key,value")
    .in("key", heroKeys);

  const cfg: Record<string, string> = {};
  (settingsRows ?? []).forEach((r: { key: string; value: string }) => { cfg[r.key] = r.value; });

  const hero = {
    bgType:       (cfg["si_hero_bg_type"] || "none") as "none"|"image"|"video"|"slider",
    bgUrl:        cfg["si_hero_bg_url"] || "",
    slides:       (() => { try { return JSON.parse(cfg["si_hero_slides"] || "[]"); } catch { return []; } })(),
    textPos:      (cfg["si_hero_text_pos"] || "center") as "left"|"center"|"right",
    eyebrow:      cfg["si_hero_eyebrow"] || "Lookbook 2024",
    title:        cfg["si_hero_title"] || "One Pair.",
    titleItalic:  cfg["si_hero_title_italic"] || "Every Occasion.",
    subtitle:     cfg["si_hero_subtitle"] || "Style ideas, outfit inspo, and the looks our team is loving right now. Mix, match, and make it yours.",
    showStats:    cfg["si_hero_show_stats"] === "true",
    stat1Val:     cfg["si_hero_stat1_val"] || "",
    stat1Label:   cfg["si_hero_stat1_label"] || "Looks",
    stat2Val:     cfg["si_hero_stat2_val"] || "",
    stat2Label:   cfg["si_hero_stat2_label"] || "Styles",
    stat3Val:     cfg["si_hero_stat3_val"] || "Free",
    stat3Label:   cfg["si_hero_stat3_label"] || "Shipping ₹999+",
  };

  return (
    <>
      {/* ── Hero Section (admin-controlled) ─────────────────────── */}
      <StyleIdeasHero hero={hero} />

      {/* ── Occasion Tabs + Look Cards ──────────────────────────── */}
      <StyleIdeasLooks looks={looks} />

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-14 bg-[#3B5373] text-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl mb-3">Create Your Look</h2>
          <p className="text-white/70 text-sm mb-7">
            Tag us @_classie_in for a chance to be featured in our next lookbook.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/shop/heels" className="btn-ghost-white">Shop Heels</Link>
            <Link href="/shop/clips" className="btn-ghost-white">Shop Clip-ons</Link>
          </div>
        </div>
      </section>
    </>
  );
}

// ── Static Look Cards Section ────────────────────────────────────────────────
type Look = { title: string; tag: string; desc: string; image: string; products: string[] };
function StyleIdeasLooks({ looks }: { looks: Look[] }) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-20">
        {looks.map((look, i) => (
          <article
            key={look.title}
            className={`grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center ${i % 2 === 1 ? "md:grid-flow-dense" : ""}`}
          >
            {/* Image */}
            <div className={`relative aspect-[4/5] overflow-hidden bg-[#f5f5f5] ${i % 2 === 1 ? "md:col-start-2" : ""}`}>
              <Image
                src={look.image}
                alt={look.title}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span className="absolute top-4 left-4 px-3 py-1 text-[10px] font-semibold tracking-widest uppercase text-white bg-[#3B5373]">
                {look.tag}
              </span>
            </div>

            {/* Content */}
            <div className={i % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""}>
              <p className="text-[10px] tracking-[0.5em] uppercase text-[#888] mb-3 flex items-center gap-3">
                <span className="w-8 h-px bg-[#3B5373] inline-block" />
                Look {String(i + 1).padStart(2, "0")}
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-[#1a1a1a] mb-4">{look.title}</h2>
              <p className="text-[#888] text-sm leading-relaxed mb-8">{look.desc}</p>

              <p className="text-[10px] font-semibold uppercase tracking-widest text-[#1a1a1a] mb-4">Shop This Look</p>
              <div className="flex flex-col gap-0">
                {look.products.map((slug) => {
                  const p = products.find((x) => x.slug === slug);
                  if (!p) return null;
                  return (
                    <Link
                      key={slug}
                      href={`/products/${slug}`}
                      className="flex items-center gap-4 py-3 border-t border-[#e8e4de] group hover:bg-[#faf8f6] transition-colors px-2"
                    >
                      <div className="relative w-11 h-11 rounded-full overflow-hidden bg-[#f5f5f5] flex-shrink-0">
                        <Image src={p.image} alt={p.title} fill className="object-cover" sizes="44px" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1a1a1a] group-hover:text-[#3B5373] transition-colors truncate">{p.title}</p>
                        <p className="text-xs text-[#888]">₹{p.price.toLocaleString("en-IN")}</p>
                      </div>
                      <span className="text-[#3B5373] text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    </Link>
                  );
                })}
                <div className="border-t border-[#e8e4de]" />
              </div>

              <Link
                href={`/shop/${look.products[0].includes("clip") || look.products[0].includes("bow") || look.products[0].includes("faux") ? "clips" : "heels"}`}
                className="btn-outline mt-8 inline-block"
              >
                Shop the Look
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
