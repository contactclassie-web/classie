"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";

// ── Default FAQs ──────────────────────────────────────────────────────────────
const DEFAULT_FAQS = [
  {
    q: "Do you accept returns?",
    a: "We don't offer returns on Style Clips or Heels. However, if you receive a damaged or defective product, we'll gladly help resolve it. Heel size exchange is available (subject to availability).",
  },
  {
    q: "How long will my order take to arrive?",
    a: "Orders are usually delivered within 4–5 working days. Once your order is dispatched, you'll receive a tracking message on your registered contact details.",
  },
  {
    q: "How can I track my order?",
    a: "As soon as your order is dispatched, we'll share a tracking link. You can use this link to track your order in real time.",
  },
  {
    q: "Can I cancel or change my order after placing it?",
    a: "Yes — orders can be modified or cancelled within 2 hours of placement. Please contact us as soon as possible so we can assist you.",
  },
  {
    q: "How can I get in touch with us?",
    a: "You can contact us through Email, WhatsApp & Instagram Handle (@classsie.in) for quick order-related help, or by filling out the form on our Contact Us page. We usually respond within 24–48 hours.",
  },
  {
    q: "Do you offer size exchange or product exchange?",
    a: "We offer size exchange for heels only (subject to stock availability). Exchanges are accepted only in case of damaged or defective items.",
  },
  {
    q: "What are Style Clips and how do they work?",
    a: "Style Clips are detachable accessories designed to instantly elevate your look. You can attach and detach them easily, and style them in multiple ways — on Classie heels, outfits, bags, hats, hair clips, and more.",
  },
  {
    q: "Do you offer international shipping?",
    a: "Yes, we do offer international shipping. Please contact us via email or WhatsApp or send us your query with order details. Our team will get back to you with further information.",
  },
];

interface CfgMap {
  ct_hero_img?: string;
  ct_heading?: string;
  ct_subtext?: string;
  ct_track_text?: string;
  ct_track_url?: string;
  ct_return_text?: string;
  ct_return_url?: string;
  ct_faq_heading?: string;
  ct_faq_1_q?: string; ct_faq_1_a?: string;
  ct_faq_2_q?: string; ct_faq_2_a?: string;
  ct_faq_3_q?: string; ct_faq_3_a?: string;
  ct_faq_4_q?: string; ct_faq_4_a?: string;
  ct_faq_5_q?: string; ct_faq_5_a?: string;
  ct_faq_6_q?: string; ct_faq_6_a?: string;
  ct_faq_7_q?: string; ct_faq_7_a?: string;
  ct_faq_8_q?: string; ct_faq_8_a?: string;
  ct_info_heading?: string;
  ct_info_sub?: string;
  ct_phone?: string;
  ct_email?: string;
  ct_social?: string;
}

