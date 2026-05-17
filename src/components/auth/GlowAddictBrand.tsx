'use client';
import { motion } from 'framer-motion';
import { catalogMedia } from '@/data/catalog';

export function GlowAddictBrand() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '48px'
      }}
    >
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '112px',
          height: '112px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(124, 44, 255, 0.1), rgba(255, 215, 0, 0.05))',
          borderRadius: '24px',
          border: '2px solid rgba(124, 44, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          overflow: 'hidden'
        }}
      >
        <img src={catalogMedia.logo} alt="Glow Addict by Sayanita" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </motion.div>

      {/* Brand Name */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{ textAlign: 'center' }}
      >
        <h1
          style={{
            fontSize: '42px',
            fontWeight: 800,
            fontFamily: '"Playfair Display", serif',
            background: 'linear-gradient(135deg, #7c2cff 0%, #FFD700 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '6px',
            letterSpacing: '-0.5px'
          }}
        >
          Glow Addict by Sayanita
        </h1>
        <p
          style={{
            fontSize: '16px',
            fontStyle: 'italic',
            color: 'rgba(124, 44, 255, 0.7)',
            fontWeight: 500,
            letterSpacing: '1px'
          }}
        >
          by Sayanita
        </p>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{
          marginTop: '16px',
          fontSize: '13px',
          color: 'rgba(255, 255, 255, 0.6)',
          textAlign: 'center',
          maxWidth: '300px',
          letterSpacing: '0.5px',
          textTransform: 'uppercase'
        }}
      >
        ✨ Your Journey to Radiant, Glowing Skin Starts Here ✨
      </motion.p>
    </motion.div>
  );
}
