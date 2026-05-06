'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, CheckCircle, Clock, Brain, TrendingUp } from 'lucide-react';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';

const routines = [
  { name: 'Morning Glow Routine', skinType: 'Oily', steps: ['Cleanser', 'Toner', 'Vitamin C Serum', 'Moisturizer', 'Sunscreen SPF 50+'], time: 'morning' },
  { name: 'Night Repair Routine', skinType: 'Dry', steps: ['Oil Cleanser', 'Water Cleanser', 'AHA/BHA Toner', 'Retinol Serum', 'Night Cream'], time: 'evening' },
  { name: 'Acne Control Routine', skinType: 'Oily', steps: ['Salicylic Acid Wash', 'Niacinamide Serum', 'Oil-free Moisturizer', 'Spot Treatment'], time: 'both' },
];

import { AdminRecommendation } from '@/types/admin';

export default function AIClient({ initialRecommendations }: { initialRecommendations: AdminRecommendation[] }) {
  const approved = initialRecommendations.filter(r => r.status === 'approved').length;
  const pending = initialRecommendations.filter(r => r.status === 'pending').length;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Bot size={28} style={{ color: '#8B5CF6' }} />
          <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 700 }}>AI Engine</h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Manage AI-powered skincare recommendations, routines & product matching</p>
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { icon: <Brain size={18} />, label: 'Total Recommendations', value: initialRecommendations.length, color: '#8B5CF6' },
          { icon: <CheckCircle size={18} />, label: 'Approved', value: approved, color: '#10B981' },
          { icon: <Clock size={18} />, label: 'Pending Review', value: pending, color: '#F59E0B' },
          { icon: <TrendingUp size={18} />, label: 'Avg Confidence', value: '89%', color: '#06B6D4' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ color: s.color, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Outfit' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Recommendations */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={16} style={{ color: '#8B5CF6' }} /> Product Recommendations
          </h3>
          {initialRecommendations.map(rec => (
            <div key={rec.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{rec.productName || rec.product_id}</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {(rec.skinTypes || rec.skin_types || []).map((st: string) => <span key={st} style={{ padding: '2px 8px', borderRadius: 12, fontSize: 10, background: 'rgba(139,92,246,0.1)', color: '#A78BFA' }}>{st}</span>)}
                  <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 10, background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}>{rec.routineType || rec.routine_type}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', marginRight: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: rec.confidence > 0.9 ? '#10B981' : '#F59E0B' }}>{Math.round(rec.confidence * 100)}%</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>confidence</div>
              </div>
              <StatusBadge status={rec.status} />
            </div>
          ))}
        </motion.div>

        {/* Routines */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>AI Routines</h3>
          {routines.map((r, i) => (
            <div key={r.name} style={{ marginBottom: 16, padding: 16, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontWeight: 600, fontSize: 14, fontFamily: 'Outfit' }}>{r.name}</div>
                <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: 10, background: r.time === 'morning' ? 'rgba(245,158,11,0.1)' : r.time === 'evening' ? 'rgba(139,92,246,0.1)' : 'rgba(6,182,212,0.1)', color: r.time === 'morning' ? '#F59E0B' : r.time === 'evening' ? '#A78BFA' : '#06B6D4' }}>
                  {r.time === 'morning' ? '☀️' : r.time === 'evening' ? '🌙' : '🔄'} {r.time}
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>For {r.skinType} skin</div>
              {r.steps.map((step, si) => (
                <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 12, color: 'var(--text-secondary)' }}>
                  <span style={{ width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, background: 'rgba(139,92,246,0.1)', color: '#A78BFA' }}>{si + 1}</span>
                  {step}
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
