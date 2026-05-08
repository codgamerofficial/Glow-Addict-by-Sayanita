'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Filter, Shield, Calendar, User } from 'lucide-react';
import { DataTable, Column } from '@/components/admin/shared/DataTable';
import { AuditLog } from '@/types/admin';

export default function AuditLogsClient({ initialLogs }: { initialLogs?: AuditLog[] }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const logs = initialLogs || [];

  const filteredLogs = activeFilter === 'all'
    ? logs
    : logs.filter(log => log.action === activeFilter);

  const actionColors: Record<string, string> = {
    create: '#10B981',
    update: '#3B82F6',
    delete: '#EF4444',
    login: '#8B5CF6',
    export: '#F59E0B',
  };

  const columns: Column<AuditLog>[] = [
    {
      key: 'timestamp',
      label: 'Time',
      sortable: true,
      render: (item: AuditLog) => (
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {new Date(item.timestamp).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      ),
    },
    {
      key: 'adminName',
      label: 'Admin',
      sortable: true,
      render: (item: AuditLog) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, rgba(233,30,140,0.15), rgba(124,58,237,0.1))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#E91E8C'
          }}>
            {item.adminName?.charAt(0) || '?'}
          </div>
          <span style={{ fontWeight: 500, fontSize: 13 }}>{item.adminName || 'Unknown'}</span>
        </div>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      sortable: true,
      render: (item: AuditLog) => (
        <span style={{
          padding: '4px 10px',
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 600,
          background: `${actionColors[item.action] || '#6B7280'}15`,
          color: actionColors[item.action] || '#6B7280',
          textTransform: 'capitalize',
        }}>
          {item.action}
        </span>
      ),
    },
    {
      key: 'entity',
      label: 'Entity',
      sortable: true,
      render: (item: AuditLog) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Shield size={12} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: 13, textTransform: 'capitalize' }}>{item.entity}</span>
          {item.entityId && (
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              ({item.entityId})
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'changes',
      label: 'Changes',
      sortable: false,
      render: (item: AuditLog) => {
        if (!item.changes) return <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>;
        const changeCount = Object.keys(item.changes).length;
        return (
          <span style={{ fontSize: 12, color: changeCount > 0 ? '#10B981' : 'var(--text-muted)' }}>
            {changeCount > 0 ? `${changeCount} field${changeCount > 1 ? 's' : ''}` : 'No changes'}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}
      >
        <div>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
            Audit Logs
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Track all admin activities & system changes
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 14px',
            borderRadius: 10,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {logs.length > 0
                ? `Latest: ${new Date(Math.max(...logs.map(l => new Date(l.timestamp).getTime()))).toLocaleDateString('en-IN')}`
                : 'No logs yet'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { icon: <Activity size={18} />, label: 'Total Events', value: logs.length, color: '#3B82F6' },
          { icon: <User size={18} />, label: 'Active Admins', value: new Set(logs.map(l => l.adminName).filter(Boolean)).size, color: '#10B981' },
          { icon: <Shield size={18} />, label: 'Entities Modified', value: new Set(logs.map(l => l.entity).filter(Boolean)).size, color: '#8B5CF6' },
          { icon: <Filter size={18} />, label: 'Changes Today', value: logs.filter(l => {
            const today = new Date();
            const logDate = new Date(l.timestamp);
            return logDate.toDateString() === today.toDateString();
          }).length, color: '#F59E0B' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 14,
              padding: '18px 20px',
            }}
          >
            <div style={{ color: stat.color, marginBottom: 10 }}>{stat.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Outfit' }}>
              {typeof stat.value === 'number' ? stat.value.toLocaleString('en-IN') : stat.value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'create', 'update', 'delete', 'login', 'export'].map(action => (
          <button
            key={action}
            onClick={() => setActiveFilter(action)}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              background: activeFilter === action
                ? `linear-gradient(135deg, ${actionColors[action] || '#E91E8C'}20, ${actionColors[action] || '#7C3AED'}15)`
                : 'rgba(255,255,255,0.04)',
              color: activeFilter === action
                ? actionColors[action] || '#E91E8C'
                : 'var(--text-secondary)',
              border: activeFilter === action
                ? `1px solid ${actionColors[action] || '#E91E8C'}30`
                : '1px solid rgba(255,255,255,0.06)',
              textTransform: 'capitalize',
            }}
          >
            {action === 'all' ? 'All Actions' : action}
          </button>
        ))}
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredLogs as unknown as Record<string, unknown>[]}
        columns={columns as unknown as Column<Record<string, unknown>>[]}
        searchPlaceholder="Search by admin, entity, or action..."
      />
    </div>
  );
}
