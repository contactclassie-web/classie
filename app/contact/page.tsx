import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import ContactForm from "./ContactForm";
import FaqAccordion from "./FaqAccordion";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Contact Us — CLASSIE",
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
  const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { global: { fetch: (url: RequestInfo | URL, options?: RequestInit) => fetch(url, { ...options, cache: "no-store" }) } });
  const { data } = await sb.from("site_settings").select("key,value").like("key", "ct_%");
  const cfg: Record<string, string> = {};
  (data ?? []).forEach((r: { key: string; value: string }) => { cfg[r.key] = r.value; });

  // Settings with defaults
  const heading   = cfg.ct_heading   || "Contact Us";
  const subtext   = cfg.ct_subtext   || "Your perfect look deserves the perfect heel. Whether you need help with sizing, styling, orders, or customisation — our team is here to assist you.\n\nDrop us a message and we'll get back to you within 24–48 hours.";
  const heroImg   = cfg.ct_hero_img  || "";
  const trackText = cfg.ct_track_text || "Log in to check the status of your order.";
  const trackUrl  = cfg.ct_track_url  || "/track";
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

  return (
    <>
      {/* ── Section 1: Hero + Form ── */}
      <section className="flex flex-col md:flex-row" style={{ minHeight: "520px" }}>
        {/* Left — image or navy */}
        <div className="w-full md:w-[40%] relative flex items-center justify-center" style={{ minHeight: "280px" }}>
          {heroImg ? (
            <div className="absolute inset-0" style={{ backgroundImage: `url(${heroImg})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: "#3B5373" }}>
              <p className="font-serif text-4xl md:text-5xl text-white italic text-center px-8 leading-tight">
                Let&apos;s Connect
              </p>
            </div>
          )}
        </div>
        {/* Right — form */}
        <div className="w-full md:w-[60%] bg-white px-6 md:px-14 py-12 flex flex-col justify-center">
          <h1 className="font-serif text-4xl mb-3" style={{ color: "#1a1a1a" }}>{heading}</h1>
          <p className="text-sm leading-relaxed mb-8 whitespace-pre-line" style={{ color: "#666" }}>{subtext}</p>
          <ContactForm />
        </div>
      </section>

      {/* ── Section 2: Quick Help ── */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="border border-[#e5e5e5] rounded-xl p-8 text-center flex flex-col items-center gap-3">
            <span className="text-3xl">📍</span>
            <h3 className="font-serif text-xl" style={{ color: "#1a1a1a" }}>Order Tracking</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#666" }}>{trackText}</p>
            <Link href={trackUrl} className="mt-2 inline-block px-5 py-2.5 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              style={{ background: "#3B5373" }}>Track your order →</Link>
          </div>
          <div className="border border-[#e5e5e5] rounded-xl p-8 text-center flex flex-col items-center gap-3">
            <span className="text-3xl">✅</span>
            <h3 className="font-serif text-xl" style={{ color: "#1a1a1a" }}>Return &amp; Exchange</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#666" }}>{retText}</p>
            <Link href={retUrl} className="mt-2 inline-block px-5 py-2.5 text-white text-sm font-medium hover:opacity-90 transition-opacity"
              style={{ background: "#3B5373" }}>Start a return →</Link>
          </div>
        </div>
      </section>

      {/* ── Section 3: FAQ ── */}
      <section className="py-14 px-4" style={{ background: "#f7f7f7" }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl text-center mb-10" style={{ color: "#1a1a1a" }}>{faqHeading}</h2>
          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* ── Section 4: Contact Info ── */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl mb-3" style={{ color: "#1a1a1a" }}>{infoHeading}</h2>
          <p className="text-sm mb-10" style={{ color: "#666" }}>{infoSub}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="border border-[#e5e5e5] rounded-xl p-6 flex flex-col items-center gap-2">
              <span className="text-2xl">📞</span>
              <p className="text-sm font-medium" style={{ color: "#1a1a1a" }}>{phone}</p>
            </div>
            <div className="border border-[#e5e5e5] rounded-xl p-6 flex flex-col items-center gap-2">
              <span className="text-2xl">✉️</span>
              <p className="text-sm font-medium" style={{ color: "#1a1a1a" }}>{email}</p>
            </div>
            <div className="border border-[#e5e5e5] rounded-xl p-6 flex flex-col items-center gap-2">
              <span className="text-2xl">💬</span>
              <p className="text-xs mb-0.5" style={{ color: "#888" }}>WhatsApp / Instagram</p>
              <p className="text-sm font-medium" style={{ color: "#1a1a1a" }}>{social}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
