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
  { label: 'My Orders', href: '/profile#orders' },
  { label: 'Contact Us', href: '/contact' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-glass)', paddingTop: '48px', paddingBottom: '24px', position: 'relative', overflow: 'hidden' }}>
      <div className="floating-blob w-40 h-40 -top-16 -left-10 bg-purple-500/30" aria-hidden />
      <div className="floating-blob w-40 h-40 top-24 -right-8 bg-pink-400/30" style={{ animationDelay: '1s' }} aria-hidden />
      <div className="container-main">
        <div className="story-section p-5 md:p-7 mb-8">
          <p className="story-kicker text-sm text-white/85 mb-1">Your Glow Story, Weekly</p>
          <h3 className="story-title text-2xl md:text-3xl font-black text-white mb-2">Beauty edits, ritual guides, and surprise drops.</h3>
          <p className="text-sm md:text-[15px] text-white/80 max-w-2xl">Every week, Glow Addict curates one practical routine story so your skin wins without the guesswork.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '40px' }}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontFamily: 'Outfit', fontWeight: 900, fontSize: '24px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="gradient-text">GLOW</span>
                <span style={{ color: 'var(--text-primary)' }}>ADDICT</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
              By Sayanita
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
