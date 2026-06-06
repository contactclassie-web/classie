"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, Truck, Home } from "lucide-react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id") || "—";

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
        </div>

        <h1 className="font-serif text-4xl text-classie-black mb-3">Order Placed!</h1>
        <p className="text-classie-gray text-base mb-6">
          Thank you for shopping with Classie. Your order has been confirmed.
        </p>

        <div className="bg-classie-light rounded-xl px-6 py-5 mb-8 text-left">
          <p className="text-xs uppercase tracking-widest text-classie-gray mb-1">Order ID</p>
          <p className="font-mono text-sm font-semibold text-classie-black break-all">{orderId}</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {[
            { icon: CheckCircle2, label: "Confirmed",  active: true },
            { icon: Package,      label: "Processing", active: false },
            { icon: Truck,        label: "Shipped",    active: false },
            { icon: Home,         label: "Delivered",  active: false },
          ].map(({ icon: Icon, label, active }, i, arr) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  active ? "bg-emerald-500 text-white" : "bg-classie-light text-classie-gray border border-classie-border"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] mt-1 text-classie-gray">{label}</span>
              </div>
              {i < arr.length - 1 && (
                <div className="w-8 h-px bg-classie-border mb-4" />
              )}
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg px-5 py-4 text-sm text-amber-800 mb-8 text-left">
          <p className="font-semibold mb-1">💰 Cash on Delivery</p>
          <p className="text-xs leading-relaxed">
            Please keep the exact amount ready at the time of delivery. Our delivery partner will collect payment when your order arrives.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop/heels" className="btn-primary">
            Continue Shopping
          </Link>
          <Link href="/track-order" className="btn-outline">
            Track Order
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-classie-gray text-sm">Loading…</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
