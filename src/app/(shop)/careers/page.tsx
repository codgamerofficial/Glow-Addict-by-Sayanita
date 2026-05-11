'use client';
import { Briefcase, MapPin, Heart } from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';

export default function CareersPage() {
  return (
    <PageTransition>
      <div className="container-main p-10 px-4 max-w-[800px]">
        <div className="text-center mb-10">
          <h1 className="font-outfit text-3xl font-bold mb-2">Join Our Team</h1>
          <p className="text-[var(--text-muted)] text-[15px]">Help us build the future of beauty in India</p>
        </div>

        <div className="glass-card p-8 text-center mb-6">
          <Heart size={48} className="text-[var(--primary)] mb-4" />
          <h2 className="font-outfit text-xl font-bold mb-3">We&apos;re Growing!</h2>
          <p className="text-[var(--text-secondary)] text-[15px] leading-relaxed max-w-[500px] mx-auto mb-5">
            Glow Addict by Sayanita is always looking for passionate people who love beauty, technology, and making a difference. 
          </p>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
            If you&apos;re interested in joining our team, send your resume to <a href="mailto:careers@glowaddict.in" className="text-[var(--primary)] font-medium">careers@glowaddict.in</a>
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
          {[
            { icon: Briefcase, title: 'Content Creator', location: 'Remote', type: 'Part-time' },
            { icon: Briefcase, title: 'Social Media Manager', location: 'Remote', type: 'Full-time' },
            { icon: Briefcase, title: 'Beauty Consultant', location: 'India', type: 'Freelance' },
          ].map(({ icon: Icon, title, location, type }) => (
            <div key={title} className="glass-card p-6">
              <Icon size={22} className="text-[var(--primary)] mb-2.5" />
              <h3 className="font-outfit text-base font-semibold mb-1.5">{title}</h3>
              <div className="flex gap-2 text-[12px] text-[var(--text-muted)]">
                <span className="flex items-center gap-1"><MapPin size={12} /> {location}</span>
                <span>• {type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
