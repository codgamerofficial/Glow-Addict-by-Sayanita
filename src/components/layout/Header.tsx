'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Heart, User, Sun, Moon, Menu, X } from 'lucide-react';
import { useCartStore } from '@/features/cart/cartStore';
import { useWishlistStore } from '@/features/wishlist/wishlistStore';
import { useThemeStore } from '@/features/theme/themeStore';
import { SearchBar } from '@/components/shared/SearchBar';
import { useHydrated } from '@/hooks/useHydrated';

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const hydrated = useHydrated();
  const itemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { theme, toggleTheme } = useThemeStore();

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
        background: 'var(--bg-glass)', backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-glass)',
      }}>
        {/* Top banner */}
        <div style={{
          background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
          padding: '6px 16px', textAlign: 'center', fontSize: '12px',
          fontWeight: 600, color: 'white', letterSpacing: '0.05em',
        }}>
          🎉 FLAT 30% OFF on your first order! Use code: <span style={{ textDecoration: 'underline' }}>GLOW30</span> &nbsp;|&nbsp; Free shipping above ₹499
        </div>

        {/* Main nav */}
        <div className="container-main" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: '64px', gap: '16px',
        }}>
          {/* Mobile menu btn */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: 'none', border: 'none', color: 'var(--text-primary)',
            cursor: 'pointer', display: 'none', padding: '4px',
          }} className="mobile-menu-btn">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0', flexShrink: 0 }}>
            <img
              src="/images/logo.png"
              alt="Glow Addict by Sayanita"
              style={{ height: '52px', width: 'auto', objectFit: 'contain' }}
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
            <button onClick={() => setSearchOpen(!searchOpen)} style={{
              background: 'none', border: 'none', color: 'var(--text-secondary)',
              cursor: 'pointer', padding: '8px', borderRadius: '10px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-glass)'; e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <Search size={20} />
            </button>

            <button onClick={toggleTheme} style={{
              background: 'none', border: 'none', color: 'var(--text-secondary)',
              cursor: 'pointer', padding: '8px', borderRadius: '10px', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-glass)'; e.currentTarget.style.color = 'var(--accent-gold)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {(!hydrated || theme === 'dark') ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link href="/wishlist" style={{
              position: 'relative', color: 'var(--text-secondary)', padding: '8px',
              borderRadius: '10px', transition: 'all 0.2s', display: 'flex',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <Heart size={20} />
              {hydrated && wishlistCount > 0 && (
                <span style={{
                  position: 'absolute', top: '2px', right: '2px',
                  background: 'var(--primary)', color: 'white', borderRadius: '50%',
                  width: '16px', height: '16px', fontSize: '10px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{wishlistCount}</span>
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
                <span style={{
                  position: 'absolute', top: '2px', right: '2px',
                  background: 'var(--primary)', color: 'white', borderRadius: '50%',
                  width: '16px', height: '16px', fontSize: '10px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{itemCount}</span>
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
        {searchOpen && (
          <div style={{
            padding: '0 16px 16px', borderTop: '1px solid var(--border-glass)',
          }}>
            <div className="container-main">
              <SearchBar onClose={() => setSearchOpen(false)} />
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            padding: '16px', borderTop: '1px solid var(--border-glass)',
            display: 'flex', flexDirection: 'column', gap: '12px',
          }}>
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{
                textDecoration: 'none', color: 'var(--text-secondary)',
                fontSize: '16px', fontWeight: 500, padding: '8px 0',
              }}>
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Spacer */}
      <div style={{ height: '94px' }} />

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
