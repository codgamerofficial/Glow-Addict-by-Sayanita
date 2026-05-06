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
      <section style={{ padding: '48px 0' }}>
        <div className="container-main">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '24px', fontWeight: 700 }}>{collections.length > 0 ? 'Featured Collections' : 'Shop by Category'}</h2>
            <Link href="/products" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
            {displayItems.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link href={`/products?category=${cat.slug}`} style={{ textDecoration: 'none' }}>
                  <motion.div whileTap={{ scale: 0.95 }} whileHover={{ y: -4 }} className="glass-card" style={{ textAlign: 'center', padding: '20px 12px', cursor: 'pointer' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{'icon' in cat ? cat.icon : '✨'}</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{cat.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{('productCount' in cat ? cat.productCount : cat.count)} Products</div>
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
