'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, ShoppingBag, Sparkles } from 'lucide-react';
import { useCartStore } from '@/features/cart/cartStore';
import { useToast } from '@/components/shared/Toast';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/shared/PageTransition';
import type { Product } from '@/types/product';
import Image from 'next/image';

interface Msg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  products?: Product[];
}

const suggestions = [
  'What\'s the best serum for dark spots?',
  'Build me a nighttime skincare routine',
  'I have oily, acne-prone skin. Help!',
  'Best sunscreen with no white cast?',
  'Recommend a lipstick shade for dusky skin',
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hey gorgeous! 💕 I\'m your AI Beauty Assistant powered by Glow Addict\'s intelligence engine.\n\nI can help you with:\n\n• **Product recommendations** based on your skin\n• **Skincare routines** tailored to you\n• **Ingredient advice** and what works together\n• **Shade matching** for makeup\n\nWhat can I help you with today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const addToCart = useCartStore((s) => s.addItem);
  const { showToast } = useToast();

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const send = useCallback(async (text?: string) => {
    const msgText = text || input.trim();
    if (!msgText) return;

    const userMsg: Msg = { id: `user-${Date.now()}`, role: 'user', content: msgText };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages
        .filter((m) => m.id !== '1')
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msgText, messages: history }),
      });

      const data = await res.json();

      const aiMsg: Msg = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.content || 'Sorry, I couldn\'t generate a response. Try again!',
        products: data.products || [],
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: '😅 Oops! Something went wrong. Let me try again — ask me anything about skincare, makeup, or beauty!',
        },
      ]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  }, [input, messages]);

  const handleAddToCart = useCallback((product: Product) => {
    addToCart(product);
    showToast(`${product.name} added to bag! 🛍️`);
  }, [addToCart, showToast]);

  return (
    <PageTransition>
      <div className="container-main p-6 px-4 max-w-[800px]">
        <div className="text-center mb-6">
          <div className="font-outfit font-black text-3xl tracking-tight flex items-center gap-1 justify-center mb-2">
            <span className="gradient-text">GLOW</span>
            <span className="text-[var(--text-primary)]">ADDICT</span>
          </div>
          <h1 className="font-outfit text-3xl font-bold mb-1">
            AI Beauty Assistant
          </h1>
          <p className="text-[var(--text-muted)] text-sm flex items-center justify-center gap-1.5">
            <Sparkles size={14} /> Powered by NVIDIA AI
          </p>
        </div>

        {/* Chat */}
        <div
          ref={chatRef}
          className="glass-card h-[500px] overflow-y-auto p-5 mb-4 flex flex-col gap-4"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                    msg.role === 'assistant'
                      ? 'bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]'
                      : 'bg-[var(--bg-glass)] border border-[var(--border-glass)]'
                  }`}
                >
                  {msg.role === 'assistant' ? <Bot size={16} className="text-white" /> : <User size={16} />}
                </div>
                <div className={`max-w-[80%] ${msg.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line border ${
                      msg.role === 'user'
                        ? 'bg-[rgba(233,30,140,0.12)] border-[rgba(233,30,140,0.2)]'
                        : 'bg-[var(--bg-glass)] border-[var(--border-glass)]'
                    } text-[var(--text-primary)]`}
                  >
                    {msg.content.split('**').map((part, i) =>
                      i % 2 === 1 ? (
                        <strong key={i}>{part}</strong>
                      ) : (
                        part
                      )
                    )}
                  </div>
                  {/* Product recommendations */}
                  {msg.products && msg.products.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="flex gap-2.5 mt-2.5 overflow-x-auto pb-1 hide-scrollbar"
                    >
                      {msg.products.map((p) => (
                        <motion.div
                          key={p.id}
                          whileTap={{ scale: 0.95 }}
                          className="min-w-[180px] bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-xl overflow-hidden"
                        >
                          <Link href={`/products/${p.slug}`}>
                            <div className="relative h-[120px] w-full">
                              <Image
                                src={p.images[0]}
                                alt={p.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </Link>
                          <div className="p-2.5">
                            <div className="text-[10px] text-[var(--primary)] font-semibold uppercase">
                              {p.brandName}
                            </div>
                            <div className="text-[12px] font-medium mb-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
                              {p.name}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="font-outfit text-sm font-bold">
                                ₹{p.salePrice || p.price}
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => handleAddToCart(p)}
                                className="bg-linear-to-br from-[var(--primary)] to-[var(--secondary)] border-none rounded-md p-1 px-2 cursor-pointer text-white"
                              >
                                <ShoppingBag size={12} />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                className="flex gap-2.5"
              >
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center">
                  <Bot size={16} color="white" />
                </div>
                <div className="bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-2xl p-3 px-4 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.4, delay: i * 0.2, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-[var(--text-muted)]"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Suggestions */}
        <div className="flex gap-2 flex-wrap mb-3">
          {suggestions.map((s) => (
            <motion.button
              key={s}
              whileTap={{ scale: 0.95 }}
              onClick={() => send(s)}
              className="bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-full px-3.5 py-1.5 text-[12px] text-[var(--text-secondary)] cursor-pointer transition-all duration-200 hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              {s}
            </motion.button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask me anything about beauty..."
            className="input-glass flex-1 text-[15px]"
            disabled={isTyping}
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => send()}
            className="btn-gradient p-3 px-5 flex-shrink-0"
            disabled={isTyping}
          >
            <span>
              <Send size={18} />
            </span>
          </motion.button>
        </div>
      </div>
    </PageTransition>
  );
}