export default function ContactPage() {
  const [cfg, setCfg] = useState<CfgMap>({});
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("key,value")
      .like("key", "ct_%")
      .then(({ data }) => {
        const m: CfgMap = {};
        (data ?? []).forEach((r: { key: string; value: string }) => {
          (m as Record<string, string>)[r.key] = r.value;
        });
        setCfg(m);
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus("idle");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitStatus("success");
        setForm({ first_name: "", last_name: "", email: "", phone: "", message: "" });
      } else {
        setSubmitStatus("error");
        setErrorMsg(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitStatus("error");
      setErrorMsg("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Build FAQ list from cfg or defaults
  const faqs: { q: string; a: string }[] = [];
  let hasDbFaqs = false;
  for (let i = 1; i <= 8; i++) {
    const q = cfg[`ct_faq_${i}_q` as keyof CfgMap];
    const a = cfg[`ct_faq_${i}_a` as keyof CfgMap];
    if (q && a) {
      faqs.push({ q, a });
      hasDbFaqs = true;
    }
  }
  const displayFaqs = hasDbFaqs ? faqs : DEFAULT_FAQS;

  const heroImg = cfg.ct_hero_img || "";

  return (
    <>
      {/* ══════════════════════════════════════════════════
          SECTION 1 — Contact Form (split layout)
      ══════════════════════════════════════════════════ */}
      <section className="min-h-[520px] flex flex-col md:flex-row">
        {/* LEFT 40% — hero image or navy fallback */}
        <div className="w-full md:w-[40%] relative flex items-center justify-center min-h-[280px] md:min-h-0">
          {heroImg ? (
            <Image
              src={heroImg}
              alt="Contact Classie"
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
          ) : (
            <div className="absolute inset-0 bg-[#3B5373] flex items-center justify-center">
              <p className="font-serif text-4xl md:text-5xl text-white italic text-center px-8 leading-tight">
                Let&apos;s Connect
              </p>
            </div>
          )}
        </div>

        {/* RIGHT 60% — form */}
        <div className="w-full md:w-[60%] bg-white px-6 md:px-14 py-12 flex flex-col justify-center">
          <h1 className="font-serif text-4xl text-[#1a1a1a] mb-3">
            {cfg.ct_heading || "Contact Us"}
          </h1>
          <p className="text-[#666] text-sm leading-relaxed mb-8 whitespace-pre-line">
            {cfg.ct_subtext ||
              "Your perfect look deserves the perfect heel. Whether you need help with sizing, styling, orders, or customisation — our team is here to assist you.\n\nDrop us a message and we'll get back to you within 24–48 hours."}
          </p>

          {submitStatus === "success" ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <p className="text-green-700 font-medium text-base mb-1">Message sent! ✅</p>
              <p className="text-green-600 text-sm">
                Thank you for reaching out. We&apos;ll get back to you within 24–48 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {submitStatus === "error" && (
                <p className="text-red-500 text-sm">{errorMsg}</p>
              )}

              {/* First Name + Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <BottomBorderField
                  icon="👤"
                  name="first_name"
                  placeholder="First Name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                />
                <BottomBorderField
                  icon=""
                  name="last_name"
                  placeholder="Last Name"
                  value={form.last_name}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <BottomBorderField
                icon="@"
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />

              {/* Phone */}
              <BottomBorderField
                icon="📞"
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
              />

              {/* Message */}
              <div className="flex items-start border-b border-[#d0d0d0] focus-within:border-[#3B5373] transition-colors pb-1">
                <span className="text-base mt-2 mr-3 text-[#888] select-none">💬</span>
                <textarea
                  name="message"
                  placeholder="Your message…"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="flex-1 bg-transparent text-sm text-[#1a1a1a] placeholder-[#aaa] outline-none resize-none py-1"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#3B5373] text-white font-medium text-sm rounded-none tracking-wide hover:bg-[#2d3f4f] transition-colors disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Submit"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 2 — Quick Help Cards
      ══════════════════════════════════════════════════ */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Card 1 — Order Tracking */}
          <div className="border border-[#e5e5e5] rounded-xl p-8 text-center flex flex-col items-center gap-3">
            <span className="text-3xl">📍</span>
            <h3 className="font-serif text-xl text-[#1a1a1a]">Order Tracking</h3>
            <p className="text-sm text-[#666] leading-relaxed">
              {cfg.ct_track_text || "Log in to check the status of your order."}
            </p>
            <Link
              href={cfg.ct_track_url || "/track"}
              className="mt-2 inline-block px-5 py-2.5 bg-[#3B5373] text-white text-sm font-medium rounded hover:bg-[#2d3f4f] transition-colors"
            >
              Track your order →
            </Link>
          </div>

          {/* Card 2 — Return & Exchange */}
          <div className="border border-[#e5e5e5] rounded-xl p-8 text-center flex flex-col items-center gap-3">
            <span className="text-3xl">✅</span>
            <h3 className="font-serif text-xl text-[#1a1a1a]">Return &amp; Exchange</h3>
            <p className="text-sm text-[#666] leading-relaxed">
              {cfg.ct_return_text || "We make it easy to return and exchange styles."}
            </p>
            <Link
              href={cfg.ct_return_url || "/returns"}
              className="mt-2 inline-block px-5 py-2.5 bg-[#3B5373] text-white text-sm font-medium rounded hover:bg-[#2d3f4f] transition-colors"
            >
              Start a return →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 3 — FAQ Accordion
      ══════════════════════════════════════════════════ */}
      <section className="bg-[#f7f7f7] py-14 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl text-[#1a1a1a] text-center mb-10">
            {cfg.ct_faq_heading || "Popular Searched Questions"}
          </h2>
          <div className="space-y-2">
            {displayFaqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white border-b border-[#e5e5e5] last:border-b-0"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="font-medium text-[#1a1a1a] text-sm pr-4">{faq.q}</span>
                  <ChevronDown
                    className="flex-shrink-0 w-5 h-5 text-[#3B5373] transition-transform duration-200"
                    style={{ transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>
                <div
                  className="overflow-hidden transition-all duration-200"
                  style={{ maxHeight: openFaq === i ? "400px" : "0px" }}
                >
                  <p className="px-5 pb-4 text-sm text-[#666] leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SECTION 4 — Contact Info
      ══════════════════════════════════════════════════ */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-3xl text-[#1a1a1a] mb-3">
            {cfg.ct_info_heading || "Any other questions?"}
          </h2>
          <p className="text-sm text-[#666] mb-10">
            {cfg.ct_info_sub ||
              "We're here to help! Contact us any time Monday–Saturday, 9 AM–9 PM."}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Phone */}
            <div className="border border-[#e5e5e5] rounded-xl p-6 flex flex-col items-center gap-2">
              <span className="text-2xl">📞</span>
              <p className="text-sm font-medium text-[#1a1a1a]">
                {cfg.ct_phone || "91- 9468147781"}
              </p>
            </div>
            {/* Email */}
            <div className="border border-[#e5e5e5] rounded-xl p-6 flex flex-col items-center gap-2">
              <span className="text-2xl">✉️</span>
              <p className="text-sm font-medium text-[#1a1a1a]">
                {cfg.ct_email || "contact.classie@gmail.com"}
              </p>
            </div>
            {/* Social */}
            <div className="border border-[#e5e5e5] rounded-xl p-6 flex flex-col items-center gap-2">
              <span className="text-2xl">💬</span>
              <p className="text-xs text-[#888] mb-0.5">Message Us on WhatsApp/Instagram</p>
              <p className="text-sm font-medium text-[#1a1a1a]">
                {cfg.ct_social || "@classsie.in"}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ── BottomBorderField ─────────────────────────────────────────────────────────
function BottomBorderField({
  icon,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}: {
  icon: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div className="flex items-center border-b border-[#d0d0d0] focus-within:border-[#3B5373] transition-colors pb-1">
      {icon && (
        <span className="text-base mr-3 text-[#888] select-none flex-shrink-0">{icon}</span>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="flex-1 bg-transparent text-sm text-[#1a1a1a] placeholder-[#aaa] outline-none py-1.5"
      />
    </div>
  );
}
