'use client';

import Link from 'next/link';
import { Camera, Mail, MessageCircle, Phone, ShieldCheck, Sparkles, Truck } from 'lucide-react';

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
            { icon: Truck, label: 'Free shipping events' },
            { icon: Sparkles, label: 'AI beauty matching' },
          ].map(({ icon: Icon, label }) => (
            <span key={label}>
              <Icon size={18} /> {label}
            </span>
          ))}
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand-wordmark footer-logo">
              <span>GLOW</span>
              <span>ADDICT</span>
            </Link>
            <p className="footer-founder">By Sayanita</p>
            <p>
              A polished beauty destination for premium skincare, makeup and AI-personalized routines, built for fast, confident shopping.
            </p>
            <div className="footer-social">
              <a href="https://www.instagram.com/glow_addict_by_sayanita" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Camera size={19} />
              </a>
              <a href="mailto:support@glowaddict.in" aria-label="Email support">
                <Mail size={19} />
              </a>
              <a href="tel:+919876543210" aria-label="Phone support">
                <Phone size={19} />
              </a>
              <a href="/contact" aria-label="Contact support">
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
          padding: 34px 0 28px;
          color: #fff;
          background:
            radial-gradient(circle at 80% 0%, rgba(245, 31, 123, 0.36), transparent 28%),
            linear-gradient(145deg, #171018, #29142d 56%, #111b13);
        }

        .footer-promise {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 34px;
        }

        .footer-promise span {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 54px;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.08);
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 900;
          text-align: center;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: minmax(260px, 1.5fr) repeat(3, minmax(150px, 1fr));
          gap: 32px;
        }

        .footer-logo {
          text-decoration: none;
        }

        .footer-logo span:last-child {
          color: #fff;
        }

        .footer-founder {
          margin: 18px 0 6px;
          color: var(--citrus);
          font-family: var(--font-display);
          font-weight: 900;
        }

        .footer-brand > p:last-of-type {
          max-width: 390px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 14px;
          line-height: 1.7;
        }

        .footer-social {
          display: flex;
          gap: 10px;
          margin-top: 18px;
        }

        .footer-social a {
          display: grid;
          place-items: center;
          width: 40px;
          height: 40px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
          transition: all 0.2s var(--spring);
        }

        .footer-social a:hover {
          color: var(--primary);
          background: #fff;
          transform: translateY(-2px);
        }

        .footer-column h4 {
          margin-bottom: 14px;
          color: #fff;
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .footer-column a {
          display: block;
          width: fit-content;
          padding: 5px 0;
          color: rgba(255, 255, 255, 0.68);
          font-size: 14px;
          text-decoration: none;
          transition: all 0.2s var(--spring);
        }

        .footer-column a:hover {
          color: #fff;
          transform: translateX(3px);
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 36px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.56);
          font-size: 13px;
        }

        .footer-bottom div {
          display: flex;
          gap: 16px;
        }

        .footer-bottom a {
          color: inherit;
          text-decoration: none;
        }

        .footer-bottom a:hover {
          color: #fff;
        }

        @media (max-width: 900px) {
          .footer-promise,
          .footer-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .footer-bottom {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </footer>
  );
}
