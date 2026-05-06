import React from 'react';
import CMSClient from './CMSClient';
import { getAdminBanners, getAdminCollections } from '@/actions/admin';

export default async function CMSPage() {
  const [banners, collections] = await Promise.all([
    getAdminBanners(),
    getAdminCollections(),
  ]);
  
  return <CMSClient initialBanners={banners} initialCollections={collections} />;
}
