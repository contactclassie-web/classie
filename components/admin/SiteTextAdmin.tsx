"use client";

// Admin → Menu, FAQ & Legal: the extra menu links, the FAQ page and the
// Privacy / Terms / Refund pages. Each is one JSON value in site_settings.

import { useEffect, useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { loadSettingJson, saveSettingJson } from "@/lib/adminSettings";
import { Field, Panel, move, btnSm, labelCls, inputCls } from "@/components/admin/fields";
import {
  DEFAULT_FAQ, DEFAULT_NAV, DEFAULT_POLICIES, FAQ_KEY, NAV_KEY, POLICY_KEYS,
  type FaqSection, type NavLink, type NavLinks, type PolicyId, type PolicyPage,
} from "@/lib/siteContent";

export type SiteTextView = "menu" | "faq" | PolicyId;

function useSetting<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let live = true;
    loadSettingJson(key).then(({ value: v }) => {
      if (!live) return;
      if (v) setValue(v as T);
      setLoading(false);
    }).catch(() => setLoading(false));
    return () => { live = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return { value, setValue, loading };
}

function SaveBar({ onSave, onReset, saving, saved, error, url }: { onSave: () => void; onReset: () => void; saving: boolean; saved: boolean; error: string; url: string }) {
  return (
    <div className="sticky bottom-0 bg-white/95 backdrop-blur border-t border-gray-100 -mx-1 px-1 py-3 flex flex-wrap items-center gap-3">
      <button type="button" onClick={onSave} disabled={saving}
        className="flex items-center gap-2 px-5 py-2 bg-[#3B5373] text-white text-sm font-medium rounded-lg hover:bg-[#2d3f4f] disabled:opacity-60">
        <Save className="w-4 h-4" />{saving ? "Saving…" : "Save"}
      </button>
      <button type="button" onClick={onReset} className="text-xs text-gray-500 underline">Reset to default text</button>
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#3B5373] underline ml-auto">View page ↗</a>
      {saved && <span className="w-full text-xs text-green-600">Saved — live on the site in about a minute.</span>}
      {error && <span className="w-full text-xs text-red-600">{error}</span>}
    </div>
  );
}

function useSaver<T>(key: string, value: T, revalidate: () => Promise<void>) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const save = async () => {
    setSaving(true); setError(""); setSaved(false);
    try {
      await saveSettingJson(key, value);
      await revalidate();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Saving failed. Check your internet and try again.");
    }
    setSaving(false);
  };
  return { save, saving, saved, error };
}

// ── Menu ─────────────────────────────────────────────────────────────────
function LinkList({ title, links, onChange }: { title: string; links: NavLink[]; onChange: (l: NavLink[]) => void }) {
  const set = (i: number, patch: Partial<NavLink>) => onChange(links.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  return (
    <Panel title={title} open>
      {links.map((l, i) => (
        <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-end border-b border-gray-50 pb-3">
          <Field label="Text" value={l.label} onChange={(v) => set(i, { label: v })} />
          <Field label="Link" value={l.href} onChange={(v) => set(i, { href: v })} placeholder="/gift-sets" />
          <div className="flex gap-1.5 items-center">
            <label className="flex items-center gap-1.5 text-[11px] text-gray-500 mr-2" title="Hidden on small laptops so the menu does not crowd the logo. Always shown in the phone menu.">
              <input type="checkbox" checked={!!l.wide} onChange={(e) => set(i, { wide: e.target.checked })} /> Big screens only
            </label>
            <button type="button" className={btnSm} disabled={i === 0} onClick={() => onChange(move(links, i, -1))} aria-label="Move up">↑</button>
            <button type="button" className={btnSm} disabled={i === links.length - 1} onClick={() => onChange(move(links, i, 1))} aria-label="Move down">↓</button>
            <button type="button" className={btnSm} onClick={() => onChange(links.filter((_, j) => j !== i))} aria-label="Remove"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      ))}
      <button type="button" className={btnSm + " flex items-center gap-1"} onClick={() => onChange([...links, { label: "", href: "/" }])}><Plus className="w-3.5 h-3.5" /> Add link</button>
    </Panel>
  );
}

function MenuEditor({ revalidate }: { revalidate: () => Promise<void> }) {
  const { value, setValue, loading } = useSetting<NavLinks>(NAV_KEY, DEFAULT_NAV);
  const clean: NavLinks = { left: value.left.filter((l) => l.label.trim()), right: value.right.filter((l) => l.label.trim()) };
  const s = useSaver(NAV_KEY, clean, revalidate);
  if (loading) return <p className="text-sm text-gray-400">Loading…</p>;
  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-1">Top menu</h2>
        <p className="text-xs text-gray-400">The menu shows your categories first (Heels, Shoe Charms — edit them in Products → Categories), then these links. Left links sit before the logo, right links after it.</p>
      </div>
      <LinkList title="Left of the logo" links={value.left} onChange={(left) => setValue({ ...value, left })} />
      <LinkList title="Right of the logo" links={value.right} onChange={(right) => setValue({ ...value, right })} />
      <SaveBar {...s} onSave={s.save} onReset={() => setValue(DEFAULT_NAV)} url="/" />
    </div>
  );
}

