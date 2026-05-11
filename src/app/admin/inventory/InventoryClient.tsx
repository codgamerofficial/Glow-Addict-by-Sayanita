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
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-outfit text-3xl font-bold mb-1">Inventory</h1>
        <p className="text-[var(--text-muted)] text-sm">Stock management & alerts</p>
      </motion.div>

      {error && (
        <div className="px-4 py-3 mb-4 rounded-xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] text-[#EF4444] text-[13px] font-medium">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3.5 mb-6">
        {[
          { icon: <Package size={18} />, label: 'Total Products', value: inventory.length, color: 'text-blue-500' },
          { icon: <CheckCircle size={18} />, label: 'In Stock', value: inventory.filter(p => p.stockQuantity >= (p.lowStockThreshold || 100)).length, color: 'text-emerald-500' },
          { icon: <TrendingDown size={18} />, label: 'Low Stock', value: lowStock.length, color: 'text-amber-500' },
          { icon: <AlertTriangle size={18} />, label: 'Critical', value: outOfStock.length, color: 'text-red-500' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4.5 px-5">
            <div className={`${s.color} mb-2.5`}>{s.icon}</div>
            <div className="text-2xl font-bold font-outfit">{s.value}</div>
            <div className="text-[11px] text-[var(--text-muted)]">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Stock Table */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="p-4 px-5 border-b border-white/[0.04]">
          <h3 className="font-outfit text-sm font-semibold">Stock Levels</h3>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Product', 'Brand', 'Category', 'Stock', 'Status', 'Actions'].map(h => (
                <th key={h} className="p-2.5 px-4 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">{h}</th>
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
                <tr key={item.id} className="border-b border-white/[0.03]">
                  <td className="p-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <img src={item.images?.[0] || '/placeholder.png'} alt="" className="w-8.5 h-8.5 rounded-lg object-cover" />
                      <span className="text-[13px] font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="p-3 px-4 text-[13px] text-[var(--text-secondary)]">{item.brandName}</td>
                  <td className="p-3 px-4 text-[13px] text-[var(--text-secondary)]">{item.categoryName}</td>
                  <td className="p-3 px-4">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditStock(Math.max(0, (editStock || 0) - 1))}
                          disabled={isSaving}
                          className={`w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.08] text-[var(--text-secondary)] cursor-pointer flex items-center justify-center text-sm ${isSaving ? 'opacity-50' : 'opacity-100'}`}
                        >−</button>
                        <input
                          type="number"
                          value={editStock ?? 0}
                          onChange={e => setEditStock(parseInt(e.target.value) || 0)}
                          disabled={isSaving}
                          title="Stock quantity"
                          placeholder="0"
                          className={`w-[70px] p-1 px-2 rounded-md bg-white/[0.04] border border-white/[0.1] text-[var(--text-primary)] text-[13px] text-center ${isSaving ? 'opacity-50' : 'opacity-100'}`}
                        />
                        <button
                          onClick={() => setEditStock((editStock || 0) + 1)}
                          disabled={isSaving}
                          className={`w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.08] text-[var(--text-secondary)] cursor-pointer flex items-center justify-center text-sm ${isSaving ? 'opacity-50' : 'opacity-100'}`}
                        >+</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-[60px] h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${Math.min(100, (item.stockQuantity / 300) * 100)}%`, backgroundColor: color }} />
                        </div>
                        <span className="text-[13px] font-bold" style={{ color }}>{item.stockQuantity}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-3 px-4">
                    {isEditing ? (
                      <div className="flex flex-col gap-1 items-start">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize" style={{ backgroundColor: `${color}15`, color }}>{level}</span>
                        <input
                          type="number"
                          value={editThreshold ?? 0}
                          onChange={e => setEditThreshold(parseInt(e.target.value) || 0)}
                          placeholder="Alert at"
                          disabled={isSaving}
                          className={`w-20 p-1 px-2 rounded-md bg-white/[0.04] border border-white/[0.1] text-[var(--text-primary)] text-[11px] text-center ${isSaving ? 'opacity-50' : 'opacity-100'}`}
                        />
                      </div>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize" style={{ backgroundColor: `${color}15`, color }}>{level}</span>
                    )}
                  </td>
                  <td className="p-3 px-4">
                    {isEditing ? (
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleSave(item.id)}
                          disabled={isSaving}
                          className={`p-1.5 px-3 rounded-lg text-[11px] font-medium border border-emerald-500/30 text-emerald-500 cursor-pointer flex items-center gap-1 ${isSaving ? 'bg-emerald-500/20 opacity-50' : 'bg-emerald-500/10 opacity-100'}`}
                        >
                          <Save size={12} /> {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                          className={`p-1.5 px-3 rounded-lg text-[11px] font-medium bg-white/[0.04] border border-white/[0.08] text-[var(--text-secondary)] cursor-pointer flex items-center gap-1 ${isSaving ? 'opacity-50' : 'opacity-100'}`}
                        >
                          <X size={12} /> Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleQuickAdjust(item.id, -10)}
                          disabled={isSaving}
                          className={`p-1 px-2 rounded-md text-[11px] font-medium bg-amber-500/10 border border-amber-500/20 text-amber-500 cursor-pointer ${isSaving ? 'opacity-50' : 'opacity-100'}`}
                          title="Decrease by 10"
                        >
                          −10
                        </button>
                        <button
                          onClick={() => handleQuickAdjust(item.id, 10)}
                          disabled={isSaving}
                          className={`p-1 px-2 rounded-md text-[11px] font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 cursor-pointer ${isSaving ? 'opacity-50' : 'opacity-100'}`}
                          title="Increase by 10"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleStartEdit(item)}
                          disabled={isSaving}
                          className={`p-1.5 px-3 rounded-lg text-[11px] font-medium bg-white/[0.04] border border-white/[0.08] text-[var(--text-secondary)] cursor-pointer ${isSaving ? 'opacity-50' : 'opacity-100'}`}
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
