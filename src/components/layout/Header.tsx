'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Heart, User, Sun, Moon, Menu, X } from 'lucide-react';
import { useCartStore } from '@/features/cart/cartStore';
import { useWishlistStore } from '@/features/wishlist/wishlistStore';
import { useThemeStore } from '@/features/theme/themeStore';
import { SearchBar } from '@/components/shared/SearchBar';
import { useHydrated } from '@/hooks/useHydrated';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const hydrated = useHydrated();
  const itemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { theme, toggleTheme } = useThemeStore();

  // Track scroll for enhanced blur/shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/products?category=skincare', label: 'Skincare' },
    { href: '/products?category=makeup', label: 'Makeup' },
    { href: '/products?category=hair-care', label: 'Hair' },
    { href: '/products?category=fragrances', label: 'Fragrances' },
    { href: '/products', label: 'All Products' },
    { href: '/ai-assistant', label: '✨ AI Beauty' },
  ];

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'var(--bg-glass)' : 'rgba(0,0,0,0.01)',
        backdropFilter: `blur(${scrolled ? 24 : 12}px)`,
        WebkitBackdropFilter: `blur(${scrolled ? 24 : 12}px)`,
        borderBottom: `1px solid ${scrolled ? 'var(--border-glass-strong)' : 'var(--border-glass)'}`,
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.4s cubic-bezier(0.28, 0.11, 0.32, 1)',
      }}>

        {/* Main nav */}
        <div className="container-main" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: '64px', gap: '16px',
        }}>
          {/* Mobile menu btn */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none', border: 'none', color: 'var(--text-primary)',
              cursor: 'pointer', display: 'none', padding: '4px',
            }}
            className="mobile-menu-btn"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0', flexShrink: 0 }}>
            <motion.img
              src="/images/logo.png"
              alt="Glow Addict by Sayanita"
              style={{ height: '52px', width: 'auto', objectFit: 'contain' }}
              whileTap={{ scale: 0.95 }}
            />
          </Link>

          {/* Desktop nav links */}
          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }} className="desktop-nav">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} style={{
                textDecoration: 'none', color: 'var(--text-secondary)',
                fontSize: '14px', fontWeight: 500, transition: 'color 0.2s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => setSearchOpen(!searchOpen)} style={{
              background: 'none', border: 'none', color: 'var(--text-secondary)',
              cursor: 'pointer', padding: '8px', borderRadius: '10px', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-glass)'; e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <Search size={20} />
            </motion.button>

            <motion.button whileTap={{ scale: 0.85 }} onClick={toggleTheme} style={{
              background: 'none', border: 'none', color: 'var(--text-secondary)',
              cursor: 'pointer', padding: '8px', borderRadius: '10px', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-glass)'; e.currentTarget.style.color = 'var(--accent-gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <motion.div
                key={hydrated ? theme : 'default'}
                initial={{ rotate: -30, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
              >
                {(!hydrated || theme === 'dark') ? <Sun size={20} /> : <Moon size={20} />}
              </motion.div>
            </motion.button>

            <Link href="/wishlist" style={{
              position: 'relative', color: 'var(--text-secondary)', padding: '8px',
              borderRadius: '10px', transition: 'all 0.2s', display: 'flex',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <Heart size={20} />
              {hydrated && wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  style={{
                    position: 'absolute', top: '2px', right: '2px',
                    background: 'var(--primary)', color: 'white', borderRadius: '50%',
                    width: '16px', height: '16px', fontSize: '10px', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {wishlistCount}
                </motion.span>
              )}
            </Link>

            <Link href="/cart" style={{
              position: 'relative', color: 'var(--text-secondary)', padding: '8px',
              borderRadius: '10px', transition: 'all 0.2s', display: 'flex',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <ShoppingBag size={20} />
              {hydrated && itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  style={{
                    position: 'absolute', top: '2px', right: '2px',
                    background: 'var(--primary)', color: 'white', borderRadius: '50%',
                    width: '16px', height: '16px', fontSize: '10px', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {itemCount}
                </motion.span>
              )}
            </Link>

            <Link href="/profile" style={{
              color: 'var(--text-secondary)', padding: '8px',
              borderRadius: '10px', transition: 'all 0.2s', display: 'flex',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <User size={20} />
            </Link>
          </div>
        </div>

        {/* Search dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ overflow: 'hidden', borderTop: '1px solid var(--border-glass)' }}
            >
              <div style={{ padding: '0 16px 16px' }}>
                <div className="container-main">
                  <SearchBar onClose={() => setSearchOpen(false)} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                overflow: 'hidden',
                borderTop: '1px solid var(--border-glass)',
              }}
            >
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Link href={link.href} onClick={() => setMenuOpen(false)} style={{
                      textDecoration: 'none', color: 'var(--text-secondary)',
                      fontSize: '16px', fontWeight: 500, padding: '10px 0', display: 'block',
                    }}>
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer */}
      <div style={{ height: '68px' }} />

      <style jsx global>{`
        @media (min-width: 768px) {
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 767px) {
          .mobile-menu-btn { display: flex !important; }
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </>
  );
}
