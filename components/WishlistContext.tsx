"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface WishlistContextType {
  wishlist: string[];
  toggle: (slug: string) => void;
  isWished: (slug: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  toggle: () => {},
  isWished: () => false,
  count: 0,
});

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("classie_wishlist");
      if (saved) setWishlist(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const toggle = useCallback((slug: string) => {
    setWishlist((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      try { localStorage.setItem("classie_wishlist", JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const isWished = useCallback((slug: string) => wishlist.includes(slug), [wishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, isWished, count: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
