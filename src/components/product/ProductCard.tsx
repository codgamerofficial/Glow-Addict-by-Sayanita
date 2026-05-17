'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Heart, ShoppingBag, Star } from 'lucide-react';
import { Product } from '@/types/product';
import { useCartStore } from '@/features/cart/cartStore';
import { useWishlistStore } from '@/features/wishlist/wishlistStore';
import { useToast } from '@/components/shared/Toast';

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { showToast } = useToast();
  const [justAdded, setJustAdded] = useState(false);
  const wishlisted = isInWishlist(product.id);
  const price = product.salePrice || product.price;
  const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;

  const handleAddToCart = () => {
    addItem(product);
    setJustAdded(true);
    showToast(`${product.name} added to bag`);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleToggleWishlist = () => {
    toggleItem(product);
    showToast(wishlisted ? 'Removed from wishlist' : `${product.name} saved to wishlist`, wishlisted ? 'info' : 'success');
  };

  return (
    <article className="product-card">
      <Link href={`/products/${product.slug}`} className="product-media product-image-wrap">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 374px) 45vw, (max-width: 640px) 48vw, (max-width: 768px) 32vw, (max-width: 1024px) 25vw, (max-width: 1440px) 20vw, 18vw"
        />
        <div className="product-badges">
          {discount > 0 && <span className="badge badge-primary">{discount}% OFF</span>}
          {product.isNew && <span className="badge badge-new">NEW</span>}
          {product.isBestseller && <span className="badge badge-gold">BESTSELLER</span>}
        </div>
      </Link>

      <button
        type="button"
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        onClick={handleToggleWishlist}
        className={`wishlist-button ${wishlisted ? 'wishlist-active' : ''}`}
      >
        <Heart size={17} fill={wishlisted ? 'currentColor' : 'none'} />
      </button>

      <div className="product-content">
        <div className="product-brand-row">
          <span>{product.brandName}</span>
          <span className="rating-pill">
            <Star size={12} fill="currentColor" /> {product.ratingAvg}
          </span>
        </div>

        <Link href={`/products/${product.slug}`} className="product-title-link">
          <h3>{product.name}</h3>
        </Link>

        <p>{product.shortDesc}</p>

        <div className="product-bottom">
          <div className="price-block">
            <strong>&#8377;{price.toLocaleString()}</strong>
            {product.salePrice && <span>&#8377;{product.price.toLocaleString()}</span>}
          </div>
          <motion.button
            type="button"
            onClick={handleAddToCart}
            whileTap={{ scale: 0.94 }}
            className={`quick-add ${justAdded ? 'quick-add-done' : ''}`}
          >
            {justAdded ? <Check size={17} /> : <ShoppingBag size={17} />}
            <span>{justAdded ? 'Added' : 'Add'}</span>
          </motion.button>
        </div>
      </div>

      <style jsx global>{`
        .product-card {
          position: relative;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: clamp(16px, 2vw, 24px);
          background: var(--bg-surface);
          box-shadow: var(--shadow-card);
          transition: transform 0.32s var(--spring), box-shadow 0.32s var(--spring), border-color 0.32s var(--spring);
        }

        @media (hover: hover) {
          .product-card:hover {
            transform: translateY(-5px);
            border-color: rgba(245, 31, 123, 0.22);
            box-shadow: var(--shadow-soft);
          }
        }

        .product-media {
          position: relative;
          display: block;
          aspect-ratio: 0.9 / 1;
          margin: clamp(8px, 1.5vw, 12px) clamp(8px, 1.5vw, 12px) 0;
          overflow: hidden;
          border-radius: clamp(14px, 1.8vw, 20px);
          background: linear-gradient(135deg, #fff2f8, #eaffd7);
          text-decoration: none;
        }

        .product-media img {
          object-fit: cover;
        }

        .product-badges {
          position: absolute;
          top: clamp(8px, 1.5vw, 12px);
          left: clamp(8px, 1.5vw, 12px);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 4px;
          max-width: calc(100% - clamp(40px, 8vw, 56px));
        }

        .wishlist-button {
          position: absolute;
          top: clamp(12px, 2vw, 20px);
          right: clamp(12px, 2vw, 20px);
          z-index: 2;
          display: grid;
          place-items: center;
          width: clamp(34px, 5vw, 40px);
          height: clamp(34px, 5vw, 40px);
          border: 1px solid rgba(255, 255, 255, 0.68);
          border-radius: 999px;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.82);
          box-shadow: 0 10px 24px rgba(42, 18, 38, 0.12);
          cursor: pointer;
          transition: all 0.22s var(--spring);
          font-size: clamp(14px, 2vw, 18px);
        }

        .wishlist-button:hover,
        .wishlist-active {
          color: var(--primary);
          transform: scale(1.05);
        }

        .wishlist-button:active {
          transform: scale(0.95);
        }

        .product-content {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: clamp(6px, 1vw, 10px);
          padding: clamp(10px, 1.5vw, 16px);
        }

        .product-brand-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: clamp(8px, 1.5vw, 12px);
        }

        .product-brand-row > span:first-child {
          min-width: 0;
          overflow: hidden;
          color: var(--primary);
          font-family: var(--font-display);
          font-size: clamp(10px, 0.9vw, 12px);
          font-weight: 900;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .rating-pill {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          padding: clamp(4px, 0.6vw, 6px) clamp(6px, 1vw, 8px);
          border-radius: 999px;
          color: #0b6b49;
          background: #e1f8ec;
          font-size: clamp(10px, 0.85vw, 12px);
          font-weight: 900;
          line-height: 1;
          flex-shrink: 0;
        }

        .product-title-link {
          color: var(--text-primary);
          text-decoration: none;
        }

        .product-title-link h3 {
          display: -webkit-box;
          min-height: auto;
          overflow: hidden;
          font-size: clamp(13px, 1.1vw, 16px);
          font-weight: 900;
          line-height: clamp(1.2, 1.3, 1.4);
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .product-content p {
          display: -webkit-box;
          overflow: hidden;
          color: var(--text-muted);
          font-size: clamp(12px, 0.95vw, 13px);
          line-height: 1.4;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          margin: 0;
        }

        .product-bottom {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: clamp(8px, 1.2vw, 12px);
          margin-top: auto;
          padding-top: clamp(6px, 1vw, 8px);
        }

        .price-block {
          min-width: 0;
        }

        .price-block strong {
          display: block;
          color: var(--text-primary);
          font-family: var(--font-display);
          font-size: clamp(16px, 1.8vw, 20px);
          font-weight: 900;
          line-height: 1;
        }

        .price-block span {
          display: block;
          margin-top: 2px;
          color: var(--text-muted);
          font-size: clamp(11px, 0.9vw, 13px);
          font-weight: 700;
          text-decoration: line-through;
        }

        .quick-add {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: clamp(4px, 0.8vw, 6px);
          min-width: clamp(36px, 5vw, 44px);
          min-height: clamp(36px, 5vw, 44px);
          padding: 0 clamp(10px, 1.5vw, 14px);
          border: 0;
          border-radius: 999px;
          color: #fff;
          background: var(--text-primary);
          font-family: var(--font-display);
          font-size: clamp(11px, 0.9vw, 13px);
          font-weight: 900;
          cursor: pointer;
          transition: all 0.22s var(--spring);
          touch-action: manipulation;
        }

        @media (hover: hover) {
          .quick-add:hover {
            background: var(--primary);
            box-shadow: 0 12px 26px rgba(245, 31, 123, 0.22);
          }
        }

        .quick-add:active {
          transform: scale(0.96);
        }

        .quick-add-done {
          background: var(--success);
        }

        .quick-add span {
          display: inline;
        }

        @media (max-width: 374px) {
          .quick-add span {
            display: none;
          }

          .quick-add {
            min-width: 36px;
            width: 36px;
            padding: 0;
          }
        }
      `}</style>
    </article>
  );
}
