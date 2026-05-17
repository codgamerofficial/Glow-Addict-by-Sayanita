'use client';

import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy';
  borderGradient?: boolean;
  glowEffect?: boolean;
  hoverLift?: boolean;
}

const cn = (...classes: (string | undefined | boolean)[]) => classes.filter(Boolean).join(' ');

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(({
  children,
  className,
  intensity = 'medium',
  borderGradient = false,
  glowEffect = false,
  hoverLift = true,
  ...props
}, ref) => {
  const intensityClasses = {
    light: 'bg-white/40 backdrop-blur-md border-white/30',
    medium: 'bg-white/60 backdrop-blur-xl border-white/40',
    heavy: 'bg-white/80 backdrop-blur-2xl border-white/50',
  };

  const shadowClasses = {
    light: 'shadow-lg shadow-black/5',
    medium: 'shadow-xl shadow-black/10',
    heavy: 'shadow-2xl shadow-black/15',
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        'relative rounded-3xl overflow-hidden',
        'border transition-all duration-300',
        intensityClasses[intensity],
        shadowClasses[intensity],
        borderGradient && 'p-[1px]',
        hoverLift && 'hover:transform hover:-translate-y-1 hover:shadow-2xl',
        className
      )}
      whileHover={hoverLift ? { y: -4, transition: { duration: 0.3 } } : undefined}
      {...props}
    >
      {borderGradient && (
        <>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-[1px] rounded-[calc(1.5rem-1px)] bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl z-10" />
          <div className="relative z-20 h-full">
            {children}
          </div>
        </>
      )}
      
      {!borderGradient && (
        <>
          {glowEffect && (
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-0 blur group-hover:opacity-30 transition-opacity duration-300 -z-10" />
          )}
          {children}
        </>
      )}
    </motion.div>
  );
});

GlassCard.displayName = 'GlassCard';