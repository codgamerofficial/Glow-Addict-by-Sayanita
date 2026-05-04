'use client';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Shield, Users } from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="container-main" style={{ padding: '40px 16px', maxWidth: '800px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <img src="/images/logo.png" alt="Glow Addict" style={{ height: '80px', width: 'auto', objectFit: 'contain', margin: '0 auto 16px', display: 'block' }} />
          <h1 style={{ fontFamily: 'Outfit', fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>
            About <span className="gradient-text">Glow Addict</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>by Sayanita</p>
        </div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card"
          style={{ padding: '32px', marginBottom: '24px' }}
        >
          <h2 style={{ fontFamily: 'Outfit', fontSize: '22px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={22} style={{ color: 'var(--primary)' }} /> Our Story
          </h2>
          <div style={{ fontSize: '15px', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: '16px' }}>
              <strong>Glow Addict by Sayanita</strong> is an online beauty and skincare business founded and curated by <strong>Sayanita</strong> (also known as <strong>Sayanita Payra</strong>), who is a nurse by profession.
            </p>
            <p style={{ marginBottom: '16px' }}>
              Born out of a deep passion for skincare science and a desire to make quality beauty products accessible to everyone, Glow Addict operates primarily through social media platforms like <strong>Instagram</strong> and <strong>Facebook</strong>, where it offers curated skincare bundles, makeup products, and lifestyle accessories.
            </p>
            <p style={{ marginBottom: '16px' }}>
              As a healthcare professional, Sayanita brings a unique, science-backed perspective to beauty. Every product in our collection is carefully researched and tested to ensure it meets our high standards of quality, safety, and effectiveness.
            </p>
            <p>
              Today, Glow Addict has evolved into India&apos;s smartest beauty destination — combining Sayanita&apos;s expertise with cutting-edge AI technology to deliver hyper-personalized skincare and makeup recommendations to every customer.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { icon: Sparkles, title: 'AI-Powered', desc: 'Smart beauty recommendations powered by advanced AI that understands your unique skin.' },
            { icon: Shield, title: 'Science-Backed', desc: 'Every product is vetted by our founder — a healthcare professional who knows what works.' },
            { icon: Heart, title: 'Curated with Love', desc: 'Hand-picked collections of the best skincare, makeup, and wellness products in India.' },
            { icon: Users, title: 'Community First', desc: 'Built for Indian Gen-Z & millennials who deserve premium beauty without the premium price.' },
          ].map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass-card"
              style={{ padding: '24px', textAlign: 'center' }}
            >
              <Icon size={28} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
              <h3 style={{ fontFamily: 'Outfit', fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>{title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/products" className="btn-gradient" style={{ padding: '14px 32px', fontSize: '15px', textDecoration: 'none', display: 'inline-block' }}>
            <span>Explore Our Collection</span>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
