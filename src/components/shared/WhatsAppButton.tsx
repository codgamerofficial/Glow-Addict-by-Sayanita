'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppMessage } from '@/lib/commerce';

export default function WhatsAppButton() {
  const whatsappUrl = buildWhatsAppMessage('Hi Glow Addict, I want to order this product.');

  const handleClick = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <style jsx global>{`
        .whatsapp-float-wrapper {
          position: fixed;
          z-index: 9999;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.35s var(--spring);
        }

        .whatsapp-float-inner {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          border: none;
          border-radius: 999px;
          color: #fff;
          background: #25D366;
          box-shadow: 0 10px 40px rgba(37, 211, 102, 0.45), 0 2px 8px rgba(37, 211, 102, 0.3);
          cursor: pointer;
          transition: all 0.35s var(--spring);
          position: relative;
        }

        .whatsapp-float-inner:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 16px 50px rgba(37, 211, 102, 0.55), 0 4px 12px rgba(37, 211, 102, 0.4);
        }

        .whatsapp-float-inner:active {
          transform: translateY(0) scale(0.97);
        }

        .whatsapp-float-inner svg {
          width: 28px;
          height: 28px;
        }

        .whatsapp-label {
          position: absolute;
          right: 68px;
          top: 50%;
          transform: translateY(-50%);
          white-space: nowrap;
          padding: 8px 16px;
          border-radius: 999px;
          color: #fff;
          background: #25D366;
          font-family: var(--font-display, "Outfit");
          font-size: 13px;
          font-weight: 800;
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.35);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .whatsapp-float-inner:hover .whatsapp-label {
          opacity: 1;
          transform: translateY(-50%) translateX(-8px);
        }

        @media (max-width: 768px) {
          .whatsapp-float-wrapper {
            width: 54px;
            height: 54px;
            bottom: 90px;
            right: 50%;
            margin-right: -27px; /* half of width to center exactly */
          }

          .whatsapp-float-inner {
            width: 100%;
            height: 100%;
          }

          .whatsapp-label {
            display: none;
          }
        }

        @media (min-width: 769px) {
          .whatsapp-float-wrapper {
            bottom: 28px;
            right: 28px;
          }
        }
      `}</style>

      <motion.div
        className="whatsapp-float-wrapper"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <motion.button
          onClick={handleClick}
          className="whatsapp-float-inner"
          aria-label="Chat with us on WhatsApp"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle />
          <span className="whatsapp-label">Chat with us</span>
        </motion.button>
      </motion.div>
    </>
  );
}
