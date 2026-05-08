import React from 'react';
import InventoryClient from './InventoryClient';
import { getAdminInventory } from '@/actions/admin';

export default async function InventoryPage() {
  const inventory = await getAdminInventory();
  return <InventoryClient initialInventory={inventory} />;
}
