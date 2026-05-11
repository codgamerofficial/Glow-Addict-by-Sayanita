'use client';
import { Truck, Clock, MapPin, AlertCircle } from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';

const policies = [
  { icon: Truck, title: 'Free Shipping', desc: 'Free delivery on orders above ₹499 across India.' },
  { icon: Clock, title: 'Processing Time', desc: 'Orders are processed within 1-2 business days.' },
  { icon: MapPin, title: 'Delivery Time', desc: 'Standard delivery takes 5-7 business days. Metro cities may receive orders in 3-5 days.' },
  { icon: AlertCircle, title: 'Cash on Delivery', desc: 'COD available for orders up to ₹5,000. Additional ₹49 handling fee applies.' },
];

export default function ShippingPage() {
  return (
    <PageTransition>
      <div className="container-main p-10 px-4 max-w-[800px]">
        <h1 className="font-outfit text-3xl font-bold mb-2">Shipping Policy</h1>
        <p className="text-[var(--text-muted)] text-[15px] mb-8">Everything you need to know about delivery</p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-8">
          {policies.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card p-6">
              <Icon size={24} className="text-[var(--primary)] mb-3" />
              <h3 className="font-outfit text-base font-semibold mb-2">{title}</h3>
              <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">{desc}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-6">
          <h2 className="font-outfit text-lg font-semibold mb-4">Shipping Details</h2>
          <div className="text-sm text-[var(--text-secondary)] leading-[1.8]">
            <p className="mb-3">• We ship to all serviceable pin codes across India via trusted courier partners.</p>
            <p className="mb-3">• Tracking information will be sent to your registered email and phone number once your order is dispatched.</p>
            <p className="mb-3">• Orders placed before 2 PM IST on business days are dispatched the same day.</p>
            <p className="mb-3">• For remote areas, delivery may take up to 10 business days.</p>
            <p>• International shipping is not available at this time.</p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
