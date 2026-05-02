'use client';
import { useEffect, ReactNode } from 'react';
import { useThemeStore } from '@/features/theme/themeStore';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
}
