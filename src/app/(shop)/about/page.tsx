'use client';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Shield, Users } from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="container-main p-10 px-4 max-w-[800px]">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative h-20 w-auto flex justify-center mb-4">
            <Image 
              src="/images/logo.png" 
              alt="Glow Addict" 
              width={200} 
              height={80} 
              className="h-full w-auto object-contain"
              priority
            />
          </div>
          <h1 className="font-outfit text-4xl font-extrabold mb-2">
            About <span className="gradient-text">Glow Addict</span>
          </h1>
          <p className="text-[var(--text-muted)] text-base">by Sayanita</p>
        </div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 mb-6"
        >
          <h2 className="font-outfit text-xl font-bold mb-4 flex items-center gap-2">
            <Heart size={22} className="text-[var(--primary)]" /> Our Story
          </h2>
          <div className="text-[15px] leading-relaxed text-[var(--text-secondary)]">
            <p className="mb-4">
              <strong>Glow Addict by Sayanita</strong> is an online beauty and skincare business founded and curated by <strong>Sayanita</strong> (also known as <strong>Sayanita Payra</strong>), who is a nurse by profession.
            </p>
            <p className="mb-4">
              Born out of a deep passion for skincare science and a desire to make quality beauty products accessible to everyone, Glow Addict operates primarily through social media platforms like <strong>Instagram</strong> and <strong>Facebook</strong>, where it offers curated skincare bundles, makeup products, and lifestyle accessories.
            </p>
            <p className="mb-4">
              As a healthcare professional, Sayanita brings a unique, science-backed perspective to beauty. Every product in our collection is carefully researched and tested to ensure it meets our high standards of quality, safety, and effectiveness.
            </p>
            <p>
              Today, Glow Addict has evolved into India&apos;s smartest beauty destination — combining Sayanita&apos;s expertise with cutting-edge AI technology to deliver hyper-personalized skincare and makeup recommendations to every customer.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-8">
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
              className="glass-card p-6 text-center"
            >
              <Icon size={28} className="text-[var(--primary)] mb-3" />
              <h3 className="font-outfit text-base font-semibold mb-2">{title}</h3>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/products" className="btn-gradient p-3.5 px-8 text-[15px] no-underline inline-block">
            <span>Explore Our Collection</span>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
