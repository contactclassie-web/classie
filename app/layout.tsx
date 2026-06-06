import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import LuxuryCursor from "@/components/LuxuryCursor";

export const metadata: Metadata = {
  title: {
    default: "Classie — Premium Women's Heels & Accessories",
    template: "%s | Classie",
  },
  description:
    "Shop premium women's heels, block heels, stilettos and shoe accessories. Free shipping above ₹999. COD available. Shop Classie — where comfort meets luxury.",
  keywords: ["women heels", "block heels", "shoe clips", "accessories", "classie"],
  openGraph: {
    title: "Classie — Premium Women's Heels & Accessories",
    description: "Shop premium women's heels and shoe accessories. Free shipping above ₹999.",
    url: "https://classie.co.in",
    siteName: "Classie",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Serif+Display:ital@0;1&family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
          <LuxuryCursor />
        </CartProvider>
      </body>
    </html>
  );
}
