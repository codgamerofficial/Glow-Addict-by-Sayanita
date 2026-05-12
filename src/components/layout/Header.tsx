'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Menu, Moon, Search, ShoppingBag, Sparkles, Sun, User, X } from 'lucide-react';
import { useCartStore } from '@/features/cart/cartStore';
import { useWishlistStore } from '@/features/wishlist/wishlistStore';
import { useThemeStore } from '@/features/theme/themeStore';
import { SearchBar } from '@/components/shared/SearchBar';
import { useHydrated } from '@/hooks/useHydrated';
import { useAuthStore } from '@/features/auth/authStore';

const navLinks = [
  { href: '/products?category=skincare', label: 'Skincare' },
  { href: '/products?category=makeup', label: 'Makeup' },
  { href: '/products?category=bodycare', label: 'Body' },
  { href: '/products?category=haircare', label: 'Hair' },
  { href: '/products?category=tools', label: 'Tools' },
  { href: '/products', label: 'Sale' },
  { href: '/ai-assistant', label: 'Glow AI' },
];

function IconButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      aria-label={label}
      onClick={onClick}
      className="header-icon-button"
      type="button"
    >
      {children}
    </motion.button>
  );
}

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <motion.span
      key={count}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 16 }}
      className="header-count"
    >
      {count > 9 ? '9+' : count}
    </motion.span>
  );
}

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hydrated = useHydrated();
  const itemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { theme, toggleTheme } = useThemeStore();
  const { isAuthenticated, isInitialized } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="top-ribbon">
        <div className="top-ribbon-track">
          {[...Array(2)].map((_, group) => (
            <div key={group} className="top-ribbon-group">
              <span>Pink Summer Sale live</span>
              <span>Extra 20% off first order</span>
              <span>Free gift above &#8377;749</span>
              <span>15-day easy returns</span>
            </div>
          ))}
        </div>
      </div>

      <header className={`site-header ${scrolled ? 'site-header-scrolled' : ''}`}>
        <div className="container-main header-inner">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Open menu"
            type="button"
            className="mobile-menu-btn header-icon-button"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </motion.button>

          <Link href="/" className="header-logo" aria-label="Glow Addict home">
            <span className="brand-wordmark">
              <span>GLOW</span>
              <span>ADDICT</span>
            </span>
            <span className="header-logo-dot" />
          </Link>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <IconButton label="Search" onClick={() => setSearchOpen((open) => !open)}>
              <Search size={20} />
            </IconButton>

            <IconButton label="Toggle color theme" onClick={toggleTheme}>
              <motion.span
                key={hydrated ? theme : 'light'}
                initial={{ rotate: -30, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', damping: 13 }}
                style={{ display: 'inline-flex' }}
              >
                {hydrated && theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </motion.span>
            </IconButton>

            <Link href="/wishlist" aria-label={hydrated ? `Wishlist (${wishlistCount})` : 'Wishlist'} className="header-icon-link">
              <Heart size={20} />
              {hydrated && <CountBadge count={wishlistCount} />}
            </Link>

            <Link href="/cart" aria-label={hydrated ? `Cart (${itemCount})` : 'Cart'} className="header-icon-link header-cart-link">
              <ShoppingBag size={20} />
              {hydrated && <CountBadge count={itemCount} />}
            </Link>

            {hydrated && isInitialized && (
              isAuthenticated ? (
                <Link href="/profile" aria-label="Profile" className="header-icon-link profile-link">
                  <User size={20} />
                </Link>
              ) : (
                <Link href="/login" className="header-auth-link sign-up">Sign In</Link>
              )
            )}
          </div>
        </div>

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.28, 0.11, 0.32, 1] }}
              className="header-search-panel"
            >
              <div className="container-main">
                <SearchBar onClose={() => setSearchOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.28, 0.11, 0.32, 1] }}
              className="mobile-menu-panel"
              aria-label="Mobile navigation"
            >
              <div className="container-main mobile-menu-grid">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.035 }}
                  >
                    <Link href={link.href} onClick={() => setMenuOpen(false)}>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <Link href="/ai-assistant" onClick={() => setMenuOpen(false)} className="mobile-ai-link">
                  <Sparkles size={18} /> Personalize my routine
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <div className="header-spacer" />

      <style jsx global>{`
        .top-ribbon {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 110;
          height: 34px;
          overflow: hidden;
          color: #fff;
          background: linear-gradient(90deg, #fe347f, #ff743b, #7a2cff);
          box-shadow: 0 6px 24px rgba(245, 31, 123, 0.22);
        }

        .top-ribbon-track {
          display: flex;
          width: max-content;
          animation: marquee 26s linear infinite;
        }

        .top-ribbon-group {
          display: flex;
          align-items: center;
          height: 34px;
          gap: 38px;
          padding-right: 38px;
          white-space: nowrap;
          font-family: var(--font-display);
          font-size: 12px;
          font-weight: 800;
        }

        .top-ribbon-group span::before {
          content: "";
          display: inline-block;
          width: 5px;
          height: 5px;
          margin-right: 10px;
          border-radius: 999px;
          background: #fff;
          vertical-align: middle;
        }

        .site-header {
          position: fixed;
          top: 34px;
          left: 0;
          right: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.68);
          border-bottom: 1px solid transparent;
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          transition: all 0.35s var(--spring);
        }

        [data-theme="dark"] .site-header {
          background: rgba(16, 8, 18, 0.72);
        }

        .site-header-scrolled {
          background: var(--bg-glass);
          border-bottom-color: var(--border-glass);
          box-shadow: 0 12px 40px rgba(70, 24, 48, 0.1);
        }

        .header-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
          gap: 18px;
        }

        .header-logo {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .header-logo-dot {
          width: 9px;
          height: 9px;
          border-radius: 999px;
          background: var(--citrus);
          box-shadow: 0 0 0 5px rgba(255, 212, 71, 0.22);
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 6px;
          border: 1px solid var(--line);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.58);
        }

        [data-theme="dark"] .desktop-nav {
          background: rgba(255, 255, 255, 0.05);
        }

        .desktop-nav a {
          padding: 10px 14px;
          border-radius: 999px;
          color: var(--text-secondary);
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.2s var(--spring);
        }

        .desktop-nav a:hover {
          color: var(--primary);
          background: var(--bg-surface-hover);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .header-icon-button,
        .header-icon-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          color: var(--text-secondary);
          background: rgba(255, 255, 255, 0.56);
          border: 1px solid var(--line);
          border-radius: 999px;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.22s var(--spring);
        }

        [data-theme="dark"] .header-icon-button,
        [data-theme="dark"] .header-icon-link {
          background: rgba(255, 255, 255, 0.06);
        }

        .header-icon-button:hover,
        .header-icon-link:hover {
          color: var(--primary);
          transform: translateY(-1px);
          border-color: rgba(245, 31, 123, 0.28);
          box-shadow: 0 10px 28px rgba(245, 31, 123, 0.12);
        }

        .header-cart-link {
          color: #fff;
          background: var(--text-primary);
          border-color: var(--text-primary);
        }

        .header-cart-link:hover {
          color: #fff;
          background: var(--primary);
          border-color: var(--primary);
        }

        .header-count {
          position: absolute;
          top: -5px;
          right: -4px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 5px;
          border: 2px solid var(--bg-secondary);
          border-radius: 999px;
          color: #fff;
          background: var(--primary);
          font-size: 10px;
          font-weight: 900;
          line-height: 1;
        }

        .header-search-panel,
        .mobile-menu-panel {
          overflow: hidden;
          border-top: 1px solid var(--line);
          background: var(--bg-glass);
        }

        .header-search-panel .container-main {
          padding-top: 14px;
          padding-bottom: 18px;
        }

        .mobile-menu-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          padding-top: 16px;
          padding-bottom: 18px;
        }

        .mobile-menu-grid a {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 48px;
          padding: 12px;
          border: 1px solid var(--line);
          border-radius: 16px;
          color: var(--text-primary);
          background: var(--bg-surface);
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 800;
          text-decoration: none;
        }

        .mobile-menu-grid .mobile-ai-link {
          grid-column: 1 / -1;
          gap: 8px;
          color: #fff;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
        }

        .header-auth-link {
          padding: 8px 16px;
          border-radius: 999px;
          text-decoration: none;
          font-family: var(--font-display);
          font-size: 13px;
          font-weight: 800;
          white-space: nowrap;
          color: #fff;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          transition: all 0.2s var(--spring);
        }

        .header-auth-link:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 28px rgba(245, 31, 123, 0.22);
        }

        .header-spacer {
          height: 106px;
        }

        .mobile-menu-btn {
          display: none;
        }

        @media (max-width: 1180px) {
          .desktop-nav {
            display: none;
          }

          .mobile-menu-btn {
            display: inline-flex;
          }
        }

        @media (max-width: 767px) {
          .top-ribbon {
            height: 30px;
          }

          .top-ribbon-group {
            height: 30px;
            gap: 28px;
            padding-right: 28px;
            font-size: 11px;
          }

          .site-header {
            top: 30px;
          }

          .header-inner {
            height: 62px;
            gap: 10px;
          }

          .brand-wordmark {
            font-size: 20px;
          }

          .header-icon-button,
          .header-icon-link {
            width: 38px;
            height: 38px;
          }

          .profile-link {
            display: none;
          }

          .header-spacer {
            height: 92px;
          }
        }
      `}</style>
    </>
  );
}
