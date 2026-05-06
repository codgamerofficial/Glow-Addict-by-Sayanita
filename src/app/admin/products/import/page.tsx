'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle, ArrowLeft, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ImportPage() {
  const router = useRouter();
  const [dragOver, setDragOver] = useState(false);
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'done'>('upload');
  const [fileName, setFileName] = useState('');

  const handleFile = () => { setFileName('products_batch_may2026.csv'); setStep('mapping'); };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button aria-label="Go back" onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-secondary)', cursor: 'pointer' }}><ArrowLeft size={16} /></button>
        <div><h1 style={{ fontFamily: 'Outfit', fontSize: 24, fontWeight: 700 }}>Bulk Import Products</h1><p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Import products from CSV or Excel files</p></div>
      </motion.div>

      {/* Steps */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 28 }}>
        {['Upload File', 'Map Columns', 'Preview & Validate', 'Complete'].map((s, i) => (
          <div key={s} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, background: i <= ['upload', 'mapping', 'preview', 'done'].indexOf(step) ? 'linear-gradient(135deg, #E91E8C, #7C3AED)' : 'rgba(255,255,255,0.06)', color: '#fff' }}>{i + 1}</div>
            <span style={{ fontSize: 12, color: i <= ['upload', 'mapping', 'preview', 'done'].indexOf(step) ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: 500 }}>{s}</span>
            {i < 3 && <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 8px' }} />}
          </div>
        ))}
      </div>

      {step === 'upload' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div onClick={handleFile} onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); handleFile(); }}
            style={{ border: `2px dashed ${dragOver ? '#E91E8C' : 'rgba(255,255,255,0.1)'}`, borderRadius: 20, padding: 60, textAlign: 'center', cursor: 'pointer', background: dragOver ? 'rgba(233,30,140,0.05)' : 'rgba(255,255,255,0.02)', transition: 'all 0.3s ease' }}>
            <FileSpreadsheet size={48} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
            <p style={{ fontSize: 16, fontWeight: 600, fontFamily: 'Outfit', marginBottom: 6 }}>Upload CSV or Excel file</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Drag & drop or click to browse</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Supported: .csv, .xlsx, .xls</p>
          </div>
          <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13 }}><Download size={14} /> Download Template</button>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Download our CSV template with all required columns</span>
          </div>
        </motion.div>
      )}

      {step === 'mapping' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <FileSpreadsheet size={16} style={{ color: '#10B981' }} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>{fileName}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>• 48 rows detected</span>
          </div>
          <h3 style={{ fontFamily: 'Outfit', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Map Columns</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr', gap: 12, alignItems: 'center' }}>
            {[['Column A', 'Product Name'], ['Column B', 'Brand'], ['Column C', 'Category'], ['Column D', 'Price'], ['Column E', 'Stock'], ['Column F', 'Description']].map(([csv, field]) => (
              <React.Fragment key={csv}>
                <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', fontSize: 13, color: 'var(--text-secondary)' }}>{csv}</div>
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>→</div>
                <select aria-label="Map column" style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }}>
                  <option>{field}</option>
                </select>
              </React.Fragment>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
            <button onClick={() => setStep('upload')} style={{ padding: '10px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13 }}>Back</button>
            <button onClick={() => setStep('preview')} style={{ padding: '10px 18px', borderRadius: 10, background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Validate & Preview</button>
          </div>
        </motion.div>
      )}

      {step === 'preview' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div style={{ padding: '16px 20px', borderRadius: 12, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}><CheckCircle size={16} style={{ color: '#10B981' }} /><span style={{ fontSize: 12, color: '#10B981', fontWeight: 600 }}>Valid</span></div>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Outfit' }}>45</div>
            </div>
            <div style={{ padding: '16px 20px', borderRadius: 12, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}><AlertCircle size={16} style={{ color: '#F59E0B' }} /><span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 600 }}>Warnings</span></div>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Outfit' }}>2</div>
            </div>
            <div style={{ padding: '16px 20px', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}><AlertCircle size={16} style={{ color: '#EF4444' }} /><span style={{ fontSize: 12, color: '#EF4444', fontWeight: 600 }}>Errors</span></div>
              <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'Outfit' }}>1</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button onClick={() => setStep('mapping')} style={{ padding: '10px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13 }}>Back</button>
            <button onClick={() => setStep('done')} style={{ padding: '10px 18px', borderRadius: 10, background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Import 45 Products</button>
          </div>
        </motion.div>
      )}

      {step === 'done' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: 60 }}>
          <CheckCircle size={48} style={{ color: '#10B981', marginBottom: 16 }} />
          <h2 style={{ fontFamily: 'Outfit', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Import Complete!</h2>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>45 products have been imported successfully.</p>
          <button onClick={() => router.push('/admin/products')} style={{ padding: '10px 24px', borderRadius: 10, background: 'linear-gradient(135deg, #E91E8C, #7C3AED)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>View Products</button>
        </motion.div>
      )}
    </div>
  );
}
