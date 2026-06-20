import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import StyleIdeasHero from "./StyleIdeasHero";
import StyleIdeasLooksClient from "./StyleIdeasLooksClient";

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

  return (
    <>
      <StyleIdeasHero hero={hero} />
      <StyleIdeasLooksClient looks={looks} occasions={finalOccasions} cardsPerRow={cardsPerRow} />
      <section className="py-14 bg-[#3B5373] text-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl mb-3">Create Your Look</h2>
          <p className="text-white/70 text-sm mb-7">Tag us @_classie_in for a chance to be featured in our next lookbook.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/shop/heels" className="btn-ghost-white">Shop Heels</Link>
            <Link href="/shop/clips" className="btn-ghost-white">Shop Clip-ons</Link>
          </div>
        </div>
      </section>
    </>
  );
}
