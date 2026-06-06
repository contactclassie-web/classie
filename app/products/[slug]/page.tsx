import { notFound } from "next/navigation";
import { Metadata } from "next";
import { products, getProductBySlug } from "@/lib/products";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.title,
    description: product.description,
    openGraph: {
      images: [{ url: product.image }],
    },
  };
}

export default function ProductPage({ params }: Props) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  // Related products (same collection, exclude self)
  const related = products
    .filter((p) => p.collection === product.collection && p.slug !== product.slug)
    .slice(0, 4);

  return <ProductDetailClient product={product} related={related} />;
}
