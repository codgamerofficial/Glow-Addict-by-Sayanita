'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, X, Sparkles, ShoppingBag, Percent } from 'lucide-react';
import Image from 'next/image';
import { catalogMedia, comboBundles, products } from '@/data/catalog';

interface FreebiesPopupProps {
  onClose?: () => void;
  onClaim?: () => void;
}

export function FreebiesPopup({ onClose, onClaim }: FreebiesPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isVisible]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const freebies: Array<{ id: string; name: string; image: string; value: number }> = [
    { id: 'free-main', name: 'Free Beauty Gift', image: catalogMedia.freebies, value: 249 },
    ...products.slice(0, 2).map((product, index) => ({
      id: `free-product-${product.id}`,
      name: product.name,
      image: product.images[0],
      value: 99 + index * 50,
    })),
  ];

  const comboOffers = comboBundles.slice(0, 3).map((bundle) => ({
    id: bundle.id,
    name: bundle.title,
    discount: bundle.discountPercent,
    image: bundle.image || catalogMedia.combo,
  }));

  const handleClaim = () => {
    onClaim?.();
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 100 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)]"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl blur-xl opacity-30 animate-pulse" />
            
            <div className="relative bg-white/90 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />
              
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center"
                    >
                      <Gift size={24} className="text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        Exclusive Free Gift Alert!
                      </h3>
                      <p className="text-xs text-gray-600">Limited time offer</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 rounded-full bg-red-100 text-red-600 text-xs font-medium">
                      {formatTime(timeLeft)} left
                    </div>
                    <button
                      onClick={handleClose}
                      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <X size={16} className="text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-700 mb-3">
                      Order now and get these exclusive free gifts worth ₹847!
                    </p>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {freebies.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="text-center"
                        >
                          <div className="relative w-16 h-16 mx-auto rounded-xl overflow-hidden mb-1 border-2 border-pink-200">
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                            <div className="absolute top-0 right-0 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center">
                              <Sparkles size={8} className="text-white" />
                            </div>
                          </div>
                          <p className="text-[10px] font-medium text-gray-700 line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-pink-600 font-bold">₹{item.value}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-dashed border-gray-200 pt-3">
                    <p className="text-xs font-semibold text-gray-800 mb-2 flex items-center gap-1">
                      <Percent size={12} className="text-green-600" />
                      Hot Combo Offers
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {comboOffers.map((offer, index) => (
                        <motion.div
                          key={offer.id}
                          whileHover={{ scale: 1.05 }}
                          className="flex-shrink-0 w-24 rounded-xl overflow-hidden border border-gray-200"
                        >
                          <div className="relative h-20">
                            <Image src={offer.image} alt={offer.name} fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-1 left-1 right-1">
                              <p className="text-[10px] font-bold text-white">{offer.name}</p>
                              <p className="text-[10px] text-green-300">{offer.discount}% OFF</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handleClaim}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={18} />
                  Claim Free Gifts Now
                  <Sparkles size={16} className="animate-pulse" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}