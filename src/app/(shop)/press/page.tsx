'use client';
import PageTransition from '@/components/shared/PageTransition';
import { Newspaper } from 'lucide-react';

export default function PressPage() {
  return (
    <PageTransition>
      <div className="container-main p-10 px-4 max-w-[800px]">
        <h1 className="font-outfit text-3xl font-bold mb-2">Press</h1>
        <p className="text-[var(--text-muted)] text-[15px] mb-8">Media resources and brand information</p>
        <div className="glass-card p-8 text-center">
          <Newspaper size={48} className="text-[var(--primary)] mb-4" />
          <h2 className="font-outfit text-xl font-semibold mb-3">Press Inquiries</h2>
          <p className="text-[var(--text-secondary)] text-sm leading-[1.7] mb-4">
            For press inquiries, interviews, and media collaborations, please contact us at{' '}
            <a href="mailto:press@glowaddict.in" className="text-[var(--primary)]">press@glowaddict.in</a>
          </p>
          <p className="text-[var(--text-muted)] text-[13px]">We typically respond within 2 business days.</p>
        </div>
      </div>
    </PageTransition>
  );
}
