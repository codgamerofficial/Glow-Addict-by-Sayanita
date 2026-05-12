'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, MessageCircle } from 'lucide-react';
import { useCartStore } from '@/features/cart/cartStore';
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from '@/lib/commerce';

export default function CartWhatsAppShare() {
  const { items, getSubtotal, getTotal } = useCartStore();

  const handleShare = () => {
    let message = `${WHATSAPP_MESSAGE}\n\nI want to order:\n\n`;

    items.forEach((item, index) => {
      const price = item.product.salePrice || item.product.price;
      message += `• ${item.product.name} - ₹${(price * item.quantity).toLocaleString()} x ${item.quantity}\n`;
    });

    message += `\nSubtotal: ₹${getSubtotal().toLocaleString()}`;
    message += `\nTotal: ₹${getTotal().toLocaleString()}`;
    message += '\n\nPlease confirm availability and payment details.';

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card"
      style={{
        padding: '20px',
        marginTop: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            borderRadius: '999px',
            background: 'rgba(37, 211, 102, 0.12)',
            color: '#25D366',
          }}
        >
          <MessageCircle size={20} />
        </div>
        <div>
          <h3 style={{ fontFamily: 'Outfit', fontSize: '16px', fontWeight: 600, margin: 0 }}>
            Send Cart via WhatsApp
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Get instant assistance with your order
          </p>
        </div>
      </div>

      <motion.button
        onClick={handleShare}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          width: '100%',
          minHeight: '50px',
          padding: '0 20px',
          border: 'none',
          borderRadius: '999px',
          color: '#fff',
          background: '#25D366',
          fontFamily: 'var(--font-display, "Outfit")',
          fontSize: '15px',
          fontWeight: 800,
          cursor: 'pointer',
          boxShadow: '0 12px 32px rgba(37, 211, 102, 0.4)',
          transition: 'all 0.35s var(--spring)',
        }}
      >
        <ShoppingBag size={18} />
        <span>Send Cart via WhatsApp</span>
      </motion.button>

      <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
        Our team will help you complete the order quickly
      </p>
    </motion.div>
  );
}
