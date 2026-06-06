import { notFound } from "next/navigation";
import { Metadata } from "next";
import { products, getProductBySlugFromDB, getProductsFromDB } from "@/lib/products";
import ProductDetailClient from "./ProductDetailClient";

export const revalidate = 60;
export const dynamicParams = true;

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  // Pre-generate pages for all hardcoded products at build time.
  // New DB-only products are handled on-demand via dynamicParams = true.
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlugFromDB(params.slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlugFromDB(params.slug);
  if (!product) notFound();

  // Related products (same collection, exclude self)
  const allProducts = await getProductsFromDB({ active: true });
  const related = allProducts
    .filter((p) => p.collection === product.collection && p.slug !== product.slug)
    .slice(0, 4);

  return <ProductDetailClient product={product} related={related} />;
}
