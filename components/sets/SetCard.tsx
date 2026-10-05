import Link from "next/link";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { pieceCount, setCompareAt, setImages, setKind, type GiftSet, type SetProduct } from "@/lib/giftSets";

// Up to three photos arranged as one tile: one tall on the left, two stacked.
export function SetCollage({ images, className = "" }: { images: string[]; className?: string }) {
  const imgs = images.slice(0, 3);
  if (!imgs.length) return <div className={`aspect-square bg-[#F7F4EF] ${className}`} />;
  if (imgs.length === 1) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={optimizeCloudinary(imgs[0], 800)} alt="" loading="lazy" className={`w-full aspect-square object-cover ${className}`} />;
  }
  return (
    <div className={`grid gap-[2px] aspect-square ${imgs.length === 2 ? "grid-cols-2" : "grid-cols-[1.4fr_1fr] grid-rows-2"} ${className}`}>
      {imgs.map((u, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src={optimizeCloudinary(u, 600)} alt="" loading="lazy"
          className={`w-full h-full object-cover ${imgs.length === 3 && i === 0 ? "row-span-2" : ""}`} />
      ))}
    </div>
  );
}

export function SetCard({ set, products }: { set: GiftSet; products: Record<string, SetProduct> }) {
  const compare = setCompareAt(set, products);
  const save = compare - set.price;
  const kind = setKind(set, products);
  const names = set.items.map((it) => {
    const t = products[it.slug]?.title?.replace(/\s*\((pair)\)\s*$/i, "") ?? it.slug;
    return it.qty > 1 ? `${it.qty} × ${t}` : t;
  });
  // Set photos (if any) as a single image, otherwise a collage of the pieces.
  const imgs = set.images.length ? [set.images[0]] : setImages(set, products);
  return (
    <Link href={`/gift-sets/${set.slug}`} className="group grid gap-1.5 content-start">
      <div className="relative overflow-hidden bg-[#f6f6f6]">
        <div className="transition-transform duration-500 group-hover:scale-[1.03]"><SetCollage images={imgs} /></div>
        <span className="absolute left-2 bottom-2 bg-white px-2 py-1.5 font-sans text-[9.5px] font-semibold tracking-[0.08em] uppercase text-[#3B5373]">
          {set.askOnly ? `${pieceCount(set)}+ pairs` : `${kind}${save > 0 ? ` · Save ₹${save.toLocaleString("en-IN")}` : ""}`}
        </span>
      </div>
      {set.tag && <span className="font-sans text-[9.5px] md:text-[10px] tracking-[0.16em] uppercase text-[#B08D57] mt-1">{set.tag}</span>}
      <b className="font-serif font-normal text-[18px] md:text-[22px] leading-tight text-[#1a1a1a] group-hover:text-[#3B5373] transition-colors">{set.name}</b>
      <span className="font-sans text-[11px] md:text-[12.5px] text-[#6b6b6b] leading-snug line-clamp-2">{names.join(" + ")}</span>
      <div className="flex items-baseline gap-2 mt-0.5">
        {set.askOnly ? (
          <span className="font-sans text-[13px] font-semibold text-[#1a1a1a]">Price on request</span>
        ) : (
          <>
            <span className="font-sans text-[14.5px] md:text-[15.5px] font-semibold text-[#1a1a1a] tabular-nums">₹{set.price.toLocaleString("en-IN")}</span>
            {save > 0 && <span className="font-sans text-[11.5px] text-[#9a9a9a] line-through tabular-nums">₹{compare.toLocaleString("en-IN")}</span>}
          </>
        )}
      </div>
      <span className="mt-1 border border-[#3B5373] text-[#3B5373] text-center font-sans text-[10.5px] font-semibold tracking-[0.12em] uppercase py-2.5 group-hover:bg-[#3B5373] group-hover:text-white transition-colors">
        {set.askOnly ? "Ask on WhatsApp" : "View set"}
      </span>
    </Link>
  );
}
