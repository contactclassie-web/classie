import type { SupabaseClient } from "@supabase/supabase-js";
import { INVENTORY_KEY, NO_VARIANT, parseInventory } from "@/lib/inventory";

// Takes sold quantities off the stock in site_settings → inventory_v1 after an
// order is saved. Only tracked numbers change; untracked products stay unlimited.
// A gift-set part without a colour is taken from the colour with the most stock.
export async function deductStock(sb: SupabaseClient, use: Record<string, Record<string, number>>): Promise<void> {
  const { data } = await sb.from("site_settings").select("value").eq("key", INVENTORY_KEY).maybeSingle();
  const inv = parseInventory(data?.value);
  let changed = false;
  for (const [slug, byVariant] of Object.entries(use)) {
    const row = inv[slug];
    if (!row) continue;
    for (const [variant, qty] of Object.entries(byVariant)) {
      let key = Object.keys(row).find((k) => k.trim().toLowerCase() === (variant || NO_VARIANT).trim().toLowerCase());
      if (!key && !variant) key = Object.keys(row).sort((a, b) => row[b] - row[a])[0];
      if (!key || typeof row[key] !== "number") continue;
      row[key] = Math.max(0, row[key] - qty);
      changed = true;
    }
  }
  if (!changed) return;
  const { error } = await sb.from("site_settings").update({ value: JSON.stringify(inv) }).eq("key", INVENTORY_KEY);
  if (error) console.error("Stock update failed:", error);
}
