'use client';
import PageTransition from '@/components/shared/PageTransition';

export default function PrivacyPage() {
  return (
    <PageTransition>
      <div className="container-main p-10 px-4 max-w-[800px]">
        <h1 className="font-outfit text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-[var(--text-muted)] text-[15px] mb-8">Last updated: May 2026</p>

        <div className="glass-card p-8">
          <div className="text-sm text-[var(--text-secondary)] leading-[1.9]">
            <h2 className="font-outfit text-lg font-semibold text-[var(--text-primary)] mb-3">1. Information We Collect</h2>
            <p className="mb-4">When you use Glow Addict by Sayanita, we may collect personal information such as your name, email address, phone number, shipping address, and payment details to process orders and provide personalized recommendations.</p>

            <h2 className="font-outfit text-lg font-semibold text-[var(--text-primary)] mb-3">2. How We Use Your Data</h2>
            <p className="mb-4">Your data is used to: process and fulfill orders, provide AI-powered beauty recommendations, send order updates and promotional communications (with your consent), and improve our platform experience.</p>

            <h2 className="font-outfit text-lg font-semibold text-[var(--text-primary)] mb-3">3. AI Skin Analysis</h2>
            <p className="mb-4">When you use our AI Skin Analyzer, photos are processed by NVIDIA&apos;s AI models for analysis only. We do not store your selfie images on our servers. Analysis results may be saved in your browser&apos;s local storage for your convenience.</p>

            <h2 className="font-outfit text-lg font-semibold text-[var(--text-primary)] mb-3">4. Data Security</h2>
            <p className="mb-4">We implement industry-standard security measures to protect your personal information. All payment processing is handled through secure, PCI-compliant payment gateways.</p>

            <h2 className="font-outfit text-lg font-semibold text-[var(--text-primary)] mb-3">5. Your Rights</h2>
            <p className="mb-4">You have the right to access, correct, or delete your personal information. Contact us at support@glowaddict.in for any privacy-related requests.</p>

            <h2 className="font-outfit text-lg font-semibold text-[var(--text-primary)] mb-3">6. Contact</h2>
            <p>For privacy concerns, reach us at <a href="mailto:support@glowaddict.in" className="text-[var(--primary)]">support@glowaddict.in</a>.</p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
