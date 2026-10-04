import Link from "next/link";
import { optimizeCloudinary } from "@/lib/cloudinary";
import type { HomeConfig, WhyIcon } from "@/lib/homeConfig";
import { withAmount } from "@/lib/homeConfig";

// Shared bits ---------------------------------------------------------------

const WRAP = "max-w-[1280px] mx-auto px-4 md:px-10";
const EYEBROW = "font-sans text-[10px] tracking-[0.3em] uppercase text-[#3B5373]";

export function SectionHeading({ eyebrow, heading, italic, linkText, linkUrl }: {
  eyebrow?: string; heading: string; italic?: string; linkText?: string; linkUrl?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-3 mb-5 md:mb-8">
      <div className="grid gap-1.5">
        {eyebrow && <span className={EYEBROW}>{eyebrow}</span>}
        <h2 className="font-serif font-light text-[28px] md:text-[42px] leading-[1.1] text-[#1a1a1a]">
          {heading} {italic && <em className="italic text-[#3B5373]">{italic}</em>}
        </h2>
      </div>
      {linkText && linkUrl && (
        <Link href={linkUrl} className="font-sans text-[11px] tracking-[0.14em] uppercase text-[#3B5373] border-b border-[#3B5373] pb-0.5 whitespace-nowrap">
          {linkText}
        </Link>
      )}
    </div>
  );
}

function Img({ src, alt = "", w = 800, className = "" }: { src: string; alt?: string; w?: number; className?: string }) {
  if (!src) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={optimizeCloudinary(src, w)} alt={alt} loading="lazy" decoding="async" className={className} />;
}

// A plain pencil-style flower sketch, used until a real customer sketch is added.
export function SketchSvg({ className = "" }: { className?: string }) {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label="Sketch of a flower clip design">
      <rect width="200" height="200" fill="#fdfcf8" />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M0 ${16 * (i + 1) - 0.5}H200`} stroke="#d6dde6" strokeWidth="1" />)}
      <g fill="none" stroke="#5b5b5b" strokeWidth="1.6" strokeLinecap="round" transform="translate(100 96)">
        {petals.map((r) => <ellipse key={r} rx="13" ry="33" transform={`rotate(${r}) translate(0 -33)`} />)}
        <circle r="14" /><circle r="6" />
      </g>
      <g fill="#5b5b5b">
        {petals.map((r) => {
          const a = ((r - 90) * Math.PI) / 180;
          return <circle key={r} cx={100 + Math.cos(a) * 46} cy={96 + Math.sin(a) * 46} r="2.2" />;
        })}
      </g>
      <text x="12" y="190" fontFamily="Georgia, serif" fontStyle="italic" fontSize="13" fill="#7a7a7a">my idea: silver, 8 petals</text>
    </svg>
  );
}

// Sections --------------------------------------------------------------------

export function MarketplaceStrip({ c }: { c: HomeConfig["marketplace"] }) {
  const names = c.names.split(",").map((s) => s.trim()).filter(Boolean);
  if (!names.length && !c.note) return null;
  return (
    <div className="border-y border-[#ECEAE6] bg-white">
      <div className={`${WRAP} flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 py-3 text-center font-sans text-[11px] md:text-[12px] text-[#6b6b6b]`}>
        {names.length > 0 && (
          <span>
            {c.prefix}{" "}
            {names.map((n, i) => (
              <span key={n}><b className="font-semibold text-[#1a1a1a] tracking-[0.03em]">{n}</b>{i < names.length - 1 ? " · " : ""}</span>
            ))}
          </span>
        )}
        {names.length > 0 && c.note && <span className="hidden sm:block w-px h-3 bg-[#ddd]" aria-hidden />}
        {c.note && <span>{c.note}</span>}
      </div>
    </div>
  );
}

