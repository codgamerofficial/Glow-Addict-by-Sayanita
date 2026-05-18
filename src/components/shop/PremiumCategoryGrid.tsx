'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Droplets,
  Sun,
  Moon,
  Pipette,
  Sparkles,
  Heart,
  Sparkle,
  SparkleIcon,
  ShieldCheck,
  Zap,
  Palette,
  Gift,
  CircleDot,
  ShowerHead,
} from 'lucide-react';

const categories = [
  { name: 'FACEWASH', slug: 'facewash', icon: Droplets },
  { name: 'SUNSCREEN', slug: 'sunscreen', icon: Sun },
  { name: 'MOISTURIZER', slug: 'moisturizer', icon: Droplets },
  { name: 'SERUM', slug: 'serum', icon: Pipette },
  { name: 'BODY MIST', slug: 'body-mist', icon: Sparkle },
  { name: 'FACE SCRUB', slug: 'face-scrub', icon: Sparkles },
  { name: 'LIP BALM', slug: 'lip-balm', icon: Heart },
  { name: 'LIP GLOSS', slug: 'lip-gloss', icon: Sparkle },
  { name: 'FACE MASK', slug: 'face-mask', icon: SparkleIcon },
  { name: 'SHEET MASK', slug: 'sheet-mask', icon: ShieldCheck },
  { name: 'STROBE CREAM', slug: 'strobe-cream', icon: Zap },
  { name: 'NIGHT CREAM', slug: 'night-cream', icon: Moon },
  { name: 'BODY SCRUB', slug: 'body-scrub', icon: Sparkles },
  { name: 'BODY WASH', slug: 'body-wash', icon: ShowerHead },
  { name: 'UNDER ARM ROLL ON', slug: 'under-arm-roll-on', icon: CircleDot },
  { name: 'NAILS', slug: 'nails', icon: Palette },
  { name: 'COMBO', slug: 'combo', icon: Gift },
];

const gradientPairs = [
  ['from-purple-400', 'to-pink-400'],
  ['from-pink-400', 'to-rose-400'],
  ['from-rose-400', 'to-orange-300'],
  ['from-orange-300', 'to-amber-300'],
  ['from-amber-300', 'to-yellow-300'],
  ['from-yellow-300', 'to-lime-300'],
  ['from-lime-300', 'to-emerald-300'],
  ['from-emerald-300', 'to-teal-300'],
  ['from-teal-300', 'to-cyan-300'],
  ['from-cyan-300', 'to-sky-300'],
  ['from-sky-300', 'to-blue-300'],
  ['from-blue-300', 'to-indigo-300'],
  ['from-indigo-300', 'to-violet-300'],
  ['from-violet-300', 'to-purple-400'],
  ['from-purple-300', 'to-fuchsia-300'],
  ['from-fuchsia-300', 'to-pink-400'],
  ['from-pink-300', 'to-rose-400'],
];

const glowColors = [
  'rgba(168, 85, 247, 0.4)',
  'rgba(244, 114, 182, 0.4)',
  'rgba(251, 146, 60, 0.4)',
  'rgba(132, 204, 22, 0.4)',
  'rgba(34, 211, 238, 0.4)',
  'rgba(99, 102, 241, 0.4)',
  'rgba(236, 72, 153, 0.4)',
  'rgba(168, 85, 247, 0.4)',
];

export function PremiumCategoryGrid() {
  return (
    <section className="section-pad premium-categories">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-200/20 to-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl" />
      </div>
      
      <div className="container-main relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-bold tracking-wider text-pink-500 uppercase bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-full backdrop-blur-sm border border-pink-500/20">
            <Sparkle size={14} />
            Shop by Category
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
            Find Your{' '}
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Perfect Glow
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our premium collection of beauty essentials, curated for every skin type and beauty routine
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
          {categories.map((category, index) => {
            const Icon = category.icon;
            const gradients = gradientPairs[index % gradientPairs.length];
            const glowColor = glowColors[index % glowColors.length];
            
            return (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.03, duration: 0.4, ease: [0.2, 0.9, 0.2, 1] }}
                whileHover={{ scale: 1.05, y: -8 }}
                className="group"
              >
                <Link
                  href={`/products?category=${category.slug}`}
                  className="relative block aspect-square"
                >
                  <div className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/40 to-white/5 backdrop-blur-xl border border-white/30 shadow-lg group-hover:shadow-2xl transition-all duration-500" />
                  
                  <div className={`absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-br ${gradients[0]} ${gradients[1]} opacity-80 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  <div className="absolute inset-0 rounded-2xl md:rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                  </div>
                  
                  <div 
                    className="absolute inset-0 rounded-2xl md:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      boxShadow: `0 0 40px 10px ${glowColor}`,
                    }}
                  />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10">
                    <motion.div
                      className="relative mb-4"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                    >
                      <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl transform scale-150" />
                      <div className="relative p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/40">
                        <Icon size={28} className="text-white drop-shadow-lg" strokeWidth={1.5} />
                      </div>
                    </motion.div>
                    
                    <h3 className="text-sm md:text-base font-black text-white text-center tracking-wide drop-shadow-lg">
                      {category.name}
                    </h3>
                    
                    <div className="mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs font-semibold text-white/80">Explore</span>
                      <Sparkle size={12} className="text-white/80" />
                    </div>
                  </div>
                  
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-white/60 animate-pulse" />
                  <div className="absolute bottom-3 left-3 w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-3 px-8 py-4 text-base font-bold rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
          >
            <Sparkle size={20} />
            View All Products
            <Sparkle size={20} />
          </Link>
        </motion.div>
      </div>

      <style jsx global>{`
        .premium-categories {
          position: relative;
          background: linear-gradient(180deg, var(--bg-primary) 0%, rgba(253, 242, 248, 0.5) 50%, var(--bg-primary) 100%);
          overflow: hidden;
        }

        [data-theme="dark"] .premium-categories {
          background: linear-gradient(180deg, var(--bg-primary) 0%, rgba(30, 15, 35, 0.8) 50%, var(--bg-primary) 100%);
        }

        .premium-categories::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 30% 30%, rgba(244, 114, 182, 0.08) 0%, transparent 50%),
                      radial-gradient(circle at 70% 70%, rgba(168, 85, 247, 0.08) 0%, transparent 50%);
          animation: float 20s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(5deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
        }

        @media (max-width: 768px) {
          .premium-categories {
            padding-top: 2rem;
            padding-bottom: 2rem;
          }
        }
      `}</style>
    </section>
  );
}
