'use client';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, Tag } from 'lucide-react';
import { useCartStore } from '@/features/cart/cartStore';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getTotal, getItemCount } = useCartStore();
  const subtotal = getSubtotal();
  const total = getTotal();
  const shipping = subtotal > 499 ? 0 : 49;
  const itemCount = getItemCount();

  if (items.length === 0) {
    return (
      <div className="container-main animate-fade-in" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <ShoppingBag size={64} style={{ color: 'var(--text-muted)', marginBottom: '20px' }} />
        <h2 style={{ fontFamily: 'Outfit', fontSize: '24px', marginBottom: '8px' }}>Your cart is empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Add some amazing products to get started!</p>
        <Link href="/products" className="btn-gradient" style={{ textDecoration: 'none', padding: '14px 32px', fontSize: '15px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Start Shopping <ArrowRight size={18} /></span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-main animate-fade-in" style={{ padding: '24px 16px' }}>
      <h1 style={{ fontFamily: 'Outfit', fontSize: '28px', fontWeight: 700, marginBottom: '24px' }}>
        Shopping Cart <span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 400 }}>({itemCount} items)</span>
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }} className="cart-grid">
        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map(item => {
            const price = item.product.salePrice || item.product.price;
            return (
              <div key={item.id} className="glass-card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Link href={`/products/${item.product.slug}`}>
                  <div style={{ width: '90px', height: '90px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={item.product.images[0]} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </Link>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase' }}>{item.product.brandName}</div>
                  <Link href={`/products/${item.product.slug}`} style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.product.name}</h3>
                  </Link>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-glass)', borderRadius: '8px', overflow: 'hidden' }}>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} style={{ background: 'var(--bg-glass)', border: 'none', padding: '6px 10px', cursor: 'pointer', color: 'var(--text-primary)' }}><Minus size={14} /></button>
                      <span style={{ padding: '6px 12px', fontSize: '13px', fontWeight: 600 }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} style={{ background: 'var(--bg-glass)', border: 'none', padding: '6px 10px', cursor: 'pointer', color: 'var(--text-primary)' }}><Plus size={14} /></button>
                    </div>
                    <span style={{ fontFamily: 'Outfit', fontSize: '16px', fontWeight: 700 }}>₹{(price * item.quantity).toLocaleString()}</span>
                    {item.product.salePrice && <span style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{(item.product.price * item.quantity).toLocaleString()}</span>}
                  </div>
                </div>
                <button onClick={() => removeItem(item.product.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--error)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="glass-card" style={{ padding: '24px', alignSelf: 'flex-start', position: 'sticky', top: '110px' }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Order Summary</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span style={{ fontWeight: 500 }}>₹{subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
              <span style={{ fontWeight: 500, color: shipping === 0 ? 'var(--success)' : undefined }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
            </div>
            {shipping > 0 && <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Add ₹{499 - subtotal} more for free shipping</p>}
            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontFamily: 'Outfit', fontWeight: 700 }}>
              <span>Total</span>
              <span className="gradient-text">₹{total.toLocaleString()}</span>
            </div>
          </div>
          {/* Coupon */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input placeholder="Coupon code" className="input-glass" style={{ flex: 1, padding: '10px 14px', fontSize: '13px' }} />
            <button className="btn-outline" style={{ padding: '10px 16px', fontSize: '13px', flexShrink: 0 }}>Apply</button>
          </div>
          <Link href="/checkout" className="btn-gradient" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '14px', fontSize: '15px', textDecoration: 'none' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Proceed to Checkout <ArrowRight size={18} /></span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', justifyContent: 'center' }}>
            <Truck size={14} style={{ color: 'var(--success)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Estimated delivery: 3-5 business days</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media (min-width: 768px) { .cart-grid { grid-template-columns: 1fr 380px !important; } }
      `}</style>
    </div>
  );
}
