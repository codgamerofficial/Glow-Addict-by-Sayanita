'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Minus,
  Plus,
  Check,
} from 'lucide-react';

import { products } from '@/data/products';
import { useCartStore } from '@/features/cart/cartStore';
import { useWishlistStore } from '@/features/wishlist/wishlistStore';
import { useAuthStore } from '@/features/auth/authStore';
import ReviewForm from '@/components/product/ReviewForm';
import ProductCard from '@/components/product/ProductCard';

type Review = {
  id: string;
  userName: string;
  rating: number;
  title: string;
  body: string;
  isVerified?: boolean;
  skinType?: string;
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const product = products.find((item) => item.slug === slug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'ingredients' | 'reviews'>('description');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!slug) return;

    const loadReviews = async () => {
      try {
        setLoadingReviews(true);
        const response = await fetch(`/api/products/${slug}/reviews`);

        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };

    loadReviews();
  }, [slug]);

  const refetchReviews = async () => {
    if (!slug) return;

    try {
      const response = await fetch(`/api/products/${slug}/reviews`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error refetching reviews:', error);
    }
  };

  if (!product) {
    return (
      <div className="container-main text-center py-[100px] px-5">
        <p className="text-[48px]">🔍</p>
        <h2 className="font-outfit text-2xl my-4">Product not found</h2>
        <Link href="/products" className="btn-gradient no-underline p-3 px-6">
          <span>Browse Products</span>
        </Link>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;
  const related = products.filter((item) => item.categoryId === product.categoryId && item.id !== product.id).slice(0, 4);

  return (
    <div className="container-main animate-fade-in py-6 px-4 pb-12">
      <div className="mb-6 flex items-center gap-2 text-[13px] text-[var(--text-muted)] overflow-x-auto hide-scrollbar">
        <Link href="/" className="text-[var(--text-muted)] no-underline whitespace-nowrap">Home</Link>
        <ChevronRight size={14} />
        <Link href="/products" className="text-[var(--text-muted)] no-underline whitespace-nowrap">Products</Link>
        <ChevronRight size={14} />
        <span className="text-[var(--text-secondary)] whitespace-nowrap">{product.name}</span>
      </div>

      <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-4">
          <div className="glass-card overflow-hidden rounded-[28px] border border-[var(--border-glass-strong)] bg-[var(--bg-surface)]">
            <div className="relative aspect-square overflow-hidden">
              <Image src={product.images[selectedImage]} alt={product.name} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" priority />
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                {product.isNew && <span className="badge badge-new">NEW</span>}
                {product.isBestseller && <span className="badge badge-gold">⭐ BESTSELLER</span>}
                {discount > 0 && <span className="badge badge-primary">{discount}% OFF</span>}
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto hide-scrollbar">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-label={`Select image ${index + 1}`}
                    onClick={() => setSelectedImage(index)}
                    className={`h-18 w-18 shrink-0 overflow-hidden rounded-[14px] border-2 transition-all duration-200 ${index === selectedImage ? 'border-[var(--primary)] opacity-100' : 'border-[var(--border-glass)] opacity-60'}`}
                  >
                      <Image src={image} alt="" width={72} height={72} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              { icon: Truck, title: 'Free Delivery', text: 'Above ₹499 across serviceable pin codes' },
              { icon: Shield, title: 'Authentic Stock', text: 'Genuine products and secure checkout' },
              { icon: RotateCcw, title: 'Easy Returns', text: '15-day return window for eligible items' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="glass-card rounded-2xl p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(16,185,129,0.1)] text-[var(--success)]">
                  <Icon size={18} />
                </div>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
                <p className="mt-1 text-[12px] leading-6 text-[var(--text-secondary)]">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5 lg:sticky lg:top-[96px] self-start">
          <div className="glass-card rounded-[28px] p-6 sm:p-7">
            <div className="flex flex-wrap gap-2 mb-3">
              {product.isNew && <span className="badge badge-new">NEW</span>}
              {product.isBestseller && <span className="badge badge-gold">⭐ BESTSELLER</span>}
            </div>

            <Link href={`/products?brand=${product.brandName}`} className="text-[13px] font-semibold text-[var(--primary)] no-underline uppercase tracking-wider">
              {product.brandName}
            </Link>
            <h1 className="font-outfit text-[clamp(2rem,4vw,3rem)] font-black leading-[1.05] mt-2">{product.name}</h1>
            <p className="mt-3 text-[15px] leading-7 text-[var(--text-secondary)]">{product.shortDesc}</p>

            <div className="mt-5 flex items-center gap-2 flex-wrap">
              <div className="flex gap-[2px]">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Star
                    key={rating}
                    size={16}
                    fill={rating <= Math.round(product.ratingAvg) ? 'var(--accent-gold)' : 'none'}
                    color={rating <= Math.round(product.ratingAvg) ? 'var(--accent-gold)' : 'var(--text-muted)'}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold">{product.ratingAvg}</span>
              <span className="text-[13px] text-[var(--text-muted)]">({product.ratingCount.toLocaleString()} reviews)</span>
            </div>

            <div className="mt-5 flex items-baseline gap-3 flex-wrap">
              <span className="font-outfit text-[34px] font-black">₹{(product.salePrice || product.price).toLocaleString()}</span>
              {product.salePrice && <span className="text-lg text-[var(--text-muted)] line-through">₹{product.price.toLocaleString()}</span>}
            </div>

            {product.skinTypes.length > 0 && (
              <div className="mt-5">
                <div className="mb-2 text-[12px] font-semibold text-[var(--text-muted)]">SUITABLE FOR</div>
                <div className="flex flex-wrap gap-2">
                  {product.skinTypes.map((skinType) => (
                    <span key={skinType} className="badge bg-[var(--bg-glass)] text-[var(--text-secondary)] border border-[var(--border-glass)]">
                      {skinType}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.concerns.length > 0 && (
              <div className="mt-5">
                <div className="mb-2 text-[12px] font-semibold text-[var(--text-muted)]">ADDRESSES</div>
                <div className="flex flex-wrap gap-2">
                  {product.concerns.map((concern) => (
                    <span key={concern} className="badge badge-primary">{concern}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="flex items-center overflow-hidden rounded-xl border border-[var(--border-glass)]">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="border-none bg-[var(--bg-glass)] p-3 px-3.5 text-[var(--text-primary)] cursor-pointer hover:bg-white/[0.05]">
                  <Minus size={16} />
                </button>
                <span className="min-w-[40px] p-3 px-4 text-center font-semibold">{quantity}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)} className="border-none bg-[var(--bg-glass)] p-3 px-3.5 text-[var(--text-primary)] cursor-pointer hover:bg-white/[0.05]">
                  <Plus size={16} />
                </button>
              </div>
              <button onClick={() => addItem(product, quantity)} className="btn-gradient flex-1 p-3.5 text-[15px] flex items-center justify-center gap-2">
                <span className="flex items-center gap-2"><ShoppingBag size={18} /> Add to Cart</span>
              </button>
              <button
                type="button"
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                onClick={() => toggleItem(product)}
                className={`rounded-xl border p-3.5 cursor-pointer transition-all duration-200 ${wishlisted ? 'bg-[rgba(233,30,140,0.15)] border-[var(--primary)] text-[var(--primary)]' : 'bg-[var(--bg-glass)] border-[var(--border-glass)] text-[var(--text-muted)]'}`}
              >
                <Heart size={20} fill={wishlisted ? 'var(--primary)' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex gap-0 overflow-x-auto hide-scrollbar border-b border-[var(--border-glass)] mb-6">
          {(['description', 'ingredients', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 p-3 px-6 text-sm font-semibold capitalize transition-all duration-200 ${activeTab === tab ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent text-[var(--text-muted)]'}`}
            >
              {tab}{tab === 'reviews' ? ` (${reviews.length})` : ''}
            </button>
          ))}
        </div>

        {activeTab === 'description' && (
          <div className="max-w-[700px] text-[15px] leading-[1.8] text-[var(--text-secondary)]">
            <p>{product.description}</p>
            {product.howToUse && (
              <>
                <h4 className="mt-5 mb-2 font-outfit text-base font-semibold text-[var(--text-primary)]">How to Use</h4>
                <p>{product.howToUse}</p>
              </>
            )}
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div className="max-w-[700px] text-[15px] leading-[1.8] text-[var(--text-secondary)]">
            <p>{product.ingredients || 'Ingredient list coming soon.'}</p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="max-w-[700px]">
            {isAuthenticated ? (
              <ReviewForm productId={product.id.toString()} slug={product.slug} onReviewSubmitted={refetchReviews} />
            ) : (
              <div className="glass-card mb-6 p-6 text-center">
                <p className="text-[var(--text-secondary)]">
                  Please <Link href="/login" className="font-medium text-[var(--primary)] no-underline hover:underline">log in</Link> to write a review.
                </p>
              </div>
            )}

            {loadingReviews ? (
              <p className="py-8 text-center text-[var(--text-muted)]">Loading reviews...</p>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="glass-card mb-3 p-5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{review.userName}</span>
                      {review.isVerified && (
                        <span className="flex items-center gap-0.5 text-[11px] text-[var(--success)]"><Check size={12} /> Verified</span>
                      )}
                    </div>
                    <div className="flex gap-[2px]">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <Star
                          key={rating}
                          size={12}
                          fill={rating <= review.rating ? 'var(--accent-gold)' : 'none'}
                          color={rating <= review.rating ? 'var(--accent-gold)' : 'var(--text-muted)'}
                        />
                      ))}
                    </div>
                  </div>
                  <h4 className="mb-1 text-sm font-semibold">{review.title}</h4>
                  <p className="text-sm leading-[1.6] text-[var(--text-secondary)]">{review.body}</p>
                  {review.skinType && (
                    <span className="badge mt-2 border border-[var(--border-glass)] bg-[var(--bg-glass)] text-[11px] text-[var(--text-muted)]">
                      Skin: {review.skinType}
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="p-10 text-center text-[var(--text-muted)]">No reviews yet. Be the first! ✨</p>
            )}
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-5 font-outfit text-2xl font-bold">You May Also Like</h2>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
              {related.map((item) => <ProductCard key={item.id} product={item} />)}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
