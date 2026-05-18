'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Clock, Gift, ShieldCheck, Sparkles, TimerReset, Truck, Zap } from 'lucide-react';
import { products } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

function SectionLink({ href = '/products', label = 'Shop all' }: { href?: string; label?: string }) {
  return (
    <Link href={href} className="section-link">
      {label} <ArrowRight size={16} />
      <style jsx global>{`
        .section-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: var(--primary);
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 900;
          text-decoration: none;
          white-space: nowrap;
        }
      `}</style>
    </Link>
  );
}

function ProductRail({ items }: { items: typeof products }) {
  return (
    <div className="product-grid">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export function TrendingSection() {
  const trending = products.filter((p) => p.isBestseller).slice(0, 4);

  return (
    <ScrollReveal>
      <section className="section-pad">
        <div className="container-main">
          <div className="section-heading">
            <div>
              <h2>Today&apos;s hot shelf</h2>
              <p>Bestsellers with strong ratings, quick add actions, and polished beauty-card browsing.</p>
            </div>
            <SectionLink label="Explore bestsellers" />
          </div>
          <ProductRail items={trending} />
        </div>
      </section>
    </ScrollReveal>
  );
}

export function FlashDeal() {
  const [timeLeft, setTimeLeft] = useState({ h: 5, m: 42, s: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { h, m, s } = prev;
        s -= 1;
        if (s < 0) {
          s = 59;
          m -= 1;
        }
        if (m < 0) {
          m = 59;
          h -= 1;
        }
        if (h < 0) {
          h = 23;
          m = 59;
          s = 59;
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const deals = products.filter((p) => p.salePrice).slice(0, 4);

  return (
    <ScrollReveal>
      <section className="section-pad deal-zone">
        <div className="container-main">
          <div className="deal-hero">
            <div className="deal-copy">
              <div className="deal-kicker">
                <Zap size={18} /> First-purchase festival deal
              </div>
              <h2 className="sale-type">Up to 80% off</h2>
              <p>Stack sale prices with an extra first-order code and unlock gifts on select days.</p>
            </div>

            <div className="deal-clock" aria-label="Flash deal countdown">
              <Clock size={18} />
              {[
                { value: timeLeft.h, label: 'HRS' },
                { value: timeLeft.m, label: 'MIN' },
                { value: timeLeft.s, label: 'SEC' },
              ].map((part) => (
                <div key={part.label}>
                  <motion.strong
                    key={part.value}
                    initial={{ y: -8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.18 }}
                  >
                    {String(part.value).padStart(2, '0')}
                  </motion.strong>
                  <span>{part.label}</span>
                </div>
              ))}
            </div>
          </div>
          <ProductRail items={deals} />
        </div>

        <style jsx global>{`
          .deal-zone {
            background:
              radial-gradient(circle at 8% 15%, rgba(255, 212, 71, 0.34), transparent 28%),
              linear-gradient(135deg, #fff, #fff1f8 48%, #f0ffd9 100%);
          }

          [data-theme="dark"] .deal-zone {
            background:
              radial-gradient(circle at 8% 15%, rgba(255, 212, 71, 0.15), transparent 28%),
              linear-gradient(135deg, #130816, #251129 58%, #142014);
          }

          .deal-hero {
            display: grid;
            grid-template-columns: minmax(0, 1fr) auto;
            gap: 28px;
            align-items: center;
            margin-bottom: 24px;
            padding: 30px;
            border: 1px solid rgba(245, 31, 123, 0.16);
            border-radius: 30px;
            background: rgba(255, 255, 255, 0.7);
            box-shadow: var(--shadow-soft);
          }

          [data-theme="dark"] .deal-hero {
            background: rgba(255, 255, 255, 0.06);
          }

          .deal-kicker {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
            color: var(--primary);
            font-family: var(--font-display);
            font-size: 14px;
            font-weight: 900;
          }

          .deal-copy h2 {
            color: var(--primary);
            font-size: clamp(42px, 8vw, 92px);
            line-height: 0.9;
          }

          .deal-copy p {
            max-width: 600px;
            margin-top: 14px;
            color: var(--text-secondary);
            font-size: 16px;
            line-height: 1.6;
          }

          .deal-clock {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px;
            border: 1px solid var(--line);
            border-radius: 24px;
            background: var(--bg-surface);
          }

          .deal-clock > svg {
            color: var(--primary);
            margin: 0 4px;
          }

          .deal-clock div {
            min-width: 64px;
            padding: 10px 12px;
            border-radius: 18px;
            text-align: center;
            background: linear-gradient(180deg, #fff8fc, #ffe7f2);
          }

          [data-theme="dark"] .deal-clock div {
            background: rgba(255, 255, 255, 0.08);
          }

          .deal-clock strong {
            display: block;
            color: var(--text-primary);
            font-family: var(--font-display);
            font-size: 25px;
            font-weight: 900;
            line-height: 1;
          }

          .deal-clock span {
            display: block;
            margin-top: 4px;
            color: var(--text-muted);
            font-size: 10px;
            font-weight: 900;
          }

          @media (max-width: 767px) {
            .deal-hero {
              grid-template-columns: 1fr;
              padding: 22px;
            }

            .deal-clock {
              width: 100%;
              justify-content: space-between;
              overflow-x: auto;
            }

            .deal-clock div {
              min-width: 58px;
            }
          }
        `}</style>
      </section>
    </ScrollReveal>
  );
}

export function AIRecommendations() {
  const aiPicks = products.filter((p) => p.ratingAvg >= 4.5).slice(0, 4);

  return (
    <ScrollReveal>
      <section className="section-pad ai-section">
        <div className="container-main ai-layout">
          <div className="ai-panel">
            <div className="ai-icon">
              <Brain size={28} />
            </div>
            <h2>Glow AI picks your perfect cart</h2>
            <p>
              Answer a few skin, shade and routine questions. The assistant builds a clean routine with products from this catalog.
            </p>
            <Link href="/ai-assistant" className="btn-gradient ai-button">
              <span><Sparkles size={17} /> Start AI beauty match</span>
            </Link>
          </div>
          <div>
            <div className="section-heading ai-heading">
              <div>
                <h2>Smart recommendations</h2>
                <p>Highly rated formulas that work beautifully as a personalized starter shelf.</p>
              </div>
            </div>
            <ProductRail items={aiPicks} />
          </div>
        </div>

        <style jsx global>{`
          .ai-section {
            background: var(--bg-primary);
          }

          .ai-layout {
            display: grid;
            grid-template-columns: 330px minmax(0, 1fr);
            gap: 28px;
            align-items: start;
          }

          .ai-panel {
            position: sticky;
            top: 126px;
            padding: 28px;
            border-radius: 30px;
            color: #fff;
            background:
              radial-gradient(circle at 90% 12%, rgba(255, 212, 71, 0.46), transparent 28%),
              linear-gradient(145deg, #211124, #7a2cff 48%, #f51f7b);
            box-shadow: var(--shadow-soft);
          }

          .ai-icon {
            display: grid;
            place-items: center;
            width: 58px;
            height: 58px;
            margin-bottom: 24px;
            border-radius: 22px;
            color: #261019;
            background: #fff;
          }

          .ai-panel h2 {
            font-size: 34px;
            font-weight: 900;
            line-height: 1;
          }

          .ai-panel p {
            margin-top: 14px;
            color: rgba(255, 255, 255, 0.84);
            font-size: 15px;
            line-height: 1.65;
          }

          .ai-button {
            display: inline-flex;
            align-items: center;
            margin-top: 24px;
            padding: 14px 18px;
            color: var(--primary);
            background: #fff;
            box-shadow: none;
            text-decoration: none;
          }

          .ai-button span {
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }

          .ai-heading {
            margin-bottom: 20px;
          }

          @media (max-width: 1050px) {
            .ai-layout {
              grid-template-columns: 1fr;
            }

            .ai-panel {
              position: relative;
              top: auto;
            }
          }
        `}</style>
      </section>
    </ScrollReveal>
  );
}

export function NewArrivals() {
  const newProducts = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <ScrollReveal>
      <section className="section-pad arrivals-section">
        <div className="container-main">
          <div className="section-heading">
            <div>
              <h2>Fresh drops</h2>
              <p>New formulas, new shades, and clean shelf upgrades for the season.</p>
            </div>
            <SectionLink label="See new arrivals" />
          </div>
          <ProductRail items={newProducts} />
        </div>
      </section>
    </ScrollReveal>
  );
}

export function LoyaltyBanner() {
  const heroProduct = products[4];

  return (
    <ScrollReveal>
      <section className="section-pad loyalty-wrap">
        <div className="container-main">
          <div className="loyalty-card">
            <div className="loyalty-copy">
              <div className="loyalty-mark">
                <Gift size={26} />
              </div>
              <h2>Elite Pro perks, without the fuss.</h2>
              <p>
                Get free gifts, faster shipping, birthday surprises and early access to every Glow Addict sale event.
              </p>
              <div className="loyalty-benefits">
                {[
                  { icon: Gift, label: 'Free scrunchies every order' },
                  { icon: Truck, label: 'Free shipping above 799' },
                  { icon: ShieldCheck, label: 'Authentic beauty assurance' },
                  { icon: TimerReset, label: 'No return / exchange / refund' },
                ].map(({ icon: Icon, label }) => (
                  <span key={label}>
                    <Icon size={16} /> {label}
                  </span>
                ))}
              </div>
              <Link href="/profile" className="btn-gradient loyalty-button">
                <span>Join Glow Rewards <ArrowRight size={17} /></span>
              </Link>
            </div>
            <div className="loyalty-visual">
              <div className="loyalty-product">
                <Image src={heroProduct.images[0]} alt={heroProduct.name} fill sizes="320px" />
              </div>
              <div className="loyalty-price">
                <span>Member deal</span>
                <strong>&#8377;{(heroProduct.salePrice || heroProduct.price).toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .loyalty-wrap {
            padding-bottom: 80px;
          }

          .loyalty-card {
            position: relative;
            display: grid;
            grid-template-columns: minmax(0, 1fr) 360px;
            gap: 34px;
            overflow: hidden;
            padding: 38px;
            border-radius: 34px;
            background:
              radial-gradient(circle at 78% 22%, rgba(255, 212, 71, 0.55), transparent 24%),
              linear-gradient(135deg, #ff347f, #ff7940 50%, #ffd447 100%);
            box-shadow: var(--shadow-soft);
          }

          .loyalty-card::before {
            content: "";
            position: absolute;
            inset: 18px;
            border: 1px solid rgba(255, 255, 255, 0.35);
            border-radius: 24px;
            pointer-events: none;
          }

          .loyalty-copy,
          .loyalty-visual {
            position: relative;
            z-index: 1;
          }

          .loyalty-mark {
            display: grid;
            place-items: center;
            width: 58px;
            height: 58px;
            margin-bottom: 22px;
            border-radius: 20px;
            color: var(--primary);
            background: #fff;
          }

          .loyalty-copy h2 {
            max-width: 640px;
            color: #fff;
            font-size: clamp(38px, 5.5vw, 74px);
            font-weight: 900;
            line-height: 0.95;
          }

          .loyalty-copy p {
            max-width: 560px;
            margin-top: 18px;
            color: rgba(255, 255, 255, 0.86);
            font-size: 17px;
            line-height: 1.6;
          }

          .loyalty-benefits {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
            max-width: 620px;
            margin-top: 24px;
          }

          .loyalty-benefits span {
            display: flex;
            align-items: center;
            gap: 8px;
            min-height: 44px;
            padding: 10px 12px;
            border: 1px solid rgba(255, 255, 255, 0.22);
            border-radius: 16px;
            color: #fff;
            background: rgba(255, 255, 255, 0.16);
            font-size: 13px;
            font-weight: 800;
            backdrop-filter: blur(10px);
          }

          .loyalty-button {
            display: inline-flex;
            align-items: center;
            margin-top: 26px;
            padding: 15px 22px;
            color: var(--primary);
            background: #fff;
            box-shadow: none;
            text-decoration: none;
          }

          .loyalty-button span {
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }

          .loyalty-visual {
            min-height: 360px;
          }

          .loyalty-product {
            position: absolute;
            inset: 20px 38px 0 0;
            overflow: hidden;
            border: 10px solid rgba(255, 255, 255, 0.62);
            border-radius: 42px;
            background: #fff;
            box-shadow: 0 26px 70px rgba(76, 19, 50, 0.28);
            transform: rotate(7deg);
          }

          .loyalty-product img {
            object-fit: cover;
          }

          .loyalty-price {
            position: absolute;
            right: 0;
            bottom: 28px;
            width: 170px;
            padding: 18px;
            border-radius: 24px;
            color: #251018;
            background: #fff;
            box-shadow: var(--shadow-soft);
          }

          .loyalty-price span {
            display: block;
            color: var(--text-muted);
            font-size: 12px;
            font-weight: 900;
            text-transform: uppercase;
          }

          .loyalty-price strong {
            display: block;
            margin-top: 4px;
            color: var(--primary);
            font-family: var(--font-display);
            font-size: 32px;
            font-weight: 900;
          }

          @media (max-width: 900px) {
            .loyalty-card {
              grid-template-columns: 1fr;
            }

            .loyalty-visual {
              min-height: 300px;
            }
          }

          @media (max-width: 600px) {
            .loyalty-card {
              padding: 26px;
              border-radius: 28px;
            }

            .loyalty-benefits {
              grid-template-columns: 1fr;
            }

            .loyalty-product {
              inset: 12px 56px 0 0;
            }
          }
        `}</style>
      </section>
    </ScrollReveal>
  );
}
