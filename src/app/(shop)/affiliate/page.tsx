'use client';
import PageTransition from '@/components/shared/PageTransition';
import { DollarSign, Users, TrendingUp, Gift } from 'lucide-react';
import Link from 'next/link';

export default function AffiliatePage() {
  return (
    <PageTransition>
      <div className="container-main" style={{ padding: '40px 16px', maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'Outfit', fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>
            <span className="gradient-text">Affiliate Program</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Earn by sharing beauty you love</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { icon: DollarSign, title: 'Up to 15% Commission', desc: 'Earn on every sale through your unique referral link.' },
            { icon: Users, title: 'For Everyone', desc: 'Bloggers, influencers, content creators — everyone is welcome.' },
            { icon: TrendingUp, title: 'Real-Time Dashboard', desc: 'Track clicks, conversions, and earnings in real time.' },
            { icon: Gift, title: 'Exclusive Perks', desc: 'Early access to new launches and free product samples.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
              <Icon size={28} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
              <h3 style={{ fontFamily: 'Outfit', fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>{title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/contact" className="btn-gradient" style={{ padding: '14px 32px', fontSize: '15px', textDecoration: 'none', display: 'inline-block' }}>
            <span>Apply Now</span>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
