'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, Heart, ShoppingBag, Truck, Shield, RotateCcw, ChevronRight, Minus, Plus, Check } from 'lucide-react';
import { products } from '@/data/products';
import { reviews } from '@/data/reviews';
import { useCartStore } from '@/features/cart/cartStore';
import { useWishlistStore } from '@/features/wishlist/wishlistStore';
import ProductCard from '@/components/product/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const product = products.find(p => p.slug === params.slug);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'reviews'>('description');
  const addItem = useCartStore(s => s.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();

  if (!product) {
    return (
      <div className="container-main" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <p style={{ fontSize: '48px' }}>🔍</p>
        <h2 style={{ fontFamily: 'Outfit', fontSize: '24px', margin: '16px 0' }}>Product not found</h2>
        <Link href="/products" className="btn-gradient" style={{ textDecoration: 'none', padding: '12px 24px' }}>
          <span>Browse Products</span>
        </Link>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;
  const productReviews = reviews.filter(r => r.productId === product.id);
  const related = products.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);

  return (
    <div className="container-main animate-fade-in" style={{ padding: '24px 16px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '13px', color: 'var(--text-muted)' }}>
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Products</Link>
        <ChevronRight size={14} />
        <span style={{ color: 'var(--text-secondary)' }}>{product.name}</span>
      </div>

      {/* Main content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '32px' }} className="product-detail-grid">
        {/* Images */}
        <div>
          <div style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '12px', aspectRatio: '1', background: 'var(--bg-surface)' }}>
            <img src={product.images[selectedImage]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} style={{
                  width: '64px', height: '64px', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer',
                  border: `2px solid ${i === selectedImage ? 'var(--primary)' : 'var(--border-glass)'}`,
                  opacity: i === selectedImage ? 1 : 0.6, transition: 'all 0.2s',
                }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            {product.isNew && <span className="badge badge-new">NEW</span>}
            {product.isBestseller && <span className="badge badge-gold">⭐ BESTSELLER</span>}
          </div>
          <Link href={`/products?brand=${product.brandName}`} style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {product.brandName}
          </Link>
          <h1 style={{ fontFamily: 'Outfit', fontSize: '28px', fontWeight: 700, margin: '8px 0 12px', lineHeight: 1.3 }}>{product.name}</h1>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>{product.shortDesc}</p>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1,2,3,4,5].map(n => <Star key={n} size={16} fill={n <= Math.round(product.ratingAvg) ? 'var(--accent-gold)' : 'none'} color={n <= Math.round(product.ratingAvg) ? 'var(--accent-gold)' : 'var(--text-muted)'} />)}
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{product.ratingAvg}</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>({product.ratingCount.toLocaleString()} reviews)</span>
          </div>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px' }}>
            <span style={{ fontFamily: 'Outfit', fontSize: '32px', fontWeight: 700 }}>₹{(product.salePrice || product.price).toLocaleString()}</span>
            {product.salePrice && (
              <>
                <span style={{ fontSize: '18px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>₹{product.price.toLocaleString()}</span>
                <span className="badge badge-primary">{discount}% OFF</span>
              </>
            )}
          </div>

          {/* Skin types */}
          {product.skinTypes.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginRight: '8px' }}>SUITABLE FOR:</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {product.skinTypes.map(st => <span key={st} className="badge" style={{ background: 'var(--bg-glass)', color: 'var(--text-secondary)', border: '1px solid var(--border-glass)' }}>{st}</span>)}
              </div>
            </div>
          )}
          {product.concerns.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginRight: '8px' }}>ADDRESSES:</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {product.concerns.map(c => <span key={c} className="badge badge-primary">{c}</span>)}
              </div>
            </div>
          )}

          {/* Quantity + Actions */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1px solid var(--border-glass)', borderRadius: '12px', overflow: 'hidden' }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ background: 'var(--bg-glass)', border: 'none', padding: '12px 14px', cursor: 'pointer', color: 'var(--text-primary)' }}><Minus size={16} /></button>
              <span style={{ padding: '12px 18px', fontWeight: 600, minWidth: '40px', textAlign: 'center' }}>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} style={{ background: 'var(--bg-glass)', border: 'none', padding: '12px 14px', cursor: 'pointer', color: 'var(--text-primary)' }}><Plus size={16} /></button>
            </div>
            <button onClick={() => addItem(product, quantity)} className="btn-gradient" style={{ flex: 1, padding: '14px', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><ShoppingBag size={18} /> Add to Cart</span>
            </button>
            <button onClick={() => toggleItem(product)} style={{
              padding: '14px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s',
              background: wishlisted ? 'rgba(233,30,140,0.15)' : 'var(--bg-glass)',
              border: `1px solid ${wishlisted ? 'var(--primary)' : 'var(--border-glass)'}`,
              color: wishlisted ? 'var(--primary)' : 'var(--text-muted)',
            }}>
              <Heart size={20} fill={wishlisted ? 'var(--primary)' : 'none'} />
            </button>
          </div>

          {/* Perks */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '20px' }}>
            {[
              { icon: Truck, text: 'Free Delivery above ₹499' },
              { icon: Shield, text: '100% Authentic Products' },
              { icon: RotateCcw, text: 'Easy 15-Day Returns' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="glass-card" style={{ padding: '12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <Icon size={18} style={{ color: 'var(--success)' }} />
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.3 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginTop: '48px' }}>
        <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border-glass)', marginBottom: '24px' }}>
          {(['description', 'ingredients', 'reviews'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '12px 24px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '14px', fontWeight: 600, textTransform: 'capitalize',
              color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: `2px solid ${activeTab === tab ? 'var(--primary)' : 'transparent'}`,
              transition: 'all 0.2s',
            }}>{tab}{tab === 'reviews' ? ` (${productReviews.length})` : ''}</button>
          ))}
        </div>
        {activeTab === 'description' && (
          <div style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '700px' }}>
            <p>{product.description}</p>
            {product.howToUse && (
              <>
                <h4 style={{ fontFamily: 'Outfit', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: '20px 0 8px' }}>How to Use</h4>
                <p>{product.howToUse}</p>
              </>
            )}
          </div>
        )}
        {activeTab === 'ingredients' && (
          <div style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: 1.8, maxWidth: '700px' }}>
            <p>{product.ingredients || 'Ingredient list coming soon.'}</p>
          </div>
        )}
        {activeTab === 'reviews' && (
          <div style={{ maxWidth: '700px' }}>
            {productReviews.length > 0 ? productReviews.map(r => (
              <div key={r.id} className="glass-card" style={{ padding: '20px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600 }}>{r.userName}</span>
                    {r.isVerified && <span style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '11px', color: 'var(--success)' }}><Check size={12} /> Verified</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1,2,3,4,5].map(n => <Star key={n} size={12} fill={n <= r.rating ? 'var(--accent-gold)' : 'none'} color={n <= r.rating ? 'var(--accent-gold)' : 'var(--text-muted)'} />)}
                  </div>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{r.title}</h4>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{r.body}</p>
                {r.skinType && <span className="badge" style={{ marginTop: '8px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '11px' }}>Skin: {r.skinType}</span>}
              </div>
            )) : (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No reviews yet. Be the first! ✨</p>
            )}
          </div>
        )}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div style={{ marginTop: '48px' }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '24px', fontWeight: 700, marginBottom: '20px' }}>You May Also Like</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      <style jsx global>{`
        @media (min-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
