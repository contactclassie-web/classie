import { Metadata } from "next";
import Link from "next/link";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { publicSupabase } from "@/lib/supabasePublic";
import { loadGiftSets } from "@/lib/giftSetsServer";
import { ABOUT_DEFAULTS } from "@/lib/aboutContent";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: "About CLASSIE — Shoe Clips, Shoe Charms & Heels Brand India" },
  description: "CLASSIE makes clip-on shoe charms and easy heels for Indian women. Clip a crystal, bow, flower or jute charm onto your shoes and get a new look in seconds. COD available, 7-day returns on heels.",
  alternates: { canonical: "https://www.classie.co.in/about" },
  keywords: ["classie brand", "shoe clips india", "shoe charms india", "how to use shoe clips", "classie founder", "classie story", "women's heels india brand"],
  openGraph: {
    title: "About CLASSIE — One heel. Endless looks.",
    description: "Clip-on shoe charms and easy heels for Indian women. Change your shoe's look in seconds.",
    url: "https://www.classie.co.in/about",
    type: "website",
    siteName: "CLASSIE",
  },
};

const NAVY = "#3B5373";
const GOLD_TEXT = "#8a6a3a";

// Style cards: which product tag each card shows (card 4 = gift sets)
const STYLE_TAGS = ["Rhinestone Shoe Charms", "Bow Shoe Charms", "Flower Shoe Charms"];

type ProductRow = {
  price: number | string;
  image: string | null;
  category: string;
  tags: string[] | null;
  variants: string[] | null;
  variant_type: string | null;
  active: boolean | null;
};

const rupees = (n: number) => "₹" + n.toLocaleString("en-IN");

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className="text-[10px] md:text-[11px] tracking-[0.3em] uppercase font-medium" style={{ color: light ? "#E6D3B3" : GOLD_TEXT }}>
      {children}
    </p>
  );
}

function Heading({ title, em, light = false, as = "h2", className = "" }: { title: string; em: string; light?: boolean; as?: "h1" | "h2"; className?: string }) {
  const Tag = as;
  return (
    <Tag className={`font-serif font-normal leading-[1.06] ${className}`} style={{ color: light ? "#ffffff" : "#1a1a1a" }}>
      {title}{title && em ? " " : ""}
      {em && <em style={{ color: light ? "#ffffff" : NAVY }}>{em}</em>}
    </Tag>
  );
}

const Icon = {
  pair: <><circle cx="8" cy="12" r="4.5" /><circle cx="16" cy="12" r="4.5" /></>,
  shield: <><path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7z" /><path d="M9 12l2 2 4-4" /></>,
  shoe: <path d="M3 17h13l4-3v-2l-6-1-3-4H8L6 12H3z" />,
  bag: <><path d="M6 8h12l-1 12H7z" /><path d="M9 8a3 3 0 0 1 6 0" /></>,
  gem: <><path d="M6 3h12l3 6-9 12L3 9z" /><path d="M3 9h18M9 3l3 18 3-18" /></>,
  cash: <><rect x="3" y="6" width="18" height="12" rx="1.5" /><circle cx="12" cy="12" r="2.6" /></>,
  returns: <><path d="M4 12a8 8 0 1 0 2.4-5.7" /><path d="M4 4v4.3h4.3" /></>,
  chat: <path d="M20 12a8 8 0 0 1-11.7 7.1L4 20l1-4A8 8 0 1 1 20 12z" />,
  check: <path d="M5 12l5 5 9-10" />,
  open: <><path d="M8 4l4 4 4-4" /><path d="M8 20l4-4 4 4" /><path d="M5 12h14" /></>,
  slide: <><path d="M4 12h12" /><path d="M12 8l4 4-4 4" /><path d="M20 5v14" /></>,
};

function Svg({ d, size = 24, color = NAVY, width = 1.5 }: { d: React.ReactNode; size?: number; color?: string; width?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
      {d}
    </svg>
  );
}

const btnSolid = "inline-flex items-center justify-center text-center bg-[#3B5373] hover:bg-[#2a3d55] text-white text-[11px] tracking-[0.14em] uppercase px-6 py-4 transition-colors";
const btnLine = "inline-flex items-center justify-center text-center border border-[#3B5373] text-[#3B5373] hover:bg-[#3B5373] hover:text-white text-[11px] tracking-[0.14em] uppercase px-6 py-[15px] transition-colors";

