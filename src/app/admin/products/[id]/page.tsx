'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Trash2, Eye, ExternalLink } from 'lucide-react';
import { products } from '@/data/products';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const product = products.find(p => p.id === id);
  if (!product) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Product not found</div>;

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 13, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', outline: 'none' };
  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button aria-label="Go back" onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', cursor: 'pointer' }}><ArrowLeft size={16} /></button>
          <div>
            <h1 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 700 }}>Edit Product</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{product.name}</span>
              <StatusBadge status="approved" />
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ padding: '10px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><Trash2 size={14} /> Delete</button>
          <button style={{ padding: '10px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><Eye size={14} /> Preview</button>
          <button style={{ padding: '10px 18px', borderRadius: 10, background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}><Save size={14} /> Save Changes</button>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Main info */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Basic Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><label style={labelStyle}>Product Name</label><input aria-label="Product Name" style={inputStyle} defaultValue={product.name} /></div>
            <div><label style={labelStyle}>SKU</label><input aria-label="SKU" style={inputStyle} defaultValue={`GA-${product.id.replace('p', '').padStart(3, '0')}`} /></div>
            <div><label style={labelStyle}>Brand</label><input aria-label="Brand" style={inputStyle} defaultValue={product.brandName} /></div>
            <div><label style={labelStyle}>Category</label><input aria-label="Category" style={inputStyle} defaultValue={product.categoryName} /></div>
            <div><label style={labelStyle}>Price (₹)</label><input aria-label="Price" type="number" style={inputStyle} defaultValue={product.price} /></div>
            <div><label style={labelStyle}>Sale Price (₹)</label><input aria-label="Sale Price" type="number" style={inputStyle} defaultValue={product.salePrice || ''} /></div>
            <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Description</label><textarea aria-label="Description" style={{ ...inputStyle, height: 100 }} defaultValue={product.description} /></div>
          </div>
        </div>

        {/* Side panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Images */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontFamily: 'Outfit', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Media</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {product.images.map((img: string, i: number) => (
                <div key={i} style={{ aspectRatio: '1', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Stock */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontFamily: 'Outfit', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Inventory</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Stock</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: product.stockQuantity < 50 ? '#EF4444' : '#10B981' }}>{product.stockQuantity}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Rating</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>⭐ {product.ratingAvg} ({product.ratingCount})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Weight</span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{product.weightGrams}g</span>
            </div>
          </div>

          {/* Tags */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
            <h3 style={{ fontFamily: 'Outfit', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Tags & Flags</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {product.tags.map((t: string) => <span key={t} style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, background: 'rgba(233,30,140,0.1)', color: '#F5B7C5' }}>{t}</span>)}
              {product.isBestseller && <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, background: 'rgba(245,158,11,0.1)', color: '#F59E0B' }}>⭐ Bestseller</span>}
              {product.isNew && <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', color: '#fff' }}>✨ New</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
