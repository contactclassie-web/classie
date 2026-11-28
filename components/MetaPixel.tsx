"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { META_PIXEL_ID, track } from "@/lib/metaPixel";

// Mounted once in the root layout. Loads the Meta Pixel base code (which sends the
// first PageView) and sends PageView again on every client-side page change.
// Skips the admin panel, like AnalyticsTracker. Loads nothing without a Pixel ID.
export default function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAdmin = pathname?.startsWith("/admin");
  const url = `${pathname}?${searchParams?.toString() ?? ""}`;
  const lastUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!META_PIXEL_ID || isAdmin) return;
    // First page: the base code below already sends PageView.
    if (lastUrl.current === null) { lastUrl.current = url; return; }
    if (lastUrl.current === url) return;
    lastUrl.current = url;
    track("PageView");
  }, [url, isAdmin]);

  if (!META_PIXEL_ID || isAdmin) return null;

  return (
    <Script id="meta-pixel" strategy="afterInteractive">{`
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
      document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${META_PIXEL_ID.replace(/[^0-9]/g, "")}');
      fbq('track', 'PageView');
      (window.__fbqPending || []).forEach(function (a) { fbq.apply(null, a); });
      window.__fbqPending = [];
    `}</Script>
  );
}
