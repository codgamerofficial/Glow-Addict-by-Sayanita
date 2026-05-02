'use client';
import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, User, ShoppingBag } from 'lucide-react';
import { products } from '@/data/products';
import { useCartStore } from '@/features/cart/cartStore';
import Link from 'next/link';

interface Msg { id: string; role: 'user' | 'assistant'; content: string; products?: typeof products; }

const suggestions = [
  'What\'s the best serum for dark spots?',
  'Build me a nighttime skincare routine',
  'I have oily, acne-prone skin. Help!',
  'Best sunscreen with no white cast?',
  'Recommend a lipstick shade for dusky skin',
];

function getAIResponse(query: string): { text: string; recommended: typeof products } {
  const q = query.toLowerCase();
  let recs = products.slice(0, 3);
  let text = '';

  if (q.includes('dark spot') || q.includes('brighten') || q.includes('pigment')) {
    recs = products.filter(p => p.concerns.includes('Dark Spots') || p.tags.includes('brightening')).slice(0, 3);
    text = '✨ For dark spots and pigmentation, I recommend a combination of **Vitamin C** for brightening and **Niacinamide** for evening skin tone. Here are my top picks:\n\nUse Vitamin C in the morning and Niacinamide in the evening for best results. Always follow up with SPF 50+!';
  } else if (q.includes('oily') || q.includes('acne')) {
    recs = products.filter(p => p.skinTypes.includes('Oily') || p.concerns.includes('Acne')).slice(0, 3);
    text = '🧴 For oily, acne-prone skin, focus on:\n\n1. **Gentle cleanser** with Salicylic Acid\n2. **Niacinamide serum** for oil control\n3. **Lightweight gel moisturizer**\n4. **SPF 50+** (non-comedogenic)\n\nHere are products perfect for your skin:';
  } else if (q.includes('routine') || q.includes('night')) {
    recs = products.filter(p => p.categoryName === 'Skincare').slice(0, 4);
    text = '🌙 Here\'s a perfect nighttime routine:\n\n**Step 1:** Double cleanse (micellar water → face wash)\n**Step 2:** Exfoliating toner (2-3x/week)\n**Step 3:** Treatment serum (Retinol or Niacinamide)\n**Step 4:** Eye cream\n**Step 5:** Moisturizer\n\nHere are products I recommend:';
  } else if (q.includes('sunscreen') || q.includes('spf')) {
    recs = products.filter(p => p.tags.includes('sunscreen') || p.tags.includes('spf')).slice(0, 3);
    text = '☀️ A good sunscreen is the #1 anti-aging product! Look for:\n\n- **SPF 50+ PA++++** for Indian skin\n- **No white cast** formula\n- **Lightweight** and non-greasy\n\nHere\'s my top pick:';
  } else if (q.includes('lipstick') || q.includes('lip')) {
    recs = products.filter(p => p.categoryName === 'Makeup' && (p.tags.includes('lipstick') || p.tags.includes('lip-gloss'))).slice(0, 3);
    text = '💄 For dusky skin tones, these shades look gorgeous:\n\n- **Rose Nude** — universally flattering\n- **Berry Mauve** — rich and elegant\n- **Warm Coral** — perfect for daytime\n\nCheck out these beauties:';
  } else {
    text = `💕 Great question! Based on what you're looking for, here are some products I think you'll love. Each is highly rated and carefully selected for quality ingredients.\n\nWant me to narrow it down based on your skin type or concerns?`;
  }

  return { text, recommended: recs };
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: '1', role: 'assistant', content: 'Hey gorgeous! 💕 I\'m your AI Beauty Assistant. I can help you with:\n\n• **Product recommendations** based on your skin\n• **Skincare routines** tailored to you\n• **Ingredient advice** and what works together\n• **Shade matching** for makeup\n\nWhat can I help you with today?' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const addToCart = useCartStore(s => s.addItem);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Msg = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const { text, recommended } = getAIResponse(input);
      const aiMsg: Msg = { id: (Date.now() + 1).toString(), role: 'assistant', content: text, products: recommended };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="container-main animate-fade-in" style={{ padding: '24px 16px', maxWidth: '800px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <img src="/images/logo.png" alt="Glow Addict" style={{ height: '64px', width: 'auto', objectFit: 'contain', margin: '0 auto 12px', display: 'block' }} />
        <h1 style={{ fontFamily: 'Outfit', fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>AI Beauty Assistant</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Your personal beauty advisor, powered by AI</p>
      </div>

      {/* Chat */}
      <div ref={chatRef} className="glass-card" style={{ height: '500px', overflowY: 'auto', padding: '20px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', gap: '10px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
              background: msg.role === 'assistant' ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'var(--bg-glass)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: msg.role === 'user' ? '1px solid var(--border-glass)' : 'none',
            }}>
              {msg.role === 'assistant' ? <Bot size={16} color="white" /> : <User size={16} />}
            </div>
            <div style={{ maxWidth: '80%' }}>
              <div style={{
                background: msg.role === 'user' ? 'rgba(233,30,140,0.12)' : 'var(--bg-glass)',
                border: '1px solid', borderColor: msg.role === 'user' ? 'rgba(233,30,140,0.2)' : 'var(--border-glass)',
                borderRadius: '14px', padding: '12px 16px', fontSize: '14px', lineHeight: 1.7,
                color: 'var(--text-primary)', whiteSpace: 'pre-line',
              }}>
                {msg.content.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
              </div>
              {/* Product recommendations */}
              {msg.products && msg.products.length > 0 && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', overflowX: 'auto', paddingBottom: '4px' }} className="hide-scrollbar">
                  {msg.products.map(p => (
                    <div key={p.id} style={{ minWidth: '180px', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '12px', overflow: 'hidden' }}>
                      <Link href={`/products/${p.slug}`}>
                        <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                      </Link>
                      <div style={{ padding: '10px' }}>
                        <div style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase' }}>{p.brandName}</div>
                        <div style={{ fontSize: '12px', fontWeight: 500, marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontFamily: 'Outfit', fontSize: '14px', fontWeight: 700 }}>₹{(p.salePrice || p.price)}</span>
                          <button onClick={() => addToCart(p)} style={{
                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                            border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', color: 'white',
                          }}><ShoppingBag size={12} /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={16} color="white" />
            </div>
            <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '14px', padding: '12px 16px', display: 'flex', gap: '4px' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-muted)',
                  animation: `pulse 1.4s ${i * 0.2}s infinite ease-in-out`,
                }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {suggestions.map(s => (
          <button key={s} onClick={() => { setInput(s); }} style={{
            background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '20px',
            padding: '6px 14px', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-glass)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask me anything about beauty..."
          className="input-glass" style={{ flex: 1, fontSize: '15px' }} />
        <button onClick={send} className="btn-gradient" style={{ padding: '12px 20px', flexShrink: 0 }}>
          <span><Send size={18} /></span>
        </button>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
