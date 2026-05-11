import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNav from '@/components/layout/MobileNav';
import { Sparkles } from 'lucide-react';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="ambient-mesh" aria-hidden />
      <div className="ambient-grain" aria-hidden />
      <Header />
      <main className="min-h-[80vh] relative">
        <section className="container-main pt-2 md:pt-3 pb-1">
          <div className="story-section px-4 py-3 md:px-5 md:py-3.5 relative overflow-hidden">
            <span className="floating-blob w-24 h-24 -right-6 -top-8 bg-pink-400/60" aria-hidden />
            <span className="floating-blob w-20 h-20 right-12 -bottom-8 bg-yellow-300/55" style={{ animationDelay: '1.2s' }} aria-hidden />
            <p className="text-sm md:text-[15px] text-white/90 font-semibold flex items-center gap-2 tracking-[0.01em]">
              <Sparkles size={16} className="text-yellow-300" />
              Today&apos;s Glow Story: from skin prep to final touch, each step is curated by beauty intelligence and real routines.
            </p>
          </div>
        </section>
        {children}
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
