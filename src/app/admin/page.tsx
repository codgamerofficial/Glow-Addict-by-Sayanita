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
