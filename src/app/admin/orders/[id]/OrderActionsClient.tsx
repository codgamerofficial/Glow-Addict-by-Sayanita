'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/admin/shared/Button';
import { saveTrackingNumber, updateOrderStatus, verifyPayment } from '@/actions/admin';

interface OrderActionsClientProps {
  orderId: string;
  status: string;
  paymentMethod: 'upi' | 'cod';
  paymentStatus: 'pending' | 'verified' | 'failed';
}

export default function OrderActionsClient({ orderId, status, paymentMethod, paymentStatus }: OrderActionsClientProps) {
  const router = useRouter();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isPending, startTransition] = useTransition();

  const runAction = (action: () => Promise<unknown>) => {
    startTransition(async () => {
      await action();
      router.refresh();
    });
  };

  return (
    <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap', flexDirection: 'column' }}>
      {paymentMethod === 'upi' && paymentStatus === 'pending' && (
        <Button onClick={() => runAction(() => verifyPayment(orderId))} disabled={isPending}>
          Verify Payment
        </Button>
      )}

      {!['delivered', 'cancelled'].includes(status) && (
        <Button
          onClick={() => runAction(() => updateOrderStatus(orderId, 'confirmed'))}
          variant={status === 'pending_payment' ? 'outline' : 'default'}
          disabled={isPending}
        >
          Mark as Confirmed
        </Button>
      )}

      {['confirmed', 'processing', 'packed'].includes(status) && (
        <div style={{ display: 'grid', gap: 10 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              value={trackingNumber}
              onChange={(event) => setTrackingNumber(event.target.value)}
              placeholder="Tracking number"
              className="input-glass"
              style={{ minWidth: 220 }}
            />
            <Button
              onClick={() => runAction(() => saveTrackingNumber(orderId, trackingNumber))}
              disabled={isPending || !trackingNumber.trim()}
            >
              Mark as Shipped
            </Button>
          </div>
          <Button onClick={() => runAction(() => updateOrderStatus(orderId, 'delivered'))} variant="success" disabled={isPending}>
            Mark as Delivered
          </Button>
        </div>
      )}

      {['confirmed', 'processing', 'packed', 'shipped'].includes(status) && (
        <Button onClick={() => runAction(() => updateOrderStatus(orderId, 'cancelled'))} variant="destructive" disabled={isPending}>
          Cancel Order
        </Button>
      )}
    </div>
  );
}
