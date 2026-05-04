'use client';
import { RotateCcw, Shield, Clock, CheckCircle } from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';

export default function ReturnsPage() {
  return (
    <PageTransition>
      <div className="container-main" style={{ padding: '40px 16px', maxWidth: '800px' }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Returns & Refunds</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '32px' }}>We want you to love what you buy</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { icon: RotateCcw, title: '7-Day Returns', desc: 'Return eligible products within 7 days of delivery.' },
            { icon: Shield, title: 'Quality Guarantee', desc: 'If you receive a damaged or defective product, we replace it free of charge.' },
            { icon: Clock, title: 'Fast Refunds', desc: 'Refunds are processed within 5-7 business days to your original payment method.' },
            { icon: CheckCircle, title: 'Easy Process', desc: 'Initiate returns through your account or contact our support team.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card" style={{ padding: '24px' }}>
              <Icon size={24} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
              <h3 style={{ fontFamily: 'Outfit', fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>{title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Return Policy Details</h2>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <p style={{ marginBottom: '12px' }}>• Products must be unused, in original packaging, and in the same condition as received.</p>
            <p style={{ marginBottom: '12px' }}>• Skincare and makeup products that have been opened or used cannot be returned for hygiene reasons.</p>
            <p style={{ marginBottom: '12px' }}>• Sale items and gift cards are final sale and cannot be returned or exchanged.</p>
            <p style={{ marginBottom: '12px' }}>• For damaged or wrong items, contact us within 48 hours of delivery with photos.</p>
            <p>• Return shipping costs are borne by the customer unless the product is defective or incorrect.</p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
