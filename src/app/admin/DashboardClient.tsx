'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Users, TrendingUp, Package, AlertTriangle, RotateCcw, Percent, Eye, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { StatCard } from '@/components/admin/shared/StatCard';
import { StatusBadge } from '@/components/admin/shared/StatusBadge';
import Link from 'next/link';
import { AdminOrder, AdminDashboardStats } from '@/types/admin';
import { revenueData, categorySalesData, topProducts } from '@/data/admin-seed'; // Keeping chart mock data for now

import Image from 'next/image';

export default function DashboardClient({ stats, recentOrders }: { stats: AdminDashboardStats, recentOrders: AdminOrder[] }) {
  // Use DB stats if available, otherwise fallback to mock layout
  const s = stats.totalOrders ? stats : {
    totalRevenue: 0, revenueTrend: 0, totalOrders: 0, ordersTrend: 0,
    totalCustomers: 0, customersTrend: 0, conversionRate: 0, conversionTrend: 0,
    avgOrderValue: 0, aovTrend: 0, repeatCustomerRate: 0, pendingOrders: 0,
    lowStockItems: 0, refundRequests: 0
  };

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Welcome back, Sayanita! Here&apos;s your store overview.</p>
      </motion.div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        <StatCard icon={<DollarSign size={20} />} label="Total Revenue" value={s.totalRevenue} prefix="₹" trend={s.revenueTrend} color="#10B981" delay={0} />
        <StatCard icon={<ShoppingCart size={20} />} label="Total Orders" value={s.totalOrders} trend={s.ordersTrend} color="#3B82F6" delay={0.05} />
        <StatCard icon={<Users size={20} />} label="Total Customers" value={s.totalCustomers} trend={s.customersTrend} color="#8B5CF6" delay={0.1} />
        <StatCard icon={<Percent size={20} />} label="Conversion Rate" value={s.conversionRate} suffix="%" trend={s.conversionTrend} color="#E91E8C" delay={0.15} />
        <StatCard icon={<TrendingUp size={20} />} label="Avg Order Value" value={s.avgOrderValue} prefix="₹" trend={s.aovTrend} color="#F59E0B" delay={0.2} />
        <StatCard icon={<Eye size={20} />} label="Repeat Customers" value={s.repeatCustomerRate} suffix="%" color="#06B6D4" delay={0.25} />
      </div>

      {/* Alert Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 28 }}>
        {[
          { icon: <Package size={16} />, label: 'Pending Orders', value: s.pendingOrders, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
          { icon: <AlertTriangle size={16} />, label: 'Low Stock Items', value: s.lowStockItems, color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
          { icon: <RotateCcw size={16} />, label: 'Refund Requests', value: s.refundRequests, color: '#F97316', bg: 'rgba(249,115,22,0.08)' },
        ].map((alert, i) => (
          <motion.div key={alert.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 12, background: alert.bg, border: `1px solid ${alert.color}20`, cursor: 'pointer' }}>
            <div style={{ color: alert.color }}>{alert.icon}</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Outfit', color: alert.color }}>{alert.value}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{alert.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 28 }}>
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 600 }}>Revenue Overview</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last 30 days</p>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['7D', '30D', '90D'].map(p => (
                <button key={p} style={{
                  padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  background: p === '30D' ? 'linear-gradient(135deg, #E91E8C, #7C3AED)' : 'rgba(255,255,255,0.04)',
                  color: '#fff', border: p === '30D' ? 'none' : '1px solid rgba(255,255,255,0.06)',
                }}>{p}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E91E8C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E91E8C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} tickFormatter={v => v.slice(5)} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(20,15,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#E91E8C" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Donut */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px' }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Sales by Category</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Revenue distribution</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categorySalesData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {categorySalesData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(20,15,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} formatter={(v) => [`${v}%`]} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {categorySalesData.map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-secondary)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color }} />
                {c.name} ({c.value}%)
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Top Products */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 600 }}>Bestselling Products</h3>
            <Link href="/admin/products" style={{ fontSize: 12, color: '#E91E8C', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>View all <ArrowUpRight size={12} /></Link>
          </div>
          {topProducts.map((p, i) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < topProducts.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 20 }}>#{i + 1}</span>
              <div style={{ width: 36, height: 36, position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
                <Image src={p.image} alt="" fill style={{ objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.unitsSold.toLocaleString()} sold</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>₹{(p.revenue / 1000).toFixed(0)}k</div>
                <div style={{ fontSize: 11, color: p.trend > 0 ? '#10B981' : '#EF4444' }}>
                  {p.trend > 0 ? '+' : ''}{p.trend}%
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Recent Orders */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 600 }}>Recent Orders</h3>
            <Link href="/admin/orders" style={{ fontSize: 12, color: '#E91E8C', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>View all <ArrowUpRight size={12} /></Link>
          </div>
          {recentOrders.map((o, i) => (
            <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < recentOrders.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{o.orderNumber || o.id}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{o.customerName || o.user_id}</div>
              </div>
              <div style={{ textAlign: 'right', marginRight: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>₹{(o.total || 0).toLocaleString('en-IN')}</div>
              </div>
              <StatusBadge status={o.status} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