// ── FAQ ──────────────────────────────────────────────────────────────────
function FaqEditor({ revalidate }: { revalidate: () => Promise<void> }) {
  const { value, setValue, loading } = useSetting<FaqSection[]>(FAQ_KEY, DEFAULT_FAQ);
  const s = useSaver(FAQ_KEY, value, revalidate);
  if (loading) return <p className="text-sm text-gray-400">Loading…</p>;
  const setSec = (i: number, sec: FaqSection) => setValue(value.map((x, j) => (j === i ? sec : x)));
  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h2 className="text-base font-semibold text-gray-800 mb-1">FAQ page</h2>
        <p className="text-xs text-gray-400">Groups of questions on www.classie.co.in/faq (also shown to Google). Write {"{free}"} for your free-delivery amount and {"{fee}"} for the delivery fee — they update from Shipping Rates.</p>
      </div>
      {value.map((sec, i) => (
        <Panel key={i} title={sec.section || "New group"} note={`${sec.items.length} questions`} open={i === 0}>
          <div className="grid grid-cols-[1fr_auto] gap-2 items-end">
            <Field label="Group name" value={sec.section} onChange={(v) => setSec(i, { ...sec, section: v })} />
            <div className="flex gap-1.5">
              <button type="button" className={btnSm} disabled={i === 0} onClick={() => setValue(move(value, i, -1))} aria-label="Move group up">↑</button>
              <button type="button" className={btnSm} disabled={i === value.length - 1} onClick={() => setValue(move(value, i, 1))} aria-label="Move group down">↓</button>
              <button type="button" className={btnSm} onClick={() => { if (confirm("Remove this whole group of questions?")) setValue(value.filter((_, j) => j !== i)); }} aria-label="Remove group"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
          {sec.items.map((it, k) => (
            <div key={k} className="border border-gray-100 rounded-xl p-3 space-y-2">
              <Field label={`Question ${k + 1}`} value={it.q} onChange={(v) => setSec(i, { ...sec, items: sec.items.map((x, j) => (j === k ? { ...x, q: v } : x)) })} />
              <Field label="Answer" area value={it.a} onChange={(v) => setSec(i, { ...sec, items: sec.items.map((x, j) => (j === k ? { ...x, a: v } : x)) })} />
              <div className="flex gap-1.5 justify-end">
                <button type="button" className={btnSm} disabled={k === 0} onClick={() => setSec(i, { ...sec, items: move(sec.items, k, -1) })} aria-label="Move up">↑</button>
                <button type="button" className={btnSm} disabled={k === sec.items.length - 1} onClick={() => setSec(i, { ...sec, items: move(sec.items, k, 1) })} aria-label="Move down">↓</button>
                <button type="button" className={btnSm} onClick={() => setSec(i, { ...sec, items: sec.items.filter((_, j) => j !== k) })} aria-label="Remove question"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
          <button type="button" className={btnSm + " flex items-center gap-1"} onClick={() => setSec(i, { ...sec, items: [...sec.items, { q: "", a: "" }] })}><Plus className="w-3.5 h-3.5" /> Add question</button>
        </Panel>
      ))}
      <button type="button" className={btnSm + " flex items-center gap-1"} onClick={() => setValue([...value, { section: "", items: [{ q: "", a: "" }] }])}><Plus className="w-3.5 h-3.5" /> Add group</button>
      <SaveBar {...s} onSave={s.save} onReset={() => { if (confirm("Replace all questions with the default text?")) setValue(DEFAULT_FAQ); }} url="/faq" />
    </div>
  );
}

// ── Privacy / Terms / Refund ─────────────────────────────────────────────
const POLICY_URL: Record<PolicyId, string> = { privacy: "/privacy-policy", terms: "/terms", refund: "/refund-policy" };

function PolicyEditor({ id, revalidate }: { id: PolicyId; revalidate: () => Promise<void> }) {
  const { value, setValue, loading } = useSetting<PolicyPage>(POLICY_KEYS[id], DEFAULT_POLICIES[id]);
  const s = useSaver(POLICY_KEYS[id], value, revalidate);
  if (loading) return <p className="text-sm text-gray-400">Loading…</p>;
  const setSec = (i: number, patch: Partial<PolicyPage["sections"][number]>) =>
    setValue({ ...value, sections: value.sections.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
  return (
    <div className="space-y-5 max-w-3xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Page title" value={value.title} onChange={(v) => setValue({ ...value, title: v })} />
        <Field label="Last updated" value={value.updated} onChange={(v) => setValue({ ...value, updated: v })} placeholder="October 2026" hint="Change this when you change the text." />
      </div>
      {value.sections.map((sec, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2">
          <Field label={`Heading ${i + 1}`} value={sec.title} onChange={(v) => setSec(i, { title: v })} />
          <label className="block">
            <span className={labelCls}>Text</span>
            <textarea rows={4} value={sec.body} onChange={(e) => setSec(i, { body: e.target.value })} className={inputCls + " resize-y"} />
          </label>
          <div className="flex gap-1.5 justify-end">
            <button type="button" className={btnSm} disabled={i === 0} onClick={() => setValue({ ...value, sections: move(value.sections, i, -1) })} aria-label="Move up">↑</button>
            <button type="button" className={btnSm} disabled={i === value.sections.length - 1} onClick={() => setValue({ ...value, sections: move(value.sections, i, 1) })} aria-label="Move down">↓</button>
            <button type="button" className={btnSm} onClick={() => setValue({ ...value, sections: value.sections.filter((_, j) => j !== i) })} aria-label="Remove part"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      ))}
      <button type="button" className={btnSm + " flex items-center gap-1"} onClick={() => setValue({ ...value, sections: [...value.sections, { title: "", body: "" }] })}><Plus className="w-3.5 h-3.5" /> Add part</button>
      <SaveBar {...s} onSave={s.save} onReset={() => { if (confirm("Replace this page with the default text?")) setValue(DEFAULT_POLICIES[id]); }} url={POLICY_URL[id]} />
    </div>
  );
}

export default function SiteTextAdmin({ view, revalidate }: { view: SiteTextView; revalidate: () => Promise<void> }) {
  if (view === "menu") return <MenuEditor revalidate={revalidate} />;
  if (view === "faq") return <FaqEditor revalidate={revalidate} />;
  return <PolicyEditor key={view} id={view} revalidate={revalidate} />;
}
