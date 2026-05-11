'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgePercent,
  ChevronRight,
  Clock3,
  Gift,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  Truck,
} from 'lucide-react';

import { categories as staticCategories } from '@/data/categories';
import { products } from '@/data/products';
import { ScrollReveal } from '@/components/shared/ScrollReveal';
import type { AdminBanner, AdminCollection } from '@/types/admin';

type StorefrontLaunchProps = {
  banners: AdminBanner[];
  collections: AdminCollection[];
};

const storefrontStats = [
  { value: '10k+', label: 'curated beauty picks' },
  { value: '2hr', label: 'fast dispatch in metro zones' },
  { value: '4.7/5', label: 'average customer rating' },
];

const serviceHighlights = [
  {
    title: 'AI routine builder',
    description: 'Get a personalized cart from skin concerns, budget, and finish preference in seconds.',
    icon: Sparkles,
  },
  {
    title: 'Trusted checkout',
    description: 'Secure payments, order tracking, and easy reorders for every staple you keep repurchasing.',
    icon: ShieldCheck,
  },
  {
    title: 'Reward-led shopping',
    description: 'Unlock points, gift drops, and early access promotions that make the app feel sticky.',
    icon: Gift,
  },
];

const appBenefits = [
  'Skin-first recommendations that adapt to your routine',
  'One-tap cart, wishlist, and checkout flows',
  'Live order status, delivery updates, and reorder nudges',
  'Collection browsing that feels like an app, not a catalog',
];

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(value);
}

