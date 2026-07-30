"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
  created_at: string;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BlogClient({ posts, categories: propCategories }: { posts: BlogPost[]; categories?: string[] }) {
  const featured = posts.find((p) => p.is_featured) || posts[0] || null;
  const categories = ["All", ...(propCategories ?? Array.from(new Set(posts.map((p) => p.category))))];
  const [activeFilter, setActiveFilter] = useState("All");

  const latestPosts = posts.filter((p) => p.id !== featured?.id);
  const filteredPosts =
    activeFilter === "All"
      ? latestPosts
      : latestPosts.filter((p) => p.category === activeFilter);

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", background: "#fff", color: "#1a1a1a" }}>
      {/* ── Hero / Journal Header ── */}
      <div
        style={{
          textAlign: "center",
          padding: "64px 60px 40px",
          borderBottom: "1px solid #e5e5e5",
        }}
      >
        <p
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "0.65rem",
            fontWeight: 500,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#888",
            marginBottom: "12px",
          }}
        >
          THE CLASSIE JOURNAL
        </p>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "3.4rem",
            fontWeight: 400,
            color: "#1a1a1a",
            letterSpacing: "0.02em",
            lineHeight: 1.1,
            marginBottom: "14px",
            fontStyle: "italic",
          }}
        >
          Style. Stories. Soul.
        </h1>
        <p
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "0.8rem",
            color: "#888",
            fontWeight: 300,
            letterSpacing: "0.04em",
          }}
        >
          Discover styling tips, trend reports, and stories from the world of CLASSIE.
        </p>
      </div>

      {/* ── Main Content ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 40px" }}>

        {/* ── Featured Post ── */}
        {featured && (
          <section style={{ padding: "64px 0 56px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "45fr 55fr",
                gap: "64px",
                alignItems: "center",
              }}
            >
              {/* Left — Text */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {/* FEATURED label */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "12px",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.65rem",
                    fontWeight: 600,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "#3B5373",
                    marginBottom: "22px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      width: "28px",
                      height: "1.5px",
                      background: "#3B5373",
                      flexShrink: 0,
                    }}
                  />
                  Featured
                </div>

                {/* Title */}
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "2.8rem",
                    fontWeight: 500,
                    color: "#1a1a1a",
                    lineHeight: 1.18,
                    letterSpacing: "0.01em",
                    marginBottom: "22px",
                  }}
                >
                  {featured.title}
                </h2>

                {/* Excerpt */}
                {featured.excerpt && (
                  <p
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "0.82rem",
                      color: "#555",
                      lineHeight: 1.8,
                      fontWeight: 300,
                      marginBottom: "28px",
                    }}
                  >
                    {featured.excerpt}
                  </p>
                )}

                {/* Meta */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    marginBottom: "36px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "0.62rem",
                      fontWeight: 600,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "#3B5373",
                    }}
                  >
                    {featured.category}
                  </span>
                  <span
                    style={{
                      width: "3px",
                      height: "3px",
                      borderRadius: "50%",
                      background: "#888",
                      opacity: 0.5,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "0.72rem",
                      color: "#888",
                      fontWeight: 300,
                    }}
                  >
                    {formatDate(featured.published_at)}
                  </span>
                </div>

                {/* Read Story button */}
                <Link
                  href={`/blog/${featured.slug}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "14px",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "#1a1a1a",
                    textDecoration: "none",
                    width: "fit-content",
                  }}
                  className="read-story-btn"
                >
                  <span
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      border: "1.5px solid #1a1a1a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                      flexShrink: 0,
                      transition: "border-color 0.25s, color 0.25s",
                    }}
                  >
                    →
                  </span>
                  Read Story
                </Link>
              </div>

              {/* Right — Image */}
              <div style={{ position: "relative" }}>
                {featured.cover_image ? (
                  <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", aspectRatio: "16/10" }}>
                    <Image
                      src={featured.cover_image}
                      alt={featured.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 900px) 100vw, 55vw"
                    />
                    {/* Category badge */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "18px",
                        left: "18px",
                        background: "#fff",
                        color: "#3B5373",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "0.6rem",
                        fontWeight: 600,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        padding: "6px 14px",
                        borderRadius: "20px",
                      }}
                    >
                      {featured.category}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      aspectRatio: "16/10",
                      borderRadius: "12px",
                      background: "#f5f0e8",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: "3rem", opacity: 0.2 }}>✦</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── Filter Pills ── */}
        {posts.length > 0 && (
          <div
            style={{
              padding: "28px 0 0",
              borderTop: "1px solid #e5e5e5",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                flexWrap: "wrap",
                paddingBottom: "28px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "0.62rem",
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#888",
                  marginRight: "4px",
                  whiteSpace: "nowrap",
                }}
              >
                Filter
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "0.68rem",
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    padding: "9px 20px",
                    borderRadius: "24px",
                    border: activeFilter === cat ? "1.5px solid #3B5373" : "1.5px solid #e5e5e5",
                    background: activeFilter === cat ? "#3B5373" : "#fff",
                    color: activeFilter === cat ? "#fff" : "#999",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Latest Stories ── */}
        <section style={{ padding: "64px 0 80px" }}>
          {/* Heading + line */}
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
              Latest Stories
            </span>
            <div style={{ flex: 1, height: "1px", background: "#e5e5e5" }} />
          </div>

          {filteredPosts.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "#888",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "0.85rem",
                padding: "48px 0",
              }}
            >
              {posts.length === 0
                ? "Stories coming soon — check back shortly!"
                : "No stories in this category yet."}
            </p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "36px 28px",
              }}
              className="blog-cards-grid"
            >
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}
                  className="blog-card"
                >
                  {/* Card image */}
                  <div
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: "8px",
                      marginBottom: "18px",
                      aspectRatio: "4/3",
                    }}
                  >
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover blog-card-img"
                        sizes="(max-width: 900px) 50vw, 33vw"
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

                  {/* Category */}
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
                    {post.category}
                  </span>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.28rem",
                      fontWeight: 500,
                      color: "#1a1a1a",
                      lineHeight: 1.35,
                      letterSpacing: "0.01em",
                      marginBottom: "12px",
                      transition: "color 0.2s",
                    }}
                    className="blog-card-title"
                  >
                    {post.title}
                  </h3>

                  {/* Date */}
                  <span
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "0.65rem",
                      color: "#888",
                      fontWeight: 300,
                    }}
                  >
                    {formatDate(post.published_at)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Hover styles */}
      <style>{`
        .blog-card:hover .blog-card-title { color: #3B5373; }
        .blog-card:hover .blog-card-img { transform: scale(1.04); }
        .blog-card-img { transition: transform 0.45s ease; }
        .read-story-btn:hover { color: #3B5373 !important; }
        .read-story-btn:hover span { border-color: #3B5373 !important; color: #3B5373 !important; }
        @media (max-width: 900px) {
          .blog-cards-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .blog-cards-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
