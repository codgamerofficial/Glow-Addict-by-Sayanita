'use client';
import { motion } from 'framer-motion';

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
      {/* Logo Animation */}
      <motion.div
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '120px',
          height: '120px',
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
        <svg
          viewBox="0 0 200 200"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Cream/Product */}
          <circle cx="100" cy="70" r="35" fill="#E8D5B7" opacity="0.9" />
          {/* Top swirl */}
          <path d="M 100 40 Q 95 50 100 60 Q 105 50 100 40" fill="#F5E6D3" opacity="0.7" />
          <path d="M 110 45 Q 115 55 110 65 Q 105 55 110 45" fill="#F5E6D3" opacity="0.7" />

          {/* Purple circle bowl */}
          <circle cx="100" cy="95" r="40" fill="none" stroke="#7C2CFF" strokeWidth="8" opacity="0.8" />

          {/* Left character (woman with mask) */}
          <circle cx="60" cy="110" r="15" fill="#D4A574" /> {/* head */}
          <rect x="50" y="120" width="20" height="25" fill="#F5F5F5" /> {/* body */}
          {/* mask */}
          <ellipse cx="60" cy="110" rx="18" ry="12" fill="#8B6D47" opacity="0.6" />

          {/* Right character (young woman) */}
          <circle cx="140" cy="110" r="15" fill="#D4A574" /> {/* head */}
          <rect x="130" y="120" width="20" height="25" fill="#394B93" /> {/* body */}
          {/* hair */}
          <ellipse cx="140" cy="95" rx="18" ry="15" fill="#2D2D2D" />

          {/* Decorative elements - sparkles */}
          <circle cx="170" cy="50" r="3" fill="#FFD700" />
          <circle cx="30" cy="50" r="3" fill="#FFD700" />
          <path d="M 170 45 L 175 50 L 170 55 L 165 50 Z" fill="#FFD700" opacity="0.6" />
          <path d="M 30 145 L 35 150 L 30 155 L 25 150 Z" fill="#FFD700" opacity="0.6" />
        </svg>
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
          Glow Addict
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
