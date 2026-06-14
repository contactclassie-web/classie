import { Metadata } from "next";
import { getHeelsForPageFromDB } from "@/lib/products";
import HeelsPageClient from "@/components/HeelsPageClient";

export const revalidate = 0; // always fresh — no cache

export const metadata: Metadata = {
  title: "Women's Heels — Classie",
  description:
    "Shop Classie's premium collection of women's heels — block heels, sculpted heels, slim heels, slingbacks & more. Free shipping above ₹999. COD available.",
};

export default async function HeelsPage() {
  const products = await getHeelsForPageFromDB();
  return <HeelsPageClient initialProducts={products} />;
}
