"use client";

import { useCart } from "@/components/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

const suggested = products.slice(0, 4);

export default function CartPage() {
  const { items, count, total, updateQuantity, removeFromCart } = useCart();

  const shipping   = total >= 999 ? 0 : 99;
  const grandTotal = total + shipping;

  if (count === 0) {
    return (
      <>
        <div className="min-h-[55vh] flex flex-col items-center justify-center text-center px-4 py-16">
          <div className="w-24 h-24 rounded-full bg-[#faf8f6] flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-classie-border" />
          </div>
          <h1 className="font-serif text-4xl text-classie-black mb-3">Your cart is empty</h1>
          <p className="text-classie-gray text-sm mb-8 max-w-xs">
            Looks like you haven't added anything yet. Let's fix that!
          </p>
          <Link href="/shop/heels" className="btn-primary">Continue Shopping</Link>
        </div>

        {/* You may also like */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <h2 className="font-serif text-2xl md:text-3xl text-classie-black mb-8 text-center">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            {suggested.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-serif text-4xl text-classie-black mb-10">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.slug}-${item.variant}`} className="flex gap-4 p-4 border border-classie-border rounded-2xl bg-white">
              <div className="relative w-24 h-24 flex-shrink-0 bg-[#f5f5f5] rounded-xl overflow-hidden">
                <Image src={item.image} alt={item.title} fill className="object-cover object-center" sizes="96px" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-classie-black leading-snug">{item.title}</h3>
                    {item.variant && <p className="text-xs text-classie-gray mt-0.5">{item.variant}</p>}
                  </div>
                  <button onClick={() => removeFromCart(item.slug, item.variant)} className="text-classie-gray hover:text-red-500 transition-colors flex-shrink-0" aria-label="Remove">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-classie-border rounded-full overflow-hidden">
                    <button onClick={() => updateQuantity(item.slug, item.variant, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-classie-light transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.slug, item.variant, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-classie-light transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-sm font-semibold text-classie-black">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="border border-classie-border rounded-2xl p-6 bg-white sticky top-24">
            <h2 className="font-serif text-xl text-classie-black mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between">
                <span className="text-classie-gray">Subtotal ({count} items)</span>
                <span className="font-medium">₹{total.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-classie-gray">Shipping</span>
                <span className={shipping === 0 ? "text-emerald-600 font-medium" : "font-medium"}>
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-classie-gray bg-[#faf8f6] px-3 py-2 rounded-lg">
                  Add ₹{(999 - total).toLocaleString("en-IN")} more for free shipping
                </p>
              )}
              <div className="border-t border-classie-border pt-3 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="bg-[#faf8f6] rounded-xl px-4 py-3 text-xs text-classie-gray text-center mb-5">
              💳 Cash on Delivery Available
            </div>

            <Link href="/checkout" className="btn-primary w-full py-4 gap-2">
              Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/shop/heels" className="block text-center text-sm text-classie-gray hover:text-[#3B5373] mt-4 transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* You may also like */}
      <div className="mt-20">
        <h2 className="font-serif text-2xl md:text-3xl text-classie-black mb-8">You May Also Like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
          {suggested.filter((p) => !items.find((i) => i.slug === p.slug)).slice(0, 4).map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
