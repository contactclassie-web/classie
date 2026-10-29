"use client";

import { useEffect, useMemo, useState } from "react";
import { Package, MessageSquare, PenTool, Star, AlertTriangle, Plus, Tag, Home, ExternalLink, ArrowRight } from "lucide-react";
import { adminSupabase as supabase } from "@/lib/adminSupabase";
import { loadSettingJson } from "@/lib/adminSettings";
import { REQUEST_TAG } from "@/lib/customDesigns";

// Admin home, organised like a store admin's "today" page: what needs doing
// first, then how the store is doing, then shortcuts.

type HomeOrder = {
  id: string; customer_name: string; city: string; total_amount: number; status: string; created_at: string;
  items: { slug?: string; title: string; quantity: number; price: number; variant?: string }[];
};
type HomeProduct = { slug: string; title: string; image?: string; active?: boolean; variants?: string[]; variant_type?: string };
type Inventory = Record<string, Record<string, number>>;

const rs = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
const DAY = 864e5;
const isLive = (o: HomeOrder) => !/cancel|fail|refund/i.test(o.status || "");

export default function AdminHome({
  orders, products, pendingReviews, messagesCount, ordersLoading, onGo, onAddProduct,
}: {
  orders: HomeOrder[];
  products: HomeProduct[];
  pendingReviews: number;
  messagesCount: number;
  ordersLoading: boolean;
  onGo: (tab: string) => void;
  onAddProduct: () => void;
}) {
  const [range, setRange] = useState<7 | 30>(30);
  const [inv, setInv] = useState<Inventory>({});
  const [requests, setRequests] = useState<number | null>(null);
  const [funnel, setFunnel] = useState<{ visitors: number; carts: number; checkouts: number } | null>(null);

  useEffect(() => {
    loadSettingJson("inventory_v1").then(({ value }) => { if (value && typeof value === "object") setInv(value as Inventory); });
    const since7 = new Date(Date.now() - 7 * DAY).toISOString();
    supabase.from("contact_submissions").select("id", { count: "exact", head: true })
      .ilike("message", `${REQUEST_TAG}%`).gte("created_at", since7)
      .then(({ count }) => setRequests(count ?? 0));
  }, []);

  // Visitors → add to cart → checkout, for the chosen range (distinct sessions).
  useEffect(() => {
    let alive = true;
    const since = new Date(Date.now() - range * DAY).toISOString();
    supabase.from("analytics_events").select("session_id,event_type")
      .in("event_type", ["page_view", "add_to_cart", "begin_checkout"])
      .not("path", "like", "/admin%").not("session_id", "is", null).gte("created_at", since).limit(20000)
      .then(({ data }) => {
        if (!alive) return;
        const sets = { page_view: new Set<string>(), add_to_cart: new Set<string>(), begin_checkout: new Set<string>() } as Record<string, Set<string>>;
        (data ?? []).forEach((r: { session_id: string; event_type: string }) => sets[r.event_type]?.add(r.session_id));
        setFunnel({ visitors: sets.page_view.size, carts: sets.add_to_cart.size, checkouts: sets.begin_checkout.size });
      });
    return () => { alive = false; };
  }, [range]);

  const now = Date.now();
  const inRange = useMemo(() => orders.filter((o) => isLive(o) && now - new Date(o.created_at).getTime() < range * DAY), [orders, range, now]);
  const sales = inRange.reduce((s, o) => s + Number(o.total_amount || 0), 0);
  const aov = inRange.length ? sales / inRange.length : 0;
  const toPack = orders.filter((o) => o.status === "pending" || o.status === "processing");

  // Daily sales bars for the range.
  const days = useMemo(() => {
    const out: { label: string; total: number }[] = [];
    for (let i = range - 1; i >= 0; i--) {
      const d = new Date(now - i * DAY);
      const key = d.toDateString();
      const total = inRange.filter((o) => new Date(o.created_at).toDateString() === key).reduce((s, o) => s + Number(o.total_amount || 0), 0);
      out.push({ label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }), total });
    }
    return out;
  }, [inRange, range, now]);
  const maxDay = Math.max(1, ...days.map((d) => d.total));

  const best = useMemo(() => {
    const m = new Map<string, { title: string; units: number; amount: number }>();
    inRange.forEach((o) => (o.items || []).forEach((it) => {
      const k = it.slug || it.title;
      const row = m.get(k) ?? { title: it.title, units: 0, amount: 0 };
      row.units += Number(it.quantity) || 1; row.amount += (Number(it.quantity) || 1) * (Number(it.price) || 0);
      m.set(k, row);
    }));
    return Array.from(m.values()).sort((a, b) => b.amount - a.amount).slice(0, 5);
  }, [inRange]);

  // Stock: sold-out and low (1–2) options among active products.
  const stock = useMemo(() => {
    const out: { slug: string; title: string; option: string; qty: number }[] = [];
    products.filter((p) => p.active !== false).forEach((p) => {
      Object.entries(inv[p.slug] || {}).forEach(([opt, qty]) => {
        if (typeof qty === "number" && qty <= 2) out.push({ slug: p.slug, title: p.title, option: opt === "_" ? "" : opt, qty });
      });
    });
    return out.sort((a, b) => a.qty - b.qty);
  }, [products, inv]);

  const tasks = [
    { n: toPack.length, label: "Orders to pack", sub: "New and processing", icon: Package, go: "orders" },
    { n: requests ?? 0, label: "Custom design requests", sub: "Last 7 days", icon: PenTool, go: "custom-requests" },
    { n: messagesCount, label: "Messages", sub: "Contact form inbox", icon: MessageSquare, go: "messages" },
    { n: pendingReviews, label: "Reviews to approve", sub: "Shown after you approve", icon: Star, go: "products" },
    { n: stock.length, label: "Low or sold out", sub: "Stock 2 or less", icon: AlertTriangle, go: "products" },
  ];

  const hello = (() => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; })();
  const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : "—");

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
          <h2 className="text-2xl font-semibold text-gray-800 mt-1">{hello}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onAddProduct} className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#3B5373] text-white text-xs font-semibold rounded-lg"><Plus className="w-3.5 h-3.5" /> Add product</button>
          <button type="button" onClick={() => onGo("hd-coupons")} className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 bg-white text-gray-700 text-xs font-medium rounded-lg"><Tag className="w-3.5 h-3.5" /> New coupon</button>
          <button type="button" onClick={() => onGo("home-layout")} className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 bg-white text-gray-700 text-xs font-medium rounded-lg"><Home className="w-3.5 h-3.5" /> Edit homepage</button>
          <a href="/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 bg-white text-gray-700 text-xs font-medium rounded-lg"><ExternalLink className="w-3.5 h-3.5" /> View website</a>
        </div>
      </div>

      {/* To do */}
      <section>
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 mb-2.5">To do</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
          {tasks.map(({ n, label, sub, icon: Icon, go }) => (
            <button key={label} type="button" onClick={() => onGo(go)}
              className={`text-left rounded-xl border p-4 transition-colors ${n > 0 ? "bg-white border-[#3B5373]/25 hover:border-[#3B5373]" : "bg-white/60 border-gray-100 hover:border-gray-200"}`}>
              <div className="flex items-center justify-between">
                <Icon className={`w-4 h-4 ${n > 0 ? "text-[#3B5373]" : "text-gray-300"}`} />
                {n > 0 && <span className="w-2 h-2 rounded-full bg-amber-500" aria-hidden />}
              </div>
              <p className={`text-2xl font-semibold mt-3 tabular-nums ${n > 0 ? "text-gray-800" : "text-gray-300"}`}>{n}</p>
              <p className="text-[13px] font-medium text-gray-700 leading-snug">{label}</p>
              <p className="text-[11px] text-gray-400">{sub}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Performance */}
      <section className="bg-white rounded-xl border border-gray-100 p-4 md:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">How the store is doing</h3>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            {([7, 30] as const).map((r) => (
              <button key={r} type="button" onClick={() => setRange(r)} className={`px-3 py-1 text-xs rounded-md ${range === r ? "bg-white shadow-sm text-gray-800 font-medium" : "text-gray-500"}`}>{r} days</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            ["Sales", rs(sales), "Excl. cancelled"],
            ["Orders", String(inRange.length), ""],
            ["Avg. order", inRange.length ? rs(aov) : "—", ""],
            ["Visitors", funnel ? funnel.visitors.toLocaleString("en-IN") : "…", "Unique sessions"],
            ["Bought", funnel ? pct(inRange.length, funnel.visitors) : "…", "Orders ÷ visitors"],
          ].map(([l, v, s]) => (
            <div key={l}>
              <p className="text-[11px] text-gray-400">{l}</p>
              <p className="text-xl font-semibold text-gray-800 tabular-nums mt-0.5">{ordersLoading && l !== "Visitors" ? "…" : v}</p>
              {s && <p className="text-[10.5px] text-gray-400">{s}</p>}
            </div>
          ))}
        </div>

        {/* Sales by day */}
        {sales === 0 ? (
          <p className="mt-5 rounded-lg bg-gray-50 px-4 py-6 text-center text-sm text-gray-400">No sales in the last {range} days yet. The daily chart appears with the first order.</p>
        ) : (
        <div className="mt-5" role="img" aria-label={`Sales per day, last ${range} days`}>
          <div className="flex items-end gap-[2px] h-24 border-b border-gray-100">
            {days.map((d, i) => (
              <div key={i} className="flex-1 h-full flex items-end" title={`${d.label}: ${rs(d.total)}`}>
                <div className={`w-full rounded-t-sm ${d.total > 0 ? "bg-[#3B5373]" : "bg-gray-100"}`} style={{ height: d.total > 0 ? `${Math.max(6, (d.total / maxDay) * 100)}%` : "3px" }} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>{days[0]?.label}</span><span>Today</span></div>
        </div>
        )}

        {/* Funnel */}
        {funnel && (
          <div className="grid grid-cols-3 gap-2 mt-5 text-center">
            {[["Visited", funnel.visitors], ["Added to bag", funnel.carts], ["Started checkout", funnel.checkouts]].map(([l, n], i) => (
              <div key={l as string} className="rounded-lg bg-gray-50 px-2 py-2.5">
                <p className="text-lg font-semibold text-gray-800 tabular-nums">{(n as number).toLocaleString("en-IN")}</p>
                <p className="text-[11px] text-gray-500">{l}{i > 0 ? ` · ${pct(n as number, funnel.visitors)}` : ""}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Orders to pack */}
        <section className="bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Orders to pack</h3>
            <button type="button" onClick={() => onGo("orders")} className="text-xs text-[#3B5373] inline-flex items-center gap-1">All orders <ArrowRight className="w-3 h-3" /></button>
          </div>
          {toPack.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-400">Nothing to pack. New orders show here first.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {toPack.slice(0, 6).map((o) => (
                <li key={o.id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{o.customer_name} <span className="text-gray-400 font-normal">· {o.city}</span></p>
                    <p className="text-xs text-gray-400 truncate">{(o.items || []).map((it) => `${it.quantity}× ${it.title}${it.variant ? ` (${it.variant})` : ""}`).join(", ")}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gray-800 tabular-nums">{rs(o.total_amount)}</p>
                    <p className="text-[11px] text-gray-400">{new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Best sellers + stock */}
        <section className="bg-white rounded-xl border border-gray-100">
          <div className="px-4 py-3 border-b border-gray-100"><h3 className="text-sm font-semibold text-gray-700">Best sellers · {range} days</h3></div>
          {best.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-400">No sales in this period yet.</p>
          ) : (
            <ul className="divide-y divide-gray-50">
              {best.map((b) => (
                <li key={b.title} className="px-4 py-2.5 flex justify-between gap-3 text-sm">
                  <span className="truncate text-gray-700">{b.title}</span>
                  <span className="shrink-0 text-gray-500 tabular-nums">{b.units} sold · {rs(b.amount)}</span>
                </li>
              ))}
            </ul>
          )}
          {stock.length > 0 && (
            <>
              <div className="px-4 py-3 border-y border-gray-100 bg-amber-50/40"><h3 className="text-sm font-semibold text-amber-800">Low or sold out</h3></div>
              <ul className="divide-y divide-gray-50">
                {stock.slice(0, 6).map((s) => (
                  <li key={`${s.slug}|${s.option}`} className="px-4 py-2.5 flex justify-between gap-3 text-sm">
                    <span className="truncate text-gray-700">{s.title}{s.option ? ` · ${s.option}` : ""}</span>
                    <span className={`shrink-0 text-xs font-semibold ${s.qty === 0 ? "text-red-600" : "text-amber-700"}`}>{s.qty === 0 ? "Sold out" : `${s.qty} left`}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
