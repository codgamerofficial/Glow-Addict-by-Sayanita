'use client';
import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/shared/PageTransition';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [tracking, setTracking] = useState(false);
  const [result, setResult] = useState<null | { status: string; steps: { label: string; done: boolean }[] }>(null);

  const track = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setTracking(true);
    setTimeout(() => {
      setResult({
        status: 'In Transit',
        steps: [
          { label: 'Order Placed', done: true },
          { label: 'Confirmed', done: true },
          { label: 'Shipped', done: true },
          { label: 'In Transit', done: true },
          { label: 'Delivered', done: false },
        ],
      });
      setTracking(false);
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="container-main" style={{ padding: '40px 16px', maxWidth: '600px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'Outfit', fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Track Order</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Enter your order ID to see real-time status</p>
        </div>

        <form onSubmit={track} style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          <input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Enter Order ID (e.g., GA-2026-001)" className="input-glass" style={{ flex: 1, fontSize: '15px' }} />
          <motion.button whileTap={{ scale: 0.95 }} type="submit" className="btn-gradient" style={{ padding: '12px 24px', flexShrink: 0 }} disabled={tracking}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Search size={16} /> {tracking ? 'Tracking...' : 'Track'}</span>
          </motion.button>
        </form>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <Package size={22} style={{ color: 'var(--primary)' }} />
              <div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Order #{orderId}</div>
                <div style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600 }} className="gradient-text">{result.status}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
              {result.steps.map((step, i) => (
                <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                    background: step.done ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--bg-glass)',
                    border: step.done ? 'none' : '2px solid var(--border-glass)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {step.done ? <CheckCircle size={14} color="white" /> : <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-muted)' }} />}
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: step.done ? 500 : 400, color: step.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>{step.label}</span>
                  {i < result.steps.length - 1 && <div style={{ position: 'absolute', left: '30px', top: '40px', width: '2px', height: '20px', background: step.done ? 'var(--primary)' : 'var(--border-glass)' }} />}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
