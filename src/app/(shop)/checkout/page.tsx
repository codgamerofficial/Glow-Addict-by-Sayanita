'use client';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Smartphone, Shield, Check, ArrowLeft, Copy, CheckCircle, Upload, X, Gift } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/features/cart/cartStore';
import { useAuthStore } from '@/features/auth/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/shared/PageTransition';
import { ShippingAddress } from '@/types/order';
import { DELIVERY_WINDOW_DAYS, getEligibleFreebies, MANUAL_PAYMENT_NOTE, PAYMENT_POLICY, UPI_ID, UPI_QR_URL } from '@/lib/commerce';
import PolicyNotice from '@/components/shared/PolicyNotice';

const paymentMethods = [
  { id: 'upi', label: 'UPI', desc: 'Manual scan-and-pay only', icon: Smartphone },
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
   const router = useRouter();
   const { isAuthenticated, isInitialized } = useAuthStore();
   const { items, getSubtotal, getTotal, getShipping, clearCart } = useCartStore();
   const [step, setStep] = useState(1);
  const [payment, setPayment] = useState<'upi'>('upi');
   const [isPlacing, setIsPlacing] = useState(false);
   const [upiCopied, setUpiCopied] = useState(false);
   const [transactionId, setTransactionId] = useState('');
   const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
   const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const [address, setAddress] = useState<ShippingAddress>({
     fullName: '',
     phone: '',
     email: '',
     line1: '',
     line2: '',
     city: '',
     state: '',
     pincode: '',
     country: 'India'
   });

   const subtotal = getSubtotal();
   const shipping = getShipping();
   const total = getTotal();
   const freebies = useMemo(() => getEligibleFreebies(subtotal), [subtotal]);

   useEffect(() => {
     if (isInitialized && !isAuthenticated) {
       router.push('/login?redirect=/checkout');
     }
   }, [isInitialized, isAuthenticated, router]);

   const handleCopyUPI = async () => {
     await navigator.clipboard.writeText(UPI_ID);
     setUpiCopied(true);
     setTimeout(() => setUpiCopied(false), 2000);
   };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setScreenshotFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setScreenshotPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleContinueToPayment = () => {
      const required = ['fullName', 'phone', 'line1', 'city', 'state', 'pincode', 'country'] as const;
      const missing = required.filter(key => !address[key]?.trim());
      if (missing.length > 0) {
        alert('Please fill in all required fields');
        return;
      }
      setStep(2);
    };

    const handlePlaceOrder = useCallback(async () => {
     setIsPlacing(true);
     try {
       const shippingAddress = address;

       let screenshotUrl: string | undefined;
       if (screenshotPreview) {
         // In production, upload to S3/Supabase storage and get URL
         screenshotUrl = screenshotPreview;
       }

       const res = await fetch('/api/orders', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
           items: items.map(item => ({
             id: item.id,
             product: {
               id: item.product.id,
               name: item.product.name,
               images: item.product.images,
               price: item.product.price,
               salePrice: item.product.salePrice,
             },
             quantity: item.quantity,
           })),
           subtotal,
           total,
           shippingFee: shipping,
           paymentMethod: payment,
           transactionId: transactionId || undefined,
           screenshotUrl: screenshotUrl,
           shippingAddress,
         }),
       });

       const data = await res.json();

       if (data.success) {
         clearCart();
         // Redirect to confirmation page
         router.push(`/order/confirmation?orderId=${data.orderId}&payment=${payment}`);
       } else {
         alert(data.error || 'Failed to place order');
       }
     } catch (err) {
       console.error('Failed to place order:', err);
       alert('Failed to place order. Please try again.');
     } finally {
       setIsPlacing(false);
     }
  }, [items, subtotal, total, shipping, payment, transactionId, screenshotPreview, address, clearCart, router]);

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
                 <input
                   className="input-glass"
                   placeholder="Full Name *"
                   value={address.fullName}
                   onChange={(e) => setAddress({...address, fullName: e.target.value})}
                   style={{ gridColumn: 'span 2' }}
                   required
                 />
                 <input
                   className="input-glass"
                   placeholder="Phone Number *"
                   value={address.phone}
                   onChange={(e) => setAddress({...address, phone: e.target.value})}
                   required
                 />
                 <input
                   className="input-glass"
                   placeholder="Email"
                   value={address.email}
                   onChange={(e) => setAddress({...address, email: e.target.value})}
                 />
                 <input
                   className="input-glass"
                   placeholder="Address Line 1 *"
                   value={address.line1}
                   onChange={(e) => setAddress({...address, line1: e.target.value})}
                   style={{ gridColumn: 'span 2' }}
                   required
                 />
                 <input
                   className="input-glass"
                   placeholder="Address Line 2"
                   value={address.line2}
                   onChange={(e) => setAddress({...address, line2: e.target.value})}
                   style={{ gridColumn: 'span 2' }}
                 />
                 <input
                   className="input-glass"
                   placeholder="City *"
                   value={address.city}
                   onChange={(e) => setAddress({...address, city: e.target.value})}
                   required
                 />
                 <input
                   className="input-glass"
                   placeholder="State *"
                   value={address.state}
                   onChange={(e) => setAddress({...address, state: e.target.value})}
                   required
                 />
                 <input
                   className="input-glass"
                   placeholder="Pincode *"
                   value={address.pincode}
                   onChange={(e) => setAddress({...address, pincode: e.target.value})}
                   required
                 />
                 <input
                   className="input-glass"
                   placeholder="Country *"
                   value={address.country}
                   onChange={(e) => setAddress({...address, country: e.target.value})}
                   required
                  />
                 </div>
               <motion.button whileTap={{ scale: 0.97 }} onClick={handleContinueToPayment} className="btn-gradient" style={{ marginTop: '20px', width: '100%', padding: '14px', fontSize: '15px' }}>
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
                       onClick={() => setPayment(pm.id as 'upi')}
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

               {/* UPI specific fields */}
               {payment === 'upi' && (
                 <motion.div
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-glass)' }}
                 >
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
                      <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>{'Manual UPI only, no gateway integration'}</div>
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
                         {upiCopied ? <CheckCircle size={16} style={{ color: 'var(--success)' }} /> : <Copy size={16} />}
                         {upiCopied ? 'Copied!' : 'Copy'}
                       </motion.button>
                     </div>
                   </div>

                   <div style={{ marginBottom: '16px' }}>
                     <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Transaction ID (Optional)</label>
                     <input
                       type="text"
                       value={transactionId}
                       onChange={(e) => setTransactionId(e.target.value)}
                       placeholder="Enter UPI transaction ID"
                       className="input-glass"
                       style={{ width: '100%', fontSize: '14px' }}
                     />
                   </div>

                   <div style={{ marginBottom: '16px' }}>
                     <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Payment Screenshot (Required)</label>
                     <input
                       type="file"
                       ref={fileInputRef}
                       onChange={handleFileChange}
                       accept="image/*"
                       style={{ display: 'none' }}
                     />
                     {!screenshotPreview ? (
                       <motion.button
                         whileTap={{ scale: 0.97 }}
                         onClick={() => fileInputRef.current?.click()}
                         style={{
                           width: '100%', padding: '32px', borderRadius: '12px',
                           border: '2px dashed var(--border-glass)',
                           background: 'var(--bg-glass)', color: 'var(--text-secondary)',
                           fontSize: '14px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
                         }}
                       >
                         <Upload size={24} />
                         <span>Upload Payment Screenshot</span>
                       </motion.button>
                     ) : (
                       <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden' }}>
                         <img src={screenshotPreview} alt="Screenshot preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                         <button
                           onClick={() => { setScreenshotPreview(null); setScreenshotFile(null); }}
                           style={{
                             position: 'absolute', top: '8px', right: '8px',
                             width: '28px', height: '28px', borderRadius: '50%',
                             background: 'rgba(0,0,0,0.6)', border: 'none',
                             color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                           }}
                         >
                           <X size={16} />
                         </button>
                       </div>
                     )}
                   </div>

                   <div style={{
                     background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                     borderRadius: '10px', padding: '12px', fontSize: '12px', color: '#F59E0B'
                   }}>
                     <strong>Note:</strong> {MANUAL_PAYMENT_NOTE}
                   </div>

                   <div style={{ marginTop: '12px' }}>
                     <PolicyNotice compact />
                   </div>
                 </motion.div>
               )}

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
                   <span style={{ color: 'var(--text-secondary)' }}>Shipping</span><span style={{ color: shipping === 0 ? 'var(--success)' : 'var(--text-primary)' }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                 </div>
                 <div style={{ borderRadius: '10px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '10px 12px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: '#065F46' }}>
                     <Gift size={14} /> Freebies applied
                   </div>
                   <ul style={{ margin: '6px 0 0', paddingLeft: '18px', color: '#065F46', fontSize: '12px' }}>
                     {freebies.map((freebie) => (
                       <li key={freebie}>{freebie}</li>
                     ))}
                   </ul>
                 </div>
                 <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontFamily: 'Outfit', fontWeight: 700, fontSize: '18px' }}>
                   <span>Total</span><span className="gradient-text">₹{total.toLocaleString()}</span>
                 </div>
               </div>

               {/* Shipping Address Summary */}
               <div style={{ marginTop: '20px', padding: '16px', background: 'var(--bg-glass)', borderRadius: '12px' }}>
                 <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Shipping To</div>
                 <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                   {address.fullName}<br />
                   {address.line1}<br />
                   {address.line2 && <>{address.line2}<br /></>}
                   {address.city}, {address.state} {address.pincode}<br />
                   {address.country}
                 </div>
                 <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>Phone: {address.phone}</div>
               </div>

               {/* Payment Method Summary */}
               <div style={{ marginTop: '12px', padding: '16px', background: 'var(--bg-glass)', borderRadius: '12px' }}>
                 <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Payment Method</div>
                 <div style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                   <Smartphone size={14} />
                   {`UPI (${UPI_ID})`}
                 </div>
                 {transactionId && (
                   <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                     Transaction ID: {transactionId}
                   </div>
                 )}
               </div>

               <div style={{ marginTop: '12px', padding: '12px', borderRadius: '12px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.18)', fontSize: '12px', color: '#1D4ED8' }}>
                 Delivery window: {DELIVERY_WINDOW_DAYS} days. {PAYMENT_POLICY}
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
                   disabled={isPlacing || !screenshotFile}
                 >
                   <span>{isPlacing ? 'Processing...' : `Place Order — ₹${total.toLocaleString()}`}</span>
                 </motion.button>
               </div>
               {!screenshotFile && (
                 <div style={{ fontSize: '12px', color: '#F59E0B', textAlign: 'center', marginTop: '8px' }}>
                   Please upload a payment screenshot to complete your order
                 </div>
               )}
             </motion.div>
           )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
