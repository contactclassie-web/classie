import { publicSupabase } from "@/lib/supabasePublic";

/** One JSON value from site_settings (edited in admin), or the fallback. */
export async function loadJsonSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const { data } = await publicSupabase(60).from("site_settings").select("value").eq("key", key).maybeSingle();
    if (!data?.value) return fallback;
    const parsed = JSON.parse(data.value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}
