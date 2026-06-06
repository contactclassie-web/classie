import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import CollectionGrid from "@/components/CollectionGrid";
import { getProductsFromDB } from "@/lib/products";

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

async function getCollectionData(slug: string) {
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Get collection info
  const { data: col } = await sb
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!col) return null;

  // Get linked product slugs
  const { data: links } = await sb
    .from("collection_products")
    .select("product_slug, display_order")
    .eq("collection_id", col.id)
    .order("display_order", { ascending: true });

  return { col, productSlugs: (links ?? []).map((l: { product_slug: string }) => l.product_slug) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getCollectionData(params.slug);
  if (!data) return { title: "Collection" };
  return {
    title: data.col.title,
    description: data.col.description ?? `Shop ${data.col.title} at Classie`,
  };
}

export default async function DynamicCollectionPage({ params }: Props) {
  const data = await getCollectionData(params.slug);
  if (!data) notFound();

  const { col, productSlugs } = data;

  // Get all active products then filter by linked slugs
  const allProducts = await getProductsFromDB({ active: true });
  const products = productSlugs.length > 0
    ? productSlugs
        .map((s) => allProducts.find((p) => p.slug === s))
        .filter(Boolean) as typeof allProducts
    : allProducts; // show all if no links set

  return (
    <>
      {/* Editorial page header */}
      <div className="bg-[#faf8f6] py-16 text-center border-b border-gray-100">
        <p className="text-[11px] tracking-[0.5em] uppercase text-gray-400 mb-3">Collections</p>
        <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-[#1a1a1a]">{col.title}</h1>
        {col.description && (
          <p className="text-sm text-gray-400 mt-3 tracking-wide">{col.description}</p>
        )}
      </div>

      <CollectionGrid
        title={col.title}
        products={products}

      />
    </>
  );
}
