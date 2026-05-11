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
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0A0A0F] via-[#1A0A20] via-[#0F0A1A] to-[#0A0A0F] py-15 pb-20">
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(233,30,140,0.15),transparent)] -top-[100px] -right-[100px] blur-[60px]"
      />

      <div className="container-main relative z-1 flex items-center gap-12 flex-wrap">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex-[1_1_400px]"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="badge badge-primary mb-4 text-[13px]"
          >
            <Sparkles size={14} /> AI-Powered Beauty
          </motion.div>
          <h1 className="font-outfit text-[clamp(32px,5vw,56px)] font-extrabold leading-[1.1] mb-5">
            <span className="block text-white">{activeBanner.title.split('.')[0]}.</span>
            <span className="gradient-text">{activeBanner.title.split('.')[1] || 'Glow'}.</span>
          </h1>
          <p className="text-[17px] text-[var(--text-secondary)] leading-[1.7] max-w-[480px] mb-8">
            {activeBanner.subtitle}
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/products" className="btn-gradient p-3.5 px-8 text-[15px] no-underline inline-flex items-center gap-2">
              <span>Shop Now <ArrowRight size={18} /></span>
            </Link>
            <Link href="/ai-assistant" className="btn-outline p-3.5 px-8 text-[15px] no-underline inline-flex items-center gap-2">
              ✨ Try AI Assistant
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex-[0_1_380px] rounded-3xl overflow-hidden border border-[var(--border-glass)] relative h-[400px]"
        >
          <Image 
            src={activeBanner.image_url || activeBanner.imageUrl || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=1000&fit=crop'} 
            alt="Hero" fill className="object-cover" 
          />
        </motion.div>
      </div>
    </section>
  );
}
