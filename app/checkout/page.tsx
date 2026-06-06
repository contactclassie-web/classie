"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import { Loader2, Lock } from "lucide-react";

const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
  "Puducherry","Chandigarh","Andaman & Nicobar Islands","Dadra & Nagar Haveli","Lakshadweep",
];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shipping = total >= 999 ? 0 : 99;
  const grandTotal = total + shipping;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items,
          total_amount: grandTotal,
          payment_method: "cod",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      clearCart();
      router.push(`/order-success?id=${data.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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

            {/* Payment */}
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-classie-black mb-5 pb-3 border-b border-classie-border">
                Payment Method
              </h2>
              <div className="border-2 border-classie-black rounded-lg px-5 py-4 flex items-center gap-4">
                <div className="w-5 h-5 rounded-full bg-classie-black flex items-center justify-center flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-classie-black">Cash on Delivery (COD)</p>
                  <p className="text-xs text-classie-gray mt-0.5">Pay when your order arrives at your door</p>
                </div>
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
                    Placing Order…
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Place Order — COD
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
