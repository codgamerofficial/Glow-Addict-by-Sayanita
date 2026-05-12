"use client";

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'secondary' | 'success' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'default',
  size = 'md',
  isLoading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      background: 'rgba(233,30,140,0.15)',
      border: '1px solid #E91E8C',
      color: '#E91E8C',
    },
    outline: {
      background: 'transparent',
      border: '1px solid rgba(255,255,255,0.15)',
      color: 'var(--text-primary)',
    },
    secondary: {
      background: 'rgba(107,114,128,0.1)',
      border: '1px solid rgba(107,114,128,0.2)',
      color: 'var(--text-primary)',
    },
    success: {
      background: 'rgba(16,185,129,0.15)',
      border: '1px solid #10B981',
      color: '#10B981',
    },
    destructive: {
      background: 'rgba(239,68,68,0.15)',
      border: '1px solid #EF4444',
      color: '#EF4444',
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '6px 12px', fontSize: 12 },
    md: { padding: '10px 16px', fontSize: 14 },
    lg: { padding: '12px 20px', fontSize: 16 },
  };

  const baseStyle: React.CSSProperties = {
    borderRadius: 8,
    fontWeight: 600,
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.5 : 1,
    transition: 'all 0.2s',
    fontFamily: 'inherit',
    border: 'none',
  };

  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      style={{
        ...baseStyle,
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...props.style,
      }}
      className={className}
    >
      {isLoading ? '...' : props.children}
    </button>
  );
}
