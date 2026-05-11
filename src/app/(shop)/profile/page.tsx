'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Star, Gift, Settings, LogOut, ChevronRight, Sparkles, Camera } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/features/auth/authStore';
import { useWishlistStore } from '@/features/wishlist/wishlistStore';
import { getUserOrders } from '@/actions/shop';
import { useState } from 'react';
import Image from 'next/image';

interface Order {
  id: string;
  date: string;
  items: number;
  total: number;
  status: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isInitialized } = useAuthStore();
  const wishlistCount = useWishlistStore(s => s.items.length);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      router.push('/login');
    }
    
    if (isAuthenticated && user) {
      getUserOrders(user.id).then(o => {
        setOrders(o as Order[]);
        setIsLoadingOrders(false);
      });
    }
  }, [isInitialized, isAuthenticated, router]);

  const statusColor: Record<string, string> = { 
    Delivered: 'var(--success)', 
    Shipped: 'var(--accent-gold)', 
    Processing: 'var(--primary)', 
    Cancelled: 'var(--error)' 
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container-main animate-fade-in p-6 px-4 max-w-[900px]">
      {/* Profile card */}
      <div className="glass-card p-6 mb-5 flex gap-5 items-center flex-wrap">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center text-[28px] font-bold text-white font-outfit relative shrink-0 overflow-hidden">
          {user?.avatarUrl ? (
            <Image 
              src={user.avatarUrl} 
              alt={user.name || 'User Avatar'} 
              width={80}
              height={80}
              className="w-full h-full object-cover" 
            />
          ) : (
            user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'
          )}
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[var(--bg-surface)] border-2 border-[var(--primary)] flex items-center justify-center cursor-pointer">
            <Camera size={10} className="text-[var(--primary)]" />
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <h1 className="font-outfit text-2xl font-bold mb-1">{user?.name || 'Beauty Lover'}</h1>
          <p className="text-sm text-[var(--text-muted)] mb-2">{user?.email}</p>
          <div className="flex gap-2 flex-wrap">
            {user?.skinType && <span className="badge badge-primary">{user.skinType} Skin</span>}
            <span className="badge badge-gold"><Gift size={12} /> {user?.loyaltyPoints?.toLocaleString() || 0} Points</span>
          </div>
          </div>
        <Link href="/skin-analyzer" className="btn-outline no-underline p-2.5 px-5 text-[13px] flex items-center gap-1.5">
          <Sparkles size={16} /> Analyze Skin
        </Link>
      </div>


      {/* Quick stats */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 mb-6">
        {[
          { icon: ShoppingBag, label: 'Orders', value: orders.length, href: '#orders' },
          { icon: Heart, label: 'Wishlist', value: wishlistCount, href: '/wishlist' },
          { icon: Star, label: 'Reviews', value: 0, href: '#' },
          { icon: Gift, label: 'Rewards', value: `${user?.loyaltyPoints || 0}`, href: '#' },
        ].map(({ icon: Icon, label, value, href }) => (
          <Link key={label} href={href} className="glass-card p-4 text-center no-underline text-[var(--text-primary)]">
            <Icon size={22} className="text-[var(--primary)] mb-2" />
            <div className="font-outfit text-xl font-bold">{value}</div>
            <div className="text-[12px] text-[var(--text-muted)]">{label}</div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div id="orders">
        <h2 className="font-outfit text-xl font-bold mb-4">Recent Orders</h2>
        <div className="flex flex-col gap-2.5 mb-6">
          {isLoadingOrders ? (
            Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="glass-card animate-pulse p-4 h-16"></div>
            ))
          ) : orders.length > 0 ? (
            orders.map(order => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="glass-card p-4 flex justify-between items-center no-underline text-[var(--text-primary)] rounded-xl transition-colors duration-200 hover:bg-[var(--bg-surface)]/80"
                onMouseEnter={() => router.prefetch(`/orders/${order.id}`)}
              >
                <div>
                  <div className="text-sm font-semibold">#{order.id}</div>
                  <div className="text-[12px] text-[var(--text-muted)]">{order.date} • {order.items} items</div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <div className="font-outfit text-[15px] font-semibold">₹{order.total.toLocaleString()}</div>
                    <span className="badge text-[11px]" style={{ background: `${statusColor[order.status] || 'var(--primary)'}20`, color: statusColor[order.status] || 'var(--primary)' }}>{order.status}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="glass-card p-8 text-center text-[var(--text-muted)]">
              <ShoppingBag size={32} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">No orders yet. Start your beauty journey today!</p>
              <Link href="/products" className="text-[var(--primary)] text-[13px] font-semibold no-underline block mt-2">Shop Products</Link>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="flex flex-col gap-1">
        <Link href="#" className="glass-card p-3.5 px-4 flex items-center gap-3 no-underline text-[var(--text-primary)] rounded-xl">
          <Settings size={18} />
          <span className="flex-1 text-sm font-medium">Account Settings</span>
          <ChevronRight size={16} className="text-[var(--text-muted)]" />
        </Link>
        <Link href="#" className="glass-card p-3.5 px-4 flex items-center gap-3 no-underline text-[var(--text-primary)] rounded-xl">
          <Gift size={18} />
          <span className="flex-1 text-sm font-medium">Rewards & Offers</span>
          <ChevronRight size={16} className="text-[var(--text-muted)]" />
        </Link>
        <button 
          onClick={logout}
          className="glass-card w-full p-3.5 px-4 flex items-center gap-3 no-underline text-[var(--error)] rounded-xl bg-none border-none cursor-pointer text-left" 
        >
          <LogOut size={18} />
          <span className="flex-1 text-sm font-medium">Logout</span>
          <ChevronRight size={16} className="text-[var(--text-muted)]" />
        </button>
      </div>
    </div>
  );
}
