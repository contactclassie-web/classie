"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Eye, EyeOff, Pencil, Plus, Save, AlertTriangle } from "lucide-react";
import { adminSupabase as supabase } from "@/lib/adminSupabase";
import { loadSettingJson, saveSettingJson } from "@/lib/adminSettings";
import { CARD_PHOTOS_KEY, cardPhotoFor, parseCardPhotos, type CardPhotos } from "@/lib/cardPhotos";

// Amazon-style product list: one row per product family, with its colour or
// size variations underneath (photo, photo count, sales, stock).
// Stock is kept in site_settings → "inventory_v1" as { slug: { variant: qty } }.

export type PMProduct = {
  slug: string; title: string; price: number; compare_price: number; category: string;
  image: string; images: string[]; variant_type: string; variants: string[]; active: boolean;
};
type ColorRow = { product_slug: string; color_name: string; color_hex: string | null; image: string | null; group_id: string };
type Order = { status: string; created_at: string; items: unknown };
type Inventory = Record<string, Record<string, number>>;

const INV_KEY = "inventory_v1";
const NONE = "_";
const rs = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
const thumb = (u: string, w = 120) => (u && u.includes("/image/upload/") ? u.replace("/image/upload/", `/image/upload/w_${w},h_${w},c_fill,f_auto,q_auto/`) : u);
const norm = (s: string) => (s || "").trim().toLowerCase();

function parseImgs(raw: string | null): string[] {
  if (!raw) return [];
  if (!raw.startsWith("[")) return [raw];
  try { return (JSON.parse(raw) as unknown[]).filter((u): u is string => typeof u === "string" && u.trim() !== ""); } catch { return []; }
}

type Child = {
  key: string; slug: string; label: string; hex?: string; photos: string[];
  price: number; mrp: number; active: boolean; stockKeys: string[]; product?: PMProduct; sizes?: string[];
};
type Family = {
  key: string; name: string; category: string; photo: string; products: PMProduct[];
  children: Child[]; issues: string[];
};

