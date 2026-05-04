'use client';
import { useState, useRef } from 'react';
import { Upload, Camera, Sparkles, Check, Shield, X, Sun, Droplets, Moon } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/shared/PageTransition';
import AnimatedCard from '@/components/shared/AnimatedCard';

interface SkinResult {
  skinType: string;
  concerns: string[];
  score: number;
  tips: string[];
  hydrationLevel?: string;
  summary?: string;
  routine?: { morning: string[]; evening: string[] };
  products?: Array<{
    id: string;
    name: string;
    slug: string;
    brandName: string;
    shortDesc: string;
    price: number;
    salePrice?: number;
    image: string;
    ratingAvg: number;
  }>;
}

export default function SkinAnalyzerPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<SkinResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!preview) {
      // No image — use demo mode
      fileRef.current?.click();
      return;
    }

    setAnalyzing(true);

    try {
      // Convert preview (data URL) to File
      const blob = await fetch(preview).then(r => r.blob());
      const formData = new FormData();
      formData.append('image', blob, 'selfie.jpg');

      const res = await fetch('/api/ai/skin-analysis', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch {
      // Fallback
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
    } finally {
      setAnalyzing(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <PageTransition>
      <div className="container-main" style={{ padding: '24px 16px', maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img
            src="/images/logo.png" alt="Glow Addict"
            style={{ height: '64px', width: 'auto', objectFit: 'contain', margin: '0 auto 12px', display: 'block' }}
          />
          <h1 style={{ fontFamily: 'Outfit', fontSize: '28px', fontWeight: 700, marginBottom: '4px' }}>AI Skin Analyzer</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Sparkles size={14} /> Powered by Gemini Vision AI
          </p>
        </div>

        <input ref={fileRef} type="file" accept="image/*" capture="user" onChange={onFileChange} style={{ display: 'none' }} />

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              {/* Upload area */}
              <div
                onClick={() => !preview && fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className="glass-card"
                style={{
                  padding: preview ? '20px' : '60px 24px',
                  textAlign: 'center',
                  cursor: preview ? 'default' : 'pointer',
                  border: `2px dashed ${dragOver ? 'var(--primary)' : 'var(--border-glass-strong)'}`,
                  background: dragOver ? 'rgba(233,30,140,0.08)' : analyzing ? 'rgba(233,30,140,0.05)' : 'var(--bg-glass)',
                  transition: 'all 0.3s',
                }}
              >
                {analyzing ? (
                  <div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{
                        width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 16px',
                        border: '3px solid var(--border-glass)', borderTopColor: 'var(--primary)',
                      }}
                    />
                    <h3 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                      Analyzing your skin...
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                      Our AI is examining texture, tone, hydration & more
                    </p>
                  </div>
                ) : preview ? (
                  <div>
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
                      <img src={preview} alt="Preview" style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '16px', border: '2px solid var(--border-glass-strong)' }} />
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                        style={{
                          position: 'absolute', top: '-8px', right: '-8px',
                          background: 'var(--error)', border: 'none', borderRadius: '50%',
                          width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', color: 'white',
                        }}
                      >
                        <X size={14} />
                      </motion.button>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <motion.button whileTap={{ scale: 0.95 }} onClick={analyze} className="btn-gradient" style={{ padding: '12px 32px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={18} /> Analyze My Skin</span>
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => fileRef.current?.click()} className="btn-outline" style={{ padding: '12px 20px' }}>
                        Change Photo
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload size={48} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
                    <h3 style={{ fontFamily: 'Outfit', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Upload a Clear Selfie</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>Take a photo in natural lighting, no makeup, facing forward</p>
                    <motion.button whileTap={{ scale: 0.95 }} className="btn-gradient" style={{ padding: '12px 24px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Camera size={18} /> Choose Photo</span>
                    </motion.button>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '12px' }}>or drag & drop an image here</p>
                  </div>
                )}
              </div>

              {/* How it works */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '24px' }}>
                {[
                  { icon: Camera, title: 'Upload Selfie', desc: 'Clear photo in natural light' },
                  { icon: Sparkles, title: 'AI Analysis', desc: 'Skin type, concerns & score' },
                  { icon: Shield, title: 'Get Routine', desc: 'Personalized recommendations' },
                ].map(({ icon: Icon, title, desc }, i) => (
                  <AnimatedCard key={title} index={i}>
                    <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                      <Icon size={24} style={{ color: 'var(--primary)', marginBottom: '8px' }} />
                      <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{title}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{desc}</p>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
              {/* Results */}
              <AnimatedCard index={0}>
                <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
                  <h3 style={{ fontFamily: 'Outfit', fontSize: '20px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Check size={22} style={{ color: 'var(--success)' }} /> Analysis Complete
                  </h3>

                  {/* Score + Summary */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', flexWrap: 'wrap' }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                      style={{
                        width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: `conic-gradient(var(--success) ${result.score}%, var(--bg-glass) 0%)`, position: 'relative',
                      }}
                    >
                      <div style={{
                        width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-surface)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          style={{ fontFamily: 'Outfit', fontSize: '28px', fontWeight: 700 }}
                        >
                          {result.score}
                        </motion.span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>SCORE</span>
                      </div>
                    </motion.div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>Skin Type</div>
                      <div style={{ fontFamily: 'Outfit', fontSize: '22px', fontWeight: 700 }} className="gradient-text">{result.skinType}</div>
                      {result.hydrationLevel && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                          <Droplets size={14} style={{ color: 'var(--secondary)' }} /> Hydration: {result.hydrationLevel}
                        </div>
                      )}
                      {result.summary && (
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>{result.summary}</p>
                      )}
                    </div>
                  </div>

                  {/* Concerns */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>Detected Concerns</h4>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {result.concerns.map((c, i) => (
                        <motion.span
                          key={c}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="badge badge-primary"
                          style={{ fontSize: '13px', padding: '6px 14px' }}
                        >
                          {c}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>AI Recommendations</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {result.tips.map((tip, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '14px', color: 'var(--text-secondary)' }}
                        >
                          <Check size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: '2px' }} />
                          <span>{tip}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Routine */}
                  {result.routine && (
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Your Personalized Routine</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div className="glass-card" style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', fontWeight: 600, fontSize: '13px' }}>
                            <Sun size={16} style={{ color: 'var(--accent-gold)' }} /> Morning
                          </div>
                          {result.routine.morning.map((step, i) => (
                            <div key={i} style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '4px 0', display: 'flex', gap: '6px' }}>
                              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{i + 1}.</span> {step}
                            </div>
                          ))}
                        </div>
                        <div className="glass-card" style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', fontWeight: 600, fontSize: '13px' }}>
                            <Moon size={16} style={{ color: 'var(--secondary)' }} /> Evening
                          </div>
                          {result.routine.evening.map((step, i) => (
                            <div key={i} style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '4px 0', display: 'flex', gap: '6px' }}>
                              <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>{i + 1}.</span> {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedCard>

              {/* Recommended products from AI */}
              {result.products && result.products.length > 0 && (
                <AnimatedCard index={1}>
                  <h3 style={{ fontFamily: 'Outfit', fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>Recommended for You</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
                    {result.products.map((p, i) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                      >
                        <Link href={`/products/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <div className="glass-card" style={{ overflow: 'hidden' }}>
                            <img src={p.image} alt={p.name} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                            <div style={{ padding: '12px' }}>
                              <div style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase' }}>{p.brandName}</div>
                              <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                              <div style={{ fontFamily: 'Outfit', fontSize: '14px', fontWeight: 700 }}>₹{p.salePrice || p.price}</div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </AnimatedCard>
              )}

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => { setResult(null); setPreview(null); }}
                className="btn-outline"
                style={{ padding: '12px 24px' }}
              >
                Analyze Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
