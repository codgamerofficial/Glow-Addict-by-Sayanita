'use client';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

interface SocialLoginButtonsProps {
  redirectTo?: string;
  isLoading?: boolean;
}

export function SocialLoginButtons({ redirectTo = '/profile', isLoading = false }: SocialLoginButtonsProps) {
  const supabase = createClient();
  const [localLoading, setLocalLoading] = useState(false);

  const handleOAuthSignIn = async () => {
    setLocalLoading(true);
    try {
      const authUrl = `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`;
      console.log('Initiating Google OAuth with redirectTo:', authUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: authUrl
        }
      });
      if (error) {
        console.error('OAuth error:', error);
        if (error.message?.includes('provider')) {
          alert(`Provider not configured: ${error.message}`);
        } else if (error.message?.includes('network')) {
          alert(`Network error: ${error.message}`);
        } else {
          alert(`Failed to sign in with Google: ${error.message}`);
        }
      }
    } catch (err: unknown) {
      console.error('Unexpected OAuth error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      alert(`Failed to initiate Google sign-in: ${errorMessage}`);
    } finally {
      setLocalLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const isButtonLoading = isLoading || localLoading;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
    >
       {/* Google Sign In */}
      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleOAuthSignIn}
        disabled={isButtonLoading}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          padding: '12px 24px',
          borderRadius: '12px',
          border: '1.5px solid rgba(255, 255, 255, 0.2)',
          background: 'rgba(255, 255, 255, 0.08)',
          color: 'white',
          fontWeight: 700,
          fontSize: '14px',
          cursor: isButtonLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)',
          textDecoration: 'none',
          width: '100%',
          opacity: isButtonLoading ? 0.7 : 1
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
        }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
          <path d="M17.64 9.2c0-.637-.057-1.252-.164-1.842H9v3.48h4.844a4.14 4.14 0 0 1-1.796 2.716v2.26h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.27c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.715H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
          <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.692C4.672 5.746 6.656 3.58 9 3.58z"/>
        </svg>
        <span>{isButtonLoading ? 'Redirecting to Google...' : 'Sign in with Google'}</span>
      </motion.button>
    </motion.div>
  );
}