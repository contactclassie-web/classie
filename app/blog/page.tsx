import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import BlogClient from "./BlogClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Heels & Shoe Clips Style Guide — The CLASSIE Journal | India",
  description: "Explore CLASSIE's style guides for women's heels and shoe clips in India — how to wear black heels, heels with saree, shoe clips for weddings, block heels, office heels and more.",
  alternates: { canonical: "https://www.classie.co.in/blog" },
  keywords: ["heels style guide india", "shoe clips guide", "how to wear heels india", "block heels tips", "shoe clips for saree", "heels for indian wedding"],
};

async function getPosts() {
  try {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error } = await sb
      .from("blog_posts")
      .select("*")
      .eq("active", true)
      .order("published_at", { ascending: false });
    if (error) {
      console.warn("Blog fetch error:", error.message);
      return [];
    }
    return data || [];
  } catch (e) {
    console.warn("Blog fetch failed:", e);
    return [];
  }
}

async function getCategories(): Promise<string[]> {
  try {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await sb.from("site_settings").select("value").eq("key", "blog_categories").maybeSingle();
    if (data?.value) { const parsed = JSON.parse(data.value); if (Array.isArray(parsed)) return parsed; }
  } catch { /* ignore */ }
  return ["Style Guide", "Trend Report", "How To Style", "Care Guide", "Brand Story"];
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);
  return (
    <>
      <BlogClient posts={posts} categories={categories} />
      <section className="max-w-4xl mx-auto px-6 py-12 text-center border-t border-gray-100">
        <h2 className="text-xl font-serif font-light text-[#1a1a1a] mb-4">Style Guides for Heels &amp; Shoe Clips in India</h2>
        <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: "'Poppins', sans-serif" }}>
          The CLASSIE Journal covers everything you need to know about <strong>women&apos;s heels in India</strong> — from <strong>how to wear block heels</strong> and <strong>slingback heels</strong> to complete guides on <strong>heels with saree</strong>, <strong>heels for Indian weddings</strong>, and <strong>office heels</strong>. We also cover <strong>shoe clips</strong>, <strong>bow clips</strong>, <strong>shoe charms</strong> and how to style them for every occasion.
        </p>
      </section>
    </>
  );
}
