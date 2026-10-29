"use client";

import { useMemo, useState } from "react";
import { Search, X, Phone, MessageCircle, MapPin, CreditCard, Copy } from "lucide-react";

// Orders list with search, status filters and a detail panel. Phones get
// cards; laptops get a table. Status changes go through onStatus.

export type BoardOrder = {
  id: string; customer_name: string; customer_phone: string; customer_email?: string;
  address: string; city: string; state: string; pincode: string;
  items: { slug?: string; title: string; quantity: number; price: number; variant?: string; image?: string }[];
  total_amount: number; status: string; payment_method: string; payment_id?: string; created_at: string;
};

const STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;
const LABEL: Record<string, string> = { pending: "New", processing: "Packing", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled" };
const STYLE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  processing: "bg-blue-50 text-blue-800 border-blue-200",
  shipped: "bg-violet-50 text-violet-800 border-violet-200",
  delivered: "bg-emerald-50 text-emerald-800 border-emerald-200",
  cancelled: "bg-gray-50 text-gray-500 border-gray-200",
};
const rs = (n: number) => "₹" + Math.round(Number(n) || 0).toLocaleString("en-IN");
const when = (iso: string) => new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const phone10 = (p: string) => (p || "").replace(/\D/g, "").slice(-10);

function Pill({ s }: { s: string }) {
  return <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full border ${STYLE[s] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>{LABEL[s] ?? s}</span>;
}

export default function OrdersBoard({ orders, loading, updatingId, onStatus }: {
  orders: BoardOrder[]; loading: boolean; updatingId: string | null; onStatus: (id: string, status: string) => void;
}) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("open");
  const [openId, setOpenId] = useState<string | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = { open: 0, all: orders.length };
    orders.forEach((o) => { c[o.status] = (c[o.status] || 0) + 1; if (o.status !== "cancelled") c.open++; });
    return c;
  }, [orders]);

  const shown = useMemo(() => {
    const t = q.trim().toLowerCase();
    return orders.filter((o) =>
      (filter === "all" || (filter === "open" ? o.status !== "cancelled" : o.status === filter)) &&
      (!t || [o.id, o.customer_name, o.customer_phone, o.city, o.customer_email ?? "", ...(o.items || []).map((i) => i.title)].join(" ").toLowerCase().includes(t)));
  }, [orders, q, filter]);

  const open = orders.find((o) => o.id === openId) || null;
  const chips: [string, string][] = [["open", "Open"], ["pending", "New"], ["processing", "Packing"], ["shipped", "Shipped"], ["delivered", "Delivered"], ["cancelled", "Cancelled"], ["all", "All"]];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <label className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, city, order ID or product"
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#3B5373]" />
        </label>
        <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] -mx-1 px-1">
          {chips.map(([id, label]) => (
            <button key={id} type="button" onClick={() => setFilter(id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs border ${filter === id ? "bg-[#3B5373] border-[#3B5373] text-white" : "bg-white border-gray-200 text-gray-600"}`}>
              {label} <span className="opacity-70 tabular-nums">{counts[id] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-gray-400 text-sm bg-white rounded-xl border border-gray-100">Loading orders…</div>
      ) : shown.length === 0 ? (
        <div className="p-12 text-center text-gray-400 text-sm bg-white rounded-xl border border-gray-100">{orders.length ? "No orders match." : "No orders yet."}</div>
      ) : (
        <>
          {/* Phone: cards */}
          <ul className="md:hidden space-y-2">
            {shown.map((o) => (
              <li key={o.id}>
                <button type="button" onClick={() => setOpenId(o.id)} className="w-full text-left bg-white rounded-xl border border-gray-100 p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-gray-800 truncate">{o.customer_name}</p>
                    <Pill s={o.status} />
                  </div>
                  <p className="text-xs text-gray-500 truncate">{(o.items || []).map((i) => `${i.quantity}× ${i.title}${i.variant ? ` (${i.variant})` : ""}`).join(", ")}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{o.city} · {when(o.created_at)}</span>
                    <span className="font-semibold text-gray-800 tabular-nums">{rs(o.total_amount)} <span className="font-normal uppercase text-[10px] text-gray-400">{o.payment_method?.split(" ")[0]}</span></span>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {/* Laptop: table */}
          <div className="hidden md:block bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60 text-left text-[11px] uppercase tracking-wider text-gray-400">
                  <th className="px-4 py-3 font-medium">Customer</th><th className="px-4 py-3 font-medium">Items</th>
                  <th className="px-4 py-3 font-medium">Total</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Placed</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((o) => (
                  <tr key={o.id} onClick={() => setOpenId(o.id)} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer">
                    <td className="px-4 py-3"><p className="font-medium text-gray-800">{o.customer_name}</p><p className="text-xs text-gray-400">{o.city}, {o.state}</p></td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-[280px]"><p className="truncate">{(o.items || []).map((i) => `${i.quantity}× ${i.title}${i.variant ? ` (${i.variant})` : ""}`).join(", ")}</p></td>
                    <td className="px-4 py-3"><p className="font-semibold text-gray-800 tabular-nums">{rs(o.total_amount)}</p><p className="text-[10px] uppercase text-gray-400">{o.payment_method?.split(" ")[0]}</p></td>
                    <td className="px-4 py-3"><Pill s={o.status} /></td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{when(o.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Detail panel */}
      {open && (
        <div className="fixed inset-0 z-[60]">
          <button type="button" aria-label="Close" onClick={() => setOpenId(null)} className="absolute inset-0 bg-black/30" />
          <aside role="dialog" aria-modal="true" aria-label="Order details" className="absolute right-0 top-0 h-full w-full max-w-[440px] bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <p className="font-semibold text-gray-800">{open.customer_name}</p>
                <button type="button" onClick={() => navigator.clipboard?.writeText(open.id).catch(() => {})} className="text-[11px] text-gray-400 font-mono inline-flex items-center gap-1" title="Copy order ID">
                  #{open.id.slice(0, 8)} <Copy className="w-3 h-3" />
                </button>
              </div>
              <button type="button" onClick={() => setOpenId(null)} aria-label="Close" className="p-1.5 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 text-sm">
              <div className="flex items-center gap-2">
                <label htmlFor="order-status" className="text-xs text-gray-500">Status</label>
                <select id="order-status" value={open.status} disabled={updatingId === open.id} onChange={(e) => onStatus(open.id, e.target.value)}
                  className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#3B5373] disabled:opacity-50">
                  {STATUSES.map((s) => <option key={s} value={s}>{LABEL[s]}</option>)}
                </select>
                <span className="text-xs text-gray-400 ml-auto">{when(open.created_at)}</span>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-wider text-gray-400">Items</p>
                {(open.items || []).map((it, i) => (
                  <div key={i} className="flex justify-between gap-3">
                    <span className="text-gray-700">{it.quantity}× {it.title}{it.variant ? <span className="text-gray-400"> · {it.variant}</span> : null}</span>
                    <span className="tabular-nums text-gray-700">{rs(it.price * it.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-gray-100 pt-2 font-semibold"><span>Total</span><span className="tabular-nums">{rs(open.total_amount)}</span></div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] uppercase tracking-wider text-gray-400">Payment</p>
                <p className="flex items-center gap-2 text-gray-700"><CreditCard className="w-4 h-4 text-gray-400" /> {open.payment_method}</p>
                {open.payment_id && <p className="text-xs font-mono text-gray-400 break-all">{open.payment_id}</p>}
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] uppercase tracking-wider text-gray-400">Deliver to</p>
                <p className="flex gap-2 text-gray-700"><MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" /><span>{open.address}, {open.city}, {open.state} {open.pincode}</span></p>
                <button type="button" onClick={() => navigator.clipboard?.writeText(`${open.customer_name}\n${open.address}\n${open.city}, ${open.state} ${open.pincode}\n${open.customer_phone}`).catch(() => {})}
                  className="text-xs text-[#3B5373] underline">Copy address for the courier</button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a href={`tel:+91${phone10(open.customer_phone)}`} className="inline-flex items-center justify-center gap-1.5 border border-gray-200 rounded-lg py-2 text-xs text-gray-700"><Phone className="w-3.5 h-3.5" /> {open.customer_phone}</a>
                <a href={`https://wa.me/91${phone10(open.customer_phone)}?text=${encodeURIComponent(`Hi ${open.customer_name.split(" ")[0]}, this is CLASSIE about your order #${open.id.slice(0, 8)}.`)}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 bg-[#1E7A4C] text-white rounded-lg py-2 text-xs"><MessageCircle className="w-3.5 h-3.5" /> WhatsApp</a>
              </div>

              {open.status === "delivered" && (() => {
                const links = (open.items || []).filter((it) => !!it.slug && !it.slug.startsWith("set-"))
                  .map((it) => `${it.title}: https://www.classie.co.in/products/${it.slug}#write-review`).join("\n");
                if (!links) return null;
                const msg = `Hi ${open.customer_name.split(" ")[0]}, thank you for shopping with CLASSIE! We hope you love your order. Could you rate it here? It really helps us:\n${links}\n\nA photo of you wearing it would make our day!`;
                return (
                  <a href={`https://wa.me/91${phone10(open.customer_phone)}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer"
                    className="block text-center border border-emerald-200 bg-emerald-50 text-emerald-800 rounded-lg py-2 text-xs font-medium">★ Ask for a review on WhatsApp</a>
                );
              })()}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
