import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const revalidate = 3600;

export async function GET() {
  const { data: products } = await sb
    .from("products")
    .select("id, title, description, slug, image, price, active, category")
    .eq("active", true);

  if (!products) {
    return new NextResponse("id,title,description,link,image_link,price,availability,condition\n", {
      headers: { "Content-Type": "text/csv" },
    });
  }

  const BASE = "https://www.classie.co.in";

  const headers = [
    "id",
    "title",
    "description",
    "link",
    "image_link",
    "price",
    "availability",
    "condition",
    "google_product_category",
    "brand",
  ].join(",");

  const rows = products.map((p) => {
    const desc = (p.description || p.title || "CLASSIE Fashion Accessories")
      .replace(/"/g, '""')
      .replace(/\n/g, " ")
      .slice(0, 500);
    const title = (p.title || "CLASSIE Product").replace(/"/g, '""');
    const link = `${BASE}/products/${p.slug}`;
    const image = p.image || "";
    const price = `${Number(p.price || 0).toFixed(2)} INR`;
    const category =
      p.category === "heels"
        ? "Apparel & Accessories > Shoes > Heels"
        : "Apparel & Accessories > Jewelry > Fashion Accessories";

    return [
      `"${p.id}"`,
      `"${title}"`,
      `"${desc}"`,
      `"${link}"`,
      `"${image}"`,
      `"${price}"`,
      `"in stock"`,
      `"new"`,
      `"${category}"`,
      `"CLASSIE"`,
    ].join(",");
  });

  const csv = [headers, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
