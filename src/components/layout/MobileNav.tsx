'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Search, ShoppingBag, Sparkles, User } from 'lucide-react';
import { useCartStore } from '@/features/cart/cartStore';
import { useHydrated } from '@/hooks/useHydrated';
import { catalogMedia } from '@/data/catalog';

const tabs = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/products', icon: Search, label: 'Shop' },
  { href: '/ai-assistant', icon: Sparkles, label: 'AI' },
  { href: '/cart', icon: ShoppingBag, label: 'Bag' },
  { href: '/profile', icon: User, label: 'You' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <>
      <nav className="mobile-bottom-nav" aria-label="Mobile quick navigation">
        <div className="mobile-brand-pill" aria-hidden="true">
          <img src={catalogMedia.logo} alt="" />
        </div>
        {tabs.map((tab) => {
          const active = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
          const Icon = tab.icon;
          return (
            <Link key={tab.href} href={tab.href} className={`mobile-tab ${active ? 'mobile-tab-active' : ''}`}>
              <motion.span
                whileTap={{ scale: 0.85 }}
                animate={{ y: active ? -3 : 0 }}
                transition={{ type: 'spring', stiffness: 430, damping: 24 }}
                className="mobile-tab-icon"
              >
                <Icon size={22} />
                {tab.href === '/cart' && hydrated && itemCount > 0 && (
                  <span className="mobile-tab-count">{itemCount > 9 ? '9+' : itemCount}</span>
                )}
              </motion.span>
              <span>{tab.label}</span>
              {active && <motion.i layoutId="mobile-nav-pill" transition={{ type: 'spring', stiffness: 430, damping: 28 }} />}
            </Link>
          );
        })}
      </nav>
      <div className="mobile-nav-spacer" />

      <style jsx global>{`
        .mobile-bottom-nav {
          position: fixed;
          right: 12px;
          bottom: 12px;
          left: 12px;
          z-index: 100;
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 8px 8px 8px 48px;
          padding-bottom: calc(8px + env(safe-area-inset-bottom));
          border: 1px solid var(--line);
          border-radius: 28px;
          background: var(--bg-glass);
          box-shadow: 0 20px 60px rgba(55, 21, 43, 0.18);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }

        .mobile-brand-pill {
          position: absolute;
          left: 10px;
          top: 50%;
          width: 30px;
          height: 30px;
          border-radius: 999px;
          overflow: hidden;
          border: 1px solid var(--line);
          background: rgba(255, 255, 255, 0.84);
          transform: translateY(-50%);
        }

        .mobile-brand-pill img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .mobile-tab {
          position: relative;
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 3px;
          min-height: 54px;
          color: var(--text-muted);
          text-decoration: none;
          isolation: isolate;
        }

        .mobile-tab > span:last-child {
          font-size: 10px;
          font-weight: 900;
          line-height: 1;
        }

        .mobile-tab-icon {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-tab-active {
          color: #fff;
        }

        .mobile-tab i {
          position: absolute;
          inset: 0;
          z-index: -1;
          border-radius: 20px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          box-shadow: 0 12px 28px rgba(245, 31, 123, 0.26);
        }

        .mobile-tab-count {
          position: absolute;
          top: -9px;
          right: -11px;
          display: grid;
          place-items: center;
          min-width: 17px;
          height: 17px;
          padding: 0 4px;
          border: 2px solid var(--bg-surface);
          border-radius: 999px;
          color: #fff;
          background: var(--primary);
          font-size: 9px;
          font-weight: 900;
        }

        .mobile-nav-spacer {
          display: none;
          height: 86px;
        }

        @media (max-width: 767px) {
          .mobile-bottom-nav,
          .mobile-nav-spacer {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}
