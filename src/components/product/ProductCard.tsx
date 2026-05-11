'use client';
import Image from 'next/image';
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
    <div className="glass-card overflow-hidden flex flex-col">
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="no-underline">
        <div className="relative pt-[110%] overflow-hidden product-image-wrap">
          <Image 
            src={product.images[0]} 
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && <span className="badge badge-new">NEW</span>}
            {product.isBestseller && <span className="badge badge-gold">⭐ BESTSELLER</span>}
            {discount > 0 && <span className="badge badge-primary">{discount}% OFF</span>}
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-3.5 flex flex-col flex-1 gap-1.5">
        <div className="text-[11px] font-semibold text-[var(--primary)] uppercase tracking-wider">
          {product.brandName}
        </div>
        <Link href={`/products/${product.slug}`} className="no-underline text-[var(--text-primary)]">
          <h3 className="text-sm font-medium leading-[1.4] line-clamp-2 overflow-hidden">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5 bg-[rgba(16,185,129,0.15)] p-0.5 px-2 rounded">
            <Star size={11} fill="var(--success)" color="var(--success)" />
            <span className="text-[12px] font-semibold text-[var(--success)]">{product.ratingAvg}</span>
          </div>
          <span className="text-[11px] text-[var(--text-muted)]">({product.ratingCount.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto pt-1">
          <span className="text-base font-bold font-outfit">
            ₹{(product.salePrice || product.price).toLocaleString()}
          </span>
          {product.salePrice && (
            <span className="text-[13px] text-[var(--text-muted)] line-through">
              ₹{product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-2">
          <motion.button
            onClick={handleAddToCart}
            whileTap={{ scale: 0.93 }}
            className={`btn-gradient flex-1 p-2.5 px-3 text-[13px] flex items-center justify-center gap-1.5 ${justAdded ? 'bg-[var(--success)]' : ''}`}
          >
            <span className="flex items-center gap-1.5">
              {justAdded ? <><Check size={14} /> Added!</> : <><ShoppingBag size={14} /> Add</>}
            </span>
          </motion.button>
          <motion.button
            onClick={handleToggleWishlist}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            whileTap={{ scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className={`
              rounded-xl p-2.5 cursor-pointer transition-all duration-200 border
              ${wishlisted ? 'bg-[rgba(233,30,140,0.15)] border-[var(--primary)] text-[var(--primary)]' : 'bg-[var(--bg-glass)] border-[var(--border-glass)] text-[var(--text-muted)]'}
            `}
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
