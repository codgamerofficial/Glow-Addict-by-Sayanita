'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, CheckCircle, Mail as MailIcon } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface PasswordResetProps {
  onClose?: () => void;
}

export function PasswordReset({ onClose }: PasswordResetProps) {
  const supabase = createClient();
  const [step, setStep] = useState<'email' | 'check-email' | 'password' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordStrength = {
    score: password.length > 0 ? Math.min(5, Math.ceil(password.length / 3)) : 0,
    color: password.length === 0 ? 'transparent' : ['#ff4757', '#ffa502', '#ffd700', '#9d5cff', '#7c2cff'][password.length > 0 ? Math.min(4, Math.ceil(password.length / 3) - 1) : 0]
  };

  const isPasswordValid = password.length >= 8 && password === confirmPassword;

  const handleSendRecoveryEmail = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`
      });
      if (error) throw error;
      setStep('check-email');
    } catch (err: any) {
      setError(err.message || 'Failed to send recovery email');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      if (error) throw error;
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ width: '100%' }}
    >
      <AnimatePresence mode="wait">
        {step === 'email' && (
          <motion.div
            key="email"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: 'white' }}>
                Reset Your Password
              </h2>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
                Enter your email address and we'll send you a code
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255, 255, 255, 0.3)',
                  pointerEvents: 'none'
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 48px',
                    borderRadius: '12px',
                    border: '1.5px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(124, 44, 255, 0.6)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(124, 44, 255, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: 'rgba(255, 107, 107, 0.15)',
                  border: '1px solid rgba(255, 107, 107, 0.4)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '16px',
                  color: '#ff8a80',
                  fontSize: '12px'
                }}
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={email ? { scale: 1.03, y: -2 } : {}}
              whileTap={email ? { scale: 0.97 } : {}}
              onClick={handleSendRecoveryEmail}
              disabled={!email || loading}
              style={{
                width: '100%',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                background: email ? 'linear-gradient(135deg, #7c2cff 0%, #9d5cff 100%)' : 'rgba(124, 44, 255, 0.3)',
                color: 'white',
                fontWeight: 700,
                fontSize: '14px',
                cursor: email ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </motion.button>
          </motion.div>
        )}

        {step === 'check-email' && (
          <motion.div
            key="check-email"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(81, 207, 102, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  border: '2px solid rgba(81, 207, 102, 0.4)'
                }}
              >
                <MailIcon size={32} color="#51cf66" />
              </motion.div>
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: 'white' }}>
                Check Your Email
              </h2>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '16px' }}>
                We've sent a password recovery link to <strong>{email}</strong>
              </p>
              <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', marginBottom: '24px', lineHeight: '1.5' }}>
                Click the link in your email to reset your password. If you don't see the email, check your spam folder.
              </p>
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                style={{
                  padding: '12px 32px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #7c2cff 0%, #9d5cff 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Back to Login
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 'password' && (
          <motion.div
            key="password"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: 'white' }}>
                Create New Password
              </h2>
            </div>

            {/* New Password */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '8px',
                textTransform: 'uppercase'
              }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255, 255, 255, 0.3)',
                  pointerEvents: 'none'
                }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  style={{
                    width: '100%',
                    padding: '12px 48px 12px 48px',
                    borderRadius: '12px',
                    border: '1.5px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(124, 44, 255, 0.6)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(124, 44, 255, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.4)',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 215, 0, 0.8)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{ marginTop: '8px' }}
                >
                  <div style={{
                    height: '4px',
                    borderRadius: '2px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    overflow: 'hidden'
                  }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      style={{
                        height: '100%',
                        background: passwordStrength.color,
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 700,
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '8px',
                textTransform: 'uppercase'
              }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255, 255, 255, 0.3)',
                  pointerEvents: 'none'
                }} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  style={{
                    width: '100%',
                    padding: '12px 48px 12px 48px',
                    borderRadius: '12px',
                    border: `1.5px solid ${confirmPassword && confirmPassword !== password ? 'rgba(255, 107, 107, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(124, 44, 255, 0.6)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(124, 44, 255, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = confirmPassword && confirmPassword !== password ? 'rgba(255, 107, 107, 0.4)' : 'rgba(255, 255, 255, 0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.4)',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255, 215, 0, 0.8)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.4)'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={isPasswordValid ? { scale: 1.03, y: -2 } : {}}
              whileTap={isPasswordValid ? { scale: 0.97 } : {}}
              onClick={handleResetPassword}
              disabled={!isPasswordValid || loading}
              style={{
                width: '100%',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                background: isPasswordValid ? 'linear-gradient(135deg, #7c2cff 0%, #9d5cff 100%)' : 'rgba(124, 44, 255, 0.3)',
                color: 'white',
                fontWeight: 700,
                fontSize: '14px',
                cursor: isPasswordValid ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </motion.button>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '32px 16px' }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(81, 207, 102, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                border: '2px solid rgba(81, 207, 102, 0.4)'
              }}
            >
              <CheckCircle size={32} color="#51cf66" />
            </motion.div>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: 'white' }}>
              Password Reset!
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '24px' }}>
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              style={{
                padding: '12px 32px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #7c2cff 0%, #9d5cff 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Back to Login
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
