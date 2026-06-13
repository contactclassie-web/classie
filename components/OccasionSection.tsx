"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import OccasionCarousel from "./OccasionCarousel";

interface Occasion { title: string; href: string; image: string; tag_label?: string; image_position?: string; }

export default function OccasionSection() {
  const [occasions, setOccasions] = useState<Occasion[]>([]);

  useEffect(() => {
    supabase.from("collections").select("*").eq("active", true).order("display_order", { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setOccasions(data.map((c) => ({
            title: c.title,
            href: `/shop/${c.slug}`,
            image: c.image_url ?? "",
            tag_label: c.tag_label ?? "",
            image_position: c.image_position ?? "50% 50%",
          })));
        }
      });
  }, []);

  if (occasions.length === 0) return null;

  return <OccasionCarousel occasions={occasions} />;
}
