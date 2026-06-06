import { CartItem } from "./supabase";

const CART_KEY = "classie_cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(item: CartItem): CartItem[] {
  const cart = getCart();
  const key = `${item.slug}-${item.variant || ""}`;
  const existing = cart.find(
    (i) => `${i.slug}-${i.variant || ""}` === key
  );
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(slug: string, variant?: string): CartItem[] {
  const cart = getCart();
  const key = `${slug}-${variant || ""}`;
  const updated = cart.filter(
    (i) => `${i.slug}-${i.variant || ""}` !== key
  );
  saveCart(updated);
  return updated;
}

export function updateQuantity(
  slug: string,
  variant: string | undefined,
  quantity: number
): CartItem[] {
  const cart = getCart();
  const key = `${slug}-${variant || ""}`;
  const item = cart.find((i) => `${i.slug}-${i.variant || ""}` === key);
  if (item) {
    if (quantity <= 0) return removeFromCart(slug, variant);
    item.quantity = quantity;
  }
  saveCart(cart);
  return cart;
}

export function clearCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
