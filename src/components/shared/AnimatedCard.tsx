'use client';
import { motion } from 'framer-motion';
import { ReactNode, useRef, useEffect, useState } from 'react';

interface Props {
  children: ReactNode;
  index?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Animates children when they enter the viewport.
 * Staggered delay based on index for card grids.
 */
export default function AnimatedCard({ children, index = 0, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '20px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.08, 0.4), // cap stagger at 400ms
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileTap={{ scale: 0.97 }} // iOS press feedback
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
