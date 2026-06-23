"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import OccasionCarousel from "./OccasionCarousel";

interface Occasion { title: string; href: string; image: string; tag_label?: string; image_position?: string; }

interface Props {
  initialOccasions?: Occasion[];
}

export default function OccasionSection({ initialOccasions }: Props) {
  const [occasions, setOccasions] = useState<Occasion[]>(initialOccasions ?? []);

  useEffect(() => {
    // Skip client fetch if server already provided data — prevents blink
    if (initialOccasions && initialOccasions.length > 0) return;
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (occasions.length === 0) return null;

  return <OccasionCarousel occasions={occasions} />;
}
