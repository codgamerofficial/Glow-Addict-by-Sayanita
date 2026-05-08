'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, TrendingUp, X } from 'lucide-react';
import { products } from '@/data/products';

import Image from 'next/image';

export function SearchBar({ onClose }: { onClose?: () => void }) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brandName.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q))
    ).slice(0, 6);
  }, [query]);

  const trending = ['Vitamin C Serum', 'Sunscreen', 'Niacidamide', 'Lipstick', 'Retinol'];

  return (
    <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto', padding: '8px 0' }}>
      <div style={{ position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text" 
          aria-label="Search products"
          placeholder="Search for products, brands, concerns..."
          value={query} onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="input-glass"
          style={{ paddingLeft: '42px', paddingRight: '40px', fontSize: '15px' }}
        />
        {onClose && (
          <button aria-label="Close search" onClick={onClose} style={{
            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px',
          }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Results / Trending */}
      {query.trim() && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
          background: 'var(--bg-surface)', border: '1px solid var(--border-glass)',
          borderRadius: '12px', marginTop: '8px', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}>
          {results.length > 0 ? (
            <div style={{ padding: '8px' }}>
              {results.map((p) => (
                <Link key={p.id} href={`/products/${p.slug}`} onClick={onClose}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 12px', borderRadius: '8px', textDecoration: 'none',
                    color: 'var(--text-primary)', transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-glass)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden',
                    background: 'var(--bg-glass)', flexShrink: 0, position: 'relative'
                  }}>
                    <Image 
                      src={p.images[0]} 
                      alt={p.name} 
                      fill
                      style={{ objectFit: 'cover' }} 
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{p.brandName}</div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>
                    ₹{p.salePrice || p.price}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ padding: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp size={14} /> TRENDING SEARCHES
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {trending.map((t) => (
                  <button key={t} onClick={() => setQuery(t)} style={{
                    background: 'var(--bg-glass)', border: '1px solid var(--border-glass)',
                    borderRadius: '20px', padding: '6px 14px', fontSize: '13px',
                    color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-glass)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
