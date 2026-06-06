"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem } from "@/lib/supabase";
import {
  getCart,
  addToCart as addItem,
  removeFromCart as removeItem,
  updateQuantity as updateQty,
  clearCart as clear,
  getCartTotal,
  getCartCount,
} from "@/lib/cart";

interface CartContextType {
  items: CartItem[];
  count: number;
  total: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (slug: string, variant?: string) => void;
  updateQuantity: (slug: string, variant: string | undefined, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const addToCart = (item: CartItem) => {
    const updated = addItem(item);
    setItems([...updated]);
  };

  const removeFromCart = (slug: string, variant?: string) => {
    const updated = removeItem(slug, variant);
    setItems([...updated]);
  };

  const updateQuantity = (slug: string, variant: string | undefined, qty: number) => {
    const updated = updateQty(slug, variant, qty);
    setItems([...updated]);
  };

  const clearCart = () => {
    clear();
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        count: getCartCount(items),
        total: getCartTotal(items),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
