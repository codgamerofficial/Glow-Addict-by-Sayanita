'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, X } from 'lucide-react';
import { catalogMedia } from '@/data/catalog';

export function GlowAIButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating AI Button */}
      <motion.button
        onClick={() => setIsChatOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-pink-500/30 transition-all duration-300 border-none"
        aria-label="Open Glow AI Assistant"
      >
        <Bot size={20} className="text-white" />
      </motion.button>

      {/* AI Chat Panel */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isChatOpen ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="fixed bottom-20 right-6 z-50 w-96 max-w-xs"
      >
        <div className="relative">
          {/* Glassmorphism Panel */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl blur-3xl opacity-20" />
          
          <div className="relative bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden"
                  >
                    <img src={catalogMedia.logo} alt="Glow Addict by Sayanita" className="w-full h-full object-contain" />
                  </motion.div>
                  <div>
                    <h4 className="text-sm font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                      Glow AI Assistant
                    </h4>
                    <p className="text-xs text-gray-400">Your luxury beauty advisor</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-1 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
              
              <div className="space-y-3">
                {/* Chat Messages */}
                <div className="h-40 overflow-y-auto mb-3">
                  <div className="flex items-start gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full bg-pink-400" />
                    <div className="flex-1 text-xs text-gray-300 bg-white/10 rounded-xl px-3 py-1">
                       Hello! I&apos;m your AI beauty advisor. How can I help you achieve that luxurious glow today?
                    </div>
                  </div>
                  <div className="flex items-start justify-end gap-2 mb-2">
                     <div className="flex-1 text-xs text-gray-300 bg-white/10 rounded-xl px-3 py-1 text-right">
                       I&apos;m looking for skincare recommendations for glowing skin
                     </div>
                    <div className="w-3 h-3 rounded-full bg-purple-400" />
                  </div>
                </div>
                
                {/* Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask me about luxury skincare..."
                    className="flex-1 px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                  <button
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center"
                  >
                    <Bot size={16} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}