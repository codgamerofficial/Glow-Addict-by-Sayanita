'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right';

export function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  distance = 40,
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: Direction;
  distance?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const offsets = {
    up: { x: 0, y: distance },
    down: { x: 0, y: -distance },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  };

  const offset = offsets[direction];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: offset.x, y: offset.y, scale: 0.985 }}
      animate={isInView ? { opacity: 1, x: 0, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.62, delay, ease: [0.2, 0.75, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
