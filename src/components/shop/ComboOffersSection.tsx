'use client';

import Image from 'next/image';
import Link from 'next/link';
import { comboBundles, products } from '@/data/catalog';

export function ComboOffersSection() {
  const bundles = comboBundles.map((bundle) => {
    const items = bundle.productIds
      .map((id) => products.find((product) => product.id === id))
      .filter((item) => item !== undefined);

    const totalPrice = items.reduce((sum, item) => sum + (item?.price || 0), 0);
    const discountedPrice = Math.round(totalPrice * (100 - bundle.discountPercent) / 100);

    return {
      ...bundle,
      items,
      totalPrice,
      discountedPrice,
      savings: totalPrice - discountedPrice,
    };
  });

  return (
    <section className="section-pad">
      <div className="container-main">
        <div className="section-heading">
          <div>
            <h2>Frequently Bought Together</h2>
            <p>Auto-applied combo discounts crafted for your daily glow ritual.</p>
          </div>
        </div>

        <div className="combo-grid">
          {bundles.map((bundle) => (
            <article key={bundle.id} className="combo-card">
              <div className="combo-image-wrap">
                <Image src={bundle.image} alt={bundle.title} fill sizes="(max-width: 768px) 100vw, 380px" className="combo-image" />
                <span className="combo-discount">{bundle.discountPercent}% OFF</span>
              </div>

              <div className="combo-body">
                <h3>{bundle.title}</h3>
                <p>{bundle.items.map((item) => item?.name).filter(Boolean).slice(0, 3).join(' + ')}</p>
                <div className="combo-prices">
                  <strong>₹{bundle.discountedPrice.toLocaleString()}</strong>
                  <span>₹{bundle.totalPrice.toLocaleString()}</span>
                  <em>Save ₹{bundle.savings.toLocaleString()}</em>
                </div>
                <Link href="/products" className="btn-gradient combo-cta">
                  <span>Shop This Combo</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .combo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 18px;
        }

        .combo-card {
          overflow: hidden;
          border: 1px solid var(--line);
          border-radius: 24px;
          background: var(--bg-surface);
          box-shadow: var(--shadow-card);
        }

        .combo-image-wrap {
          position: relative;
          aspect-ratio: 1.2;
          background: linear-gradient(135deg, #fff6fb, #edfce0);
        }

        .combo-image {
          object-fit: cover;
        }

        .combo-discount {
          position: absolute;
          top: 10px;
          left: 10px;
          padding: 6px 10px;
          border-radius: 999px;
          color: #fff;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          font-size: 11px;
          font-weight: 900;
        }

        .combo-body {
          padding: 14px;
        }

        .combo-body h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 900;
        }

        .combo-body p {
          margin: 8px 0 12px;
          color: var(--text-muted);
          font-size: 13px;
          line-height: 1.5;
        }

        .combo-prices {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 14px;
        }

        .combo-prices strong {
          font-size: 22px;
          font-family: var(--font-display);
        }

        .combo-prices span {
          color: var(--text-muted);
          text-decoration: line-through;
          font-size: 14px;
        }

        .combo-prices em {
          color: var(--primary);
          font-size: 13px;
          font-style: normal;
          font-weight: 700;
        }

        .combo-cta {
          display: inline-flex;
          align-items: center;
          padding: 0 16px;
          text-decoration: none;
        }
      `}</style>
    </section>
  );
}
