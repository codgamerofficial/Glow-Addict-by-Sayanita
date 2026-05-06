import React from 'react';
import SettingsClient from './SettingsClient';
import { getAdminAuditLogs, getStoreSettings } from '@/actions/admin';

export default async function SettingsPage() {
  const [logs, settings] = await Promise.all([
    getAdminAuditLogs(),
    getStoreSettings(),
  ]);

  return <SettingsClient initialLogs={logs} initialSettings={settings} />;
}
