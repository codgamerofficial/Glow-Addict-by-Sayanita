'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkle } from 'lucide-react';
import { categories as staticCategories } from '@/data/categories';
import { AdminCollection } from '@/types/admin';
import { ScrollReveal } from '../shared/ScrollReveal';

const fallbackImages = staticCategories.reduce<Record<string, string>>((acc, category) => {
  acc[category.slug] = category.imageUrl;
  return acc;
}, {});

export function CategoryGrid({ collections }: { collections: AdminCollection[] }) {
  const liveItems = collections
    .filter((c) => c.is_active)
    .map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || 'Handpicked beauty edits',
      productCount: c.count || 0,
      imageUrl: fallbackImages[c.slug] || staticCategories[0].imageUrl,
    }));

  const displayItems = liveItems.length > 0 ? liveItems : staticCategories.slice(0, 8);

  return (
    <ScrollReveal>
      <section className="section-pad category-showcase">
        <div className="container-main">
          <div className="section-heading">
            <div>
              <h2>{liveItems.length > 0 ? 'Featured beauty edits' : 'Shop by glow goal'}</h2>
              <p>Explore curated departments with premium product discovery, clean category cues, and sale-ready browsing.</p>
            </div>
            <Link href="/products" className="category-view-link">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          <div className="category-grid">
            {displayItems.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: index * 0.04, duration: 0.45 }}
              >
                <Link href={`/products?category=${cat.slug}`} className="category-card">
                  <div className="category-image">
                    <Image src={cat.imageUrl} alt={cat.name} fill sizes="(max-width: 768px) 50vw, 220px" />
                  </div>
                  <div className="category-content">
                    <Sparkle size={15} />
                    <h3>{cat.name}</h3>
                    <p>{'description' in cat && cat.description ? cat.description : 'Trending beauty essentials'}</p>
                    <span>{cat.productCount} products</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        <style jsx global>{`
          .category-showcase {
            background: linear-gradient(180deg, var(--bg-primary), rgba(255, 255, 255, 0));
          }

          .category-view-link {
            display: inline-flex;
            align-items: center;
            gap: clamp(4px, 0.8vw, 8px);
            color: var(--primary);
            font-family: var(--font-display);
            font-size: clamp(12px, 1vw, 14px);
            font-weight: 900;
            text-decoration: none;
          }

          .category-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: clamp(14px, 2vw, 18px);
          }

          .category-card {
            position: relative;
            display: block;
            min-height: clamp(220px, 35vw, 300px);
            overflow: hidden;
            border: 1px solid var(--line);
            border-radius: clamp(24px, 3vw, 30px);
            color: #fff;
            text-decoration: none;
            background: #1b1018;
            box-shadow: var(--shadow-card);
            isolation: isolate;
          }

          .category-card::after {
            content: "";
            position: absolute;
            inset: 0;
            z-index: 1;
            background:
              linear-gradient(180deg, rgba(20, 8, 18, 0.02) 0%, rgba(20, 8, 18, 0.26) 42%, rgba(20, 8, 18, 0.82) 100%),
              radial-gradient(circle at 80% 15%, rgba(255, 212, 71, 0.46), transparent 28%);
          }

          .category-image {
            position: absolute;
            inset: 0;
          }

          .category-image img {
            object-fit: cover;
            transition: transform 0.65s var(--spring), filter 0.65s var(--spring);
          }

          .category-card:hover .category-image img {
            transform: scale(1.08);
            filter: saturate(1.08);
          }

          .category-content {
            position: absolute;
            inset: auto 0 0;
            z-index: 2;
            padding: clamp(16px, 2vw, 24px);
          }

          .category-content svg {
            color: var(--citrus);
            margin-bottom: clamp(6px, 1vw, 10px);
            width: clamp(14px, 2vw, 18px);
            height: clamp(14px, 2vw, 18px);
          }

          .category-content h3 {
            font-size: clamp(20px, 3vw, 28px);
            font-weight: 900;
            line-height: 1;
          }

          .category-content p {
            margin-top: clamp(6px, 1vw, 10px);
            color: rgba(255, 255, 255, 0.82);
            font-size: clamp(12px, 0.9vw, 14px);
            line-height: 1.45;
          }

          .category-content span {
            display: inline-flex;
            margin-top: clamp(10px, 1.5vw, 14px);
            padding: clamp(6px, 0.9vw, 8px) clamp(8px, 1.2vw, 12px);
            border-radius: 999px;
            color: #251018;
            background: #fff;
            font-size: clamp(11px, 0.85vw, 13px);
            font-weight: 900;
          }

          @media (max-width: 1280px) {
            .category-grid {
              grid-template-columns: repeat(3, minmax(0, 1fr));
            }
          }

          @media (max-width: 1024px) {
            .category-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: clamp(12px, 2vw, 16px);
            }
          }

          @media (max-width: 768px) {
            .category-card {
              min-height: clamp(200px, 40vw, 260px);
            }
          }

          @media (max-width: 640px) {
            .category-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              gap: clamp(10px, 1.5vw, 14px);
            }

            .category-card {
              min-height: clamp(180px, 45vw, 240px);
              border-radius: clamp(20px, 2.5vw, 24px);
            }

            .category-content {
              padding: clamp(12px, 1.5vw, 18px);
            }

            .category-content h3 {
              font-size: clamp(16px, 2.5vw, 22px);
            }

            .category-content p {
              display: none;
            }
          }

          @media (max-width: 480px) {
            .category-grid {
              gap: clamp(8px, 1.5vw, 12px);
            }

            .category-card {
              min-height: clamp(160px, 50vw, 220px);
              border-radius: clamp(18px, 2vw, 22px);
            }

            .category-content {
              padding: clamp(10px, 1.2vw, 14px);
            }

            .category-content h3 {
              font-size: clamp(14px, 2vw, 18px);
            }

            .category-content svg {
              display: none;
            }
          }
        `}</style>
      </section>
    </ScrollReveal>
  );
}
