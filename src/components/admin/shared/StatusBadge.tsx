'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusStyles: Record<string, { bg: string; color: string; dot: string; border: string }> = {
  pending: { bg: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(249,115,22,0.2))', color: '#F59E0B', dot: '#F59E0B', border: 'rgba(251,191,36,0.35)' },
  processing: { bg: 'linear-gradient(135deg, rgba(96,165,250,0.2), rgba(59,130,246,0.2))', color: '#3B82F6', dot: '#3B82F6', border: 'rgba(96,165,250,0.35)' },
  packed: { bg: 'linear-gradient(135deg, rgba(196,181,253,0.22), rgba(168,85,247,0.22))', color: '#8B5CF6', dot: '#8B5CF6', border: 'rgba(196,181,253,0.35)' },
  shipped: { bg: 'linear-gradient(135deg, rgba(103,232,249,0.2), rgba(6,182,212,0.2))', color: '#06B6D4', dot: '#06B6D4', border: 'rgba(103,232,249,0.35)' },
  delivered: { bg: 'linear-gradient(135deg, rgba(110,231,183,0.2), rgba(16,185,129,0.2))', color: '#10B981', dot: '#10B981', border: 'rgba(110,231,183,0.35)' },
  cancelled: { bg: 'linear-gradient(135deg, rgba(252,165,165,0.2), rgba(239,68,68,0.2))', color: '#EF4444', dot: '#EF4444', border: 'rgba(252,165,165,0.35)' },
  returned: { bg: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(251,113,133,0.2))', color: '#F97316', dot: '#F97316', border: 'rgba(251,191,36,0.35)' },
  active: { bg: 'linear-gradient(135deg, rgba(110,231,183,0.2), rgba(16,185,129,0.2))', color: '#10B981', dot: '#10B981', border: 'rgba(110,231,183,0.35)' },
  inactive: { bg: 'linear-gradient(135deg, rgba(209,213,219,0.2), rgba(107,114,128,0.2))', color: '#6B7280', dot: '#6B7280', border: 'rgba(209,213,219,0.32)' },
  draft: { bg: 'linear-gradient(135deg, rgba(209,213,219,0.2), rgba(107,114,128,0.2))', color: '#6B7280', dot: '#6B7280', border: 'rgba(209,213,219,0.32)' },
  approved: { bg: 'linear-gradient(135deg, rgba(110,231,183,0.2), rgba(16,185,129,0.2))', color: '#10B981', dot: '#10B981', border: 'rgba(110,231,183,0.35)' },
  rejected: { bg: 'linear-gradient(135deg, rgba(252,165,165,0.2), rgba(239,68,68,0.2))', color: '#EF4444', dot: '#EF4444', border: 'rgba(252,165,165,0.35)' },
  scheduled: { bg: 'linear-gradient(135deg, rgba(196,181,253,0.22), rgba(168,85,247,0.22))', color: '#8B5CF6', dot: '#8B5CF6', border: 'rgba(196,181,253,0.35)' },
  sent: { bg: 'linear-gradient(135deg, rgba(110,231,183,0.2), rgba(16,185,129,0.2))', color: '#10B981', dot: '#10B981', border: 'rgba(110,231,183,0.35)' },
  open: { bg: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(249,115,22,0.2))', color: '#F59E0B', dot: '#F59E0B', border: 'rgba(251,191,36,0.35)' },
  resolved: { bg: 'linear-gradient(135deg, rgba(110,231,183,0.2), rgba(16,185,129,0.2))', color: '#10B981', dot: '#10B981', border: 'rgba(110,231,183,0.35)' },
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
        border: `1px solid ${style.border}`,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: style.dot }} />
      {status.replace(/_/g, ' ')}
    </motion.span>
  );
}
