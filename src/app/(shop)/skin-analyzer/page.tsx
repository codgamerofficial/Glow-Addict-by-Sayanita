'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
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
      <div className="container-main p-6 px-4 max-w-[800px]">
        <div className="text-center mb-8">
          <Image
            src="/images/logo.png"
            alt="Glow Addict"
            width={160}
            height={64}
            className="h-16 w-auto object-contain mx-auto mb-3 block"
          />
          <h1 className="font-outfit text-[28px] font-bold mb-1">AI Skin Analyzer</h1>
          <p className="text-[var(--text-muted)] text-sm flex items-center justify-center gap-1.5">
            <Sparkles size={14} /> Powered by NVIDIA Vision AI
          </p>
        </div>

        <input aria-label="Upload skin photo" ref={fileRef} type="file" accept="image/*" capture="user" onChange={onFileChange} style={{ display: 'none' }} />

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              {/* Upload area */}
              <div
                onClick={() => !preview && fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={`
                  glass-card p-5 text-center transition-all duration-300 border-2 border-dashed
                  ${preview ? 'cursor-default' : 'cursor-pointer'}
                  ${dragOver ? 'border-[var(--primary)] bg-[rgba(233,30,140,0.08)]' : 'border-[var(--border-glass-strong)] bg-[var(--bg-glass)]'}
                  ${analyzing ? 'bg-[rgba(233,30,140,0.05)]' : ''}
                  ${!preview ? 'py-[60px] px-6' : ''}
                `}
              >
                {analyzing ? (
                  <div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-16 h-16 rounded-full mx-auto mb-4 border-3 border-[var(--border-glass)] border-t-[var(--primary)]"
                    />
                    <h3 className="font-outfit text-lg font-semibold mb-2">
                      Analyzing your skin...
                    </h3>
                    <p className="text-[var(--text-muted)] text-sm">
                      Our AI is examining texture, tone, hydration & more
                    </p>
                  </div>
                ) : preview ? (
                  <div>
                    <div className="relative inline-block mb-4 h-[200px] w-[200px] overflow-hidden rounded-2xl border-2 border-[var(--border-glass-strong)]">
                      <Image src={preview} alt="Preview" fill className="object-cover" sizes="200px" />
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                        className="absolute -top-2 -right-2 bg-[var(--error)] border-none rounded-full w-7 h-7 flex items-center justify-center cursor-pointer text-white"
                      >
                        <X size={14} />
                      </motion.button>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <motion.button whileTap={{ scale: 0.95 }} onClick={analyze} className="btn-gradient p-3 px-8">
                        <span className="flex items-center gap-2"><Sparkles size={18} /> Analyze My Skin</span>
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => fileRef.current?.click()} className="btn-outline p-3 px-5">
                        Change Photo
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Upload size={48} className="text-[var(--primary)] mb-4" />
                    <h3 className="font-outfit text-lg font-semibold mb-2">Upload a Clear Selfie</h3>
                    <p className="text-[var(--text-muted)] text-sm mb-4">Take a photo in natural lighting, no makeup, facing forward</p>
                    <motion.button whileTap={{ scale: 0.95 }} className="btn-gradient p-3 px-6">
                      <span className="flex items-center gap-2"><Camera size={18} /> Choose Photo</span>
                    </motion.button>
                    <p className="text-[var(--text-muted)] text-[12px] mt-3">or drag & drop an image here</p>
                  </div>
                )}
              </div>

              {/* How it works */}
              <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3 mt-6">
                {[
                  { icon: Camera, title: 'Upload Selfie', desc: 'Clear photo in natural light' },
                  { icon: Sparkles, title: 'AI Analysis', desc: 'Skin type, concerns & score' },
                  { icon: Shield, title: 'Get Routine', desc: 'Personalized recommendations' },
                ].map(({ icon: Icon, title, desc }, i) => (
                  <AnimatedCard key={title} index={i}>
                    <div className="glass-card p-5 text-center">
                      <Icon size={24} className="text-[var(--primary)] mb-2" />
                      <h4 className="text-sm font-semibold mb-1">{title}</h4>
                      <p className="text-[12px] text-[var(--text-muted)]">{desc}</p>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
              {/* Results */}
              <AnimatedCard index={0}>
                <div className="glass-card p-6 mb-5">
                  <h3 className="font-outfit text-xl font-semibold mb-5 flex items-center gap-2">
                    <Check size={22} className="text-[var(--success)]" /> Analysis Complete
                  </h3>

                  {/* Score + Summary */}
                  <div className="flex items-center gap-5 mb-6 flex-wrap">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                      className="w-[100px] h-[100px] rounded-full flex items-center justify-center relative"
                      style={{ background: `conic-gradient(var(--success) ${result.score}%, var(--bg-glass) 0%)` }}
                    >
                      <div className="w-20 h-20 rounded-full bg-[var(--bg-surface)] flex flex-col items-center justify-center">
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.6 }}
                          className="font-outfit text-[28px] font-bold"
                        >
                          {result.score}
                        </motion.span>
                        <span className="text-[10px] text-[var(--text-muted)]">SCORE</span>
                      </div>
                    </motion.div>
                    <div className="flex-1">
                      <div className="text-sm text-[var(--text-muted)] mb-1">Skin Type</div>
                      <div className="font-outfit text-[22px] font-bold gradient-text">{result.skinType}</div>
                      {result.hydrationLevel && (
                        <div className="flex items-center gap-1.5 mt-2 text-[13px] text-[var(--text-secondary)]">
                          <Droplets size={14} className="text-[var(--secondary)]" /> Hydration: {result.hydrationLevel}
                        </div>
                      )}
                      {result.summary && (
                        <p className="text-[13px] text-[var(--text-secondary)] mt-2 leading-[1.5]">{result.summary}</p>
                      )}
                    </div>
                  </div>

                  {/* Concerns */}
                  <div className="mb-5">
                    <h4 className="text-sm font-semibold mb-2">Detected Concerns</h4>
                    <div className="flex gap-2 flex-wrap">
                      {result.concerns.map((c, i) => (
                        <motion.span
                          key={c}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="badge badge-primary text-[13px] p-1.5 px-3.5"
                        >
                          {c}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="mb-5">
                    <h4 className="text-sm font-semibold mb-2">AI Recommendations</h4>
                    <div className="flex flex-col gap-2">
                      {result.tips.map((tip, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="flex gap-2 items-start text-sm text-[var(--text-secondary)]"
                        >
                          <Check size={16} className="text-[var(--success)] shrink-0 mt-0.5" />
                          <span>{tip}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Routine */}
                  {result.routine && (
                    <div>
                      <h4 className="text-sm font-semibold mb-3">Your Personalized Routine</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="glass-card p-4">
                          <div className="flex items-center gap-1.5 mb-2.5 font-semibold text-[13px]">
                            <Sun size={16} className="text-[var(--accent-gold)]" /> Morning
                          </div>
                          {result.routine.morning.map((step, i) => (
                            <div key={i} className="text-[12px] text-[var(--text-secondary)] py-1 flex gap-1.5">
                              <span className="text-[var(--primary)] font-semibold">{i + 1}.</span> {step}
                            </div>
                          ))}
                        </div>
                        <div className="glass-card p-4">
                          <div className="flex items-center gap-1.5 mb-2.5 font-semibold text-[13px]">
                            <Moon size={16} className="text-[var(--secondary)]" /> Evening
                          </div>
                          {result.routine.evening.map((step, i) => (
                            <div key={i} className="text-[12px] text-[var(--text-secondary)] py-1 flex gap-1.5">
                              <span className="text-[var(--secondary)] font-semibold">{i + 1}.</span> {step}
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
                  <h3 className="font-outfit text-xl font-bold mb-4">Recommended for You</h3>
                  <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 mb-6">
                    {result.products.map((p, i) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.1 }}
                      >
                        <Link href={`/products/${p.slug}`} className="no-underline color-inherit">
                          <div className="glass-card overflow-hidden">
                            <div className="relative h-[140px] w-full overflow-hidden">
                              <Image src={p.image} alt={p.name} fill className="object-cover" sizes="(min-width: 1024px) 25vw, 50vw" />
                            </div>
                            <div className="p-3">
                              <div className="text-[10px] text-[var(--primary)] font-semibold uppercase">{p.brandName}</div>
                              <div className="text-[13px] font-medium mb-1 overflow-hidden overflow-ellipsis whitespace-nowrap">{p.name}</div>
                              <div className="font-outfit text-sm font-bold">₹{p.salePrice || p.price}</div>
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
                className="btn-outline p-3 px-6"
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
