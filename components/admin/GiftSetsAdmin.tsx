"use client";

import { useEffect, useMemo, useState } from "react";
import { adminSupabase as supabase } from "@/lib/adminSupabase";
import { loadSettingJson, saveSettingJson } from "@/lib/adminSettings";
import {
  GIFT_SETS_KEY, DEFAULT_GIFT_SETS, mergeGiftSets, slugify, setKind, setCompareAt, pieceCount,
  type GiftSetsConfig, type GiftSet, type SetProduct,
} from "@/lib/giftSets";
import { Field, MediaField, Panel, move, inputCls, labelCls, btnSm } from "@/components/admin/fields";

type View = "sets" | "page";

function newSet(existing: GiftSet[]): GiftSet {
  let n = existing.length + 1, slug = `new-set-${n}`;
  while (existing.some((s) => s.slug === slug)) slug = `new-set-${++n}`;
  return { id: `${slug}-${Date.now().toString(36)}`, slug, name: "", tag: "", description: "", items: [], price: 0, compareAt: 0, images: [], askOnly: false, active: false };
}

export default function GiftSetsAdmin({ view, revalidate }: { view: View; revalidate: () => Promise<void> }) {
  const [cfg, setCfg] = useState<GiftSetsConfig>(DEFAULT_GIFT_SETS);
  const [products, setProducts] = useState<Record<string, SetProduct>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [neverSaved, setNeverSaved] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      loadSettingJson(GIFT_SETS_KEY),
      supabase.from("products").select("slug,title,price,image,category,variant_type,variants,active").order("title"),
    ]).then(([saved, prod]) => {
      setNeverSaved(!saved.exists);
      setCfg(mergeGiftSets(saved.value));
      const map: Record<string, SetProduct> = {};
      (prod.data ?? []).forEach((p: { slug: string; title: string; price: number; image: string; category: string; variant_type: string | null; variants: string[] | null; active: boolean | null }) => {
        map[p.slug] = {
          slug: p.slug, title: p.title, price: Number(p.price) || 0, image: p.image, category: p.category,
          variantType: p.variant_type === "size" || p.variant_type === "color" ? p.variant_type : "none",
          options: Array.isArray(p.variants) ? p.variants : [], active: p.active !== false,
        };
      });
      setProducts(map);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const productList = useMemo(() => Object.values(products).sort((a, b) =>
    (a.category === "heels" ? 1 : 0) - (b.category === "heels" ? 1 : 0) || a.title.localeCompare(b.title)), [products]);

  const touch = () => { setDirty(true); setStatus(null); };
  const setSets = (sets: GiftSet[]) => { setCfg((c) => ({ ...c, sets })); touch(); };
  const updateSet = (id: string, patch: Partial<GiftSet>) => setSets(cfg.sets.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const updatePage = (patch: Partial<GiftSetsConfig["page"]>) => { setCfg((c) => ({ ...c, page: { ...c.page, ...patch } })); touch(); };

  const save = async () => {
    // Every set needs a name; selling sets need a price and at least one product.
    const bad = cfg.sets.find((s) => !s.name.trim() || (s.active && !s.askOnly && (s.price <= 0 || s.items.length === 0)));
    if (bad) {
      setOpen(bad.id);
      setStatus({ ok: false, msg: !bad.name.trim() ? "Every set needs a name." : `"${bad.name}" is switched on but has no price or no products.` });
      return;
    }
    setSaving(true);
    try {
      const clean = mergeGiftSets(cfg); // normalises slugs and numbers
      await saveSettingJson(GIFT_SETS_KEY, clean);
      setCfg(clean);
      await revalidate();
      setDirty(false);
      setNeverSaved(false);
      setStatus({ ok: true, msg: "Saved. The Gift Sets page is updated." });
    } catch (e) {
      setStatus({ ok: false, msg: `Not saved: ${e instanceof Error ? e.message : "please try again"}` });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-400 text-sm">Loading…</p>;

  const tags = Array.from(new Set(cfg.sets.map((s) => s.tag).filter(Boolean)));
  const p = cfg.page;

  return (
    <div className="max-w-3xl space-y-5 pb-24">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-2">
        <h2 className="font-semibold text-gray-700 text-lg">{view === "sets" ? "Gift sets" : "Gift Sets page"}</h2>
        <p className="text-sm text-gray-500">
          {view === "sets"
            ? "Make a set from any products (2 clips, 3 clips, 4 pairs, a heel with clips…), choose the set price and photos, and switch it on. The original price is worked out from the products' current prices."
            : "Banner, text and the points shown on the Gift Sets page."}
          {" "}Page: <a href="/gift-sets" target="_blank" rel="noopener noreferrer" className="text-[#3B5373] underline">/gift-sets</a>
        </p>
        {neverSaved && view === "sets" && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
            6 starting sets are ready as drafts (switched off). Check their products and prices, switch on the ones you want, then save.
          </p>
        )}
      </div>

      {view === "sets" && (
        <>
          {cfg.sets.map((s, idx) => {
            const isOpen = open === s.id;
            const compare = setCompareAt(s, products);
            const autoCompare = setCompareAt({ ...s, compareAt: 0 }, products);
            const save = compare - s.price;
            const missing = s.items.filter((it) => !products[it.slug]);
            const inactive = s.items.filter((it) => products[it.slug] && !products[it.slug].active);
            return (
              <div key={s.id} className={`bg-white rounded-2xl border shadow-sm ${s.active ? "border-gray-100" : "border-dashed border-gray-200"}`}>
                <div className="flex flex-wrap items-center gap-3 px-5 py-4">
                  <span className="flex gap-1">
                    <button type="button" className={btnSm} disabled={idx === 0} aria-label="Move up" onClick={() => setSets(move(cfg.sets, idx, -1))}>↑</button>
                    <button type="button" className={btnSm} disabled={idx === cfg.sets.length - 1} aria-label="Move down" onClick={() => setSets(move(cfg.sets, idx, 1))}>↓</button>
                  </span>
                  <button type="button" onClick={() => setOpen(isOpen ? null : s.id)} className="flex-1 min-w-0 text-left">
                    <span className={`block font-medium ${s.active ? "text-gray-800" : "text-gray-400"}`}>{s.name || "Untitled set"}</span>
                    <span className="block text-xs text-gray-400">
                      {s.items.length ? `${setKind(s, products)} · ${pieceCount(s)} pieces` : "No products yet"}
                      {s.askOnly ? " · price on request" : s.price ? ` · ₹${s.price.toLocaleString("en-IN")}${save > 0 ? ` (save ₹${save.toLocaleString("en-IN")})` : ""}` : " · no price"}
                      {s.tag ? ` · ${s.tag}` : ""}
                    </span>
                  </button>
                  <button type="button" role="switch" aria-checked={s.active} aria-label={`Show ${s.name}`}
                    onClick={() => updateSet(s.id, { active: !s.active })}
                    className={`relative w-10 h-6 rounded-full transition-colors ${s.active ? "bg-[#3B5373]" : "bg-gray-300"}`}>
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${s.active ? "left-5" : "left-1"}`} />
                  </button>
                  <button type="button" className={btnSm} onClick={() => setOpen(isOpen ? null : s.id)}>{isOpen ? "Close" : "Edit"}</button>
                </div>

                {isOpen && (
                  <div className="px-5 pb-5 pt-4 space-y-4 border-t border-gray-50">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Field label="Set name" value={s.name} onChange={(v) => updateSet(s.id, { name: v, ...(s.slug.startsWith("new-set") ? { slug: slugify(v) || s.slug } : {}) })} placeholder="Bridal Crystal Trio" />
                      <Field label="Web address" value={s.slug} onChange={(v) => updateSet(s.id, { slug: v.toLowerCase().replace(/[^a-z0-9-]+/g, "-") })} hint={`classie.co.in/gift-sets/${s.slug}`} />
                      <label className="block">
                        <span className={labelCls}>Filter label</span>
                        <input list="set-tags" value={s.tag} onChange={(e) => updateSet(s.id, { tag: e.target.value })} placeholder="Bridal, Festive, Duo…" className={inputCls} />
                      </label>
                      <label className="flex items-center gap-2 text-sm text-gray-600 mt-5">
                        <input type="checkbox" checked={s.askOnly} onChange={(e) => updateSet(s.id, { askOnly: e.target.checked })} />
                        Price on request (shows &quot;Ask on WhatsApp&quot; instead of Add to cart)
                      </label>
                    </div>
                    <Field label="Description" area value={s.description} onChange={(v) => updateSet(s.id, { description: v })} />

                    {/* Products in the set */}
                    <div className="space-y-2">
                      <span className={labelCls}>Products in this set</span>
                      {s.items.map((it, k) => {
                        const prod = products[it.slug];
                        const setItem = (patch: Partial<typeof it>) => updateSet(s.id, { items: s.items.map((x, j) => (j === k ? { ...x, ...patch } : x)) });
                        return (
                          <div key={k} className="grid grid-cols-[48px_1fr] sm:grid-cols-[48px_1fr_150px_70px_auto] gap-2 items-center border border-gray-100 rounded-xl p-2">
                            <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              {prod?.image && <img src={prod.image} alt="" className="w-full h-full object-cover" />}
                            </div>
                            <select value={it.slug} onChange={(e) => setItem({ slug: e.target.value, variant: "" })} className={inputCls}>
                              {!prod && <option value={it.slug}>Missing product: {it.slug}</option>}
                              <optgroup label="Shoe charms & accessories">
                                {productList.filter((x) => x.category !== "heels").map((x) => <option key={x.slug} value={x.slug}>{x.title} — ₹{x.price}{x.active ? "" : " (off)"}</option>)}
                              </optgroup>
                              <optgroup label="Heels">
                                {productList.filter((x) => x.category === "heels").map((x) => <option key={x.slug} value={x.slug}>{x.title} — ₹{x.price}{x.active ? "" : " (off)"}</option>)}
                              </optgroup>
                            </select>
                            <select value={it.variant} onChange={(e) => setItem({ variant: e.target.value })} className={`${inputCls} col-start-2 sm:col-start-auto`} disabled={!prod || prod.options.length === 0}>
                              <option value="">{prod && prod.options.length > 1 ? `Customer chooses ${prod.variantType === "size" ? "size" : "colour"}` : prod?.options.length === 1 ? prod.options[0] : "No options"}</option>
                              {prod && prod.options.length > 1 && prod.options.map((o) => <option key={o} value={o}>{prod.variantType === "size" ? `Size ${o}` : o}</option>)}
                            </select>
                            <input type="number" min={1} max={20} value={it.qty} aria-label="Quantity" onChange={(e) => setItem({ qty: Math.max(1, Number(e.target.value) || 1) })} className={`${inputCls} col-start-2 sm:col-start-auto`} />
                            <span className="flex gap-1 col-start-2 sm:col-start-auto">
                              <button type="button" className={btnSm} disabled={k === 0} onClick={() => updateSet(s.id, { items: move(s.items, k, -1) })}>↑</button>
                              <button type="button" className={`${btnSm} hover:!border-red-400 hover:!text-red-500`} onClick={() => updateSet(s.id, { items: s.items.filter((_, j) => j !== k) })}>Remove</button>
                            </span>
                          </div>
                        );
                      })}
                      {productList.length > 0 && (
                        <button type="button" className={btnSm} onClick={() => updateSet(s.id, { items: [...s.items, { slug: productList[0].slug, variant: "", qty: 1 }] })}>+ Add product</button>
                      )}
                      {missing.length > 0 && <p className="text-xs text-red-600">{missing.length} product(s) no longer exist. Replace or remove them, otherwise this set won&apos;t show.</p>}
                      {inactive.length > 0 && <p className="text-xs text-amber-700">{inactive.map((it) => products[it.slug].title).join(", ")} is switched off in Products, so this set is hidden until it&apos;s back on.</p>}
                    </div>

                    {/* Price */}
                    {!s.askOnly && (
                      <div className="grid sm:grid-cols-3 gap-3 bg-gray-50 rounded-xl p-3">
                        <Field label="Set price (₹)" type="number" value={s.price || ""} onChange={(v) => updateSet(s.id, { price: Math.max(0, Math.round(Number(v) || 0)) })} />
                        <Field label="Original price (₹)" type="number" value={s.compareAt || ""} onChange={(v) => updateSet(s.id, { compareAt: Math.max(0, Math.round(Number(v) || 0)) })}
                          placeholder={`Auto: ₹${autoCompare.toLocaleString("en-IN")}`} hint="Empty = total of the products" />
                        <div className="text-sm self-center">
                          {s.price > 0 && compare > 0 && (save > 0
                            ? <span className="text-emerald-700 font-medium">Customer saves ₹{save.toLocaleString("en-IN")} ({Math.round((save / compare) * 100)}%)</span>
                            : <span className="text-amber-700">Set price is not lower than buying separately</span>)}
                        </div>
                      </div>
                    )}

                    {/* Photos */}
                    <div className="space-y-2">
                      <span className={labelCls}>Set photos</span>
                      <p className="text-xs text-gray-500">Best: one photo with all the pieces together. No photos = a collage of the products&apos; photos.</p>
                      {s.images.map((u, k) => (
                        <div key={k} className="flex gap-2 items-start">
                          <div className="flex-1"><MediaField label={`Photo ${k + 1}`} value={u} onChange={(v) => updateSet(s.id, { images: s.images.map((x, j) => (j === k ? v : x)) })} /></div>
                          <button type="button" className={`${btnSm} mt-6`} onClick={() => updateSet(s.id, { images: s.images.filter((_, j) => j !== k) })}>Remove</button>
                        </div>
                      ))}
                      {s.images.length < 8 && <button type="button" className={btnSm} onClick={() => updateSet(s.id, { images: [...s.images, ""] })}>+ Add photo</button>}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50">
                      <button type="button" className={btnSm} onClick={() => {
                        const copy = { ...s, id: `${s.id}-copy-${Date.now().toString(36)}`, slug: `${s.slug}-copy`, name: `${s.name} (copy)`, active: false, items: s.items.map((x) => ({ ...x })), images: [...s.images] };
                        const list = [...cfg.sets]; list.splice(idx + 1, 0, copy); setSets(list); setOpen(copy.id);
                      }}>Duplicate</button>
                      {s.active && <a href={`/gift-sets/${s.slug}`} target="_blank" rel="noopener noreferrer" className={btnSm}>View on site</a>}
                      <button type="button" className={`${btnSm} ml-auto hover:!border-red-400 hover:!text-red-500`}
                        onClick={() => { if (window.confirm(`Delete "${s.name || "this set"}"? This can't be undone after you save.`)) { setSets(cfg.sets.filter((x) => x.id !== s.id)); setOpen(null); } }}>
                        Delete set
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <datalist id="set-tags">{tags.map((t) => <option key={t} value={t} />)}</datalist>
          <button type="button" onClick={() => { const s = newSet(cfg.sets); setSets([...cfg.sets, s]); setOpen(s.id); }}
            className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-4 text-sm text-gray-500 hover:border-[#3B5373] hover:text-[#3B5373]">
            + New set
          </button>
        </>
      )}

      {view === "page" && (
        <>
          <Panel title="Banner" open>
            <MediaField label="Banner photo" value={p.bannerImage} onChange={(v) => updatePage({ bannerImage: v })} hint="Best: a set laid out together, landscape" />
            <div className="grid sm:grid-cols-3 gap-3">
              <Field label="Small line above" value={p.eyebrow} onChange={(v) => updatePage({ eyebrow: v })} />
              <Field label="Heading" value={p.heading} onChange={(v) => updatePage({ heading: v })} />
              <Field label="Heading italic part" value={p.headingItalic} onChange={(v) => updatePage({ headingItalic: v })} />
            </div>
            <Field label="Text" area value={p.text} onChange={(v) => updatePage({ text: v })} hint="{amount} = free delivery amount from Shipping Rates" />
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Small labels (comma separated)" value={p.chips} onChange={(v) => updatePage({ chips: v })} />
              <Field label="Button text" value={p.buttonText} onChange={(v) => updatePage({ buttonText: v })} />
            </div>
          </Panel>

          <Panel title="Offer strip" note={p.offerOn ? "On" : "Off"}>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={p.offerOn} onChange={(e) => updatePage({ offerOn: e.target.checked })} />
              Show the offer strip on the Gift Sets page
            </label>
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              Turn this on only after the offer really works, for example a coupon in Hot Deals → Coupons, and mention the code in the text.
            </p>
            <Field label="Offer title" value={p.offerTitle} onChange={(v) => updatePage({ offerTitle: v })} />
            <Field label="Offer text" value={p.offerText} onChange={(v) => updatePage({ offerText: v })} />
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="Link text" value={p.offerLinkText} onChange={(v) => updatePage({ offerLinkText: v })} />
              <Field label="Link" value={p.offerLinkUrl} onChange={(v) => updatePage({ offerLinkUrl: v })} />
            </div>
          </Panel>

          <Panel title="Why sets (points under the sets)">
            {p.why.map((w, i) => (
              <div key={i} className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                <Field label="Title" value={w.title} onChange={(v) => updatePage({ why: p.why.map((x, k) => (k === i ? { ...x, title: v } : x)) })} />
                <Field label="Text" value={w.sub} onChange={(v) => updatePage({ why: p.why.map((x, k) => (k === i ? { ...x, sub: v } : x)) })} />
                <button type="button" className={`${btnSm} mb-1.5`} onClick={() => updatePage({ why: p.why.filter((_, k) => k !== i) })}>Remove</button>
              </div>
            ))}
            {p.why.length < 4 && <button type="button" className={btnSm} onClick={() => updatePage({ why: [...p.why, { title: "", sub: "" }] })}>+ Add point</button>}
          </Panel>

          <Panel title="Set page text">
            <Field label="Gifting note" area value={p.giftNote} onChange={(v) => updatePage({ giftNote: v })} hint="Shown on each set's page, e.g. gift box or pouch details" />
            <Field label="Returns on sets" area value={p.returnNote} onChange={(v) => updatePage({ returnNote: v })} />
            <Field label="Text when no set is switched on" area value={p.emptyText} onChange={(v) => updatePage({ emptyText: v })} />
          </Panel>

          <Panel title="SEO text">
            <Field label="Heading" value={p.seoHeading} onChange={(v) => updatePage({ seoHeading: v })} />
            <Field label="Text" area value={p.seoText} onChange={(v) => updatePage({ seoText: v })} />
          </Panel>
        </>
      )}

      <div className="sticky bottom-4 z-10">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg px-5 py-3 flex flex-wrap items-center gap-3">
          <span className={`text-sm ${status ? (status.ok ? "text-emerald-600" : "text-red-600") : dirty ? "text-amber-600" : "text-gray-400"}`}>
            {status ? status.msg : dirty ? "You have unsaved changes" : "All changes saved"}
          </span>
          <a href="/gift-sets" target="_blank" rel="noopener noreferrer" className="ml-auto text-sm text-[#3B5373] underline">View page</a>
          <button type="button" onClick={save} disabled={saving || (!dirty && !neverSaved)}
            className="bg-[#3B5373] text-white text-sm font-medium px-5 py-2 rounded-lg disabled:opacity-40">
            {saving ? "Saving…" : "Save gift sets"}
          </button>
        </div>
      </div>
    </div>
  );
}
