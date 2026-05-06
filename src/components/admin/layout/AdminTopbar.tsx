'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, Plus, Moon, Sun, Menu, ChevronDown } from 'lucide-react';

interface Props { onMenuToggle: () => void; }

export function AdminTopbar({ onMenuToggle }: Props) {
  const [dark, setDark] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const toggleTheme = () => {
    setDark(d => !d);
    document.documentElement.setAttribute('data-theme', dark ? 'light' : '');
  };

  return (
    <header style={{
      height: 64, padding: '0 24px', display: 'flex', alignItems: 'center', gap: 16,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(20px)',
      position: 'sticky', top: 0, zIndex: 40,
    }}>
      <button aria-label="Toggle menu" onClick={onMenuToggle} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'none' }} className="admin-menu-btn">
        <Menu size={20} />
      </button>

      {/* Search */}
      <div style={{
        flex: 1, maxWidth: 480, position: 'relative',
        background: searchFocused ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
        borderRadius: 12, border: `1px solid ${searchFocused ? 'rgba(233,30,140,0.3)' : 'rgba(255,255,255,0.06)'}`,
        transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', padding: '0 14px',
      }}>
        <Search size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <input
          placeholder="Search products, orders, customers... (⌘K)"
          onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
          style={{ flex: 1, padding: '10px 12px', background: 'none', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: 13 }}
        />
        <kbd style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)' }}>⌘K</kbd>
      </div>

      {/* Quick Actions */}
      <div style={{ position: 'relative' }}>
        <button onClick={() => setShowQuickActions(p => !p)} style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 10,
          background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', color: '#fff', border: 'none',
          cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'Outfit',
        }}>
          <Plus size={16} /> <span>New</span> <ChevronDown size={14} />
        </button>
        {showQuickActions && (
          <div style={{
            position: 'absolute', top: '100%', right: 0, marginTop: 8, minWidth: 180,
            background: 'rgba(20,15,30,0.95)', backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 6,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}>
            {['Product', 'Order', 'Coupon', 'Campaign', 'Notification'].map(item => (
              <Link key={item} href={`/admin/${item.toLowerCase()}s${item === 'Product' ? '/new' : ''}`} style={{
                display: 'block', padding: '10px 14px', borderRadius: 8, fontSize: 13, color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none', transition: 'background 0.2s',
              }} onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                + New {item}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Theme Toggle */}
      <button aria-label="Toggle theme" onClick={toggleTheme} style={{
        width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer',
        color: 'var(--text-secondary)', transition: 'all 0.2s',
      }}>
        {dark ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      {/* Notifications */}
      <button aria-label="View notifications" style={{
        width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer',
        color: 'var(--text-secondary)', position: 'relative',
      }}>
        <Bell size={16} />
        <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#E91E8C', border: '2px solid var(--bg-primary)' }} />
      </button>

      {/* Admin Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 10px', borderRadius: 10, cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>S</div>
        <div style={{ lineHeight: 1.2 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Sayanita</div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Super Admin</div>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          .admin-menu-btn{display:flex!important}
        }
      `}</style>
    </header>
  );
}
