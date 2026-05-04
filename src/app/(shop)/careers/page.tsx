'use client';
import { Briefcase, MapPin, Heart } from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';

export default function CareersPage() {
  return (
    <PageTransition>
      <div className="container-main" style={{ padding: '40px 16px', maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'Outfit', fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>Join Our Team</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Help us build the future of beauty in India</p>
        </div>

        <div className="glass-card" style={{ padding: '32px', textAlign: 'center', marginBottom: '24px' }}>
          <Heart size={48} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
          <h2 style={{ fontFamily: 'Outfit', fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>We&apos;re Growing!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7, maxWidth: '500px', margin: '0 auto 20px' }}>
            Glow Addict by Sayanita is always looking for passionate people who love beauty, technology, and making a difference. 
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.7 }}>
            If you&apos;re interested in joining our team, send your resume to <a href="mailto:careers@glowaddict.in" style={{ color: 'var(--primary)', fontWeight: 500 }}>careers@glowaddict.in</a>
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {[
            { icon: Briefcase, title: 'Content Creator', location: 'Remote', type: 'Part-time' },
            { icon: Briefcase, title: 'Social Media Manager', location: 'Remote', type: 'Full-time' },
            { icon: Briefcase, title: 'Beauty Consultant', location: 'India', type: 'Freelance' },
          ].map(({ icon: Icon, title, location, type }) => (
            <div key={title} className="glass-card" style={{ padding: '24px' }}>
              <Icon size={22} style={{ color: 'var(--primary)', marginBottom: '10px' }} />
              <h3 style={{ fontFamily: 'Outfit', fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>{title}</h3>
              <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {location}</span>
                <span>• {type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
