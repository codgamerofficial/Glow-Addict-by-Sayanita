'use client';
import { Search, MessageCircle, Package, CreditCard, HelpCircle } from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import Link from 'next/link';

const topics = [
  { icon: Package, title: 'Orders & Delivery', desc: 'Track orders, shipping info, delivery updates', links: [{ label: 'Track Your Order', href: '/track-order' }, { label: 'Shipping Policy', href: '/shipping' }] },
  { icon: CreditCard, title: 'Payments & Refunds', desc: 'Payment methods, refund status, billing issues', links: [{ label: 'Returns & Refunds', href: '/returns' }] },
  { icon: HelpCircle, title: 'Account & Settings', desc: 'Profile management, password reset, preferences', links: [{ label: 'My Profile', href: '/profile' }] },
  { icon: MessageCircle, title: 'Need More Help?', desc: 'Our team is here for you', links: [{ label: 'Contact Us', href: '/contact' }] },
];

export default function HelpPage() {
  return (
    <PageTransition>
      <div className="container-main" style={{ padding: '40px 16px', maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'Outfit', fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Help Center</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '24px' }}>How can we help you today?</p>
          <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input placeholder="Search help articles..." className="input-glass" style={{ paddingLeft: '40px', fontSize: '15px' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {topics.map(({ icon: Icon, title, desc, links }) => (
            <div key={title} className="glass-card" style={{ padding: '24px' }}>
              <Icon size={24} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
              <h3 style={{ fontFamily: 'Outfit', fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>{title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>{desc}</p>
              {links.map((l) => (
                <Link key={l.label} href={l.href} style={{ display: 'block', color: 'var(--primary)', fontSize: '13px', fontWeight: 500, textDecoration: 'none', padding: '3px 0' }}>
                  → {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