export default function ProductManager({
  products, onEdit, onToggle, onAdd,
}: {
  products: PMProduct[];
  onEdit: (slug: string) => void;
  onToggle: (slug: string) => void;
  onAdd: () => void;
}) {
  const [colors, setColors] = useState<ColorRow[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inv, setInv] = useState<Inventory>({});
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [view, setView] = useState<"all" | "fix" | "active" | "inactive" | "low">("all");
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [cards, setCards] = useState<CardPhotos>({});
  const [cardsDirty, setCardsDirty] = useState(false);
  const [pickCard, setPickCard] = useState<string | null>(null);

  useEffect(() => {
    const since = new Date(Date.now() - 30 * 86400000).toISOString();
    supabase.from("product_color_variants").select("product_slug,color_name,color_hex,image,group_id").order("sort_order").then(({ data }) => setColors((data ?? []) as ColorRow[]));
    supabase.from("orders").select("status,created_at,items").gte("created_at", since).then(({ data }) => setOrders((data ?? []) as Order[]));
    loadSettingJson(INV_KEY).then(({ value }) => { if (value && typeof value === "object") setInv(value as Inventory); });
    loadSettingJson(CARD_PHOTOS_KEY).then(({ value }) => { if (value && typeof value === "object") setCards(parseCardPhotos(JSON.stringify(value))); });
  }, []);

  // Units and revenue in the last 30 days, per "slug|variant" and per slug.
  const sales = useMemo(() => {
    const m: Record<string, { units: number; amount: number }> = {};
    const add = (k: string, u: number, a: number) => { m[k] ??= { units: 0, amount: 0 }; m[k].units += u; m[k].amount += a; };
    for (const o of orders) {
      if (/cancel|fail|refund/i.test(o.status || "")) continue;
      let items: unknown = o.items;
      if (typeof items === "string") { try { items = JSON.parse(items); } catch { items = []; } }
      for (const it of (Array.isArray(items) ? items : []) as { slug?: string; quantity?: number; price?: number; variant?: string }[]) {
        if (!it?.slug) continue;
        const u = Number(it.quantity) || 1, a = u * (Number(it.price) || 0);
        add(it.slug, u, a);
        if (it.variant) add(`${it.slug}|${norm(it.variant)}`, u, a);
      }
    }
    return m;
  }, [orders]);

  const families = useMemo<Family[]>(() => {
    const bySlug = new Map(products.map((p) => [p.slug, p]));
    const rowsBySlug: Record<string, ColorRow[]> = {};
    for (const r of colors) (rowsBySlug[r.product_slug] ??= []).push(r);
    const used = new Set<string>();
    const out: Family[] = [];
    const sizesOf = (p: PMProduct) => (p.variant_type === "size" ? (p.variants || []).filter(Boolean) : []);

    // Heels: products linked as colours of each other become one family.
    const groups: Record<string, ColorRow[]> = {};
    for (const r of colors) { const p = bySlug.get(r.product_slug); if (p && p.category === "heels") (groups[r.group_id] ??= []).push(r); }
    for (const [gid, rows] of Object.entries(groups)) {
      const prods = rows.map((r) => bySlug.get(r.product_slug)!).filter(Boolean);
      if (!prods.length) continue;
      prods.forEach((p) => used.add(p.slug));
      const first = prods[0].title.split(" ")[0];
      const name = prods.every((p) => p.title.startsWith(first)) ? `${first} heels` : prods[0].title;
      const children: Child[] = rows.map((r) => {
        const p = bySlug.get(r.product_slug)!;
        const sizes = sizesOf(p);
        return { key: p.slug, slug: p.slug, label: r.color_name, hex: r.color_hex || undefined, photos: [p.image, ...(p.images || [])].filter(Boolean),
          price: Number(p.price), mrp: Number(p.compare_price), active: p.active, stockKeys: sizes.length ? sizes : [NONE], product: p, sizes };
      });
      out.push({ key: "g:" + gid, name, category: "heels", photo: prods[0].image, products: prods, children, issues: [] });
    }

    for (const p of products) {
      if (used.has(p.slug)) continue;
      const own = rowsBySlug[p.slug] ?? [];
      const main = [p.image, ...(p.images || [])].filter(Boolean);
      let children: Child[] = [];
      if (p.variant_type === "color" && (p.variants || []).length) {
        children = p.variants.filter(Boolean).map((col) => {
          const sets = own.filter((r) => norm(r.color_name) === norm(col));
          const best = sets.map((r) => parseImgs(r.image)).sort((a, b) => b.length - a.length)[0] ?? [];
          return { key: `${p.slug}|${col}`, slug: p.slug, label: col, hex: sets[0]?.color_hex || undefined, photos: best.length ? best : [],
            price: Number(p.price), mrp: Number(p.compare_price), active: p.active, stockKeys: [col] };
        });
      } else if (p.variant_type === "size" && (p.variants || []).length) {
        children = [{ key: p.slug, slug: p.slug, label: "All colours", photos: main, price: Number(p.price), mrp: Number(p.compare_price), active: p.active, stockKeys: sizesOf(p), product: p, sizes: sizesOf(p) }];
      }
      out.push({ key: p.slug, name: p.title, category: p.category, photo: p.image || children.find((c) => c.photos[0])?.photos[0] || "", products: [p], children, issues: [] });
    }

    // Things to fix, like Amazon's "Fix" tab.
    for (const f of out) {
      for (const p of f.products) if (!p.image) f.issues.push(`${f.products.length > 1 ? p.title + ": " : ""}no main photo`);
      if (f.category !== "heels") {
        const p = f.products[0];
        const hasSets = colors.some((r) => r.product_slug === p.slug);
        const multi = f.children.length > 1;
        if (multi && !hasSets) f.issues.push("colours share the same photos (no colour photo sets)");
        else for (const c of f.children) if (hasSets && !c.photos.length) f.issues.push(`${c.label}: no photos`);
      }
    }
    return out.sort((a, b) => Number(b.products.some((p) => p.active)) - Number(a.products.some((p) => p.active)) || a.name.localeCompare(b.name));
  }, [products, colors]);

  const stockOf = (slug: string, key: string): number | undefined => inv[slug]?.[key];
  const totalStock = (f: Family): number | undefined => {
    let any = false, t = 0;
    const keys = f.children.length ? f.children.flatMap((c) => c.stockKeys.map((k) => [c.slug, k] as const)) : [[f.products[0].slug, NONE] as const];
    for (const [s, k] of keys) { const v = stockOf(s, k); if (v !== undefined) { any = true; t += v; } }
    return any ? t : undefined;
  };
  const setStock = (slug: string, key: string, raw: string) => {
    setInv((prev) => {
      const next = { ...prev, [slug]: { ...(prev[slug] || {}) } };
      if (raw === "") delete next[slug][key]; else next[slug][key] = Math.max(0, Math.floor(Number(raw) || 0));
      return next;
    });
    setDirty(true);
  };
  const saveStock = async () => {
    setSaving(true);
    try {
      if (dirty) { await saveSettingJson(INV_KEY, inv); setDirty(false); }
      if (cardsDirty) {
        await saveSettingJson(CARD_PHOTOS_KEY, cards); setCardsDirty(false);
        fetch("/api/revalidate", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }).catch(() => {});
      }
    } catch (e) { alert("Could not save: " + (e instanceof Error ? e.message : e)); }
    finally { setSaving(false); }
  };
  // Remembers the main photo it was picked against; changing the main photo later switches it off.
  const setCard = (slug: string, url: string | null, main = "") => {
    setCards((prev) => { const next = { ...prev }; if (url) next[slug] = { url, main }; else delete next[slug]; return next; });
    setCardsDirty(true);
  };

  const isLow = (f: Family) => { const t = totalStock(f); return t !== undefined && t <= 2; };
  const counts = {
    all: families.length,
    fix: families.filter((f) => f.issues.length).length,
    active: families.filter((f) => f.products.some((p) => p.active)).length,
    inactive: families.filter((f) => f.products.every((p) => !p.active)).length,
    low: families.filter(isLow).length,
  };
  const shown = families.filter((f) =>
    (cat === "all" || (cat === "heels" ? f.category === "heels" : f.category !== "heels")) &&
    (!q || f.name.toLowerCase().includes(q.toLowerCase()) || f.products.some((p) => p.slug.includes(q.toLowerCase()) || p.title.toLowerCase().includes(q.toLowerCase()))) &&
    (view === "all" || (view === "fix" && f.issues.length > 0) || (view === "active" && f.products.some((p) => p.active)) ||
      (view === "inactive" && f.products.every((p) => !p.active)) || (view === "low" && isLow(f))));

  const StockInput = ({ slug, k, label }: { slug: string; k: string; label?: string }) => (
    <label className="inline-flex items-center gap-1 text-[11px] text-gray-500">
      {label && <span className="w-6 text-right">{label}</span>}
      <input type="number" min={0} inputMode="numeric" value={stockOf(slug, k) ?? ""} onChange={(e) => setStock(slug, k, e.target.value)}
        placeholder="—" className={`w-14 px-2 py-1 border rounded text-xs text-gray-800 focus:outline-none focus:border-[#3B5373] ${stockOf(slug, k) === 0 ? "border-red-300 bg-red-50" : "border-gray-200"}`} />
    </label>
  );
  const Pill = ({ on }: { on: boolean }) => (
    <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${on ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{on ? "Active" : "Inactive"}</span>
  );
  const Sales = ({ k }: { k: string }) => {
    const s = sales[k];
    return s ? <span className="text-gray-800">{rs(s.amount)}<span className="block text-[11px] text-gray-400">{s.units} sold</span></span> : <span className="text-gray-300">—</span>;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {([["all", "All"], ["fix", "Fix"], ["active", "Active"], ["inactive", "Inactive"], ["low", "Low stock"]] as const).map(([id, label]) => (
          <button key={id} type="button" onClick={() => setView(id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border ${view === id ? "bg-[#3B5373] border-[#3B5373] text-white" : "bg-white border-gray-200 text-gray-600"}`}>
            {label} ({counts[id]})
          </button>
        ))}
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="border border-gray-200 text-xs px-3 py-1.5 text-gray-600 rounded-lg bg-white">
          <option value="all">All categories</option><option value="heels">Heels</option><option value="charms">Shoe charms</option>
        </select>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or link…" className="border border-gray-200 text-xs px-3 py-1.5 rounded-lg w-44" />
        <div className="ml-auto flex gap-2">
          {(dirty || cardsDirty) && (
            <button type="button" onClick={saveStock} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg disabled:opacity-50">
              <Save className="w-3.5 h-3.5" /> {saving ? "Saving…" : dirty && cardsDirty ? "Save changes" : dirty ? "Save stock" : "Save card photos"}
            </button>
          )}
          <button type="button" onClick={onAdd} className="flex items-center gap-1.5 px-4 py-2 bg-[#3B5373] text-white text-xs font-semibold rounded-lg"><Plus className="w-3.5 h-3.5" /> Add product</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-gray-400 border-b border-gray-100">
              <th className="px-4 py-3 w-8"></th>
              <th className="px-2 py-3">Product</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Sales · 30 days</th>
              <th className="px-3 py-3">Price</th>
              <th className="px-3 py-3">Stock</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((f) => {
              const isOpen = !!open[f.key];
              const single = f.products.length === 1 ? f.products[0] : null;
              const prices = f.products.map((p) => Number(p.price));
              const fSales = f.products.reduce((a, p) => ({ units: a.units + (sales[p.slug]?.units || 0), amount: a.amount + (sales[p.slug]?.amount || 0) }), { units: 0, amount: 0 });
              const t = totalStock(f);
              return (
                <Fragment key={f.key}>
                  <tr className={`border-b border-gray-50 ${isOpen ? "bg-gray-50/70" : "hover:bg-gray-50/50"}`}>
                    <td className="px-4 py-3 align-top">
                      {f.children.length > 0 && (
                        <button type="button" onClick={() => setOpen((o) => ({ ...o, [f.key]: !o[f.key] }))} className="text-gray-400 hover:text-[#3B5373]" aria-label={isOpen ? "Hide variations" : "Show variations"}>
                          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      )}
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-start gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {f.photo ? <img src={thumb(f.photo)} alt="" className="w-14 h-14 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                          : <div className="w-14 h-14 rounded-lg bg-gray-100 flex-shrink-0 grid place-items-center text-[10px] text-gray-400 text-center leading-tight">No<br />photo</div>}
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 leading-snug">{f.name}</p>
                          <p className="text-[11px] text-gray-400 truncate max-w-[280px]">{single ? single.slug : `${f.products.length} colours · ${f.products.map((p) => p.slug).join(", ")}`}</p>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{f.category === "heels" ? "Heels" : "Shoe charm"}</span>
                            {f.children.length > 0 && (
                              <button type="button" onClick={() => setOpen((o) => ({ ...o, [f.key]: !o[f.key] }))}
                                className="text-[10px] bg-[#3B5373] text-white px-2 py-0.5 rounded-full">Variations ({f.children.length})</button>
                            )}
                            {f.issues.length > 0 && (
                              <span title={f.issues.join("\n")} className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                                <AlertTriangle className="w-3 h-3" /> {f.issues.length} to fix
                              </span>
                            )}
                          </div>
                          {single && (
                            <div className="mt-1.5">
                              <button type="button" onClick={() => setPickCard(pickCard === single.slug ? null : single.slug)} className="text-[11px] text-[#3B5373] underline">
                                Shop card photo{cardPhotoFor(cards, single.slug, single.image, single.images) ? " · chosen" : " · main photo"}
                              </button>
                              {pickCard === single.slug && (
                                <div className="mt-1.5">
                                  <p className="text-[11px] text-gray-500 mb-1">Tap the photo to show first on shop cards (best: heel + clips on white). The main photo shows on hover.</p>
                                  <div className="flex gap-1 overflow-x-auto max-w-[420px] pb-1">
                                    {[single.image, ...(single.images || [])].filter((u, i, a) => u && a.indexOf(u) === i).map((u) => (
                                      <button key={u} type="button" onClick={() => setCard(single.slug, u === single.image ? null : u, single.image)} title="Use as card photo"
                                        className={`flex-shrink-0 rounded ${(cardPhotoFor(cards, single.slug, single.image, single.images) || single.image) === u ? "ring-2 ring-[#3B5373] ring-offset-1" : ""}`}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={thumb(u, 80)} alt="" loading="lazy" className="w-11 h-11 rounded object-cover bg-gray-100" />
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          {f.issues.length > 0 && isOpen && <ul className="mt-1.5 text-[11px] text-amber-700 list-disc pl-4">{f.issues.map((i) => <li key={i}>{i}</li>)}</ul>}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 align-top">
                      {single ? <Pill on={single.active} /> : <span className="text-xs text-gray-500">{f.products.filter((p) => p.active).length} of {f.products.length} active</span>}
                    </td>
                    <td className="px-3 py-3 align-top text-xs">{fSales.units ? <span className="text-gray-800">{rs(fSales.amount)}<span className="block text-[11px] text-gray-400">{fSales.units} sold</span></span> : <span className="text-gray-300">—</span>}</td>
                    <td className="px-3 py-3 align-top text-xs">
                      <span className="font-semibold text-gray-800">{Math.min(...prices) === Math.max(...prices) ? rs(prices[0]) : `${rs(Math.min(...prices))}–${rs(Math.max(...prices))}`}</span>
                      {single && Number(single.compare_price) > Number(single.price) && <span className="block text-[11px] text-gray-400 line-through">{rs(Number(single.compare_price))}</span>}
                    </td>
                    <td className="px-3 py-3 align-top text-xs">
                      {f.children.length === 0 ? <StockInput slug={f.products[0].slug} k={NONE} /> :
                        t === undefined ? <span className="text-gray-300">—</span> : <span className={t === 0 ? "text-red-600 font-semibold" : t <= 2 ? "text-amber-600 font-semibold" : "text-gray-800"}>{t} {t === 0 ? "· sold out" : t <= 2 ? "· low" : ""}</span>}
                    </td>
                    <td className="px-3 py-3 align-top">
                      {single && (
                        <div className="flex justify-end gap-1">
                          <button type="button" onClick={() => onToggle(single.slug)} title={single.active ? "Hide from website" : "Show on website"} className="p-1.5 text-gray-400 hover:text-[#3B5373]">{single.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button>
                          <button type="button" onClick={() => onEdit(single.slug)} className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 hover:border-[#3B5373]"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                        </div>
                      )}
                    </td>
                  </tr>

                  {isOpen && f.children.map((c) => (
                    <tr key={c.key} className="border-b border-gray-50 bg-gray-50/40">
                      <td></td>
                      <td className="px-2 py-3 pl-6">
                        <div className="flex items-start gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          {c.photos[0] ? <img src={thumb(c.photos[0])} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                            : <div className="w-12 h-12 rounded-lg bg-amber-50 border border-dashed border-amber-300 flex-shrink-0 grid place-items-center text-[9px] text-amber-700 text-center leading-tight">No<br />photos</div>}
                          <div className="min-w-0">
                            <p className="text-gray-800 text-[13px] flex items-center gap-1.5">
                              {c.hex && <span className="w-3 h-3 rounded-full border border-gray-200 inline-block" style={{ background: c.hex }} />}
                              {c.product ? c.product.title : c.label}
                              {c.product && <span className="text-[11px] text-gray-400">· {c.label}</span>}
                            </p>
                            <p className={`text-[11px] ${c.photos.length ? "text-gray-400" : "text-amber-700"}`}>{c.photos.length ? `${c.photos.length} photos` : "No photos for this colour yet"}{c.sizes?.length ? ` · sizes ${c.sizes.join(", ")}` : ""}</p>
                            {c.photos.length > 1 && (
                              <div className="flex gap-1 mt-1.5 overflow-x-auto max-w-[360px] pb-1">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                {c.photos.slice(0, 10).map((u, i) => <img key={i} src={thumb(u, 80)} alt="" loading="lazy" className="w-9 h-9 rounded object-cover bg-gray-100 flex-shrink-0" />)}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 align-top"><Pill on={c.active} /></td>
                      <td className="px-3 py-3 align-top text-xs"><Sales k={c.product ? c.slug : `${c.slug}|${norm(c.label)}`} /></td>
                      <td className="px-3 py-3 align-top text-xs">
                        <span className="text-gray-800">{rs(c.price)}</span>
                        {c.mrp > c.price && <span className="block text-[11px] text-gray-400 line-through">{rs(c.mrp)}</span>}
                      </td>
                      <td className="px-3 py-3 align-top">
                        <div className="flex flex-wrap gap-1.5 max-w-[260px]">
                          {c.sizes?.length ? c.sizes.map((s) => <StockInput key={s} slug={c.slug} k={s} label={s} />) : <StockInput slug={c.slug} k={c.stockKeys[0]} />}
                        </div>
                      </td>
                      <td className="px-3 py-3 align-top">
                        {c.product && f.products.length > 1 && (
                          <div className="flex justify-end gap-1">
                            <button type="button" onClick={() => onToggle(c.slug)} title={c.active ? "Hide from website" : "Show on website"} className="p-1.5 text-gray-400 hover:text-[#3B5373]">{c.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}</button>
                            <button type="button" onClick={() => onEdit(c.slug)} className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 hover:border-[#3B5373]"><Pencil className="w-3.5 h-3.5" /> Edit</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </Fragment>
              );
            })}
            {shown.length === 0 && <tr><td colSpan={7} className="p-10 text-center text-sm text-gray-400">No products here.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-gray-400">Stock 0 shows "Sold out" on the website and stops new orders for that colour or size. Empty = not tracked (always available). Sales count paid and pending orders from the last 30 days.</p>
    </div>
  );
}
