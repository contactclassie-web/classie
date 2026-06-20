import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Called by admin after any save — instantly clears Vercel page cache
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const secret = body.secret || request.headers.get("x-revalidate-secret");
    if (secret !== "classie-revalidate-2024") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Revalidate all user-facing pages
    const paths = [
      "/",
      "/style-ideas",
      "/collections",
      "/shop/heels",
      "/shop/clips",
      "/shop/bow",
      "/hot-deals",
      "/about",
      "/contact",
      "/faq",
    ];

    for (const path of paths) {
      revalidatePath(path);
    }

    // Also revalidate dynamic product pages
    revalidatePath("/products/[slug]", "page");
    revalidatePath("/shop/[category]", "page");

    return NextResponse.json({ revalidated: true, paths });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
