'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles, Star, Zap, Gift, TrendingUp, Clock } from 'lucide-react';
import { products } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

/* ============ TRENDING ============ */
export function TrendingSection() {
  const trending = products.filter(p => p.isBestseller).slice(0, 4);
  return (
    <ScrollReveal>
      <section className="py-12">
        <div className="container-main">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={20} className="text-[var(--primary)]" />
                <h2 className="font-outfit text-2xl font-bold">Trending Now</h2>
              </div>
              <p className="text-sm text-[var(--text-muted)]">What everyone is loving right now</p>
            </div>
            <Link href="/products" className="text-[var(--primary)] no-underline text-sm font-medium flex items-center gap-1">
              See All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {trending.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

/* ============ FLASH DEAL ============ */
export function FlashDeal() {
  const [timeLeft, setTimeLeft] = useState({ h: 5, m: 42, s: 18 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <ScrollReveal>
      <section className="py-12">
        <div className="container-main">
          <motion.div
            whileHover={{ scale: 1.005 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="glass-card bg-gradient-to-br from-[rgba(233,30,140,0.1)] to-[rgba(124,58,237,0.1)] p-8 flex justify-between items-center flex-wrap gap-5"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}>
                  <Zap size={22} className="text-[var(--accent-gold)]" />
                </motion.div>
                <h2 className="font-outfit text-2xl font-bold">Flash Deal</h2>
                <span className="badge badge-gold sale-badge">UP TO 60% OFF</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">Grab premium beauty at unbelievable prices. Hurry, limited stock!</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-[var(--primary)]" />
              <span className="text-sm text-[var(--text-muted)] mr-2">Ends in:</span>
              {[
                { v: timeLeft.h, l: 'HRS' },
                { v: timeLeft.m, l: 'MIN' },
                { v: timeLeft.s, l: 'SEC' },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-lg py-2 px-3 text-center min-w-[52px]">
                    <motion.div
                      key={t.v}
                      initial={{ y: -8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="font-outfit text-xl font-bold text-[var(--primary)]"
                    >
                      {String(t.v).padStart(2, '0')}
                    </motion.div>
                    <div className="text-[9px] text-[var(--text-muted)] font-semibold">{t.l}</div>
                  </div>
                  {i < 2 && <span className="text-xl font-bold text-[var(--text-muted)]">:</span>}
                </div>
              ))}
            </div>
          </motion.div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 mt-5">
            {products.filter(p => p.salePrice).slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

/* ============ AI PICKS ============ */
export function AIRecommendations() {
  const aiPicks = products.filter(p => p.ratingAvg && p.ratingAvg >= 4.5).slice(0, 4);
  return (
    <ScrollReveal>
      <section className="py-12">
        <div className="container-main">
          <motion.div
            whileHover={{ scale: 1.005 }}
            className="glass-card bg-gradient-to-br from-[rgba(124,58,237,0.08)] to-[rgba(233,30,140,0.08)] p-6 mb-5"
          >
            <div className="flex items-center gap-3 mb-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center"
              >
                <Sparkles size={20} color="white" />
              </motion.div>
              <div>
                <h2 className="font-outfit text-xl font-bold">AI Picks For You</h2>
                <p className="text-[13px] text-[var(--text-muted)]">Curated by our AI based on your skin profile</p>
              </div>
            </div>
          </motion.div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {aiPicks.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}

/* ============ LOYALTY BANNER ============ */
export function LoyaltyBanner() {
  return (
    <ScrollReveal>
      <section className="py-12">
        <div className="container-main">
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="glass-card bg-gradient-to-br from-[rgba(245,158,11,0.1)] to-[rgba(233,30,140,0.08)] p-10 text-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Gift size={40} className="text-[var(--accent-gold)] mb-4" />
            </motion.div>
            <h2 className="font-outfit text-[28px] font-bold mb-3">
              Join <span className="gradient-text">Glow Rewards</span>
            </h2>
            <p className="text-[15px] text-[var(--text-secondary)] max-w-[500px] mx-auto mb-6 leading-[1.6]">
              Earn points on every purchase, get birthday gifts, early access to sales, and exclusive member-only deals. It&apos;s free to join!
            </p>
            <motion.button whileTap={{ scale: 0.95 }} className="btn-gradient p-3.5 px-10 text-[15px]">
              <span>Join Now — It&apos;s Free ✨</span>
            </motion.button>
          </motion.div>
        </div>
      </section>
    </ScrollReveal>
  );
}

/* ============ NEW ARRIVALS ============ */
export function NewArrivals() {
  const newProducts = products.filter(p => p.isNew).slice(0, 4);
  return (
    <ScrollReveal>
      <section className="py-12">
        <div className="container-main">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star size={20} className="text-[var(--accent-gold)]" />
                <h2 className="font-outfit text-2xl font-bold">New Arrivals</h2>
              </div>
              <p className="text-sm text-[var(--text-muted)]">Fresh drops you don&apos;t want to miss</p>
            </div>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
            {newProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
