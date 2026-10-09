import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import ContactForm from "./ContactForm";
import FaqAccordion from "./FaqAccordion";
import { optimizeCloudinary } from "@/lib/cloudinary";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Contact Us",
  alternates: { canonical: "/contact" },
  description: "Get in touch with Classie. We're here to help with orders, sizing, returns and more.",
};

const DEFAULT_FAQS = [
  { q: "Do you accept returns?", a: "We don't offer returns on Style Clips or Heels. However, if you receive a damaged or defective product, we'll gladly help resolve it. Heel size exchange is available (subject to availability)." },
  { q: "How long will my order take to arrive?", a: "Orders are usually delivered within 4–5 working days. Once your order is dispatched, you'll receive a tracking message on your registered contact details." },
  { q: "How can I track my order?", a: "As soon as your order is dispatched, we'll share a tracking link. You can use this link to track your order in real time." },
  { q: "Can I cancel or change my order after placing it?", a: "Yes — orders can be modified or cancelled within 2 hours of placement. Please contact us as soon as possible so we can assist you." },
  { q: "How can I get in touch with us?", a: "You can contact us through Email, WhatsApp & Instagram Handle (@classsie.in) for quick order-related help, or by filling out the form on our Contact Us page. We usually respond within 24–48 hours." },
  { q: "Do you offer size exchange or product exchange?", a: "We offer size exchange for heels only (subject to stock availability). Exchanges are accepted only in case of damaged or defective items." },
  { q: "What are Style Clips and how do they work?", a: "Style Clips are detachable accessories designed to instantly elevate your look. You can attach and detach them easily, and style them in multiple ways — on Classie heels, outfits, bags, hats, hair clips, and more." },
  { q: "Do you offer international shipping?", a: "Yes, we do offer international shipping. Please contact us via email or WhatsApp or send us your query with order details. Our team will get back to you with further information." },
];

