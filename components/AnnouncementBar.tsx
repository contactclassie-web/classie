"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const DEFAULT_TEXT = "Use code FIRST10 for 10% off your first order · Free shipping above ₹999";

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
  const parts = text.split(/(\b[A-Z0-9]{4,10}\b)/g);
  return parts.map((part, i) =>
    /^[A-Z0-9]{4,10}$/.test(part)
      ? <strong key={i} style={{ color: "#d4af37", fontWeight: 600 }}>{part}</strong>
      : <span key={i}>{part}</span>
  );
}

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<string[]>([DEFAULT_TEXT]);
  const [speed, setSpeed] = useState("25");
  const [currentIdx, setCurrentIdx] = useState(0);

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

  // If multiple announcements, rotate them every few seconds
  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIdx((i) => (i + 1) % announcements.length);
    }, parseInt(speed) * 1000 / announcements.length);
    return () => clearInterval(interval);
  }, [announcements, speed]);

  return (
    <div
      style={{
        background: "#3B5373",
        padding: "9px 16px",
        textAlign: "center",
        fontFamily: "'Poppins', sans-serif",
        fontSize: "11px",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "#fff",
      }}
    >
      <p>
        {highlightText(announcements[currentIdx] ?? DEFAULT_TEXT)}
      </p>
    </div>
  );
}
