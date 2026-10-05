"use client";

import { useCallback, useEffect, useState } from "react";
import { adminSupabase as supabase } from "@/lib/adminSupabase";
import { loadSettingJson, saveSettingJson } from "@/lib/adminSettings";
import { CUSTOM_PAGE_KEY, DEFAULT_CUSTOM_PAGE, REQUEST_TAG, mergeCustomPage, type CustomPageConfig } from "@/lib/customDesigns";
import { Field, MediaField, Panel, move, btnSm } from "@/components/admin/fields";

type View = "requests" | "page";

interface RequestRow { id: string; first_name: string; email: string; phone: string; message: string; created_at: string }

function waLink(phone: string) {
  let d = phone.replace(/\D/g, "");
  if (d.length === 10) d = "91" + d;
  return `https://wa.me/${d}`;
}

function Requests() {
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: e } = await supabase.from("contact_submissions")
      .select("id,first_name,email,phone,message,created_at")
      .ilike("message", `${REQUEST_TAG}%`)
      .order("created_at", { ascending: false })
      .limit(200);
    setError(e ? e.message : "");
    setRows((data ?? []) as RequestRow[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="max-w-3xl space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-gray-700 text-lg">Custom design requests</h2>
          <p className="text-sm text-gray-500">Sent from the form on <a href="/custom-designs" target="_blank" rel="noopener noreferrer" className="text-[#3B5373] underline">/custom-designs</a>. They also appear in Messages and are emailed to you.</p>
        </div>
        <button type="button" className={btnSm} onClick={load}>Refresh</button>
      </div>
      {loading && <p className="text-gray-400 text-sm">Loading…</p>}
      {error && <p className="text-red-600 text-sm">Couldn&apos;t load requests: {error}</p>}
      {!loading && !error && rows.length === 0 && (
        <p className="text-sm text-gray-500 bg-white rounded-2xl border border-gray-100 p-6">No requests yet. They&apos;ll show here as soon as someone sends the form.</p>
      )}
      {rows.map((r) => {
        const body = r.message.replace(REQUEST_TAG, "").trim();
        return (
          <article key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <b className="text-gray-800">{r.first_name}</b>
              <span className="text-xs text-gray-400">{new Date(r.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>
              <span className="ml-auto flex flex-wrap gap-2">
                {r.phone && <a href={waLink(r.phone)} target="_blank" rel="noopener noreferrer" className="text-xs bg-[#1E7A4C] text-white rounded-md px-3 py-1.5">WhatsApp {r.phone}</a>}
                {r.email && <a href={`mailto:${r.email}`} className={btnSm}>{r.email}</a>}
              </span>
            </div>
            <pre className="whitespace-pre-wrap break-words font-sans text-sm text-gray-700 bg-gray-50 rounded-xl p-3">{body}</pre>
          </article>
        );
      })}
    </div>
  );
}

function PageEditor({ revalidate }: { revalidate: () => Promise<void> }) {
  const [cfg, setCfg] = useState<CustomPageConfig>(DEFAULT_CUSTOM_PAGE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [neverSaved, setNeverSaved] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    loadSettingJson(CUSTOM_PAGE_KEY).then((s) => { setCfg(mergeCustomPage(s.value)); setNeverSaved(!s.exists); setLoading(false); });
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const up = <K extends keyof CustomPageConfig>(k: K, patch: Partial<CustomPageConfig[K]> | CustomPageConfig[K]) => {
    setCfg((c) => ({ ...c, [k]: typeof patch === "object" && !Array.isArray(patch) ? { ...(c[k] as object), ...patch } : patch }));
    setDirty(true); setStatus(null);
  };

  const save = async () => {
    setSaving(true);
    try {
      await saveSettingJson(CUSTOM_PAGE_KEY, cfg);
      await revalidate();
      setDirty(false); setNeverSaved(false);
      setStatus({ ok: true, msg: "Saved. The Custom Designs page is updated." });
    } catch (e) {
      setStatus({ ok: false, msg: `Not saved: ${e instanceof Error ? e.message : "please try again"}` });
    } finally { setSaving(false); }
  };

  if (loading) return <p className="text-gray-400 text-sm">Loading…</p>;
  const { hero, make, steps, perk, form, faq } = cfg;

  return (
    <div className="max-w-3xl space-y-5 pb-24">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-2">
        <h2 className="font-semibold text-gray-700 text-lg">Custom Designs page</h2>
        <p className="text-sm text-gray-500">All text and photos on <a href="/custom-designs" target="_blank" rel="noopener noreferrer" className="text-[#3B5373] underline">/custom-designs</a>. Photos are added by pasting their link.</p>
        {neverSaved && <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">Not saved yet: the page is showing the default text below.</p>}
      </div>

      <Panel title="Top of the page" open>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Small line above" value={hero.eyebrow} onChange={(v) => up("hero", { eyebrow: v })} />
          <Field label="Heading" value={hero.heading} onChange={(v) => up("hero", { heading: v })} />
          <Field label="Heading italic part" value={hero.headingItalic} onChange={(v) => up("hero", { headingItalic: v })} />
        </div>
        <Field label="Text" area value={hero.text} onChange={(v) => up("hero", { text: v })} />
        <div className="grid sm:grid-cols-2 gap-3">
          <MediaField label="Sketch photo (empty = drawn sketch)" value={hero.sketchImage} onChange={(v) => up("hero", { sketchImage: v })} />
          <MediaField label="Finished clip photo" value={hero.productImage} onChange={(v) => up("hero", { productImage: v })} />
          <Field label="Main button text" value={hero.buttonText} onChange={(v) => up("hero", { buttonText: v })} />
          <Field label="WhatsApp button text" value={hero.whatsappText} onChange={(v) => up("hero", { whatsappText: v })} />
        </div>
        <Field label="WhatsApp link" value={cfg.whatsappUrl} onChange={(v) => { setCfg((c) => ({ ...c, whatsappUrl: v })); setDirty(true); }}
          placeholder="https://wa.me/91XXXXXXXXXX" hint="Empty = the WhatsApp link from Footer settings" />
      </Panel>

      <Panel title="What we can make" note={`${make.items.length} items`}>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Heading" value={make.heading} onChange={(v) => up("make", { heading: v })} />
          <Field label="Heading italic part" value={make.headingItalic} onChange={(v) => up("make", { headingItalic: v })} />
        </div>
        {make.items.map((m, i) => {
          const setM = (p: Partial<typeof m>) => up("make", { items: make.items.map((x, k) => (k === i ? { ...x, ...p } : x)) });
          return (
            <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex gap-1 justify-end">
                <button type="button" className={btnSm} disabled={i === 0} onClick={() => up("make", { items: move(make.items, i, -1) })}>↑</button>
                <button type="button" className={btnSm} onClick={() => up("make", { items: make.items.filter((_, k) => k !== i) })}>Remove</button>
              </div>
              <MediaField label="Photo (empty = drawn sketch)" value={m.image} onChange={(v) => setM({ image: v })} />
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Title" value={m.title} onChange={(v) => setM({ title: v })} />
                <Field label="Small text" value={m.sub} onChange={(v) => setM({ sub: v })} />
              </div>
            </div>
          );
        })}
        {make.items.length < 8 && <button type="button" className={btnSm} onClick={() => up("make", { items: [...make.items, { image: "", title: "", sub: "" }] })}>+ Add item</button>}
      </Panel>

      <Panel title="How it works" note={`${steps.items.length} steps`}>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Heading" value={steps.heading} onChange={(v) => up("steps", { heading: v })} />
          <Field label="Heading italic part" value={steps.headingItalic} onChange={(v) => up("steps", { headingItalic: v })} />
        </div>
        {steps.items.map((s, i) => (
          <div key={i} className="grid sm:grid-cols-[1fr_2fr_auto] gap-3 items-end">
            <Field label={`Step ${i + 1}`} value={s.title} onChange={(v) => up("steps", { items: steps.items.map((x, k) => (k === i ? { ...x, title: v } : x)) })} />
            <Field label="Text" value={s.text} onChange={(v) => up("steps", { items: steps.items.map((x, k) => (k === i ? { ...x, text: v } : x)) })} />
            <button type="button" className={`${btnSm} mb-1.5`} onClick={() => up("steps", { items: steps.items.filter((_, k) => k !== i) })}>Remove</button>
          </div>
        ))}
        {steps.items.length < 6 && <button type="button" className={btnSm} onClick={() => up("steps", { items: [...steps.items, { title: "", text: "" }] })}>+ Add step</button>}
      </Panel>

      <Panel title="Your design could join our collection" note={perk.on ? "On" : "Off"}>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={perk.on} onChange={(e) => up("perk", { on: e.target.checked })} /> Show this band
        </label>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Small line above" value={perk.eyebrow} onChange={(v) => up("perk", { eyebrow: v })} />
          <Field label="Heading" value={perk.heading} onChange={(v) => up("perk", { heading: v })} />
          <Field label="Heading italic part" value={perk.headingItalic} onChange={(v) => up("perk", { headingItalic: v })} />
        </div>
        <Field label="Text" area value={perk.text} onChange={(v) => up("perk", { text: v })} />
        <Field label="Small print" value={perk.small} onChange={(v) => up("perk", { small: v })} />
      </Panel>

      <Panel title="Design form">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Heading" value={form.heading} onChange={(v) => up("form", { heading: v })} />
          <Field label="Heading italic part" value={form.headingItalic} onChange={(v) => up("form", { headingItalic: v })} />
        </div>
        <Field label="Intro text" area value={form.intro} onChange={(v) => up("form", { intro: v })} />
        <Field label="'What should we make?' choices" value={form.makeOptions} onChange={(v) => up("form", { makeOptions: v })} hint="Separate with commas" />
        <Field label="'Metal & stones' choices" value={form.metalOptions} onChange={(v) => up("form", { metalOptions: v })} hint="Separate with semicolons ( ; )" />
        <Field label="Collection checkbox text" area value={form.consentText} onChange={(v) => up("form", { consentText: v })} />
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Button text" value={form.buttonText} onChange={(v) => up("form", { buttonText: v })} />
          <Field label="Message after sending" value={form.successText} onChange={(v) => up("form", { successText: v })} />
        </div>
        <Field label="Note under the form" value={form.replyNote} onChange={(v) => up("form", { replyNote: v })} />
      </Panel>

      <Panel title="Questions (FAQ)" note={`${faq.items.length} questions`}>
        <Field label="Heading" value={faq.heading} onChange={(v) => up("faq", { heading: v })} />
        {faq.items.map((x, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
            <div className="flex gap-1 justify-end">
              <button type="button" className={btnSm} disabled={i === 0} onClick={() => up("faq", { items: move(faq.items, i, -1) })}>↑</button>
              <button type="button" className={btnSm} onClick={() => up("faq", { items: faq.items.filter((_, k) => k !== i) })}>Remove</button>
            </div>
            <Field label="Question" value={x.q} onChange={(v) => up("faq", { items: faq.items.map((y, k) => (k === i ? { ...y, q: v } : y)) })} />
            <Field label="Answer" area value={x.a} onChange={(v) => up("faq", { items: faq.items.map((y, k) => (k === i ? { ...y, a: v } : y)) })} />
          </div>
        ))}
        {faq.items.length < 12 && <button type="button" className={btnSm} onClick={() => up("faq", { items: [...faq.items, { q: "", a: "" }] })}>+ Add question</button>}
      </Panel>

      <Panel title="Google (SEO)">
        <Field label="Page title" value={cfg.seoTitle} onChange={(v) => { setCfg((c) => ({ ...c, seoTitle: v })); setDirty(true); }} />
        <Field label="Description" area value={cfg.seoDescription} onChange={(v) => { setCfg((c) => ({ ...c, seoDescription: v })); setDirty(true); }} />
      </Panel>

      <div className="sticky bottom-4 z-10">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg px-5 py-3 flex flex-wrap items-center gap-3">
          <span className={`text-sm ${status ? (status.ok ? "text-emerald-600" : "text-red-600") : dirty ? "text-amber-600" : "text-gray-400"}`}>
            {status ? status.msg : dirty ? "You have unsaved changes" : "All changes saved"}
          </span>
          <a href="/custom-designs" target="_blank" rel="noopener noreferrer" className="ml-auto text-sm text-[#3B5373] underline">View page</a>
          <button type="button" onClick={save} disabled={saving || (!dirty && !neverSaved)}
            className="bg-[#3B5373] text-white text-sm font-medium px-5 py-2 rounded-lg disabled:opacity-40">
            {saving ? "Saving…" : "Save page"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CustomDesignsAdmin({ view, revalidate }: { view: View; revalidate: () => Promise<void> }) {
  return view === "requests" ? <Requests /> : <PageEditor revalidate={revalidate} />;
}
