import { Metadata } from "next";
import { notFound } from "next/navigation";
import EditView from "@/components/shop/EditView";
import { listingJsonLd, loadEdit } from "@/lib/shopListingServer";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/shop/the-everyday-edit" },
  title: "Everyday & Office Heels and Shoe Charms — The Everyday Edit",
  description: "Comfortable block and kitten heels with easy shoe charms for office and everyday wear, by CLASSIE. COD and free delivery across India.",
};

export default async function EverydayEditPage() {
  const edit = await loadEdit("the-everyday-edit");
  if (!edit) notFound();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: listingJsonLd(edit.title || "The Everyday Edit", "/shop/the-everyday-edit", edit.products) }} />
      <EditView {...edit} title={edit.title || "The Everyday Edit"} fallbackSub="Comfort for the every-day woman" />
    </>
  );
}
