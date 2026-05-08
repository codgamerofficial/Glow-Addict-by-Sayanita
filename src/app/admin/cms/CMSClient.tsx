'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Image, FileText, Plus, GripVertical, Eye, EyeOff, Edit2, Trash2 } from 'lucide-react';
import { adminBanners } from '@/data/admin-seed';

const collections = [
  { id: 'fc1', name: 'Summer Essentials', count: 12, active: true },
  { id: 'fc2', name: 'K-Beauty Picks', count: 8, active: true },
  { id: 'fc3', name: 'Budget Friendly Under ₹499', count: 15, active: true },
  { id: 'fc4', name: 'Bridal Glow Kit', count: 6, active: false },
];

import { AdminBanner, AdminCollection } from '@/types/admin';
import { updateBanner, deleteBanner, updateCollection, deleteCollection, createBanner, createCollection } from '@/actions/admin';
import { useState } from 'react';
import { X } from 'lucide-react';

export default function CMSClient({ initialBanners, initialCollections }: { initialBanners?: AdminBanner[], initialCollections?: AdminCollection[] }) {
  const [banners, setBanners] = useState(initialBanners || []);
  const [collections, setCollections] = useState(initialCollections || []);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [newBanner, setNewBanner] = useState({ title: '', subtitle: '', image_url: '', link_url: '', display_order: 1 });
  const [newCollection, setNewCollection] = useState({ name: '', slug: '', description: '', display_order: 1, is_active: true });

  const handleToggleBanner = async (id: string, current: boolean) => {
    try {
      await updateBanner(id, { is_active: !current });
      setBanners(prev => prev.map(b => b.id === id ? { ...b, is_active: !current, isActive: !current } : b));
    } catch (e) {
      alert('Failed to update banner');
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      await deleteBanner(id);
      setBanners(prev => prev.filter(b => b.id !== id));
    } catch (e) {
      alert('Failed to delete banner');
    }
  };

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await createBanner(newBanner);
      setBanners(prev => [...prev, data]);
      setShowBannerModal(false);
      setNewBanner({ title: '', subtitle: '', image_url: '', link_url: '', display_order: 1 });
    } catch (e) {
      alert('Failed to create banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await createCollection(newCollection);
      setCollections(prev => [...prev, data]);
      setShowCollectionModal(false);
      setNewCollection({ name: '', slug: '', description: '', display_order: 1, is_active: true });
    } catch (e) {
      alert('Failed to create collection');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Content Management</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Manage banners, collections & homepage content</p>
      </motion.div>

      {/* Banners */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}><Image size={18} /> Homepage Banners</h2>
          <button 
            onClick={() => setShowBannerModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 12 }}>
            <Plus size={14} /> Add Banner
          </button>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {banners.map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <GripVertical size={16} style={{ color: 'var(--text-muted)', cursor: 'grab' }} />
              <img src={b.image_url || b.imageUrl} alt="" style={{ width: 120, height: 50, borderRadius: 8, objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{b.title}</div>
                {(b.subtitle) && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.subtitle}</div>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button 
                  onClick={() => handleToggleBanner(b.id, !!(b.is_active ?? b.isActive))}
                  aria-label="Toggle active" 
                  style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: 'none', color: (b.is_active ?? b.isActive) ? '#10B981' : 'var(--text-muted)', cursor: 'pointer' }}>
                  {(b.is_active ?? b.isActive) ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button aria-label="Edit banner" style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Edit2 size={14} /></button>
                <button 
                  onClick={() => handleDeleteBanner(b.id)}
                  aria-label="Delete banner" 
                  style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
          {banners.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No banners found.</div>}
        </div>
      </div>

      {/* Featured Collections */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}><FileText size={18} /> Featured Collections</h2>
          <button 
            onClick={() => setShowCollectionModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 12 }}>
            <Plus size={14} /> New Collection
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 12 }}>
          {collections.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ padding: 18, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 10, fontWeight: 600, background: c.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.1)', color: c.is_active ? '#10B981' : '#6B7280' }}>{c.is_active ? 'Live' : 'Draft'}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.count || 0} products</div>
            </motion.div>
          ))}
          {collections.length === 0 && <div style={{ gridColumn: 'span all', padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No collections found.</div>}
        </div>
      </div>

      {/* Banner Modal */}
      {showBannerModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ width: '100%', maxWidth: 500, padding: 32, position: 'relative' }}>
            <button 
              onClick={() => setShowBannerModal(false)} 
              aria-label="Close modal"
              style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h3 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 700, marginBottom: 24 }}>Add New Banner</h3>
            <form onSubmit={handleAddBanner} style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Title</label>
                <input className="input-glass" required value={newBanner.title} onChange={e => setNewBanner({...newBanner, title: e.target.value})} placeholder="e.g. Summer Sale" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Subtitle</label>
                <input className="input-glass" value={newBanner.subtitle} onChange={e => setNewBanner({...newBanner, subtitle: e.target.value})} placeholder="e.g. Get up to 50% off" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Image URL</label>
                <input className="input-glass" required value={newBanner.image_url} onChange={e => setNewBanner({...newBanner, image_url: e.target.value})} placeholder="https://unsplash.com/..." />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Link URL</label>
                <input className="input-glass" value={newBanner.link_url} onChange={e => setNewBanner({...newBanner, link_url: e.target.value})} placeholder="/products" />
              </div>
              <button disabled={isSubmitting} className="btn-gradient" style={{ marginTop: 8, padding: '12px' }}>
                <span>{isSubmitting ? 'Creating...' : 'Create Banner'}</span>
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Collection Modal */}
      {showCollectionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ width: '100%', maxWidth: 500, padding: 32, position: 'relative' }}>
            <button 
              onClick={() => setShowCollectionModal(false)} 
              aria-label="Close modal"
              style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h3 style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 700, marginBottom: 24 }}>New Featured Collection</h3>
            <form onSubmit={handleAddCollection} style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Name</label>
                <input className="input-glass" required value={newCollection.name} onChange={e => setNewCollection({...newCollection, name: e.target.value})} placeholder="e.g. K-Beauty Picks" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Slug</label>
                <input className="input-glass" required value={newCollection.slug} onChange={e => setNewCollection({...newCollection, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} placeholder="e.g. k-beauty-picks" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Description</label>
                <textarea className="input-glass" style={{ minHeight: 80, paddingTop: 12 }} value={newCollection.description} onChange={e => setNewCollection({...newCollection, description: e.target.value})} placeholder="What's this collection about?" />
              </div>
              <button disabled={isSubmitting} className="btn-gradient" style={{ marginTop: 8, padding: '12px' }}>
                <span>{isSubmitting ? 'Creating...' : 'Create Collection'}</span>
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
