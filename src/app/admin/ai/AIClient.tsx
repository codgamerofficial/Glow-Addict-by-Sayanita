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
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-2.5 mb-1">
          <Bot size={28} className="text-[#8B5CF6]" />
          <h1 className="font-outfit text-[28px] font-bold">AI Engine</h1>
        </div>
        <p className="text-[var(--text-muted)] text-sm">Manage AI-powered skincare recommendations, routines & product matching</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        {[
          { icon: <Brain size={18} />, label: 'Total Recommendations', value: initialRecommendations.length, color: '#8B5CF6' },
          { icon: <CheckCircle size={18} />, label: 'Approved', value: approved, color: '#10B981' },
          { icon: <Clock size={18} />, label: 'Pending Review', value: pending, color: '#F59E0B' },
          { icon: <TrendingUp size={18} />, label: 'Avg Confidence', value: '89%', color: '#06B6D4' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-white/[0.02] border border-white/[0.06] rounded-[14px] p-[18px] px-5">
            <div className="mb-2.5" style={{ color: s.color }}>{s.icon}</div>
            <div className="text-2xl font-bold font-outfit">{s.value}</div>
            <div className="text-[11px] text-[var(--text-muted)]">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Recommendations */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <h3 className="font-outfit text-base font-semibold mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-[#8B5CF6]" /> Product Recommendations
          </h3>
          {initialRecommendations.map(rec => (
            <div key={rec.id} className="flex items-center gap-3 py-3 border-b border-white/[0.04] last:border-none">
              <div className="flex-1">
                <div className="text-[13px] font-medium mb-1">{rec.productName || rec.product_id}</div>
                <div className="flex gap-1 flex-wrap">
                  {(rec.skinTypes || rec.skin_types || []).map((st: string) => <span key={st} className="p-0.5 px-2 rounded-xl text-[10px] bg-[#8B5CF6]/[0.1] text-[#A78BFA]">{st}</span>)}
                  <span className="p-0.5 px-2 rounded-xl text-[10px] bg-white/[0.04] text-[var(--text-muted)]">{rec.routineType || rec.routine_type}</span>
                </div>
              </div>
              <div className="text-right mr-2">
                <div className="text-sm font-bold" style={{ color: rec.confidence > 0.9 ? '#10B981' : '#F59E0B' }}>{Math.round(rec.confidence * 100)}%</div>
                <div className="text-[10px] text-[var(--text-muted)]">confidence</div>
              </div>
              <StatusBadge status={rec.status} />
            </div>
          ))}
        </motion.div>

        {/* Routines */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <h3 className="font-outfit text-base font-semibold mb-4">AI Routines</h3>
          {routines.map((r, i) => (
            <div key={r.name} className="mb-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex justify-between mb-2.5">
                <div className="font-semibold text-sm font-outfit">{r.name}</div>
                <span className={`
                  p-0.5 px-2.5 rounded-xl text-[10px]
                  ${r.time === 'morning' ? 'bg-[#F59E0B]/[0.1] text-[#F59E0B]' : r.time === 'evening' ? 'bg-[#8B5CF6]/[0.1] text-[#A78BFA]' : 'bg-[#06B6D4]/[0.1] text-[#06B6D4]'}
                `}>
                  {r.time === 'morning' ? '☀️' : r.time === 'evening' ? '🌙' : '🔄'} {r.time}
                </span>
              </div>
              <div className="text-[11px] text-[var(--text-muted)] mb-2">For {r.skinType} skin</div>
              {r.steps.map((step, si) => (
                <div key={step} className="flex items-center gap-2.5 py-1.5 text-[12px] text-[var(--text-secondary)]">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold bg-[#8B5CF6]/[0.1] text-[#A78BFA]">{si + 1}</span>
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
