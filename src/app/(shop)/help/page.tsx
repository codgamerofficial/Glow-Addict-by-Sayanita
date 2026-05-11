'use client';
import { Search, MessageCircle, Package, CreditCard, HelpCircle } from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import Link from 'next/link';

const topics = [
  { icon: Package, title: 'Orders & Delivery', desc: 'Track orders, shipping info, delivery updates', links: [{ label: 'Track Your Order', href: '/track-order' }, { label: 'Shipping Policy', href: '/shipping' }] },
  { icon: CreditCard, title: 'Payments & Refunds', desc: 'Payment methods, refund status, billing issues', links: [{ label: 'Returns & Refunds', href: '/returns' }] },
  { icon: HelpCircle, title: 'Account & Settings', desc: 'Profile management, password reset, preferences', links: [{ label: 'My Profile', href: '/profile' }] },
  { icon: MessageCircle, title: 'Need More Help?', desc: 'Our team is here for you', links: [{ label: 'Contact Us', href: '/contact' }] },
];

export default function HelpPage() {
  return (
    <PageTransition>
      <div className="container-main p-10 px-4 max-w-[800px]">
        <div className="text-center mb-10">
          <h1 className="font-outfit text-3xl font-bold mb-2">Help Center</h1>
          <p className="text-[var(--text-muted)] text-[15px] mb-6">How can we help you today?</p>
          <div className="relative max-w-[500px] mx-auto">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input placeholder="Search help articles..." className="input-glass pl-10 text-[15px]" />
          </div>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
          {topics.map(({ icon: Icon, title, desc, links }) => (
            <div key={title} className="glass-card p-6">
              <Icon size={24} className="text-[var(--primary)] mb-3" />
              <h3 className="font-outfit text-base font-semibold mb-1.5">{title}</h3>
              <p className="text-[13px] text-[var(--text-muted)] mb-3">{desc}</p>
              {links.map((l) => (
                <Link key={l.label} href={l.href} className="block text-[var(--primary)] text-[13px] font-medium no-underline py-0.5">
                  → {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
