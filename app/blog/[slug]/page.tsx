import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 3600;

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function generateStaticParams() {
  try {
    const sb = getSupabase();
    const { data } = await sb.from("blog_posts").select("slug").eq("active", true);
    return (data || []).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  category: string;
  author: string;
  published_at: string;
  active: boolean;
  is_featured: boolean;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const sb = getSupabase();
    const { data, error } = await sb
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .single();
    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

async function getMorePosts(category: string, excludeId: string): Promise<BlogPost[]> {
  try {
    const sb = getSupabase();
    // Try same category first
    const { data: same } = await sb
      .from("blog_posts")
      .select("*")
      .eq("active", true)
      .eq("category", category)
      .neq("id", excludeId)
      .order("published_at", { ascending: false })
      .limit(3);
    if (same && same.length >= 3) return same;
    // Fall back to latest
    const { data: latest } = await sb
      .from("blog_posts")
      .select("*")
      .eq("active", true)
      .neq("id", excludeId)
      .order("published_at", { ascending: false })
      .limit(3);
    return latest || [];
  } catch {
    return [];
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} — The CLASSIE Journal`,
    description: post.excerpt || undefined,
    openGraph: post.cover_image
      ? { images: [{ url: post.cover_image }] }
      : undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  const morePosts = await getMorePosts(post.category, post.id);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#fff", color: "#1a1a1a" }}>
      {/* Cover image — full width */}
      {post.cover_image && (
        <div
          style={{
            position: "relative",
            width: "100%",
            maxHeight: "500px",
            overflow: "hidden",
            aspectRatio: "16/9",
          }}
        >
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            style={{ maxHeight: "500px" }}
          />
        </div>
      )}

      {/* Article content */}
      <div
        style={{
          maxWidth: "768px",
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        {/* Back link */}
        <Link
          href="/blog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: "'Poppins', sans-serif",
            fontSize: "0.72rem",
            fontWeight: 500,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#888",
            textDecoration: "none",
            marginBottom: "32px",
            transition: "color 0.2s",
          }}
        >
          ← Back to Journal
        </Link>

        {/* Category + date */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "0.62rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#fff",
              background: "#3B5373",
              padding: "5px 14px",
              borderRadius: "20px",
            }}
          >
            {post.category}
          </span>
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "0.72rem",
              color: "#888",
              fontWeight: 300,
            }}
          >
            {formatDate(post.published_at)}
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "3rem",
            fontWeight: 500,
            color: "#1a1a1a",
            lineHeight: 1.2,
            letterSpacing: "0.01em",
            marginBottom: "16px",
          }}
        >
          {post.title}
        </h1>

        {/* Author */}
        <p
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "0.78rem",
            color: "#888",
            fontWeight: 300,
            marginBottom: "32px",
          }}
        >
          By {post.author}
        </p>

        {/* Divider */}
        <hr style={{ border: "none", borderTop: "1px solid #e5e5e5", marginBottom: "36px" }} />

        {/* Content */}
        <div
          dangerouslySetInnerHTML={{ __html: post.content || "<p>Content coming soon.</p>" }}
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "#333",
          }}
          className="blog-prose"
        />
      </div>

      {/* More Stories */}
      {morePosts.length > 0 && (
        <div
          style={{
            borderTop: "1px solid #e5e5e5",
            background: "#fafafa",
            padding: "64px 40px",
          }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginBottom: "44px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.62rem",
                  fontWeight: 600,
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: "#888",
                  whiteSpace: "nowrap",
                }}
              >
                More Stories
              </span>
              <div style={{ flex: 1, height: "1px", background: "#e5e5e5" }} />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "36px 28px",
              }}
              className="more-cards-grid"
            >
              {morePosts.map((mp) => (
                <Link
                  key={mp.id}
                  href={`/blog/${mp.slug}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  className="blog-card"
                >
                  <div
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: "8px",
                      marginBottom: "18px",
                      aspectRatio: "4/3",
                    }}
                  >
                    {mp.cover_image ? (
                      <Image
                        src={mp.cover_image}
                        alt={mp.title}
                        fill
                        className="object-cover blog-card-img"
                        sizes="33vw"
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: "#f5f0e8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <span style={{ fontSize: "2rem", opacity: 0.2 }}>✦</span>
                      </div>
                    )}
                  </div>
                  <span
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "0.6rem",
                      fontWeight: 600,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "#3B5373",
                      marginBottom: "10px",
                      display: "block",
                    }}
                  >
                    {mp.category}
                  </span>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.28rem",
                      fontWeight: 500,
                      color: "#1a1a1a",
                      lineHeight: 1.35,
                      marginBottom: "12px",
                    }}
                    className="blog-card-title"
                  >
                    {mp.title}
                  </h3>
                  <span
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "0.65rem",
                      color: "#888",
                      fontWeight: 300,
                    }}
                  >
                    {formatDate(mp.published_at)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .blog-prose h2 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 500;
          color: #1a1a1a;
          margin: 2rem 0 1rem;
          line-height: 1.3;
        }
        .blog-prose h3 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 500;
          color: #1a1a1a;
          margin: 1.5rem 0 0.75rem;
        }
        .blog-prose p { margin-bottom: 1.25rem; }
        .blog-prose ul, .blog-prose ol { margin: 1rem 0 1.25rem 1.5rem; }
        .blog-prose li { margin-bottom: 0.4rem; }
        .blog-prose a { color: #3B5373; text-decoration: underline; }
        .blog-card:hover .blog-card-title { color: #3B5373; }
        .blog-card:hover .blog-card-img { transform: scale(1.04); }
        .blog-card-img { transition: transform 0.45s ease; }
        @media (max-width: 900px) {
          .more-cards-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .more-cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