export function StorefrontLaunch({ banners, collections }: StorefrontLaunchProps) {
  const heroBanner = banners.find((banner) => banner.is_active || banner.isActive) ?? {
    title: 'Beauty commerce that feels personal from the first tap.',
    subtitle: 'Discover skincare, makeup, hair, fragrance, and wellness through curated drops, AI assistance, and a polished mobile-first shopping flow.',
    image_url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&h=1400&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&h=1400&fit=crop',
  };

  const featuredCollections = collections.filter((collection) => collection.is_active).slice(0, 6);
  const collectionCards = featuredCollections.length > 0
    ? featuredCollections.map((collection) => ({
      id: collection.id,
      name: collection.name,
      slug: collection.slug,
      description: collection.description || 'Curated assortment for your next restock.',
      count: collection.count ?? 0,
      imageUrl: staticCategories.find((category) => category.slug === collection.slug)?.imageUrl || staticCategories[0].imageUrl,
    }))
    : staticCategories.slice(0, 6).map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || 'Browse by your favorite category.',
      count: category.productCount,
      imageUrl: category.imageUrl,
    }));

  const bestSellers = products.filter((product) => product.isBestseller).slice(0, 4);
  const newDrops = products.filter((product) => product.isNew).slice(0, 4);

  return (
    <div className="pb-12">
      <section className="relative overflow-hidden pt-10 pb-14 sm:pt-14 lg:pt-18">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(233,30,140,0.22),transparent_32%),radial-gradient(circle_at_top_right,rgba(124,58,237,0.18),transparent_28%),linear-gradient(180deg,rgba(7,7,12,0.08),transparent_24%)]" />
        <div className="absolute left-[-6rem] top-20 h-72 w-72 rounded-full bg-[rgba(233,30,140,0.18)] blur-3xl" />
        <div className="absolute right-[-4rem] top-8 h-80 w-80 rounded-full bg-[rgba(245,158,11,0.10)] blur-3xl" />

        <div className="container-main relative z-10">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="mb-5 flex flex-wrap gap-3">
                <span className="badge badge-primary">
                  <Sparkles size={14} /> AI-first shopping
                </span>
                <span className="badge badge-gold">
                  <BadgePercent size={14} /> Exclusive drops and offers
                </span>
              </div>

              <h1 className="max-w-[11ch] text-[clamp(3rem,7vw,5.7rem)] font-black leading-[0.92] tracking-[-0.04em] text-[var(--text-primary)]">
                Glow Addict, rebuilt as a premium beauty store and app experience.
              </h1>

              <p className="mt-6 max-w-[640px] text-[17px] leading-[1.8] text-[var(--text-secondary)] sm:text-[18px]">
                {heroBanner.subtitle || 'Shop curated skincare, makeup, hair care, fragrance, and wellness with personalized recommendations, fast checkout, and a mobile-first storefront made to convert.'}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/products" className="btn-gradient inline-flex items-center gap-2 px-7 py-3.5 text-[15px] no-underline">
                  <span>Shop the full store</span>
                  <ArrowRight size={18} />
                </Link>
                <Link href="/ai-assistant" className="btn-outline inline-flex items-center gap-2 px-7 py-3.5 text-[15px] no-underline">
                  <Sparkles size={18} /> Try the AI concierge
                </Link>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {storefrontStats.map((stat) => (
                  <div key={stat.label} className="glass-card rounded-2xl p-4">
                    <div className="text-[28px] font-black tracking-[-0.03em] text-[var(--text-primary)]">{stat.value}</div>
                    <div className="mt-1 text-[13px] leading-5 text-[var(--text-muted)]">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {['Skincare resets', 'Makeup edits', 'Hair rescue', 'Fragrance layers', 'Wellness add-ons'].map((item) => (
                  <span key={item} className="rounded-full border border-[var(--border-glass)] bg-[var(--bg-glass)] px-3.5 py-2 text-[12px] font-semibold tracking-[0.02em] text-[var(--text-secondary)] backdrop-blur-xl">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative"
            >
              <div className="absolute -left-3 top-10 z-20 w-[170px] rounded-2xl border border-[var(--border-glass)] bg-[var(--bg-glass)] p-4 backdrop-blur-2xl sm:-left-6 sm:w-[220px]">
                <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold text-[var(--text-primary)]">
                  <Sparkles size={14} className="text-[var(--primary)]" />
                  Personalized routine
                </div>
                <p className="text-[12px] leading-5 text-[var(--text-secondary)]">
                  AI matched: hydration serum, SPF, and a glow finish for your next restock.
                </p>
              </div>

              <div className="absolute -right-2 top-6 z-20 w-[150px] rounded-2xl border border-[var(--border-glass)] bg-[var(--bg-glass)] p-4 text-right backdrop-blur-2xl sm:-right-6 sm:w-[180px]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">Order speed</div>
                <div className="mt-1 flex items-center justify-end gap-2 text-[18px] font-black text-[var(--text-primary)]">
                  <Clock3 size={16} className="text-[var(--accent-gold)]" /> 2 hrs
                </div>
                <p className="mt-1 text-[12px] leading-5 text-[var(--text-secondary)]">In metro areas for selected pin codes.</p>
              </div>

              <div className="glass-card relative h-[540px] overflow-hidden rounded-[30px] border border-[var(--border-glass-strong)] shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
                <Image
                  src={heroBanner.image_url || heroBanner.imageUrl || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1600&h=1400&fit=crop'}
                  alt={heroBanner.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1024px) 48vw, 92vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,12,0)_0%,rgba(7,7,12,0.15)_35%,rgba(7,7,12,0.85)_100%)]" />

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <div className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-3xl border border-white/10 bg-black/35 p-4 backdrop-blur-2xl">
                      <div className="flex items-center gap-2 text-[13px] font-semibold text-white/90">
                        <ShoppingBag size={14} className="text-[var(--accent-gold)]" />
                        Featured from the live drop
                      </div>
                      <div className="mt-2 text-[20px] font-black leading-tight text-white">
                        {heroBanner.title}
                      </div>
                      <p className="mt-2 text-[13px] leading-6 text-white/70">
                        A richer storefront, a cleaner mobile flow, and a more intentional path to purchase.
                      </p>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-black/35 p-4 backdrop-blur-2xl">
                      <div className="flex items-center justify-between text-[12px] font-semibold uppercase tracking-[0.12em] text-white/55">
                        <span>Live benefits</span>
                        <TrendingUp size={14} className="text-[var(--primary-light)]" />
                      </div>
                      <div className="mt-3 space-y-2 text-[13px] text-white/80">
                        <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-[var(--success)]" /> Secure checkout</div>
                        <div className="flex items-center gap-2"><Truck size={14} className="text-[var(--accent-gold)]" /> Fast delivery</div>
                        <div className="flex items-center gap-2"><Star size={14} className="text-[var(--accent-gold-light)]" /> Rated routines</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <ScrollReveal>
        <section className="container-main py-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {serviceHighlights.map((highlight) => {
              const Icon = highlight.icon;
              return (
                <div key={highlight.title} className="glass-card rounded-3xl p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(233,30,140,0.18),rgba(124,58,237,0.18))] text-[var(--primary)]">
                    <Icon size={22} />
                  </div>
                  <h2 className="text-[18px] font-bold text-[var(--text-primary)]">{highlight.title}</h2>
                  <p className="mt-2 text-[14px] leading-7 text-[var(--text-secondary)]">{highlight.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="container-main py-12">
          <div className="mb-8 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-3xl p-8 text-white">
            <div className="mb-4 text-sm font-black uppercase tracking-widest">✨ TRENDING</div>
            <h2 className="text-4xl font-black mb-6">Best offers on your favourite Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Face Packs', color: 'from-pink-300 to-purple-300' },
                { name: 'Face Washes', color: 'from-purple-300 to-blue-300' },
                { name: 'Serums', color: 'from-yellow-300 to-orange-300' },
                { name: 'Scrubs', color: 'from-green-300 to-cyan-300' },
                { name: 'Facial Kits', color: 'from-orange-300 to-pink-300' },
                { name: 'Night Creams', color: 'from-blue-300 to-purple-300' },
                { name: 'Hair Oils', color: 'from-pink-300 to-red-300' },
                { name: 'Hair Masks', color: 'from-yellow-300 to-green-300' },
              ].map((cat, idx) => (
                <Link key={idx} href={`/products?search=${cat.name.toLowerCase()}`} className={`bg-gradient-to-br ${cat.color} rounded-2xl p-4 text-center font-black text-gray-900 no-underline hover:shadow-lg transition-all transform hover:scale-105`}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                <ChevronRight size={14} className="text-[var(--primary)]" /> Collections
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] sm:text-[clamp(1.8rem,3vw,2.5rem)]">
                Browse like an app, shop like a flagship store.
              </h2>
            </div>
            <Link href="/products" className="hidden items-center gap-1 text-sm font-semibold text-[var(--primary)] no-underline sm:inline-flex">
              View all categories <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {collectionCards.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: index * 0.06, duration: 0.45 }}
              >
                <Link href={`/products?category=${collection.slug}`} className="group block no-underline">
                  <div className="glass-card overflow-hidden rounded-[24px] border border-[var(--border-glass)]">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={collection.imageUrl}
                        alt={collection.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,10,0)_10%,rgba(5,5,10,0.82)_100%)]" />
                      <div className="absolute left-4 top-4 rounded-full bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80 backdrop-blur-xl">
                        {collection.count} products
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-[20px] font-bold text-[var(--text-primary)]">{collection.name}</h3>
                      <p className="mt-2 text-[14px] leading-7 text-[var(--text-secondary)]">{collection.description}</p>
                      <div className="mt-4 inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--primary)]">
                        Explore collection <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="container-main py-12">
          {/* ELITE PRO Section */}
          <div className="mb-12 bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 rounded-3xl p-8 sm:p-12 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl" />
            <div className="relative z-10">
              <div className="mb-6 text-sm font-black uppercase tracking-widest">✨ ELITE PRO</div>
              <h2 className="text-4xl font-black mb-8">Full on Beauty, Full on Savings!</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: '🎁', title: 'Free Gift', desc: 'On every order of ₹749+' },
                  { icon: '🚚', title: 'Unlimited Shipping', desc: 'Free delivery always' },
                  { icon: '💵', title: 'Cash on Delivery', desc: 'On all orders' },
                  { icon: '🎉', title: 'Joining Gift', desc: 'Your choice reward' },
                ].map((benefit, idx) => (
                  <div key={idx} className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/30">
                    <div className="text-4xl mb-3">{benefit.icon}</div>
                    <div className="font-black text-lg mb-1">{benefit.title}</div>
                    <div className="text-sm text-white/90">{benefit.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="glass-card rounded-[28px] p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                <ShoppingBag size={14} className="text-[var(--accent-gold)]" /> Bestsellers
              </div>
              <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-bold text-[var(--text-primary)]">
                High-conversion products front and center.
              </h2>
              <p className="mt-3 max-w-[60ch] text-[15px] leading-7 text-[var(--text-secondary)]">
                Keep the catalog grounded in what shoppers actually want most. These are the products that sell, convert, and keep repeat orders coming back.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {bestSellers.map((product) => (
                  <div key={product.id} className="rounded-2xl border border-[var(--border-glass)] bg-[var(--bg-glass)] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[13px] font-semibold text-[var(--text-primary)]">{product.name}</div>
                        <p className="mt-1 text-[12px] leading-6 text-[var(--text-secondary)]">{product.shortDesc}</p>
                      </div>
                      <div className="rounded-full bg-[rgba(245,158,11,0.15)] px-2.5 py-1 text-[11px] font-bold text-[var(--accent-gold)]">
                        {product.ratingAvg.toFixed(1)}
                      </div>
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">From</div>
                        <div className="text-[18px] font-black text-[var(--text-primary)]">INR {formatPrice(product.salePrice ?? product.price)}</div>
                      </div>
                      <Link href={`/products/${product.slug}`} className="text-[13px] font-semibold text-[var(--primary)] no-underline">
                        Open
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card overflow-hidden rounded-[28px] p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                <TrendingUp size={14} className="text-[var(--primary)]" /> App experience
              </div>
              <h2 className="text-[clamp(1.7rem,3vw,2.4rem)] font-bold text-[var(--text-primary)]">
                The site should feel like the app users wish every store had.
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-[var(--text-secondary)]">
                This layout is designed to turn the storefront into a more useful product surface: easier to scan, faster to browse, and more persuasive on mobile.
              </p>

              <div className="mt-6 rounded-[24px] border border-[var(--border-glass)] bg-[linear-gradient(180deg,rgba(233,30,140,0.08),rgba(124,58,237,0.08))] p-5 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  {appBenefits.map((benefit) => (
                    <div key={benefit} className="flex items-start gap-3 rounded-2xl border border-white/5 bg-black/10 p-4 text-[14px] leading-6 text-[var(--text-secondary)]">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {newDrops.map((product) => (
                  <div key={product.id} className="rounded-2xl border border-[var(--border-glass)] bg-[var(--bg-glass)] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[12px] uppercase tracking-[0.12em] text-[var(--text-muted)]">New drop</div>
                        <div className="mt-1 text-[14px] font-semibold text-[var(--text-primary)]">{product.name}</div>
                      </div>
                      <div className="flex items-center gap-1 text-[12px] font-semibold text-[var(--accent-gold)]">
                        <Star size={13} fill="currentColor" />
                        {product.ratingAvg.toFixed(1)}
                      </div>
                    </div>
                    <p className="mt-2 text-[12px] leading-6 text-[var(--text-secondary)]">{product.shortDesc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/products" className="btn-gradient inline-flex items-center gap-2 px-6 py-3 no-underline">
                  <span>Build your cart</span>
                  <ShoppingBag size={17} />
                </Link>
                <Link href="/orders" className="btn-outline inline-flex items-center gap-2 px-6 py-3 no-underline">
                  Track my order <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="container-main py-8">
          <div className="glass-card rounded-[28px] bg-[linear-gradient(135deg,rgba(245,158,11,0.12),rgba(233,30,140,0.10),rgba(124,58,237,0.10))] p-7 sm:p-10">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--border-glass)] bg-[var(--bg-glass)] px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  <Gift size={14} className="text-[var(--accent-gold)]" /> Loyalty-ready commerce
                </div>
                <h2 className="text-[clamp(1.8rem,3vw,2.6rem)] font-bold leading-tight text-[var(--text-primary)]">
                  Make Glow Addict feel like a destination customers return to, not just a checkout page.
                </h2>
                <p className="mt-3 max-w-[64ch] text-[15px] leading-7 text-[var(--text-secondary)]">
                  The new direction gives you a stronger home page, a more premium product discovery flow, and app-style utility baked into the storefront layout.
                </p>
              </div>

              <div className="rounded-[24px] border border-[var(--border-glass)] bg-[var(--bg-secondary)] p-5">
                <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Included in the experience</div>
                <ul className="mt-4 space-y-3 text-[14px] leading-6 text-[var(--text-secondary)]">
                  <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 rounded-full bg-[var(--primary)]" /> Cohesive hero, collections, products, and app CTA blocks</li>
                  <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 rounded-full bg-[var(--accent-gold)]" /> Stronger mobile-first storytelling and conversion cues</li>
                  <li className="flex items-start gap-2"><span className="mt-2 h-2 w-2 rounded-full bg-[var(--success)]" /> Live content from banners, collections, and product data</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
