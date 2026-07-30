/**
 * Optimizes a Cloudinary image URL by injecting f_auto,q_auto transformations.
 * f_auto → serves WebP/AVIF instead of PNG/JPG (50-70% smaller)
 * q_auto → auto-quality compression without visible loss
 */
export function optimizeCloudinary(url: string, width?: number): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  // Already has transformations — skip
  if (url.includes("f_auto")) return url;
  const transforms = width ? `f_auto,q_auto,w_${width}` : "f_auto,q_auto";
  return url.replace("/upload/", `/upload/${transforms}/`);
}
