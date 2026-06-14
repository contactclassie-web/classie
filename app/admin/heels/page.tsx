"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Plus, ArrowLeft, ToggleLeft, ToggleRight, X } from "lucide-react";

interface HeelProduct {
  id: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  compare_price: number;
  heel_type?: string;
  tags?: string[];
  active: boolean;
  featured_tab?: string | null;
}

export default function HeelsAdminPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  const [products, setProducts] = useState<HeelProduct[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter types state
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const [newType, setNewType] = useState("");
  const [filterSaving, setFilterSaving] = useState(false);

  // Auth check — reuse main admin session, redirect if not logged in
  useEffect(() => {
    if (sessionStorage.getItem("classie_admin") === "ok") {
      setAuthed(true);
    } else {
      router.replace("/admin");
    }
  }, [router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [{ data: prods }, { data: setting }] = await Promise.all([
        supabase.from("products").select("*").eq("category", "heels").order("created_at", { ascending: false }),
        supabase.from("site_settings").select("value").eq("key", "heels_filter_heel_types").maybeSingle(),
      ]);
      if (prods) setProducts(prods as HeelProduct[]);
      if (setting?.value) {
        try { setFilterTypes(JSON.parse(setting.value)); } catch { setFilterTypes([]); }
      } else if (prods) {
        const types = new Set<string>();
        (prods as HeelProduct[]).forEach((p) => { if (p.heel_type) types.add(p.heel_type); });
        setFilterTypes(Array.from(types).sort());
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) fetchData();
  }, [authed]);

  const toggleActive = async (p: HeelProduct) => {
    await supabase.from("products").update({ active: !p.active }).eq("id", p.id);
    setProducts((prev) => prev.map((x) => x.id === p.id ? { ...x, active: !x.active } : x));
  };

  const saveFilterTypes = async (types: string[]) => {
    setFilterSaving(true);
    try {
      await supabase.from("site_settings").delete().eq("key", "heels_filter_heel_types");
      await supabase.from("site_settings").insert({ key: "heels_filter_heel_types", value: JSON.stringify(types) });
    } finally {
      setFilterSaving(false);
    }
  };

  const addFilterType = async () => {
    if (!newType.trim() || filterTypes.includes(newType.trim())) return;
    const updated = [...filterTypes, newType.trim()];
    setFilterTypes(updated);
    setNewType("");
    await saveFilterTypes(updated);
  };

  const removeFilterType = async (ht: string) => {
    const updated = filterTypes.filter((x) => x !== ht);
    setFilterTypes(updated);
    await saveFilterTypes(updated);
  };

  if (!authed) return null; // redirecting to /admin

  // ── Main UI ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/admin")} className="text-gray-400 hover:text-[#3B5373] transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-semibold text-gray-800">Heels Page Manager</h1>
              <p className="text-xs text-gray-400">Manage products & filters for /shop/heels</p>
            </div>
          </div>
          <a
            href="/shop/heels"
            target="_blank"
            className="text-xs text-[#3B5373] border border-[#3B5373] px-3 py-1.5 hover:bg-[#3B5373] hover:text-white transition-colors"
          >
            View Live Page →
          </a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading…</div>
        ) : (
          <>
            {/* ── Section 1: Products ──────────────────────────────── */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold text-gray-800">Heels on Page</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {products.filter((p) => p.active).length} showing ·{" "}
                    {products.filter((p) => !p.active).length} hidden
                  </p>
                </div>
                <button
                  onClick={() => router.push("/admin")}
                  className="flex items-center gap-1.5 text-xs text-[#3B5373] border border-[#3B5373] px-3 py-1.5 hover:bg-[#3B5373] hover:text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Product (via Catalog)
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="px-5 py-3 text-left text-[10px] tracking-widest uppercase text-gray-400 font-medium">Product</th>
                      <th className="px-5 py-3 text-left text-[10px] tracking-widest uppercase text-gray-400 font-medium hidden md:table-cell">Heel Type</th>
                      <th className="px-5 py-3 text-left text-[10px] tracking-widest uppercase text-gray-400 font-medium hidden md:table-cell">Tags</th>
                      <th className="px-5 py-3 text-left text-[10px] tracking-widest uppercase text-gray-400 font-medium">Price</th>
                      <th className="px-5 py-3 text-center text-[10px] tracking-widest uppercase text-gray-400 font-medium w-28">Show on Page</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p, i) => (
                      <tr key={p.id} className={`border-b border-gray-50 hover:bg-gray-50/80 transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.image} alt={p.title} className="w-12 h-12 object-cover object-top rounded flex-shrink-0" />
                            <div>
                              <p className="font-medium text-gray-800 text-sm leading-snug">{p.title}</p>
                              {p.featured_tab && (
                                <span className={`text-[9px] tracking-wider uppercase px-1.5 py-0.5 rounded mt-0.5 inline-block ${
                                  p.featured_tab === "latest" ? "bg-[#e8f0fe] text-blue-600" :
                                  p.featured_tab === "bestseller" ? "bg-[#fef3c7] text-yellow-700" :
                                  "bg-[#fee2e2] text-red-600"
                                }`}>
                                  {p.featured_tab}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-500 hidden md:table-cell">
                          {p.heel_type ?? <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-5 py-3.5 hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {(p.tags ?? []).map((t) => (
                              <span key={t} className="text-[9px] tracking-wider uppercase bg-[#f0ecff] text-[#3B5373] px-1.5 py-0.5 rounded">
                                {t}
                              </span>
                            ))}
                            {(!p.tags || p.tags.length === 0) && <span className="text-gray-300 text-xs">—</span>}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-700">
                          ₹{p.price?.toLocaleString("en-IN")}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <button
                            onClick={() => toggleActive(p)}
                            className="inline-flex items-center gap-1.5 transition-colors"
                          >
                            {p.active ? (
                              <ToggleRight className="w-8 h-8 text-[#3B5373]" />
                            ) : (
                              <ToggleLeft className="w-8 h-8 text-gray-300" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {products.length === 0 && (
                  <div className="p-12 text-center text-gray-400 text-sm">
                    No heels found. Add from{" "}
                    <button onClick={() => router.push("/admin")} className="text-[#3B5373] underline">
                      Catalog → Products
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ── Section 2: Filter Types ──────────────────────────── */}
            <div>
              <div className="mb-4">
                <h2 className="text-base font-semibold text-gray-800">Filter Sidebar — Heel Types</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Yeh options heels page ke filter sidebar mein dikhte hain. Add/remove karo.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                {/* Current tags */}
                <div className="flex flex-wrap gap-2 min-h-[36px]">
                  {filterTypes.map((ht) => (
                    <span
                      key={ht}
                      className="inline-flex items-center gap-2 bg-[#f0ecff] text-[#3B5373] text-xs font-medium px-3 py-1.5 rounded-full"
                    >
                      {ht}
                      <button
                        onClick={() => removeFilterType(ht)}
                        className="text-[#3B5373]/60 hover:text-red-500 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {filterTypes.length === 0 && (
                    <p className="text-xs text-gray-300">Koi filter type nahi hai abhi.</p>
                  )}
                </div>

                {/* Add new */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addFilterType()}
                    placeholder="e.g. Wedge Heel, Platform, Cone Heel…"
                    className="flex-1 border border-gray-200 text-sm px-4 py-2.5 focus:outline-none focus:border-[#3B5373] rounded"
                  />
                  <button
                    onClick={addFilterType}
                    disabled={filterSaving || !newType.trim()}
                    className="px-5 py-2.5 bg-[#3B5373] text-white text-sm font-medium hover:bg-[#2d3f4f] transition-colors disabled:opacity-50 rounded"
                  >
                    {filterSaving ? "Saving…" : "Add"}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400">
                  Enter dabao ya Add karo. Live filter sidebar turant update hoti hai.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
