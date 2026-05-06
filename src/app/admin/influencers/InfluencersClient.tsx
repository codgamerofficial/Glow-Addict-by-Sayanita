'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Video, ExternalLink } from 'lucide-react';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';

function formatFollowers(n: number) { return n >= 1000000 ? `${(n / 1000000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n); }

import { AdminInfluencer } from '@/types/admin';

export default function InfluencersClient({ initialInfluencers }: { initialInfluencers: AdminInfluencer[] }) {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Influencers</h1><p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{initialInfluencers.length} brand ambassadors</p></div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 10, background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}><Plus size={16} /> Add Influencer</button>
      </motion.div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {initialInfluencers.map((inf, i) => {
          const engagementRate = (inf.engagementRate !== undefined ? inf.engagementRate : inf.engagement_rate) || 0;
          const totalSales = (inf.totalSales !== undefined ? inf.totalSales : inf.total_sales) || 0;
          const commissionRate = (inf.commissionRate !== undefined ? inf.commissionRate : inf.commission_rate) || 0;
          const totalEarnings = (inf.totalEarnings !== undefined ? inf.totalEarnings : inf.total_earnings) || 0;
          const avatarUrl = inf.avatarUrl !== undefined ? inf.avatarUrl : inf.avatar_url;

          return (
            <motion.div key={inf.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <img src={avatarUrl || `https://i.pravatar.cc/150?u=${inf.id}`} alt="" style={{ width: 48, height: 48, borderRadius: 14, objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, fontFamily: 'Outfit' }}>{inf.name}</div>
                  <div style={{ fontSize: 12, color: '#E91E8C', display: 'flex', alignItems: 'center', gap: 4 }}>
                    {inf.platform === 'instagram' ? <Users size={12} /> : inf.platform === 'youtube' ? <Video size={12} /> : <ExternalLink size={12} />}
                    {inf.handle}
                  </div>
                </div>
                <StatusBadge status={inf.status} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div style={{ textAlign: 'center', padding: '10px 0', borderRadius: 10, background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit' }}>{formatFollowers(inf.followers)}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Followers</div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px 0', borderRadius: 10, background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit', color: '#10B981' }}>{engagementRate}%</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Engagement</div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px 0', borderRadius: 10, background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Outfit' }}>{totalSales}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Sales</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
                <span>Commission: <span style={{ fontWeight: 600, color: '#F59E0B' }}>{commissionRate}%</span></span>
                <span>Earned: <span style={{ fontWeight: 600, color: '#10B981' }}>₹{totalEarnings.toLocaleString()}</span></span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
