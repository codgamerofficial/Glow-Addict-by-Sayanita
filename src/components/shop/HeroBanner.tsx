'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { AdminBanner } from '@/types/admin';
import { products } from '@/data/products';

const heroProducts = products.slice(0, 4);

export function HeroBanner({ banners }: { banners: AdminBanner[] }) {
  const activeBanner = banners.find((b) => b.is_active || b.isActive);
  const heroImage =
    activeBanner?.image_url ||
    activeBanner?.imageUrl ||
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1000&h=1200&fit=crop';

  return (
    <section className="hero-shell">
      <div className="hero-bg-grid" />
      <motion.div
        className="hero-float hero-float-one"
        animate={{ y: [0, -16, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="hero-float hero-float-two"
        animate={{ y: [0, 12, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container-main hero-layout">
        <motion.div
          className="hero-copy"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.2, 0.9, 0.2, 1] }}
        >
          <p className="hero-sale-line">Glow Addict Pink Summer Sale</p>
          <h1>
            Beauty deals that feel
            <span> irresistible.</span>
          </h1>
          <p className="hero-subtitle">
            Shop premium skincare, makeup, hair care and fragrances with first-order rewards, AI routine matching, and verified beauty picks.
          </p>

          <div className="hero-actions">
            <Link href="/products" className="btn-gradient hero-primary">
              <span>Shop the Sale <ArrowRight size={18} /></span>
            </Link>
            <Link href="/ai-assistant" className="btn-outline hero-secondary">
              <Sparkles size={17} /> Find my routine
            </Link>
          </div>

          <div className="hero-trust-row" aria-label="Store benefits">
            {[
              { icon: ShieldCheck, label: '100% authentic' },
              { icon: Truck, label: 'Free ship above 499' },
              { icon: CheckCircle2, label: '15-day returns' },
            ].map(({ icon: Icon, label }) => (
              <span key={label}>
                <Icon size={16} /> {label}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="hero-stage"
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.12, ease: [0.2, 0.9, 0.2, 1] }}
        >
          <div className="hero-offer-card">
            <span>EXTRA</span>
            <strong>20% OFF</strong>
            <small>Code: EXTRA20</small>
          </div>

          <div className="hero-phone">
            <div className="hero-phone-notch" />
            <div className="hero-phone-screen">
              <div className="hero-phone-header">
                <span className="brand-wordmark">
                  <span>GLOW</span>
                  <span>ADDICT</span>
                </span>
                <span className="hero-phone-bag">3</span>
              </div>
              <div className="hero-phone-banner">
                <span className="sale-type">UP TO</span>
                <strong>80%</strong>
                <span>OFF</span>
              </div>
              <div className="hero-product-stack">
                {heroProducts.map((product, index) => (
                  <div key={product.id} className="hero-mini-product" style={{ animationDelay: `${index * 0.15}s` }}>
                    <div style={{ position: 'relative' }}>
                      <Image src={product.images[0]} alt={product.name} fill sizes="90px" />
                    </div>
                    <span>{product.brandName}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="hero-image-orbit">
            <Image src={heroImage} alt="Glow Addict beauty campaign" fill priority sizes="(max-width: 768px) 70vw, 420px" />
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .hero-shell {
          position: relative;
          overflow: hidden;
          min-height: calc(100vh - 106px);
          padding: 48px 0 70px;
          background:
            radial-gradient(circle at 84% 12%, rgba(255, 212, 71, 0.45), transparent 28%),
            radial-gradient(circle at 0% 30%, rgba(122, 44, 255, 0.16), transparent 30%),
            linear-gradient(135deg, #fff8fd 0%, #ffe4f2 48%, #eaffd9 100%);
        }

        [data-theme="dark"] .hero-shell {
          background:
            radial-gradient(circle at 84% 12%, rgba(255, 212, 71, 0.2), transparent 28%),
            radial-gradient(circle at 0% 30%, rgba(122, 44, 255, 0.24), transparent 30%),
            linear-gradient(135deg, #130816 0%, #261029 54%, #132014 100%);
        }

        .hero-bg-grid {
          position: absolute;
          inset: 0;
          opacity: 0.34;
          background-image:
            linear-gradient(rgba(245, 31, 123, 0.14) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245, 31, 123, 0.14) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: linear-gradient(to bottom, #000 0%, transparent 80%);
        }

        .hero-float {
          position: absolute;
          pointer-events: none;
          border-radius: 42% 58% 55% 45%;
          filter: blur(0.1px);
        }

        .hero-float-one {
          width: 150px;
          height: 150px;
          top: 14%;
          right: 5%;
          border: 1px solid rgba(245, 31, 123, 0.18);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.86), rgba(255, 111, 97, 0.2));
          box-shadow: inset 20px 20px 40px rgba(255, 255, 255, 0.7), var(--shadow-soft);
        }

        .hero-float-two {
          width: 94px;
          height: 94px;
          left: 48%;
          bottom: 10%;
          background: linear-gradient(135deg, rgba(255, 212, 71, 0.8), rgba(245, 31, 123, 0.24));
          box-shadow: var(--shadow-card);
        }

        .hero-layout {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(360px, 1.05fr);
          align-items: center;
          gap: 48px;
        }

        .hero-copy {
          max-width: 650px;
        }

        .hero-sale-line {
          margin-bottom: 16px;
          color: var(--primary-dark);
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .hero-copy h1 {
          max-width: 660px;
          color: var(--text-primary);
          font-size: clamp(50px, 8.2vw, 104px);
          font-weight: 900;
          line-height: 0.9;
        }

        .hero-copy h1 span {
          display: block;
          color: var(--primary);
          font-family: var(--font-editorial);
          font-style: italic;
          font-weight: 700;
        }

        .hero-subtitle {
          max-width: 560px;
          margin-top: 24px;
          color: var(--text-secondary);
          font-size: 18px;
          line-height: 1.7;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 32px;
        }

        .hero-primary,
        .hero-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-width: 176px;
          padding: 15px 24px;
          text-decoration: none;
        }

        .hero-primary span {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .hero-trust-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 28px;
        }

        .hero-trust-row span {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 36px;
          padding: 9px 12px;
          border: 1px solid rgba(245, 31, 123, 0.16);
          border-radius: 999px;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.64);
          font-size: 13px;
          font-weight: 700;
        }

        [data-theme="dark"] .hero-trust-row span {
          background: rgba(255, 255, 255, 0.08);
        }

        .hero-stage {
          position: relative;
          min-height: 580px;
        }

        .hero-phone {
          position: absolute;
          right: 6%;
          bottom: 0;
          width: min(390px, 74vw);
          height: 560px;
          padding: 16px;
          border: 12px solid #171018;
          border-radius: 46px;
          background: #fff;
          box-shadow: 0 32px 90px rgba(45, 17, 42, 0.28);
          transform: rotate(-7deg);
        }

        .hero-phone-notch {
          position: absolute;
          top: 16px;
          left: 50%;
          width: 88px;
          height: 24px;
          border-radius: 999px;
          background: #171018;
          transform: translateX(-50%);
          z-index: 2;
        }

        .hero-phone-screen {
          position: relative;
          height: 100%;
          overflow: hidden;
          border-radius: 31px;
          background: linear-gradient(180deg, #fff, #fff1f8 48%, #e9ffd6);
        }

        .hero-phone-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 52px 20px 16px;
        }

        .hero-phone-header .brand-wordmark {
          font-size: 18px;
        }

        .hero-phone-bag {
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          border-radius: 999px;
          color: #fff;
          background: var(--primary);
          font-size: 12px;
          font-weight: 900;
        }

        .hero-phone-banner {
          margin: 0 18px 18px;
          padding: 16px;
          border-radius: 22px;
          color: #fff;
          text-align: center;
          background: linear-gradient(135deg, #ff2b7d, #ff763b);
          box-shadow: 0 18px 34px rgba(245, 31, 123, 0.24);
        }

        .hero-phone-banner strong {
          display: block;
          font-family: var(--font-display);
          font-size: 56px;
          font-weight: 900;
          line-height: 0.9;
        }

        .hero-phone-banner span {
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 900;
        }

        .hero-product-stack {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          padding: 0 18px;
        }

        .hero-mini-product {
          min-height: 140px;
          padding: 10px;
          border: 1px solid rgba(42, 18, 38, 0.08);
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.78);
          box-shadow: 0 12px 30px rgba(88, 29, 63, 0.08);
          animation: float 4s ease-in-out infinite;
        }

        .hero-mini-product div {
          position: relative;
          height: 88px;
          overflow: hidden;
          border-radius: 16px;
          background: #fff5fb;
        }

        .hero-mini-product img {
          object-fit: cover;
        }

        .hero-mini-product span {
          display: block;
          margin-top: 9px;
          color: var(--text-primary);
          font-size: 12px;
          font-weight: 900;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .hero-image-orbit {
          position: absolute;
          left: 0;
          bottom: 42px;
          width: 270px;
          height: 350px;
          overflow: hidden;
          border: 10px solid rgba(255, 255, 255, 0.86);
          border-radius: 42% 58% 52% 48%;
          background: #fff;
          box-shadow: var(--shadow-soft);
        }

        .hero-image-orbit img {
          object-fit: cover;
        }

        .hero-offer-card {
          position: absolute;
          z-index: 4;
          top: 78px;
          left: 6%;
          width: 190px;
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.64);
          border-radius: 24px;
          color: #fff;
          background: linear-gradient(135deg, #9211ce, #f51f7b);
          box-shadow: 0 22px 50px rgba(122, 44, 255, 0.24);
          transform: rotate(5deg);
        }

        .hero-offer-card span,
        .hero-offer-card small {
          display: block;
          font-family: var(--font-display);
          font-weight: 900;
          letter-spacing: 0;
        }

        .hero-offer-card span {
          font-size: 13px;
        }

        .hero-offer-card strong {
          display: block;
          margin: 2px 0;
          font-family: var(--font-display);
          font-size: 36px;
          font-weight: 900;
          line-height: 0.95;
        }

        .hero-offer-card small {
          color: #ffe7f4;
          font-size: 12px;
        }

        @media (max-width: 980px) {
          .hero-shell {
            min-height: auto;
          }

          .hero-layout {
            grid-template-columns: 1fr;
          }

          .hero-stage {
            min-height: 620px;
          }

          .hero-copy {
            max-width: none;
          }
        }

        @media (max-width: 767px) {
          .hero-shell {
            padding: 34px 0 44px;
          }

          .hero-layout {
            gap: 24px;
          }

          .hero-copy h1 {
            font-size: clamp(44px, 16vw, 64px);
          }

          .hero-subtitle {
            font-size: 16px;
          }

          .hero-stage {
            min-height: 500px;
          }

          .hero-phone {
            right: -8%;
            width: 330px;
            height: 470px;
            border-width: 10px;
            border-radius: 40px;
          }

          .hero-image-orbit {
            width: 178px;
            height: 250px;
            left: -3%;
            bottom: 36px;
          }

          .hero-offer-card {
            top: 28px;
            left: 2%;
            width: 156px;
          }

          .hero-offer-card strong {
            font-size: 30px;
          }

          .hero-mini-product {
            min-height: 116px;
          }

          .hero-mini-product div {
            height: 68px;
          }
        }
      `}</style>
    </section>
  );
}
