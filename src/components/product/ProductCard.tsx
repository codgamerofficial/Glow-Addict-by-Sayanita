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
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 280px"
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
          border-radius: 24px;
          background: var(--bg-surface);
          box-shadow: var(--shadow-card);
          transition: transform 0.32s var(--spring), box-shadow 0.32s var(--spring), border-color 0.32s var(--spring);
        }

        .product-card:hover {
          transform: translateY(-5px);
          border-color: rgba(245, 31, 123, 0.22);
          box-shadow: var(--shadow-soft);
        }

        .product-media {
          position: relative;
          display: block;
          aspect-ratio: 0.9;
          margin: 10px 10px 0;
          overflow: hidden;
          border-radius: 20px;
          background: linear-gradient(135deg, #fff2f8, #eaffd7);
          text-decoration: none;
        }

        .product-media img {
          object-fit: cover;
        }

        .product-badges {
          position: absolute;
          top: 10px;
          left: 10px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          max-width: calc(100% - 56px);
        }

        .wishlist-button {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 2;
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border: 1px solid rgba(255, 255, 255, 0.68);
          border-radius: 999px;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.82);
          box-shadow: 0 10px 24px rgba(42, 18, 38, 0.12);
          cursor: pointer;
          transition: all 0.22s var(--spring);
        }

        .wishlist-button:hover,
        .wishlist-active {
          color: var(--primary);
          transform: scale(1.05);
        }

        .product-content {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 8px;
          padding: 14px 16px 16px;
        }

        .product-brand-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .product-brand-row > span:first-child {
          min-width: 0;
          overflow: hidden;
          color: var(--primary);
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 900;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .rating-pill {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 7px;
          border-radius: 999px;
          color: #0b6b49;
          background: #e1f8ec;
          font-size: 12px;
          font-weight: 900;
          line-height: 1;
        }

        .product-title-link {
          color: var(--text-primary);
          text-decoration: none;
        }

        .product-title-link h3 {
          display: -webkit-box;
          min-height: 42px;
          overflow: hidden;
          font-size: 16px;
          font-weight: 900;
          line-height: 1.28;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .product-content p {
          display: -webkit-box;
          min-height: 37px;
          overflow: hidden;
          color: var(--text-muted);
          font-size: 13px;
          line-height: 1.42;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .product-bottom {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 12px;
          margin-top: auto;
          padding-top: 6px;
        }

        .price-block {
          min-width: 0;
        }

        .price-block strong {
          display: block;
          color: var(--text-primary);
          font-family: var(--font-display);
          font-size: 20px;
          font-weight: 900;
          line-height: 1;
        }

        .price-block span {
          display: block;
          margin-top: 4px;
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 700;
          text-decoration: line-through;
        }

        .quick-add {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          min-width: 76px;
          min-height: 42px;
          padding: 0 14px;
          border: 0;
          border-radius: 999px;
          color: #fff;
          background: var(--text-primary);
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
          transition: all 0.22s var(--spring);
        }

        .quick-add:hover {
          background: var(--primary);
          box-shadow: 0 12px 26px rgba(245, 31, 123, 0.22);
        }

        .quick-add-done {
          background: var(--success);
        }

        @media (max-width: 560px) {
          .product-card {
            border-radius: 18px;
          }

          .product-media {
            margin: 7px 7px 0;
            border-radius: 15px;
          }

          .wishlist-button {
            top: 14px;
            right: 14px;
            width: 34px;
            height: 34px;
          }

          .product-content {
            padding: 11px;
          }

          .product-title-link h3 {
            min-height: 38px;
            font-size: 14px;
          }

          .product-content p {
            display: none;
          }

          .price-block strong {
            font-size: 17px;
          }

          .quick-add {
            min-width: 42px;
            width: 42px;
            padding: 0;
          }

          .quick-add span {
            display: none;
          }
        }
      `}</style>
    </article>
  );
}
