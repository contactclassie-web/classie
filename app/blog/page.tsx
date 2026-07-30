import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import BlogClient from "./BlogClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "The CLASSIE Journal — Style. Stories. Soul.",
  description:
    "Discover styling tips, trend reports, and stories from the world of CLASSIE footwear.",
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

export default async function BlogPage() {
  const posts = await getPosts();
  return <BlogClient posts={posts} />;
}
