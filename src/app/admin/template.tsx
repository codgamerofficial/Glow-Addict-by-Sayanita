'use client';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { WandSparkles } from 'lucide-react';

const adminMap: Record<string, { title: string; kicker: string; blurb: string }> = {
  '/admin': {
    title: 'Control Room',
    kicker: 'Overview',
    blurb: 'Revenue, conversion, customers, and operations in one visual dashboard.',
  },
  '/admin/analytics': {
    title: 'Growth Intelligence',
    kicker: 'Insights',
    blurb: 'Trends, category movement, and demand behavior powered by live data.',
  },
  '/admin/orders': {
    title: 'Order Operations',
    kicker: 'Execution',
    blurb: 'Manage fulfillment, status updates, and post-purchase trust at scale.',
  },
  '/admin/products': {
    title: 'Catalog Studio',
    kicker: 'Merchandising',
    blurb: 'Craft the product narrative with stronger visuals and conversion metadata.',
  },
  '/admin/customers': {
    title: 'Customer Pulse',
    kicker: 'Audience',
    blurb: 'Monitor loyalty, repeat behavior, and high-value user segments quickly.',
  },
  '/admin/settings': {
    title: 'Platform Configuration',
    kicker: 'System',
    blurb: 'Tune workflows, permissions, and business controls with confidence.',
  },
};

function resolveAdminContent(pathname: string) {
  if (adminMap[pathname]) {
    return adminMap[pathname];
  }

  return {
    title: 'Glow Addict Admin Experience',
    kicker: 'Workspace',
    blurb: 'Every admin section now shares one consistent visual and motion language.',
  };
}

export default function AdminTemplate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const content = resolveAdminContent(pathname);
  const hideHero = pathname === '/admin/login';

  return (
    <div>
      {!hideHero && <motion.section
        initial={{ opacity: 0, y: 16, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.2, 0.75, 0.2, 1] }}
        className="story-section relative overflow-hidden p-4 md:p-6 mb-5"
      >
        <span className="floating-blob w-20 h-20 -top-8 right-16 bg-cyan-300/45" aria-hidden />
        <span className="floating-blob w-20 h-20 top-10 -left-8 bg-pink-300/45" style={{ animationDelay: '1.3s' }} aria-hidden />

        <p className="story-kicker text-sm text-white/85 mb-1">{content.kicker}</p>
        <h1 className="story-title text-2xl md:text-3xl font-black text-white mb-2">{content.title}</h1>
        <p className="text-sm md:text-[15px] text-white/85 max-w-3xl">{content.blurb}</p>

        <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-white/90 bg-white/10 rounded-full px-3 py-1.5 border border-white/20">
          <WandSparkles size={14} className="text-yellow-300" />
          Unified motion, color, and visual hierarchy active
        </div>
      </motion.section>}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.2, 0.75, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
