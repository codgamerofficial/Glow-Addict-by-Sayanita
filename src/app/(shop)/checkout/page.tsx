'use client';
import { useState, useEffect, useCallback } from 'react';
import { CreditCard, Smartphone, Banknote, Wallet, Shield, Check, ArrowLeft, PartyPopper } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/features/cart/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/shared/PageTransition';
import { placeOrder as placeOrderAction } from '@/actions/shop';

const paymentMethods = [
  { id: 'upi', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm', icon: Smartphone },
  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Rupay', icon: CreditCard },
  { id: 'wallet', label: 'Wallet', desc: 'Paytm, Amazon Pay', icon: Wallet },
  { id: 'cod', label: 'Cash on Delivery', desc: '₹30 COD charges apply', icon: Banknote },
];

import Image from 'next/image';

/* ============ CONFETTI COMPONENT ============ */
function Confetti() {
  const [particles] = useState<Array<{ id: number; x: number; color: string; delay: number; size: number; rotate: number; duration: number }>>(() => 
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ['#E91E8C', '#7C3AED', '#F59E0B', '#10B981', '#3B82F6', '#EC4899'][Math.floor(Math.random() * 6)],
      delay: Math.random() * 0.5,
      size: 6 + Math.random() * 8,
      rotate: 720 + Math.random() * 360,
      duration: 2.5 + Math.random() * 2,
    }))
  );

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 200, overflow: 'hidden' }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: 0, rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: p.size > 10 ? '2px' : '50%',
            background: p.color,
          }}
        />
      ))}
    </div>
  );
}

/* ============ STEP TRANSITION ============ */
const stepVariants = {
  enter: { x: 30, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -30, opacity: 0 },
};

