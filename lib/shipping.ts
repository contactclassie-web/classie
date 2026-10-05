// Delivery charge rules from Admin → Shipping Rates (site_settings
// "shipping_tiers" + "shipping_default_fee"). Shared by the cart, checkout,
// product pages and the order API so every place charges the same.

export interface ShippingTier { threshold: number; fee: number }
export interface ShippingRules { tiers: ShippingTier[]; defaultFee: number }

export const DEFAULT_SHIPPING: ShippingRules = { tiers: [{ threshold: 999, fee: 99 }], defaultFee: 0 };

export function parseShipping(tiersJson?: string | null, defaultFee?: string | null): ShippingRules {
  let tiers = DEFAULT_SHIPPING.tiers;
  if (tiersJson) {
    try {
      const parsed = JSON.parse(tiersJson);
      if (Array.isArray(parsed) && parsed.length) {
        tiers = parsed
          .map((t: { threshold?: unknown; fee?: unknown }) => ({ threshold: Number(t.threshold) || 0, fee: Number(t.fee) || 0 }))
          .sort((a, b) => a.threshold - b.threshold);
      }
    } catch { /* keep defaults */ }
  }
  const fee = defaultFee != null && defaultFee !== "" ? Number(defaultFee) || 0 : DEFAULT_SHIPPING.defaultFee;
  return { tiers, defaultFee: fee };
}

// Fee for an order subtotal: the first tier whose threshold is above it,
// otherwise the default fee (0 = free).
export function shippingFee(subtotal: number, rules: ShippingRules): number {
  const tier = rules.tiers.find((t) => subtotal < t.threshold);
  return tier ? tier.fee : rules.defaultFee;
}

// Smallest order value that ships free (null if nothing ships free).
export function freeShippingFrom(rules: ShippingRules): number | null {
  if (rules.defaultFee > 0) return null;
  return rules.tiers.length ? Math.max(...rules.tiers.map((t) => t.threshold)) : 0;
}
