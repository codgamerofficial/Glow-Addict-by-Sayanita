'use client';
import { Truck, Clock, MapPin, AlertCircle } from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';

const policies = [
  { icon: Truck, title: 'Free Shipping', desc: 'Free delivery on orders above ₹499 across India.' },
  { icon: Clock, title: 'Processing Time', desc: 'Orders are processed within 1-2 business days.' },
  { icon: MapPin, title: 'Delivery Time', desc: 'Standard delivery takes 5-7 business days. Metro cities may receive orders in 3-5 days.' },
  { icon: AlertCircle, title: 'Cash on Delivery', desc: 'COD available for orders up to ₹5,000. Additional ₹49 handling fee applies.' },
];

export default function ShippingPage() {
  return (
    <PageTransition>
      <div className="container-main" style={{ padding: '40px 16px', maxWidth: '800px' }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Shipping Policy</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '32px' }}>Everything you need to know about delivery</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {policies.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card" style={{ padding: '24px' }}>
              <Icon size={24} style={{ color: 'var(--primary)', marginBottom: '12px' }} />
              <h3 style={{ fontFamily: 'Outfit', fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>{title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>

        <div className="glass-card" style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Shipping Details</h2>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            <p style={{ marginBottom: '12px' }}>• We ship to all serviceable pin codes across India via trusted courier partners.</p>
            <p style={{ marginBottom: '12px' }}>• Tracking information will be sent to your registered email and phone number once your order is dispatched.</p>
            <p style={{ marginBottom: '12px' }}>• Orders placed before 2 PM IST on business days are dispatched the same day.</p>
            <p style={{ marginBottom: '12px' }}>• For remote areas, delivery may take up to 10 business days.</p>
            <p>• International shipping is not available at this time.</p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
