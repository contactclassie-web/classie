"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DEFAULT_SHIPPING, parseShipping, type ShippingRules } from "@/lib/shipping";
import { DEFAULT_PAYMENT, parsePayment, PAYMENT_KEYS, type PaymentRules } from "@/lib/orderTotals";

// Delivery rules from Admin → Shipping Rates, for client pages (cart, checkout).
export function useShippingRules(): ShippingRules {
  const [rules, setRules] = useState<ShippingRules>(DEFAULT_SHIPPING);
  useEffect(() => {
    let alive = true;
    supabase.from("site_settings").select("key,value").in("key", ["shipping_tiers", "shipping_default_fee"])
      .then(({ data }) => {
        if (!alive || !data) return;
        const m: Record<string, string> = {};
        data.forEach((r: { key: string; value: string }) => { m[r.key] = r.value; });
        setRules(parseShipping(m.shipping_tiers, m.shipping_default_fee));
      });
    return () => { alive = false; };
  }, []);
  return rules;
}

// Cash-on-delivery fee and limits from Admin → Shipping Rates.
export function usePaymentRules(): PaymentRules {
  const [rules, setRules] = useState<PaymentRules>(DEFAULT_PAYMENT);
  useEffect(() => {
    let alive = true;
    supabase.from("site_settings").select("key,value").in("key", [...PAYMENT_KEYS])
      .then(({ data }) => {
        if (!alive || !data) return;
        const m: Record<string, string> = {};
        data.forEach((r: { key: string; value: string }) => { m[r.key] = r.value; });
        setRules(parsePayment(m));
      });
    return () => { alive = false; };
  }, []);
  return rules;
}
