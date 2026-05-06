import React from 'react';
import CouponsClient from './CouponsClient';
import { getAdminCoupons } from '@/actions/admin';
import { adminCoupons as fallbackCoupons } from '@/data/admin-seed';

export default async function CouponsPage() {
  const dbCoupons = await getAdminCoupons();
  const coupons = dbCoupons.length > 0 ? dbCoupons : fallbackCoupons;
  
  return <CouponsClient initialCoupons={coupons} />;
}
