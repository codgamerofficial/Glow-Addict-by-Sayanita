'use client';
import { useState } from 'react';
import { Upload, Camera, Sparkles, Check, ArrowRight, Droplets, Sun, Shield } from 'lucide-react';
import Link from 'next/link';
import { products } from '@/data/products';
import ProductCard from '@/components/product/ProductCard';

export default function SkinAnalyzerPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<null | { skinType: string; concerns: string[]; score: number; tips: string[] }>(null);

  const analyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setResult({
        skinType: 'Combination',
        concerns: ['Mild Acne', 'Dark Spots', 'Open Pores'],
        score: 74,
        tips: [
          'Use a gentle cleanser twice daily',
          'Apply Niacinamide serum for pore control',
          'Vitamin C in the morning for dark spots',
          'Never skip SPF 50+ sunscreen',
          'Use Retinol 2-3 times a week at night',
        ],
      });
      setAnalyzing(false);
    }, 3000);
  };

  const recommended = result ? products.filter(p =>
    p.skinTypes.includes('Combination') || p.concerns.some(c => ['Acne', 'Dark Spots', 'Pores'].includes(c))
  ).slice(0, 4) : [];

  return (
    <div className="container-main animate-fade-in" style={{ padding: '24px 16px', maxWidth: '800px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <img src="/images/logo.png" alt="Glow Addict" style={{ height: '64px', width: 'auto', objectFit: 'contain', margin: '0 auto 12px', display: 'block' }} />
        <h1 style={{ fontFamily: 'Outfit', fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>AI Skin Analyzer</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Upload a selfie and get personalized skincare recommendations</p>
      </div>

      {!result ? (
        <div>
          {/* Upload area */}
          <div onClick={analyze} className="glass-card" style={{
            padding: '60px 24px', textAlign: 'center', cursor: 'pointer',
            border: '2px dashed var(--border-glass-strong)',
            background: analyzing ? 'rgba(233,30,140,0.05)' : 'var(--bg-glass)',
            transition: 'all 0.3s',
          }}>
            {analyzing ? (
              <div>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 16px',
                  border: '3px solid var(--border-glass)', borderTopColor: 'var(--primary)',
                  animation: 'spin 1s linear infinite',
                }} />
                <h3 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Analyzing your skin...</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Our AI is examining texture, tone, hydration & more</p>
              </div>
            ) : (
              <div>
                <Upload size={48} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
                <h3 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Upload a Clear Selfie</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>Take a photo in natural lighting, no makeup, facing forward</p>
                <button className="btn-gradient" style={{ padding: '12px 24px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Camera size={18} /> Click to Analyze</span>
                </button>
              </div>
            )}
          </div>

          {/* How it works */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '24px' }}>
            {[
              { icon: Camera, title: 'Upload Selfie', desc: 'Clear photo in natural light' },
              { icon: Sparkles, title: 'AI Analysis', desc: 'Skin type, concerns & score' },
              { icon: Shield, title: 'Get Routine', desc: 'Personalized product recommendations' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                <Icon size={24} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
                <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{title}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Results */}
          <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
            <h3 style={{ fontFamily: 'Outfit', fontSize: '20px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={22} style={{ color: 'var(--success)' }} /> Analysis Complete
            </h3>

            {/* Score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <div style={{
                width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `conic-gradient(var(--success) ${result.score}%, var(--bg-glass) 0%)`, position: 'relative',
              }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-surface)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontFamily: 'Outfit', fontSize: '28px', fontWeight: 700 }}>{result.score}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>SCORE</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>Skin Type</div>
                <div style={{ fontFamily: 'Outfit', fontSize: '22px', fontWeight: 700 }} className="gradient-text">{result.skinType}</div>
              </div>
            </div>

            {/* Concerns */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Detected Concerns</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {result.concerns.map(c => <span key={c} className="badge badge-primary" style={{ fontSize: '13px', padding: '6px 14px' }}>{c}</span>)}
              </div>
            </div>

            {/* Tips */}
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>AI Recommendations</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.tips.map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <Check size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended products */}
          <h3 style={{ fontFamily: 'Outfit', fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Recommended for You</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {recommended.map(p => <ProductCard key={p.id} product={p} />)}
          </div>

          <button onClick={() => setResult(null)} className="btn-outline" style={{ padding: '12px 24px' }}>Analyze Again</button>
        </div>
      )}

      <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
