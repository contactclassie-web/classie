import { supabase } from "@/lib/supabase";

// Read/write one JSON value in site_settings (used by the admin page builders).
export async function loadSettingJson(key: string): Promise<{ value: unknown; exists: boolean }> {
  const { data } = await supabase.from("site_settings").select("value").eq("key", key).maybeSingle();
  if (!data?.value) return { value: null, exists: false };
  try { return { value: JSON.parse(data.value), exists: true }; } catch { return { value: null, exists: true }; }
}

export async function saveSettingJson(key: string, value: unknown): Promise<void> {
  const del = await supabase.from("site_settings").delete().eq("key", key);
  if (del.error) throw del.error;
  const ins = await supabase.from("site_settings").insert({ key, value: JSON.stringify(value) });
  if (ins.error) throw ins.error;
}
