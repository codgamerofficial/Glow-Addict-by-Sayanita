import React from 'react';
import { getOrderById } from '@/actions/admin';
import { GlassCard } from '@/components/admin/shared/GlassCard';
import { Button } from '@/components/admin/shared/Button';
import { Image } from '@/components/admin/shared/Image';
import { formatINR } from '@/utils/format';
import Link from 'next/link';
import OrderActionsClient from './OrderActionsClient';

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await getOrderById(params.id);

  if (!order) {
    return (
      <GlassCard>
        <h2>Order not found</h2>
        <Link href="/admin/orders">
          <Button variant="secondary">Back to Orders</Button>
        </Link>
      </GlassCard>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 700 }}>
          Order #{order.orderNumber}
        </h1>
        <Link href="/admin/orders">
          <Button variant="secondary">Back to Orders</Button>
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Left Column */}
        <div>
          <GlassCard>
            <h2>Order Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
              <div>
                <h3>Order Status</h3>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 500,
                    textTransform: 'capitalize',
                    background:
                      order.status === 'confirmed'
                        ? 'rgba(16,185,129,0.1)'
                        : order.status === 'pending_payment'
                        ? 'rgba(245,158,11,0.1)'
                        : order.status === 'shipped'
                        ? 'rgba(59,130,246,0.1)'
                        : order.status === 'delivered'
                        ? 'rgba(34,197,94,0.1)'
                        : order.status === 'cancelled'
                        ? 'rgba(239,68,68,0.1)'
                        : 'rgba(107,114,128,0.1)',
                    color:
                      order.status === 'confirmed'
                        ? '#10B981'
                        : order.status === 'pending_payment'
                        ? '#F59E0B'
                        : order.status === 'shipped'
                        ? '#3B82F6'
                        : order.status === 'delivered'
                        ? '#22C55E'
                        : order.status === 'cancelled'
                        ? '#EF4444'
                        : '#6B7280',
                }}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div>
                <h3>Payment Status</h3>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 500,
                    textTransform: 'capitalize',
                    background:
                      order.paymentStatus === 'verified'
                        ? 'rgba(34,197,94,0.1)'
                        : order.paymentStatus === 'pending'
                        ? 'rgba(245,158,11,0.1)'
                        : 'rgba(239,68,68,0.1)',
                    color:
                      order.paymentStatus === 'verified'
                        ? '#22C55E'
                        : order.paymentStatus === 'pending'
                        ? '#F59E0B'
                        : '#EF4444',
                }}>
                  {order.paymentStatus.toUpperCase()}
                </span>
              </div>
              <div>
                <h3>Payment Method</h3>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 500,
                    background:
                      order.paymentMethod === 'cod'
                        ? 'rgba(245,158,11,0.1)'
                        : 'rgba(16,185,129,0.1)',
                    color:
                      order.paymentMethod === 'cod' ? '#F59E0B' : '#10B981',
                }}>
                  {order.paymentMethod === 'cod' ? 'COD' : 'UPI'}
                </span>
              </div>
              {order.codDepositAmount > 0 && (
                <div>
                  <h3>COD Deposit</h3>
                  <p>₹{formatINR(order.codDepositAmount)}</p>
                </div>
              )}
              <div>
                <h3>Order Date</h3>
                <p>{new Date(order.createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</p>
              </div>
              {order.transactionId && (
                <div>
                  <h3>Transaction ID</h3>
                  <p style={{ wordBreak: 'break-all' }}>{order.transactionId}</p>
                </div>
              )}
              {order.trackingNumber && (
                <div>
                  <h3>Tracking Number</h3>
                  <p style={{ wordBreak: 'break-all' }}>{order.trackingNumber}</p>
                </div>
              )}
            </div>
          </GlassCard>

          <GlassCard>
            <h2>Customer Information</h2>
            <div style={{ marginTop: 16 }}>
              <p>
                <strong>Name:</strong> {order.customerName || 'Guest Customer'}
              </p>
              {order.customerEmail && (
                <p>
                  <strong>Email:</strong> {order.customerEmail}
                </p>
              )}
              {order.customerPhone && (
                <p>
                  <strong>Phone:</strong> {order.customerPhone}
                </p>
              )}
              <h3>Shipping Address</h3>
              <address style={{ marginTop: 8, fontStyle: 'normal' }}>
                {order.shippingAddress?.fullName}<br />
                {order.shippingAddress?.line1}<br />
                {order.shippingAddress?.line2 && (
                  <>
                    {order.shippingAddress.line2}<br />
                  </>
                )}
                {order.shippingAddress?.city}, {order.shippingAddress?.state} -
                {order.shippingAddress?.pincode}<br />
                {order.shippingAddress?.country}
              </address>
            </div>
          </GlassCard>
        </div>

        {/* Right Column */}
        <div>
          <GlassCard>
            <h2>Order Items</h2>
            <div style={{ marginTop: 16 }}>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'start',
                    gap: 12,
                    marginBottom: 16,
                    paddingBottom: 16,
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    style={{ objectFit: 'cover', borderRadius: 8 }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3>{item.product.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                      Quantity: {item.quantity}
                    </p>
                    <p style={{ fontWeight: 600, marginTop: 4 }}>
                      ₹{formatINR(item.total)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <h2>Order Summary</h2>
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Subtotal</span>
                <span>₹{formatINR(order.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Shipping Fee</span>
                <span>₹{formatINR(order.shippingFee)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Tax</span>
                <span>₹{formatINR(order.tax)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                <span>Total</span>
                <span>₹{formatINR(order.total)}</span>
              </div>
            </div>
          </GlassCard>

          {order.paymentMethod === 'upi' && order.paymentStatus === 'pending' && (
            <GlassCard>
              <h2>Payment Verification</h2>
              <div style={{ marginTop: 16 }}>
                <p>
                  Please verify the UPI payment screenshot below. Once verified, the
                  order status will be updated to 'Confirmed'.
                </p>
                {order.screenshotUrl && (
                  <div style={{ marginTop: 16, textAlign: 'center' }}>
                    <Image
                      src={order.screenshotUrl}
                      alt="Payment screenshot"
                      width={200}
                      height={200}
                      style={{ borderRadius: 8, cursor: 'pointer' }}
                      onClick={() => {
                        // In a real app, you might open a modal or lightbox
                        window.open(order.screenshotUrl, '_blank');
                      }}
                    />
                    <p style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                      Click to enlarge
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>
          )}

          <GlassCard>
            <h2>Order Actions</h2>
            <OrderActionsClient
              orderId={order.id}
              status={order.status}
              paymentMethod={order.paymentMethod}
              paymentStatus={order.paymentStatus}
            />
          </GlassCard>
        </div>
      </div>
    </>
  );
}