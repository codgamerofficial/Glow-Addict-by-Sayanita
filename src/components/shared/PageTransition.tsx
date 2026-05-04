'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

/** Wraps page content with a smooth fade+slide entrance animation */
export default function PageTransition({ children, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94], // iOS spring-like curve
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
