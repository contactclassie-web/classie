"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-1">
      {faqs.map((faq, i) => (
        <div key={i} className="bg-white border-b border-[#e5e5e5] last:border-b-0">
          <button onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left">
            <span className="font-medium text-[#1a1a1a] text-sm pr-4">{faq.q}</span>
            <ChevronDown className="flex-shrink-0 w-5 h-5 text-[#3B5373] transition-transform duration-200"
              style={{ transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }} />
          </button>
          <div className="overflow-hidden transition-all duration-200"
            style={{ maxHeight: open === i ? "400px" : "0px" }}>
            <p className="px-5 pb-4 text-sm text-[#666] leading-relaxed">{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
