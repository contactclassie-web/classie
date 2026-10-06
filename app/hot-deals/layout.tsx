import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hot Deals & Coupon Codes",
  description: "Current CLASSIE offers and coupon codes on shoe clips, shoe charms and heels.",
  alternates: { canonical: "/hot-deals" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
