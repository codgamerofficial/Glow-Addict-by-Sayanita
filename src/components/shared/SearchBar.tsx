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
    <div className="relative max-w-[600px] mx-auto py-2">
      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text" 
          aria-label="Search products"
          placeholder="Search for products, brands, concerns..."
          value={query} onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="input-glass pl-[42px] pr-10 text-[15px]"
        />
        {onClose && (
          <button aria-label="Close search" onClick={onClose} className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-none border-none text-[var(--text-muted)] cursor-pointer p-1">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Results / Trending */}
      {query.trim() && (
        <div className="absolute top-full left-0 right-0 z-50 bg-[var(--bg-surface)] border border-[var(--border-glass)] rounded-xl mt-2 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          {results.length > 0 ? (
            <div className="p-2">
              {results.map((p) => (
                <Link key={p.id} href={`/products/${p.slug}`} onClick={onClose}
                  className="flex items-center gap-3 p-2.5 px-3 rounded-lg no-underline text-[var(--text-primary)] transition-colors duration-200 hover:bg-[var(--bg-glass)]"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-[var(--bg-glass)] shrink-0 relative">
                    <Image 
                      src={p.images[0]} 
                      alt={p.name} 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                      {p.name}
                    </div>
                    <div className="text-[12px] text-[var(--text-muted)]">{p.brandName}</div>
                  </div>
                  <div className="text-sm font-semibold text-[var(--primary)]">
                    ₹{p.salePrice || p.price}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-4">
              <div className="text-[12px] font-semibold text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
                <TrendingUp size={14} /> TRENDING SEARCHES
              </div>
              <div className="flex flex-wrap gap-2">
                {trending.map((t) => (
                  <button key={t} onClick={() => setQuery(t)} className="bg-[var(--bg-glass)] border border-[var(--border-glass)] rounded-full p-1.5 px-3.5 text-[13px] text-[var(--text-secondary)] cursor-pointer transition-all duration-200 hover:border-[var(--primary)] hover:text-[var(--primary)]">
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
