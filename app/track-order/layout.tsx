import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Track your CLASSIE order with your order ID and phone number.",
  alternates: { canonical: "/track-order" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
