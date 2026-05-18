'use client';
import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { StatCard } from '@/components/admin/shared/StatCard';
import { dashboardStats, revenueData, categorySalesData } from '@/data/admin-seed';
import { DollarSign, Users, ShoppingCart, TrendingUp, Calendar, Search, AlertTriangle, Sparkles, CheckCircle2, XCircle, LoaderCircle } from 'lucide-react';

const customerGrowth = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  customers: 800 + Math.floor(Math.random() * 400) + i * 50,
  returning: 200 + Math.floor(Math.random() * 200) + i * 20,
}));

const hourlyOrders = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  orders: Math.floor(Math.random() * 30) + (i > 8 && i < 22 ? 20 : 2),
}));

type SearchAnalytics = {
  totalSearches: number;
  avgResults: number;
  zeroResultSearches: number;
  zeroResultRate: number;
  topQueries: Array<{ query: string; searches: number; results: number; intent: string }>;
  noResultQueries: Array<{ query: string; searches: number }>;
  intentDistribution: Array<{ intent: string; count: number }>;
  recoveryQueue: Array<{
    id: string;
    query: string;
    intent: string;
    status: 'open' | 'in_progress' | 'resolved' | 'ignored';
    demandHits: number;
    suggestionsCount: number;
    notes: string;
    suggestedProducts: Array<{
      id: string;
      name: string;
      slug: string;
      brandName: string;
      categoryName: string;
      price: number;
      image: string | null;
    }>;
    updatedAt: string;
  }>;
};

export default function AnalyticsPage() {
  const [searchStats, setSearchStats] = useState<SearchAnalytics | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);

  const loadSearchAnalytics = async (signal?: AbortSignal) => {
    try {
      const res = await fetch('/api/admin/search-analytics', { signal });
      if (!res.ok) return;
      const data = await res.json();
      setSearchStats(data);
    } catch {
      // Keep dashboard running even if analytics API is unavailable.
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    void loadSearchAnalytics(controller.signal);
    return () => controller.abort();
  }, []);

  const updateRecoveryTask = async (taskId: string, status: 'open' | 'in_progress' | 'resolved' | 'ignored') => {
    try {
      setUpdatingTaskId(taskId);
      const response = await fetch(`/api/admin/search-recovery/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        return;
      }

      await loadSearchAnalytics();
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const intentChart = useMemo(
    () => (searchStats?.intentDistribution || []).map((item, index) => ({
      ...item,
      color: ['#E91E8C', '#7C3AED', '#10B981', '#F59E0B', '#3B82F6', '#EC4899', '#22C55E', '#8B5CF6'][index % 8],
    })),
    [searchStats],
  );

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

      <div style={{ marginTop: 24 }}>
        <h2 style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 700, marginBottom: 14 }}>Search Intelligence</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 18 }}>
          <StatCard icon={<Search size={18} />} label="Total Searches" value={searchStats?.totalSearches || 0} color="#3B82F6" delay={0} />
          <StatCard icon={<Sparkles size={18} />} label="Avg Results / Query" value={searchStats?.avgResults || 0} color="#10B981" delay={0.05} />
          <StatCard icon={<AlertTriangle size={18} />} label="Zero-Result Searches" value={searchStats?.zeroResultSearches || 0} color="#F59E0B" delay={0.1} />
          <StatCard icon={<TrendingUp size={18} />} label="Zero-Result Rate" value={searchStats?.zeroResultRate || 0} suffix="%" color="#E91E8C" delay={0.15} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontFamily: 'Outfit', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Top Search Queries</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={searchStats?.topQueries || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="query" tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} interval={0} angle={-12} textAnchor="end" height={58} />
                <YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'rgba(20,15,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="searches" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontFamily: 'Outfit', fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Intent Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={intentChart} cx="50%" cy="50%" innerRadius={45} outerRadius={78} paddingAngle={2} dataKey="count">
                  {intentChart.map((entry) => (
                    <Cell key={entry.intent} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(20,15,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {intentChart.map((item) => (
                <div key={item.intent} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-secondary)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: item.color }} />{item.intent}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 15, fontWeight: 600, marginBottom: 14 }}>No-Result Recovery Queue</h3>
          {(searchStats?.recoveryQueue || []).length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Query</th>
                    <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Intent</th>
                    <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Demand</th>
                    <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Suggested Products</th>
                    <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {searchStats?.recoveryQueue.map((task) => (
                    <tr key={task.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '10px 8px', fontSize: 13, fontWeight: 600 }}>{task.query}</td>
                      <td style={{ padding: '10px 8px', fontSize: 12, color: 'var(--text-secondary)' }}>{task.intent}</td>
                      <td style={{ padding: '10px 8px', fontSize: 12, color: '#F59E0B', fontWeight: 700 }}>{task.demandHits}</td>
                      <td style={{ padding: '10px 8px', fontSize: 12, color: 'var(--text-secondary)' }}>
                        {task.suggestedProducts.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                            {task.suggestedProducts.map((product) => (
                              <a
                                key={product.id}
                                href={`/admin/products/${product.id}`}
                                style={{ color: '#60A5FA', textDecoration: 'none', fontWeight: 600 }}
                              >
                                {product.name}
                              </a>
                            ))}
                          </div>
                        ) : (
                          <span>0</span>
                        )}
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <span style={{
                          fontSize: 11,
                          padding: '4px 8px',
                          borderRadius: 999,
                          background: task.status === 'open' ? 'rgba(245,158,11,0.14)' : 'rgba(59,130,246,0.14)',
                          color: task.status === 'open' ? '#F59E0B' : '#60A5FA',
                          fontWeight: 700,
                        }}>
                          {task.status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => updateRecoveryTask(task.id, 'in_progress')}
                            disabled={updatingTaskId === task.id}
                            style={{ border: '1px solid rgba(59,130,246,0.4)', background: 'rgba(59,130,246,0.12)', color: '#60A5FA', borderRadius: 8, padding: '4px 8px', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                          >
                            <LoaderCircle size={12} /> In progress
                          </button>
                          <button
                            type="button"
                            onClick={() => updateRecoveryTask(task.id, 'resolved')}
                            disabled={updatingTaskId === task.id}
                            style={{ border: '1px solid rgba(16,185,129,0.4)', background: 'rgba(16,185,129,0.12)', color: '#34D399', borderRadius: 8, padding: '4px 8px', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                          >
                            <CheckCircle2 size={12} /> Resolve
                          </button>
                          <button
                            type="button"
                            onClick={() => updateRecoveryTask(task.id, 'ignored')}
                            disabled={updatingTaskId === task.id}
                            style={{ border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.12)', color: '#F87171', borderRadius: 8, padding: '4px 8px', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                          >
                            <XCircle size={12} /> Ignore
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No active recovery tasks yet.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
