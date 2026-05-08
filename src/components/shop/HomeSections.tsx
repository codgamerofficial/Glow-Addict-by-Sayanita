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
      <section style={{ padding: '48px 0' }}>
        <div className="container-main">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <TrendingUp size={20} style={{ color: 'var(--primary)' }} />
                <h2 style={{ fontFamily: 'Outfit', fontSize: '24px', fontWeight: 700 }}>Trending Now</h2>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>What everyone is loving right now</p>
            </div>
            <Link href="/products" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
              See All <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
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
      <section style={{ padding: '48px 0' }}>
        <div className="container-main">
          <motion.div
            whileHover={{ scale: 1.005 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="glass-card"
            style={{
              background: 'linear-gradient(135deg, rgba(233,30,140,0.1), rgba(124,58,237,0.1))',
              padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <motion.div animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}>
                  <Zap size={22} style={{ color: 'var(--accent-gold)' }} />
                </motion.div>
                <h2 style={{ fontFamily: 'Outfit', fontSize: '24px', fontWeight: 700 }}>Flash Deal</h2>
                <span className="badge badge-gold sale-badge">UP TO 60% OFF</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Grab premium beauty at unbelievable prices. Hurry, limited stock!</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} style={{ color: 'var(--primary)' }} />
              <span style={{ fontSize: '14px', color: 'var(--text-muted)', marginRight: '8px' }}>Ends in:</span>
              {[
                { v: timeLeft.h, l: 'HRS' },
                { v: timeLeft.m, l: 'MIN' },
                { v: timeLeft.s, l: 'SEC' },
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
                    borderRadius: '8px', padding: '8px 12px', textAlign: 'center', minWidth: '52px',
                  }}>
                    <motion.div
                      key={t.v}
                      initial={{ y: -8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      style={{ fontFamily: 'Outfit', fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}
                    >
                      {String(t.v).padStart(2, '0')}
                    </motion.div>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 600 }}>{t.l}</div>
                  </div>
                  {i < 2 && <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-muted)' }}>:</span>}
                </div>
              ))}
            </div>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', marginTop: '20px' }}>
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
      <section style={{ padding: '48px 0' }}>
        <div className="container-main">
          <motion.div
            whileHover={{ scale: 1.005 }}
            className="glass-card"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(233,30,140,0.08))',
              padding: '24px', marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Sparkles size={20} color="white" />
              </motion.div>
              <div>
                <h2 style={{ fontFamily: 'Outfit', fontSize: '20px', fontWeight: 700 }}>AI Picks For You</h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Curated by our AI based on your skin profile</p>
              </div>
            </div>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
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
      <section style={{ padding: '48px 0' }}>
        <div className="container-main">
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="glass-card"
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(233,30,140,0.08))',
              padding: '40px', textAlign: 'center',
            }}
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Gift size={40} style={{ color: 'var(--accent-gold)', marginBottom: '16px' }} />
            </motion.div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
              Join <span className="gradient-text">Glow Rewards</span>
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 24px', lineHeight: 1.6 }}>
              Earn points on every purchase, get birthday gifts, early access to sales, and exclusive member-only deals. It&apos;s free to join!
            </p>
            <motion.button whileTap={{ scale: 0.95 }} className="btn-gradient" style={{ padding: '14px 40px', fontSize: '15px' }}>
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
      <section style={{ padding: '48px 0' }}>
        <div className="container-main">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Star size={20} style={{ color: 'var(--accent-gold)' }} />
                <h2 style={{ fontFamily: 'Outfit', fontSize: '24px', fontWeight: 700 }}>New Arrivals</h2>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Fresh drops you don&apos;t want to miss</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
            {newProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
