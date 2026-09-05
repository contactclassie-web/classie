"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

// Mounted once in the root layout. Logs page views (for the Admin > Live Tracker
// dashboard) and catches otherwise-invisible client-side errors so they show up
// there too, instead of only ever being visible in a visitor's own browser console.
export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    track({ type: "page_view", path: pathname });
  }, [pathname]);

  useEffect(() => {
    const onError = (e: ErrorEvent) => {
      track({ type: "error", message: e.message?.slice(0, 500) || "Unknown error", path: window.location.pathname });
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      const reason = e.reason instanceof Error ? e.reason.message : String(e.reason);
      track({ type: "error", message: `Unhandled rejection: ${reason}`.slice(0, 500), path: window.location.pathname });
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
