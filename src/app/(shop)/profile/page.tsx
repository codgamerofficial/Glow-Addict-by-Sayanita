'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Heart, ShoppingBag, Star, Gift, Settings, LogOut, ChevronRight, Sparkles, Camera } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/features/auth/authStore';
import { useCartStore } from '@/features/cart/cartStore';
import { useWishlistStore } from '@/features/wishlist/wishlistStore';
import { getUserOrders } from '@/actions/shop';
import { useState } from 'react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isInitialized } = useAuthStore();
  const cartCount = useCartStore(s => s.getItemCount());
  const wishlistCount = useWishlistStore(s => s.items.length);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
    }
    
    if (isAuthenticated) {
      getUserOrders().then(o => {
        setOrders(o);
        setIsLoadingOrders(false);
      });
    }
  }, [isInitialized, isAuthenticated, router]);


  const statusColor: Record<string, string> = { Delivered: 'var(--success)', Shipped: 'var(--accent-gold)', Processing: 'var(--primary)', Cancelled: 'var(--error)' };

  if (!isAuthenticated) return null;

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
          overflow: 'hidden'
        }}>
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'
          )}
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
            <span className="badge badge-gold"><Gift size={12} /> {user?.loyaltyPoints?.toLocaleString() || 0} Points</span>
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
          { icon: Star, label: 'Reviews', value: 0, href: '#' },
          { icon: Gift, label: 'Rewards', value: `${user?.loyaltyPoints || 0}`, href: '#' },
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
          {isLoadingOrders ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="glass-card animate-pulse" style={{ padding: '16px', height: '64px' }}></div>
            ))
          ) : orders.length > 0 ? (
            orders.map(order => (
              <div key={order.id} className="glass-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600 }}>#{order.id}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{order.date} • {order.items} items</div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div>
                    <div style={{ fontFamily: 'Outfit', fontSize: '15px', fontWeight: 600 }}>₹{order.total.toLocaleString()}</div>
                    <span className="badge" style={{ background: `${statusColor[order.status] || 'var(--primary)'}20`, color: statusColor[order.status] || 'var(--primary)', fontSize: '11px' }}>{order.status}</span>
                  </div>
                  <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
                </div>
              </div>
            ))
          ) : (
            <div className="glass-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <ShoppingBag size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <p style={{ fontSize: '14px' }}>No orders yet. Start your beauty journey today!</p>
              <Link href="/products" style={{ color: 'var(--primary)', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'block', marginTop: '8px' }}>Shop Products</Link>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Link href="#" className="glass-card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'var(--text-primary)', borderRadius: '12px' }}>
          <Settings size={18} />
          <span style={{ flex: 1, fontSize: '14px', fontWeight: 500 }}>Account Settings</span>
          <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
        </Link>
        <Link href="#" className="glass-card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', color: 'var(--text-primary)', borderRadius: '12px' }}>
          <Gift size={18} />
          <span style={{ flex: 1, fontSize: '14px', fontWeight: 500 }}>Rewards & Offers</span>
          <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
        </Link>
        <button 
          onClick={logout}
          className="glass-card" 
          style={{ 
            width: '100%', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', 
            textDecoration: 'none', color: 'var(--error)', borderRadius: '12px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left'
          }}
        >
          <LogOut size={18} />
          <span style={{ flex: 1, fontSize: '14px', fontWeight: 500 }}>Logout</span>
          <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>
    </div>
  );
}
