'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Send, Clock, Users, Filter, Plus } from 'lucide-react';
import { adminNotifications } from '@/data/admin-seed';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';

import { AdminNotification } from '@/types/admin';

export default function NotificationsClient({ initialNotifications }: { initialNotifications?: AdminNotification[] }) {
  const [activeTab, setActiveTab] = useState('all');
  const notifications = initialNotifications || adminNotifications;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Push Notifications</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Engage customers with targeted updates & offers</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 10, background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          <Plus size={16} /> New Campaign
        </button>
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { icon: <Send size={18} />, label: 'Sent Campaigns', value: '124', color: '#10B981' },
          { icon: <Clock size={18} />, label: 'Scheduled', value: '3', color: '#F59E0B' },
          { icon: <Users size={18} />, label: 'Avg Open Rate', value: '24.5%', color: '#3B82F6' },
          { icon: <Bell size={18} />, label: 'Total Subscribers', value: '45.2K', color: '#8B5CF6' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '18px 20px' }}>
            <div style={{ color: s.color, marginBottom: 10 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Outfit' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        {/* Campaign List */}
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {['All', 'Sent', 'Scheduled', 'Drafts'].map(t => (
              <button key={t} onClick={() => setActiveTab(t.toLowerCase())} style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                background: activeTab === t.toLowerCase() ? 'linear-gradient(135deg, rgba(233,30,140,0.15), rgba(124,58,237,0.1))' : 'rgba(255,255,255,0.04)',
                color: activeTab === t.toLowerCase() ? '#F5B7C5' : 'var(--text-secondary)',
                border: activeTab === t.toLowerCase() ? '1px solid rgba(233,30,140,0.2)' : '1px solid rgba(255,255,255,0.06)'
              }}>{t}</button>
            ))}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {notifications.filter(n => activeTab === 'all' || n.status === activeTab).map((n, i) => (
              <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{n.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{n.body}</p>
                  </div>
                  <StatusBadge status={n.status} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: 10 }}>
                  <div>🎯 Target: <span style={{ color: 'var(--text-primary)', textTransform: 'capitalize' }}>{n.targetSegment || n.target || 'All'}</span></div>
                  <div>📅 {n.status === 'scheduled' ? `Scheduled: ${new Date(n.scheduledAt || n.scheduled_at || 0).toLocaleString('en-IN')}` : n.status === 'sent' ? `Sent: ${new Date(n.sentAt || n.sent_at || 0).toLocaleString('en-IN')}` : `Created: ${new Date(n.createdAt || n.created_at || 0).toLocaleDateString()}`}</div>
                  {n.status === 'sent' && (
                    <>
                      <div>👁️ Open Rate: <span style={{ color: '#10B981', fontWeight: 600 }}>{n.openRate || n.open_rate}%</span></div>
                      <div>🖱️ CTR: <span style={{ color: '#3B82F6', fontWeight: 600 }}>{n.clickRate || n.click_rate}%</span></div>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Composer */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, height: 'fit-content' }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Quick Send</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Title</label>
              <input aria-label="Title" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 13, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', outline: 'none' }} placeholder="e.g. Flash Sale Alert!" />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Message</label>
              <textarea aria-label="Message" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 13, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', outline: 'none', height: 80, resize: 'none' }} placeholder="Brief notification text..." />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Audience</label>
              <select aria-label="Audience" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, fontSize: 13, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', outline: 'none' }}>
                <option value="all">All Subscribers</option>
                <option value="vip">VIP Customers</option>
                <option value="cart_abandon">Cart Abandoners</option>
              </select>
            </div>
            <button style={{ width: '100%', padding: '12px', borderRadius: 10, background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8 }}>
              <Send size={14} /> Send Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
