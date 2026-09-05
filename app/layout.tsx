import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import { WishlistProvider } from "@/components/WishlistContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { createClient } from "@supabase/supabase-js";
import Script from "next/script";
import { Cormorant_Garamond, Poppins } from "next/font/google";

// Self-hosted fonts — zero render-blocking, loaded at build time
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: true,
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
});

// Always fetch fresh — ensures admin saves are instantly visible
export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "CLASSIE — Women's Heels, Shoe Clips & Accessories India",
    template: "%s | CLASSIE",
  },
  description:
    "Shop CLASSIE — premium women's heels and shoe clips online in India. Block heels, slingback heels, rhinestone shoe clips, bow clips and shoe charms. Free shipping above ₹499. COD available.",
  keywords: ["shoe clips", "bow clips", "women's heels india", "block heels", "shoe charms india", "shoe accessories for women", "shoe clips india", "classie"],
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon.png",
  },
  openGraph: {
    title: "CLASSIE — Women's Heels & Shoe Clips India",
    description: "Premium women's heels and shoe clips online in India. Free shipping. COD available.",
    url: "https://www.classie.co.in",
    siteName: "CLASSIE",
    type: "website",
    images: [{ url: "https://www.classie.co.in/icon.png", width: 512, height: 512 }],
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
        {/* Pinterest Domain Verification */}
        <meta name="p:domain_verify" content="732fb204a223225d01894e59b6f6cfce" />
        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-YMZB85JRX4" strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-YMZB85JRX4');
        `}</Script>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://hrjvxwqvxvibtwyfoyca.supabase.co" />
      </head>
      <body className={`${cormorant.variable} ${poppins.variable}`}>
        <AnalyticsTracker />
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
