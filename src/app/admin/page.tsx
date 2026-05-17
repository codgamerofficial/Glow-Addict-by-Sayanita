import React from 'react';
import generated from '../../data/generated-catalog.json';

export default function AdminHome() {
  const products = generated.products || [];

  const totalProducts = products.length;
  const outOfStock = products.filter((p: any) => (p.stock || p.stockQuantity || p.stock) <= 0).length;

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow">Total Products<br/><strong>{totalProducts}</strong></div>
        <div className="p-4 bg-white rounded shadow">Out of Stock<br/><strong>{outOfStock}</strong></div>
        <div className="p-4 bg-white rounded shadow">Revenue<br/><strong>—</strong></div>
        <div className="p-4 bg-white rounded shadow">New Customers<br/><strong>—</strong></div>
      </div>

      <section className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-medium mb-3">Recent Products</h2>
        <ul className="space-y-2">
          {products.slice(0, 10).map((p: any) => (
            <li key={p.id} className="flex items-center gap-3">
              <img src={p.image || (p.images && p.images[0]) || '/images/logo.png'} alt={p.title} className="w-12 h-12 object-cover rounded" />
              <div>
                <div className="font-medium">{p.title}</div>
                <div className="text-sm text-slate-500">{p.brand} • {p.category}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
import React from 'react';
import DashboardClient from './DashboardClient';
import { AdminDashboardStats, AdminOrder } from '@/types/admin';
import { getDashboardStats, getAdminOrders } from '@/actions/admin';
import { dashboardStats as fallbackStats, adminOrders as fallbackOrders } from '@/data/admin-seed';

export default async function AdminDashboard() {
  let stats;
  let orders;

  try {
    stats = await getDashboardStats();
    orders = await getAdminOrders();
  } catch (error) {
    console.error('Error fetching dashboard data, using fallbacks', error);
  }

  // Use real data if available, otherwise fallback to seed data
  const finalStats = stats && stats.totalOrders !== undefined ? stats : fallbackStats;
  const finalOrders = orders && orders.length > 0 ? orders.slice(0, 8) : fallbackOrders.slice(0, 8);

  return <DashboardClient stats={finalStats as unknown as AdminDashboardStats} recentOrders={finalOrders as unknown as AdminOrder[]} />;
}
