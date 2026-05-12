import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function GlassCard({ children, className, style }: GlassCardProps) {
  return (
    <div
      className={className}
      style={{
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16,
        padding: 24,
        boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}