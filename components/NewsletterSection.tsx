"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setDone(true); setEmail(""); }
  };

  return (
    <section className="relative py-24 bg-[#3B5373] overflow-hidden">
      {/* Watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <span
          className="font-serif text-white"
          style={{ fontSize: "200px", fontWeight: 300, opacity: 0.04, letterSpacing: "0.12em" }}
        >
          CLASSIE
        </span>
      </div>

      <div className="relative max-w-2xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-8 h-px bg-white/30" />
          <span className="font-sans text-[10px] font-light tracking-[0.36em] uppercase text-white/50">
            STAY CONNECTED
          </span>
          <div className="w-8 h-px bg-white/30" />
        </div>

        <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-light text-white leading-[1.05] mb-4">
          Be the First to <em className="italic">Know</em>
        </h2>
        <p className="font-sans text-sm font-light text-white/50 mb-10 tracking-[0.04em]">
          New arrivals and exclusive edits — straight to your inbox.
        </p>

        {done ? (
          <p className="font-sans text-sm font-light text-white/80 tracking-[0.06em]">
            ✓ You&apos;re on the list. We&apos;ll be in touch soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 px-5 py-4 bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm font-light tracking-[0.04em] focus:outline-none focus:border-white/50 transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-white text-[#3B5373] text-[10px] font-light tracking-[0.28em] uppercase border border-white hover:bg-[#1a1a1a] hover:text-white hover:border-[#1a1a1a] transition-all duration-300"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
