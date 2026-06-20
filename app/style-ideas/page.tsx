import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import StyleIdeasHero from "./StyleIdeasHero";
import StyleIdeasLooksClient from "./StyleIdeasLooksClient";

type FeaturedLookData = {
  label: string; heading: string; desc: string;
  image: string; mediaType: "image"|"video";
  products: {id:string;title:string;price:number;image:string;slug:string}[];
  cta1Text: string; cta1Url: string; cta2Text: string; cta2Url: string;
};

type ReelsData = { heading:string; subtitle:string; cols:number; cardH:number; cardW:number; gap:number; cards:{title:string;tag:string;media_url:string;media_type:"image"|"video"}[] };

function StyleReels({ reels: r }: { reels: ReelsData }) {
  const colClass: Record<number,string> = { 3:"grid-cols-3", 4:"grid-cols-2 sm:grid-cols-4", 5:"grid-cols-2 sm:grid-cols-5", 6:"grid-cols-2 sm:grid-cols-6" };
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {(r.heading || r.subtitle) && (
          <div className="text-center mb-10">
            {r.heading && <h2 className="font-serif text-3xl md:text-4xl text-[#1a1a1a] font-light italic mb-3">{r.heading}</h2>}
            {r.subtitle && <p className="text-xs text-gray-400 tracking-wide">{r.subtitle}</p>}
          </div>
        )}
        <div
          className={r.cardW > 0 ? "flex flex-wrap justify-center" : `grid ${colClass[r.cols] || "grid-cols-2 sm:grid-cols-4"}`}
          style={{ gap: `${r.gap}px` }}>
          {r.cards.map((card, i) => (
            <div key={i} className="relative bg-[#1a1a1a] overflow-hidden rounded-sm group flex-shrink-0"
              style={{ height: `${r.cardH}px`, width: r.cardW > 0 ? `${r.cardW}px` : undefined }}>
              {card.media_type === "video" && card.media_url
                ? <video src={card.media_url} muted loop playsInline className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"/>
                : card.media_url
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={card.media_url} alt={card.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"/>
                : <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white/20 text-4xl">▶</span>
                  </div>
              }
              {/* Play icon for video */}
              {card.media_type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-white/50 text-3xl group-hover:text-white/70 transition-colors">▶</span>
                </div>
              )}
              {/* Bottom overlay */}
              {(card.title || card.tag) && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                  {card.title && <p className="text-white text-[11px] font-medium leading-tight">{card.title}</p>}
                  {card.tag && <p className="text-white/60 text-[9px] tracking-widest uppercase mt-0.5">{card.tag}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedLook({ featured: f }: { featured: FeaturedLookData }) {
  return (
    <section className="py-16 bg-[#faf8f6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Text */}
          <div>
            {f.label && (
              <p className="text-[10px] tracking-[0.5em] uppercase text-[#3B5373] mb-5">{f.label}</p>
            )}
            <h2 className="font-serif text-4xl md:text-5xl text-[#1a1a1a] font-light leading-[1.1] mb-5">{f.heading}</h2>
            {f.desc && <p className="text-sm text-[#888] leading-relaxed mb-8 max-w-sm">{f.desc}</p>}

            {/* Products */}
            {f.products.length > 0 && (
              <div className="flex flex-col mb-8">
                {f.products.map((p, i) => (
                  <Link key={i} href={p.slug ? `/products/${p.slug}` : "#"} className="flex items-center gap-4 py-4 border-b border-[#e0ddd8] group hover:bg-white hover:px-2 transition-all">
                    <div className="w-12 h-12 rounded-full bg-[#e8e4de] overflow-hidden flex-shrink-0">
                      {p.image
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={p.image} alt={p.title} className="w-full h-full object-cover object-top"/>
                        : null}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#1a1a1a] group-hover:text-[#3B5373] transition-colors">{p.title}</p>
                      <p className="text-xs text-[#888]">₹{p.price}</p>
                    </div>
                    <span className="text-[#3B5373] opacity-0 group-hover:opacity-100 text-xs transition-opacity">→</span>
                  </Link>
                ))}
              </div>
            )}

            {/* CTAs */}
            <div className="flex gap-3 flex-wrap">
              {f.cta1Text && (
                <Link href={f.cta1Url} className="bg-[#3B5373] text-white text-[11px] tracking-[0.2em] uppercase font-semibold px-6 py-3 hover:bg-[#2d3f4f] transition-colors">
                  {f.cta1Text}
                </Link>
              )}
              {f.cta2Text && (
                <Link href={f.cta2Url} className="border border-[#3B5373] text-[#3B5373] text-[11px] tracking-[0.2em] uppercase font-semibold px-6 py-3 hover:bg-[#3B5373] hover:text-white transition-colors">
                  {f.cta2Text}
                </Link>
              )}
            </div>
          </div>

          {/* Right — Image/Video */}
          <div className="relative aspect-[4/5] bg-[#e8e4de] overflow-hidden">
            {f.image && f.mediaType === "video"
              ? <video src={f.image} autoPlay muted loop playsInline className="w-full h-full object-cover object-center"/>
              : f.image
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={f.image} alt={f.heading} className="w-full h-full object-cover object-center"/>
              : <div className="w-full h-full flex items-center justify-center text-[#aaa] text-xs">Featured Look</div>
            }
            {f.label && (
              <div className="absolute bottom-5 left-5 bg-[#3B5373] text-white text-[9px] tracking-[0.3em] uppercase px-3 py-2">
                {f.label}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Style Ideas | Classie",
  description: "Outfit inspiration and styling tips from Classie — heels, clip-ons and more.",
};

export default async function StyleIdeasPage() {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch all settings
  const allKeys = [
    "si_hero_bg_type","si_hero_bg_url","si_hero_slides","si_hero_text_pos",
    "si_hero_eyebrow","si_hero_title","si_hero_title_italic","si_hero_subtitle",
    "si_hero_show_stats","si_hero_stat1_val","si_hero_stat1_label",
    "si_hero_stat2_val","si_hero_stat2_label","si_hero_stat3_val","si_hero_stat3_label",
    "si_occasions","si_cards_per_row",
    "si_featured_visible","si_featured_label","si_featured_heading","si_featured_desc",
    "si_featured_image","si_featured_media_type","si_featured_products",
    "si_featured_cta1_text","si_featured_cta1_url","si_featured_cta2_text","si_featured_cta2_url",
    "si_reels_visible","si_reels_heading","si_reels_subtitle","si_reels_cols","si_reels_cards","si_reels_card_h","si_reels_card_w","si_reels_gap",
  ];

  const [{ data: settingsRows }, { data: looksData }] = await Promise.all([
    sb.from("site_settings").select("key,value").in("key", allKeys),
    sb.from("style_inspo").select("*").eq("active", true).order("display_order", { ascending: true }),
  ]);

  const cfg: Record<string, string> = {};
  (settingsRows ?? []).forEach((r: { key: string; value: string }) => { cfg[r.key] = r.value; });

  const hero = {
    bgType:      (cfg["si_hero_bg_type"] || "none") as "none"|"image"|"video"|"slider",
    bgUrl:       cfg["si_hero_bg_url"] || "",
    slides:      (() => { try { return JSON.parse(cfg["si_hero_slides"] || "[]"); } catch { return []; } })(),
    textPos:     (cfg["si_hero_text_pos"] || "center") as "left"|"center"|"right",
    eyebrow:     cfg["si_hero_eyebrow"] || "Lookbook 2024",
    title:       cfg["si_hero_title"] || "One Pair.",
    titleItalic: cfg["si_hero_title_italic"] || "Every Occasion.",
    subtitle:    cfg["si_hero_subtitle"] || "Style ideas, outfit inspo, and the looks our team is loving right now.",
    showStats:   cfg["si_hero_show_stats"] === "true",
    stat1Val: cfg["si_hero_stat1_val"] || "", stat1Label: cfg["si_hero_stat1_label"] || "Looks",
    stat2Val: cfg["si_hero_stat2_val"] || "", stat2Label: cfg["si_hero_stat2_label"] || "Styles",
    stat3Val: cfg["si_hero_stat3_val"] || "Free", stat3Label: cfg["si_hero_stat3_label"] || "Shipping ₹999+",
  };

  const occasions: string[] = (() => {
    try { return JSON.parse(cfg["si_occasions"] || "[]"); } catch { return []; }
  })();
  const finalOccasions = occasions.length > 0 ? occasions : ["All Looks","Date Night","Work & Play","Festive","Casual","Wedding"];

  const cardsPerRow = parseInt(cfg["si_cards_per_row"] || "4") || 4;

  const looks = (looksData ?? []).map((r: Record<string, unknown>) => ({
    id: String(r.id),
    title: String(r.title || ""),
    description: String(r.description || ""),
    tag: String(r.tag || ""),
    image_url: String(r.image_url || ""),
    media_type: String(r.media_type || "image"),
    look_number: Number(r.look_number || 0),
    link_url: String(r.link_url || ""),
    display_order: Number(r.display_order || 0),
  }));

  // Featured Look — product IDs → join with products table
  const featuredVisible = cfg["si_featured_visible"] !== "false";
  const featuredProductIds: string[] = (() => { try { return JSON.parse(cfg["si_featured_products"] || "[]"); } catch { return []; } })();
  let featuredProductRows: {id:string;title:string;price:number;image:string;slug:string}[] = [];
  if (featuredProductIds.length > 0) {
    const { data: pRows } = await sb.from("products").select("id,title,price,image,slug").in("id", featuredProductIds);
    // preserve the admin-selected order
    const pMap = new Map((pRows ?? []).map((p: Record<string,unknown>) => [String(p.id), p]));
    featuredProductRows = featuredProductIds.map(id => {
      const p = pMap.get(id);
      return p ? { id: String(p.id), title: String(p.title||""), price: Number(p.price||0), image: String(p.image||""), slug: String(p.slug||"") } : null;
    }).filter(Boolean) as typeof featuredProductRows;
  }
  const featured = {
    label:     cfg["si_featured_label"] || "EDITOR'S PICK",
    heading:   cfg["si_featured_heading"] || "The Look Everyone's Asking About",
    desc:      cfg["si_featured_desc"] || "",
    image:     cfg["si_featured_image"] || "",
    mediaType: (cfg["si_featured_media_type"] || "image") as "image"|"video",
    products:  featuredProductRows,
    cta1Text:  cfg["si_featured_cta1_text"] || "Shop This Look",
    cta1Url:   cfg["si_featured_cta1_url"] || "/shop/heels",
    cta2Text:  cfg["si_featured_cta2_text"] || "View All Heels",
    cta2Url:   cfg["si_featured_cta2_url"] || "/shop/heels",
  };

  // Style Reels
  const reelsVisible = cfg["si_reels_visible"] !== "false";
  const reels = {
    heading:  cfg["si_reels_heading"]  || '"Because Your Style Never Stays the Same."',
    subtitle: cfg["si_reels_subtitle"] || "Watch how real women are styling their Classie heels",
    cols:     parseInt(cfg["si_reels_cols"] || "4") || 4,
    cardH:    parseInt(cfg["si_reels_card_h"] || "480") || 480,
    cardW:    parseInt(cfg["si_reels_card_w"] || "0") || 0,
    gap:      parseInt(cfg["si_reels_gap"] || "12") || 12,
    cards:    (() => { try { return JSON.parse(cfg["si_reels_cards"] || "[]"); } catch { return []; } })() as {title:string;tag:string;media_url:string;media_type:"image"|"video"}[],
  };

  return (
    <>
      <StyleIdeasHero hero={hero} />
      <StyleIdeasLooksClient looks={looks} occasions={finalOccasions} cardsPerRow={cardsPerRow} />
      {featuredVisible && featured.heading && <FeaturedLook featured={featured} />}
      {reelsVisible && reels.cards.length > 0 && <StyleReels reels={reels} />}

    </>
  );
}
