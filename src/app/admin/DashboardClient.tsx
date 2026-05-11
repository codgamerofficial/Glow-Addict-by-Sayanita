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
      {/* Vibrant Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 rounded-3xl p-8 text-white">
        <h1 className="font-outfit text-4xl font-black mb-2">ADMIN DASHBOARD</h1>
        <p className="text-white/90 text-lg">Welcome back, Sayanita! Here&apos;s your store overview. 📊</p>
      </motion.div>

      {/* Stats Grid with Vibrant Colors */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-7">
        <StatCard icon={<DollarSign size={20} />} label="Total Revenue" value={s.totalRevenue} prefix="₹" trend={s.revenueTrend} color="#10B981" delay={0} gradient="from-emerald-400 to-green-600" />
        <StatCard icon={<ShoppingCart size={20} />} label="Total Orders" value={s.totalOrders} trend={s.ordersTrend} color="#3B82F6" delay={0.05} gradient="from-blue-400 to-blue-600" />
        <StatCard icon={<Users size={20} />} label="Total Customers" value={s.totalCustomers} trend={s.customersTrend} color="#8B5CF6" delay={0.1} gradient="from-purple-400 to-purple-600" />
        <StatCard icon={<Percent size={20} />} label="Conversion Rate" value={s.conversionRate} suffix="%" trend={s.conversionTrend} color="#E91E8C" delay={0.15} gradient="from-pink-400 to-pink-600" />
        <StatCard icon={<TrendingUp size={20} />} label="Avg Order Value" value={s.avgOrderValue} prefix="₹" trend={s.aovTrend} color="#F59E0B" delay={0.2} gradient="from-yellow-400 to-orange-600" />
        <StatCard icon={<Eye size={20} />} label="Repeat Customers" value={s.repeatCustomerRate} suffix="%" color="#06B6D4" delay={0.25} gradient="from-cyan-400 to-cyan-600" />
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 mb-7">
        {[
          { icon: <Package size={16} />, label: 'Pending Orders', value: s.pendingOrders, color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
          { icon: <AlertTriangle size={16} />, label: 'Low Stock Items', value: s.lowStockItems, color: '#EF4444', bg: 'rgba(239,68,68,0.08)' },
          { icon: <RotateCcw size={16} />, label: 'Refund Requests', value: s.refundRequests, color: '#F97316', bg: 'rgba(249,115,22,0.08)' },
        ].map((alert, i) => (
          <motion.div key={alert.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
            className="flex items-center gap-3.5 p-3.5 px-4.5 rounded-xl cursor-pointer border"
            style={{ background: alert.bg, borderColor: `${alert.color}20` }}>
            <div style={{ color: alert.color }}>{alert.icon}</div>
            <div>
              <div className="text-xl font-bold font-outfit" style={{ color: alert.color }}>{alert.value}</div>
              <div className="text-[11px] text-[var(--text-muted)]">{alert.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 mb-7">
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="font-outfit text-base font-semibold">Revenue Overview</h3>
              <p className="text-[12px] text-[var(--text-muted)]">Last 30 days</p>
            </div>
            <div className="flex gap-1.5">
              {['7D', '30D', '90D'].map(p => (
                <button key={p} className={`
                  p-1 px-3 rounded-lg text-[11px] font-semibold cursor-pointer border
                  ${p === '30D' ? 'bg-gradient-to-br from-[#E91E8C] to-[#7C3AED] text-white border-none' : 'bg-white/[0.04] text-white border-white/[0.06]'}
                `}>{p}</button>
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
              <Tooltip contentStyle={{ background: 'rgba(20,15,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} formatter={(v: any) => [`₹${(v as number).toLocaleString('en-IN')}`, 'Revenue']} />
              <Area type="monotone" dataKey="revenue" stroke="#E91E8C" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Donut */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <h3 className="font-outfit text-base font-semibold mb-1">Sales by Category</h3>
          <p className="text-[12px] text-[var(--text-muted)] mb-4">Revenue distribution</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={categorySalesData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {categorySalesData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(20,15,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [`${v}%`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {categorySalesData.map(c => (
              <div key={c.name} className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
                <span className="w-2 h-2 rounded-[2px]" style={{ background: c.color }} />
                {c.name} ({c.value}%)
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Top Products */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-outfit text-base font-semibold">Bestselling Products</h3>
            <Link href="/admin/products" className="text-[12px] text-[#E91E8C] no-underline flex items-center gap-1">View all <ArrowUpRight size={12} /></Link>
          </div>
          {topProducts.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-none">
              <span className="text-[12px] text-[var(--text-muted)] w-5">#{i + 1}</span>
              <div className="w-9 h-9 relative rounded-lg overflow-hidden">
                <Image src={p.image} alt="" fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium overflow-hidden text-ellipsis whitespace-nowrap">{p.name}</div>
                <div className="text-[11px] text-[var(--text-muted)]">{p.unitsSold.toLocaleString()} sold</div>
              </div>
              <div className="text-right">
                <div className="text-[13px] font-semibold">₹{(p.revenue / 1000).toFixed(0)}k</div>
                <div className="text-[11px]" style={{ color: p.trend > 0 ? '#10B981' : '#EF4444' }}>
                  {p.trend > 0 ? '+' : ''}{p.trend}%
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Recent Orders */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-outfit text-base font-semibold">Recent Orders</h3>
            <Link href="/admin/orders" className="text-[12px] text-[#E91E8C] no-underline flex items-center gap-1">View all <ArrowUpRight size={12} /></Link>
          </div>
          {recentOrders.map((o, i) => (
            <div key={o.id} className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-none">
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium">{o.orderNumber || o.id}</div>
                <div className="text-[11px] text-[var(--text-muted)]">{o.customerName || o.user_id}</div>
              </div>
              <div className="text-right mr-3">
                <div className="text-[13px] font-semibold">₹{(o.total || 0).toLocaleString('en-IN')}</div>
              </div>
              <StatusBadge status={o.status} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
