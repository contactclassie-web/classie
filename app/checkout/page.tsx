"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import { Loader2, Lock, Tag, CheckCircle, XCircle, CreditCard, Truck } from "lucide-react";

const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
  "Puducherry","Chandigarh","Andaman & Nicobar Islands","Dadra & Nagar Haveli","Lakshadweep",
];

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal: { ondismiss: () => void };
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("online");

  // ── Coupon state ──────────────────────────────────────────────────────
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState<null | {
    valid: boolean;
    message?: string;
    error?: string;
    discount_amount?: number;
    coupon_id?: string;
    require_phone?: boolean;
    require_email?: boolean;
    discount_type?: string;
    discount_value?: number;
  }>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCouponId, setAppliedCouponId] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponResult(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
          phone: form.customer_phone || undefined,
          email: form.customer_email || undefined,
          order_value: total + (total >= 999 ? 0 : 99),
        }),
      });
      const data = await res.json();
      setCouponResult(data);
      if (data.valid) {
        setAppliedCouponId(data.coupon_id);
        setCouponDiscount(data.discount_amount || 0);
      } else {
        setAppliedCouponId(null);
        setCouponDiscount(0);
      }
    } catch {
      setCouponResult({ valid: false, error: "Could not apply coupon. Try again." });
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setCouponResult(null);
    setAppliedCouponId(null);
    setCouponDiscount(0);
  };

  const shipping = total >= 999 ? 0 : 99;
  const grandTotal = Math.max(0, total + shipping - couponDiscount);

  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    address: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ── Place order in DB ─────────────────────────────────────────────────
  const placeOrderInDB = async (paymentMethodStr: string, paymentId?: string) => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        items,
        total_amount: grandTotal,
        payment_method: paymentMethodStr,
        payment_id: paymentId || null,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to place order");
    return data;
  };

  // ── Record coupon usage ───────────────────────────────────────────────
  const recordCouponUsage = async (orderId: string) => {
    if (!appliedCouponId || couponDiscount <= 0) return;
    try {
      await fetch("/api/coupons/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupon_id: appliedCouponId,
          user_phone: form.customer_phone || null,
          user_email: form.customer_email || null,
          user_name: form.customer_name || null,
          order_id: orderId || null,
          order_total: total + shipping,
          discount_applied: couponDiscount,
          final_amount: grandTotal,
          products_json: items.map((item) => ({
            name: item.title,
            qty: item.quantity,
            price: item.price,
            variant: item.variant || null,
          })),
          items_count: items.reduce((sum, i) => sum + i.quantity, 0),
        }),
      });
    } catch {
      console.warn("Coupon usage record failed");
    }
  };

  // ── Load Razorpay script ──────────────────────────────────────────────
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window.Razorpay !== "undefined") { resolve(true); return; }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // ── Handle Online Payment ─────────────────────────────────────────────
  const handleOnlinePayment = async () => {
    setLoading(true);
    setError("");

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError("Payment gateway failed to load. Please try again.");
      setLoading(false);
      return;
    }

    try {
      // Create Razorpay order
      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: grandTotal }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.error || "Could not initiate payment");

      // Open Razorpay modal
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "CLASSIE™",
        description: `Order for ${items.length} item(s)`,
        order_id: orderData.id,
        prefill: {
          name: form.customer_name,
          email: form.customer_email || "",
          contact: form.customer_phone,
        },
        theme: { color: "#1a1a1a" },
        handler: async (response: RazorpayResponse) => {
          try {
            // Verify payment
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.verified) throw new Error("Payment verification failed");

            // Place order in DB
            const data = await placeOrderInDB("online", verifyData.payment_id);
            await recordCouponUsage(data.id);
            clearCart();
            router.push(`/order-success?id=${data.id}`);
          } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Payment verified but order failed. Contact support.");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      });

      rzp.open();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setLoading(false);
    }
  };

  // ── Handle COD ───────────────────────────────────────────────────────
  const handleCOD = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await placeOrderInDB("cod");
      await recordCouponUsage(data.id);
      clearCart();
      router.push(`/order-success?id=${data.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { setError("Your cart is empty."); return; }
    if (paymentMethod === "online") {
      await handleOnlinePayment();
    } else {
      await handleCOD();
    }
  };

  if (items.length === 0 && !loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
        <div>
          <h1 className="font-serif text-3xl text-classie-black mb-3">Nothing to checkout</h1>
          <p className="text-classie-gray text-sm mb-6">Add some items to your cart first.</p>
          <a href="/shop/heels" className="btn-primary">Shop Now</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-serif text-4xl text-classie-black mb-10">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Left: form */}
          <div className="lg:col-span-3 space-y-8">
            {/* Contact */}
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-classie-black mb-5 pb-3 border-b border-classie-border">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name *" name="customer_name" value={form.customer_name} onChange={handleChange} required />
                <Field label="Phone Number *" name="customer_phone" value={form.customer_phone} onChange={handleChange} type="tel" required pattern="[0-9]{10}" placeholder="10-digit mobile number" />
                <div className="sm:col-span-2">
                  <Field label="Email (Optional)" name="customer_email" value={form.customer_email} onChange={handleChange} type="email" />
                </div>
              </div>
            </section>

            {/* Shipping */}
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-classie-black mb-5 pb-3 border-b border-classie-border">
                Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-classie-gray uppercase tracking-wider mb-1.5">
                    Street Address *
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    rows={2}
                    placeholder="House no., building, street, area"
                    className="w-full px-4 py-3 border border-classie-border text-sm focus:outline-none focus:border-classie-black transition-colors resize-none"
                  />
                </div>
                <Field label="City *" name="city" value={form.city} onChange={handleChange} required />
                <div>
                  <label className="block text-xs font-medium text-classie-gray uppercase tracking-wider mb-1.5">
                    State *
                  </label>
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-classie-border text-sm focus:outline-none focus:border-classie-black transition-colors bg-white"
                  >
                    {INDIA_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <Field label="Pincode *" name="pincode" value={form.pincode} onChange={handleChange} required pattern="[0-9]{6}" placeholder="6-digit pincode" />
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-classie-black mb-5 pb-3 border-b border-classie-border">
                Payment Method
              </h2>
              <div className="space-y-3">
                {/* Online Payment */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("online")}
                  className={`w-full border-2 rounded-lg px-5 py-4 flex items-center gap-4 transition-all ${
                    paymentMethod === "online"
                      ? "border-classie-black bg-classie-black text-white"
                      : "border-classie-border bg-white text-classie-black hover:border-classie-black"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    paymentMethod === "online" ? "border-white" : "border-classie-gray"
                  }`}>
                    {paymentMethod === "online" && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                  <CreditCard className="w-5 h-5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-semibold">Pay Online</p>
                    <p className={`text-xs mt-0.5 ${paymentMethod === "online" ? "text-gray-300" : "text-classie-gray"}`}>
                      UPI, Cards, Net Banking, Wallets — Powered by Razorpay
                    </p>
                  </div>
                  {paymentMethod === "online" && (
                    <span className="ml-auto text-xs bg-white text-classie-black font-bold px-2 py-0.5 rounded">
                      RECOMMENDED
                    </span>
                  )}
                </button>

                {/* COD */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`w-full border-2 rounded-lg px-5 py-4 flex items-center gap-4 transition-all ${
                    paymentMethod === "cod"
                      ? "border-classie-black bg-classie-black text-white"
                      : "border-classie-border bg-white text-classie-black hover:border-classie-black"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    paymentMethod === "cod" ? "border-white" : "border-classie-gray"
                  }`}>
                    {paymentMethod === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </div>
                  <Truck className="w-5 h-5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-semibold">Cash on Delivery (COD)</p>
                    <p className={`text-xs mt-0.5 ${paymentMethod === "cod" ? "text-gray-300" : "text-classie-gray"}`}>
                      Pay when your order arrives at your door
                    </p>
                  </div>
                </button>
              </div>
            </section>
          </div>

          {/* Right: summary */}
          <div className="lg:col-span-2">
            <div className="border border-classie-border rounded-xl p-6 bg-white sticky top-24">
              <h2 className="font-serif text-xl text-classie-black mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.slug}-${item.variant}`} className="flex gap-3">
                    <div className="relative w-14 h-14 flex-shrink-0 rounded overflow-hidden bg-classie-light">
                      <Image src={item.image} alt={item.title} fill className="object-cover" sizes="56px" />
                      <span className="absolute -top-1 -right-1 bg-classie-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-classie-black truncate">{item.title}</p>
                      {item.variant && <p className="text-[11px] text-classie-gray">{item.variant}</p>}
                    </div>
                    <p className="text-xs font-semibold flex-shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              {/* ── Coupon input ── */}
              <div className="mb-5 border border-classie-border rounded-xl p-4 bg-[#faf9f7]">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-3.5 h-3.5 text-classie-gray" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-classie-black">Have a coupon?</p>
                </div>
                {appliedCouponId ? (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span className="text-xs text-emerald-700 font-medium">
                        {couponCode.toUpperCase()} — {couponResult?.message || `Saving ₹${couponDiscount}`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-[11px] text-classie-gray underline hover:text-red-500 flex-shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="ENTER CODE"
                        className="flex-1 px-3 py-2.5 border border-classie-border text-sm font-mono tracking-wider focus:outline-none focus:border-classie-black transition-colors uppercase"
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); applyCoupon(); } }}
                      />
                      <button
                        type="button"
                        onClick={applyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="px-4 py-2.5 bg-classie-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-classie-gray transition-colors disabled:opacity-50 flex-shrink-0"
                      >
                        {couponLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Apply"}
                      </button>
                    </div>
                    {couponResult && !couponResult.valid && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <XCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                        <p className="text-xs text-red-600">{couponResult.error}</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="space-y-2 text-sm border-t border-classie-border pt-4 mb-5">
                <div className="flex justify-between">
                  <span className="text-classie-gray">Subtotal</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-classie-gray">Shipping</span>
                  <span className={shipping === 0 ? "text-emerald-600 font-medium" : ""}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon Discount</span>
                    <span>−₹{couponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-base pt-2 border-t border-classie-border">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-classie-black text-white text-sm font-semibold tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-classie-gray transition-colors disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {paymentMethod === "online" ? "Processing Payment…" : "Placing Order…"}
                  </>
                ) : (
                  <>
                    {paymentMethod === "online" ? (
                      <><CreditCard className="w-4 h-4" /> Pay ₹{grandTotal.toLocaleString("en-IN")} Online</>
                    ) : (
                      <><Lock className="w-4 h-4" /> Place Order — COD</>
                    )}
                  </>
                )}
              </button>

              <p className="text-[11px] text-classie-gray text-center mt-3">
                By placing your order you agree to our{" "}
                <a href="/terms" className="underline">Terms of Service</a>
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({
  label, name, value, onChange, type = "text", required, pattern, placeholder,
}: {
  label: string; name: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; required?: boolean; pattern?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-classie-gray uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        pattern={pattern}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-classie-border text-sm focus:outline-none focus:border-classie-black transition-colors"
      />
    </div>
  );
}
