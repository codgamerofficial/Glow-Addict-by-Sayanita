import React from 'react';
import AuditLogsClient from './AuditLogsClient';
import { getAdminAuditLogs } from '@/actions/admin';
import { adminAuditLogs as fallbackLogs } from '@/data/admin-seed';

export default async function AuditLogsPage() {
  const dbLogs = await getAdminAuditLogs();
  const logs = dbLogs.length > 0 ? dbLogs : fallbackLogs;

  return <AuditLogsClient initialLogs={logs} />;
}
