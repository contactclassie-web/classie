import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";

// Called by admin after any save — instantly clears Vercel page cache
export async function POST(request: NextRequest) {
  try {
    if (!isAdminRequest(request)) {
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
      "/gift-sets",
      "/custom-designs",
    ];

    for (const path of paths) {
      revalidatePath(path);
    }

    // Also revalidate dynamic product + blog pages
    revalidatePath("/products/[slug]", "page");
    revalidatePath("/shop/[slug]", "page");
    revalidatePath("/blog", "page");
    revalidatePath("/blog/[slug]", "page");
    revalidatePath("/gift-sets/[slug]", "page");

    return NextResponse.json({ revalidated: true, paths });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
