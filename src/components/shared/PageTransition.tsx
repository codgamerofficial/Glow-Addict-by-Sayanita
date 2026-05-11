'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/** Wraps page content with a smooth fade+slide entrance animation */
export default function PageTransition({ children, className, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.99 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.2, 0.8, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
