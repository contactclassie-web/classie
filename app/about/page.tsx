import { Metadata } from "next";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "About Us — CLASSIE",
  description: "The Classie story — where fashion meets freedom, designed for the modern woman.",
};

export default async function AboutPage() {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await sb
    .from("site_settings")
    .select("key,value")
    .like("key", "au_%");
  const cfg: Record<string, string> = {};
  (data ?? []).forEach((r: { key: string; value: string }) => {
    cfg[r.key] = r.value;
  });

  // Config helpers with defaults
  const c = (key: string, def: string) =>
    cfg[key] !== undefined && cfg[key] !== "" ? cfg[key] : def;

  // Hero
  const heroHeading = c("au_hero_heading", "About CLASSIE");
  const heroEyebrow = c("au_hero_eyebrow", "Our Story");
  const heroText = c(
    "au_hero_text",
    "We've all had that moment —\n\nstanding in front of a wardrobe full of shoes, yet feeling like nothing fits the vibe.\n\nBecause the truth is, it's never about how many pairs we own. It's about having the right pair for the right moment — a wedding, a festival, a big meeting, or a brunch date.\n\nAnd too often, we end up buying a new pair just to match a single outfit."
  );

  // Banner
  const bannerImg = c("au_banner_img", "");

  // Story 1
  const s1Heading = c("au_s1_heading", "Where It All Began — The Classic Clip-On Idea");
  const s1Text = c(
    "au_s1_text",
    "Classie began with a simple thought — fashion should be yours.\n\nFlexible. Creative. Timeless.\n\nWe asked ourselves:\nWhy should one outfit need a new heel?\nWhy shouldn't your footwear change as easily as your moods?\n\nThat's when we imagined something different.\n\nWhat if one pair of heels could transform into multiple looks just by swapping an accessory?\n\nA Classie heel — designed to shift from minimal to festive, formal to playful with just one small change, using our signature clip on accessories."
  );
  const s1Img = c("au_s1_img", "");

  // Story 2
  const s2Heading = c("au_s2_heading", "Classic Heels — Easy to Love");
  const s2Text = c(
    "au_s2_text",
    "The real challenge began when we took a closer look at the market.\n\nHeels were either beautiful but uncomfortable, or priced far beyond everyday reach.\n\nSo, we decided to create our own solution.\n\nAt Classie, we design heels that balance everything that matters — thoughtful design, lasting comfort, premium finishing, and pricing that feels fair."
  );
  const s2Img = c("au_s2_img", "");

  // Story 3
  const s3Heading = c("au_s3_heading", "Classie Is More Than Heels");
  const s3Text = c(
    "au_s3_text",
    "Classie is more than just heels or clip-ons.\n\nIt's an idea that keeps growing.\n\nWe believe style shouldn't feel fixed or limited. It should change with your mood, your plans, and your personality.\n\nStyle it your way, with Classie."
  );
  const s3Img = c("au_s3_img", "");

  // Features
  const featsHeading = c("au_feats_heading", "What Makes Classie Different");
  const feat1Icon = c("au_feat1_icon", "👠");
  const feat1Title = c("au_feat1_title", "Handcrafted With Purpose");
  const feat1Desc = c(
    "au_feat1_desc",
    "Every Classie heel and clip-on is shaped by skilled hands, with careful human detailing at every stage."
  );
  const feat2Icon = c("au_feat2_icon", "✨");
  const feat2Title = c("au_feat2_title", "Premium Materials, Refined Finish");
  const feat2Desc = c(
    "au_feat2_desc",
    "We choose our materials the same way you choose your outfits — with care. Our heels are finished with premium materials."
  );
  const feat3Icon = c("au_feat3_icon", "🎀");
  const feat3Title = c("au_feat3_title", "Heel + Clip On");
  const feat3Desc = c(
    "au_feat3_desc",
    "One thoughtfully designed heel. Interchangeable clip-ons that change the look, without changing the pair."
  );

  // Founder
  const founderQuote = c(
    "au_founder_quote",
    "Classie was created to give women the freedom I always wanted — the freedom to style your look, your way. Fashion shouldn't limit you. It should move with you, match your moments, and celebrate your creativity. This is just the beginning, and I'm so grateful you're here."
  );
  const founderName = c("au_founder_name", "Ishika Garg");
  const founderTitle = c("au_founder_title", "Founder, Classie");
  const founderImg = c("au_founder_img", "");

  // Helper: render multi-paragraph text
  function renderText(text: string) {
    return text.split("\n\n").map((para, i) => (
      <p key={i} className="text-[15px] text-[#555] leading-relaxed whitespace-pre-line">
        {para}
      </p>
    ));
  }

  // Helper: story image placeholder
  function StoryImgPlaceholder() {
    return (
      <div className="w-full h-full min-h-[300px] bg-[#e8ecf1] rounded-2xl flex items-center justify-center">
        <span className="text-4xl">👠</span>
      </div>
    );
  }

  return (
    <>
      {/* ══════════════════════════════════════════
          SECTION 1 — Hero Split
      ══════════════════════════════════════════ */}
      <section className="flex flex-col md:flex-row min-h-[420px]">
        {/* Left */}
        <div className="md:w-1/2 bg-[#f7f7f7] flex flex-col justify-center px-10 py-16 md:px-16 md:py-20">
          <p
            className="text-[11px] tracking-[0.4em] uppercase mb-4 font-medium"
            style={{ color: "#3B5373" }}
          >
            {heroEyebrow}
          </p>
          <h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight"
            style={{ color: "#3B5373" }}
          >
            {heroHeading}
          </h1>
        </div>

        {/* Right */}
        <div className="md:w-1/2 bg-white flex flex-col justify-center px-10 py-16 md:px-16 md:py-20 space-y-5">
          {renderText(heroText)}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — Full-width Banner
      ══════════════════════════════════════════ */}
      <div className="relative w-full h-[400px] overflow-hidden">
        {bannerImg ? (
          <Image
            src={bannerImg}
            alt="Classie banner"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full" style={{ background: "#3B5373" }} />
        )}
      </div>

      {/* ══════════════════════════════════════════
          SECTION 3 — Story 1 (text left, image right, white)
      ══════════════════════════════════════════ */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div className="space-y-5">
            <h2
              className="font-serif text-3xl md:text-4xl leading-tight"
              style={{ color: "#3B5373" }}
            >
              {s1Heading}
            </h2>
            <div className="space-y-4">{renderText(s1Text)}</div>
          </div>
          {/* Image */}
          <div className="relative h-[360px] rounded-2xl overflow-hidden">
            {s1Img ? (
              <Image
                src={s1Img}
                alt={s1Heading}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <StoryImgPlaceholder />
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4 — Story 2 (image left, text right, #f7f7f7)
      ══════════════════════════════════════════ */}
      <section className="bg-[#f7f7f7] py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative h-[360px] rounded-2xl overflow-hidden order-2 md:order-1">
            {s2Img ? (
              <Image
                src={s2Img}
                alt={s2Heading}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <StoryImgPlaceholder />
            )}
          </div>
          {/* Text */}
          <div className="space-y-5 order-1 md:order-2">
            <h2
              className="font-serif text-3xl md:text-4xl leading-tight"
              style={{ color: "#3B5373" }}
            >
              {s2Heading}
            </h2>
            <div className="space-y-4">{renderText(s2Text)}</div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 5 — Story 3 (text left, image right, white)
      ══════════════════════════════════════════ */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div className="space-y-5">
            <h2
              className="font-serif text-3xl md:text-4xl leading-tight"
              style={{ color: "#3B5373" }}
            >
              {s3Heading}
            </h2>
            <div className="space-y-4">{renderText(s3Text)}</div>
          </div>
          {/* Image */}
          <div className="relative h-[360px] rounded-2xl overflow-hidden">
            {s3Img ? (
              <Image
                src={s3Img}
                alt={s3Heading}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <StoryImgPlaceholder />
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 6 — Features (3 cards)
      ══════════════════════════════════════════ */}
      <section className="bg-[#f7f7f7] py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <h2
            className="font-serif text-3xl md:text-4xl text-center mb-12"
            style={{ color: "#3B5373" }}
          >
            {featsHeading}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: feat1Icon, title: feat1Title, desc: feat1Desc },
              { icon: feat2Icon, title: feat2Title, desc: feat2Desc },
              { icon: feat3Icon, title: feat3Title, desc: feat3Desc },
            ].map((feat, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm"
              >
                <div className="text-4xl mb-4">{feat.icon}</div>
                <h3
                  className="font-bold text-[15px] mb-3"
                  style={{ color: "#1a1a1a" }}
                >
                  {feat.title}
                </h3>
                <p className="text-sm text-[#666] leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 7 — Founder Quote
      ══════════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="max-w-3xl mx-auto px-6 md:px-10 text-center">
          <blockquote
            className="font-serif text-xl md:text-2xl italic leading-relaxed mb-10"
            style={{ color: "#3B5373" }}
          >
            &ldquo;{founderQuote}&rdquo;
          </blockquote>

          {founderImg ? (
            <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 border-2 border-[#3B5373]">
              <Image
                src={founderImg}
                alt={founderName}
                fill
                className="object-cover object-center"
                sizes="80px"
              />
            </div>
          ) : (
            <div
              className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-serif"
              style={{ background: "#3B5373" }}
            >
              {founderName.charAt(0)}
            </div>
          )}

          <p className="font-bold text-[15px]" style={{ color: "#1a1a1a" }}>
            {founderName}
          </p>
          <p className="text-sm text-[#888] mt-1">{founderTitle}</p>
        </div>
      </section>
    </>
  );
}
