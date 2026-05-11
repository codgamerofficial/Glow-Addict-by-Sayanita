'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  CreditCard, Smartphone, Banknote, Wallet, Shield, Check, ArrowLeft, PartyPopper,
  Gift, Zap, Lock, Truck, ShoppingBag, Tag, Building2
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/features/cart/cartStore';
import { useAuthStore } from '@/features/auth/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/shared/PageTransition';
import { placeOrder as placeOrderAction } from '@/actions/shop';

const paymentMethods = [
  { id: 'upi', label: 'UPI', desc: 'PhonePe, Google Pay, Paytm', icon: Smartphone, color: 'from-blue-400 to-purple-500' },
  { id: 'card', label: 'Credit Card', desc: 'Visa, Mastercard, Rupay', icon: CreditCard, color: 'from-purple-400 to-pink-500' },
  { id: 'wallet', label: 'Wallet', desc: 'Paytm, Amazon Pay', icon: Wallet, color: 'from-pink-400 to-orange-500' },
  { id: 'emi', label: 'EMI', desc: '0% on select items', icon: Tag, color: 'from-orange-400 to-yellow-500' },
  { id: 'cod', label: 'Cash on Delivery', desc: '₹30 charges apply', icon: Banknote, color: 'from-yellow-400 to-green-500' },
  { id: 'nb', label: 'Net Banking', desc: 'All major banks', icon: Building2, color: 'from-green-400 to-cyan-500' },
];

