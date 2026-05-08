'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Tag, Megaphone, Bot, Bell, Settings, ChevronLeft, ChevronRight, Sparkles, Layers, UserCheck, FileText, TrendingUp, ScrollText, Shield } from 'lucide-react';

const navSections = [
  { label: 'Main', items: [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  ]},
  { label: 'Catalog', items: [
    { href: '/admin/products', icon: Package, label: 'Products' },
    { href: '/admin/products/categories', icon: Layers, label: 'Categories' },
    { href: '/admin/inventory', icon: TrendingUp, label: 'Inventory' },
  ]},
  { label: 'Sales', items: [
    { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { href: '/admin/customers', icon: Users, label: 'Customers' },
    { href: '/admin/coupons', icon: Tag, label: 'Coupons' },
  ]},
  { label: 'Marketing', items: [
    { href: '/admin/influencers', icon: UserCheck, label: 'Influencers' },
    { href: '/admin/notifications', icon: Bell, label: 'Notifications' },
    { href: '/admin/cms', icon: FileText, label: 'CMS' },
  ]},
  { label: 'AI', items: [
    { href: '/admin/ai', icon: Bot, label: 'AI Engine' },
    { href: '/admin/ai', icon: Sparkles, label: 'Routines' },
  ]},
   { label: 'System', items: [
      { href: '/admin/settings', icon: Settings, label: 'Settings' },
      { href: '/admin/settings/roles', icon: Shield, label: 'Roles & Permissions' },
      { href: '/admin/audit', icon: ScrollText, label: 'Audit Logs' },
   ]},
];

interface Props { open: boolean; onToggle: () => void; }

export function AdminSidebar({ open, onToggle }: Props) {
  const pathname = usePathname();
  return (
    <aside data-admin-sidebar="" style={{
      position: 'fixed', top: 0, left: 0, bottom: 0,
      width: open ? 260 : 72, overflow: 'hidden',
      background: 'linear-gradient(180deg, rgba(20,10,30,0.98) 0%, rgba(15,8,25,0.99) 100%)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
      zIndex: 50, display: 'flex', flexDirection: 'column',
      backdropFilter: 'blur(20px)',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#fff', flexShrink: 0 }}>G</div>
        {open && <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <div style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: 16, color: '#fff' }}>Glow Addict</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Admin Panel</div>
        </div>}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }} className="hide-scrollbar">
        {navSections.map(section => (
          <div key={section.label} style={{ marginBottom: 20 }}>
            {open && <div style={{ padding: '4px 12px', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.25)', marginBottom: 4 }}>{section.label}</div>}
            {section.items.map(item => {
              const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link key={item.href + item.label} href={item.href} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: open ? '10px 12px' : '10px 0',
                  justifyContent: open ? 'flex-start' : 'center',
                  borderRadius: 10, marginBottom: 2, textDecoration: 'none',
                  background: active ? 'linear-gradient(135deg, rgba(233,30,140,0.15), rgba(124,58,237,0.1))' : 'transparent',
                  color: active ? '#F5B7C5' : 'rgba(255,255,255,0.5)',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}>
                  {active && <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, borderRadius: 2, background: 'linear-gradient(180deg, #E91E8C, #7C3AED)' }} />}
                  <Icon size={18} style={{ flexShrink: 0 }} />
                  {open && <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button onClick={onToggle} style={{
        padding: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderTop: '1px solid rgba(255,255,255,0.06)', background: 'none', border: 'none',
        color: 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'color 0.2s',
      }}>
        {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>
    </aside>
  );
}
