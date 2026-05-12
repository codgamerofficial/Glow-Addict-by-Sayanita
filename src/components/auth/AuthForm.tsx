'use client';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { GlowAddictBrand } from './GlowAddictBrand';
import { SocialLoginButtons } from './SocialLoginButtons';

export function AuthForm() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get('redirect') || '/profile';

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(180deg, rgba(124, 44, 255, 0.1) 0%, rgba(255, 235, 247, 0.05) 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Gradient Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '40vw',
        height: '40vw',
        background: 'radial-gradient(circle, rgba(124, 44, 255, 0.15) 0%, transparent 70%)',
        filter: 'blur(80px)',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '5%',
        width: '30vw',
        height: '30vw',
        background: 'radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%)',
        filter: 'blur(80px)',
        zIndex: 0
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: '100%',
          maxWidth: '480px',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Main Auth Container */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '48px 32px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)'
        }}>
          <GlowAddictBrand />
          <SocialLoginButtons redirectTo={redirectUrl} />
        </div>
      </motion.div>
    </div>
  );
}
