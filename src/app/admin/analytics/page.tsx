'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { StatCard } from '@/components/admin/shared/StatCard';
import { dashboardStats, revenueData, categorySalesData } from '@/data/admin-seed';
import { DollarSign, Users, ShoppingCart, TrendingUp, Calendar } from 'lucide-react';

const customerGrowth = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  customers: 800 + Math.floor(Math.random() * 400) + i * 50,
  returning: 200 + Math.floor(Math.random() * 200) + i * 20,
}));

const hourlyOrders = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  orders: Math.floor(Math.random() * 30) + (i > 8 && i < 22 ? 20 : 2),
}));

export default function AnalyticsPage() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div><h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Analytics</h1><p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Detailed business intelligence & reports</p></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
          <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Last 30 days</span>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        <StatCard icon={<DollarSign size={18} />} label="Revenue" value={dashboardStats.totalRevenue} prefix="₹" trend={dashboardStats.revenueTrend} color="#10B981" delay={0} />
        <StatCard icon={<ShoppingCart size={18} />} label="Orders" value={dashboardStats.totalOrders} trend={dashboardStats.ordersTrend} color="#3B82F6" delay={0.05} />
        <StatCard icon={<Users size={18} />} label="Customers" value={dashboardStats.totalCustomers} trend={dashboardStats.customersTrend} color="#8B5CF6" delay={0.1} />
        <StatCard icon={<TrendingUp size={18} />} label="Avg Order" value={dashboardStats.avgOrderValue} prefix="₹" trend={dashboardStats.aovTrend} color="#F59E0B" delay={0.15} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        {/* Revenue Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs><linearGradient id="rg2" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#E91E8C" stopOpacity={0.3} /><stop offset="95%" stopColor="#E91E8C" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} tickFormatter={v => v.slice(8)} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(20,15,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} />
              <Area type="monotone" dataKey="revenue" stroke="#E91E8C" strokeWidth={2} fill="url(#rg2)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Customer Growth */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Customer Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={customerGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(20,15,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} />
              <Bar dataKey="customers" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              <Bar dataKey="returning" fill="#E91E8C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Orders by Hour */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Orders by Hour</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={hourlyOrders}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="hour" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'rgba(20,15,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} />
              <Line type="monotone" dataKey="orders" stroke="#06B6D4" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart><Pie data={categorySalesData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
              {categorySalesData.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie><Tooltip contentStyle={{ background: 'rgba(20,15,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} /></PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            {categorySalesData.map(c => (
              <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-secondary)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color }} />{c.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
