'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView, useAnimation, Transition, Variant } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  easing?: 'spring' | 'easeInOut' | 'easeOut';
  once?: boolean;
  staggerChildren?: number;
  container?: boolean;
  className?: string;
}

const directionVariants: Record<string, Variant> = {
  up: { y: 0, opacity: 1 },
  down: { y: 0, opacity: 1 },
  left: { x: 0, opacity: 1 },
  right: { x: 0, opacity: 1 },
};

const initialVariants: Record<string, Variant> = {
  up: { y: 60, opacity: 0 },
  down: { y: -60, opacity: 0 },
  left: { x: 60, opacity: 0 },
  right: { x: -60, opacity: 0 },
};

const EASING_CONFIGS: Record<string, Transition> = {
  spring: { type: 'spring', damping: 25, stiffness: 300 },
  easeInOut: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
  easeOut: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
};

export function ScrollReveal({
  children,
  delay = 0,
  duration,
  distance = 60,
  direction = 'up',
  easing = 'spring',
  once = true,
  staggerChildren,
  container = false,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: '-100px 0px' });
  const controls = useAnimation();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [isInView, controls, once]);

  const transitionConfig = duration 
    ? { ...EASING_CONFIGS[easing], duration } 
    : EASING_CONFIGS[easing];

  const variants = {
    hidden: {
      ...initialVariants[direction],
      transition: { duration: 0.3 },
    },
    visible: {
      ...directionVariants[direction],
      transition: {
        ...transitionConfig,
        delay,
        staggerChildren: staggerChildren,
        delayChildren: staggerChildren ? delay + 0.1 : undefined,
      },
    },
  };

  const childVariants = staggerChildren
    ? {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
        },
      }
    : undefined;

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={controls}
      variants={container ? undefined : variants}
    >
      {staggerChildren && container ? (
        <motion.div variants={variants}>
          {children}
        </motion.div>
      ) : (
        children
      )}
    </motion.div>
  );
}

ScrollReveal.displayName = 'ScrollReveal';