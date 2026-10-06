"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useShippingRules } from "@/lib/useShipping";
import { freeShippingFrom, shippingFee } from "@/lib/shipping";

// {free} / {fee} are filled in from Admin → Shipping Rates.
const faqs = [
  {
    section: "Shoe Clips & Charms",
    items: [
      { q: "How do I attach the shoe clips?", a: "Open the clip, slide it onto the edge or strap of your shoe and press it shut. It takes a few seconds — no glue, no tools." },
      { q: "Will the clips damage my shoes?", a: "No. The clip holds by gentle pressure, with no glue, pins or holes. On very soft or delicate fabric, clip onto the edge and remove it gently." },
      { q: "Which shoes do they work on?", a: "Most shoes with an edge or strap to clip onto — heels, flats, ballerinas and sandals. They also work on bags, hair, dupattas and belts." },
      { q: "What does 'Sold as a pair' mean?", a: "Shoe clips come as a set of two — one for each shoe. The price shown is for the full pair." },
      { q: "Can you make a clip in my own design?", a: "Yes. Send us a sketch, photo or Pinterest pin on the Custom Designs page and we'll share a preview and price on WhatsApp." },
    ],
  },
  {
    section: "Orders & Shipping",
    items: [
      { q: "How long does delivery take?", a: "Orders are packed in 1–2 business days. Delivery then takes 3–5 business days to metro cities, 5–7 to other cities and 7–10 to remote areas." },
      { q: "Do you offer free shipping?", a: "Yes! Orders of ₹{free} or more ship free. Below ₹{free}, a flat delivery fee of ₹{fee} applies." },
      { q: "Do you ship across India?", a: "Yes, we ship to all serviceable pincodes across India via reputed courier partners." },
      { q: "Can I track my order?", a: "Yes. Visit our Track Order page with your Order ID to see its status, or message us on WhatsApp." },
    ],
  },
  {
    section: "Returns & Exchanges",
    items: [
      { q: "What is your return policy?", a: "We accept returns within 7 days of delivery. Products must be unused, unworn, and in original packaging." },
      { q: "How do I initiate a return?", a: "WhatsApp us at +91 94681 47781 or email contact.classie@gmail.com with your order ID and reason. We'll arrange a pickup." },
      { q: "When will I get my refund?", a: "Refunds are processed within 5–7 business days after we receive and inspect the returned product." },
      { q: "Can I exchange heels for a different size?", a: "Yes! Heel size exchanges are free within 7 days of delivery, subject to availability. Shoe clips are one size, so they can be returned but not exchanged for a size." },
    ],
  },
  {
    section: "Heels",
    items: [
      { q: "What sizes do you offer?", a: "Our heels are available in EU sizes 35–39. Use the size guide below to find your fit." },
      { q: "Are your materials vegan?", a: "Yes! All Classie products use premium vegan materials — no animal leather, ever." },
      { q: "How do I care for my heels?", a: "Wipe with a soft, dry cloth. Avoid water and direct sunlight. Store in the dust bag provided." },
    ],
  },
  {
    section: "Payment",
    items: [
      { q: "What payment methods do you accept?", a: "UPI, debit and credit cards, net banking and wallets (secure online payment by Razorpay), and Cash on Delivery." },
      { q: "Do you offer Cash on Delivery?", a: "Yes! COD is available across India. Please keep the exact amount ready at delivery." },
      { q: "Is COD available everywhere?", a: "COD is available on most pincodes. If COD isn't available for your area, we'll let you know." },
    ],
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<string | null>(null);
  const rules = useShippingRules();
  const free = freeShippingFrom(rules) ?? 999;
  const fee = shippingFee(0, rules) || 99;
  const fill = (a: string) => a.replaceAll("{free}", free.toLocaleString("en-IN")).replaceAll("{fee}", String(fee));

  return (
    <>
      <div className="bg-[#faf8f6] py-12 text-center border-b border-classie-border">
        <p className="text-[11px] tracking-[0.5em] uppercase text-classie-gray mb-2">Help Centre</p>
        <h1 className="font-serif text-5xl md:text-6xl text-classie-black">FAQ</h1>
        <p className="text-classie-gray text-sm mt-3">Answers to our most common questions</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 space-y-10">
        {faqs.map((section) => (
          <div key={section.section}>
            <h2 className="font-serif text-2xl text-classie-black mb-5 pb-3 border-b border-classie-border">
              {section.section}
            </h2>
            <div className="space-y-2">
              {section.items.map((item) => {
                const key = `${section.section}-${item.q}`;
                const isOpen = open === key;
                return (
                  <div key={key} className="border border-classie-border rounded-xl overflow-hidden">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : key)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-classie-black hover:bg-[#faf8f6] transition-colors"
                    >
                      {item.q}
                      <ChevronDown className={`w-4 h-4 text-classie-gray flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    <div hidden={!isOpen} className="px-5 pb-4 text-sm text-classie-gray leading-relaxed border-t border-classie-border pt-4">
                      {fill(item.a)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div id="size-guide" className="bg-[#faf8f6] rounded-2xl p-6">
          <h2 className="font-serif text-2xl text-classie-black mb-4">Size Guide</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center">
              <thead>
                <tr className="border-b border-classie-border">
                  {["EU Size","UK Size","US Size","Foot Length (cm)"].map((h) => (
                    <th key={h} className="py-3 px-4 text-xs uppercase tracking-wider text-classie-gray font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["35","2","5","22.0"],
                  ["36","3","6","22.5"],
                  ["37","4","7","23.5"],
                  ["38","5","8","24.0"],
                  ["39","6","9","25.0"],
                ].map(([eu,uk,us,cm]) => (
                  <tr key={eu} className="border-b border-classie-border last:border-0">
                    <td className="py-3 px-4 font-semibold text-classie-black">{eu}</td>
                    <td className="py-3 px-4 text-classie-gray">{uk}</td>
                    <td className="py-3 px-4 text-classie-gray">{us}</td>
                    <td className="py-3 px-4 text-classie-gray">{cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-classie-gray mt-4">
            Tip: If you're between sizes, we recommend sizing up for a more comfortable fit.
          </p>
        </div>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.flatMap((sec) => sec.items.map((it) => ({
          "@type": "Question",
          name: it.q,
          acceptedAnswer: { "@type": "Answer", text: fill(it.a) },
        }))),
      }) }} />
    </>
  );
}
