'use client';

import Link from 'next/link';
import { Camera, Mail, MessageCircle, Phone, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { businessRules, catalogMedia, contactDetails } from '@/data/catalog';

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'Skincare', href: '/products?category=skincare' },
      { label: 'Makeup', href: '/products?category=makeup' },
      { label: 'Hair Care', href: '/products?category=hair-care' },
      { label: 'Fragrance', href: '/products?category=fragrances' },
      { label: 'Bath & Body', href: '/products?category=bath-body' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Sustainability', href: '/sustainability' },
      { label: 'Affiliate', href: '/affiliate' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Shipping', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
      { label: 'Track Order', href: '/track-order' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container-main">
        <div className="footer-promise">
          {[
            { icon: ShieldCheck, label: '100% authentic products' },
            { icon: Truck, label: `Free delivery above ₹${businessRules.freeDeliveryAbove}` },
            { icon: Sparkles, label: 'AI beauty matching' },
          ].map(({ icon: Icon, label }) => (
            <span key={label}>
              <Icon size={18} /> {label}
            </span>
          ))}
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand-wordmark footer-logo" aria-label="Glow Addict by Sayanita home">
              <img src={catalogMedia.logo} alt="Glow Addict by Sayanita logo" className="footer-brand-logo" />
              <span>Glow Addict</span>
              <span>by Sayanita</span>
            </Link>
            <p>
              A polished beauty destination for premium skincare, makeup and AI-personalized routines, built for fast, confident shopping.
            </p>
            <p className="footer-rules">
              No Return • No Replacement • No COD<br />
              Shipping ₹{businessRules.shippingChargeBelow} below ₹{businessRules.freeDeliveryAbove}
            </p>
            <div className="footer-social">
              <a href={contactDetails.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Camera size={19} />
              </a>
              <a href={`mailto:${contactDetails.email}`} aria-label="Email support">
                <Mail size={19} />
              </a>
              <a href={`tel:${contactDetails.phone.replace(/\s+/g, '')}`} aria-label="Phone support">
                <Phone size={19} />
              </a>
              <a href={contactDetails.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp support">
                <MessageCircle size={19} />
              </a>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title} className="footer-column">
              <h4>{column.title}</h4>
              {column.links.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Glow Addict by Sayanita. All rights reserved.</p>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .site-footer {
          position: relative;
          overflow: hidden;
          padding: clamp(28px, 6vw, 40px) clamp(12px, 3vw, 20px);
          color: #fff;
          background:
            radial-gradient(circle at 80% 0%, rgba(245, 31, 123, 0.36), transparent 28%),
            linear-gradient(145deg, #171018, #29142d 56%, #111b13);
        }

        .footer-promise {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(8px, 1.5vw, 16px);
          margin-bottom: clamp(28px, 5vw, 40px);
        }

        .footer-promise span {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(6px, 1vw, 8px);
          min-height: clamp(48px, 10vw, 56px);
          padding: clamp(10px, 1.5vw, 14px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: clamp(14px, 2vw, 20px);
          background: rgba(255, 255, 255, 0.08);
          font-family: var(--font-display);
          font-size: clamp(11px, 0.9vw, 14px);
          font-weight: 900;
          text-align: center;
          line-height: 1.2;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: minmax(240px, 1.5fr) repeat(3, minmax(140px, 1fr));
          gap: clamp(24px, 4vw, 40px);
        }

        .footer-logo {
          display: inline-flex;
          align-items: center;
          gap: clamp(8px, 1vw, 12px);
          text-decoration: none;
          flex-wrap: wrap;
        }

        .footer-logo span:last-child {
          color: #fff;
          font-size: clamp(12px, 1.1vw, 14px);
          font-weight: 900;
          font-family: var(--font-display);
        }

        .footer-brand-logo {
          width: clamp(36px, 6vw, 48px);
          height: clamp(36px, 6vw, 48px);
          object-fit: contain;
          border-radius: clamp(10px, 1.5vw, 14px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.12);
        }

        .footer-brand > p {
          margin: 0;
          margin-top: clamp(8px, 1.5vw, 12px);
          color: rgba(255, 255, 255, 0.72);
          font-size: clamp(13px, 1vw, 15px);
          line-height: 1.6;
          max-width: 420px;
        }

        .footer-rules {
          margin-top: clamp(8px, 1.5vw, 12px);
          color: rgba(255, 255, 255, 0.82);
          font-size: clamp(12px, 0.95vw, 14px);
          line-height: 1.5;
          font-weight: 500;
        }

        .footer-social {
          display: flex;
          gap: clamp(8px, 1.2vw, 12px);
          margin-top: clamp(14px, 2.5vw, 20px);
        }

        .footer-social a {
          display: grid;
          place-items: center;
          width: clamp(36px, 5vw, 44px);
          height: clamp(36px, 5vw, 44px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
          transition: all 0.22s var(--spring);
          font-size: clamp(16px, 2vw, 20px);
        }

        @media (hover: hover) {
          .footer-social a:hover {
            color: var(--primary);
            background: #fff;
            transform: translateY(-2px);
          }
        }

        .footer-column h4 {
          margin-bottom: clamp(10px, 1.5vw, 16px);
          color: #fff;
          font-family: var(--font-display);
          font-size: clamp(11px, 0.9vw, 13px);
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .footer-column a {
          display: block;
          width: fit-content;
          padding: clamp(4px, 0.8vw, 6px) 0;
          color: rgba(255, 255, 255, 0.68);
          font-size: clamp(12px, 1vw, 14px);
          text-decoration: none;
          transition: all 0.22s var(--spring);
        }

        @media (hover: hover) {
          .footer-column a:hover {
            color: #fff;
            transform: translateX(3px);
          }
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: clamp(12px, 2vw, 20px);
          margin-top: clamp(28px, 5vw, 40px);
          padding-top: clamp(16px, 2.5vw, 24px);
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.56);
          font-size: clamp(11px, 0.9vw, 13px);
        }

        .footer-bottom div {
          display: flex;
          gap: clamp(12px, 2vw, 20px);
        }

        .footer-bottom a {
          color: inherit;
          text-decoration: none;
          transition: color 0.22s var(--spring);
        }

        @media (hover: hover) {
          .footer-bottom a:hover {
            color: #fff;
          }
        }

        @media (max-width: 900px) {
          .footer-promise {
            grid-template-columns: 1fr;
          }

          .footer-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .footer-promise span {
            flex-direction: column;
            gap: clamp(6px, 1vw, 8px);
          }

          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }

          .footer-bottom > p {
            order: 2;
          }

          .footer-bottom div {
            order: 1;
            width: 100%;
          }
        }

        @media (max-width: 374px) {
          .footer-promise {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}
