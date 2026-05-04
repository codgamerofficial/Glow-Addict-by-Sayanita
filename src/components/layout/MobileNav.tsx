'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Sparkles, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '@/features/cart/cartStore';
import { useHydrated } from '@/hooks/useHydrated';
import { motion } from 'framer-motion';

const tabs = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/products', icon: Search, label: 'Shop' },
  { href: '/ai-assistant', icon: Sparkles, label: 'AI Beauty' },
  { href: '/cart', icon: ShoppingBag, label: 'Cart' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <>
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: 'var(--bg-glass)', backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid var(--border-glass)',
        padding: '4px 0 env(safe-area-inset-bottom, 8px)',
        display: 'flex', justifyContent: 'space-around',
      }} className="mobile-bottom-nav">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
          const Icon = tab.icon;
          return (
            <Link key={tab.href} href={tab.href} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
              textDecoration: 'none', padding: '6px 12px', position: 'relative',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
            }}>
              <motion.div
                whileTap={{ scale: 0.8 }}
                animate={{ y: isActive ? -2 : 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                style={{ position: 'relative' }}
              >
                <Icon size={22} />
                {tab.label === 'Cart' && hydrated && itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 12 }}
                    style={{
                      position: 'absolute', top: '-4px', right: '-8px',
                      background: 'var(--primary)', color: 'white', borderRadius: '50%',
                      width: '16px', height: '16px', fontSize: '9px', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {itemCount}
                  </motion.span>
                )}
              </motion.div>
              <span style={{ fontSize: '10px', fontWeight: isActive ? 600 : 400, transition: 'all 0.2s' }}>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="mobile-tab-indicator"
                  style={{
                    position: 'absolute', top: '-1px', left: '50%', transform: 'translateX(-50%)',
                    width: '20px', height: '3px', borderRadius: '2px',
                    background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
      <div style={{ height: '70px' }} className="mobile-nav-spacer" />
      <style jsx global>{`
        @media (min-width: 768px) {
          .mobile-bottom-nav { display: none !important; }
          .mobile-nav-spacer { display: none !important; }
        }
      `}</style>
    </>
  );
}
