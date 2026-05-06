import React from 'react';
import NotificationsClient from './NotificationsClient';
import { getAdminNotifications } from '@/actions/admin';
import { adminNotifications as fallbackNotifications } from '@/data/admin-seed';

export default async function NotificationsPage() {
  const dbNotifications = await getAdminNotifications();
  const notifications = dbNotifications.length > 0 ? dbNotifications : fallbackNotifications;

  return <NotificationsClient initialNotifications={notifications} />;
}
