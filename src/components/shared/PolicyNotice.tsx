import { AlertTriangle, BadgeCheck, CreditCard } from 'lucide-react';
import { PAYMENT_POLICY } from '@/lib/commerce';

interface PolicyNoticeProps {
  compact?: boolean;
}

export default function PolicyNotice({ compact = false }: PolicyNoticeProps) {
  return (
    <div
      className="glass-card"
      style={{
        padding: compact ? '12px' : '16px',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(255, 243, 244, 0.95))',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <AlertTriangle size={16} style={{ color: '#DC2626' }} />
        <strong style={{ fontSize: compact ? '12px' : '13px', color: '#7F1D1D' }}>Important Store Policies</strong>
      </div>

      <div style={{ display: 'grid', gap: '6px', fontSize: compact ? '11px' : '12px', color: '#6B1A1A' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <CreditCard size={14} />
          <span>{PAYMENT_POLICY}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <AlertTriangle size={14} />
          <span>No return, no exchange, no refund. No cancellation after order confirmation.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <BadgeCheck size={14} />
          <span>100% authentic branded products only.</span>
        </div>
      </div>
    </div>
  );
}
