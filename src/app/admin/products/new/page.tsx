'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Eye, Upload, X, Plus, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { categories, skinTypes, skinConcerns } from '@/data/categories';
import { brands } from '@/data/brands';

const tabs = ['Basic Info', 'Pricing', 'Inventory', 'Details', 'Media', 'SEO', 'AI', 'Variants'];

export default function NewProductPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 13,
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    color: 'var(--text-primary)', outline: 'none',
  };
  const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' };
  const fieldGroup: React.CSSProperties = { marginBottom: 18 };

  const renderTab = () => {
    switch (activeTab) {
      case 0: return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={fieldGroup}><label style={labelStyle}>Product Name *</label><input style={inputStyle} placeholder="e.g. Vitamin C Brightening Serum" /></div>
          <div style={fieldGroup}><label style={labelStyle}>Slug</label><input style={inputStyle} placeholder="auto-generated-from-name" disabled /></div>
          <div style={fieldGroup}><label style={labelStyle}>Brand *</label>
            <select aria-label="Brand" style={inputStyle}><option value="">Select brand</option>{brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select>
          </div>
          <div style={fieldGroup}><label style={labelStyle}>Category *</label>
            <select aria-label="Category" style={inputStyle}><option value="">Select category</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          </div>
          <div style={fieldGroup}><label style={labelStyle}>SKU *</label><input style={inputStyle} placeholder="GA-SK-001" /></div>
          <div style={fieldGroup}><label style={labelStyle}>Barcode</label><input style={inputStyle} placeholder="EAN/UPC barcode" /></div>
          <div style={{ ...fieldGroup, gridColumn: '1 / -1' }}><label style={labelStyle}>Short Description</label><input style={inputStyle} placeholder="Brief one-liner about the product" /></div>
          <div style={{ ...fieldGroup, gridColumn: '1 / -1' }}><label style={labelStyle}>Full Description</label>
            <textarea style={{ ...inputStyle, height: 120, resize: 'vertical' }} placeholder="Detailed product description..." />
          </div>
        </div>
      );
      case 1: return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={fieldGroup}><label style={labelStyle}>Original Price (₹) *</label><input type="number" style={inputStyle} placeholder="1299" /></div>
          <div style={fieldGroup}><label style={labelStyle}>Sale Price (₹)</label><input type="number" style={inputStyle} placeholder="899" /></div>
          <div style={fieldGroup}><label style={labelStyle}>Discount %</label><input type="number" style={inputStyle} placeholder="Auto-calculated" disabled /></div>
          <div style={fieldGroup}><label style={labelStyle}>Tax %</label><input type="number" style={inputStyle} placeholder="12" defaultValue="12" /></div>
        </div>
      );
      case 2: return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
          <div style={fieldGroup}><label style={labelStyle}>Stock Quantity *</label><input type="number" style={inputStyle} placeholder="150" /></div>
          <div style={fieldGroup}><label style={labelStyle}>Low Stock Alert</label><input type="number" style={inputStyle} placeholder="20" defaultValue="20" /></div>
          <div style={fieldGroup}><label style={labelStyle}>Warehouse Location</label><input style={inputStyle} placeholder="WH-MUM-01" /></div>
        </div>
      );
      case 3: return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ ...fieldGroup, gridColumn: '1 / -1' }}><label style={labelStyle}>Ingredients</label><textarea style={{ ...inputStyle, height: 80 }} placeholder="List of ingredients..." /></div>
          <div style={{ ...fieldGroup, gridColumn: '1 / -1' }}><label style={labelStyle}>Usage Instructions</label><textarea style={{ ...inputStyle, height: 80 }} placeholder="How to use this product..." /></div>
          <div style={{ ...fieldGroup, gridColumn: '1 / -1' }}><label style={labelStyle}>Benefits</label><textarea style={{ ...inputStyle, height: 60 }} placeholder="Key benefits (one per line)" /></div>
          <div style={fieldGroup}><label style={labelStyle}>Skin Types</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {skinTypes.map(st => <label key={st} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}><input type="checkbox" style={{ accentColor: '#E91E8C' }} /> {st}</label>)}
            </div>
          </div>
          <div style={fieldGroup}><label style={labelStyle}>Concerns</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {skinConcerns.map(sc => <label key={sc} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}><input type="checkbox" style={{ accentColor: '#E91E8C' }} /> {sc}</label>)}
            </div>
          </div>
          <div style={fieldGroup}><label style={labelStyle}>Gender</label>
            <select aria-label="Gender" style={inputStyle}><option value="unisex">Unisex</option><option value="female">Female</option><option value="male">Male</option></select>
          </div>
          <div style={fieldGroup}><label style={labelStyle}>SPF</label><input type="number" style={inputStyle} placeholder="50" /></div>
          <div style={fieldGroup}><label style={labelStyle}>Volume/Weight</label><input style={inputStyle} placeholder="30ml / 50g" /></div>
        </div>
      );
      case 4: return (
        <div>
          <label style={labelStyle}>Product Images</label>
          <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); }}
            style={{
              border: `2px dashed ${dragOver ? '#E91E8C' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: 16, padding: 40, textAlign: 'center', cursor: 'pointer',
              background: dragOver ? 'rgba(233,30,140,0.05)' : 'rgba(255,255,255,0.02)',
              transition: 'all 0.3s ease', marginBottom: 20,
            }}>
            <Upload size={32} style={{ color: 'var(--text-muted)', marginBottom: 12 }} />
            <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>Drag & drop images here</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>or click to browse. PNG, JPG up to 5MB</p>
          </div>
          {images.length > 0 && (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {images.map((img, i) => (
                <div key={i} style={{ position: 'relative', width: 100, height: 100, borderRadius: 12, overflow: 'hidden' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button aria-label="Remove image" onClick={() => setImages(images.filter((_, j) => j !== i))} style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={10} /></button>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 24 }}>
            <div style={fieldGroup}><label style={labelStyle}>Video URL</label><input style={inputStyle} placeholder="YouTube or hosted video URL" /></div>
            <div style={fieldGroup}><label style={labelStyle}>Reels URL</label><input style={inputStyle} placeholder="Instagram Reels link" /></div>
          </div>
        </div>
      );
      case 5: return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
          <div style={fieldGroup}><label style={labelStyle}>Meta Title</label><input style={inputStyle} placeholder="SEO-optimized title (60 chars)" maxLength={60} /></div>
          <div style={fieldGroup}><label style={labelStyle}>Meta Description</label><textarea style={{ ...inputStyle, height: 80 }} placeholder="SEO meta description (160 chars)" maxLength={160} /></div>
          <div style={fieldGroup}><label style={labelStyle}>Keywords</label><input style={inputStyle} placeholder="Comma-separated keywords" /></div>
        </div>
      );
      case 6: return (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, padding: '12px 16px', borderRadius: 12, background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <Sparkles size={16} style={{ color: '#8B5CF6' }} />
            <span style={{ fontSize: 13, color: '#A78BFA' }}>AI will auto-generate tags based on product details. You can manually override below.</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div style={fieldGroup}><label style={labelStyle}>AI Skin Match Tags</label><input style={inputStyle} placeholder="brightening, antioxidant, hydrating" /></div>
            <div style={fieldGroup}><label style={labelStyle}>AI Recommended Skin Types</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {skinTypes.map(st => <label key={st} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}><input type="checkbox" style={{ accentColor: '#8B5CF6' }} /> {st}</label>)}
              </div>
            </div>
            <div style={fieldGroup}><label style={labelStyle}>Routine Mapping</label>
              <select aria-label="Routine" style={inputStyle}><option value="morning">Morning</option><option value="evening">Evening</option><option value="both">Both</option></select>
            </div>
          </div>
        </div>
      );
      case 7: return (
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Add product variants (colors, sizes, etc.)</p>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.15)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13, width: '100%', justifyContent: 'center' }}>
            <Plus size={16} /> Add Variant
          </button>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button aria-label="Go back" onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', cursor: 'pointer' }}><ArrowLeft size={16} /></button>
          <div><h1 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 700 }}>New Product</h1><p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Create a new product listing</p></div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ padding: '10px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}><Eye size={14} /> Preview</button>
          <button style={{ padding: '10px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>Save Draft</button>
          <button style={{ padding: '10px 18px', borderRadius: 10, background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Outfit', display: 'flex', alignItems: 'center', gap: 6 }}><Save size={14} /> Publish</button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }} className="hide-scrollbar">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} style={{
            padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
            background: activeTab === i ? 'linear-gradient(135deg, rgba(233,30,140,0.15), rgba(124,58,237,0.1))' : 'transparent',
            color: activeTab === i ? '#F5B7C5' : 'var(--text-muted)',
            border: activeTab === i ? '1px solid rgba(233,30,140,0.2)' : '1px solid transparent',
            transition: 'all 0.2s ease',
          }}>{tab}</button>
        ))}
      </div>

      {/* Form Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 28 }}>
        {renderTab()}
      </motion.div>
    </div>
  );
}
