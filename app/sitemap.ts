import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { GIFT_SETS_KEY, mergeGiftSets } from "@/lib/giftSets";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.classie.co.in";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/shop/heels`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/shop/clips`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/collections`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/gift-sets`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/custom-designs`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/style-ideas`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/hot-deals`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/size-guide`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/shipping`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/returns`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/privacy-policy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/refund-policy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  // Dynamic product pages
  try {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: products } = await sb
      .from("products")
      .select("slug, updated_at")
      .eq("active", true);

    const productPages: MetadataRoute.Sitemap = (products || []).map((p) => ({
      url: `${base}/products/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // Dynamic blog pages
    const { data: posts } = await sb
      .from("blog_posts")
      .select("slug, published_at")
      .eq("active", true);

    const blogPages: MetadataRoute.Sitemap = (posts || []).map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.published_at ? new Date(p.published_at) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

    // Dynamic shop category pages (admin-added categories under "Shop by Category")
    const { data: categories } = await sb
      .from("site_categories")
      .select("slug")
      .eq("active", true);

    const categoryPages: MetadataRoute.Sitemap = (categories || [])
      .filter((c) => !["heels", "clips", "shoe-charms", "bow"].includes(c.slug))
      .map((c) => ({
        url: `${base}/shop/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));

    // Gift set pages (switched-on sets only)
    const { data: setsRow } = await sb.from("site_settings").select("value").eq("key", GIFT_SETS_KEY).maybeSingle();
    let setPages: MetadataRoute.Sitemap = [];
    try {
      const sets = mergeGiftSets(setsRow?.value ? JSON.parse(setsRow.value) : null).sets.filter((x) => x.active);
      setPages = sets.map((x) => ({ url: `${base}/gift-sets/${x.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 }));
    } catch { setPages = []; }

    return [...staticPages, ...productPages, ...blogPages, ...categoryPages, ...setPages];
  } catch {
    return staticPages;
  }
}
