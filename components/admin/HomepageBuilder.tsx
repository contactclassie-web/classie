"use client";

import { useEffect, useState } from "react";
import { adminSupabase as supabase } from "@/lib/adminSupabase";
import {
  HOME_CONFIG_KEY, DEFAULT_HOME, SECTION_LABELS, SECTION_EDITED_IN, mergeHomeConfig,
  type HomeConfig, type HeroSlide, type SectionId, type WhyIcon,
} from "@/lib/homeConfig";
import { WHY_ICON_NAMES } from "@/components/home/HomeSections";
import { Field, MediaField, Panel, move, inputCls, labelCls, btnSm } from "@/components/admin/fields";

const NEW_SLIDE: Record<HeroSlide["type"], HeroSlide> = {
  beforeafter: { type: "beforeafter", before: "", after: "", beforeLabel: "Without clip", afterLabel: "With clip" },
  image: { type: "image", url: "", link: "" },
  video: { type: "video", url: "", poster: "" },
};

export default function HomepageBuilder({ revalidate }: { revalidate: () => Promise<void> }) {
  const [cfg, setCfg] = useState<HomeConfig>(DEFAULT_HOME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [neverSaved, setNeverSaved] = useState(false);

  useEffect(() => {
    supabase.from("site_settings").select("value").eq("key", HOME_CONFIG_KEY).maybeSingle()
      .then(({ data }) => {
        let parsed: unknown = null;
        try { parsed = data?.value ? JSON.parse(data.value) : null; } catch { parsed = null; }
        setNeverSaved(!data?.value);
        setCfg(mergeHomeConfig(parsed));
        setLoading(false);
      });
  }, []);

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const update = <K extends keyof HomeConfig>(k: K, patch: Partial<HomeConfig[K]> | HomeConfig[K]) => {
    setCfg((c) => ({ ...c, [k]: Array.isArray(patch) ? patch : { ...(c[k] as object), ...(patch as object) } }));
    setDirty(true);
    setStatus(null);
  };

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const value = JSON.stringify(cfg);
      const del = await supabase.from("site_settings").delete().eq("key", HOME_CONFIG_KEY);
      if (del.error) throw del.error;
      const ins = await supabase.from("site_settings").insert({ key: HOME_CONFIG_KEY, value });
      if (ins.error) throw ins.error;
      await revalidate();
      setDirty(false);
      setNeverSaved(false);
      setStatus({ ok: true, msg: "Saved. The homepage is updated." });
    } catch (e) {
      setStatus({ ok: false, msg: `Not saved: ${e instanceof Error ? e.message : "please try again"}` });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-400 text-sm">Loading…</p>;

  const h = cfg.hero;
  const setSlides = (slides: HeroSlide[]) => update("hero", { slides });
  const setSlide = (i: number, patch: Partial<HeroSlide>) =>
    setSlides(h.slides.map((s, k) => (k === i ? ({ ...s, ...patch } as HeroSlide) : s)));

  return (
    <div className="max-w-3xl space-y-5 pb-24">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-2">
        <h2 className="font-semibold text-gray-700 text-lg">Homepage layout</h2>
        <p className="text-sm text-gray-500">
          Turn sections on or off, change their order, and edit text and photos. Photos and videos are added by pasting their link
          (for example from Cloudinary). Nothing here deletes the old sections; switched-off sections keep all their content.
        </p>
        {neverSaved && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
            You haven&apos;t saved this layout yet. The homepage is showing the default new layout below.
          </p>
        )}
      </div>

      {/* ── Sections ── */}
      <Panel title="Sections: on/off and order" open>
        <p className="text-xs text-gray-500">Top of the list shows first on the homepage. Switched-off sections are hidden, not deleted.</p>
        <ul className="divide-y divide-gray-100 border border-gray-100 rounded-xl">
          {cfg.sections.map((s, i) => (
            <li key={s.id} className={`flex items-center gap-3 px-3 py-2.5 ${s.on ? "" : "bg-gray-50"}`}>
              <span className="flex gap-1">
                <button type="button" className={btnSm} disabled={i === 0} aria-label="Move up"
                  onClick={() => update("sections", move(cfg.sections, i, -1))}>↑</button>
                <button type="button" className={btnSm} disabled={i === cfg.sections.length - 1} aria-label="Move down"
                  onClick={() => update("sections", move(cfg.sections, i, 1))}>↓</button>
              </span>
              <span className="flex-1 min-w-0">
                <span className={`block text-sm ${s.on ? "text-gray-800" : "text-gray-400"}`}>{SECTION_LABELS[s.id as SectionId]}</span>
                {SECTION_EDITED_IN[s.id] && <span className="block text-[11px] text-gray-400">Content: {SECTION_EDITED_IN[s.id]}</span>}
              </span>
              <button type="button" role="switch" aria-checked={s.on} aria-label={`Show ${SECTION_LABELS[s.id]}`}
                onClick={() => update("sections", cfg.sections.map((x, k) => (k === i ? { ...x, on: !x.on } : x)))}
                className={`relative w-10 h-6 rounded-full transition-colors ${s.on ? "bg-[#3B5373]" : "bg-gray-300"}`}>
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${s.on ? "left-5" : "left-1"}`} />
              </button>
            </li>
          ))}
        </ul>
      </Panel>

      {/* ── Hero ── */}
      <Panel title="Hero banner (slider)" note={`${h.slides.length} slides`}>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Small line above" value={h.eyebrow} onChange={(v) => update("hero", { eyebrow: v })} />
          <Field label="Heading line 1" value={h.title1} onChange={(v) => update("hero", { title1: v })} />
          <Field label="Heading italic part" value={h.titleItalic} onChange={(v) => update("hero", { titleItalic: v })} />
          <Field label="Heading end" value={h.title2} onChange={(v) => update("hero", { title2: v })} />
          <Field label="Seconds per slide" type="number" value={h.intervalSec} onChange={(v) => update("hero", { intervalSec: Number(v) || 6 })} />
        </div>
        <Field label="Text under heading" area value={h.subtitle} onChange={(v) => update("hero", { subtitle: v })} />
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Button 1 text" value={h.cta1Text} onChange={(v) => update("hero", { cta1Text: v })} />
          <Field label="Button 1 link" value={h.cta1Url} onChange={(v) => update("hero", { cta1Url: v })} placeholder="/shop/clips" />
          <Field label="Button 2 text" value={h.cta2Text} onChange={(v) => update("hero", { cta2Text: v })} />
          <Field label="Button 2 link" value={h.cta2Url} onChange={(v) => update("hero", { cta2Url: v })} placeholder="/shop/heels" />
        </div>

        <div className="space-y-3">
          <p className="text-xs text-gray-500">
            Slides: <b>Before / After</b> shows two square photos side by side. <b>Photo</b> and <b>Video</b> fill the banner;
            best size 1500 × 1000 (3:2). A Photo slide left empty uses a photo from the Hero tab. Videos play muted on a loop; use an MP4 link.
          </p>
          {h.slides.map((s, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-gray-700 mr-1">Slide {i + 1}</span>
                <select value={s.type} className="border border-gray-200 rounded-md text-xs px-2 py-1"
                  onChange={(e) => setSlides(h.slides.map((x, k) => (k === i ? { ...NEW_SLIDE[e.target.value as HeroSlide["type"]] } : x)))}>
                  <option value="beforeafter">Before / After</option>
                  <option value="image">Photo</option>
                  <option value="video">Video</option>
                </select>
                <span className="ml-auto flex gap-1">
                  <button type="button" className={btnSm} disabled={i === 0} onClick={() => setSlides(move(h.slides, i, -1))}>↑</button>
                  <button type="button" className={btnSm} disabled={i === h.slides.length - 1} onClick={() => setSlides(move(h.slides, i, 1))}>↓</button>
                  <button type="button" className={`${btnSm} hover:!border-red-400 hover:!text-red-500`} onClick={() => setSlides(h.slides.filter((_, k) => k !== i))}>Remove</button>
                </span>
              </div>
              {s.type === "beforeafter" && (
                <div className="grid sm:grid-cols-2 gap-3">
                  <MediaField label="Before photo (without clip)" value={s.before} onChange={(v) => setSlide(i, { before: v })} />
                  <MediaField label="After photo (with clip)" value={s.after} onChange={(v) => setSlide(i, { after: v })} />
                  <Field label="Before label" value={s.beforeLabel} onChange={(v) => setSlide(i, { beforeLabel: v })} />
                  <Field label="After label" value={s.afterLabel} onChange={(v) => setSlide(i, { afterLabel: v })} />
                </div>
              )}
              {s.type === "image" && (
                <div className="grid sm:grid-cols-2 gap-3">
                  <MediaField label="Photo link" value={s.url} onChange={(v) => setSlide(i, { url: v })} hint="Empty = photo from the Hero tab" />
                  <Field label="Opens when tapped (optional)" value={s.link} onChange={(v) => setSlide(i, { link: v })} placeholder="/shop/clips" />
                </div>
              )}
              {s.type === "video" && (
                <div className="grid sm:grid-cols-2 gap-3">
                  <MediaField label="Video link (MP4)" value={s.url} onChange={(v) => setSlide(i, { url: v })} video />
                  <MediaField label="Cover photo while loading (optional)" value={s.poster} onChange={(v) => setSlide(i, { poster: v })} />
                </div>
              )}
            </div>
          ))}
          {h.slides.length < 6 && (
            <div className="flex flex-wrap gap-2">
              <button type="button" className={btnSm} onClick={() => setSlides([...h.slides, { ...NEW_SLIDE.image }])}>+ Photo slide</button>
              <button type="button" className={btnSm} onClick={() => setSlides([...h.slides, { ...NEW_SLIDE.video }])}>+ Video slide</button>
              <button type="button" className={btnSm} onClick={() => setSlides([...h.slides, { ...NEW_SLIDE.beforeafter }])}>+ Before / After slide</button>
            </div>
          )}
        </div>
      </Panel>

      {/* ── Marketplace ── */}
      <Panel title="Amazon · Flipkart · Myntra line">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Starts with" value={cfg.marketplace.prefix} onChange={(v) => update("marketplace", { prefix: v })} />
          <Field label="Marketplaces (comma separated)" value={cfg.marketplace.names} onChange={(v) => update("marketplace", { names: v })} />
        </div>
        <Field label="Why buy here" value={cfg.marketplace.note} onChange={(v) => update("marketplace", { note: v })} />
      </Panel>

      {/* ── Shop by type ── */}
      <Panel title="Shop by type (round photos)" note={`${cfg.types.items.length} items`}>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Heading" value={cfg.types.heading} onChange={(v) => update("types", { heading: v })} />
          <Field label="Heading italic part" value={cfg.types.headingItalic} onChange={(v) => update("types", { headingItalic: v })} />
        </div>
        {cfg.types.items.map((it, i) => {
          const setItem = (p: Partial<typeof it>) => update("types", { items: cfg.types.items.map((x, k) => (k === i ? { ...x, ...p } : x)) });
          return (
            <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">{it.label || `Item ${i + 1}`}</span>
                <span className="ml-auto flex gap-1">
                  <button type="button" className={btnSm} disabled={i === 0} onClick={() => update("types", { items: move(cfg.types.items, i, -1) })}>↑</button>
                  <button type="button" className={btnSm} disabled={i === cfg.types.items.length - 1} onClick={() => update("types", { items: move(cfg.types.items, i, 1) })}>↓</button>
                  <button type="button" className={btnSm} onClick={() => update("types", { items: cfg.types.items.filter((_, k) => k !== i) })}>Remove</button>
                </span>
              </div>
              <MediaField label="Photo" value={it.image} onChange={(v) => setItem({ image: v })} />
              <div className="grid sm:grid-cols-3 gap-3">
                <Field label="Name" value={it.label} onChange={(v) => setItem({ label: v })} />
                <Field label="Small text (e.g. price)" value={it.note} onChange={(v) => setItem({ note: v })} />
                <Field label="Link" value={it.link} onChange={(v) => setItem({ link: v })} placeholder="/shop/clips" />
              </div>
            </div>
          );
        })}
        {cfg.types.items.length < 8 && (
          <button type="button" className={btnSm} onClick={() => update("types", { items: [...cfg.types.items, { label: "", image: "", link: "/shop/clips", note: "" }] })}>+ Add item</button>
        )}
      </Panel>

      {/* ── Bestsellers / Heels ── */}
      {(["bestsellers", "heels"] as const).map((k) => (
        <Panel key={k} title={k === "bestsellers" ? "Bestselling shoe charms" : "Heels"}
          note={k === "bestsellers" ? "Products tagged Bestseller in Featured Picks show first" : "Active heels"}>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Small line above" value={cfg[k].eyebrow} onChange={(v) => update(k, { eyebrow: v })} />
            <Field label="How many products" type="number" value={cfg[k].count} onChange={(v) => update(k, { count: Number(v) || 4 })} />
            <Field label="Heading" value={cfg[k].heading} onChange={(v) => update(k, { heading: v })} />
            <Field label="Heading italic part" value={cfg[k].headingItalic} onChange={(v) => update(k, { headingItalic: v })} />
            <Field label="Link text" value={cfg[k].linkText} onChange={(v) => update(k, { linkText: v })} />
            <Field label="Link" value={cfg[k].linkUrl} onChange={(v) => update(k, { linkUrl: v })} />
          </div>
          <p className="text-xs text-gray-500">Each card shows the product&apos;s main photo. For shoe charms, set the photo of the clip on a shoe as the main photo in Products.</p>
        </Panel>
      ))}

      {/* ── Free delivery ── */}
      <Panel title="Free delivery banner" note="Amount comes from Shipping Rates">
        <p className="text-xs text-gray-500">Write <b>{"{amount}"}</b> where the free delivery amount should appear. If Shipping Rates has no free tier, this banner hides itself.</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Small line above" value={cfg.freeDelivery.eyebrow} onChange={(v) => update("freeDelivery", { eyebrow: v })} />
          <Field label="Heading" value={cfg.freeDelivery.heading} onChange={(v) => update("freeDelivery", { heading: v })} />
        </div>
        <Field label="Text" area value={cfg.freeDelivery.text} onChange={(v) => update("freeDelivery", { text: v })} />
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Button text" value={cfg.freeDelivery.buttonText} onChange={(v) => update("freeDelivery", { buttonText: v })} />
          <Field label="Button link" value={cfg.freeDelivery.buttonUrl} onChange={(v) => update("freeDelivery", { buttonUrl: v })} />
        </div>
        {[0, 1, 2].map((i) => (
          <MediaField key={i} label={`Photo ${i + 1}`} value={cfg.freeDelivery.images[i] || ""}
            onChange={(v) => { const a = [...cfg.freeDelivery.images]; a[i] = v; update("freeDelivery", { images: a }); }} />
        ))}
      </Panel>

      {/* ── How it works ── */}
      <Panel title="How it works" note="3 steps">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Heading" value={cfg.howItWorks.heading} onChange={(v) => update("howItWorks", { heading: v })} />
          <Field label="Heading italic part" value={cfg.howItWorks.headingItalic} onChange={(v) => update("howItWorks", { headingItalic: v })} />
        </div>
        {cfg.howItWorks.steps.map((st, i) => {
          const setStep = (p: Partial<typeof st>) => update("howItWorks", { steps: cfg.howItWorks.steps.map((x, k) => (k === i ? { ...x, ...p } : x)) });
          return (
            <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
              <span className="text-sm font-semibold text-gray-700">Step {i + 1}</span>
              <MediaField label="Photo" value={st.image} onChange={(v) => setStep({ image: v })} />
              <div className="grid sm:grid-cols-2 gap-3">
                <Field label="Title" value={st.title} onChange={(v) => setStep({ title: v })} />
                <Field label="Text" value={st.text} onChange={(v) => setStep({ text: v })} />
              </div>
            </div>
          );
        })}
      </Panel>

      {/* ── Custom designs ── */}
      <Panel title="Custom designs">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Small line above" value={cfg.custom.eyebrow} onChange={(v) => update("custom", { eyebrow: v })} />
          <Field label="Heading" value={cfg.custom.heading} onChange={(v) => update("custom", { heading: v })} />
          <Field label="Heading italic part" value={cfg.custom.headingItalic} onChange={(v) => update("custom", { headingItalic: v })} />
        </div>
        <Field label="Text" area value={cfg.custom.text} onChange={(v) => update("custom", { text: v })} />
        <Field label="Highlighted offer" area value={cfg.custom.perk} onChange={(v) => update("custom", { perk: v })} />
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Button text" value={cfg.custom.buttonText} onChange={(v) => update("custom", { buttonText: v })} />
          <Field label="Button link" value={cfg.custom.buttonUrl} onChange={(v) => update("custom", { buttonUrl: v })} placeholder="/contact or a WhatsApp link" />
        </div>
        <MediaField label="Sketch photo (empty = drawn sketch)" value={cfg.custom.sketchImage} onChange={(v) => update("custom", { sketchImage: v })} />
        <MediaField label="Finished clip photo" value={cfg.custom.productImage} onChange={(v) => update("custom", { productImage: v })} />
      </Panel>

      {/* ── Season edit ── */}
      <Panel title="Season edit (e.g. Wedding)">
        <MediaField label="Photo" value={cfg.edit.image} onChange={(v) => update("edit", { image: v })} hint="Best: landscape, 5:4" />
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Small line above" value={cfg.edit.eyebrow} onChange={(v) => update("edit", { eyebrow: v })} />
          <Field label="Label on photo (optional)" value={cfg.edit.badge} onChange={(v) => update("edit", { badge: v })} />
          <Field label="Heading" value={cfg.edit.heading} onChange={(v) => update("edit", { heading: v })} />
          <Field label="Heading italic part" value={cfg.edit.headingItalic} onChange={(v) => update("edit", { headingItalic: v })} />
        </div>
        <Field label="Text" area value={cfg.edit.text} onChange={(v) => update("edit", { text: v })} />
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Button text" value={cfg.edit.buttonText} onChange={(v) => update("edit", { buttonText: v })} />
          <Field label="Button link" value={cfg.edit.buttonUrl} onChange={(v) => update("edit", { buttonUrl: v })} />
        </div>
      </Panel>

      {/* ── Journal ── */}
      <Panel title="Journal (latest blog posts)" note="Posts come from Blog">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Small line above" value={cfg.journal.eyebrow} onChange={(v) => update("journal", { eyebrow: v })} />
          <Field label="How many posts" type="number" value={cfg.journal.count} onChange={(v) => update("journal", { count: Number(v) || 3 })} />
          <Field label="Heading" value={cfg.journal.heading} onChange={(v) => update("journal", { heading: v })} />
          <Field label="Heading italic part" value={cfg.journal.headingItalic} onChange={(v) => update("journal", { headingItalic: v })} />
          <Field label="Link text" value={cfg.journal.linkText} onChange={(v) => update("journal", { linkText: v })} />
        </div>
      </Panel>

      {/* ── Why buy here ── */}
      <Panel title="Why buy here (4 points)">
        <p className="text-xs text-gray-500">Write <b>{"{amount}"}</b> for the free delivery amount from Shipping Rates.</p>
        {cfg.why.items.map((it, i) => {
          const setIt = (p: Partial<typeof it>) => update("why", { items: cfg.why.items.map((x, k) => (k === i ? { ...x, ...p } : x)) });
          return (
            <div key={i} className="grid sm:grid-cols-[120px_1fr_1fr_auto] gap-3 items-end">
              <label className="block">
                <span className={labelCls}>Icon</span>
                <select value={it.icon} onChange={(e) => setIt({ icon: e.target.value as WhyIcon })} className={inputCls}>
                  {WHY_ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              <Field label="Title" value={it.title} onChange={(v) => setIt({ title: v })} />
              <Field label="Small text" value={it.sub} onChange={(v) => setIt({ sub: v })} />
              <button type="button" className={`${btnSm} mb-1.5`} onClick={() => update("why", { items: cfg.why.items.filter((_, k) => k !== i) })}>Remove</button>
            </div>
          );
        })}
        {cfg.why.items.length < 4 && (
          <button type="button" className={btnSm} onClick={() => update("why", { items: [...cfg.why.items, { icon: "star", title: "", sub: "" }] })}>+ Add point</button>
        )}
      </Panel>

      {/* ── WhatsApp ── */}
      <Panel title="WhatsApp join">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Heading" value={cfg.whatsapp.heading} onChange={(v) => update("whatsapp", { heading: v })} />
          <Field label="Button text" value={cfg.whatsapp.buttonText} onChange={(v) => update("whatsapp", { buttonText: v })} />
        </div>
        <Field label="Text" value={cfg.whatsapp.text} onChange={(v) => update("whatsapp", { text: v })} />
        <Field label="WhatsApp link" value={cfg.whatsapp.url} onChange={(v) => update("whatsapp", { url: v })}
          placeholder="https://wa.me/91XXXXXXXXXX" hint="Empty = the WhatsApp link from Footer settings. If both are empty, this section hides." />
      </Panel>

      {/* ── SEO ── */}
      <Panel title="SEO text (bottom of page)">
        <Field label="Heading" value={cfg.seo.heading} onChange={(v) => update("seo", { heading: v })} />
        <Field label="Text" area value={cfg.seo.text} onChange={(v) => update("seo", { text: v })} hint="{amount} = free delivery amount" />
      </Panel>

      {/* ── Save bar ── */}
      <div className="sticky bottom-4 z-10">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg px-5 py-3 flex flex-wrap items-center gap-3">
          <span className={`text-sm ${status ? (status.ok ? "text-emerald-600" : "text-red-600") : dirty ? "text-amber-600" : "text-gray-400"}`}>
            {status ? status.msg : dirty ? "You have unsaved changes" : "All changes saved"}
          </span>
          <a href="/" target="_blank" rel="noopener noreferrer" className="ml-auto text-sm text-[#3B5373] underline">View homepage</a>
          <button type="button" onClick={save} disabled={saving || (!dirty && !neverSaved)}
            className="bg-[#3B5373] text-white text-sm font-medium px-5 py-2 rounded-lg disabled:opacity-40">
            {saving ? "Saving…" : "Save homepage"}
          </button>
        </div>
      </div>
    </div>
  );
}
