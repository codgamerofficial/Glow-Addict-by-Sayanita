'use client';
import Link from 'next/link';
import { Heart, ShoppingBag, Star, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { useCartStore } from '@/features/cart/cartStore';
import { useWishlistStore } from '@/features/wishlist/wishlistStore';
import { useToast } from '@/components/shared/Toast';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { showToast } = useToast();
  const wishlisted = isInWishlist(product.id);
  const [justAdded, setJustAdded] = useState(false);
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product);
    setJustAdded(true);
    showToast(`${product.name} added to bag! 🛍️`);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleToggleWishlist = () => {
    toggleItem(product);
    showToast(
      wishlisted ? 'Removed from wishlist' : `${product.name} saved to wishlist ❤️`,
      wishlisted ? 'info' : 'success'
    );
  };

  return (
    <div className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Image */}
      <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none' }}>
        <div style={{ position: 'relative', paddingTop: '110%', overflow: 'hidden' }} className="product-image-wrap">
          <img src={product.images[0]} alt={product.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Badges */}
          <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {product.isNew && <span className="badge badge-new">NEW</span>}
            {product.isBestseller && <span className="badge badge-gold">⭐ BESTSELLER</span>}
            {discount > 0 && <span className="badge badge-primary">{discount}% OFF</span>}
          </div>
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1, gap: '6px' }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {product.brandName}
        </div>
        <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none', color: 'var(--text-primary)' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 500, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: 'rgba(16,185,129,0.15)', padding: '2px 8px', borderRadius: '4px' }}>
            <Star size={11} fill="var(--success)" color="var(--success)" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--success)' }}>{product.ratingAvg}</span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({product.ratingCount.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto', paddingTop: '4px' }}>
          <span style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'Outfit' }}>
            ₹{(product.salePrice || product.price).toLocaleString()}
          </span>
          {product.salePrice && (
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
              ₹{product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <motion.button
            onClick={handleAddToCart}
            whileTap={{ scale: 0.93 }}
            className="btn-gradient"
            style={{
              flex: 1, padding: '10px 12px', fontSize: '13px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              background: justAdded ? 'var(--success)' : undefined,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {justAdded ? <><Check size={14} /> Added!</> : <><ShoppingBag size={14} /> Add</>}
            </span>
          </motion.button>
          <motion.button
            onClick={handleToggleWishlist}
            whileTap={{ scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            style={{
              background: wishlisted ? 'rgba(233,30,140,0.15)' : 'var(--bg-glass)',
              border: '1px solid', borderColor: wishlisted ? 'var(--primary)' : 'var(--border-glass)',
              borderRadius: '12px', padding: '10px', cursor: 'pointer', transition: 'all 0.2s',
              color: wishlisted ? 'var(--primary)' : 'var(--text-muted)',
            }}
          >
            <motion.div
              animate={wishlisted ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart size={16} fill={wishlisted ? 'var(--primary)' : 'none'} />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
