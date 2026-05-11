'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

const labelMap: Record<string, { title: string; kicker: string; blurb: string }> = {
  '/': {
    title: 'Your Daily Glow Ritual',
    kicker: 'Fresh Picks',
    blurb: 'Discover new textures, tones, and formulas curated for your mood today.',
  },
  '/products': {
    title: 'Curated Beauty Library',
    kicker: 'Shop Stories',
    blurb: 'Each collection is grouped by concern, finish, and routine outcome.',
  },
  '/wishlist': {
    title: 'Your Saved Glow Map',
    kicker: 'Dream Shelf',
    blurb: 'Everything you loved, now organized into your next-ready beauty cart.',
  },
  '/profile': {
    title: 'Your Beauty Identity',
    kicker: 'Personal Hub',
    blurb: 'Track preferences, orders, and recommendations in one smooth space.',
  },
  '/cart': {
    title: 'Almost Yours',
    kicker: 'Checkout Story',
    blurb: 'A quick review of your selected products before your glow ships out.',
  },
  '/checkout': {
    title: 'Secure Glow Checkout',
    kicker: 'Final Step',
    blurb: 'Fast payment, trusted delivery, and one-step confirmation flow.',
  },
};

function resolveContent(pathname: string) {
  if (labelMap[pathname]) {
    return labelMap[pathname];
  }

  if (pathname.startsWith('/products/')) {
    return {
      title: 'Product Deep Dive',
      kicker: 'Glow Details',
      blurb: 'Ingredient story, texture feel, and real routine fit in one place.',
    };
  }

  if (pathname.startsWith('/orders')) {
    return {
      title: 'Order Journey',
      kicker: 'Live Tracking',
      blurb: 'Follow status, shipping milestones, and support updates instantly.',
    };
  }

  return {
    title: 'Glow Addict Experience',
    kicker: 'Beauty Story',
    blurb: 'Every section is designed as a guided beauty journey, not just a page.',
  };
}

export default function ShopTemplate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const content = resolveContent(pathname);
  const showHero = pathname !== '/';

  return (
    <div className="pb-4 md:pb-6">
      {showHero && (
        <section className="container-main pt-3 md:pt-4 pb-3">
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.2, 0.75, 0.2, 1] }}
            className="story-section relative overflow-hidden p-5 md:p-7"
          >
            <span className="floating-blob w-24 h-24 -top-8 right-10 bg-purple-400/50" aria-hidden />
            <span className="floating-blob w-20 h-20 top-12 -left-8 bg-yellow-300/45" style={{ animationDelay: '1.1s' }} aria-hidden />

            <p className="story-kicker text-sm text-white/85 mb-1.5">{content.kicker}</p>
            <h1 className="story-title text-3xl md:text-4xl font-black text-white mb-2">{content.title}</h1>
            <p className="text-sm md:text-[15px] text-white/85 max-w-3xl leading-relaxed">{content.blurb}</p>
            <div className="mt-4 inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-white/90 bg-white/10 rounded-full px-3 py-1.5 border border-white/20">
              <Sparkles size={14} className="text-yellow-300" />
              Designed for speed, freshness, and joyful shopping flow
            </div>
          </motion.div>
        </section>
      )}

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.2, 0.75, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
