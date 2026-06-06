"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Lock, LogOut, RefreshCw, Package, IndianRupee, Clock,
  CheckCircle2, Truck, Home, AlertCircle, TrendingUp,
} from "lucide-react";
import { products } from "@/lib/products";

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: Array<{ title: string; quantity: number; price: number; variant?: string }>;
  total_amount: number;
  status: string;
  payment_method: string;
  created_at: string;
}

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];

const STATUS_STYLES: Record<string, string> = {
  pending:    "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped:    "bg-purple-100 text-purple-700",
  delivered:  "bg-emerald-100 text-emerald-700",
  cancelled:  "bg-red-100 text-red-700",
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  pending:    Clock,
  processing: Package,
  shipped:    Truck,
  delivered:  CheckCircle2,
  cancelled:  AlertCircle,
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"orders" | "products">("orders");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (authed) fetchOrders();
  }, [authed, fetchOrders]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === "classie@admin123") {
      setAuthed(true);
      setPwError("");
    } else {
      setPwError("Incorrect password. Please try again.");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } finally {
      setUpdatingId(null);
    }
  };

  // Stats
  const today = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.created_at).toDateString() === today);
  const todayRevenue = todayOrders.reduce((s, o) => s + o.total_amount, 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const totalRevenue = orders.reduce((s, o) => s + o.total_amount, 0);

  // ── Login screen ──
  if (!authed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#3D4F5F] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="font-serif text-3xl text-classie-black">Admin Login</h1>
            <p className="text-classie-gray text-sm mt-1">Classie Dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="bg-[#faf8f6] rounded-2xl p-8 space-y-4">
            <div>
              <label className="block text-xs font-medium text-classie-gray uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="Enter admin password"
                required
                className="w-full px-4 py-3 border border-classie-border rounded-xl text-sm focus:outline-none focus:border-[#3D4F5F] transition-colors"
              />
            </div>
            {pwError && (
              <p className="text-red-600 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> {pwError}
              </p>
            )}
            <button type="submit" className="btn-primary w-full py-3.5">
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ──
  return (
    <div className="min-h-screen bg-[#faf8f6]">
      {/* Top bar */}
      <div className="bg-[#3D4F5F] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="Classie" width={90} height={30} className="h-8 w-auto brightness-0 invert" />
          <span className="text-sm text-white/60 hidden sm:block">Admin Dashboard</span>
        </div>
        <button onClick={() => setAuthed(false)} className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Orders",    value: orders.length.toString(),                  icon: Package,      color: "text-[#3D4F5F]" },
            { label: "Total Revenue",   value: `₹${totalRevenue.toLocaleString("en-IN")}`, icon: IndianRupee,  color: "text-emerald-600" },
            { label: "Today's Revenue", value: `₹${todayRevenue.toLocaleString("en-IN")}`, icon: TrendingUp,   color: "text-blue-600" },
            { label: "Pending Orders",  value: pendingCount.toString(),                   icon: Clock,        color: "text-amber-600" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-classie-border">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-classie-gray uppercase tracking-wider">{label}</p>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className="text-2xl font-semibold text-classie-black">{value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["orders", "products"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                tab === t ? "bg-[#3D4F5F] text-white" : "bg-white text-classie-gray border border-classie-border hover:border-[#3D4F5F]"
              }`}
            >
              {t === "orders" ? `Orders (${orders.length})` : "Products"}
            </button>
          ))}
          {tab === "orders" && (
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="ml-auto flex items-center gap-2 px-4 py-2 text-sm text-classie-gray hover:text-[#3D4F5F] transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          )}
        </div>

        {/* Orders table */}
        {tab === "orders" && (
          <div className="bg-white rounded-2xl border border-classie-border overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-classie-gray text-sm">Loading orders…</div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center">
                <Package className="w-12 h-12 text-classie-border mx-auto mb-3" />
                <p className="text-classie-gray text-sm">No orders yet.</p>
                <p className="text-xs text-classie-gray mt-1">Orders will appear here once customers start checking out.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-classie-border bg-[#faf8f6]">
                      <th className="text-left px-5 py-3.5 text-xs uppercase tracking-wider text-classie-gray font-semibold">Order</th>
                      <th className="text-left px-5 py-3.5 text-xs uppercase tracking-wider text-classie-gray font-semibold">Customer</th>
                      <th className="text-left px-5 py-3.5 text-xs uppercase tracking-wider text-classie-gray font-semibold hidden md:table-cell">Items</th>
                      <th className="text-left px-5 py-3.5 text-xs uppercase tracking-wider text-classie-gray font-semibold">Amount</th>
                      <th className="text-left px-5 py-3.5 text-xs uppercase tracking-wider text-classie-gray font-semibold">Status</th>
                      <th className="text-left px-5 py-3.5 text-xs uppercase tracking-wider text-classie-gray font-semibold hidden lg:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const StatusIcon = STATUS_ICONS[order.status] ?? Clock;
                      return (
                        <tr key={order.id} className="border-b border-classie-border last:border-0 hover:bg-[#faf8f6] transition-colors">
                          <td className="px-5 py-4">
                            <p className="font-mono text-[11px] text-classie-gray">{order.id.slice(0, 8)}…</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-medium text-classie-black">{order.customer_name}</p>
                            <p className="text-xs text-classie-gray mt-0.5">{order.customer_phone}</p>
                            <p className="text-xs text-classie-gray">{order.city}, {order.state}</p>
                          </td>
                          <td className="px-5 py-4 hidden md:table-cell">
                            <div className="space-y-1 max-w-[200px]">
                              {order.items.slice(0, 2).map((item, i) => (
                                <p key={i} className="text-xs text-classie-gray truncate">
                                  {item.quantity}× {item.title}
                                  {item.variant ? ` (${item.variant})` : ""}
                                </p>
                              ))}
                              {order.items.length > 2 && (
                                <p className="text-xs text-[#3D4F5F]">+{order.items.length - 2} more</p>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-semibold text-classie-black">₹{order.total_amount.toLocaleString("en-IN")}</p>
                            <p className="text-[10px] uppercase text-classie-gray mt-0.5">{order.payment_method}</p>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5 mb-2">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                                <StatusIcon className="w-3 h-3" />
                                {order.status}
                              </span>
                            </div>
                            <select
                              value={order.status}
                              onChange={(e) => updateStatus(order.id, e.target.value)}
                              disabled={updatingId === order.id}
                              className="text-xs border border-classie-border rounded-lg px-2 py-1 focus:outline-none focus:border-[#3D4F5F] bg-white disabled:opacity-50"
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-5 py-4 hidden lg:table-cell">
                            <p className="text-xs text-classie-gray">
                              {new Date(order.created_at).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric",
                              })}
                            </p>
                            <p className="text-xs text-classie-gray">
                              {new Date(order.created_at).toLocaleTimeString("en-IN", {
                                hour: "2-digit", minute: "2-digit",
                              })}
                            </p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Products list */}
        {tab === "products" && (
          <div className="bg-white rounded-2xl border border-classie-border overflow-hidden">
            <div className="px-5 py-4 border-b border-classie-border bg-[#faf8f6] flex items-center justify-between">
              <p className="text-sm font-semibold text-classie-black">{products.length} Products</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-classie-border">
                    {["Product","Category","Price","Compare","Variants"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs uppercase tracking-wider text-classie-gray font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const disc = Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100);
                    return (
                      <tr key={p.slug} className="border-b border-classie-border last:border-0 hover:bg-[#faf8f6] transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-classie-light flex-shrink-0">
                              <Image src={p.image} alt={p.title} fill className="object-cover" sizes="40px" />
                            </div>
                            <div>
                              <p className="font-medium text-classie-black text-xs leading-snug">{p.title}</p>
                              <p className="text-[10px] text-classie-gray font-mono">{p.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3">
                          <span className="text-xs bg-[#faf8f6] text-classie-gray px-2 py-1 rounded-full capitalize">{p.collection}</span>
                        </td>
                        <td className="px-5 py-3 font-semibold text-classie-black text-xs">₹{p.price.toLocaleString("en-IN")}</td>
                        <td className="px-5 py-3 text-xs text-classie-gray line-through">₹{p.comparePrice.toLocaleString("en-IN")}</td>
                        <td className="px-5 py-3 text-xs text-classie-gray">
                          {p.variants.type !== "none" ? (
                            <span>{p.variants.type}: {p.variants.options.join(", ")}</span>
                          ) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
