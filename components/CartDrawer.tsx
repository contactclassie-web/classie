"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Check, Minus, Plus, Trash2, Truck } from "lucide-react";
import { useCart } from "@/components/CartContext";
import { useShippingRules } from "@/lib/useShipping";
import { isGiftSet } from "@/lib/orderTotals";
import { freeShippingFrom } from "@/lib/shipping";
import { useCartPhotos } from "@/lib/useCartPhotos";

const rs = (n: number) => "₹" + n.toLocaleString("en-IN");

// Slide-in bag shown right after "Add to cart": what was added, the subtotal,
// how much more is needed for free delivery (same rules as cart and checkout),
// and a Checkout button.
export default function CartDrawer() {
  const { items, total, drawerOpen, closeDrawer, updateQuantity, removeFromCart } = useCart();
  const pathname = usePathname();

  // Close when the page changes (e.g. after tapping Checkout).
  useEffect(() => { closeDrawer(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeDrawer(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [drawerOpen, closeDrawer]);

  useEffect(() => { if (drawerOpen && items.length === 0) closeDrawer(); }, [drawerOpen, items.length, closeDrawer]);

  // The admin has no shopping bag.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <div aria-hidden={!drawerOpen} className={`fixed inset-0 z-[200] overflow-hidden ${drawerOpen ? "" : "pointer-events-none"}`}>
      <div
        onClick={closeDrawer}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        className={`absolute right-0 top-0 h-full w-full max-w-[400px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {drawerOpen && <DrawerBody items={items} total={total} onClose={closeDrawer} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />}
      </aside>
    </div>
  );
}

function DrawerBody({ items, total, onClose, updateQuantity, removeFromCart }: {
  items: ReturnType<typeof useCart>["items"];
  total: number;
  onClose: () => void;
  updateQuantity: ReturnType<typeof useCart>["updateQuantity"];
  removeFromCart: ReturnType<typeof useCart>["removeFromCart"];
}) {
  const rules = useShippingRules();
  const photoFor = useCartPhotos(items);
  const hasSet = items.some((i) => isGiftSet(i.slug));
  const freeFrom = freeShippingFrom(rules);
  const toFree = !hasSet && freeFrom != null ? Math.max(0, freeFrom - total) : 0;
  const progress = hasSet || !freeFrom ? 100 : Math.min(100, Math.round((total / freeFrom) * 100));

  return (
    <>
      <div className="flex items-center justify-between px-5 py-4 border-b border-classie-border">
        <p className="flex items-center gap-2 text-sm font-medium text-classie-black">
          <span className="w-6 h-6 rounded-full bg-[#3B5373] text-white flex items-center justify-center"><Check className="w-3.5 h-3.5" /></span>
          Added to your bag
        </p>
        <button onClick={onClose} aria-label="Close" className="p-1.5 text-classie-gray hover:text-classie-black">
          <X className="w-5 h-5" />
        </button>
      </div>

      {freeFrom != null && (
        <div className="px-5 py-3 bg-[#faf8f6] border-b border-classie-border">
          <p className="flex items-center gap-2 text-[13px] text-classie-black">
            <Truck className="w-4 h-4 text-[#3B5373] shrink-0" />
            {hasSet
              ? "Your gift set ships FREE"
              : toFree > 0
              ? <span>Add <strong>{rs(toFree)}</strong> more for <strong>FREE delivery</strong></span>
              : <span>You have unlocked <strong>FREE delivery</strong></span>}
          </p>
          <div className="mt-2 h-1.5 rounded-full bg-classie-border overflow-hidden">
            <div className="h-full bg-[#3B5373] transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <ul className="flex-1 overflow-y-auto px-5 divide-y divide-classie-border">
        {items.map((it) => (
          <li key={`${it.slug}-${it.variant ?? ""}`} className="flex gap-3 py-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoFor(it)} alt={it.title} className="w-16 h-20 object-cover bg-[#faf8f6] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-classie-black leading-snug line-clamp-2">{it.title}</p>
              {it.variant && <p className="text-xs text-classie-gray mt-0.5">{it.variant}</p>}
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center border border-classie-border">
                  <button aria-label="Less" onClick={() => it.quantity > 1 ? updateQuantity(it.slug, it.variant, it.quantity - 1) : removeFromCart(it.slug, it.variant)} className="p-1.5"><Minus className="w-3 h-3" /></button>
                  <span className="w-7 text-center text-xs">{it.quantity}</span>
                  <button aria-label="More" onClick={() => updateQuantity(it.slug, it.variant, it.quantity + 1)} className="p-1.5"><Plus className="w-3 h-3" /></button>
                </div>
                <span className="text-sm font-medium text-classie-black">{rs(it.price * it.quantity)}</span>
              </div>
            </div>
            <button aria-label="Remove" onClick={() => removeFromCart(it.slug, it.variant)} className="self-start p-1 text-classie-gray hover:text-classie-black">
              <Trash2 className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>

      <div className="border-t border-classie-border px-5 py-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-classie-gray">Subtotal</span>
          <span className="font-medium text-classie-black">{rs(total)}</span>
        </div>
        <Link href="/checkout" className="block w-full text-center bg-[#3B5373] hover:bg-[#2d3f4f] text-white text-xs font-semibold uppercase tracking-[0.15em] py-3.5">
          Checkout · {rs(total)}
        </Link>
        <div className="flex gap-3">
          <Link href="/cart" className="flex-1 text-center border border-classie-border text-classie-black text-[11px] uppercase tracking-widest py-2.5">View bag</Link>
          <button onClick={onClose} className="flex-1 text-center border border-classie-border text-classie-black text-[11px] uppercase tracking-widest py-2.5">Keep shopping</button>
        </div>
      </div>
    </>
  );
}
