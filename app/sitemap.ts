import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://www.classie.co.in";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/shop/heels`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/shop/clips`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/shop/accessories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/shop/shoe-charms`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/collections`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
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

    return [...staticPages, ...productPages, ...blogPages];
  } catch {
    return staticPages;
  }
}
