'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Package, TrendingDown, CheckCircle } from 'lucide-react';
import { products } from '@/data/products';

export default function InventoryPage() {
  const sorted = [...products].sort((a, b) => a.stockQuantity - b.stockQuantity);
  const lowStock = sorted.filter(p => p.stockQuantity < 100);
  const outOfStock = sorted.filter(p => p.stockQuantity < 10);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Inventory</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Stock management & alerts</p>
      </motion.div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { icon: <Package size={18} />, label: 'Total Products', value: products.length, color: '#3B82F6' },
          { icon: <CheckCircle size={18} />, label: 'In Stock', value: products.filter(p => p.stockQuantity >= 100).length, color: '#10B981' },
          { icon: <TrendingDown size={18} />, label: 'Low Stock', value: lowStock.length, color: '#F59E0B' },
          { icon: <AlertTriangle size={18} />, label: 'Critical', value: outOfStock.length, color: '#EF4444' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ color: s.color, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Outfit' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Stock Table */}
      <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 15, fontWeight: 600 }}>Stock Levels</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Product', 'Brand', 'Category', 'Stock', 'Status', 'Action'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(p => {
              const level = p.stockQuantity < 50 ? 'critical' : p.stockQuantity < 100 ? 'low' : 'good';
              const color = level === 'critical' ? '#EF4444' : level === 'low' ? '#F59E0B' : '#10B981';
              return (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={p.images[0]} alt="" style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'cover' }} />
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{p.brandName}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{p.categoryName}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, (p.stockQuantity / 300) * 100)}%`, height: '100%', borderRadius: 3, background: color }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color }}>{p.stockQuantity}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${color}15`, color, textTransform: 'capitalize' }}>{level}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button style={{ padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', cursor: 'pointer' }}>Restock</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
