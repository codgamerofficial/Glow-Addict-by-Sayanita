'use client';
import { useState } from 'react';
import { CreditCard, Smartphone, Banknote, Wallet, Shield, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/features/cart/cartStore';

const paymentMethods = [
  { id: 'upi', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm', icon: Smartphone },
  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Rupay', icon: CreditCard },
  { id: 'wallet', label: 'Wallet', desc: 'Paytm, Amazon Pay', icon: Wallet },
  { id: 'cod', label: 'Cash on Delivery', desc: '₹30 COD charges apply', icon: Banknote },
];

export default function CheckoutPage() {
  const { items, getSubtotal, getTotal, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState('upi');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const subtotal = getSubtotal();
  const total = getTotal();

  if (orderPlaced) {
    return (
      <div className="container-main animate-fade-in" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <img src="/images/logo.png" alt="Glow Addict" style={{ height: '56px', width: 'auto', objectFit: 'contain', margin: '0 auto 20px', display: 'block' }} />
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Check size={40} style={{ color: 'var(--success)' }} />
        </div>
        <h2 style={{ fontFamily: 'Outfit', fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Order Placed! 🎉</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '16px' }}>Your order #GA{Math.floor(100000 + Math.random() * 900000)} has been confirmed</p>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>You&apos;ll receive a confirmation email shortly</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/profile" className="btn-outline" style={{ textDecoration: 'none', padding: '12px 24px' }}>Track Order</Link>
          <Link href="/products" className="btn-gradient" style={{ textDecoration: 'none', padding: '12px 24px' }}><span>Continue Shopping</span></Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-main animate-fade-in" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2 style={{ fontFamily: 'Outfit', fontSize: '24px', marginBottom: '16px' }}>No items to checkout</h2>
        <Link href="/products" className="btn-gradient" style={{ textDecoration: 'none', padding: '12px 24px' }}><span>Shop Now</span></Link>
      </div>
    );
  }

  return (
    <div className="container-main animate-fade-in" style={{ padding: '24px 16px', maxWidth: '900px' }}>
      <Link href="/cart" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', marginBottom: '20px' }}>
        <ArrowLeft size={16} /> Back to Cart
      </Link>
      <h1 style={{ fontFamily: 'Outfit', fontSize: '28px', fontWeight: 700, marginBottom: '24px' }}>Checkout</h1>

      {/* Steps */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '32px' }}>
        {['Address', 'Payment', 'Review'].map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step > i + 1 ? 'var(--success)' : step === i + 1 ? 'var(--primary)' : 'var(--bg-glass)',
                color: step >= i + 1 ? 'white' : 'var(--text-muted)', fontSize: '12px', fontWeight: 600,
              }}>{step > i + 1 ? <Check size={14} /> : i + 1}</div>
              <span style={{ fontSize: '13px', fontWeight: step === i + 1 ? 600 : 400, color: step === i + 1 ? 'var(--text-primary)' : 'var(--text-muted)' }}>{s}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: '1px', background: step > i + 1 ? 'var(--success)' : 'var(--border-glass)', margin: '0 12px' }} />}
          </div>
        ))}
      </div>

      {/* Step 1 - Address */}
      {step === 1 && (
        <div className="glass-card" style={{ padding: '24px' }}>
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
          <button onClick={() => setStep(2)} className="btn-gradient" style={{ marginTop: '20px', width: '100%', padding: '14px', fontSize: '15px' }}>
            <span>Continue to Payment</span>
          </button>
        </div>
      )}

      {/* Step 2 - Payment */}
      {step === 2 && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Payment Method</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {paymentMethods.map(pm => {
              const Icon = pm.icon;
              return (
                <button key={pm.id} onClick={() => setPayment(pm.id)} style={{
                  display: 'flex', alignItems: 'center', gap: '14px', padding: '16px',
                  background: payment === pm.id ? 'rgba(233,30,140,0.08)' : 'var(--bg-glass)',
                  border: `1.5px solid ${payment === pm.id ? 'var(--primary)' : 'var(--border-glass)'}`,
                  borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left', width: '100%',
                }}>
                  <Icon size={22} style={{ color: payment === pm.id ? 'var(--primary)' : 'var(--text-muted)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{pm.label}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pm.desc}</div>
                  </div>
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    border: `2px solid ${payment === pm.id ? 'var(--primary)' : 'var(--border-glass)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {payment === pm.id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />}
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button onClick={() => setStep(1)} className="btn-outline" style={{ padding: '14px 24px' }}>Back</button>
            <button onClick={() => setStep(3)} className="btn-gradient" style={{ flex: 1, padding: '14px', fontSize: '15px' }}><span>Review Order</span></button>
          </div>
        </div>
      )}

      {/* Step 3 - Review */}
      {step === 3 && (
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Order Review</h3>
          {items.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-glass)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden' }}>
                <img src={item.product.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 500 }}>{item.product.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
              </div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>₹{((item.product.salePrice || item.product.price) * item.quantity).toLocaleString()}</div>
            </div>
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
            <button onClick={() => setStep(2)} className="btn-outline" style={{ padding: '14px 24px' }}>Back</button>
            <button onClick={() => { setOrderPlaced(true); clearCart(); }} className="btn-gradient" style={{ flex: 1, padding: '14px', fontSize: '15px' }}>
              <span>Place Order — ₹{total.toLocaleString()}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
