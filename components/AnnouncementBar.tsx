"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const DEFAULT_ANNOUNCEMENTS = [
  "Use code FIRST10 for 10% OFF your first order",
  "Free Shipping above ₹999 · Easy Returns & Exchange",
  "Welcome to Classie — One Heel. Endless Looks.",
];

const ALL_ANNOUNCEMENT_KEYS = [
  "announcement_1",
  "announcement_2",
  "announcement_3",
  "announcement_4",
  "announcement_5",
  "announcement_6",
];

// Highlight promo codes in gold
function highlightText(text: string) {
  // Highlight words like FIRST10, SAVE20, etc. (all caps, alphanumeric, 4–10 chars)
  const parts = text.split(/(\b[A-Z0-9]{4,10}\b)/g);
  return parts.map((part, i) =>
    /^[A-Z0-9]{4,10}$/.test(part)
      ? <strong key={i} style={{ color: "#d4af37", fontWeight: 600 }}>{part}</strong>
      : <span key={i}>{part}</span>
  );
}

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
          const speedRow = data.find((r) => r.key === "announcement_speed");
          if (speedRow?.value) setSpeed(speedRow.value);

          const sorted = ALL_ANNOUNCEMENT_KEYS
            .map((key) => data.find((r) => r.key === key)?.value ?? "")
            .filter(Boolean);
          if (sorted.length > 0) setAnnouncements(sorted);
        }
      });
  }, []);

  const items = [...announcements, ...announcements];
  const duration = `${speed}s`;

  return (
    <div
      className="overflow-hidden py-2"
      style={{ background: "#3B5373", fontFamily: "'Poppins', sans-serif" }}
    >
      <div
        className="announcement-track flex whitespace-nowrap"
        style={{ animation: `announcementScroll ${duration} linear infinite` }}
      >
        {items.map((text, i) => (
          <span
            key={i}
            className="flex-shrink-0 text-white/90"
            style={{
              fontSize: "11px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              padding: "0 48px",
            }}
          >
            {highlightText(text)}
            <span className="mx-6 text-white/30">·</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes announcementScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .announcement-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
