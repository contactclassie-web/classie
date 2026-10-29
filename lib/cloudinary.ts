/**
 * Optimizes a Cloudinary image URL by injecting f_auto,q_auto transformations.
 * f_auto → serves WebP/AVIF instead of PNG/JPG (50-70% smaller)
 * q_auto → auto-quality compression without visible loss
 */
export function optimizeCloudinary(url: string, width?: number): string {
  if (!url || !url.includes("res.cloudinary.com") || url.includes("/video/upload/")) return url;
  // Already has transformations — skip
  if (url.includes("f_auto")) return url;
  const transforms = width ? `f_auto,q_auto,w_${width}` : "f_auto,q_auto";
  return url.replace("/upload/", `/upload/${transforms}/`);
}

/**
 * Smaller Cloudinary video for the web (q_auto + max width). Phone videos are
 * often 40–80 MB; this brings them to a few MB. Non-Cloudinary URLs are
 * returned unchanged.
 */
export function optimizeCloudinaryVideo(url: string, width = 720): string {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/video/upload/")) return url;
  if (/\/video\/upload\/[^/]*q_auto/.test(url)) return url;
  return url.replace("/video/upload/", `/video/upload/q_auto,w_${width}/`);
}

/**
 * Tiny blurred copy of a Cloudinary photo (about 1 KB), used as a card's
 * background so the card shows a soft preview instead of a grey box while the
 * real photo loads. Returns "" for non-Cloudinary URLs.
 */
export function blurPlaceholder(url: string): string {
  if (!url || !url.includes("res.cloudinary.com/") || !url.includes("/image/upload/")) return "";
  return url.replace("/image/upload/", "/image/upload/w_32,q_30,e_blur:300,f_auto/");
}

/** Inline style that puts the blurred preview behind an image. */
export function blurStyle(url: string): { backgroundImage?: string; backgroundSize?: string; backgroundPosition?: string } {
  const b = blurPlaceholder(url);
  return b ? { backgroundImage: `url("${b}")`, backgroundSize: "cover", backgroundPosition: "center" } : {};
}
