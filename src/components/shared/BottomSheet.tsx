'use client';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

/** iOS-style draggable bottom sheet */
export default function BottomSheet({ isOpen, onClose, children, title }: Props) {
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 200,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201,
              background: 'var(--bg-secondary)',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
            }}
          >
            {/* Drag indicator */}
            <div style={{
              display: 'flex', justifyContent: 'center', padding: '12px 0 4px',
              cursor: 'grab',
            }}>
              <div style={{
                width: '36px', height: '5px', borderRadius: '3px',
                background: 'var(--border-glass-strong)',
              }} />
            </div>

            {title && (
              <div style={{
                padding: '8px 20px 16px',
                fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600,
                borderBottom: '1px solid var(--border-glass)',
              }}>
                {title}
              </div>
            )}

            <div style={{ padding: '16px 20px 32px' }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
