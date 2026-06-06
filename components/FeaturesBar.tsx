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

  useEffect(() => {
    supabase
      .from("features_bar")
      .select("*")
      .eq("active", true)
      .order("display_order", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) {
          setFeatures(data as FeatureItem[]);
        }
      });
  }, []);

  return (
    <div className="border-y border-classie-border bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {features.map((item) => (
            <div key={item.id ?? item.title} className="flex items-center gap-3">
              <span className="text-2xl flex-shrink-0 leading-none">{item.icon}</span>
              <div>
                <p className="text-sm font-semibold text-classie-black">{item.title}</p>
                {item.subtitle && (
                  <p className="text-xs text-classie-gray">{item.subtitle}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
