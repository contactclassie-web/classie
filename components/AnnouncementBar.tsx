"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const DEFAULT_TEXT = "Use code FIRST10 for 10% off your first order · Free shipping above ₹999";
const ALL_KEYS = ["announcement_1","announcement_2","announcement_3","announcement_4","announcement_5","announcement_6"];

function highlightText(text: string) {
  const parts = text.split(/(\b[A-Z0-9]{4,10}\b)/g);
  return parts.map((part, i) =>
    /^[A-Z0-9]{4,10}$/.test(part)
      ? <strong key={i} style={{ color: "#d4af37", fontWeight: 600 }}>{part}</strong>
      : <span key={i}>{part}</span>
  );
}

const BAR_STYLE: React.CSSProperties = {
  background: "#3B5373",
  padding: "5px 16px",
  textAlign: "center",
  fontFamily: "'Poppins', sans-serif",
  fontSize: "11px",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.9)",
  overflow: "hidden",
};

export default function AnnouncementBar() {
  const [msgs, setMsgs]       = useState<string[]>([DEFAULT_TEXT]);
  const [speed, setSpeed]     = useState("15");
  const [mode, setMode]       = useState<"scroll" | "rotate">("rotate");
  const [idx, setIdx]         = useState(0);

  useEffect(() => {
    supabase.from("site_settings").select("key,value")
      .in("key", [...ALL_KEYS, "announcement_speed", "announcement_mode"])
      .then(({ data }) => {
        if (!data || data.length === 0) return;
        const get = (k: string) => data.find(r => r.key === k)?.value ?? "";
        const sp = get("announcement_speed"); if (sp) setSpeed(sp);
        const mo = get("announcement_mode"); if (mo === "scroll" || mo === "rotate") setMode(mo);
        const list = ALL_KEYS.map(k => get(k)).filter(Boolean);
        if (list.length > 0) setMsgs(list);
      });
  }, []);

  // Rotate mode: cycle messages
  useEffect(() => {
    if (mode !== "rotate" || msgs.length <= 1) return;
    const ms = Math.max(2000, (parseInt(speed) * 1000) / msgs.length);
    const t = setInterval(() => setIdx(i => (i + 1) % msgs.length), ms);
    return () => clearInterval(t);
  }, [msgs, speed, mode]);

  // SCROLL mode — single marquee ticker
  if (mode === "scroll") {
    const dur = `${Math.max(10, parseInt(speed))}s`;
    const sep = "\u00A0\u00A0\u00A0\u00A0\u00A0✦\u00A0\u00A0\u00A0\u00A0\u00A0";
    const items = [...msgs, ...msgs]; // duplicate for seamless loop
    return (
      <div style={{ ...BAR_STYLE, position: "relative" }}>
        <style>{`
          @keyframes marquee2 { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
          .ann-ticker2 { display: inline-flex; white-space: nowrap; animation: marquee2 ${dur} linear infinite; }
        `}</style>
        <span className="ann-ticker2">
          {items.map((msg, i) => (
            <span key={i} style={{ display: "inline-block" }}>
              {highlightText(msg)}
              {i < items.length - 1 && <span style={{ opacity: 0.5 }}>{sep}</span>}
            </span>
          ))}
        </span>
      </div>
    );
  }

  // ROTATE mode — blink/fade single message
  return (
    <div style={BAR_STYLE}>
      <style>{`
        @keyframes fadeMsg { 0%,10%{opacity:0;transform:translateY(4px)} 20%,80%{opacity:1;transform:translateY(0)} 90%,100%{opacity:0;transform:translateY(-4px)} }
        .ann-msg { display:inline-block; animation: fadeMsg ${Math.max(3, parseInt(speed) / Math.max(1, msgs.length))}s ease-in-out; }
      `}</style>
      <p key={idx} className="ann-msg">{highlightText(msgs[idx] ?? DEFAULT_TEXT)}</p>
    </div>
  );
}
