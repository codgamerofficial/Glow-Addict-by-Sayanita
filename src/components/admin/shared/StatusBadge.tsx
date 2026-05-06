'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, { bg: string; color: string; dot: string }> = {
  pending: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', dot: '#F59E0B' },
  processing: { bg: 'rgba(59,130,246,0.1)', color: '#3B82F6', dot: '#3B82F6' },
  packed: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6', dot: '#8B5CF6' },
  shipped: { bg: 'rgba(6,182,212,0.1)', color: '#06B6D4', dot: '#06B6D4' },
  delivered: { bg: 'rgba(16,185,129,0.1)', color: '#10B981', dot: '#10B981' },
  cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444', dot: '#EF4444' },
  returned: { bg: 'rgba(249,115,22,0.1)', color: '#F97316', dot: '#F97316' },
  active: { bg: 'rgba(16,185,129,0.1)', color: '#10B981', dot: '#10B981' },
  inactive: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280', dot: '#6B7280' },
  draft: { bg: 'rgba(107,114,128,0.1)', color: '#6B7280', dot: '#6B7280' },
  approved: { bg: 'rgba(16,185,129,0.1)', color: '#10B981', dot: '#10B981' },
  rejected: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444', dot: '#EF4444' },
  scheduled: { bg: 'rgba(139,92,246,0.1)', color: '#8B5CF6', dot: '#8B5CF6' },
  sent: { bg: 'rgba(16,185,129,0.1)', color: '#10B981', dot: '#10B981' },
  open: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', dot: '#F59E0B' },
  resolved: { bg: 'rgba(16,185,129,0.1)', color: '#10B981', dot: '#10B981' },
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const style = statusStyles[status] || statusStyles.pending;
  const px = size === 'sm' ? '8px 12px' : '6px 14px';
  const fs = size === 'sm' ? 11 : 12;

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: px, borderRadius: 20, fontSize: fs, fontWeight: 600,
        background: style.bg, color: style.color,
        textTransform: 'capitalize', letterSpacing: '0.02em',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: style.dot }} />
      {status.replace(/_/g, ' ')}
    </motion.span>
  );
}
