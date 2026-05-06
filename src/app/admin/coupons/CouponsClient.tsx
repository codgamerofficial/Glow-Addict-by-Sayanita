'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Copy } from 'lucide-react';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';

import { AdminCoupon } from '@/types/admin';

export default function CouponsClient({ initialCoupons }: { initialCoupons: AdminCoupon[] }) {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Coupons & Offers</h1><p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{initialCoupons.filter(c => c.isActive || c.is_active).length} active coupons</p></div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 10, background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}><Plus size={16} /> Create Coupon</button>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 16 }}>
        {initialCoupons.map((c, i) => {
          const isActive = c.isActive !== undefined ? c.isActive : c.is_active;
          const minOrderAmount = (c.minOrderAmount !== undefined ? c.minOrderAmount : c.min_order_amount) || 0;
          const usedCount = (c.usedCount !== undefined ? c.usedCount : c.used_count) || 0;
          const usageLimit = (c.usageLimit !== undefined ? c.usageLimit : c.usage_limit) || 100;
          const expiresAt = (c.expiresAt !== undefined ? c.expiresAt : c.expires_at) || new Date().toISOString();

          return (
            <motion.div key={c.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 22, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 80, height: 80, borderRadius: '50%', background: isActive ? 'rgba(16,185,129,0.05)' : 'rgba(107,114,128,0.05)' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <code style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit', color: '#E91E8C', letterSpacing: '0.05em' }}>{c.code}</code>
                    <button aria-label="Copy code" style={{ width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Copy size={12} /></button>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{c.description}</p>
                </div>
                <StatusBadge status={isActive ? 'active' : 'inactive'} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div><div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>Type</div><div style={{ fontSize: 12, fontWeight: 600, textTransform: 'capitalize' }}>{c.type?.replace('_', ' ')}</div></div>
                <div><div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>Value</div><div style={{ fontSize: 12, fontWeight: 600 }}>{c.type === 'percentage' ? `${c.value}%` : c.type === 'fixed' ? `₹${c.value}` : c.type === 'free_shipping' ? 'Free' : `${c.value}%`}</div></div>
                <div><div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>Min Order</div><div style={{ fontSize: 12, fontWeight: 600 }}>{minOrderAmount ? `₹${minOrderAmount}` : '—'}</div></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Used: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{usedCount}</span> / {usageLimit}</div>
                <div style={{ width: 100, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{ width: `${(usedCount / usageLimit) * 100}%`, height: '100%', borderRadius: 2, background: 'linear-gradient(90deg, #E91E8C, #7C3AED)' }} />
                </div>
              </div>
              <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text-muted)' }}>Expires: {new Date(expiresAt).toLocaleDateString()}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
