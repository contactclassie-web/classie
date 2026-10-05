import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import CustomDesignForm from "@/components/custom/CustomDesignForm";
import { SketchSvg } from "@/components/home/HomeSections";
import { CUSTOM_PAGE_KEY, mergeCustomPage, splitList } from "@/lib/customDesigns";
import { optimizeCloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";

async function load() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data } = await sb.from("site_settings").select("key,value").in("key", [CUSTOM_PAGE_KEY, "footer_whatsapp_url"]);
  const cfg: Record<string, string> = {};
  (data ?? []).forEach((r: { key: string; value: string }) => { cfg[r.key] = r.value; });
  let saved: unknown = null;
  try { saved = cfg[CUSTOM_PAGE_KEY] ? JSON.parse(cfg[CUSTOM_PAGE_KEY]) : null; } catch { saved = null; }
  const page = mergeCustomPage(saved);
  return { page, whatsapp: page.whatsappUrl || cfg.footer_whatsapp_url || "" };
}

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await load();
  return {
    title: page.seoTitle,
    description: page.seoDescription,
    alternates: { canonical: "https://www.classie.co.in/custom-designs" },
  };
}

const EB = "font-sans text-[10px] tracking-[0.3em] uppercase text-[#3B5373]";
const H2 = "font-serif font-light text-[30px] md:text-[44px] leading-[1.1] text-[#1a1a1a]";

