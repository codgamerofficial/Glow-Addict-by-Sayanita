'use client';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useWishlistStore } from '@/features/wishlist/wishlistStore';
import { useCartStore } from '@/features/cart/cartStore';

import Image from 'next/image';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore(s => s.addItem);

  if (items.length === 0) {
    return (
      <div className="container-main animate-fade-in text-center py-20 px-5">
        <Heart size={64} className="text-[var(--text-muted)] mb-5" />
        <h2 className="font-outfit text-2xl mb-2">Your wishlist is empty</h2>
        <p className="text-[var(--text-muted)] mb-6">Save your favorite products here</p>
        <Link href="/products" className="btn-gradient no-underline p-3.5 px-8 text-[15px]">
          <span>Explore Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-main animate-fade-in p-6 px-4">
      <h1 className="font-outfit text-[28px] font-bold mb-6">
        My Wishlist <span className="text-base text-[var(--text-muted)] font-normal">({items.length} items)</span>
      </h1>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
        {items.map(product => (
          <div key={product.id} className="glass-card overflow-hidden">
            <Link href={`/products/${product.slug}`}>
              <div className="aspect-square overflow-hidden relative product-image-wrap">
                <Image 
                  src={product.images[0]} 
                  alt={product.name} 
                  fill
                  className="object-cover" 
                />
              </div>
            </Link>
            <div className="p-3.5">
              <div className="text-[11px] font-semibold text-[var(--primary)] uppercase">{product.brandName}</div>
              <h3 className="text-sm font-medium my-1 mb-2 truncate">{product.name}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-outfit text-base font-bold">₹{(product.salePrice || product.price).toLocaleString()}</span>
                {product.salePrice && <span className="text-[13px] text-[var(--text-muted)] line-through">₹{product.price.toLocaleString()}</span>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => { addToCart(product); removeItem(product.id); }} className="btn-gradient flex-1 p-2.5 text-[13px]">
                  <span className="flex items-center justify-center gap-1.5"><ShoppingBag size={14} /> Move to Cart</span>
                </button>
                <button aria-label="Remove item" onClick={() => removeItem(product.id)} className="bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-xl p-2.5 cursor-pointer text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--error)]">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
