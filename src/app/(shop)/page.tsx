'use client';
import Link from 'next/link';
import { ArrowRight, Sparkles, Star, Zap, Gift, TrendingUp, Clock } from 'lucide-react';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import ProductCard from '@/components/product/ProductCard';
import { useEffect, useState } from 'react';

/* ============ HERO ============ */
function HeroBanner() {
  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, #0A0A0F 0%, #1A0A20 30%, #0F0A1A 60%, #0A0A0F 100%)',
      padding: '60px 0 80px',
    }}>
      {/* Floating orbs */}
      <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(233,30,140,0.15), transparent)', top: '-100px', right: '-100px', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent)', bottom: '-50px', left: '-50px', filter: 'blur(50px)' }} />

      <div className="container-main" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '48px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 400px' }}>
          <div className="badge badge-primary" style={{ marginBottom: '16px', fontSize: '13px' }}>
            <Sparkles size={14} /> AI-Powered Beauty
          </div>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px' }}>
            <span style={{ color: 'white' }}>Your Skin.</span><br />
            <span className="gradient-text">Your Glow.</span><br />
            <span style={{ color: 'white' }}>Your Rules.</span>
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '480px', marginBottom: '32px' }}>
            Discover 10,000+ beauty products personalized by AI for your unique skin. Get expert recommendations, build custom routines, and glow like never before.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/products" className="btn-gradient" style={{ padding: '14px 32px', fontSize: '15px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>Shop Now <ArrowRight size={18} /></span>
            </Link>
            <Link href="/ai-assistant" className="btn-outline" style={{ padding: '14px 32px', fontSize: '15px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              ✨ Try AI Beauty Assistant
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '32px', marginTop: '40px' }}>
            {[
              { num: '10K+', label: 'Products' },
              { num: '500+', label: 'Brands' },
              { num: '2M+', label: 'Happy Customers' },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontFamily: 'Outfit', fontSize: '24px', fontWeight: 700 }} className="gradient-text">{s.num}</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hero image grid */}
        <div style={{ flex: '0 1 380px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=380&fit=crop',
            'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300&h=280&fit=crop',
            'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&h=280&fit=crop',
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=380&fit=crop',
          ].map((src, i) => (
            <div key={i} style={{
              borderRadius: '16px', overflow: 'hidden',
              height: i % 2 === 0 ? '200px' : '160px',
              border: '1px solid var(--border-glass)',
            }}>
              <img src={src} alt="Beauty" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ CATEGORIES ============ */
function CategoryGrid() {
  return (
    <section style={{ padding: '48px 0' }}>
      <div className="container-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '24px', fontWeight: 700 }}>Shop by Category</h2>
          <Link href="/products" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
          {categories.map((cat) => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`} style={{ textDecoration: 'none' }}>
              <div className="glass-card" style={{ textAlign: 'center', padding: '20px 12px', cursor: 'pointer' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{cat.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{cat.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{cat.productCount} Products</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ TRENDING ============ */
function TrendingSection() {
  const trending = products.filter(p => p.isBestseller).slice(0, 4);
  return (
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
  );
}

/* ============ FLASH DEAL ============ */
function FlashDeal() {
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
    <section style={{ padding: '48px 0' }}>
      <div className="container-main">
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(233,30,140,0.1), rgba(124,58,237,0.1))',
          padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Zap size={22} style={{ color: 'var(--accent-gold)' }} />
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
                  <div style={{ fontFamily: 'Outfit', fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>
                    {String(t.v).padStart(2, '0')}
                  </div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 600 }}>{t.l}</div>
                </div>
                {i < 2 && <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-muted)' }}>:</span>}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', marginTop: '20px' }}>
          {products.filter(p => p.salePrice).slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

/* ============ AI PICKS ============ */
function AIRecommendations() {
  const aiPicks = products.filter(p => p.ratingAvg >= 4.5).slice(0, 4);
  return (
    <section style={{ padding: '48px 0' }}>
      <div className="container-main">
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(233,30,140,0.08))',
          padding: '24px', marginBottom: '20px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Sparkles size={20} color="white" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Outfit', fontSize: '20px', fontWeight: 700 }}>AI Picks For You</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Curated by our AI based on your skin profile</p>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {aiPicks.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

/* ============ LOYALTY BANNER ============ */
function LoyaltyBanner() {
  return (
    <section style={{ padding: '48px 0' }}>
      <div className="container-main">
        <div className="glass-card" style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(233,30,140,0.08))',
          padding: '40px', textAlign: 'center',
        }}>
          <Gift size={40} style={{ color: 'var(--accent-gold)', marginBottom: '16px' }} />
          <h2 style={{ fontFamily: 'Outfit', fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>
            Join <span className="gradient-text">Glow Rewards</span>
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Earn points on every purchase, get birthday gifts, early access to sales, and exclusive member-only deals. It&apos;s free to join!
          </p>
          <button className="btn-gradient" style={{ padding: '14px 40px', fontSize: '15px' }}>
            <span>Join Now — It&apos;s Free ✨</span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ============ NEW ARRIVALS ============ */
function NewArrivals() {
  const newProducts = products.filter(p => p.isNew).slice(0, 4);
  return (
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
  );
}

/* ============ MAIN PAGE ============ */
export default function HomePage() {
  return (
    <div className="animate-fade-in">
      <HeroBanner />
      <CategoryGrid />
      <TrendingSection />
      <FlashDeal />
      <AIRecommendations />
      <NewArrivals />
      <LoyaltyBanner />
    </div>
  );
}
