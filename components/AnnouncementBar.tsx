"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const DEFAULT_ANNOUNCEMENTS = [
  "✦ Welcome to Classie — One Heel. Endless Looks.",
  "Use code FIRST10 for 10% OFF your first order!",
  "🚢 Free Shipping above ₹999 | 😊 Easy Returns & Exchange",
];

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<string[]>(DEFAULT_ANNOUNCEMENTS);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("key,value")
      .in("key", ["announcement_1", "announcement_2", "announcement_3"])
      .then(({ data }) => {
        if (data && data.length > 0) {
          const sorted = [...data].sort((a, b) => a.key.localeCompare(b.key));
          const texts = sorted.map((r) => r.value).filter(Boolean);
          if (texts.length > 0) setAnnouncements(texts);
        }
      });
  }, []);

  // Duplicate for seamless infinite scroll
  const items = [...announcements, ...announcements];

  return (
    <div className="bg-[#3D4F5F] text-white text-[11px] py-2 overflow-hidden">
      <div className="marquee-track flex gap-16 whitespace-nowrap" style={{ animation: "marquee 30s linear infinite" }}>
        {items.map((text, i) => (
          <span key={i} className="flex-shrink-0 tracking-wide px-8">
            {text}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
