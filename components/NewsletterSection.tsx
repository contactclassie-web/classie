"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setDone(true); setEmail(""); }
  };

  return (
    <section className="py-16 bg-classie-light">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-[11px] tracking-[0.4em] uppercase text-classie-gray mb-3">Stay in the loop</p>
        <h2 className="font-serif text-3xl md:text-4xl text-classie-black mb-3">
          Get Early Access
        </h2>
        <p className="text-classie-gray text-sm mb-8">
          New arrivals, exclusive deals, and style tips — straight to your inbox.
        </p>
        {done ? (
          <p className="text-green-600 font-medium text-sm">✓ You're on the list! We'll be in touch soon.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              className="flex-1 px-4 py-3 border border-classie-border text-sm focus:outline-none focus:border-classie-black transition-colors"
            />
            <button type="submit" className="btn-primary flex items-center justify-center gap-2 py-3 px-6">
              <Send className="w-4 h-4" />
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
