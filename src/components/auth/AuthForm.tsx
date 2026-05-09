'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, ArrowRight, Sparkles, Quote, Send } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

export function AuthForm() {
  const supabase = createClient();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleMagicLinkAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          data: !isLogin ? { full_name: formData.name } : {},
          emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        }
      });

      if (error) throw error;
      
      setMessage('A magic link has been sent to your email. Please check your inbox (and spam folder) to sign in!');
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to initialize Google login');
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    },
    exit: { opacity: 0, x: -20, transition: { duration: 0.4 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="auth-container" style={{
      display: 'flex',
      width: '100%',
      maxWidth: '1100px',
      minHeight: '650px',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      borderRadius: '32px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      position: 'relative'
    }}>
      {/* Left Side: Storytelling & Visuals */}
      <div className="auth-story" style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        color: 'white',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(45deg, rgba(10, 10, 10, 0.8), rgba(20, 20, 20, 0.4))',
          zIndex: 1
        }} />
        
        <Image 
          src="/auth_background_story_1778338180362.png" 
          alt="Beauty Story"
          fill
          sizes="(max-width: 900px) 0vw, 50vw"
          style={{ objectFit: 'cover', opacity: 0.7, zIndex: 0 }}
          priority
        />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%', 
                background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Sparkles size={20} className="text-accent-gold" />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>
                Established 2024
              </span>
            </div>

            <h1 style={{ 
              fontSize: '48px', 
              fontWeight: 800, 
              fontFamily: 'Playfair Display', 
              lineHeight: 1.1,
              marginBottom: '24px',
              maxWidth: '400px'
            }}>
              {isLogin ? "Your Glow, Our Passion." : "The Secret to Radiant Confidence."}
            </h1>

            <div style={{ position: 'relative', marginBottom: '40px' }}>
              <Quote size={32} style={{ position: 'absolute', top: '-10px', left: '-20px', opacity: 0.2 }} />
              <p style={{ 
                fontSize: '18px', 
                lineHeight: 1.6, 
                color: 'rgba(255, 255, 255, 0.8)',
                fontStyle: 'italic',
                maxWidth: '450px'
              }}>
                {isLogin 
                  ? "Welcome back to your sanctuary of self-care. Continue your personalized journey toward timeless elegance."
                  : "Begin your transformation. At Glow Addict, we don't just sell products; we cultivate your unique radiance through science-backed personalization."}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '32px', marginTop: '60px' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-gold)' }}>10k+</div>
                <div style={{ fontSize: '12px', opacity: 0.6, textTransform: 'uppercase' }}>Unique Profiles</div>
              </div>
              <div style={{ width: '1px', height: '40px', background: 'rgba(255, 255, 255, 0.1)' }} />
              <div>
                <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent-gold)' }}>98%</div>
                <div style={{ fontSize: '12px', opacity: 0.6, textTransform: 'uppercase' }}>Skin Satisfaction</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="auth-form-side" style={{
        width: '480px',
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'signup'}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 700, fontFamily: 'Outfit', marginBottom: '8px' }}>
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                {isLogin ? 'Sign in with your email magic link.' : 'Start your story by sharing your name and email.'}
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <motion.button
                whileHover={{ scale: 1.02, background: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleAuth}
                disabled={loading}
                className="input-premium"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  cursor: 'pointer',
                  paddingLeft: '16px'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span style={{ fontWeight: 600, fontSize: '15px' }}>Continue with Google</span>
              </motion.button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
              <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
            </div>

            <form onSubmit={handleMagicLinkAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {!isLogin && (
                <motion.div variants={itemVariants}>
                  <label htmlFor="name" className="label-style">Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} className="input-icon" />
                    <input 
                      id="name" 
                      type="text" 
                      required 
                      className="input-premium" 
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="label-style">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} className="input-icon" />
                  <input 
                    id="email" 
                    type="email" 
                    required 
                    className="input-premium" 
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </motion.div>

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-box">
                  {error}
                </motion.div>
              )}

              {message && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="success-box">
                  {message}
                </motion.div>
              )}

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="btn-premium"
              >
                <span>{loading ? 'Sending...' : 'Send Magic Link'}</span>
                {!loading && <Send size={20} />}
              </motion.button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {isLogin ? "New to Glow Addict?" : "Already part of the movement?"}{' '}
                <button 
                  onClick={() => setIsLogin(!isLogin)} 
                  style={{ color: 'var(--accent-gold)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {isLogin ? 'Create Account' : 'Sign In'}
                </button>
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <style jsx>{`
        .auth-container {
          margin: 40px auto;
        }
        .label-style {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 8px;
          display: block;
          letter-spacing: 0.5px;
        }
        .input-premium {
          width: 100%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px 16px 12px 48px;
          color: white;
          font-size: 15px;
          transition: all 0.3s ease;
          outline: none;
        }
        .input-premium:focus {
          border-color: var(--accent-gold);
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
        }
        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.3);
        }
        .btn-premium {
          background: linear-gradient(135deg, var(--accent-gold), #c5a028);
          color: black;
          border: none;
          border-radius: 12px;
          padding: 16px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: all 0.3s ease;
          margin-top: 10px;
        }
        .btn-premium:hover {
          box-shadow: 0 8px 20px -4px rgba(212, 175, 55, 0.4);
          transform: translateY(-2px);
        }
        .btn-premium:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .error-box {
          color: #ff4d4d;
          font-size: 13px;
          text-align: center;
          background: rgba(255, 77, 77, 0.1);
          padding: 12px;
          border-radius: 12px;
          border: 1px solid rgba(255, 77, 77, 0.2);
        }
        .success-box {
          color: #00ff88;
          font-size: 13px;
          text-align: center;
          background: rgba(0, 255, 136, 0.1);
          padding: 12px;
          border-radius: 12px;
          border: 1px solid rgba(0, 255, 136, 0.2);
        }
        @media (max-width: 900px) {
          .auth-container {
            flex-direction: column;
            max-width: 500px;
          }
          .auth-story {
            display: none;
          }
          .auth-form-side {
            width: 100%;
            padding: 40px 24px;
          }
        }
      `}</style>
    </div>
  );
}
