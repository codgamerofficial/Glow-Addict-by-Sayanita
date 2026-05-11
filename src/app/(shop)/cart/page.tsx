'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, Tag, Gift, Lock, Zap } from 'lucide-react';
import { useCartStore } from '@/features/cart/cartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/shared/Toast';
import PageTransition from '@/components/shared/PageTransition';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getTotal, getItemCount } = useCartStore();
  const subtotal = getSubtotal();
  const total = getTotal();
  const shipping = subtotal > 499 ? 0 : 49;
  const itemCount = getItemCount();
  const { showToast } = useToast();
  const discount = subtotal > 0 ? Math.floor(subtotal * 0.1) : 0;

  const handleRemove = (productId: string, name: string) => {
    removeItem(productId);
    showToast(`${name} removed from cart`);
  };

  if (items.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 text-center py-20 px-5">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100 }}
          >
            <ShoppingBag size={80} className="text-purple-500 mx-auto mb-6" />
          </motion.div>
          <h2 className="font-outfit text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Your cart is empty</h2>
          <p className="text-gray-600 mb-8 text-lg">Add some amazing products to get started!</p>
          <Link href="/products" className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 no-underline p-4 px-10 text-white text-lg font-bold rounded-full hover:shadow-lg transition-all">
            <span className="flex items-center gap-2">Shop Now <ArrowRight size={20} /></span>
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 text-white py-8 px-4">
          <div className="container-main">
            <h1 className="font-outfit text-4xl font-black mb-2">
              SHOPPING <br /> CART ✨
            </h1>
            <p className="text-white/90 flex items-center gap-2">
              <Zap size={18} /> {itemCount} item{itemCount !== 1 ? 's' : ''} in your bag
            </p>
          </div>
        </div>

        {/* Promo Banner */}
        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 px-4 text-center text-sm font-bold">
          ✨ FREE SHIPPING ON ORDERS ABOVE ₹499 ✨
        </div>

        <div className="container-main p-6 px-4 pb-20">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
            {/* Items */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {items.map((item, idx) => {
                  const price = item.product.salePrice || item.product.price;
                  const origPrice = item.product.price;
                  const discountPct = item.product.salePrice
                    ? Math.round(((origPrice - item.product.salePrice) / origPrice) * 100)
                    : 0;
                  const colors = [
                    'from-purple-300 to-pink-300',
                    'from-pink-300 to-yellow-300',
                    'from-yellow-300 to-green-300',
                    'from-green-300 to-blue-300',
                  ];
                  const bgColor = colors[idx % colors.length];

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 200, scale: 0.8 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                      className={`bg-gradient-to-r ${bgColor} rounded-3xl p-5 flex gap-5 items-center shadow-lg hover:shadow-xl transition-all`}
                    >
                      <Link href={`/products/${item.product.slug}`}>
                        <motion.div
                          whileTap={{ scale: 0.9 }}
                          className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-white/90"
                        >
                          <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="96px" />
                          {discountPct > 0 && (
                            <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm">
                              {discountPct}%
                            </div>
                          )}
                        </motion.div>
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-black text-white/80 uppercase tracking-wider">{item.product.brandName}</div>
                        <Link href={`/products/${item.product.slug}`} className="no-underline text-gray-900">
                          <h3 className="text-sm font-bold mb-2 line-clamp-1">{item.product.name}</h3>
                        </Link>

                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-outfit text-lg font-black text-gray-900">₹{(price * item.quantity).toLocaleString()}</span>
                          {item.product.salePrice && (
                            <span className="text-sm text-gray-600 line-through">₹{(origPrice * item.quantity).toLocaleString()}</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center border-2 border-white/40 rounded-lg overflow-hidden bg-white/10">
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              className="bg-white/20 border-none p-2 px-2.5 cursor-pointer text-gray-900 font-bold"
                            >
                              <Minus size={16} />
                            </motion.button>
                            <span className="p-2 px-3.5 text-sm font-black text-gray-900">{item.quantity}</span>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="bg-white/20 border-none p-2 px-2.5 cursor-pointer text-gray-900 font-bold"
                            >
                              <Plus size={16} />
                            </motion.button>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() => handleRemove(item.product.id, item.product.name)}
                            className="bg-red-500 hover:bg-red-600 border-none text-white cursor-pointer p-2 rounded-lg transition-all font-bold text-sm"
                          >
                            <Trash2 size={16} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:sticky lg:top-[100px] self-start"
            >
              <div className="bg-white rounded-3xl p-6 shadow-xl border-4 border-purple-200">
                <h3 className="font-outfit text-2xl font-black mb-6 text-purple-700">ORDER SUMMARY</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-semibold">Subtotal</span>
                    <span className="font-black">₹{subtotal.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-3 border-2 border-green-400"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-green-700 font-bold flex items-center gap-2">
                          <Gift size={18} /> Member Discount
                        </span>
                        <span className="text-green-700 font-black">-₹{discount}</span>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex justify-between text-gray-700">
                    <span className="font-semibold">Shipping</span>
                    <span className={`font-black ${shipping === 0 ? 'text-green-600' : 'text-orange-600'}`}>
                      {shipping === 0 ? '✨ FREE' : `₹${shipping}`}
                    </span>
                  </div>

                  {shipping > 0 && (
                    <div className="bg-orange-50 rounded-lg p-3 border-l-4 border-orange-400">
                      <p className="text-orange-700 text-xs font-bold">
                        Add ₹{499 - subtotal} more for FREE shipping! 🚚
                      </p>
                    </div>
                  )}

                  <div className="border-t-2 border-gray-300 pt-4 flex justify-between text-xl">
                    <span className="font-black text-gray-900">Total</span>
                    <motion.span
                      key={total}
                      initial={{ scale: 1.2, color: '#E91E8C' }}
                      animate={{ scale: 1, color: '#000000' }}
                      className="font-outfit font-black text-2xl"
                    >
                      ₹{total.toLocaleString()}
                    </motion.span>
                  </div>
                </div>

                {/* Coupon */}
                <div className="flex gap-2 mb-5">
                  <input
                    placeholder="Enter coupon code"
                    className="flex-1 p-3 px-4 text-sm border-2 border-gray-300 rounded-lg font-semibold focus:border-purple-500 focus:outline-none"
                  />
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 px-5 rounded-lg font-bold text-sm hover:shadow-lg transition-all"
                  >
                    <Tag size={18} />
                  </motion.button>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-2xl font-black text-center text-lg no-underline hover:shadow-xl transition-all mb-3"
                >
                  CHECKOUT NOW 🛒
                </Link>

                <div className="bg-purple-50 rounded-xl p-4 text-center border-2 border-purple-200">
                  <p className="text-xs font-bold text-purple-700 mb-2">✨ EARLY ACCESS MEMBER</p>
                  <p className="text-lg font-black text-purple-900">EXTRA 20% OFF</p>
                  <p className="text-xs text-purple-600 mt-1">On your next purchase</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
