"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface NLCfg {
  eyebrow: string; heading: string; headingItalic: string; subtext: string; placeholder: string; btnText: string; successText: string;
}
const DEFAULTS: NLCfg = {
  eyebrow: "STAY CONNECTED",
  heading: "Be the First to",
  headingItalic: "Know",
  subtext: "New arrivals and exclusive edits — straight to your inbox.",
  placeholder: "Your email address",
  btnText: "Subscribe",
  successText: "✓ You're on the list. We'll be in touch soon.",
};
const KEYS = ["nl_eyebrow","nl_heading","nl_heading_italic","nl_subtext","nl_placeholder","nl_btn_text","nl_success_text"];

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cfg, setCfg] = useState<NLCfg>(DEFAULTS);

  useEffect(() => {
    supabase.from("site_settings").select("key,value").in("key", KEYS).then(({ data }) => {
      if (!data || data.length === 0) return;
      const m: Record<string, string> = {};
      data.forEach(({ key, value }) => { m[key] = value; });
      setCfg({
        eyebrow:      m.nl_eyebrow         || DEFAULTS.eyebrow,
        heading:      m.nl_heading         || DEFAULTS.heading,
        headingItalic: m.nl_heading_italic || DEFAULTS.headingItalic,
        subtext:      m.nl_subtext         || DEFAULTS.subtext,
        placeholder:  m.nl_placeholder     || DEFAULTS.placeholder,
        btnText:      m.nl_btn_text        || DEFAULTS.btnText,
        successText:  m.nl_success_text    || DEFAULTS.successText,
      });
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.from("newsletter_subscribers").insert([{ email }]);
    setLoading(false);
    if (error) {
      console.error("Newsletter subscribe error:", error);
      alert("Subscribe failed: " + error.message);
      return;
    }
    setDone(true);
    setEmail("");
  };

  return (
    <section className="relative py-24 bg-[#3B5373] overflow-hidden">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
        <span className="font-serif text-white" style={{ fontSize: "200px", fontWeight: 300, opacity: 0.04, letterSpacing: "0.12em" }}>CLASSIE</span>
      </div>

      <div className="relative max-w-2xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-8 h-px bg-white/30" />
          <span className="font-sans text-[10px] font-light tracking-[0.36em] uppercase text-white/50">{cfg.eyebrow}</span>
          <div className="w-8 h-px bg-white/30" />
        </div>

        <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-light text-white leading-[1.05] mb-4">
          {cfg.heading} <em className="italic">{cfg.headingItalic}</em>
        </h2>
        <p className="font-sans text-sm font-light text-white/50 mb-10 tracking-[0.04em]">{cfg.subtext}</p>

        {done ? (
          <p className="font-sans text-sm font-light text-white/80 tracking-[0.06em]">{cfg.successText}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder={cfg.placeholder} required
              className="flex-1 px-5 py-4 bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm font-light tracking-[0.04em] focus:outline-none focus:border-white/50 transition-colors" />
            <button type="submit" disabled={loading}
              className="px-8 py-4 bg-white text-[#3B5373] text-[10px] font-light tracking-[0.28em] uppercase border border-white hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a] transition-all duration-300 disabled:opacity-60">
              {loading ? "..." : cfg.btnText}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
