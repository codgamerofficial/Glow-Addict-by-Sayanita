'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { DataTable } from '@/components/admin/shared/DataTable';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';

import { AdminOrder } from '@/types/admin';

export default function OrdersClient({ initialOrders }: { initialOrders: AdminOrder[] }) {
  const router = useRouter();
  
  // Calculate counts based on initialOrders
  const statusCounts = initialOrders.reduce((acc, o) => { 
    acc[o.status] = (acc[o.status] || 0) + 1; 
    return acc; 
  }, {} as Record<string, number>);

  const columns = [
    { key: 'orderNumber', label: 'Order', sortable: true, render: (item: AdminOrder) => (
      <div><div style={{ fontWeight: 600, fontSize: 13 }}>{item.orderNumber as string}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(item.createdAt as string).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div></div>
    )},
    { key: 'customerName', label: 'Customer', sortable: true },
    { key: 'total', label: 'Amount', sortable: true, render: (item: AdminOrder) => <span style={{ fontWeight: 600 }}>₹{(item.total as number).toLocaleString('en-IN')}</span> },
    { key: 'paymentMethod', label: 'Payment', render: (item: AdminOrder) => (
      <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 20, background: item.paymentMethod === 'COD' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)', color: item.paymentMethod === 'COD' ? '#F59E0B' : '#10B981' }}>{item.paymentMethod as string}</span>
    )},
    { key: 'status', label: 'Status', render: (item: AdminOrder) => <StatusBadge status={item.status as string} /> },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Orders</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{initialOrders.length} total orders</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13 }}>
          <Download size={16} /> Export
        </button>
      </motion.div>

      {/* Status pipeline */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto' }} className="hide-scrollbar">
        {['all', 'pending', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'].map(s => (
          <button key={s} style={{
            padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
            background: s === 'all' ? 'linear-gradient(135deg, rgba(233,30,140,0.15), rgba(124,58,237,0.1))' : 'rgba(255,255,255,0.04)',
            color: s === 'all' ? '#F5B7C5' : 'var(--text-secondary)',
            border: s === 'all' ? '1px solid rgba(233,30,140,0.2)' : '1px solid rgba(255,255,255,0.06)',
          }}>
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)} {s !== 'all' && statusCounts[s] ? `(${statusCounts[s]})` : s === 'all' ? `(${initialOrders.length})` : ''}
          </button>
        ))}
      </div>

      <DataTable 
        data={initialOrders as any} 
        columns={columns as any} 
        searchPlaceholder="Search by order number, customer name..."
        onRowClick={(item) => router.push(`/admin/orders/${(item as any).id}`)} 
      />
    </div>
  );
}
