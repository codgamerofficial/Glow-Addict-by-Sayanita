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
      <div className="container-main animate-fade-in" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <Heart size={64} style={{ color: 'var(--text-muted)', marginBottom: '20px' }} />
        <h2 style={{ fontFamily: 'Outfit', fontSize: '24px', marginBottom: '8px' }}>Your wishlist is empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Save your favorite products here</p>
        <Link href="/products" className="btn-gradient" style={{ textDecoration: 'none', padding: '14px 32px', fontSize: '15px' }}>
          <span>Explore Products</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-main animate-fade-in" style={{ padding: '24px 16px' }}>
      <h1 style={{ fontFamily: 'Outfit', fontSize: '28px', fontWeight: 700, marginBottom: '24px' }}>
        My Wishlist <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 400 }}>({items.length} items)</span>
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
        {items.map(product => (
          <div key={product.id} className="glass-card" style={{ overflow: 'hidden' }}>
            <Link href={`/products/${product.slug}`}>
              <div style={{ aspectRatio: '1', overflow: 'hidden', position: 'relative' }} className="product-image-wrap">
                <Image 
                  src={product.images[0]} 
                  alt={product.name} 
                  fill
                  style={{ objectFit: 'cover' }} 
                />
              </div>
            </Link>
            <div style={{ padding: '14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase' }}>{product.brandName}</div>
              <h3 style={{ fontSize: '14px', fontWeight: 500, margin: '4px 0 8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontFamily: 'Outfit', fontSize: '16px', fontWeight: 700 }}>₹{(product.salePrice || product.price).toLocaleString()}</span>
                {product.salePrice && <span style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{product.price.toLocaleString()}</span>}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { addToCart(product); removeItem(product.id); }} className="btn-gradient" style={{ flex: 1, padding: '10px', fontSize: '13px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><ShoppingBag size={14} /> Move to Cart</span>
                </button>
                <button aria-label="Remove item" onClick={() => removeItem(product.id)} style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '10px', cursor: 'pointer', color: 'var(--text-muted)', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--error)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
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