export default function CheckoutPage() {
  const { items, getSubtotal, getTotal, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState('upi');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);
  const [address, setAddress] = useState({
    fullName: 'Sayanita',
    phone: '+91 98765 43210',
    email: 'sayanita@email.com',
    line1: '123, MG Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    country: 'India'
  });

  const subtotal = getSubtotal();
  const total = getTotal();

  const handlePlaceOrder = useCallback(async () => {
    setIsPlacing(true);
    try {
      const res = await placeOrderAction({
        items,
        subtotal,
        total,
        paymentMethod: payment,
        shippingAddress: address
      });
      
      if (res.success) {
        setOrderId(res.orderId);
        setOrderPlaced(true);
        clearCart();
      }
    } catch (err) {
      console.error('Failed to place order:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsPlacing(false);
    }
  }, [items, subtotal, total, payment, address, clearCart]);

  if (orderPlaced) {
    return (
      <PageTransition>
        <Confetti />
        <div className="container-main" style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ position: 'relative', height: '56px', width: '200px', margin: '0 auto 20px' }}>
            <Image
              src="/images/logo.png" 
              alt="Glow Addict"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.3 }}
            style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <Check size={40} style={{ color: 'var(--success)' }} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: 'Outfit', fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}
          >
            Order Placed! <PartyPopper size={24} style={{ display: 'inline' }} />
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '16px' }}
          >
            Your order #{orderId} has been confirmed
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{ color: 'var(--text-muted)', marginBottom: '32px' }}
          >
            You&apos;ll receive a confirmation email shortly
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}
          >
            <Link href="/track-order" className="btn-outline" style={{ textDecoration: 'none', padding: '12px 24px' }}>Track Order</Link>
            <Link href="/products" className="btn-gradient" style={{ textDecoration: 'none', padding: '12px 24px' }}><span>Continue Shopping</span></Link>
          </motion.div>
        </div>
      </PageTransition>
    );
  }

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="container-main" style={{ textAlign: 'center', padding: '80px 20px' }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '24px', marginBottom: '16px' }}>No items to checkout</h2>
          <Link href="/products" className="btn-gradient" style={{ textDecoration: 'none', padding: '12px 24px' }}><span>Shop Now</span></Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container-main" style={{ padding: '24px 16px', maxWidth: '900px' }}>
        <Link href="/cart" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', marginBottom: '20px' }}>
          <ArrowLeft size={16} /> Back to Cart
        </Link>
        <h1 style={{ fontFamily: 'Outfit', fontSize: '28px', fontWeight: 700, marginBottom: '24px' }}>Checkout</h1>

        {/* Animated step indicator */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '32px' }}>
          {['Address', 'Payment', 'Review'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <motion.div
                  animate={{
                    background: step > i + 1 ? 'var(--success)' : step === i + 1 ? 'var(--primary)' : 'var(--bg-glass)',
                    scale: step === i + 1 ? 1.1 : 1,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{
                    width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: step >= i + 1 ? 'white' : 'var(--text-muted)', fontSize: '12px', fontWeight: 600,
                  }}
                >
                  {step > i + 1 ? <Check size={14} /> : i + 1}
                </motion.div>
                <span style={{ fontSize: '13px', fontWeight: step === i + 1 ? 600 : 400, color: step === i + 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}>{s}</span>
              </div>
              {i < 2 && (
                <motion.div
                  animate={{ background: step > i + 1 ? 'var(--success)' : 'var(--border-glass)' }}
                  style={{ flex: 1, height: '2px', margin: '0 12px', borderRadius: '1px' }}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1 - Address */}
          {step === 1 && (
            <motion.div key="address" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Shipping Address</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input className="input-glass" placeholder="Full Name" defaultValue="Sayanita" style={{ gridColumn: 'span 2' }} />
                <input className="input-glass" placeholder="Phone Number" defaultValue="+91 98765 43210" />
                <input className="input-glass" placeholder="Email" defaultValue="sayanita@email.com" />
                <input className="input-glass" placeholder="Address Line 1" defaultValue="123, MG Road" style={{ gridColumn: 'span 2' }} />
                <input className="input-glass" placeholder="City" defaultValue="Bangalore" />
                <input className="input-glass" placeholder="State" defaultValue="Karnataka" />
                <input className="input-glass" placeholder="Pincode" defaultValue="560001" />
                <input className="input-glass" placeholder="Country" defaultValue="India" />
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(2)} className="btn-gradient" style={{ marginTop: '20px', width: '100%', padding: '14px', fontSize: '15px' }}>
                <span>Continue to Payment</span>
              </motion.button>
            </motion.div>
          )}

          {/* Step 2 - Payment */}
          {step === 2 && (
            <motion.div key="payment" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Payment Method</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {paymentMethods.map(pm => {
                  const Icon = pm.icon;
                  return (
                    <motion.button
                      key={pm.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPayment(pm.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '14px', padding: '16px',
                        background: payment === pm.id ? 'rgba(233,30,140,0.08)' : 'var(--bg-glass)',
                        border: `1.5px solid ${payment === pm.id ? 'var(--primary)' : 'var(--border-glass)'}`,
                        borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%',
                      }}
                    >
                      <Icon size={22} style={{ color: payment === pm.id ? 'var(--primary)' : 'var(--text-muted)' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{pm.label}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pm.desc}</div>
                      </div>
                      <motion.div
                        animate={{ scale: payment === pm.id ? 1 : 0.8, borderColor: payment === pm.id ? 'var(--primary)' : 'var(--border-glass)' }}
                        style={{
                          width: '18px', height: '18px', borderRadius: '50%',
                          border: '2px solid',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <AnimatePresence>
                          {payment === pm.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}
                            />
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.button>
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(1)} className="btn-outline" style={{ padding: '14px 24px' }}>Back</motion.button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(3)} className="btn-gradient" style={{ flex: 1, padding: '14px', fontSize: '15px' }}><span>Review Order</span></motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3 - Review */}
          {step === 3 && (
            <motion.div key="review" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }} className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Order Review</h3>
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-glass)' }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
                    <Image 
                      src={item.product.images[0]} 
                      alt={item.product.name} 
                      fill
                      style={{ objectFit: 'cover' }} 
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{item.product.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>₹{((item.product.salePrice || item.product.price) * item.quantity).toLocaleString()}</div>
                </motion.div>
              ))}
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span><span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Shipping</span><span style={{ color: 'var(--success)' }}>FREE</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontFamily: 'Outfit', fontWeight: 700, fontSize: '18px' }}>
                  <span>Total</span><span className="gradient-text">₹{total.toLocaleString()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '16px 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                <Shield size={14} style={{ color: 'var(--success)' }} /> Your payment is secured with 256-bit encryption
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(2)} className="btn-outline" style={{ padding: '14px 24px' }} disabled={isPlacing}>Back</motion.button>
                <motion.button 
                  whileTap={{ scale: 0.97 }} 
                  onClick={handlePlaceOrder} 
                  className="btn-gradient" 
                  style={{ flex: 1, padding: '14px', fontSize: '15px' }}
                  disabled={isPlacing}
                >
                  <span>{isPlacing ? 'Processing...' : `Place Order — ₹${total.toLocaleString()}`}</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
