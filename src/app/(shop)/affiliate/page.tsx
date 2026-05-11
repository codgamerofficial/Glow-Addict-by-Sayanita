'use client';
import PageTransition from '@/components/shared/PageTransition';
import { DollarSign, Users, TrendingUp, Gift } from 'lucide-react';
import Link from 'next/link';

export default function AffiliatePage() {
  return (
    <PageTransition>
      <div className="container-main p-10 px-4 max-w-[800px]">
        <div className="text-center mb-10">
          <h1 className="font-outfit text-3xl font-bold mb-2">
            <span className="gradient-text">Affiliate Program</span>
          </h1>
          <p className="text-[var(--text-muted)] text-[15px]">Earn by sharing beauty you love</p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-8">
          {[
            { icon: DollarSign, title: 'Up to 15% Commission', desc: 'Earn on every sale through your unique referral link.' },
            { icon: Users, title: 'For Everyone', desc: 'Bloggers, influencers, content creators — everyone is welcome.' },
            { icon: TrendingUp, title: 'Real-Time Dashboard', desc: 'Track clicks, conversions, and earnings in real time.' },
            { icon: Gift, title: 'Exclusive Perks', desc: 'Early access to new launches and free product samples.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card p-6 text-center">
              <Icon size={28} className="text-[var(--primary)] mb-3" />
              <h3 className="font-outfit text-base font-semibold mb-2">{title}</h3>
              <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/contact" className="btn-gradient p-3.5 px-8 text-[15px] no-underline inline-block">
            <span>Apply Now</span>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}
