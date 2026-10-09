import type { ListingProduct } from "@/components/shop/ShopListing";

// Journal helpers: pick a real CLASSIE photo as a post's cover, and the
// products a post talks about ("Shop this story"). Stock photos of other
// brands' shoes are replaced by the product the post is about.

interface PostLike { slug: string; title: string; content: string | null; cover_image: string | null }

const GENERIC = new Set(["shoe", "shoes", "clip", "clips", "charm", "charms", "crystal", "pair", "jute", "pumps", "heel", "heels", "the", "and", "of"]);

function nameKey(title: string): string[] {
  return title.toLowerCase().replace(/\(pair\)/g, " ").replace(/[^a-z0-9 ]+/g, " ").split(/\s+/).filter((w) => w && !GENERIC.has(w));
}

/** Products a post links to (/products/slug) or names (e.g. "Velora Black", "Marquise Bloom"). */
export function productsInPost(post: PostLike, all: ListingProduct[]): ListingProduct[] {
  const html = post.content ?? "";
  const out: ListingProduct[] = [];
  const add = (p?: ListingProduct) => { if (p && !out.includes(p)) out.push(p); };
  for (const m of Array.from(html.matchAll(/\/products\/([a-z0-9-]+)/gi))) add(all.find((p) => p.slug === m[1].toLowerCase()));
  const hay = `${post.title} ${post.slug.replace(/-/g, " ")}`.toLowerCase();
  for (const p of all) {
    const words = nameKey(p.title);
    if (words.length >= 2 && words.every((w) => hay.includes(w))) add(p);
  }
  return out;
}

function topic(post: PostLike): "heels" | "charms" {
  const text = `${post.title} ${post.content ?? ""}`.toLowerCase();
  const clip = (text.match(/\b(clip|clips|charm|charms|bow|anklet)\b/g) ?? []).length;
  const heel = (text.match(/\bheels?\b/g) ?? []).length;
  return clip > heel ? "charms" : "heels";
}

/** Up to n products for the "Shop this story" row. */
export function storyProducts(post: PostLike, heels: ListingProduct[], charms: ListingProduct[], n = 4): ListingProduct[] {
  const all = [...heels, ...charms];
  const list = productsInPost(post, all);
  const pool = topic(post) === "charms" ? charms : heels;
  for (const p of [...pool.filter((x) => x.isNew), ...pool]) {
    if (list.length >= n) break;
    if (!list.includes(p)) list.push(p);
  }
  return list.slice(0, n);
}

const isCloudinary = (u: string) => /res\.cloudinary\.com/.test(u);

/** A real CLASSIE cover photo for a post. */
export function postCover(post: PostLike, heels: ListingProduct[], charms: ListingProduct[]): string {
  const cover = (post.cover_image ?? "").trim();
  if (cover && isCloudinary(cover)) return cover;
  const first = productsInPost(post, [...heels, ...charms])[0];
  if (first) return charms.includes(first) ? first.image2 || first.image : first.image;
  const inline = (post.content ?? "").match(/https:\/\/res\.cloudinary\.com\/[^"'\s)]+\.(?:png|jpe?g|webp)/i)?.[0];
  if (inline) return inline;
  // Nothing named: a product of the post's topic, different per post
  const pool = topic(post) === "charms" ? charms : heels;
  if (!pool.length) return cover;
  const hash = Array.from(post.slug).reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
  const pick = pool[hash % pool.length];
  return pool === charms ? pick.image2 || pick.image : pick.image;
}
