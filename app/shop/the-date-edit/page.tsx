import { Metadata } from "next";
import { notFound } from "next/navigation";
import EditView from "@/components/shop/EditView";
import { listingJsonLd, loadEdit } from "@/lib/shopListingServer";

export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/shop/the-date-edit" },
  title: "Date Night Heels & Shoe Charms — The Date Edit",
  description: "Heels and crystal shoe charms for date nights and dinners — slingbacks, sculpted heels and sparkle clips by CLASSIE. COD and free delivery across India.",
};

export default async function DateEditPage() {
  const edit = await loadEdit("the-date-edit");
  if (!edit) notFound();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: listingJsonLd(edit.title || "The Date Edit", "/shop/the-date-edit", edit.products) }} />
      <EditView {...edit} title={edit.title || "The Date Edit"} fallbackSub="Dressed to impress, effortlessly" />
    </>
  );
}
