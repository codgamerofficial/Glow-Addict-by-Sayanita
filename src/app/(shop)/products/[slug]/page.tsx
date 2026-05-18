'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Check, ChevronRight, Heart, Minus, Plus, RotateCcw, Shield, ShoppingBag, Star, Truck } from 'lucide-react';
import { products } from '@/data/products';
import { reviews } from '@/data/reviews';
import { useCartStore } from '@/features/cart/cartStore';
import { useWishlistStore } from '@/features/wishlist/wishlistStore';
import ProductCard from '@/components/product/ProductCard';
import WhatsAppShare from '@/components/product/WhatsAppShare';
import PolicyNotice from '@/components/shared/PolicyNotice';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const product = products.find((item) => item.slug === slug);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'reviews'>('description');
  const addItem = useCartStore((s) => s.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();

  if (!product) {
    return (
      <div className="container-main missing-product">
        <h2>Product not found</h2>
        <Link href="/products" className="btn-gradient">
          <span>Browse products</span>
        </Link>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const price = product.salePrice || product.price;
  const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;
  const productReviews = reviews.filter((review) => review.productId === product.id);
  const related = products.filter((item) => item.categoryId === product.categoryId && item.id !== product.id).slice(0, 4);

  return (
    <div className="product-detail-page animate-fade-in">
      <div className="container-main">
        <nav className="detail-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={14} />
          <Link href="/products">Products</Link>
          <ChevronRight size={14} />
          <span>{product.name}</span>
        </nav>

        <section className="detail-grid">
          <div className="detail-gallery">
            <div className="detail-main-image">
              <Image src={product.images[selectedImage]} alt={product.name} fill priority sizes="(max-width: 768px) 100vw, 560px" />
              {discount > 0 && <span className="detail-discount">{discount}% OFF</span>}
            </div>
            {product.images.length > 1 && (
              <div className="detail-thumbs">
                {product.images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    aria-label={`Select product image ${index + 1}`}
                    onClick={() => setSelectedImage(index)}
                    className={index === selectedImage ? 'active' : ''}
                  >
                    <Image src={image} alt="" fill sizes="72px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="detail-info">
            <div className="detail-badges">
              {product.badges?.map((badge) => (
                <span key={badge} className={badge === 'Bestseller' ? 'badge badge-gold' : badge === 'New Arrival' ? 'badge badge-new' : 'badge badge-primary'}>
                  {badge.toUpperCase()}
                </span>
              ))}
              {product.isBestseller && <span className="badge badge-gold">BESTSELLER</span>}
              {product.isNew && <span className="badge badge-new">NEW DROP</span>}
            </div>
            <Link href={`/products?brand=${product.brandName}`} className="detail-brand">
              {product.brandName}
            </Link>
            <h1>{product.name}</h1>
            <p className="detail-short">{product.shortDesc}</p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>
              {product.subcategoryName}{product.sku ? ` • SKU ${product.sku}` : ''}
            </p>

            <div className="detail-rating">
              <div>
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star
                    key={value}
                    size={17}
                    fill={value <= Math.round(product.ratingAvg) ? 'currentColor' : 'none'}
                    color="currentColor"
                  />
                ))}
              </div>
              <strong>{product.ratingAvg}</strong>
              <span>({product.ratingCount.toLocaleString()} reviews)</span>
            </div>

            <div className="detail-price">
              <strong>&#8377;{price.toLocaleString()}</strong>
              {(product.salePrice || product.mrp) && <span>&#8377;{(product.mrp || product.price).toLocaleString()}</span>}
              {discount > 0 && <em>You save &#8377;{(product.price - price).toLocaleString()}</em>}
            </div>

            <div className="detail-tags">
              {product.skinTypes.slice(0, 5).map((type) => (
                <span key={type}>{type}</span>
              ))}
              {product.concerns.slice(0, 4).map((concern) => (
                <span key={concern}>{concern}</span>
              ))}
              {product.gender && <span>{product.gender}</span>}
              {product.gstPercent && <span>GST {product.gstPercent}%</span>}
            </div>

            <div className="detail-actions">
              <div className="quantity-stepper">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus size={16} />
                </button>
                <span>{quantity}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)}>
                  <Plus size={16} />
                </button>
              </div>
              <button type="button" onClick={() => addItem(product, quantity)} className="btn-gradient add-to-bag">
                <span><ShoppingBag size={18} /> Add to bag</span>
              </button>
              <button type="button" onClick={() => toggleItem(product)} className={`detail-heart ${wishlisted ? 'active' : ''}`} aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
                <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="detail-perks">
              {[
                { icon: Truck, text: 'Free delivery above 799' },
                { icon: Shield, text: 'Authentic product guarantee' },
                { icon: RotateCcw, text: 'No return, exchange or refund' },
              ].map(({ icon: Icon, text }) => (
                <div key={text}>
                  <Icon size={19} />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '16px' }}>
              <PolicyNotice compact />
            </div>

            {/* WhatsApp Share Section */}
            <div style={{ marginTop: '18px' }}>
              <WhatsAppShare
                productName={product.name}
                productUrl={`/products/${slug}`}
                price={price}
              />
            </div>
          </div>
        </section>

        <section className="detail-tabs">
          <div className="tab-list" role="tablist" aria-label="Product information">
            {(['description', 'ingredients', 'reviews'] as const).map((tab) => (
              <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={activeTab === tab ? 'active' : ''}>
                {tab === 'reviews' ? `Reviews (${productReviews.length})` : tab}
              </button>
            ))}
          </div>

          <div className="tab-panel">
            {activeTab === 'description' && (
              <>
                <p>{product.description}</p>
                {product.howToUse && (
                  <>
                    <h3>How to use</h3>
                    <p>{product.howToUse}</p>
                  </>
                )}
              </>
            )}
            {activeTab === 'ingredients' && <p>{product.ingredients || 'Ingredient list coming soon.'}</p>}
            {activeTab === 'reviews' && (
              <div className="review-list">
                {productReviews.length > 0 ? (
                  productReviews.map((review) => (
                    <article key={review.id} className="review-card">
                      <div>
                        <strong>{review.userName}</strong>
                        {review.isVerified && <span><Check size={13} /> Verified</span>}
                      </div>
                      <h4>{review.title}</h4>
                      <p>{review.body}</p>
                    </article>
                  ))
                ) : (
                  <p>No reviews yet. Be the first to share your glow notes.</p>
                )}
              </div>
            )}
          </div>
        </section>

        {related.length > 0 && (
          <section className="section-pad related-section">
            <div className="section-heading">
              <div>
                <h2>You may also like</h2>
                <p>More formulas from the same beauty family.</p>
              </div>
            </div>
            <div className="product-grid">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>

      <style jsx global>{`
        .product-detail-page {
          padding: 24px 0 80px;
          background:
            radial-gradient(circle at 8% 4%, rgba(255, 212, 71, 0.24), transparent 22%),
            var(--bg-primary);
        }

        .missing-product {
          display: grid;
          place-items: center;
          gap: 18px;
          min-height: 50vh;
          text-align: center;
        }

        .missing-product h2 {
          font-size: 34px;
          font-weight: 900;
        }

        .missing-product a {
          display: inline-flex;
          align-items: center;
          padding: 0 22px;
          text-decoration: none;
        }

        .detail-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
          color: var(--text-muted);
          font-size: 13px;
          font-weight: 700;
        }

        .detail-breadcrumb a {
          text-decoration: none;
        }

        .detail-breadcrumb span {
          min-width: 0;
          overflow: hidden;
          color: var(--text-secondary);
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(360px, 0.9fr);
          gap: 42px;
          align-items: start;
        }

        .detail-gallery,
        .detail-info,
        .detail-tabs {
          border: 1px solid var(--line);
          border-radius: 34px;
          background: var(--bg-surface);
          box-shadow: var(--shadow-card);
        }

        .detail-gallery {
          padding: 14px;
        }

        .detail-main-image {
          position: relative;
          aspect-ratio: 1;
          overflow: hidden;
          border-radius: 26px;
          background: linear-gradient(135deg, #fff2f8, #eaffd7);
        }

        .detail-main-image img {
          object-fit: cover;
        }

        .detail-discount {
          position: absolute;
          top: 18px;
          left: 18px;
          padding: 9px 12px;
          border-radius: 999px;
          color: #fff;
          background: var(--primary);
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 900;
        }

        .detail-thumbs {
          display: flex;
          gap: 10px;
          margin-top: 12px;
        }

        .detail-thumbs button {
          position: relative;
          width: 72px;
          height: 72px;
          overflow: hidden;
          border: 2px solid transparent;
          border-radius: 18px;
          background: var(--bg-surface-hover);
          cursor: pointer;
          opacity: 0.72;
        }

        .detail-thumbs button.active {
          border-color: var(--primary);
          opacity: 1;
        }

        .detail-thumbs img {
          object-fit: cover;
        }

        .detail-info {
          padding: 30px;
        }

        .detail-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 12px;
        }

        .detail-brand {
          color: var(--primary);
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 900;
          text-decoration: none;
          text-transform: uppercase;
        }

        .detail-info h1 {
          margin: 9px 0 12px;
          color: var(--text-primary);
          font-size: clamp(34px, 5vw, 58px);
          font-weight: 900;
          line-height: 0.98;
        }

        .detail-short {
          color: var(--text-secondary);
          font-size: 16px;
          line-height: 1.6;
        }

        .detail-rating {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 18px;
          color: var(--warning);
        }

        .detail-rating div {
          display: flex;
          gap: 2px;
        }

        .detail-rating strong {
          color: var(--text-primary);
          font-size: 14px;
        }

        .detail-rating span {
          color: var(--text-muted);
          font-size: 13px;
        }

        .detail-price {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 12px;
          margin-top: 24px;
        }

        .detail-price strong {
          color: var(--text-primary);
          font-family: var(--font-display);
          font-size: 40px;
          font-weight: 900;
          line-height: 1;
        }

        .detail-price span {
          color: var(--text-muted);
          font-size: 18px;
          font-weight: 800;
          text-decoration: line-through;
        }

        .detail-price em {
          color: var(--success);
          font-size: 13px;
          font-style: normal;
          font-weight: 900;
        }

        .detail-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 22px 0;
        }

        .detail-tags span {
          padding: 8px 11px;
          border: 1px solid var(--line);
          border-radius: 999px;
          color: var(--text-secondary);
          background: var(--bg-surface-hover);
          font-size: 12px;
          font-weight: 800;
        }

        .detail-actions {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          gap: 12px;
          margin-top: 18px;
        }

        .quantity-stepper {
          display: flex;
          align-items: center;
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: var(--bg-surface-hover);
        }

        .quantity-stepper button {
          display: grid;
          place-items: center;
          width: 42px;
          height: 46px;
          border: 0;
          color: var(--text-primary);
          background: transparent;
          cursor: pointer;
        }

        .quantity-stepper span {
          min-width: 34px;
          text-align: center;
          font-weight: 900;
        }

        .add-to-bag {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 20px;
        }

        .add-to-bag span {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .detail-heart {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border: 1px solid var(--line);
          border-radius: 999px;
          color: var(--text-secondary);
          background: var(--bg-surface-hover);
          cursor: pointer;
        }

        .detail-heart.active {
          color: var(--primary);
          border-color: rgba(245, 31, 123, 0.26);
          background: rgba(245, 31, 123, 0.1);
        }

        .detail-perks {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 22px;
        }

        .detail-perks div {
          display: flex;
          align-items: center;
          flex-direction: column;
          gap: 8px;
          min-height: 104px;
          padding: 15px 10px;
          border: 1px solid var(--line);
          border-radius: 18px;
          text-align: center;
          background: var(--bg-surface-hover);
        }

        .detail-perks svg {
          color: var(--success);
        }

        .detail-perks span {
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 800;
          line-height: 1.35;
        }

        .detail-tabs {
          margin-top: 34px;
          padding: 8px;
        }

        .tab-list {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding: 4px;
        }

        .tab-list button {
          min-height: 44px;
          padding: 0 18px;
          border: 0;
          border-radius: 999px;
          color: var(--text-muted);
          background: transparent;
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 900;
          text-transform: capitalize;
          cursor: pointer;
        }

        .tab-list button.active {
          color: #fff;
          background: var(--text-primary);
        }

        .tab-panel {
          max-width: 850px;
          padding: 22px;
          color: var(--text-secondary);
          font-size: 15px;
          line-height: 1.8;
        }

        .tab-panel h3 {
          margin: 22px 0 8px;
          color: var(--text-primary);
          font-size: 18px;
          font-weight: 900;
        }

        .review-list {
          display: grid;
          gap: 12px;
        }

        .review-card {
          padding: 18px;
          border: 1px solid var(--line);
          border-radius: 20px;
          background: var(--bg-surface-hover);
        }

        .review-card div {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
        }

        .review-card strong {
          color: var(--text-primary);
        }

        .review-card span {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--success);
          font-size: 12px;
          font-weight: 900;
        }

        .review-card h4 {
          color: var(--text-primary);
          font-size: 15px;
          font-weight: 900;
        }

        .review-card p {
          margin-top: 4px;
        }

        .related-section {
          padding-bottom: 0;
        }

        @media (max-width: 980px) {
          .detail-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .product-detail-page {
            padding-top: 18px;
          }

          .detail-info {
            padding: 22px;
          }

          .detail-actions {
            grid-template-columns: 1fr auto;
          }

          .quantity-stepper {
            grid-column: 1 / -1;
            width: fit-content;
          }

          .detail-perks {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
