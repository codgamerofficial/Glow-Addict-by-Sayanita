'use client';

import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE } from '@/lib/commerce';

interface WhatsAppShareProps {
  productName: string;
  productUrl: string;
  price: number;
  className?: string;
}

export default function WhatsAppShare({ productName, productUrl, price, className = '' }: WhatsAppShareProps) {
  const handleShare = () => {
    const baseUrl = `https://wa.me/${WHATSAPP_NUMBER}`;
    const message = `${WHATSAPP_MESSAGE}\n\nProduct: ${productName}\nPrice: ₹${price.toLocaleString()}\nLink: ${productUrl}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`${baseUrl}?text=${encodedMessage}`, '_blank');
  };

  return (
    <motion.button
      onClick={handleShare}
      className={`whatsapp-share-btn ${className}`}
      aria-label="Share product on WhatsApp"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        width: '100%',
        minHeight: '48px',
        padding: '0 20px',
        border: 'none',
        borderRadius: '999px',
        color: '#fff',
        background: '#25D366',
        fontFamily: 'var(--font-display, "Outfit")',
        fontSize: '14px',
        fontWeight: 800,
        cursor: 'pointer',
        boxShadow: '0 10px 30px rgba(37, 211, 102, 0.35)',
        transition: 'all 0.35s var(--spring)',
      }}
    >
      <MessageCircle size={18} />
      <span>Share on WhatsApp</span>
    </motion.button>
  );
}
