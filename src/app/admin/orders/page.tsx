import React from 'react';
import OrdersClient from './OrdersClient';
import { getAdminOrders } from '@/actions/admin';

export default async function OrdersPage() {
  const orders = await getAdminOrders();
  return <OrdersClient initialOrders={orders} />;
}