import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Shoe Clips, Heels, Delivery & Returns",
  description: "Answers about CLASSIE shoe clips and heels: how clips attach, sizes, delivery time, cash on delivery, returns and exchanges.",
  alternates: { canonical: "/faq" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
