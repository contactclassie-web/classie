"use client";

import { useState } from "react";
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const STATUS_STEPS = ["pending","processing","shipped","delivered"];
const STATUS_LABELS: Record<string, string> = {
  pending:    "Order Confirmed",
  processing: "Being Prepared",
  shipped:    "Out for Delivery",
  delivered:  "Delivered",
  cancelled:  "Cancelled",
};
const STATUS_ICONS: Record<string, React.ElementType> = {
  pending: Clock, processing: Package, shipped: Truck, delivered: CheckCircle2, cancelled: AlertCircle,
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<null | {
    id: string; customer_name: string; status: string;
    total_amount: number; created_at: string;
    items: Array<{ title: string; quantity: number; price: number }>;
  }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setOrder(null); setLoading(true);
    try {
      const res = await fetch(`/api/orders?id=${encodeURIComponent(orderId.trim())}`);
      if (!res.ok) { setError("Order not found. Please check your Order ID."); return; }
      setOrder(await res.json());
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  const stepIdx = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <>
      <div className="bg-[#faf8f6] py-12 text-center border-b border-classie-border">
        <p className="text-[11px] tracking-[0.5em] uppercase text-classie-gray mb-2">Real-time tracking</p>
        <h1 className="font-serif text-5xl md:text-6xl text-classie-black">Track My Order</h1>
      </div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-14">
        <form onSubmit={handleTrack} className="flex gap-3 mb-8">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter your Order ID"
            required
            className="flex-1 px-4 py-3 border border-classie-border rounded-xl text-sm focus:outline-none focus:border-[#3B5373] transition-colors"
          />
          <button type="submit" disabled={loading} className="btn-primary gap-2 disabled:opacity-60">
            <Search className="w-4 h-4" /> {loading ? "…" : "Track"}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        {order && (
          <div className="bg-white rounded-2xl border border-classie-border p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-classie-gray">Order ID</p>
                <p className="font-mono text-sm font-semibold mt-0.5">{order.id.slice(0, 16)}…</p>
                <p className="text-xs text-classie-gray mt-1">
                  Placed {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-widest text-classie-gray">Total</p>
                <p className="font-semibold text-classie-black mt-0.5">₹{order.total_amount.toLocaleString("en-IN")}</p>
              </div>
            </div>

            {/* Status stepper */}
            {order.status !== "cancelled" ? (
              <div className="flex items-start gap-0 mb-8 overflow-x-auto">
                {STATUS_STEPS.map((step, i) => {
                  const Icon = STATUS_ICONS[step];
                  const done = i <= stepIdx;
                  const active = i === stepIdx;
                  return (
                    <div key={step} className="flex items-start flex-1 min-w-0">
                      <div className="flex flex-col items-center flex-1">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                          active ? "bg-[#3B5373] text-white shadow-lg" :
                          done  ? "bg-emerald-500 text-white" :
                                  "bg-[#faf8f6] text-classie-gray border border-classie-border"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <p className={`text-[10px] mt-2 text-center leading-tight px-1 ${done ? "text-classie-black font-medium" : "text-classie-gray"}`}>
                          {STATUS_LABELS[step]}
                        </p>
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`h-px flex-1 mt-4 mx-1 ${i < stepIdx ? "bg-emerald-400" : "bg-classie-border"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 mb-6 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> This order has been cancelled.
              </div>
            )}

            {/* Items */}
            <div className="border-t border-classie-border pt-5">
              <p className="text-xs uppercase tracking-widest text-classie-gray mb-3">Items Ordered</p>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-classie-black">{item.quantity}× {item.title}</span>
                    <span className="text-classie-gray">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-classie-gray mt-8">
          Need help?{" "}
          <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="text-[#3B5373] underline">
            WhatsApp us
          </a>{" "}
          or{" "}
          <a href="mailto:hello@classie.co.in" className="text-[#3B5373] underline">
            email us
          </a>
        </p>
      </div>
    </>
  );
}
