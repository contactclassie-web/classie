"use client";
import { useWishlist } from "@/components/WishlistContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { getProductBySlugFromDB, Product } from "@/lib/products";
import { optimizeCloudinary } from "@/lib/cloudinary";
import { useCart } from "@/components/CartContext";

export default function WishlistPage() {
  const { wishlist, toggle } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlist.length === 0) { setLoading(false); setProducts([]); return; }
    setLoading(true);
    Promise.all(wishlist.map((slug) => getProductBySlugFromDB(slug)))
      .then((results) => setProducts(results.filter(Boolean) as Product[]))
      .finally(() => setLoading(false));
  }, [wishlist]);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="font-serif text-3xl md:text-4xl text-[#1a1a1a] font-light mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
            My Wishlist
          </h1>
          <p className="text-sm text-gray-500">{wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#3B5373] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" strokeWidth={1} />
            <p className="text-gray-400 text-base mb-6">Your wishlist is empty</p>
            <Link href="/shop/heels" className="inline-block px-8 py-3 bg-[#3B5373] text-white text-sm tracking-widest uppercase hover:bg-[#2d3f4f] transition-colors">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => {
              const discount = product.comparePrice > product.price
                ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                : 0;
              return (
                <div key={product.slug} className="group relative">
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="relative overflow-hidden bg-[#faf8f6]" style={{ aspectRatio: "3/4" }}>
                      <Image
                        src={optimizeCloudinary(product.image, 600)}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                      {discount > 0 && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 text-[9px] font-semibold tracking-wide bg-[#3B5373] text-white">
                          -{discount}%
                        </span>
                      )}
                    </div>
                    <div className="pt-3">
                      <p className="text-sm text-gray-800 leading-snug line-clamp-2 font-light">{product.title}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-sm text-[#1a1a1a] font-medium">₹{product.price.toLocaleString("en-IN")}</span>
                        {discount > 0 && (
                          <span className="text-xs text-gray-400 line-through">₹{product.comparePrice.toLocaleString("en-IN")}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => { addToCart({ slug: product.slug, title: product.title, price: product.price, image: product.image, quantity: 1 }); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#3B5373] text-white text-[11px] tracking-widest uppercase hover:bg-[#2d3f4f] transition-colors"
                    >
                      <ShoppingBag className="w-3 h-3" /> Add to Cart
                    </button>
                    <button
                      onClick={() => toggle(product.slug)}
                      className="w-9 flex items-center justify-center border border-gray-200 hover:border-red-400 hover:text-red-400 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
