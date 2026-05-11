'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Package,
  Truck,
  CheckCircle,
  MapPin,
  CreditCard,
  ChevronLeft,
  RefreshCw,
  ShoppingBag,
  Lock,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PageTransition from '@/components/shared/PageTransition';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  total: number;
}

interface ShippingAddress {
  fullName: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  country?: string;
}

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal?: number;
  shippingFee?: number;
  tax?: number;
  discount?: number;
  paymentMethod?: string;
  paymentStatus?: string;
  createdAt: string;
  trackingNumber?: string;
  items: OrderItem[];
  shippingAddress?: ShippingAddress;
  statusHistory?: { status: string; timestamp: string }[];
}

interface OrderApiResponse {
  order: {
    id: string;
    orderNumber: string;
    status: string;
    itemsCount: number;
    total: number;
    created_at: string;
    shipping_address?: ShippingAddress;
  };
  steps: { label: string; done: boolean }[];
}

const statusColors: Record<string, string> = {
  pending: 'var(--primary)',
  confirmed: 'var(--accent-gold)',
  processing: 'var(--primary)',
  packed: '#8B5CF6',
  shipped: 'var(--accent-gold)',
  delivered: 'var(--success)',
  cancelled: 'var(--error)',
  returned: 'var(--warning)',
  refund: 'var(--warning)',
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  packed: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
  refund: 'Refund',
};

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [steps, setSteps] = useState<{ label: string; done: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error('Order not found');
        throw new Error('Failed to fetch order details');
      }
      const data: OrderApiResponse = await res.json();

      const apiOrder = data.order;
      const orderDate = new Date(apiOrder.created_at);

      const orderDetails: OrderDetails = {
        id: apiOrder.id,
        orderNumber: apiOrder.orderNumber,
        status: apiOrder.status,
        total: apiOrder.total,
        subtotal: apiOrder.total,
        shippingFee: 0,
        tax: 0,
        discount: 0,
        paymentMethod: 'COD',
        paymentStatus: 'paid',
        createdAt: orderDate.toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        items: [],
        shippingAddress: apiOrder.shipping_address,
        statusHistory: [],
      };

      setOrder(orderDetails);
      setSteps(data.steps || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  /* Loading Skeleton */
  if (loading) {
    return (
      <PageTransition>
        <div className="container-main p-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="skeleton w-10 h-10 rounded-full" />
            <div className="skeleton w-32 h-6 rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-card p-4">
                <div className="skeleton w-24 h-4 mb-2 rounded" />
                <div className="skeleton w-3/4 h-6 rounded" />
              </div>
            ))}
          </div>
          <div className="glass-card p-5 mb-6">
            <div className="skeleton w-32 h-5 mb-4 rounded" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3">
                <div className="skeleton w-16 h-16 rounded-lg shrink-0" />
                <div className="flex-1">
                  <div className="skeleton w-3/4 h-4 mb-2 rounded" />
                  <div className="skeleton w-1/4 h-3 rounded" />
                </div>
                <div className="skeleton w-16 h-5 rounded" />
              </div>
            ))}
          </div>
          <div className="glass-card p-5 mb-6">
            <div className="skeleton w-28 h-5 mb-4 rounded" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between py-2">
                <div className="skeleton w-20 h-4 rounded" />
                <div className="skeleton w-16 h-4 rounded" />
              </div>
            ))}
          </div>
          <div className="glass-card p-5 mb-6">
            <div className="skeleton w-24 h-5 mb-3 rounded" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton w-full h-3 mb-2 rounded" />
            ))}
          </div>
          <div className="glass-card p-5">
            <div className="skeleton w-32 h-5 mb-4 rounded" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className="skeleton w-7 h-7 rounded-full shrink-0" />
                <div className="skeleton w-28 h-4 rounded" />
              </div>
            ))}
          </div>
        </div>
      </PageTransition>
    );
  }

  /* Error State */
  if (error) {
    return (
      <PageTransition>
        <div className="container-main p-6 flex flex-col items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="font-outfit text-2xl font-bold mb-2">
              {error === 'Order not found' ? 'Order Not Found' : 'Something Went Wrong'}
            </h2>
            <p className="text-[var(--text-muted)] mb-6">
              {error === 'Order not found'
                ? 'We could not find an order matching this ID. Please double-check the order number.'
                : 'There was an issue loading your order details. Please try again.'}
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => fetchOrder()}
              className="btn-outline inline-flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Retry
            </motion.button>
            <div className="mt-4 flex gap-3 justify-center">
              <Link href="/profile" className="text-[var(--primary)] text-sm no-underline hover:underline">
                Back to Profile
              </Link>
              <span className="text-[var(--text-muted)] text-sm">·</span>
              <Link href="/track-order" className="text-[var(--primary)] text-sm no-underline hover:underline">
                Track Another Order
              </Link>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  if (!order) return null;

  const isCancelled = order.status.toLowerCase() === 'cancelled';
  const isReturned = order.status.toLowerCase() === 'returned';

  return (
    <PageTransition>
      <div className="container-main p-4 md:p-6 animate-fade-in">
        {/* Back */}
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 text-[var(--text-muted)] text-sm mb-5 no-underline hover:text-[var(--primary)] transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Profile
        </Link>

        {/* Order Number & Status */}
        <div className="glass-card p-5 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="font-outfit text-xl font-bold mb-1">
                Order <span className="gradient-text">#{order.orderNumber}</span>
              </h1>
              <p className="text-[13px] text-[var(--text-muted)]">
                Placed on {order.createdAt}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isCancelled && <XCircle size={20} className="text-[var(--error)]" />}
              {isReturned && <Package size={20} className="text-[var(--warning)]" />}
              {!isCancelled && !isReturned && <Package size={20} className="text-[var(--primary)]" />}
              <span
                className="badge text-[12px]"
                style={{
                  background: `${statusColors[order.status.toLowerCase()] || 'var(--primary)'}20`,
                  color: statusColors[order.status.toLowerCase()] || 'var(--primary)',
                }}
              >
                {statusLabels[order.status.toLowerCase()] || order.status}
              </span>
            </div>
          </div>

          {(isCancelled || isReturned) && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-lg bg-red-500/5 border border-red-500/15 text-center"
            >
              <p className="text-sm text-red-400">
                {isCancelled
                  ? 'This order has been cancelled. If you believe this is an error, please contact support.'
                  : 'This order has been returned. Please contact support for refund details.'}
              </p>
            </motion.div>
          )}
        </div>

        {/* Tracking Timeline */}
        {!isCancelled && !isReturned && steps.length > 0 && (
          <div className="glass-card p-5 mb-5">
            <h3 className="font-outfit text-sm font-semibold mb-4 flex items-center gap-2 uppercase tracking-wide">
              <Truck size={16} />
              Order Tracking
            </h3>
            <div className="flex flex-col gap-0">
              {steps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-3 py-2.5 relative">
                  <div
                    className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center ${
                      step.done
                        ? 'bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]'
                        : 'bg-[var(--bg-glass)] border-2 border-[var(--border-glass)]'
                    }`}
                  >
                    {step.done ? (
                      <CheckCircle size={14} color="white" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-[var(--text-muted)]" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      step.done ? 'font-medium text-[var(--text-primary)]' : 'font-normal text-[var(--text-muted)]'
                    }`}
                  >
                    {step.label}
                  </span>
                  {i < steps.length - 1 && (
                    <div
                      className={`absolute left-[13px] top-[36px] w-0.5 h-5 ${
                        step.done ? 'bg-[var(--primary)]' : 'bg-[var(--border-glass)]'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="glass-card p-5 mb-5">
          <h3 className="font-outfit text-sm font-semibold mb-4 flex items-center gap-2 uppercase tracking-wide">
            <Package size={16} />
            Order Items ({order.items.length})
          </h3>

          {order.items.length > 0 ? (
            <div className="flex flex-col gap-3">
              {order.items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 p-3 rounded-xl bg-[var(--bg-surface)]"
                >
                  {item.productImage ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 product-image-wrap">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-[var(--bg-glass)] shrink-0 flex items-center justify-center">
                      <ShoppingBag size={20} className="text-[var(--text-muted)]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.productName}</p>
                    <p className="text-[12px] text-[var(--text-muted)]">
                      Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-[var(--primary)]">
                      ₹{item.total.toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-[var(--text-muted)]">
              <ShoppingBag size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No items found in this order.</p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="glass-card p-5 mb-5">
          <h3 className="font-outfit text-sm font-semibold mb-4 uppercase tracking-wide">
            Order Summary
          </h3>
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-[var(--text-secondary)]">Subtotal</span>
              <span className="text-[14px] font-medium">
                ₹{(order.subtotal ?? order.total).toLocaleString()}
              </span>
            </div>
            {order.discount && order.discount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-[var(--text-secondary)]">Discount</span>
                <span className="text-[14px] font-medium text-[var(--success)]">
                  -₹{order.discount.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-[var(--text-secondary)]">Shipping</span>
              <span className="text-[14px] font-medium">
                {order.shippingFee && order.shippingFee > 0
                  ? `₹${order.shippingFee.toLocaleString()}`
                  : 'Free'}
              </span>
            </div>
            {order.tax && order.tax > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-[14px] text-[var(--text-secondary)]">Tax (GST)</span>
                <span className="text-[14px] font-medium">
                  ₹{order.tax.toLocaleString()}
                </span>
              </div>
            )}
            <div className="border-t border-[var(--border-glass)] pt-3 mt-1 flex justify-between items-center">
              <span className="text-[15px] font-bold">Total</span>
              <span className="text-[15px] font-bold gradient-text">
                ₹{order.total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Address & Payment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <div className="glass-card p-5">
            <h3 className="font-outfit text-sm font-semibold mb-3 flex items-center gap-2 uppercase tracking-wide">
              <MapPin size={16} />
              Shipping Address
            </h3>
            {order.shippingAddress ? (
              <div className="space-y-1 text-sm">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-[var(--text-secondary)]">
                  {order.shippingAddress.line1}
                </p>
                <p className="text-[var(--text-secondary)]">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.pincode}
                </p>
                {order.shippingAddress.country && (
                  <p className="text-[var(--text-secondary)]">
                    {order.shippingAddress.country}
                  </p>
                )}
                <p className="text-[var(--text-secondary)] mt-1 flex items-center gap-1.5">
                  <PhoneIcon />
                  {order.shippingAddress.phone}
                </p>
              </div>
            ) : (
              <p className="text-[var(--text-muted)] text-sm">Address not available</p>
            )}
          </div>

          <div className="glass-card p-5">
            <h3 className="font-outfit text-sm font-semibold mb-3 flex items-center gap-2 uppercase tracking-wide">
              <CreditCard size={16} />
              Payment Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Payment Method</span>
                <span className="flex items-center gap-1.5 font-medium">
                  {order.paymentMethod === 'COD' || !order.paymentMethod ? (
                    <>
                      <Lock size={14} />
                      Cash on Delivery
                    </>
                  ) : (
                    <>
                      <CreditCard size={14} />
                      {order.paymentMethod}
                    </>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Payment Status</span>
                <span
                  className={`text-sm font-medium ${
                    order.paymentStatus === 'paid'
                      ? 'text-[var(--success)]'
                      : 'text-[var(--accent-gold)]'
                  }`}
                >
                  {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </div>
              {order.trackingNumber && (
                <div className="flex justify-between items-center">
                  <span className="text-[var(--text-secondary)]">Tracking Number</span>
                  <span className="font-medium text-sm">{order.trackingNumber}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-[var(--border-glass)]">
                <span className="text-[12px] text-[var(--text-muted)]">Order ID</span>
                <span className="text-[12px] text-[var(--text-muted)] font-mono">
                  {order.id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link
            href="/track-order"
            className="btn-outline text-center no-underline flex items-center justify-center gap-2 py-3"
          >
            <Truck size={16} />
            Track Another Order
          </Link>
          <Link
            href="/profile#orders"
            className="btn-gradient text-center no-underline flex items-center justify-center gap-2 py-3"
          >
            <ShoppingBag size={16} />
            View All Orders
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[var(--text-muted)]"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}