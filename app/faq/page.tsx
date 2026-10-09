import Link from "next/link";
import FaqList from "./FaqList";
import { DEFAULT_FAQ, FAQ_KEY, type FaqSection } from "@/lib/siteContent";
import { loadJsonSetting } from "@/lib/siteContentServer";
import { loadShippingRules } from "@/lib/shippingServer";
import { freeShippingFrom, shippingFee } from "@/lib/shipping";

export const revalidate = 3600;

// Questions are edited in Admin → Menu, FAQ & Legal → FAQ.
// {free} / {fee} are filled in from Admin → Shipping Rates.
export default async function FAQPage() {
  const [saved, rules] = await Promise.all([loadJsonSetting<FaqSection[]>(FAQ_KEY, DEFAULT_FAQ), loadShippingRules()]);
  const free = freeShippingFrom(rules) ?? 999;
  const fee = shippingFee(0, rules) || 99;
  const fill = (a: string) => a.replaceAll("{free}", free.toLocaleString("en-IN")).replaceAll("{fee}", String(fee));
  const sections = (Array.isArray(saved) && saved.length ? saved : DEFAULT_FAQ)
    .map((s) => ({ section: s.section, items: (s.items ?? []).filter((i) => i.q?.trim() && i.a?.trim()).map((i) => ({ q: i.q.trim(), a: fill(i.a.trim()) })) }))
    .filter((s) => s.section?.trim() && s.items.length);

  return (
    <>
      <div className="bg-[#faf8f6] py-12 px-4 text-center border-b border-classie-border">
        <p className="text-[11px] tracking-[0.5em] uppercase text-classie-gray mb-2">Help Centre</p>
        <h1 className="font-serif text-5xl md:text-6xl text-classie-black">FAQ</h1>
        <p className="text-classie-gray text-sm mt-3">Answers to our most common questions</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-14 space-y-10">
        <FaqList sections={sections} />

        <div className="bg-[#faf8f6] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl text-classie-black">Not sure about your size?</h2>
            <p className="text-sm text-classie-gray mt-1">See the size chart and how to measure your foot.</p>
          </div>
          <Link href="/size-guide" className="shrink-0 text-center bg-[#3B5373] text-white text-[11px] tracking-[0.14em] uppercase px-5 py-3.5">Size guide</Link>
        </div>
        <p className="text-sm text-classie-gray text-center">
          Still have a question? <Link href="/contact" className="underline text-[#3B5373]">Contact us</Link> — we reply on WhatsApp the same day.
        </p>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: sections.flatMap((sec) => sec.items.map((it) => ({
          "@type": "Question",
          name: it.q,
          acceptedAnswer: { "@type": "Answer", text: it.a },
        }))),
      }).replace(/</g, "\\u003c") }} />
    </>
  );
}
