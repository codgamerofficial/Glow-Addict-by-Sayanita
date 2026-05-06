'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, ChevronRight, Folder, FolderOpen, Edit2, Trash2 } from 'lucide-react';

const categoryTree = [
  { name: 'Dot & Key', icon: '🌿', children: ['Facewash', 'Sunscreen', 'Serum', 'Moisturizer', 'Lip Balm'] },
  { name: 'Aqualogica', icon: '💧', children: ['Sunscreen', 'Body Mist'] },
  { name: 'Plum', icon: '🍑', children: ['Toner', 'Serum', 'Night Care', 'Moisturizer', 'Body Mist'] },
  { name: 'Cetaphil', icon: '🧴', children: ['Cleanser', 'Serum', 'Lotion'] },
  { name: 'WishCare', icon: '✨', children: ['Sunscreen', 'Roll-On'] },
  { name: 'Dove', icon: '🕊️', children: ['Body Polish'] },
  { name: 'Chemist at Play', icon: '🧪', children: ['Body Wash', 'Combo'] },
  { name: 'Foxtale', icon: '🦊', children: ['Face Mask'] },
  { name: 'Mars Cosmetics', icon: '💄', children: ['Lipstick', 'Eyeliner', 'Makeup Combo'] },
  { name: 'Beauty Tools', icon: '🛠️', children: ['Hair Brush', 'Roller', 'Blender', 'Mini Fan'] },
];

export default function CategoriesPage() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['Dot & Key', 'Plum']));
  const toggle = (name: string) => {
    const s = new Set(expanded);
    if (s.has(name)) s.delete(name);
    else s.add(name);
    setExpanded(s);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Categories</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Manage product categories by brand</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 10, background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          <Plus size={16} /> Add Category
        </button>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {categoryTree.map((cat, ci) => (
          <motion.div key={cat.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.04 }}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, overflow: 'hidden' }}>
            <div onClick={() => toggle(cat.name)} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', cursor: 'pointer',
              borderBottom: expanded.has(cat.name) ? '1px solid rgba(255,255,255,0.04)' : 'none',
              transition: 'background 0.2s',
            }}>
              <span style={{ fontSize: 22 }}>{cat.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, fontFamily: 'Outfit' }}>{cat.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{cat.children.length} subcategories</div>
              </div>
              <ChevronRight size={16} style={{ color: 'var(--text-muted)', transform: expanded.has(cat.name) ? 'rotate(90deg)' : '', transition: 'transform 0.2s' }} />
            </div>
            {expanded.has(cat.name) && (
              <div style={{ padding: '8px 12px' }}>
                {cat.children.map(child => (
                  <div key={child} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px',
                    borderRadius: 8, transition: 'background 0.2s', cursor: 'pointer',
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: 2, background: 'rgba(233,30,140,0.4)' }} />
                      <span style={{ fontSize: 13 }}>{child}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button aria-label="Edit category" style={{ width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Edit2 size={12} /></button>
                      <button aria-label="Delete category" style={{ width: 28, height: 28, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Trash2 size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
