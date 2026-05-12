'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle } from 'lucide-react';

interface OTPVerificationProps {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

export function OTPVerification({
  email,
  onVerify,
  onResend,
  isLoading = false,
  error = null
}: OTPVerificationProps) {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOTPChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.querySelector(
        `input[data-otp-index="${index + 1}"]`
      ) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  const handleOTPBackspace = (index: number) => {
    if (!otp[index] && index > 0) {
      const prevInput = document.querySelector(
        `input[data-otp-index="${index - 1}"]`
      ) as HTMLInputElement;
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) return;

    setVerifying(true);
    try {
      await onVerify(otpCode);
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    await onResend();
    setResendTimer(60);
    setOtp(['', '', '', '', '', '']);
  };

  const otpFilled = otp.every((digit) => digit !== '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(124, 44, 255, 0.2), rgba(255, 215, 0, 0.2))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            border: '2px solid rgba(124, 44, 255, 0.4)'
          }}
        >
          <CheckCircle size={28} color="#7c2cff" />
        </motion.div>
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 700,
            marginBottom: '8px',
            color: 'white'
          }}
        >
          Verify Your Email
        </h2>
        <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
          We've sent a 6-digit code to <strong>{email}</strong>
        </p>
      </div>

      {/* OTP Input Fields */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          marginBottom: '24px'
        }}
      >
        {otp.map((digit, index) => (
          <motion.input
            key={index}
            data-otp-index={index}
            type="text"
            value={digit}
            onChange={(e) => handleOTPChange(e.target.value, index)}
            onKeyDown={(e) => {
              if (e.key === 'Backspace') handleOTPBackspace(index);
            }}
            maxLength={1}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            style={{
              width: '52px',
              height: '52px',
              fontSize: '24px',
              fontWeight: 700,
              textAlign: 'center',
              border: `2px solid ${digit ? 'rgba(124, 44, 255, 0.6)' : 'rgba(255, 255, 255, 0.2)'}`,
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.06)',
              color: 'white',
              transition: 'all 0.3s ease',
              outline: 'none',
              backdropFilter: 'blur(10px)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(124, 44, 255, 0.8)';
              e.target.style.boxShadow = '0 0 0 3px rgba(124, 44, 255, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = digit
                ? 'rgba(124, 44, 255, 0.6)'
                : 'rgba(255, 255, 255, 0.2)';
              e.target.style.boxShadow = 'none';
            }}
          />
        ))}
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
            marginBottom: '20px',
            color: '#ff8a80',
            fontSize: '13px',
            textAlign: 'center'
          }}
        >
          {error}
        </motion.div>
      )}

      {/* Verify Button */}
      <motion.button
        whileHover={otpFilled && !verifying ? { scale: 1.03, y: -2 } : {}}
        whileTap={otpFilled && !verifying ? { scale: 0.97 } : {}}
        onClick={handleVerify}
        disabled={!otpFilled || verifying || isLoading}
        style={{
          width: '100%',
          padding: '14px 24px',
          borderRadius: '12px',
          border: 'none',
          background:
            otpFilled && !verifying
              ? 'linear-gradient(135deg, #7c2cff 0%, #9d5cff 100%)'
              : 'rgba(124, 44, 255, 0.3)',
          color: 'white',
          fontWeight: 700,
          fontSize: '15px',
          cursor: otpFilled && !verifying ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s ease',
          marginBottom: '16px'
        }}
      >
        {verifying || isLoading ? 'Verifying...' : 'Verify & Continue'}
      </motion.button>

      {/* Resend Option */}
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '12px' }}>
          Didn't receive the code?
        </p>
        <motion.button
          whileHover={resendTimer === 0 ? { scale: 1.05 } : {}}
          onClick={handleResend}
          disabled={resendTimer > 0}
          style={{
            background: 'none',
            border: 'none',
            color: resendTimer > 0 ? 'rgba(255, 215, 0, 0.4)' : 'rgba(255, 215, 0, 0.9)',
            fontWeight: 600,
            cursor: resendTimer > 0 ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
        >
          <RotateCcw size={14} />
          {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
        </motion.button>
      </div>
    </motion.div>
  );
}
