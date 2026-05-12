'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Star, Gift, Settings, LogOut, ChevronRight, Sparkles, Camera, Mail, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/features/auth/authStore';
import { useWishlistStore } from '@/features/wishlist/wishlistStore';
import { getUserOrders } from '@/actions/shop';
import { useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';

interface Order {
  id: string;
  date: string;
  items: number;
  total: number;
  status: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClient();
  const { user, isAuthenticated, logout, isInitialized } = useAuthStore();
  const wishlistCount = useWishlistStore(s => s.items.length);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [emailVerified, setEmailVerified] = useState(true);
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      getUserOrders().then(o => {
        setOrders(o as Order[]);
        setIsLoadingOrders(false);
      });

      // Check email verification status
      const checkEmailVerification = async () => {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setEmailVerified(!!authUser?.email_confirmed_at);
      };
      checkEmailVerification();
    }
  }, [isAuthenticated, supabase]);

  const handleResendVerificationEmail = async () => {
    if (!user?.email) return;
    setIsResendingEmail(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
      });
      if (error) throw error;
      alert('Verification email sent! Please check your inbox.');
    } catch (err: any) {
      alert('Failed to resend verification email: ' + err.message);
    } finally {
      setIsResendingEmail(false);
    }
  };

  const statusColor: Record<string, string> = { 
    Delivered: 'var(--success)', 
    Shipped: 'var(--accent-gold)', 
    Processing: 'var(--primary)', 
    Cancelled: 'var(--error)' 
  };

  if (!isAuthenticated) {
    return (
      <div className="container-main animate-fade-in" style={{ padding: '24px 16px', maxWidth: '900px', textAlign: 'center' }}>
        <div style={{
          padding: '48px 32px',
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>Profile Access</h1>
          <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '24px' }}>
            Please sign in to access your profile and personalized features.
          </p>
          <a href="/login" style={{
            display: 'inline-block',
            padding: '12px 24px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #7c2cff 0%, #9d5cff 100%)',
            color: 'white',
            fontWeight: 700,
            fontSize: '14px',
            textDecoration: 'none'
          }}>
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container-main animate-fade-in" style={{ padding: '24px 16px', maxWidth: '900px' }}>
      {/* Email Verification Banner */}
      {!emailVerified && (
        <div style={{ marginBottom: '20px', padding: '14px 16px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.2)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertCircle size={20} style={{ color: 'rgb(251, 191, 36)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px', color: 'rgb(251, 191, 36)' }}>Email not verified</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Click the verification link in your email or resend it below</p>
          </div>
          <button
            onClick={handleResendVerificationEmail}
            disabled={isResendingEmail}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: 'none',
              background: 'rgba(251, 191, 36, 0.2)',
              color: 'rgb(251, 191, 36)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: isResendingEmail ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              opacity: isResendingEmail ? 0.6 : 1
            }}
          >
            {isResendingEmail ? 'Sending...' : 'Resend'}
          </button>
        </div>
      )}
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
            <Image 
              src={user.avatarUrl} 
              alt={user.name || 'User Avatar'} 
              width={80}
              height={80}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{user?.email}</p>
            {emailVerified ? (
              <span style={{ fontSize: '11px', fontWeight: 600, background: 'rgba(16,185,129,0.15)', color: 'var(--success)', padding: '2px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                ✓ Verified
              </span>
            ) : (
              <span style={{ fontSize: '11px', fontWeight: 600, background: 'rgba(251,191,36,0.15)', color: 'rgb(251, 191, 36)', padding: '2px 8px', borderRadius: '6px' }}>
                ⚠ Pending
              </span>
            )}
          </div>
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
