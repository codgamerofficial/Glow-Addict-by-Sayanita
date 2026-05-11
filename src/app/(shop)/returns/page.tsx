'use client';
import { RotateCcw, Shield, Clock, CheckCircle } from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';

export default function ReturnsPage() {
  return (
    <PageTransition>
      <div className="container-main p-10 px-4 max-w-[800px]">
        <h1 className="font-outfit text-3xl font-bold mb-2">Returns & Refunds</h1>
        <p className="text-[var(--text-muted)] text-[15px] mb-8">We want you to love what you buy</p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-8">
          {[
            { icon: RotateCcw, title: '7-Day Returns', desc: 'Return eligible products within 7 days of delivery.' },
            { icon: Shield, title: 'Quality Guarantee', desc: 'If you receive a damaged or defective product, we replace it free of charge.' },
            { icon: Clock, title: 'Fast Refunds', desc: 'Refunds are processed within 5-7 business days to your original payment method.' },
            { icon: CheckCircle, title: 'Easy Process', desc: 'Initiate returns through your account or contact our support team.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card p-6">
              <Icon size={24} className="text-[var(--primary)] mb-3" />
              <h3 className="font-outfit text-base font-semibold mb-2">{title}</h3>
              <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">{desc}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-6">
          <h2 className="font-outfit text-lg font-semibold mb-4">Return Policy Details</h2>
          <div className="text-sm text-[var(--text-secondary)] leading-[1.8]">
            <p className="mb-3">• Products must be unused, in original packaging, and in the same condition as received.</p>
            <p className="mb-3">• Skincare and makeup products that have been opened or used cannot be returned for hygiene reasons.</p>
            <p className="mb-3">• Sale items and gift cards are final sale and cannot be returned or exchanged.</p>
            <p className="mb-3">• For damaged or wrong items, contact us within 48 hours of delivery with photos.</p>
            <p>• Return shipping costs are borne by the customer unless the product is defective or incorrect.</p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
