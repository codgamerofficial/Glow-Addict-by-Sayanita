'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Printer, Package, Truck, CheckCircle, XCircle, RotateCcw, FileText } from 'lucide-react';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import { adminOrders } from '@/data/admin-seed';

const statusFlow = ['pending', 'processing', 'packed', 'shipped', 'delivered'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const order = adminOrders.find(o => o.id === id);
  if (!order) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Order not found</div>;
  const currentIdx = statusFlow.indexOf(order.status);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button aria-label="Go back" onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', cursor: 'pointer' }}><ArrowLeft size={16} /></button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 700 }}>{order.orderNumber}</h1>
              <StatusBadge status={order.status} size="md" />
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{new Date(order.createdAt).toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 12 }}><FileText size={14} /> Invoice</button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 12 }}><Printer size={14} /> Label</button>
        </div>
      </motion.div>

      {/* Status Timeline */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px 28px', marginBottom: 20 }}>
        <h3 style={{ fontFamily: 'Outfit', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Order Progress</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {statusFlow.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 80 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: i <= currentIdx ? 'linear-gradient(135deg, #E91E8C, #7C3AED)' : 'rgba(255,255,255,0.06)', transition: 'all 0.3s' }}>
                  {i <= currentIdx ? <CheckCircle size={16} color="#fff" /> : <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />}
                </div>
                <span style={{ fontSize: 11, fontWeight: 500, color: i <= currentIdx ? 'var(--text-primary)' : 'var(--text-muted)', textTransform: 'capitalize' }}>{s}</span>
              </div>
              {i < statusFlow.length - 1 && <div style={{ flex: 1, height: 2, background: i < currentIdx ? 'linear-gradient(90deg, #E91E8C, #7C3AED)' : 'rgba(255,255,255,0.06)', borderRadius: 1 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Order Items */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Items ({(order.items || []).length})</h3>
          {(order.items || []).map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={20} style={{ color: 'var(--text-muted)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{item.productName}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>₹{(item.total || 0).toLocaleString('en-IN')}</div>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {[['Subtotal', order.subtotal || 0], ['Discount', -(order.discount || 0)], ['Shipping', order.shippingFee || 0], ['Tax', order.tax || 0]].map(([l, v]) => (
              <div key={l as string} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                <span>{l}</span><span>₹{(v as number).toLocaleString('en-IN')}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, fontFamily: 'Outfit', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span>Total</span><span>₹{(order.total || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Customer & Shipping */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontFamily: 'Outfit', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Customer</h3>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{order.customerName || 'Guest'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>{order.customerEmail || '—'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{order.shippingAddress?.phone || '—'}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontFamily: 'Outfit', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Shipping Address</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {order.shippingAddress?.fullName || 'N/A'}<br />
              {order.shippingAddress?.line1 || ''}<br />
              {order.shippingAddress?.city || ''}, {order.shippingAddress?.state || ''} {order.shippingAddress?.pincode || ''}
            </p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontFamily: 'Outfit', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Payment</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}><span style={{ color: 'var(--text-muted)' }}>Method</span><span style={{ fontWeight: 500 }}>{order.paymentMethod || 'COD'}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}><span style={{ color: 'var(--text-muted)' }}>Status</span><StatusBadge status={order.paymentStatus || 'pending'} /></div>
          </div>
          {order.trackingNumber && (
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
              <h3 style={{ fontFamily: 'Outfit', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Tracking</h3>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#E91E8C' }}>{order.trackingNumber}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