export function ShopByType({ c }: { c: HomeConfig["types"] }) {
  const items = c.items.filter((i) => i.label && i.image);
  if (!items.length) return null;
  return (
    <section className={`${WRAP} py-10 md:py-16`}>
      <SectionHeading heading={c.heading} italic={c.headingItalic} />
      <div className="flex gap-3.5 md:gap-8 overflow-x-auto md:overflow-visible md:justify-center pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((it, i) => (
          <Link key={i} href={it.link || "/shop/clips"} className="flex-none w-[84px] md:w-[150px] grid gap-2 justify-items-center text-center">
            <Img src={it.image} alt={it.label} w={320} className="w-[84px] h-[84px] md:w-[150px] md:h-[150px] rounded-full object-cover border border-[#ECEAE6]" />
            <span className="font-sans text-[11px] md:text-[12.5px] font-medium leading-tight text-[#1a1a1a]">
              {it.label}
              {it.note && <small className="block font-normal text-[10px] md:text-[11px] text-[#6b6b6b] mt-0.5">{it.note}</small>}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function FreeDeliveryBanner({ c, amount }: { c: HomeConfig["freeDelivery"]; amount: number | null }) {
  if (!amount) return null;
  const imgs = c.images.filter(Boolean).slice(0, 3);
  return (
    <section className="bg-[#3B5373] text-white">
      <div className={`${WRAP} py-9 md:py-14 grid gap-6 md:grid-cols-2 md:items-center md:gap-12`}>
        <div className="grid gap-3 md:gap-4">
          {c.eyebrow && <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/70">{c.eyebrow}</span>}
          <h2 className="font-serif font-light text-[30px] md:text-[48px] leading-[1.08]">{withAmount(c.heading, amount)}</h2>
          {c.text && <p className="font-sans text-[13px] md:text-[14px] text-white/80 max-w-[46ch]">{withAmount(c.text, amount)}</p>}
          {c.buttonText && (
            <Link href={c.buttonUrl || "/shop/clips"} className="justify-self-start mt-1 bg-white text-[#3B5373] text-[11px] tracking-[0.16em] uppercase px-5 py-3.5 hover:bg-[#F7F4EF] transition-colors">
              {c.buttonText}
            </Link>
          )}
        </div>
        {imgs.length > 0 && (
          <div className="grid grid-cols-3 gap-1.5 md:gap-3">
            {imgs.map((u, i) => <Img key={i} src={u} w={480} className="w-full aspect-square object-cover bg-white" />)}
          </div>
        )}
      </div>
    </section>
  );
}

export function HowItWorks({ c }: { c: HomeConfig["howItWorks"] }) {
  const steps = c.steps.filter((s) => s.title || s.image);
  if (!steps.length) return null;
  return (
    <section className={`${WRAP} py-10 md:py-16`}>
      <SectionHeading heading={c.heading} italic={c.headingItalic} />
      <ol className="grid grid-cols-3 gap-2.5 md:gap-7 list-none m-0 p-0">
        {steps.map((s, i) => (
          <li key={i} className="grid gap-2 content-start">
            <Img src={s.image} alt={s.title} w={600} className="w-full aspect-square object-cover bg-[#f6f6f6]" />
            <b className="font-serif font-normal text-[16px] md:text-[23px] leading-tight text-[#1a1a1a]">
              <span className="text-[#3B5373]">{i + 1}.</span> {s.title}
            </b>
            {s.text && <p className="font-sans text-[11px] md:text-[13px] leading-snug text-[#6b6b6b]">{s.text}</p>}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function CustomDesigns({ c }: { c: HomeConfig["custom"] }) {
  return (
    <section className="bg-[#F7F4EF]">
      <div className={`${WRAP} py-9 md:py-14 grid gap-6 md:grid-cols-2 md:items-center md:gap-12`}>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-4">
          {c.sketchImage
            ? <Img src={c.sketchImage} alt="Customer's design sketch" w={600} className="w-full aspect-square object-cover border border-[#ECEAE6] bg-white" />
            : <SketchSvg className="w-full aspect-square border border-[#ECEAE6]" />}
          <span className="font-serif text-[30px] text-[#3B5373]" aria-hidden>→</span>
          <Img src={c.productImage} alt="The finished clip" w={600} className="w-full aspect-square object-cover border border-[#ECEAE6] bg-white" />
        </div>
        <div className="grid gap-3 md:gap-4">
          {c.eyebrow && <span className={EYEBROW}>{c.eyebrow}</span>}
          <h2 className="font-serif font-light text-[30px] md:text-[46px] leading-[1.08] text-[#1a1a1a]">
            {c.heading} {c.headingItalic && <em className="italic text-[#3B5373]">{c.headingItalic}</em>}
          </h2>
          {c.text && <p className="font-sans text-[13px] md:text-[14px] text-[#555] leading-relaxed max-w-[48ch]">{c.text}</p>}
          {c.perk && (
            <p className="font-sans text-[13px] md:text-[14px] bg-white border-l-[3px] border-[#B08D57] px-3.5 py-2.5 text-[#1a1a1a] max-w-[48ch]">{c.perk}</p>
          )}
          {c.buttonText && (
            <Link href={c.buttonUrl || "/contact"} className="justify-self-start mt-1 bg-[#3B5373] text-white text-[11px] tracking-[0.16em] uppercase px-5 py-3.5 hover:bg-[#2a3d55] transition-colors">
              {c.buttonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export function SeasonEdit({ c }: { c: HomeConfig["edit"] }) {
  if (!c.image && !c.heading) return null;
  return (
    <section className="bg-[#F7F4EF] md:grid md:grid-cols-[1.2fr_1fr] md:items-center">
      <div className="relative">
        <Img src={c.image} alt={c.heading} w={1200} className="w-full aspect-[4/3] md:aspect-[5/4] object-cover" />
        {c.badge && (
          <span className="absolute left-3 top-3 bg-white/95 text-[#1a1a1a] font-sans text-[10px] tracking-[0.14em] uppercase px-2.5 py-1.5">{c.badge}</span>
        )}
      </div>
      <div className="px-5 py-7 md:px-14 md:py-12 grid gap-3 md:gap-4">
        {c.eyebrow && <span className={EYEBROW}>{c.eyebrow}</span>}
        <h2 className="font-serif font-light text-[30px] md:text-[48px] leading-[1.08] text-[#1a1a1a]">
          {c.heading} {c.headingItalic && <em className="italic text-[#3B5373]">{c.headingItalic}</em>}
        </h2>
        {c.text && <p className="font-sans text-[13px] md:text-[14px] text-[#555] leading-relaxed max-w-[46ch]">{c.text}</p>}
        {c.buttonText && (
          <Link href={c.buttonUrl || "/shop/clips"} className="justify-self-start mt-1 bg-[#3B5373] text-white text-[11px] tracking-[0.16em] uppercase px-5 py-3.5 hover:bg-[#2a3d55] transition-colors">
            {c.buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}

export interface JournalPost { slug: string; title: string; cover_image: string | null; category: string | null }

export function Journal({ c, posts }: { c: HomeConfig["journal"]; posts: JournalPost[] }) {
  if (!posts.length) return null;
  return (
    <section className={`${WRAP} py-10 md:py-16`}>
      <SectionHeading eyebrow={c.eyebrow} heading={c.heading} italic={c.headingItalic} linkText={c.linkText} linkUrl="/blog" />
      <div className="grid gap-4 md:grid-cols-3 md:gap-7">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="grid grid-cols-[96px_1fr] gap-x-3 gap-y-1 items-start md:grid-cols-1 md:gap-2 group">
            {p.cover_image
              ? <Img src={p.cover_image} alt={p.title} w={700} className="row-span-2 w-24 h-24 md:w-full md:h-auto md:aspect-[4/3] object-cover bg-[#f6f6f6]" />
              : <span className="row-span-2 w-24 h-24 md:w-full md:h-auto md:aspect-[4/3] bg-[#F7F4EF] grid place-items-center font-serif text-[#3B5373] text-xl">CLASSIE</span>}
            {p.category && <span className="font-sans text-[10px] tracking-[0.16em] uppercase text-[#3B5373]">{p.category}</span>}
            <b className="font-serif font-normal text-[16px] md:text-[19px] leading-snug text-[#1a1a1a] group-hover:text-[#3B5373] transition-colors">{p.title}</b>
          </Link>
        ))}
      </div>
    </section>
  );
}

const ICONS: Record<WhyIcon, JSX.Element> = {
  truck: <><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="17.5" r="1.6" /><circle cx="17" cy="17.5" r="1.6" /></>,
  cash: <><rect x="3" y="6" width="18" height="12" rx="1.5" /><circle cx="12" cy="12" r="2.5" /></>,
  returns: <path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4" />,
  whatsapp: <path d="M5 19l1.3-3.7A7.5 7.5 0 1 1 9 18.2z" />,
  star: <path d="M12 3l2.6 5.6 6 .7-4.5 4 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.5-4 6-.7z" />,
  gift: <><rect x="4" y="9" width="16" height="11" /><path d="M3 9h18M12 9v11M12 9c-2-4-6-4-6-1.5S9 9 12 9zm0 0c2-4 6-4 6-1.5S15 9 12 9z" /></>,
  shield: <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />,
  sparkle: <path d="M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3" />,
};
export const WHY_ICON_NAMES = Object.keys(ICONS) as WhyIcon[];

export function WhyBuyHere({ c, amount }: { c: HomeConfig["why"]; amount: number | null }) {
  // Drop the free-delivery point if there's no free tier set in Shipping Rates.
  const items = c.items.filter((i) => i.title && !(/\{amount\}/.test(i.title + i.sub) && !amount));
  if (!items.length) return null;
  return (
    <section className={`${WRAP} pb-10 md:pb-16`}>
      <div className={`grid gap-px bg-[#ECEAE6] border border-[#ECEAE6] ${items.length >= 4 ? "grid-cols-2 md:grid-cols-4" : items.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {items.map((it, i) => (
          <div key={i} className="bg-white px-2.5 py-4 md:py-6 grid gap-1 justify-items-center text-center">
            <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] stroke-[#3B5373] fill-none" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              {ICONS[it.icon] ?? ICONS.star}
            </svg>
            <b className="font-sans text-[11.5px] md:text-[13px] font-semibold text-[#1a1a1a]">{withAmount(it.title, amount)}</b>
            {it.sub && <span className="font-sans text-[10.5px] md:text-[11.5px] text-[#6b6b6b]">{withAmount(it.sub, amount)}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}

export function WhatsAppJoin({ c, url }: { c: HomeConfig["whatsapp"]; url: string }) {
  if (!url) return null;
  return (
    <section className="bg-[#F4F6F9]">
      <div className={`${WRAP} py-8 md:py-10 grid gap-3 justify-items-center text-center md:grid-cols-[1fr_auto] md:justify-items-start md:text-left md:items-center`}>
        <div className="grid gap-1">
          <h2 className="font-serif font-light text-[24px] md:text-[32px] text-[#1a1a1a]">{c.heading}</h2>
          {c.text && <p className="font-sans text-[12.5px] text-[#6b6b6b]">{c.text}</p>}
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="bg-[#1E7A4C] text-white text-[11px] tracking-[0.16em] uppercase px-5 py-3.5 hover:bg-[#186540] transition-colors">
          {c.buttonText || "Join on WhatsApp"}
        </a>
      </div>
    </section>
  );
}

export function SeoBlock({ c, amount }: { c: HomeConfig["seo"]; amount: number | null }) {
  if (!c.heading && !c.text) return null;
  // Without a free tier, drop the sentence that mentions the amount.
  const text = amount ? withAmount(c.text, amount) : c.text.split(/(?<=\.)\s+/).filter((s) => !s.includes("{amount}")).join(" ");
  return (
    <section className="max-w-3xl mx-auto px-6 py-10 md:py-12 text-center border-t border-gray-100 grid gap-3">
      {c.heading && <h2 className="font-serif font-light text-[20px] md:text-[24px] text-[#1a1a1a]">{c.heading}</h2>}
      {text && <p className="font-sans text-[12.5px] md:text-[13px] text-[#6b6b6b] leading-relaxed">{text}</p>}
    </section>
  );
}
