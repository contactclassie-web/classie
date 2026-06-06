"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const DEFAULT_ANNOUNCEMENTS = [
  "✦ Welcome to Classie — One Heel. Endless Looks.",
  "Use code FIRST10 for 10% OFF your first order!",
  "🚢 Free Shipping above ₹999 | 😊 Easy Returns & Exchange",
];

const ALL_ANNOUNCEMENT_KEYS = [
  "announcement_1",
  "announcement_2",
  "announcement_3",
  "announcement_4",
  "announcement_5",
  "announcement_6",
];

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<string[]>(DEFAULT_ANNOUNCEMENTS);
  const [speed, setSpeed] = useState("30");

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("key,value")
      .in("key", [...ALL_ANNOUNCEMENT_KEYS, "announcement_speed"])
      .then(({ data }) => {
        if (data && data.length > 0) {
          // Extract speed
          const speedRow = data.find((r) => r.key === "announcement_speed");
          if (speedRow?.value) setSpeed(speedRow.value);

          // Extract announcements 1-6 in order
          const sorted = ALL_ANNOUNCEMENT_KEYS
            .map((key) => data.find((r) => r.key === key)?.value ?? "")
            .filter(Boolean);
          if (sorted.length > 0) setAnnouncements(sorted);
        }
      });
  }, []);

  // Duplicate for seamless infinite scroll
  const items = [...announcements, ...announcements];
  const duration = `${speed}s`;

  return (
    <div className="bg-[#3B5373] text-white text-[11px] py-2 overflow-hidden">
      <div
        className="marquee-track flex gap-16 whitespace-nowrap"
        style={{ animation: `marquee ${duration} linear infinite` }}
      >
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
