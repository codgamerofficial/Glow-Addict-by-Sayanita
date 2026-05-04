'use client';
import Link from 'next/link';
import { Globe, MessageCircle, Mail, Phone } from 'lucide-react';

const shopLinks = [
  { label: 'Skincare', href: '/products?category=skincare' },
  { label: 'Makeup', href: '/products?category=makeup' },
  { label: 'Hair Care', href: '/products?category=hair-care' },
  { label: 'Fragrances', href: '/products?category=fragrances' },
  { label: 'Bath & Body', href: '/products?category=bath-body' },
  { label: 'Wellness', href: '/products?category=wellness' },
];

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Careers', href: '/careers' },
  { label: 'Press', href: '/press' },
  { label: 'Sustainability', href: '/sustainability' },
  { label: 'Affiliate Program', href: '/affiliate' },
];

const supportLinks = [
  { label: 'Help Center', href: '/help' },
  { label: 'Shipping Policy', href: '/shipping' },
  { label: 'Returns & Refunds', href: '/returns' },
  { label: 'Track Order', href: '/track-order' },
  { label: 'Contact Us', href: '/contact' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-glass)', paddingTop: '48px', paddingBottom: '24px' }}>
      <div className="container-main">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '40px' }}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <img
                src="/images/logo.png"
                alt="Glow Addict by Sayanita"
                style={{ height: '60px', width: 'auto', objectFit: 'contain' }}
              />
            </div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Glow Addict by Sayanita
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '16px' }}>
              India&apos;s smartest beauty destination. AI-powered skincare &amp; makeup recommendations, just for you.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#E1306C')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              ><Globe size={20} /></a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1877F2')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              ><MessageCircle size={20} /></a>
              <a href="mailto:support@glowaddict.in" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              ><Mail size={20} /></a>
              <a href="tel:+919876543210" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--success)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              ><Phone size={20} /></a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '14px', marginBottom: '16px', color: 'var(--text-primary)' }}>SHOP</h4>
            {shopLinks.map(({ label, href }) => (
              <Link key={label} href={href} style={{ display: 'block', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', padding: '4px 0', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >{label}</Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '14px', marginBottom: '16px', color: 'var(--text-primary)' }}>COMPANY</h4>
            {companyLinks.map(({ label, href }) => (
              <Link key={label} href={href} style={{ display: 'block', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', padding: '4px 0', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >{label}</Link>
            ))}
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '14px', marginBottom: '16px', color: 'var(--text-primary)' }}>SUPPORT</h4>
            {supportLinks.map(({ label, href }) => (
              <Link key={label} href={href} style={{ display: 'block', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', padding: '4px 0', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >{label}</Link>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            © 2026 Glow Addict by Sayanita. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
            {legalLinks.map(({ label, href }) => (
              <Link key={label} href={href} style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