function Img({ src, className, w = 800, alt = "" }: { src: string; className: string; w?: number; alt?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={optimizeCloudinary(src, w)} alt={alt} loading="lazy" className={className} />;
}

export default async function CustomDesignsPage() {
  const { page, whatsapp } = await load();
  const { hero, make, steps, perk, form, faq } = page;

  return (
    <>
      {/* Hero */}
      <section className="bg-[#F7F4EF]">
        <div className="max-w-[1280px] mx-auto md:grid md:grid-cols-2 md:items-center">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-4 px-4 pt-5 md:p-14">
            {hero.sketchImage
              ? <Img src={hero.sketchImage} w={700} alt="Customer's sketch" className="w-full aspect-square object-cover border border-[#ECEAE6] bg-white" />
              : <SketchSvg className="w-full aspect-square border border-[#ECEAE6]" />}
            <span className="font-serif text-[32px] text-[#3B5373]" aria-hidden>→</span>
            {hero.productImage
              ? <Img src={hero.productImage} w={700} alt="The finished clip" className="w-full aspect-square object-cover border border-[#ECEAE6] bg-white" />
              : <span className="w-full aspect-square bg-white border border-[#ECEAE6]" />}
          </div>
          <div className="px-5 pt-5 pb-9 md:px-14 md:py-14 grid gap-3 md:gap-4">
            <nav className="font-sans text-[11px] text-[#6b6b6b]"><Link href="/" className="hover:text-[#3B5373]">Home</Link> / Custom Designs</nav>
            {hero.eyebrow && <span className={EB}>{hero.eyebrow}</span>}
            <h1 className="font-serif font-light text-[40px] md:text-[62px] leading-[1.02] text-[#1a1a1a]">
              {hero.heading} {hero.headingItalic && <em className="italic text-[#3B5373]">{hero.headingItalic}</em>}
            </h1>
            {hero.text && <p className="font-sans text-[13.5px] md:text-[15px] text-[#555] leading-relaxed max-w-[48ch]">{hero.text}</p>}
            <div className="flex flex-wrap gap-2 mt-1">
              {hero.buttonText && <a href="#design-form" className="bg-[#3B5373] text-white font-sans text-[11px] tracking-[0.16em] uppercase px-5 py-3.5 hover:bg-[#2a3d55] transition-colors">{hero.buttonText}</a>}
              {hero.whatsappText && whatsapp && (
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="border border-[#3B5373] text-[#3B5373] font-sans text-[11px] tracking-[0.16em] uppercase px-5 py-3.5 hover:bg-[#3B5373] hover:text-white transition-colors">{hero.whatsappText}</a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1280px] mx-auto px-4 md:px-10">
        {/* What we can make */}
        {make.items.filter((m) => m.title).length > 0 && (
          <section className="py-10 md:py-16">
            <h2 className={`${H2} mb-6 md:mb-9`}>{make.heading} {make.headingItalic && <em className="italic text-[#3B5373]">{make.headingItalic}</em>}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-6 md:gap-7">
              {make.items.filter((m) => m.title).map((m, i) => (
                <div key={i} className="grid gap-1.5 content-start">
                  {m.image
                    ? <Img src={m.image} w={600} alt={m.title} className="w-full aspect-square object-cover bg-[#f6f6f6]" />
                    : <SketchSvg className="w-full aspect-square" />}
                  <b className="font-serif font-normal text-[17px] md:text-[22px] text-[#1a1a1a] mt-1">{m.title}</b>
                  {m.sub && <span className="font-sans text-[11.5px] md:text-[12.5px] text-[#6b6b6b]">{m.sub}</span>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* How it works */}
        {steps.items.filter((s) => s.title).length > 0 && (
          <section className="pb-10 md:pb-16">
            <h2 className={`${H2} mb-6 md:mb-9`}>{steps.heading} {steps.headingItalic && <em className="italic text-[#3B5373]">{steps.headingItalic}</em>}</h2>
            <ol className="grid gap-4 md:grid-cols-4 md:gap-7 list-none m-0 p-0">
              {steps.items.filter((s) => s.title).map((s, i) => (
                <li key={i} className="grid grid-cols-[38px_1fr] md:grid-cols-1 gap-x-3 gap-y-1 md:gap-3 items-start">
                  <span className="row-span-2 md:row-span-1 w-[38px] h-[38px] rounded-full border border-[#3B5373] text-[#3B5373] font-serif text-[18px] grid place-items-center">{i + 1}</span>
                  <b className="font-serif font-normal text-[19px] md:text-[23px] text-[#1a1a1a] leading-tight">{s.title}</b>
                  {s.text && <span className="font-sans text-[12.5px] md:text-[13px] text-[#6b6b6b] leading-snug">{s.text}</span>}
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>

      {/* Designed by you */}
      {perk.on && perk.heading && (
        <section className="bg-[#3B5373] text-white text-center">
          <div className="max-w-3xl mx-auto px-6 py-10 md:py-16 grid gap-3 justify-items-center">
            {perk.eyebrow && <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-white/70">{perk.eyebrow}</span>}
            <h2 className="font-serif font-light text-[30px] md:text-[48px] leading-[1.08]">{perk.heading} {perk.headingItalic && <em className="italic">{perk.headingItalic}</em>}</h2>
            {perk.text && <p className="font-sans text-[13.5px] md:text-[15px] text-white/90 max-w-[48ch]">{perk.text}</p>}
            {perk.small && <small className="font-sans text-[10.5px] md:text-[11.5px] text-white/60">{perk.small}</small>}
          </div>
        </section>
      )}

      <div className="max-w-[1280px] mx-auto px-4 md:px-10">
        {/* Form */}
        <section id="design-form" className="py-10 md:py-16 scroll-mt-24 grid gap-5">
          <h2 className={H2}>{form.heading} {form.headingItalic && <em className="italic text-[#3B5373]">{form.headingItalic}</em>}</h2>
          {form.intro && <p className="font-sans text-[13px] md:text-[14px] text-[#555] max-w-[60ch] -mt-2">{form.intro}</p>}
          <CustomDesignForm
            form={form}
            makeOptions={splitList(form.makeOptions, /,\s*/)}
            metalOptions={splitList(form.metalOptions, /;\s*/)}
            whatsappUrl={whatsapp}
          />
        </section>

        {/* FAQ */}
        {faq.items.filter((x) => x.q).length > 0 && (
          <section className="pb-14 md:pb-20 max-w-[820px]">
            <h2 className={`${H2} mb-4`}>{faq.heading}</h2>
            <div className="border-t border-[#ECEAE6]">
              {faq.items.filter((x) => x.q).map((x, i) => (
                <details key={i} open={i === 0} className="border-b border-[#ECEAE6] group">
                  <summary className="list-none cursor-pointer flex justify-between gap-4 py-4 font-sans text-[13.5px] font-medium text-[#1a1a1a]">
                    {x.q}<span className="text-[#6b6b6b] group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <p className="pb-4 font-sans text-[13px] text-[#555] leading-relaxed">{x.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
