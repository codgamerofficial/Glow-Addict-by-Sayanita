'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { AdminBanner } from '@/types/admin';

export function HeroBanner({ banners }: { banners: AdminBanner[] }) {
  // Use the first active banner as the primary hero, or fallback to default
  const activeBanner = banners.find(b => b.is_active || b.isActive) || {
    title: 'Your Skin. Your Glow. Your Rules.',
    subtitle: 'Discover 10,000+ beauty products personalized by AI for your unique skin.',
    image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop'
  };

  return (
    <section style={{
      position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, #0A0A0F 0%, #1A0A20 30%, #0F0A1A 60%, #0A0A0F 100%)',
      padding: '60px 0 80px',
    }}>
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(233,30,140,0.15), transparent)', top: '-100px', right: '-100px', filter: 'blur(60px)' }}
      />

      <div className="container-main" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '48px', flexWrap: 'wrap' }}>
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ flex: '1 1 400px' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="badge badge-primary"
            style={{ marginBottom: '16px', fontSize: '13px' }}
          >
            <Sparkles size={14} /> AI-Powered Beauty
          </motion.div>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px' }}>
            <span style={{ display: 'block', color: 'white' }}>{activeBanner.title.split('.')[0]}.</span>
            <span className="gradient-text">{activeBanner.title.split('.')[1] || 'Glow'}.</span>
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '480px', marginBottom: '32px' }}>
            {activeBanner.subtitle}
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/products" className="btn-gradient" style={{ padding: '14px 32px', fontSize: '15px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span>Shop Now <ArrowRight size={18} /></span>
            </Link>
            <Link href="/ai-assistant" className="btn-outline" style={{ padding: '14px 32px', fontSize: '15px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              ✨ Try AI Assistant
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{ flex: '0 1 380px', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--border-glass)', position: 'relative', height: '400px' }}
        >
          <Image 
            src={activeBanner.image_url || activeBanner.imageUrl || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=1000&fit=crop'} 
            alt="Hero" fill style={{ objectFit: 'cover' }} 
          />
        </motion.div>
      </div>
    </section>
  );
}
