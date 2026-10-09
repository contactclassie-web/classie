"use client";

// Generic editor for the new page layouts (Heels, Shoe Charms, Collections).
// Every field of every group is one site_settings row; empty = default text.

import { useCallback, useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";
import { adminSupabase as supabase } from "@/lib/adminSupabase";
import type { PageGroup } from "@/lib/shopPageContent";
import { MediaField, inputCls, labelCls } from "@/components/admin/fields";

export default function PageContentEditor({ title, intro, groups, viewUrl, revalidate }: {
  title: string;
  intro: string;
  groups: PageGroup[];
  viewUrl: string;
  revalidate: () => Promise<void>;
}) {
  const keys = useMemo(() => groups.flatMap((g) => g.fields.map((f) => f.key)), [groups]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: e } = await supabase.from("site_settings").select("key,value").in("key", keys);
    if (e) setError("Could not load the saved texts. Refresh the page and try again.");
    const m: Record<string, string> = {};
    (data ?? []).forEach((r: { key: string; value: string }) => { m[r.key] = r.value ?? ""; });
    setValues(m);
    setLoading(false);
  }, [keys]);

  useEffect(() => { load(); }, [load]);

  const saveGroup = async (g: PageGroup) => {
    setSaving(g.id);
    setError("");
    try {
      for (const f of g.fields) {
        const value = (values[f.key] ?? "").trim();
        const del = await supabase.from("site_settings").delete().eq("key", f.key);
        if (del.error) throw del.error;
        if (value !== "") {
          const ins = await supabase.from("site_settings").insert({ key: f.key, value });
          if (ins.error) throw ins.error;
        }
      }
      await revalidate();
      setSaved(g.id);
      setTimeout(() => setSaved((x) => (x === g.id ? null : x)), 3000);
    } catch {
      setError("Saving failed. Check your internet and try again.");
    }
    setSaving(null);
  };

  const set = (key: string, v: string) => setValues((prev) => ({ ...prev, [key]: v }));

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-1">{title}</h2>
        <p className="text-xs text-gray-400">{intro} Leave a box empty to use the default shown in grey. Photos: paste a Cloudinary link.</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {groups.map((g) => (
            <a key={g.id} href={`#pc-${g.id}`} className="text-[11px] px-2.5 py-1 rounded-full border border-gray-200 text-gray-600 hover:border-[#3B5373] hover:text-[#3B5373]">{g.label}</a>
          ))}
          <a href={viewUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] px-2.5 py-1 rounded-full bg-[#3B5373] text-white">View page ↗</a>
        </div>
        {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : groups.map((g) => (
        <div key={g.id} id={`pc-${g.id}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 scroll-mt-24">
          <div>
            <p className="text-sm font-semibold text-[#3B5373]">{g.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{g.note}</p>
          </div>
          {g.fields.map((f) => {
            const val = values[f.key] ?? "";
            if (f.type === "image") {
              return (
                <div key={f.key}>
                  <MediaField label={f.label} value={val} onChange={(v) => set(f.key, v)} hint={f.hint} />
                  {!val && f.def && <p className="text-[10px] text-gray-400 mt-1 ml-[76px]">Now showing the default photo.</p>}
                </div>
              );
            }
            if (f.type === "select") {
              return (
                <div key={f.key}>
                  <label className={labelCls}>{f.label}</label>
                  <select value={val || f.def} onChange={(e) => set(f.key, e.target.value)} className={inputCls}>
                    {(f.options ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  {f.hint && <p className="text-[10px] text-gray-400 mt-1">{f.hint}</p>}
                </div>
              );
            }
            return (
              <div key={f.key}>
                <label className={labelCls}>{f.label}</label>
                {f.type === "textarea"
                  ? <textarea rows={4} value={val} onChange={(e) => set(f.key, e.target.value)} placeholder={f.def} className={inputCls + " resize-y"} />
                  : <input type="text" value={val} onChange={(e) => set(f.key, e.target.value)} placeholder={f.def} className={inputCls} />}
                {f.hint && <p className="text-[10px] text-gray-400 mt-1">{f.hint}</p>}
              </div>
            );
          })}
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => saveGroup(g)} disabled={saving === g.id}
              className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] transition-colors disabled:opacity-60">
              <Save className="w-4 h-4" />{saving === g.id ? "Saving…" : "Save"}
            </button>
            {saved === g.id && <span className="text-xs text-green-600">Saved — live on the site in about a minute.</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
