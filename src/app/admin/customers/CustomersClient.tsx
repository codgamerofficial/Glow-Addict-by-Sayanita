'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { DataTable } from '@/components/admin/shared/DataTable';
import { AdminCustomer } from '@/types/admin';

export default function CustomersClient({ initialCustomers }: { initialCustomers: AdminCustomer[] }) {
  const router = useRouter();
  const columns = [
    { key: 'name', label: 'Customer', sortable: true, render: (item: AdminCustomer) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #E91E8C20, #7C3AED20)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#E91E8C' }}>
          {(item.name as string).charAt(0)}
        </div>
        <div>
          <div style={{ fontWeight: 500, fontSize: 13 }}>{item.name as string} {item.isVIP ? '👑' : ''}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.email as string}</div>
        </div>
      </div>
    )},
    { key: 'totalOrders', label: 'Orders', sortable: true },
    { key: 'totalSpent', label: 'Total Spent', sortable: true, render: (item: AdminCustomer) => <span style={{ fontWeight: 600 }}>₹{(item.totalSpent as number).toLocaleString('en-IN')}</span> },
    { key: 'loyaltyPoints', label: 'Loyalty Pts', sortable: true, render: (item: AdminCustomer) => <span style={{ color: '#F59E0B', fontWeight: 600 }}>{(item.loyaltyPoints as number).toLocaleString()}</span> },
    { key: 'skinType', label: 'Skin Type' },
    { key: 'lastOrderDate', label: 'Last Order', render: (item: AdminCustomer) => <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.lastOrderDate ? new Date(item.lastOrderDate as string).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'}</span> },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Customers</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{initialCustomers.length} registered customers</p>
      </motion.div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['All', 'VIP', 'Active', 'Inactive', 'New'].map(f => (
          <button key={f} style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer', background: f === 'All' ? 'linear-gradient(135deg, rgba(233,30,140,0.15), rgba(124,58,237,0.1))' : 'rgba(255,255,255,0.04)', color: f === 'All' ? '#F5B7C5' : 'var(--text-secondary)', border: f === 'All' ? '1px solid rgba(233,30,140,0.2)' : '1px solid rgba(255,255,255,0.06)' }}>{f}</button>
        ))}
      </div>
      <DataTable 
        data={initialCustomers as any} 
        columns={columns as any} 
        searchPlaceholder="Search by name, email..."
        onRowClick={item => router.push(`/admin/customers/${(item as any).id}`)} 
      />
    </div>
  );
}
