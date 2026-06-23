import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@supabase/supabase-js";

// Always fetch fresh — ensures admin saves are instantly visible
export const dynamic = "force-dynamic";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch all layout-level settings server-side — eliminates Navbar/Footer/AnnouncementBar blink
  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { fetch: (url: RequestInfo | URL, options?: RequestInit) => fetch(url, { ...options, cache: "no-store" }) } }
  );

  const LAYOUT_KEYS = [
    // Logo
    "logo_image_url",
    // Announcement bar
    "announcement_1","announcement_2","announcement_3",
    "announcement_4","announcement_5","announcement_6",
    "announcement_speed","announcement_mode",
    // Footer
    "footer_logo_url","footer_tagline","footer_desc",
    "footer_ig_url","footer_tiktok_url","footer_fb_url",
    "footer_pinterest_url","footer_whatsapp_url",
    "footer_shop_links","footer_help_links","footer_company_links",
    "footer_copyright","footer_shop_heading","footer_help_heading","footer_company_heading",
  ];

  const [{ data: settingsRows }, { data: siteCategories }] = await Promise.all([
    sb.from("site_settings").select("key,value").in("key", LAYOUT_KEYS),
    sb.from("site_categories").select("name,slug,display_order,image_url,description")
      .eq("active", true).order("display_order"),
  ]);

  const cfg: Record<string, string> = {};
  (settingsRows ?? []).forEach((r: { key: string; value: string }) => { cfg[r.key] = r.value; });

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
          <Navbar initialSettings={cfg} initialCategories={siteCategories ?? []} />
          <main className="min-h-screen">{children}</main>
          <Footer initialSettings={cfg} />
        </CartProvider>
      </body>
    </html>
  );
}
