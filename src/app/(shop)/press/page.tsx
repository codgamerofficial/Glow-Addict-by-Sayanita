'use client';
import PageTransition from '@/components/shared/PageTransition';
import { Newspaper } from 'lucide-react';

export default function PressPage() {
  return (
    <PageTransition>
      <div className="container-main" style={{ padding: '40px 16px', maxWidth: '800px' }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Press</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '32px' }}>Media resources and brand information</p>
        <div className="glass-card" style={{ padding: '32px', textAlign: 'center' }}>
          <Newspaper size={48} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
          <h2 style={{ fontFamily: 'Outfit', fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>Press Inquiries</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>
            For press inquiries, interviews, and media collaborations, please contact us at{' '}
            <a href="mailto:press@glowaddict.in" style={{ color: 'var(--primary)' }}>press@glowaddict.in</a>
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>We typically respond within 2 business days.</p>
        </div>
      </div>
    </PageTransition>
  );
}
