import crypto from "crypto";

// Signed uploads to the site's Cloudinary account. Keys live only on the
// server (CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET).

function creds() {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME || "";
  const key = process.env.CLOUDINARY_API_KEY || "";
  const secret = process.env.CLOUDINARY_API_SECRET || "";
  return cloud && key && secret ? { cloud, key, secret } : null;
}

export function cloudinaryConfigured(): boolean {
  return creds() !== null;
}

/** Cloudinary's signature: params sorted by name, joined as a=b&c=d, plus the secret, SHA-1. */
export function signParams(params: Record<string, string>, secret: string): string {
  const base = Object.keys(params).sort().map((k) => `${k}=${params[k]}`).join("&");
  return crypto.createHash("sha1").update(base + secret).digest("hex");
}

/**
 * Uploads a photo. iPhone HEIC photos are converted to JPG so every browser
 * can show them, and very large photos are scaled down to 2400px.
 */
export async function uploadImage(file: { name: string; mimeType: string; data: ArrayBuffer }, folder = "classie-products"): Promise<string> {
  const c = creds();
  if (!c) throw new Error("Cloudinary is not set up yet (CLOUDINARY_* keys are missing).");
  const isHeic = /hei[cf]/i.test(file.mimeType) || /\.hei[cf]$/i.test(file.name);
  const params: Record<string, string> = {
    folder,
    timestamp: String(Math.floor(Date.now() / 1000)),
    transformation: "c_limit,w_2400,h_2400",
    unique_filename: "true",
    use_filename: "true",
  };
  if (isHeic) params.format = "jpg";
  const form = new FormData();
  for (const [k, v] of Object.entries(params)) form.append(k, v);
  form.append("api_key", c.key);
  form.append("signature", signParams(params, c.secret));
  form.append("file", new Blob([file.data], { type: file.mimeType }), file.name.replace(/[^\w.-]+/g, "_"));
  const res = await fetch(`https://api.cloudinary.com/v1_1/${c.cloud}/image/upload`, { method: "POST", body: form, cache: "no-store" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.secure_url) throw new Error(`Cloudinary upload failed: ${data?.error?.message || res.status}`);
  return data.secure_url as string;
}
