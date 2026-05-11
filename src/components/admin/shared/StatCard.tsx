'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Props {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: number;
  prefix?: string;
  suffix?: string;
  color?: string;
  gradient?: string;
  delay?: number;
}

export function StatCard({ icon, label, value, trend, prefix = '', suffix = '', color = '#E91E8C', gradient, delay = 0 }: Props) {
  const isPositive = (trend ?? 0) >= 0;
  
  const gradientMap: { [key: string]: string } = {
    'from-emerald-400 to-green-600': 'linear-gradient(135deg, rgba(52,211,153,0.4) 0%, rgba(34,197,94,0.4) 100%)',
    'from-blue-400 to-blue-600': 'linear-gradient(135deg, rgba(96,165,250,0.4) 0%, rgba(37,99,235,0.4) 100%)',
    'from-purple-400 to-purple-600': 'linear-gradient(135deg, rgba(192,132,250,0.4) 0%, rgba(147,51,234,0.4) 100%)',
    'from-pink-400 to-pink-600': 'linear-gradient(135deg, rgba(244,114,182,0.4) 0%, rgba(236,72,153,0.4) 100%)',
    'from-yellow-400 to-orange-600': 'linear-gradient(135deg, rgba(250,204,21,0.4) 0%, rgba(217,119,6,0.4) 100%)',
    'from-cyan-400 to-cyan-600': 'linear-gradient(135deg, rgba(34,211,238,0.4) 0%, rgba(14,165,233,0.4) 100%)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        background: gradient ? gradientMap[gradient] : 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        border: `2px solid ${color}40`,
        borderRadius: 16,
        padding: '22px 24px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      whileHover={{ y: -3, boxShadow: `0 12px 40px ${color}30` }}
    >
      {/* Glow dot */}
      <div style={{
        position: 'absolute', top: -20, right: -20, width: 80, height: 80,
        borderRadius: '50%', background: color, opacity: 0.06, filter: 'blur(20px)',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: `${color}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: color,
        }}>
          {icon}
        </div>
        {trend !== undefined && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px',
            borderRadius: 20, fontSize: 12, fontWeight: 600,
            background: isPositive ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
            color: isPositive ? '#10B981' : '#EF4444',
          }}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, fontFamily: 'Outfit', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
        {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}{suffix}
      </div>
    </motion.div>
  );
}
