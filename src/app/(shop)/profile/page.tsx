'use client';
import { User, Heart, ShoppingBag, Star, Gift, Settings, LogOut, ChevronRight, Sparkles, Camera } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/features/auth/authStore';
import { useCartStore } from '@/features/cart/cartStore';
import { useWishlistStore } from '@/features/wishlist/wishlistStore';

export default function ProfilePage() {
  const user = useAuthStore(s => s.user);
  const cartCount = useCartStore(s => s.getItemCount());
  const wishlistCount = useWishlistStore(s => s.items.length);

  const orders = [
    { id: 'GA847291', date: 'Apr 28, 2026', status: 'Delivered', total: 1899, items: 3 },
    { id: 'GA832156', date: 'Apr 15, 2026', status: 'Shipped', total: 2499, items: 5 },
    { id: 'GA819843', date: 'Mar 30, 2026', status: 'Delivered', total: 799, items: 1 },
  ];

  const statusColor: Record<string, string> = { Delivered: 'var(--success)', Shipped: 'var(--accent-gold)', Processing: 'var(--primary)', Cancelled: 'var(--error)' };

  return (
    <div className="container-main animate-fade-in" style={{ padding: '24px 16px', maxWidth: '900px' }}>
      {/* Profile card */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', fontWeight: 700, color: 'white', fontFamily: 'Outfit',
          position: 'relative', flexShrink: 0,
        }}>
          {user?.name?.[0] || 'S'}
          <div style={{
            position: 'absolute', bottom: 0, right: 0, width: '24px', height: '24px', borderRadius: '50%',
            background: 'var(--bg-surface)', border: '2px solid var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}><Camera size={10} style={{ color: 'var(--primary)' }} /></div>
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h1 style={{ fontFamily: 'Outfit', fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>{user?.name || 'Beauty Lover'}</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '8px' }}>{user?.email}</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {user?.skinType && <span className="badge badge-primary">{user.skinType} Skin</span>}
            <span className="badge badge-gold"><Gift size={12} /> {user?.loyaltyPoints?.toLocaleString()} Points</span>
          </div>
        </div>
        <Link href="/skin-analyzer" className="btn-outline" style={{ textDecoration: 'none', padding: '10px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} /> Analyze Skin
        </Link>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { icon: ShoppingBag, label: 'Orders', value: orders.length, href: '#orders' },
          { icon: Heart, label: 'Wishlist', value: wishlistCount, href: '/wishlist' },
          { icon: Star, label: 'Reviews', value: 8, href: '#' },
          { icon: Gift, label: 'Rewards', value: `${user?.loyaltyPoints}`, href: '#' },
        ].map(({ icon: Icon, label, value, href }) => (
          <Link key={label} href={href} className="glass-card" style={{ padding: '16px', textAlign: 'center', textDecoration: 'none', color: 'var(--text-primary)' }}>
            <Icon size={22} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
            <div style={{ fontFamily: 'Outfit', fontSize: '22px', fontWeight: 700 }}>{value}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{label}</div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div id="orders">
        <h2 style={{ fontFamily: 'Outfit', fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Recent Orders</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
          {orders.map(order => (
            <div key={order.id} className="glass-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>#{order.id}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{order.date} • {order.items} items</div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div>
                  <div style={{ fontFamily: 'Outfit', fontSize: '15px', fontWeight: 600 }}>₹{order.total.toLocaleString()}</div>
                  <span className="badge" style={{ background: `${statusColor[order.status]}20`, color: statusColor[order.status], fontSize: '11px' }}>{order.status}</span>
                </div>
                <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {[
          { icon: Settings, label: 'Account Settings', href: '#' },
          { icon: Gift, label: 'Rewards & Offers', href: '#' },
          { icon: LogOut, label: 'Logout', href: '/', color: 'var(--error)' },
        ].map(({ icon: Icon, label, href, color }) => (
          <Link key={label} href={href} className="glass-card" style={{
            padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px',
            textDecoration: 'none', color: color || 'var(--text-primary)', borderRadius: '12px',
          }}>
            <Icon size={18} />
            <span style={{ flex: 1, fontSize: '14px', fontWeight: 500 }}>{label}</span>
            <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
          </Link>
        ))}
      </div>
    </div>
  );
}
