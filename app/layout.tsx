import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import { WishlistProvider } from "@/components/WishlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@supabase/supabase-js";
import Script from "next/script";

// Always fetch fresh — ensures admin saves are instantly visible
export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "CLASSIE — Shoe Clips, Bow Clips & Accessories for Women",
    template: "%s | CLASSIE",
  },
  description:
    "Shop handcrafted shoe clips, bow clips, rhinestone clips and shoe accessories for women in India. Transform any pair of heels, flats or sandals instantly. Free shipping above ₹499. COD available.",
  keywords: ["shoe clips", "bow clips", "bow clips for shoes", "rhinestone shoe clips", "shoe accessories for women", "shoe clips india", "classie"],
  openGraph: {
    title: "CLASSIE — Shoe Clips & Accessories for Women",
    description: "Handcrafted shoe clips, bow clips & rhinestone accessories. Transform any shoe instantly.",
    url: "https://classie.co.in",
    siteName: "CLASSIE",
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
    process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

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
        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-YMZB85JRX4" strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-YMZB85JRX4');
        `}</Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://hrjvxwqvxvibtwyfoyca.supabase.co" />
        {/* Fonts loaded non-blocking — swap prevents render-blocking */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
          media="print"
          // @ts-ignore
          onLoad="this.media='all'"
        />
      </head>
      <body>
        <CartProvider>
          <WishlistProvider>
            <Navbar initialSettings={cfg} initialCategories={siteCategories ?? []} />
            <main className="min-h-screen">{children}</main>
            <Footer initialSettings={cfg} />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
