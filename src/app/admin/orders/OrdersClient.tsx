'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { DataTable } from '@/components/admin/shared/DataTable';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import Link from 'next/link';

export default function OrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const router = useRouter();

  // Calculate counts based on initialOrders
  const statusCounts = initialOrders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const paymentStatusCounts = initialOrders.reduce((acc, o) => {
    acc[o.paymentStatus] = (acc[o.paymentStatus] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Summary stats
  const totalOrders = initialOrders.length;
  const pendingVerification = paymentStatusCounts['pending'] || 0;
  const revenue = initialOrders.reduce((sum, order) => sum + (order.total || 0), 0);

  // Filter tabs
  const tabs = [
    { label: 'All', value: 'all' },
    { label: 'Pending Payment', value: 'pending_payment' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  const [activeTab, setActiveTab] = React.useState('all');

  // Filter orders based on active tab
  const filteredOrders = initialOrders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  const columns = [
    { key: 'orderNumber', label: 'Order #', sortable: true, render: (item: any) => (
      <div>
        <div style={{ fontWeight: 600, fontSize: 13 }}>{item.orderNumber}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
      </div>
    )},
    { key: 'customerName', label: 'Customer Name', sortable: true, render: (item: any) => (
      <div>
        <div style={{ fontWeight: 500 }}>{item.customerName || 'Guest Customer'}</div>
        {item.customerEmail && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.customerEmail}</div>
        )}
      </div>
    )},
    { key: 'total', label: 'Total', sortable: true, render: (item: any) => (
      <span style={{ fontWeight: 600 }}>₹{(item.total || 0).toLocaleString('en-IN')}</span>
    )},
    { key: 'paymentMethod', label: 'Payment Method', render: (item: any) => (
      <span style={{
        fontSize: 12,
        padding: '3px 10px',
        borderRadius: 20,
        background: item.paymentMethod === 'cod' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
        color: item.paymentMethod === 'cod' ? '#F59E0B' : '#10B981'
      }}>
        {item.paymentMethod === 'cod' ? 'COD' : 'UPI'}
      </span>
    )},
    { key: 'paymentStatus', label: 'Payment Status', render: (item: any) => (
      <StatusBadge status={item.paymentStatus} variant="payment" />
    )},
    { key: 'status', label: 'Order Status', render: (item: any) => (
      <StatusBadge status={item.status} />
    )},
    { key: 'actions', label: 'Actions', render: (item: any) => (
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
        {/* Row click handles navigation, this is just a visual indicator */}
        <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 8v3l3 3" strokeWidth={1.8}/>
          </svg>
        </div>
      </div>
    )}
  ];

  return (
    <div>
      {/* Header with stats and export */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Orders</h1>
          <div style={{ display: 'flex', gap: 24, fontSize: 14, color: 'var(--text-muted)' }}>
            <div>{totalOrders} total orders</div>
            <div>{pendingVerification} pending verification</div>
            <div>₹{revenue.toLocaleString('en-IN')} revenue</div>
          </div>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13 }}>
          <Download size={16} /> Export
        </button>
      </motion.div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto' }} className="hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: activeTab === tab.value ? 'linear-gradient(135deg, rgba(233,30,140,0.15), rgba(124,58,237,0.1))' : 'rgba(255,255,255,0.04)',
              color: activeTab === tab.value ? '#F5B7C5' : 'var(--text-secondary)',
              border: activeTab === tab.value ? '1px solid rgba(233,30,140,0.2)' : '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {tab.label} {tab.value !== 'all' && statusCounts[tab.value] ? `(${statusCounts[tab.value]})` : tab.value === 'all' ? `(${totalOrders})` : ''}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <DataTable
        data={filteredOrders}
        columns={columns as any}
        searchPlaceholder="Search by order number, customer name..."
        onRowClick={(item) => router.push(`/admin/orders/${item.id}`)}
      />
    </div>
  );
}