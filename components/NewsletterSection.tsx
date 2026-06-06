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
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="mb-3" style={{fontFamily:"'Playfair Display', serif", fontSize:"clamp(1.75rem, 3vw, 2.5rem)", fontWeight:400, color:"#111"}}>
          Be the first to know.
        </h2>
        <p className="mb-8 text-gray-400 text-sm" style={{fontFamily:"'Poppins', sans-serif", fontWeight:300}}>
          New arrivals and exclusive edits — straight to your inbox.
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
            <button type="submit" className="btn-primary flex items-center justify-center py-3 px-6">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
