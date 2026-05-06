import React from 'react';
import CustomersClient from './CustomersClient';
import { getAdminCustomers } from '@/actions/admin';
import { adminCustomers as fallbackCustomers } from '@/data/admin-seed';

export default async function CustomersPage() {
  const dbCustomers = await getAdminCustomers();
  const customers = dbCustomers.length > 0 ? dbCustomers : fallbackCustomers;
  return <CustomersClient initialCustomers={customers} />;
}
