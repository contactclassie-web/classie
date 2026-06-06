"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Metadata } from "next";

const faqs = [
  {
    section: "Orders & Shipping",
    items: [
      { q: "How long does delivery take?", a: "Standard delivery takes 5–7 business days. Express delivery (2–3 days) is available for select pincodes." },
      { q: "Do you offer free shipping?", a: "Yes! Orders above ₹999 get free shipping. Below ₹999, a flat shipping fee of ₹99 applies." },
      { q: "Do you ship across India?", a: "Yes, we ship to all serviceable pincodes across India via reputed courier partners." },
      { q: "Can I track my order?", a: "Absolutely. Visit our Track Order page with your Order ID to see real-time status." },
    ],
  },
  {
    section: "Returns & Exchanges",
    items: [
      { q: "What is your return policy?", a: "We accept returns within 7 days of delivery. Products must be unused, unworn, and in original packaging." },
      { q: "How do I initiate a return?", a: "WhatsApp us at +91 99999 99999 or email hello@classie.co.in with your order ID and reason. We'll arrange a pickup." },
      { q: "When will I get my refund?", a: "Refunds are processed within 5–7 business days after we receive and inspect the returned product." },
      { q: "Can I exchange for a different size?", a: "Yes! Size exchanges are free of charge within 7 days of delivery, subject to availability." },
    ],
  },
  {
    section: "Products",
    items: [
      { q: "What sizes do you offer?", a: "Our heels are available in EU sizes 35–39. Use our size guide to find the perfect fit." },
      { q: "Are your materials vegan?", a: "Yes! All Classie products use premium vegan materials — no animal leather, ever." },
      { q: "How do I care for my heels?", a: "Wipe with a soft, dry cloth. Avoid water and direct sunlight. Store in the dust bag provided." },
      { q: "What does 'Sold as a pair' mean for clip-ons?", a: "Clip-ons come as a set of two — one for each shoe. The price listed is for the full pair." },
    ],
  },
  {
    section: "Payment",
    items: [
      { q: "Do you offer Cash on Delivery?", a: "Yes! COD is available across India. Please keep exact change ready at delivery." },
      { q: "What payment methods do you accept?", a: "Currently we accept Cash on Delivery. Online payments via UPI and cards are coming soon." },
      { q: "Is COD available everywhere?", a: "COD is available on most pincodes. If COD isn't available for your area, we'll notify you." },
    ],
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<string | null>(null);

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
                      onClick={() => setOpen(isOpen ? null : key)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-classie-black hover:bg-[#faf8f6] transition-colors"
                    >
                      {item.q}
                      <ChevronDown className={`w-4 h-4 text-classie-gray flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-sm text-classie-gray leading-relaxed border-t border-classie-border pt-4">
                        {item.a}
                      </div>
                    )}
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
    </>
  );
}
