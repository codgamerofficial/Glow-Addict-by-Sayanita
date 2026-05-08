'use client';
import React, { useState, useTransition } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Package, TrendingDown, CheckCircle, Plus, Minus, Save, X } from 'lucide-react';
import { AdminInventoryItem } from '@/types/admin';
import { updateStockQuantity, updateLowStockAlert } from '@/actions/admin';

interface InventoryClientProps {
  initialInventory: AdminInventoryItem[];
}

export default function InventoryClient({ initialInventory }: InventoryClientProps) {
  const [inventory, setInventory] = useState<AdminInventoryItem[]>(initialInventory);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number | null>(null);
  const [editThreshold, setEditThreshold] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sorted = [...inventory].sort((a, b) => a.stockQuantity - b.stockQuantity);
  const lowStock = sorted.filter(p => p.stockQuantity < (p.lowStockThreshold || 100));
  const outOfStock = sorted.filter(p => p.stockQuantity < 10);

  const handleStartEdit = (item: AdminInventoryItem) => {
    setEditingId(item.id);
    setEditStock(item.stockQuantity);
    setEditThreshold(item.lowStockThreshold || 100);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditStock(null);
    setEditThreshold(null);
    setError(null);
  };

  const handleSave = (id: string) => {
    if (editStock === null || editThreshold === null) return;
    setSavingId(id);
    setError(null);

    startTransition(async () => {
      try {
        await updateStockQuantity(id, editStock);
        await updateLowStockAlert(id, editThreshold);
        setInventory(prev => prev.map(item =>
          item.id === id
            ? { ...item, stockQuantity: editStock, lowStockThreshold: editThreshold }
            : item
        ));
        setEditingId(null);
        setEditStock(null);
        setEditThreshold(null);
      } catch (err) {
        console.error('Failed to update stock:', err);
        setError('Failed to update stock. Please try again.');
      } finally {
        setSavingId(null);
      }
    });
  };

  const handleQuickAdjust = (id: string, delta: number) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;
    const newStock = Math.max(0, item.stockQuantity + delta);
    setSavingId(id);

    startTransition(async () => {
      try {
        await updateStockQuantity(id, newStock);
        setInventory(prev => prev.map(i =>
          i.id === id ? { ...i, stockQuantity: newStock } : i
        ));
      } catch (err) {
        console.error('Failed to adjust stock:', err);
        setError('Failed to adjust stock. Please try again.');
      } finally {
        setSavingId(null);
      }
    });
  };

  const getStockLevel = (quantity: number, threshold: number) => {
    if (quantity < 50) return 'critical';
    if (quantity < threshold) return 'low';
    return 'good';
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Inventory</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Stock management & alerts</p>
      </motion.div>

      {error && (
        <div style={{
          padding: '12px 16px', marginBottom: 16, borderRadius: 10,
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
          color: '#EF4444', fontSize: 13, fontWeight: 500
        }}>
          {error}
        </div>
      )}

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { icon: <Package size={18} />, label: 'Total Products', value: inventory.length, color: '#3B82F6' },
          { icon: <CheckCircle size={18} />, label: 'In Stock', value: inventory.filter(p => p.stockQuantity >= (p.lowStockThreshold || 100)).length, color: '#10B981' },
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
              {['Product', 'Brand', 'Category', 'Stock', 'Status', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map(item => {
              const level = getStockLevel(item.stockQuantity, item.lowStockThreshold || 100);
              const color = level === 'critical' ? '#EF4444' : level === 'low' ? '#F59E0B' : '#10B981';
              const isEditing = editingId === item.id;
              const isSaving = savingId === item.id;

              return (
                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={item.images?.[0] || '/placeholder.png'} alt="" style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'cover' }} />
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{item.brandName}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text-secondary)' }}>{item.categoryName}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <button
                          onClick={() => setEditStock(Math.max(0, (editStock || 0) - 1))}
                          disabled={isSaving}
                          style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, opacity: isSaving ? 0.5 : 1 }}
                        >−</button>
                        <input
                          type="number"
                          value={editStock ?? 0}
                          onChange={e => setEditStock(parseInt(e.target.value) || 0)}
                          disabled={isSaving}
                          style={{ width: 70, padding: '4px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: 13, textAlign: 'center', opacity: isSaving ? 0.5 : 1 }}
                        />
                        <button
                          onClick={() => setEditStock((editStock || 0) + 1)}
                          disabled={isSaving}
                          style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, opacity: isSaving ? 0.5 : 1 }}
                        >+</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 60, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(100, (item.stockQuantity / 300) * 100)}%`, height: '100%', borderRadius: 3, background: color }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color }}>{item.stockQuantity}</span>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start' }}>
                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${color}15`, color, textTransform: 'capitalize' }}>{level}</span>
                        <input
                          type="number"
                          value={editThreshold ?? 0}
                          onChange={e => setEditThreshold(parseInt(e.target.value) || 0)}
                          placeholder="Alert at"
                          disabled={isSaving}
                          style={{ width: 80, padding: '4px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontSize: 11, textAlign: 'center', opacity: isSaving ? 0.5 : 1 }}
                        />
                      </div>
                    ) : (
                      <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${color}15`, color, textTransform: 'capitalize' }}>{level}</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => handleSave(item.id)}
                          disabled={isSaving}
                          style={{ padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: isSaving ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10B981', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, opacity: isSaving ? 0.5 : 1 }}
                        >
                          <Save size={12} /> {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                          style={{ padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, opacity: isSaving ? 0.5 : 1 }}
                        >
                          <X size={12} /> Cancel
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          onClick={() => handleQuickAdjust(item.id, -10)}
                          disabled={isSaving}
                          style={{ padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 500, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#F59E0B', cursor: 'pointer', opacity: isSaving ? 0.5 : 1 }}
                          title="Decrease by 10"
                        >
                          −10
                        </button>
                        <button
                          onClick={() => handleQuickAdjust(item.id, 10)}
                          disabled={isSaving}
                          style={{ padding: '4px 8px', borderRadius: 6, fontSize: 11, fontWeight: 500, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#10B981', cursor: 'pointer', opacity: isSaving ? 0.5 : 1 }}
                          title="Increase by 10"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleStartEdit(item)}
                          disabled={isSaving}
                          style={{ padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 500, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', cursor: 'pointer', opacity: isSaving ? 0.5 : 1 }}
                        >
                          Edit
                        </button>
                      </div>
                    )}
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
