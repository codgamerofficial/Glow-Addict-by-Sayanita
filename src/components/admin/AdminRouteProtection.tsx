'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Lock, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '@/features/auth/authStore';

interface AdminRouteProtectionProps {
  children: React.ReactNode;
}

export function AdminRouteProtection({ children }: AdminRouteProtectionProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        router.push('/admin/login');
        return;
      }

      try {
        const response = await fetch('/api/admin/check', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.isAdmin || false);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAdmin && !loading) {
      const timer = setTimeout(() => {
        router.push('/admin/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isAdmin, loading, router]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(20,10,30,0.95) 0%, rgba(15,8,25,0.98) 100%)',
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 20,
            padding: '40px 60px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Shield size={48} style={{ color: '#E91E8C' }} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 500 }}>
              Verifying admin access...
            </p>
          </motion.div>
          <motion.div
            style={{
              width: 120,
              height: 2,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <motion.div
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #E91E8C, #7C3AED)',
                borderRadius: 2,
              }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(20,10,30,0.95) 0%, rgba(15,8,25,0.98) 100%)',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 20,
            padding: '40px 60px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <AlertTriangle size={48} style={{ color: '#EF4444' }} />
          <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: 0 }}>
            Access Denied
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, textAlign: 'center', margin: 0 }}>
            You do not have permission to access this admin area.
            <br />
            Redirecting to login...
          </p>
          <motion.div
            style={{
              width: 180,
              height: 4,
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <motion.div
              style={{
                height: '100%',
                background: '#EF4444',
                borderRadius: 2,
              }}
              animate={{ scaleX: [1, 0] }}
              transition={{ duration: 3, ease: 'linear' }}
            />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