export default async function AboutPage() {
  const sb = publicSupabase(60);
  const [settingsRes, productsRes, giftSets] = await Promise.all([
    sb.from("site_settings").select("key,value").like("key", "au%"),
    sb.from("products").select("price,image,category,tags,variants,variant_type,active"),
    loadGiftSets().catch(() => null),
  ]);

  const cfg: Record<string, string> = {};
  (settingsRes.data ?? []).forEach((r: { key: string; value: string }) => { cfg[r.key] = r.value; });
  const c = (key: string) => (cfg[key] !== undefined && cfg[key].trim() !== "" ? cfg[key] : ABOUT_DEFAULTS[key] ?? "");

  // Photos: new field → old page's photo → nothing
  const heroImg = c("au2_hero_img") || cfg.au_s3_img || "";
  const storyImg = c("au2_story_img") || cfg.au_s1_img || "";
  const heelsImg = c("au2_heels_img") || cfg.au_s2_img || "";
  const clipImg = c("au2_clip_img");

  const founderName = cfg.au_founder_name || "Ishika Garg";
  const founderRole = cfg.au_founder_title || "Founder, Classie";
  const founderImg = cfg.au_founder_img || "";

  // Products → prices, photos and heel sizes
  const products = ((productsRes.data ?? []) as ProductRow[]).filter((p) => p.active !== false);
  const styleCards = STYLE_TAGS.map((tag, i) => {
    const list = products.filter((p) => (p.tags ?? []).some((t) => t.toLowerCase() === tag.toLowerCase()));
    const prices = list.map((p) => Number(p.price)).filter((n) => n > 0);
    const n = i + 1;
    return {
      name: c(`au2_style${n}_name`),
      text: c(`au2_style${n}_text`),
      img: c(`au2_style${n}_img`) || list.find((p) => p.image)?.image || "",
      from: prices.length ? Math.min(...prices) : 0,
      href: `/shop/clips?type=${encodeURIComponent(tag)}`,
    };
  });
  const sets = (giftSets?.config.sets ?? []).filter((s) => s.active && !s.askOnly && s.price > 0);
  const firstSet = sets[0];
  const firstSetImg = firstSet
    ? firstSet.images[0] || giftSets?.products[firstSet.items[0]?.slug]?.image || ""
    : "";
  styleCards.push({
    name: c("au2_style4_name"),
    text: c("au2_style4_text"),
    img: c("au2_style4_img") || firstSetImg,
    from: sets.length ? Math.min(...sets.map((s) => s.price)) : 0,
    href: "/gift-sets",
  });

  const heels = products.filter((p) => p.category === "heels");
  const heelPrices = heels.map((p) => Number(p.price)).filter((n) => n > 0);
  const heelFrom = heelPrices.length ? Math.min(...heelPrices) : 0;
  const sizeNums = Array.from(new Set(heels.filter((p) => p.variant_type === "size").flatMap((p) => p.variants ?? [])))
    .map(Number).filter((n) => n > 0).sort((a, b) => a - b);
  const sizeText = sizeNums.length ? `Sizes ${sizeNums[0]} to ${sizeNums[sizeNums.length - 1]} (EU)` : "";

  const paragraphs = (s: string) => s.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  const facts = [1, 2, 3, 4].map((n, i) => ({
    title: c(`au2_clip_f${n}_title`),
    sub: c(`au2_clip_f${n}_sub`),
    icon: [Icon.pair, Icon.shield, Icon.shoe, Icon.bag][i],
  })).filter((f) => f.title);

  const steps = [1, 2, 3].map((n, i) => ({
    n,
    title: c(`au2_step${n}_title`),
    text: c(`au2_step${n}_text`),
    img: c(`au2_step${n}_img`),
    icon: [Icon.open, Icon.slide, Icon.check][i],
  }));
  const stepsHavePhotos = steps.some((s) => s.img);
  const videoUrl = c("au2_video_url");

  const promises = [1, 2, 3, 4].map((n, i) => ({
    title: c(`au2_p${n}_title`),
    sub: c(`au2_p${n}_sub`),
    icon: [Icon.gem, Icon.cash, Icon.returns, Icon.chat][i],
  })).filter((p) => p.title);

  const careTips = c("au2_care_text").split("\n").map((s) => s.trim()).filter(Boolean);
  const founderQuote = c("au2_founder_quote");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "CLASSIE",
        "url": "https://www.classie.co.in",
        "logo": "https://www.classie.co.in/logo.jpg",
        "description": "CLASSIE makes clip-on shoe charms (crystal, bow, flower and jute shoe clips) and easy heels for Indian women.",
        "founder": { "@type": "Person", "name": founderName },
        "foundingDate": "2024",
        "areaServed": "IN",
        "contactPoint": { "@type": "ContactPoint", "contactType": "Customer Service", "availableLanguage": ["English", "Hindi"] },
        "sameAs": ["https://www.instagram.com/classie.co.in", "https://www.classie.co.in"],
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to put on a CLASSIE shoe clip",
        "totalTime": "PT10S",
        "step": steps.filter((s) => s.title).map((s) => ({ "@type": "HowToStep", "name": s.title, "text": s.text || s.title })),
      }) }} />

      {/* ── 1. HERO ─────────────────────────────────────────── */}
      <section className="bg-[#F7F4EF] grid grid-cols-1 md:grid-cols-2">
        <div className="md:order-2">
          {heroImg ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={optimizeCloudinary(heroImg, 1200)} alt="The same heel styled with two different CLASSIE shoe clips" className="w-full aspect-square md:aspect-auto md:h-full md:min-h-[560px] object-cover block" fetchPriority="high" />
          ) : (
            <div className="w-full aspect-square md:h-full bg-[#EDE7DD]" />
          )}
        </div>
        <div className="md:order-1 px-5 pt-8 pb-10 md:px-16 lg:pl-[8vw] lg:pr-16 md:py-20 flex flex-col justify-center gap-4 md:gap-6">
          <Eyebrow>{c("au2_hero_eyebrow")}</Eyebrow>
          <h1 className="font-serif font-normal text-[44px] md:text-[64px] lg:text-[72px] leading-[1.02] text-[#1a1a1a]">
            {c("au2_hero_title")}
            {c("au2_hero_title_em") && <><br /><em style={{ color: NAVY }}>{c("au2_hero_title_em")}</em></>}
          </h1>
          <p className="text-[14px] md:text-[16px] leading-[1.7] text-[#4a4a4a] max-w-[470px]">{c("au2_hero_text")}</p>
          <div className="grid grid-cols-2 md:flex gap-2 md:gap-3 mt-1">
            <Link href="/shop/clips" className={btnSolid}><span className="md:hidden">Shoe Charms</span><span className="hidden md:inline">Shop Shoe Charms</span></Link>
            <Link href="/shop/heels" className={btnLine}><span className="md:hidden">Heels</span><span className="hidden md:inline">Shop Heels</span></Link>
          </div>
        </div>
      </section>

      {/* ── 2. OUR STORY ────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-10 py-14 md:py-28 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-x-20 md:gap-y-6 items-center">
        <div className="flex flex-col gap-4 md:gap-5 md:order-2 md:self-end">
          <Eyebrow>{c("au2_story_eyebrow")}</Eyebrow>
          <Heading title={c("au2_story_title")} em={c("au2_story_title_em")} className="text-[32px] md:text-[46px]" />
        </div>
        {storyImg && (
          <div className="md:order-1 md:row-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={optimizeCloudinary(storyImg, 1000)} alt="CLASSIE heels styled with a white dress" loading="lazy" className="w-full aspect-[4/3] md:aspect-[4/5] object-cover block" />
          </div>
        )}
        <div className="flex flex-col gap-4 md:order-3 md:col-start-2 md:self-start">
          {paragraphs(c("au2_story_text")).map((p, i) => (
            <p key={i} className="text-[14px] md:text-[15px] leading-[1.8] text-[#4a4a4a] whitespace-pre-line">{p}</p>
          ))}
          {founderQuote && (
            <div className="flex items-center gap-4 mt-3 pt-5 border-t border-[#ECE6DC]">
              {founderImg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={optimizeCloudinary(founderImg, 160)} alt={founderName} loading="lazy" className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-full shrink-0 flex items-center justify-center text-white font-serif text-2xl" style={{ background: NAVY }}>
                  {founderName.charAt(0)}
                </div>
              )}
              <div className="flex flex-col gap-1">
                <p className="font-serif italic text-[18px] md:text-[20px] leading-[1.35]" style={{ color: NAVY }}>&ldquo;{founderQuote}&rdquo;</p>
                <p className="text-[12px] md:text-[12.5px] text-[#555]">{founderName} · {founderRole}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 3. MEET THE SHOE CLIP ───────────────────────────── */}
      <section className="text-white grid grid-cols-1 md:grid-cols-2" style={{ background: NAVY }}>
        {clipImg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={optimizeCloudinary(clipImg, 1100)} alt="A heel with a CLASSIE crystal shoe clip on the toe" loading="lazy" className="w-full aspect-[8/7] md:aspect-auto md:h-full md:min-h-[600px] object-cover block" />
        )}
        <div className={`px-5 pt-9 pb-11 md:px-16 lg:pr-[8vw] md:py-20 flex flex-col justify-center gap-4 md:gap-6 ${clipImg ? "" : "md:col-span-2 max-w-3xl"}`}>
          <Eyebrow light>{c("au2_clip_eyebrow")}</Eyebrow>
          <Heading title={c("au2_clip_title")} em={c("au2_clip_title_em")} light className="text-[34px] md:text-[48px]" />
          <p className="text-[14px] md:text-[15px] leading-[1.75] text-white/90">{c("au2_clip_text")}</p>
          {facts.length > 0 && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-7 sm:gap-y-5 mt-1">
              {facts.map((f, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <Svg d={f.icon} color="#E6D3B3" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[14px] font-medium">{f.title}</span>
                    {f.sub && <span className="text-[12.5px] text-white/80">{f.sub}</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ─────────────────────────────────── */}
      <section id="how-it-works" className="scroll-mt-24 max-w-[1200px] mx-auto py-14 md:py-28 flex flex-col gap-6 md:gap-12">
        <div className="px-5 md:px-10 flex flex-col gap-3 md:items-center md:text-center">
          <Eyebrow>{c("au2_steps_eyebrow")}</Eyebrow>
          <Heading title={c("au2_steps_title")} em={c("au2_steps_title_em")} className="text-[32px] md:text-[46px]" />
          {c("au2_steps_sub") && <p className="text-[14px] md:text-[15px] text-[#555]">{c("au2_steps_sub")}</p>}
        </div>
        <ol className={stepsHavePhotos
          ? "flex md:grid md:grid-cols-3 gap-3 md:gap-7 overflow-x-auto snap-x snap-mandatory px-5 md:px-10 pb-2 [scrollbar-width:none]"
          : "grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-7 px-5 md:px-10"}>
          {steps.map((s) => (
            <li key={s.n} className={stepsHavePhotos ? "flex-[0_0_72%] sm:flex-[0_0_45%] md:flex-auto snap-start flex flex-col gap-3 md:gap-4" : "bg-[#F7F4EF] p-5 md:p-8 flex md:flex-col gap-4 items-start"}>
              {stepsHavePhotos && (
                s.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={optimizeCloudinary(s.img, 700)} alt={s.title} loading="lazy" className="w-full aspect-square md:aspect-[4/3] object-cover block" />
                ) : (
                  <div className="w-full aspect-square md:aspect-[4/3] bg-[#EDE7DD] flex items-center justify-center"><Svg d={s.icon} size={44} width={1.2} /></div>
                )
              )}
              {!stepsHavePhotos && <span className="hidden md:block"><Svg d={s.icon} size={32} width={1.3} /></span>}
              <div className="flex gap-3 items-baseline">
                <span className="font-serif text-[34px] md:text-[40px] leading-none" style={{ color: "#B08D57" }}>{s.n}</span>
                <div className="flex flex-col gap-1">
                  <span className="text-[15px] md:text-[16px] font-medium">{s.title}</span>
                  {s.text && <span className="text-[13px] md:text-[13.5px] text-[#555] leading-[1.6]">{s.text}</span>}
                </div>
              </div>
            </li>
          ))}
        </ol>
        {videoUrl && (
          <div className="px-5 md:px-10 md:text-center">
            <a href={videoUrl} target="_blank" rel="noopener noreferrer" className={`${btnLine} w-full md:w-auto`}>Watch how it works</a>
          </div>
        )}
      </section>

      {/* ── 5. STYLES ───────────────────────────────────────── */}
      <section className="bg-[#F7F4EF]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-10 py-14 md:py-24 flex flex-col gap-6 md:gap-11">
          <div className="px-1 md:px-0 flex flex-col md:flex-row md:justify-between md:items-end gap-3">
            <div className="flex flex-col gap-3">
              <Eyebrow>{c("au2_styles_eyebrow")}</Eyebrow>
              <Heading title={c("au2_styles_title")} em={c("au2_styles_title_em")} className="text-[32px] md:text-[46px]" />
            </div>
            <Link href="/shop/clips" className="hidden md:inline text-[11px] tracking-[0.14em] uppercase border-b border-[#3B5373] pb-1" style={{ color: NAVY }}>See all shoe charms →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-5">
            {styleCards.map((card, i) => (
              <Link key={i} href={card.href} className="group bg-white flex flex-col">
                <div className="overflow-hidden bg-[#EDE7DD]">
                  {card.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={optimizeCloudinary(card.img, 600)} alt={`${card.name} shoe clips`} loading="lazy" className="w-full aspect-square object-cover block transition-transform duration-500 group-hover:scale-[1.04]" />
                  ) : (
                    <div className="w-full aspect-square" />
                  )}
                </div>
                <div className="p-3 md:p-5 flex flex-col gap-1 md:gap-1.5">
                  <span className="font-serif text-[21px] md:text-[26px] leading-tight text-[#1a1a1a]">{card.name}</span>
                  {card.text && <span className="text-[11.5px] md:text-[13px] text-[#555] leading-[1.5]">{card.text}</span>}
                  {card.from > 0 && <span className="text-[12px] md:text-[12.5px] font-medium mt-0.5" style={{ color: NAVY }}>From {rupees(card.from)}</span>}
                </div>
              </Link>
            ))}
          </div>
          <Link href="/shop/clips" className={`${btnSolid} md:hidden`}>See all shoe charms</Link>
        </div>
      </section>

      {/* ── 6. OUR HEELS ────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-10 py-14 md:py-28 grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-20 items-center">
        <div className="flex flex-col gap-4 md:gap-5">
          <Eyebrow>{c("au2_heels_eyebrow")}</Eyebrow>
          <Heading title={c("au2_heels_title")} em={c("au2_heels_title_em")} className="text-[32px] md:text-[46px]" />
          {heelsImg && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={optimizeCloudinary(heelsImg, 900)} alt="CLASSIE blush pink heels with a crystal clip" loading="lazy" className="md:hidden w-full aspect-[4/5] object-cover block my-1" />
          )}
          <p className="text-[14px] md:text-[15px] leading-[1.8] text-[#4a4a4a]">{c("au2_heels_text")}</p>
          <ul className="flex flex-col gap-2.5 text-[13.5px] md:text-[14px] text-[#333]">
            {sizeText && (
              <li className="flex gap-2.5 items-center"><Svg d={Icon.check} size={16} width={2} />
                <span>{sizeText} — <Link href="/size-guide" className="underline" style={{ color: NAVY }}>size guide</Link></span>
              </li>
            )}
            {c("au2_heels_point") && <li className="flex gap-2.5 items-center"><Svg d={Icon.check} size={16} width={2} />{c("au2_heels_point")}</li>}
            {heelFrom > 0 && <li className="flex gap-2.5 items-center"><Svg d={Icon.check} size={16} width={2} />From {rupees(heelFrom)}</li>}
          </ul>
          <Link href="/shop/heels" className={`${btnSolid} mt-2 md:self-start`}>Shop Heels</Link>
        </div>
        {heelsImg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={optimizeCloudinary(heelsImg, 1000)} alt="CLASSIE blush pink heels with a crystal clip" loading="lazy" className="hidden md:block w-full aspect-[4/5] object-cover" />
        )}
      </section>

      {/* ── 7. PROMISES ─────────────────────────────────────── */}
      {promises.length > 0 && (
        <section className="border-y border-[#ECE6DC]">
          <ul className="max-w-[1200px] mx-auto px-5 md:px-10 py-8 md:py-16 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 md:gap-8">
            {promises.map((p, i) => (
              <li key={i} className="flex flex-col gap-1.5 md:gap-2.5">
                <Svg d={p.icon} size={28} width={1.4} />
                <span className="text-[13px] md:text-[15px] font-medium">{p.title}</span>
                {p.sub && <span className="hidden md:block text-[13px] text-[#555] leading-[1.6]">{p.sub}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── 8. CARE + LAST BUTTON ───────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-5 md:px-10 pt-11 pb-14 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-20 items-start">
        {careTips.length > 0 && (
          <div className="flex flex-col gap-3 md:gap-5">
            <Eyebrow>{c("au2_care_title")}</Eyebrow>
            <ol className="list-decimal pl-5 flex flex-col gap-2 md:gap-3 text-[13.5px] md:text-[14.5px] text-[#333] leading-[1.6]">
              {careTips.map((tip, i) => <li key={i}>{tip}</li>)}
            </ol>
          </div>
        )}
        <div className={`bg-[#F7F4EF] p-6 md:p-12 flex flex-col gap-4 ${careTips.length ? "" : "md:col-span-2"}`}>
          <Heading title={c("au2_cta_title")} em={c("au2_cta_title_em")} className="text-[30px] md:text-[40px]" />
          {c("au2_cta_text") && <p className="text-[14px] md:text-[14.5px] text-[#4a4a4a] leading-[1.7]">{c("au2_cta_text")}</p>}
          <div className="flex flex-col sm:flex-row gap-2.5 md:gap-3">
            <Link href="/shop/clips" className={btnSolid}>Shop Shoe Charms</Link>
            <Link href="/gift-sets" className={btnLine}>Gift Sets</Link>
          </div>
          <Link href="/custom-designs" className="text-[13px] underline py-2 text-center sm:text-left" style={{ color: NAVY }}>Want your own design? Tell us your idea →</Link>
        </div>
      </section>
    </>
  );
}
