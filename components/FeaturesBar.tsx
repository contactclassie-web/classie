"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface FeatureItem {
  id?: string;
  icon: string;
  title: string;
  subtitle?: string;
  display_order: number;
  active: boolean;
}

const FALLBACK_FEATURES: FeatureItem[] = [
  { icon: "🚚", title: "Free Shipping",   subtitle: "On orders above ₹999",  display_order: 1, active: true },
  { icon: "🔄", title: "Easy Returns",    subtitle: "7-day exchange policy",  display_order: 2, active: true },
  { icon: "🔒", title: "Secure Checkout", subtitle: "100% safe & trusted",    display_order: 3, active: true },
  { icon: "⭐", title: "Premium Quality", subtitle: "Comfort-first design",   display_order: 4, active: true },
];

export default function FeaturesBar() {
  const [features, setFeatures] = useState<FeatureItem[]>(FALLBACK_FEATURES);
  const [speed, setSpeed] = useState(35);

  useEffect(() => {
    // Fetch features
    supabase
      .from("features_bar")
      .select("*")
      .eq("active", true)
      .order("display_order", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) setFeatures(data as FeatureItem[]);
      });

    // Fetch speed from site_settings
    supabase
      .from("site_settings")
      .select("value")
      .eq("key", "features_bar_speed")
      .single()
      .then(({ data }) => {
        if (data?.value) setSpeed(Number(data.value));
      });
  }, []);

  // Duplicate for seamless loop
  const items = [...features, ...features, ...features];

  return (
    <div className="border-y border-classie-border bg-white overflow-hidden py-4">
      <div
        className="flex gap-12 whitespace-nowrap features-marquee"
        style={{ animation: `featuresScroll ${speed}s linear infinite` }}
      >
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3 flex-shrink-0">
            <span className="text-2xl leading-none">{item.icon}</span>
            <div>
              <p className="text-sm font-semibold text-classie-black">{item.title}</p>
              {item.subtitle && (
                <p className="text-xs text-classie-gray">{item.subtitle}</p>
              )}
            </div>
            <span className="ml-8 text-gray-200 text-lg">✦</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes featuresScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .features-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