function Confetti() {
  const [particles] = useState<Array<{ id: number; x: number; color: string; delay: number; size: number; rotate: number; duration: number }>>(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ['#E91E8C', '#A855F7', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#FBBF24'][Math.floor(Math.random() * 7)],
      delay: Math.random() * 0.5,
      size: 6 + Math.random() * 10,
      rotate: 720 + Math.random() * 360,
      duration: 2.5 + Math.random() * 2,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: 0, rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          className="absolute"
          style={{
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

const stepVariants = {
  enter: { x: 30, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -30, opacity: 0 },
};

export default function CheckoutPage() {
  const { items, getSubtotal, getTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
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
  const discount = Math.floor(subtotal * 0.1);

  const handlePlaceOrder = useCallback(async () => {
    if (!user) {
      alert('Please sign in to place an order');
      return;
    }

    setIsPlacing(true);
    try {
      const res = await placeOrderAction({
        items,
        subtotal,
        total,
        paymentMethod: payment,
        shippingAddress: address
      }, user.id);

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
  }, [items, subtotal, total, payment, address, clearCart, user]);

  if (orderPlaced) {
    return (
      <PageTransition>
        <Confetti />
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-cyan-50 flex items-center justify-center px-4 py-20">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 10, stiffness: 100 }}
              className="w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6"
            >
              <Check size={60} className="text-white" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-outfit text-5xl font-black mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
            >
              ORDER PLACED! 🎉
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-700 mb-2 text-lg font-bold"
            >
              Your order #{orderId} has been confirmed
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-600 mb-10"
            >
              Check your email for confirmation and tracking details
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex gap-4 justify-center flex-wrap"
            >
              <Link href="/track-order" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white no-underline p-4 px-8 rounded-full font-black text-lg hover:shadow-xl transition-all">
                Track Order 🚚
              </Link>
              <Link href="/products" className="bg-white border-4 border-purple-500 text-purple-600 no-underline p-4 px-8 rounded-full font-black text-lg hover:shadow-xl transition-all">
                Shop More ✨
              </Link>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 text-center py-20 px-5">
          <ShoppingBag size={80} className="text-red-500 mx-auto mb-6" />
          <h2 className="font-outfit text-3xl font-black mb-4 text-gray-900">No items to checkout</h2>
          <Link href="/products" className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white no-underline p-4 px-10 rounded-full font-black text-lg">
            Shop Now ✨
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 pb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 text-white py-6 px-4 mb-6">
          <div className="container-main">
            <Link href="/cart" className="flex items-center gap-2 text-white/90 no-underline mb-4 font-bold hover:text-white">
              <ArrowLeft size={20} /> Back to Cart
            </Link>
            <h1 className="font-outfit text-3xl font-black">SECURE CHECKOUT</h1>
          </div>
        </div>

        <div className="container-main p-6 px-4 max-w-[1000px]">
          {/* Step Indicator */}
          <div className="flex gap-0 mb-10">
            {['Address', 'Payment', 'Review'].map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{
                      background: step > i + 1 ? '#10B981' : step === i + 1 ? '#E91E8C' : '#F0F0F0',
                      scale: step === i + 1 ? 1.15 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black ${step >= i + 1 ? 'text-white' : 'text-gray-600'}`}
                  >
                    {step > i + 1 ? <Check size={20} /> : i + 1}
                  </motion.div>
                  <span className={`font-black ${step === i + 1 ? 'text-purple-700' : 'text-gray-600'}`}>{s}</span>
                </div>
                {i < 2 && (
                  <motion.div
                    animate={{ background: step > i + 1 ? '#10B981' : '#E0E0E0' }}
                    className="flex-1 h-1.5 mx-3 rounded-full"
                  />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1 - Address */}
            {step === 1 && (
              <motion.div key="address" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-purple-200">
                  <h3 className="font-outfit text-3xl font-black mb-8 text-purple-700">📍 SHIPPING ADDRESS</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input className="col-span-2 p-4 px-5 text-base border-2 border-gray-300 rounded-xl font-semibold focus:border-purple-500 focus:outline-none" placeholder="Full Name" defaultValue="Sayanita" />
                    <input className="p-4 px-5 text-base border-2 border-gray-300 rounded-xl font-semibold focus:border-purple-500 focus:outline-none" placeholder="Phone Number" defaultValue="+91 98765 43210" />
                    <input className="p-4 px-5 text-base border-2 border-gray-300 rounded-xl font-semibold focus:border-purple-500 focus:outline-none" placeholder="Email" defaultValue="sayanita@email.com" />
                    <input className="col-span-2 p-4 px-5 text-base border-2 border-gray-300 rounded-xl font-semibold focus:border-purple-500 focus:outline-none" placeholder="Address Line 1" defaultValue="123, MG Road" />
                    <input className="p-4 px-5 text-base border-2 border-gray-300 rounded-xl font-semibold focus:border-purple-500 focus:outline-none" placeholder="City" defaultValue="Bangalore" />
                    <input className="p-4 px-5 text-base border-2 border-gray-300 rounded-xl font-semibold focus:border-purple-500 focus:outline-none" placeholder="State" defaultValue="Karnataka" />
                    <input className="p-4 px-5 text-base border-2 border-gray-300 rounded-xl font-semibold focus:border-purple-500 focus:outline-none" placeholder="Pincode" defaultValue="560001" />
                    <input className="p-4 px-5 text-base border-2 border-gray-300 rounded-xl font-semibold focus:border-purple-500 focus:outline-none" placeholder="Country" defaultValue="India" />
                  </div>
                  <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(2)} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white mt-8 w-full p-4 rounded-2xl font-black text-lg hover:shadow-xl transition-all">
                    CONTINUE TO PAYMENT →
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 2 - Payment */}
            {step === 2 && (
              <motion.div key="payment" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-pink-200">
                  <h3 className="font-outfit text-3xl font-black mb-8 text-purple-700">💳 EASY CHECKOUT & PAYMENT</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                    {paymentMethods.map(pm => {
                      const Icon = pm.icon;
                      const isSelected = payment === pm.id;
                      return (
                        <motion.button
                          key={pm.id}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setPayment(pm.id)}
                          className={`flex flex-col items-center gap-3 p-6 rounded-3xl cursor-pointer transition-all duration-200 border-4 ${
                            isSelected
                              ? `bg-gradient-to-br ${pm.color} border-gray-300 shadow-xl`
                              : 'bg-gray-50 border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isSelected ? 'bg-white/20' : 'bg-gray-200'}`}>
                            <Icon size={32} className={isSelected ? 'text-white' : 'text-gray-700'} />
                          </div>
                          <div className="text-center">
                            <div className={`font-black text-sm ${isSelected ? 'text-white' : 'text-gray-900'}`}>{pm.label}</div>
                            <div className={`text-xs ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>{pm.desc}</div>
                          </div>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-6 h-6 rounded-full bg-white flex items-center justify-center mt-2"
                            >
                              <Check size={16} className="text-green-500" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="bg-green-50 rounded-2xl p-4 mb-8 border-2 border-green-400">
                    <p className="text-green-700 font-black text-sm">
                      ✅ Safe & Secure • 256-bit SSL Encryption • Easy 15-day Returns
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(1)} className="bg-gray-200 text-gray-900 p-4 rounded-2xl font-black flex-1">
                      ← BACK
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(3)} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-2xl font-black flex-1 hover:shadow-xl transition-all">
                      REVIEW ORDER →
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3 - Review */}
            {step === 3 && (
              <motion.div key="review" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
                <div className="bg-white rounded-3xl p-8 shadow-xl border-4 border-yellow-200">
                  <h3 className="font-outfit text-3xl font-black mb-6 text-purple-700">📦 ORDER REVIEW</h3>

                  {/* Items Summary */}
                  <div className="bg-yellow-50 rounded-2xl p-6 mb-6">
                    <h4 className="font-black text-gray-900 mb-4">Your Items:</h4>
                    {items.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex gap-4 items-center py-3 border-b border-yellow-300 last:border-b-0"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                          <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="64px" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-gray-900">{item.product.name}</div>
                          <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                        </div>
                        <div className="font-black text-lg">₹{((item.product.salePrice || item.product.price) * item.quantity).toLocaleString()}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-3 mb-8 bg-purple-50 rounded-2xl p-6">
                    <div className="flex justify-between text-gray-700">
                      <span className="font-semibold">Subtotal</span>
                      <span className="font-black">₹{subtotal.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-700 bg-green-100 rounded-lg p-2 px-3">
                        <span className="font-bold flex items-center gap-2"><Gift size={16} /> Member Discount</span>
                        <span className="font-black">-₹{discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-700">
                      <span className="font-semibold">Shipping</span>
                      <span className="text-green-600 font-black">✨ FREE</span>
                    </div>
                    <div className="border-t-2 border-purple-300 pt-3 flex justify-between text-xl">
                      <span className="font-black">TOTAL</span>
                      <span className="font-outfit font-black text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">₹{total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(2)} className="bg-gray-200 text-gray-900 p-4 rounded-2xl font-black flex-1">
                      ← CHANGE PAYMENT
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handlePlaceOrder}
                      disabled={isPlacing}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-2xl font-black flex-1 hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      {isPlacing ? 'PLACING...' : 'PLACE ORDER 🎉'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
