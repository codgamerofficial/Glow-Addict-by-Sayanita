'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { categories as staticCategories } from '@/data/categories';
import { AdminCollection } from '@/types/admin';
import { ScrollReveal } from '../shared/ScrollReveal';

export function CategoryGrid({ collections }: { collections: AdminCollection[] }) {
  // Use live collections if available, otherwise fallback to static categories
  const displayItems = collections.length > 0 
    ? collections.filter(c => c.is_active).map(c => ({ id: c.id, name: c.name, slug: c.slug, icon: '✨', count: c.count || 0 }))
    : staticCategories.slice(0, 8);

  return (
    <ScrollReveal>
      <section className="py-12">
        <div className="container-main">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-outfit text-2xl font-bold">{collections.length > 0 ? 'Featured Collections' : 'Shop by Category'}</h2>
            <Link href="/products" className="text-[var(--primary)] no-underline text-sm font-medium flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
            {displayItems.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link href={`/products?category=${cat.slug}`} className="no-underline">
                  <motion.div whileTap={{ scale: 0.95 }} whileHover={{ y: -4 }} className="glass-card text-center p-5 px-3 cursor-pointer">
                    <div className="text-[32px] mb-2">{'icon' in cat ? cat.icon : '✨'}</div>
                    <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">{cat.name}</div>
                    <div className="text-[12px] text-[var(--text-muted)]">{('productCount' in cat ? cat.productCount : cat.count)} Products</div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
