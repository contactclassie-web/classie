"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqSection } from "@/lib/siteContent";

export default function FaqList({ sections }: { sections: FaqSection[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      {sections.map((section) => (
        <div key={section.section}>
          <h2 className="font-serif text-2xl text-classie-black mb-5 pb-3 border-b border-classie-border">{section.section}</h2>
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
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-classie-black hover:bg-[#faf8f6] transition-colors"
                  >
                    {item.q}
                    <ChevronDown className={`w-4 h-4 text-classie-gray flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div hidden={!isOpen} className="px-5 pb-4 text-sm text-classie-gray leading-relaxed border-t border-classie-border pt-4 whitespace-pre-line">
                    {item.a}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
