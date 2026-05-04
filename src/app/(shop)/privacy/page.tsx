'use client';
import PageTransition from '@/components/shared/PageTransition';

export default function PrivacyPage() {
  return (
    <PageTransition>
      <div className="container-main" style={{ padding: '40px 16px', maxWidth: '800px' }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '32px' }}>Last updated: May 2026</p>

        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.9 }}>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>1. Information We Collect</h2>
            <p style={{ marginBottom: '16px' }}>When you use Glow Addict by Sayanita, we may collect personal information such as your name, email address, phone number, shipping address, and payment details to process orders and provide personalized recommendations.</p>

            <h2 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>2. How We Use Your Data</h2>
            <p style={{ marginBottom: '16px' }}>Your data is used to: process and fulfill orders, provide AI-powered beauty recommendations, send order updates and promotional communications (with your consent), and improve our platform experience.</p>

            <h2 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>3. AI Skin Analysis</h2>
            <p style={{ marginBottom: '16px' }}>When you use our AI Skin Analyzer, photos are processed by NVIDIA&apos;s AI models for analysis only. We do not store your selfie images on our servers. Analysis results may be saved in your browser&apos;s local storage for your convenience.</p>

            <h2 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>4. Data Security</h2>
            <p style={{ marginBottom: '16px' }}>We implement industry-standard security measures to protect your personal information. All payment processing is handled through secure, PCI-compliant payment gateways.</p>

            <h2 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>5. Your Rights</h2>
            <p style={{ marginBottom: '16px' }}>You have the right to access, correct, or delete your personal information. Contact us at support@glowaddict.in for any privacy-related requests.</p>

            <h2 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>6. Contact</h2>
            <p>For privacy concerns, reach us at <a href="mailto:support@glowaddict.in" style={{ color: 'var(--primary)' }}>support@glowaddict.in</a>.</p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
