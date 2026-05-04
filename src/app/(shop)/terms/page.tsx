'use client';
import PageTransition from '@/components/shared/PageTransition';

export default function TermsPage() {
  return (
    <PageTransition>
      <div className="container-main" style={{ padding: '40px 16px', maxWidth: '800px' }}>
        <h1 style={{ fontFamily: 'Outfit', fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Terms of Service</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '32px' }}>Last updated: May 2026</p>

        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.9 }}>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>1. Acceptance of Terms</h2>
            <p style={{ marginBottom: '16px' }}>By accessing and using Glow Addict by Sayanita, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.</p>

            <h2 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>2. Products & Pricing</h2>
            <p style={{ marginBottom: '16px' }}>All product descriptions, images, and prices are as accurate as possible. However, we reserve the right to correct errors and update information without prior notice. Prices are in Indian Rupees (INR) and inclusive of applicable taxes unless stated otherwise.</p>

            <h2 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>3. Orders & Payment</h2>
            <p style={{ marginBottom: '16px' }}>Placing an order constitutes an offer to purchase. We reserve the right to refuse or cancel orders for any reason, including product availability, pricing errors, or suspected fraud. Payment must be completed at the time of order unless COD is selected.</p>

            <h2 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>4. AI Features Disclaimer</h2>
            <p style={{ marginBottom: '16px' }}>Our AI Beauty Assistant and Skin Analyzer provide general beauty and skincare suggestions based on AI analysis. These are not medical diagnoses. Always consult a dermatologist for medical skin conditions.</p>

            <h2 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>5. Intellectual Property</h2>
            <p style={{ marginBottom: '16px' }}>All content on Glow Addict including logos, text, images, and software is the property of Glow Addict by Sayanita and protected by applicable intellectual property laws.</p>

            <h2 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>6. Limitation of Liability</h2>
            <p style={{ marginBottom: '16px' }}>Glow Addict by Sayanita shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform or products. Our total liability shall not exceed the amount paid for the relevant order.</p>

            <h2 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>7. Governing Law</h2>
            <p>These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of Indian courts.</p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
