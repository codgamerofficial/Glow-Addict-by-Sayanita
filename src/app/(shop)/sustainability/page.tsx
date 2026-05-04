'use client';
import PageTransition from '@/components/shared/PageTransition';
import { Leaf, Recycle, Heart, Droplets } from 'lucide-react';

export default function SustainabilityPage() {
  return (
    <PageTransition>
      <div className="container-main" style={{ padding: '40px 16px', maxWidth: '800px' }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Sustainability</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '32px' }}>Our commitment to a greener future</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {[
            { icon: Leaf, title: 'Clean Ingredients', desc: 'We prioritize products with clean, safe, and non-toxic ingredients.' },
            { icon: Recycle, title: 'Eco Packaging', desc: 'Working towards recyclable and minimal packaging across our supply chain.' },
            { icon: Heart, title: 'Cruelty-Free', desc: 'We only partner with brands that do not test on animals.' },
            { icon: Droplets, title: 'Water Conscious', desc: 'Supporting brands that use water-efficient manufacturing processes.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
              <Icon size={28} style={{ color: 'var(--success)', marginBottom: '12px' }} />
              <h3 style={{ fontFamily: 'Outfit', fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>{title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