export default async function ContactPage() {
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data } = await sb.from("site_settings").select("key,value").or("key.like.ct_%,key.eq.footer_whatsapp_url,key.eq.footer_ig_url");
  const cfg: Record<string, string> = {};
  (data ?? []).forEach((r: { key: string; value: string }) => { cfg[r.key] = r.value; });

  // Settings with defaults
  const heading   = cfg.ct_heading   || "Contact Us";
  const subtext   = cfg.ct_subtext   || "Your perfect look deserves the perfect heel. Whether you need help with sizing, styling, orders, or customisation — our team is here to assist you.\n\nDrop us a message and we'll get back to you within 24–48 hours.";
  const heroImg   = cfg.ct_hero_img  || "";
  const trackText = cfg.ct_track_text || "Log in to check the status of your order.";
  const trackUrl  = cfg.ct_track_url  || "/track-order";
  const retText   = cfg.ct_return_text || "We make it easy to return and exchange styles.";
  const retUrl    = cfg.ct_return_url  || "/returns";
  const faqHeading  = cfg.ct_faq_heading  || "Popular Searched Questions";
  const infoHeading = cfg.ct_info_heading || "Any other questions?";
  const infoSub     = cfg.ct_info_sub     || "We're here to help! Contact us any time Monday–Saturday, 9 AM–9 PM.";
  const phone  = cfg.ct_phone  || "91-9468147781";
  const email  = cfg.ct_email  || "contact.classie@gmail.com";
  const social = cfg.ct_social || "@classsie.in";

  // Build FAQs — only use DB entries with meaningful content (>10 chars question)
  const dbFaqs: { q: string; a: string }[] = [];
  for (let i = 1; i <= 8; i++) {
    const q = cfg[`ct_faq_${i}_q`];
    const a = cfg[`ct_faq_${i}_a`];
    if (q && a && q.trim().length > 10) dbFaqs.push({ q: q.trim(), a: a.trim() });
  }
  const faqs = dbFaqs.length > 0 ? dbFaqs : DEFAULT_FAQS;

  // Quick contact links
  const digits = phone.replace(/\D/g, "");
  const intl = digits.length === 10 ? `91${digits}` : digits;
  const pretty = intl.length === 12 ? `+${intl.slice(0, 2)} ${intl.slice(2, 7)} ${intl.slice(7)}` : phone;
  const waUrl = cfg.footer_whatsapp_url || `https://wa.me/${intl}`;
  const handle = social.trim().replace(/^@/, "");
  const igUrl = cfg.footer_ig_url || `https://www.instagram.com/${handle}/`;
  const navy = "#3B5373";
  const line = (d: React.ReactNode) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={navy} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
  );
  const quick = [
    { label: "WhatsApp", value: "Chat with us", href: waUrl, icon: line(<path d="M20 12a8 8 0 0 1-11.7 7.1L4 20l1-4A8 8 0 1 1 20 12z" />), external: true },
    { label: "Call", value: pretty, href: `tel:+${intl}`, icon: line(<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />), external: false },
    { label: "Email", value: email, href: `mailto:${email}`, icon: line(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>), external: false },
  ];

  return (
    <>
      {/* ── 1: How can we help — quick ways first ── */}
      <section style={{ background: "#F7F4EF" }}>
        <div className="max-w-[1100px] mx-auto px-4 md:px-10 pt-9 pb-8 md:pt-16 md:pb-14 flex flex-col gap-6 md:gap-8">
          <div className="flex flex-col gap-2 md:gap-3 max-w-[620px]">
            <h1 className="text-[40px] md:text-[56px] leading-none font-normal text-[#1a1a1a]">{heading}</h1>
            {subtext.split(/\n\s*\n/).map((para, i) => (
              <p key={i} className="text-[13.5px] md:text-[15px] leading-relaxed text-[#555]">{para.replace(/\s*\n\s*/g, " ")}</p>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 md:gap-4">
            {quick.map((q) => (
              <a key={q.label} href={q.href} {...(q.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="bg-white border border-[#E6E0D6] hover:border-[#3B5373] transition-colors px-5 py-4 md:py-6 flex sm:flex-col items-center sm:items-start gap-4 sm:gap-3 min-h-[64px]">
                {q.icon}
                <span className="flex flex-col min-w-0">
                  <span className="text-[14px] md:text-[15px] font-medium text-[#1a1a1a]">{q.label}</span>
                  <span className="text-[12.5px] text-[#555] truncate">{q.value}</span>
                </span>
              </a>
            ))}
          </div>
          <p className="text-[12.5px] text-[#555]">
            {infoSub}{handle && <> · Instagram <a href={igUrl} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: navy }}>@{handle}</a></>}
          </p>
        </div>
      </section>

      {/* ── 2: Track + returns ── */}
      <section className="bg-white">
        <div className="max-w-[1100px] mx-auto px-4 md:px-10 py-8 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
          {[
            { title: "Order Tracking", text: trackText, href: trackUrl, cta: "Track your order", icon: line(<><path d="M3 7h11v9H3z" /><path d="M14 10h4l3 3v3h-7" /><circle cx="7" cy="17.5" r="1.6" /><circle cx="17" cy="17.5" r="1.6" /></>) },
            { title: "Returns & Exchange", text: retText, href: retUrl, cta: "See returns policy", icon: line(<><path d="M4 12a8 8 0 1 0 2.4-5.7" /><path d="M4 4v4.3h4.3" /></>) },
          ].map((b) => (
            <Link key={b.title} href={b.href} className="border border-[#ECEAE6] hover:border-[#3B5373] transition-colors p-5 md:p-7 flex gap-4 items-start group">
              {b.icon}
              <span className="flex flex-col gap-1">
                <span className="text-[22px] md:text-[24px] leading-tight text-[#1a1a1a] font-serif">{b.title}</span>
                <span className="text-[13px] text-[#555] leading-relaxed">{b.text}</span>
                <span className="text-[12px] tracking-[0.1em] uppercase mt-1 group-hover:underline" style={{ color: navy }}>{b.cta} →</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 3: Message form (photo beside it on desktop) ── */}
      <section className="bg-white border-t border-[#ECEAE6]">
        <div className="max-w-[1100px] mx-auto px-4 md:px-10 py-10 md:py-16 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_380px] gap-8 md:gap-14 items-start">
          <div>
            <h2 className="text-[30px] md:text-[38px] font-normal text-[#1a1a1a] mb-2">Send us a message</h2>
            <p className="text-[13px] text-[#555] mb-6">We reply within 24–48 hours.</p>
            <ContactForm />
          </div>
          {heroImg && (
            <div className="hidden md:block relative h-[460px] overflow-hidden" style={{ backgroundImage: `url(${optimizeCloudinary(heroImg, 900)})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          )}
        </div>
      </section>

      {/* ── 4: Questions ── */}
      <section className="py-12 md:py-16 px-4" style={{ background: "#f7f7f7" }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-[30px] md:text-[34px] text-center mb-8 md:mb-10 font-normal" style={{ color: "#1a1a1a" }}>{faqHeading}</h2>
          <FaqAccordion faqs={faqs} />
          <p className="text-center mt-6"><Link href="/faq" className="text-[13px] underline" style={{ color: navy }}>See all questions →</Link></p>
        </div>
      </section>
    </>
  );
}
