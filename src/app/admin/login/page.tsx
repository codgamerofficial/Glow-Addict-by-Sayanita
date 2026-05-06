'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // Using the client for client-side auth flow

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      // The middleware will handle checking if the user is an admin.
      // If they are, it will allow access, otherwise redirect.
      router.push('/admin');
      router.refresh(); // Force refresh to ensure middleware runs
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sign in. Please check your credentials.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: 20 }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: 420 }}>
        
        {/* Logo/Brand */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#fff' }}>
            <Lock size={32} />
          </div>
          <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Glow Addict Admin</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Secure portal access required</p>
        </div>

        {/* Form Card */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, padding: 32, backdropFilter: 'blur(20px)' }}>
          {error && (
            <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@glowaddict.com"
                  style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: 12, fontSize: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', outline: 'none', transition: 'border 0.2s' }} 
                  onFocus={e => e.target.style.borderColor = '#E91E8C'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  required
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ width: '100%', padding: '14px 16px 14px 44px', borderRadius: 12, fontSize: 14, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', outline: 'none', transition: 'border 0.2s' }} 
                  onFocus={e => e.target.style.borderColor = '#E91E8C'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  required
                />
              </div>
            </div>

            <button disabled={isLoading} type="submit" style={{ width: '100%', padding: '16px', borderRadius: 12, background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', color: '#fff', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 600, fontFamily: 'Outfit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 8, opacity: isLoading ? 0.7 : 1, transition: 'opacity 0.2s' }}>
              {isLoading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : (
                <>Sign In Securely <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'var(--text-muted)' }}>
          &copy; {new Date().getFullYear()} Glow Addict by Sayanita. Internal Use Only.
        </div>
      </motion.div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
