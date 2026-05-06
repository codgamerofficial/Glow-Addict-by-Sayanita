'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Upload, Download, Filter } from 'lucide-react';
import { DataTable } from '@/components/admin/shared/DataTable';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';

import { AdminProduct } from '@/types/admin';

export default function ProductsClient({ initialProducts }: { initialProducts: AdminProduct[] }) {
  const router = useRouter();
  
  // Transform or prepare products if necessary. 
  // For demo, we are appending fake fields like SKU and approvalStatus if they don't exist.
  const adminProducts = initialProducts.map((p, i) => ({
    ...p,
    sku: p.sku || `GA-${String(i + 1).padStart(3, '0')}`,
    approvalStatus: p.approvalStatus || (i % 5 === 0 ? 'draft' : i % 7 === 0 ? 'pending' : 'approved'),
    isFeatured: p.isBestseller,
    isTrending: p.isNew,
  }));

  const columns = [
    { key: 'name', label: 'Product', sortable: true, render: (item: typeof adminProducts[0]) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src={item.images?.[0] || '/placeholder.png'} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
        <div>
          <div style={{ fontWeight: 500, fontSize: 13 }}>{item.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.sku}</div>
        </div>
      </div>
    )},
    { key: 'brandName', label: 'Brand', sortable: true },
    { key: 'categoryName', label: 'Category', sortable: true },
    { key: 'price', label: 'Price', sortable: true, render: (item: typeof adminProducts[0]) => (
      <div>
        {item.salePrice ? (
          <>
            <span style={{ fontWeight: 600 }}>₹{item.salePrice}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: 6 }}>₹{item.price}</span>
          </>
        ) : <span style={{ fontWeight: 600 }}>₹{item.price}</span>}
      </div>
    )},
    { key: 'stockQuantity', label: 'Stock', sortable: true, render: (item: typeof adminProducts[0]) => (
      <span style={{ color: item.stockQuantity < 50 ? '#EF4444' : item.stockQuantity < 100 ? '#F59E0B' : '#10B981', fontWeight: 600, fontSize: 13 }}>
        {item.stockQuantity}
      </span>
    )},
    { key: 'ratingAvg', label: 'Rating', sortable: true, render: (item: typeof adminProducts[0]) => (
      <span style={{ fontSize: 13 }}>⭐ {item.ratingAvg} <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>({item.ratingCount})</span></span>
    )},
    { key: 'approvalStatus', label: 'Status', render: (item: typeof adminProducts[0]) => <StatusBadge status={item.approvalStatus} /> },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Products</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{adminProducts.length} products in catalog</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => router.push('/admin/products/import')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            <Upload size={16} /> Import
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
            <Download size={16} /> Export
          </button>
          <button onClick={() => router.push('/admin/products/new')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 10, background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Outfit' }}>
            <Plus size={16} /> Add Product
          </button>
        </div>
      </motion.div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['All', 'Active', 'Draft', 'Low Stock', 'Featured', 'Trending'].map(f => (
          <button key={f} style={{
            padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer',
            background: f === 'All' ? 'linear-gradient(135deg, rgba(233,30,140,0.15), rgba(124,58,237,0.1))' : 'rgba(255,255,255,0.04)',
            color: f === 'All' ? '#F5B7C5' : 'var(--text-secondary)',
            border: f === 'All' ? '1px solid rgba(233,30,140,0.2)' : '1px solid rgba(255,255,255,0.06)',
          }}>{f}</button>
        ))}
      </div>

      <DataTable
        data={adminProducts as unknown as Record<string, unknown>[]}
        columns={columns as { key: string; label: string; sortable?: boolean; render?: (item: Record<string, unknown>) => React.ReactNode }[]}
        searchPlaceholder="Search products by name, SKU, brand..."
        onRowClick={(item) => router.push(`/admin/products/${(item as unknown as typeof adminProducts[0]).id}`)}
      />
    </div>
  );
}
