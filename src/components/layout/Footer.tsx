'use client';
import Link from 'next/link';
import { Globe, MessageCircle, Share2, Mail } from 'lucide-react';

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
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
              India&apos;s smartest beauty destination. AI-powered skincare & makeup recommendations, just for you.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[Globe, MessageCircle, Share2, Mail].map((Icon, i) => (
                <a key={i} href="#" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                ><Icon size={20} /></a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '14px', marginBottom: '16px', color: 'var(--text-primary)' }}>SHOP</h4>
            {['Skincare', 'Makeup', 'Hair Care', 'Fragrances', 'Bath & Body', 'Wellness'].map((item) => (
              <Link key={item} href="/products" style={{ display: 'block', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', padding: '4px 0', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >{item}</Link>
            ))}
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '14px', marginBottom: '16px', color: 'var(--text-primary)' }}>COMPANY</h4>
            {['About Us', 'Careers', 'Press', 'Sustainability', 'Affiliate Program'].map((item) => (
              <Link key={item} href="#" style={{ display: 'block', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', padding: '4px 0', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >{item}</Link>
            ))}
          </div>

          {/* Support */}
          <div>
            <h4 style={{ fontFamily: 'Outfit', fontWeight: 600, fontSize: '14px', marginBottom: '16px', color: 'var(--text-primary)' }}>SUPPORT</h4>
            {['Help Center', 'Shipping Policy', 'Returns & Refunds', 'Track Order', 'Contact Us'].map((item) => (
              <Link key={item} href="#" style={{ display: 'block', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', padding: '4px 0', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >{item}</Link>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            © 2026 Glow Addict by Sayanita. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" style={{ color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
