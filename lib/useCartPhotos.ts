"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { colourPhotoKey, firstColourPhotos, type ColourRow } from "@/lib/variantPhotos";

/** Returns photoFor(item): the chosen colour's first photo, else the saved cart photo. */
export function useCartPhotos(items: { slug: string; variant?: string; image: string }[]) {
  const slugs = Array.from(new Set(items.filter((i) => i.variant && !i.slug.startsWith("set-")).map((i) => i.slug))).sort().join(",");
  const [photos, setPhotos] = useState<Map<string, string>>(new Map());
  useEffect(() => {
    if (!slugs) return;
    let alive = true;
    supabase.from("product_color_variants").select("product_slug,color_name,image").in("product_slug", slugs.split(","))
      .then(({ data }) => { if (alive && data) setPhotos(firstColourPhotos(data as ColourRow[])); });
    return () => { alive = false; };
  }, [slugs]);
  return (item: { slug: string; variant?: string; image: string }) => photos.get(colourPhotoKey(item.slug, item.variant)) || item.image;
}
