"use client";
import React, { useState, useRef } from "react";

type CardData = { title: string; tag: string; media_url: string; media_type: "image" | "video" };

export default function ReelCard({ card, cardH, cardW, aspect, radius }: {
  card: CardData;
  cardH: number;
  cardW: number;
  aspect: string;
  radius: string;
}) {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const radiusClass: Record<string, string> = { sharp: "rounded-none", slight: "rounded", rounded: "rounded-xl", pill: "rounded-3xl" };
  const aspectStyle = aspect !== "none" ? { aspectRatio: aspect } : {};

  const handlePlay = () => {
    if (videoRef.current) { videoRef.current.play(); setPlaying(true); }
  };
  const handlePause = () => {
    if (videoRef.current) { videoRef.current.pause(); setPlaying(false); }
  };

  return (
    <div
      className={`relative bg-[#1a1a1a] overflow-hidden group flex-shrink-0 ${radiusClass[radius] || "rounded-none"}`}
      style={{ height: aspect === "none" ? `${cardH}px` : undefined, width: cardW > 0 ? `${cardW}px` : undefined, ...aspectStyle }}
    >
      {card.media_type === "video" && card.media_url ? (
        <>
          <video
            ref={videoRef}
            src={card.media_url}
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-90"
            onEnded={() => setPlaying(false)}
          />
          <button
            onClick={playing ? handlePause : handlePlay}
            className="absolute inset-0 flex items-center justify-center w-full h-full bg-transparent border-0 cursor-pointer"
          >
            {!playing && (
              <span className="flex items-center justify-center w-14 h-14 rounded-full bg-black/40 backdrop-blur-sm border border-white/30 text-white text-2xl transition-transform group-hover:scale-110">
                ▶
              </span>
            )}
          </button>
        </>
      ) : card.media_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={card.media_url} alt={card.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-white/20 text-4xl">▶</span>
        </div>
      )}
      {(card.title || card.tag) && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none">
          {card.title && <p className="text-white text-[11px] font-medium leading-tight">{card.title}</p>}
          {card.tag && <p className="text-white/60 text-[9px] tracking-widest uppercase mt-0.5">{card.tag}</p>}
        </div>
      )}
    </div>
  );
}
