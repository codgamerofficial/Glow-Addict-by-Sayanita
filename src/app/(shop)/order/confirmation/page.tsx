'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Smartphone, Copy, Check, PartyPopper, ArrowRight } from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import { MANUAL_PAYMENT_NOTE, UPI_ID, UPI_QR_URL } from '@/lib/commerce';
import PolicyNotice from '@/components/shared/PolicyNotice';

function OrderConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  const paymentMethod = searchParams.get('payment') as 'upi' || 'upi';
  const [upiCopied, setUpiCopied] = useState(false);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
    }
  }, [orderId, router]);

  const handleCopyUPI = async () => {
    await navigator.clipboard.writeText(UPI_ID);
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2000);
  };

  if (!orderId) {
    return (
      <div className="container-main" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2 style={{ fontFamily: 'Outfit', fontSize: '24px', marginBottom: '16px' }}>Order not found</h2>
        <Link href="/products" className="btn-gradient" style={{ textDecoration: 'none', padding: '12px 24px' }}>
          <span>Continue Shopping</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-main" style={{ padding: '24px 16px', maxWidth: '700px' }}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 10, stiffness: 200 }}
        style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}
      >
        <CheckCircle size={40} style={{ color: 'var(--success)' }} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ fontFamily: 'Outfit', fontSize: '32px', fontWeight: 700, textAlign: 'center', marginBottom: '8px' }}
      >
        Order Confirmed! <PartyPopper size={28} style={{ display: 'inline', verticalAlign: 'middle' }} />
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '16px', marginBottom: '32px' }}
      >
        Thank you for your order! Your order number is:
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card"
        style={{ padding: '24px', textAlign: 'center', marginBottom: '24px' }}
      >
        <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>Order Number</div>
        <div style={{ fontFamily: 'Outfit', fontSize: '28px', fontWeight: 700, color: 'var(--primary)', letterSpacing: '2px' }}>
          {orderId}
        </div>
      </motion.div>

      {paymentMethod === 'upi' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card"
          style={{ padding: '24px', marginBottom: '24px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <Smartphone size={20} style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, margin: 0 }}>
              Complete Your UPI Payment
            </h3>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{
              background: 'var(--bg-glass)', borderRadius: '16px', padding: '20px',
              border: '1px solid var(--border-glass)', display: 'inline-block'
            }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '12px' }}>Scan to Pay</div>
              <div style={{ width: '200px', height: '200px', position: 'relative', margin: '0 auto' }}>
                <Image
                  src={UPI_QR_URL}
                  alt="UPI QR Code"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>UPI ID</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={UPI_ID}
                readOnly
                className="input-glass"
                style={{ flex: 1, color: 'var(--text-secondary)', fontSize: '14px' }}
              />
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleCopyUPI}
                style={{
                  padding: '0 16px', borderRadius: '10px', border: '1.5px solid var(--border-glass)',
                  background: 'var(--bg-glass)', color: 'var(--text-secondary)', fontSize: '13px',
                  display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'
                }}
              >
                {upiCopied ? <Check size={16} style={{ color: 'var(--success)' }} /> : <Copy size={16} />}
                {upiCopied ? 'Copied!' : 'Copy'}
              </motion.button>
            </div>
          </div>

          <div style={{
            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: '10px', padding: '12px', fontSize: '13px', color: '#F59E0B'
          }}>
            <strong>Next steps:</strong>
            <ol style={{ margin: '8px 0 0', paddingLeft: '20px' }}>
              <li>Complete payment using any UPI app</li>
              <li>Your order will be verified within 24 hours</li>
              <li>You&apos;ll receive shipping confirmation via email</li>
            </ol>
            <div style={{ marginTop: '10px' }}>{MANUAL_PAYMENT_NOTE}</div>
          </div>
        </motion.div>
      )}

      <div style={{ marginBottom: '18px' }}>
        <PolicyNotice compact />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}
      >
        <Link href="/track-order" className="btn-outline" style={{ textDecoration: 'none', padding: '14px 24px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          Track Order <ArrowRight size={16} />
        </Link>
        <Link href="/products" className="btn-gradient" style={{ textDecoration: 'none', padding: '14px 24px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <span>Continue Shopping</span> <ArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <PageTransition>
      <Suspense fallback={
        <div className="container-main" style={{ textAlign: 'center', padding: '80px 20px' }}>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '24px', marginBottom: '16px' }}>Loading...</h2>
        </div>
      }>
        <OrderConfirmationContent />
      </Suspense>
    </PageTransition>
  );
}
