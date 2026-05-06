'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, Calendar, Star, Heart, ShoppingBag, Award } from 'lucide-react';
import { adminCustomers } from '@/data/admin-seed';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const cust = adminCustomers.find(c => c.id === id);
  if (!cust) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Customer not found</div>;

  const statItems = [
    { icon: <ShoppingBag size={16} />, label: 'Orders', value: cust.totalOrders || 0, color: '#3B82F6' },
    { icon: <Star size={16} />, label: 'Spent', value: `₹${(cust.totalSpent || 0).toLocaleString('en-IN')}`, color: '#10B981' },
    { icon: <Award size={16} />, label: 'Loyalty Points', value: cust.loyaltyPoints || 0, color: '#F59E0B' },
    { icon: <Heart size={16} />, label: 'Wishlist', value: cust.wishlistCount || 0, color: '#E91E8C' },
  ];

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button aria-label="Go back" onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', cursor: 'pointer' }}><ArrowLeft size={16} /></button>
        <div><h1 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 700 }}>{cust.name} {cust.isVIP && '👑'}</h1><p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Customer since {new Date(cust.joinedAt || new Date()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p></div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
        {/* Profile Card */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 auto 16px' }}>{cust.name.charAt(0)}</div>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{cust.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}><Mail size={12} /> {cust.email}</div>
          {cust.phone && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}><Phone size={12} /> {cust.phone}</div>}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
            {cust.skinType && <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, background: 'rgba(233,30,140,0.1)', color: '#F5B7C5' }}>🧴 {cust.skinType} skin</span>}
            {cust.skinConcerns?.map(c => <span key={c} style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)' }}>{c}</span>)}
          </div>
        </div>

        {/* Stats & Orders */}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
            {statItems.map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '16px 18px' }}>
                <div style={{ color: s.color, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Outfit' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>AI Skin Profile</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
              Based on purchase history and skin profile, this customer has <strong>{cust.skinType}</strong> skin with concerns around <strong>{cust.skinConcerns?.join(', ') || 'none specified'}</strong>. AI recommends focusing on lightweight, non-comedogenic products with active ingredients like Niacinamide and Salicylic Acid.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#A78BFA', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>🤖 View AI Recommendations</button>
              <button style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>📋 Send Routine</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
