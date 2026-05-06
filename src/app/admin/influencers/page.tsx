import React from 'react';
import InfluencersClient from './InfluencersClient';
import { getAdminInfluencers } from '@/actions/admin';
import { adminInfluencers as fallbackInfluencers } from '@/data/admin-seed';

export default async function InfluencersPage() {
  const dbInfluencers = await getAdminInfluencers();
  const influencers = dbInfluencers.length > 0 ? dbInfluencers : fallbackInfluencers;
  
  return <InfluencersClient initialInfluencers={influencers} />;
}
