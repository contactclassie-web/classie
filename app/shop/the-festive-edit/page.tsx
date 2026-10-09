import { Metadata } from "next";
import { notFound } from "next/navigation";
import EditView from "@/components/shop/EditView";
import { listingJsonLd, loadEdit } from "@/lib/shopListingServer";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/shop/the-festive-edit" },
  title: "Wedding & Festive Heels and Shoe Charms — The Festive Edit",
  description: "Heels with crystal shoe clips for weddings, sangeet, mehendi and Diwali, by CLASSIE. COD and free delivery across India.",
};

export default async function FestiveEditPage() {
  const edit = await loadEdit("the-festive-edit");
  if (!edit) notFound();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: listingJsonLd(edit.title || "The Festive Edit", "/shop/the-festive-edit", edit.products) }} />
      <EditView {...edit} title={edit.title || "The Festive Edit"} fallbackSub="Celebrate in style" />
    </>
  );
}
