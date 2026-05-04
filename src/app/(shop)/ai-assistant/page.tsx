'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ShoppingBag, Sparkles } from 'lucide-react';
import { useCartStore } from '@/features/cart/cartStore';
import { useToast } from '@/components/shared/Toast';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/shared/PageTransition';
import type { Product } from '@/types/product';

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

  const send = async (text?: string) => {
    const msgText = text || input.trim();
    if (!msgText) return;

    const userMsg: Msg = { id: Date.now().toString(), role: 'user', content: msgText };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Build conversation history for context
      const history = messages
        .filter((m) => m.id !== '1') // Skip initial greeting
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msgText, messages: history }),
      });

      const data = await res.json();

      const aiMsg: Msg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || 'Sorry, I couldn\'t generate a response. Try again!',
        products: data.products || [],
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '😅 Oops! Something went wrong. Let me try again — ask me anything about skincare, makeup, or beauty!',
        },
      ]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    showToast(`${product.name} added to bag! 🛍️`);
  };

  return (
    <PageTransition>
      <div className="container-main" style={{ padding: '24px 16px', maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img
            src="/images/logo.png"
            alt="Glow Addict"
            style={{ height: '64px', width: 'auto', objectFit: 'contain', margin: '0 auto 12px', display: 'block' }}
          />
          <h1 style={{ fontFamily: 'Outfit', fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>
            AI Beauty Assistant
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Sparkles size={14} /> Powered by Gemini AI
          </p>
        </div>

        {/* Chat */}
        <div
          ref={chatRef}
          className="glass-card"
          style={{
            height: '500px',
            overflowY: 'auto',
            padding: '20px',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                style={{ display: 'flex', gap: '10px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    flexShrink: 0,
                    background:
                      msg.role === 'assistant'
                        ? 'linear-gradient(135deg, var(--primary), var(--secondary))'
                        : 'var(--bg-glass)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: msg.role === 'user' ? '1px solid var(--border-glass)' : 'none',
                  }}
                >
                  {msg.role === 'assistant' ? <Bot size={16} color="white" /> : <User size={16} />}
                </div>
                <div style={{ maxWidth: '80%' }}>
                  <div
                    style={{
                      background: msg.role === 'user' ? 'rgba(233,30,140,0.12)' : 'var(--bg-glass)',
                      border: '1px solid',
                      borderColor: msg.role === 'user' ? 'rgba(233,30,140,0.2)' : 'var(--border-glass)',
                      borderRadius: '14px',
                      padding: '12px 16px',
                      fontSize: '14px',
                      lineHeight: 1.7,
                      color: 'var(--text-primary)',
                      whiteSpace: 'pre-line',
                    }}
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
                      style={{
                        display: 'flex',
                        gap: '10px',
                        marginTop: '10px',
                        overflowX: 'auto',
                        paddingBottom: '4px',
                      }}
                      className="hide-scrollbar"
                    >
                      {msg.products.map((p) => (
                        <motion.div
                          key={p.id}
                          whileTap={{ scale: 0.95 }}
                          style={{
                            minWidth: '180px',
                            background: 'var(--bg-glass)',
                            border: '1px solid var(--border-glass)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                          }}
                        >
                          <Link href={`/products/${p.slug}`}>
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                            />
                          </Link>
                          <div style={{ padding: '10px' }}>
                            <div
                              style={{
                                fontSize: '10px',
                                color: 'var(--primary)',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                              }}
                            >
                              {p.brandName}
                            </div>
                            <div
                              style={{
                                fontSize: '12px',
                                fontWeight: 500,
                                marginBottom: '6px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {p.name}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontFamily: 'Outfit', fontSize: '14px', fontWeight: 700 }}>
                                ₹{p.salePrice || p.price}
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() => handleAddToCart(p)}
                                style={{
                                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  cursor: 'pointer',
                                  color: 'white',
                                }}
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
                style={{ display: 'flex', gap: '10px' }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Bot size={16} color="white" />
                </div>
                <div
                  style={{
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '14px',
                    padding: '12px 16px',
                    display: 'flex',
                    gap: '4px',
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.4, delay: i * 0.2, repeat: Infinity }}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'var(--text-muted)',
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Suggestions */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          {suggestions.map((s) => (
            <motion.button
              key={s}
              whileTap={{ scale: 0.95 }}
              onClick={() => send(s)}
              style={{
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-glass)',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.color = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-glass)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }}
            >
              {s}
            </motion.button>
          ))}
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask me anything about beauty..."
            className="input-glass"
            style={{ flex: 1, fontSize: '15px' }}
            disabled={isTyping}
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => send()}
            className="btn-gradient"
            style={{ padding: '12px 20px', flexShrink: 0 }}
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
