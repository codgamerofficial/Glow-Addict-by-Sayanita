'use client';
import { useState } from 'react';
import { Search, Package, Truck, CheckCircle, MapPin, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/shared/PageTransition';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [tracking, setTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<null | { status: string; steps: { label: string; done: boolean }[] }>(null);

  const trackOrder = async (orderNumber: string) => {
    const res = await fetch(`/api/orders/${orderNumber}`);
    if (!res.ok) {
      throw new Error(`Order not found`);
    }
    return res.json();
  };

  const getSteps = (status: string) => {
    const steps = [
      { label: 'Order Placed', done: true },
      { label: 'Confirmed', done: status !== 'pending' },
      { label: 'Packed', done: ['packed', 'shipped', 'delivered'].includes(status) },
      { label: 'Shipped', done: ['shipped', 'delivered'].includes(status) },
      { label: 'Delivered', done: status === 'delivered' },
    ];
    return steps;
  };

  const track = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setTracking(true);
    setError(null);
    setResult(null);
    try {
      const data = await trackOrder(orderId);
      const orderStatus = data.order?.status;
      if (orderStatus === 'cancelled') {
        setResult({
          status: 'Cancelled',
          steps: getSteps('cancelled'),
        });
      } else if (orderStatus === 'returned') {
        setResult({
          status: 'Returned',
          steps: getSteps('returned'),
        });
      } else {
        setResult({
          status: orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1),
          steps: getSteps(orderStatus),
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to track order');
    } finally {
      setTracking(false);
    }
  };

  const getStatusIcon = () => {
    const status = result?.status?.toLowerCase();
    if (status === 'cancelled' || status === 'returned') {
      return <XCircle size={22} className="text-red-500" />;
    }
    return <Package size={22} className="text-[var(--primary)]" />;
  };

  return (
    <PageTransition>
      <div className="container-main p-10 px-4 max-w-[600px]">
        <div className="text-center mb-8">
          <h1 className="font-outfit text-3xl font-bold mb-2">Track Order</h1>
          <p className="text-[var(--text-muted)] text-[15px]">Enter your order ID to see real-time status</p>
        </div>

        <form onSubmit={track} className="flex gap-2 mb-8">
          <input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Enter Order ID (e.g., GA-2026-001)" className="input-glass flex-1 text-[15px]" />
          <motion.button whileTap={{ scale: 0.95 }} type="submit" className="btn-gradient p-3 px-6 shrink-0" disabled={tracking}>
            <span className="flex items-center gap-1.5"><Search size={16} /> {tracking ? 'Tracking...' : 'Track'}</span>
          </motion.button>
        </form>

        {error && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </motion.div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-7">
            <div className="flex items-center gap-2.5 mb-6">
              {getStatusIcon()}
              <div>
                <div className="text-[12px] text-[var(--text-muted)]">Order #{orderId}</div>
                <div className="font-outfit text-lg font-semibold gradient-text">{result.status}</div>
              </div>
            </div>
            <div className="flex flex-col gap-0">
              {result.steps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-3 py-3 relative">
                  <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center ${
                    step.done ? 'bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]' : 'bg-[var(--bg-glass)] border-2 border-[var(--border-glass)]'
                  }`}>
                    {step.done ? <CheckCircle size={14} color="white" /> : <div className="w-2 h-2 rounded-full bg-[var(--text-muted)]" />}
                  </div>
                  <span className={`text-sm ${step.done ? 'font-medium text-[var(--text-primary)]' : 'font-normal text-[var(--text-muted)]'}`}>{step.label}</span>
                  {i < result.steps.length - 1 && (
                    <div className={`absolute left-[13px] top-[34px] w-0.5 h-5 ${step.done ? 'bg-[var(--primary)]' : 'bg-[var(--border-glass)]'}`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}
