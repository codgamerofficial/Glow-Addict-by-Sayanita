'use client';

import { useEffect } from 'react';

interface LenisProviderProps {
  children: React.ReactNode;
}

// Check if lenis is available
let lenisInstance: any = null;

export function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    // Native smooth scroll fallback keeps UX polished when Lenis is unavailable.
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);
  
  return <>{children}</>;
}

export function useSmoothScroll() {
  return {
    scrollTo: (target: string | number | HTMLElement, options?: any) => {
      if (lenisInstance) {
        lenisInstance.scrollTo(target, options);
      } else {
        const top = typeof target === 'string' 
          ? (document.querySelector(target)?.getBoundingClientRect().top ?? 0) + window.scrollY
          : typeof target === 'number' ? target : target.offsetTop;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    },
    stop: () => lenisInstance?.stop(),
    start: () => lenisInstance?.start(),
  };
}

export function SmoothScrollLink({
  href,
  children,
  className,
  offset = 0,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  offset?: number;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      if (lenisInstance) {
        lenisInstance.scrollTo(top, { duration: 1.5 });
      } else {
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}