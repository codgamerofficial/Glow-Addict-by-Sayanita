'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Sparkles, Mic } from 'lucide-react';
import { Product } from '@/types/product';
import { catalogMedia } from '@/data/catalog';

interface GlowAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onRecommendations?: (products: Product[]) => void;
}

export function GlowAIAssistant({ isOpen, onClose, onRecommendations }: GlowAIAssistantProps) {
  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: string }>>([
    { id: '1', role: 'assistant', content: "Hello! I'm your Glow AI Assistant ✨ Powered by NVIDIA. How can I help you find your perfect beauty match today?" }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now().toString(), role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        "Based on your skin type, I'd recommend the Dot & Key Vitamin C Serum - it's perfect for brightening and reducing dullness!",
        "For hydration, the Plum Niacinamide Serum works wonders. Would you like me to show you similar products?",
        "I see you're interested in sunscreen! The Dot & Key Watermelon Cooling Sunscreen SPF 50+ is our bestseller.",
        "Based on your concerns, I recommend the Foxtale Radiance Mask - it gives instant glow!",
        "The WishCare Oil Balance Fluid Sunscreen is perfect for oily skin - lightweight and non-greasy!"
      ];
      const botMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: responses[Math.floor(Math.random() * responses.length)]
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const voiceWaveBars = Array(5).fill(0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]"
        >
          <div className="relative">
            <motion.div
              className="absolute -top-12 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 blur-2xl opacity-30"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            
            <div className="relative bg-white/80 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-blue-50/50" />
              
              <div className="relative p-4 border-b border-white/30 bg-gradient-to-r from-purple-50 to-blue-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <motion.img
                        src={catalogMedia.logo}
                        alt="Glow Addict by Sayanita"
                        className="w-10 h-10 rounded-full object-contain bg-white"
                        animate={{ boxShadow: ['0 0 0 0px rgba(168, 85, 247, 0.4)', '0 0 0 8px rgba(168, 85, 247, 0)'] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Glow AI - Glow Addict by Sayanita</h3>
                      <p className="text-xs text-gray-600">Powered by NVIDIA • Online</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-white/50 transition-colors"
                  >
                    <X size={18} className="text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="h-80 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${msg.role === 'user' ? 'ml-auto' : ''}`}>
                      <div className={`px-4 py-3 rounded-2xl text-sm ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-br-md'
                          : 'bg-white/60 backdrop-blur border border-white/40 text-gray-800 rounded-bl-md'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/60 backdrop-blur border border-white/40 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Glow AI is typing</span>
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1.5 h-1.5 bg-purple-500 rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-white/30">
                <div className="flex items-end gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about products, skin concerns..."
                      className="w-full resize-none rounded-2xl border border-white/40 bg-white/60 backdrop-blur px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="absolute right-2 bottom-2 p-1.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                  <motion.button
                    onClick={() => setIsListening(!isListening)}
                    className={`p-3 rounded-2xl transition-all ${
                      isListening 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white' 
                        : 'bg-white/60 backdrop-blur border border-white/40 text-gray-600 hover:bg-white/80'
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="relative">
                      <Mic size={18} />
                      {isListening && (
                        <div className="absolute -top-1 -right-1 flex items-center justify-center">
                          {voiceWaveBars.map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-0.5 bg-white rounded-full mx-0.5"
                              animate={{ height: [4, 12, 4] }}
                              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}