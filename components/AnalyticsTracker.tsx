"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

// Mounted once in the root layout. Logs page views (for the Admin > Live Tracker
// dashboard) and catches otherwise-invisible client-side errors so they show up
// there too, instead of only ever being visible in a visitor's own browser console.
// Errors thrown by the Instagram/Facebook in-app browser's own code, not ours.
// They fire when the visitor leaves the page and don't affect the store.
const NOT_OURS = /Java object is gone|Java bridge method invocation error/i;

export default function AnalyticsTracker() {
  const pathname = usePathname();
  // The admin panel isn't a customer visiting the store — never let admin's own
  // usage inflate the Live Tracker numbers it displays.
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    track({ type: "page_view", path: pathname });
  }, [pathname, isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    const onError = (e: ErrorEvent) => {
      if (NOT_OURS.test(e.message || "")) return;
      track({ type: "error", message: e.message?.slice(0, 500) || "Unknown error", path: window.location.pathname });
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      const reason = e.reason instanceof Error ? e.reason.message : String(e.reason);
      if (NOT_OURS.test(reason)) return;
      track({ type: "error", message: `Unhandled rejection: ${reason}`.slice(0, 500), path: window.location.pathname });
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, [isAdmin]);

  return null;
}
