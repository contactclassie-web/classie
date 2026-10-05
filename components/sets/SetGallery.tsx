"use client";

import { useState } from "react";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { SetCollage } from "@/components/sets/SetCard";

// Set photos with thumbnails; with no set photos, a collage of the pieces.
export default function SetGallery({ setImages, pieceImages, name }: { setImages: string[]; pieceImages: string[]; name: string }) {
  const [i, setI] = useState(0);
  if (!setImages.length) return <SetCollage images={pieceImages} />;
  return (
    <div className="grid gap-2 md:grid-cols-[72px_1fr] md:gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={optimizeCloudinary(setImages[i], 1200)} alt={name} className="w-full aspect-square object-cover bg-[#f6f6f6] md:col-start-2 md:row-start-1" />
      {setImages.length > 1 && (
        <div className="flex md:flex-col gap-1.5 overflow-x-auto md:col-start-1 md:row-start-1">
          {setImages.map((u, k) => (
            <button key={k} type="button" onClick={() => setI(k)} aria-label={`Photo ${k + 1}`}
              className={`flex-none border-[1.5px] ${k === i ? "border-[#3B5373]" : "border-transparent"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={optimizeCloudinary(u, 160)} alt="" className="w-16 h-16 md:w-[68px] md:h-[68px] object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
