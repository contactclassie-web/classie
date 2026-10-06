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
