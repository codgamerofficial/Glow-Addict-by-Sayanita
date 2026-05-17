'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, TrendingUp, X } from 'lucide-react';
import { products } from '@/data/products';

export function SearchBar({ onClose }: { onClose?: () => void }) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(q) ||
          product.brandName.toLowerCase().includes(q) ||
          product.categoryName.toLowerCase().includes(q) ||
          product.tags.some((tag: string) => tag.includes(q)),
      )
      .slice(0, 6);
  }, [query]);

  const trending = ['Vitamin C Serum', 'Sunscreen', 'Niacinamide', 'Lipstick', 'Retinol'];

  return (
    <div className="search-shell">
      <div className="search-input-wrap">
        <Search size={18} />
        <input
          type="text"
          aria-label="Search products"
          placeholder="Search products, brands, concerns..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoFocus
          className="input-glass"
        />
        {onClose && (
          <button type="button" aria-label="Close search" onClick={onClose}>
            <X size={18} />
          </button>
        )}
      </div>

      {query.trim() && (
        <div className="search-results">
          {results.length > 0 ? (
            <div className="search-result-list">
              {results.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`} onClick={onClose} className="search-result">
                  <div className="search-thumb">
                    <Image src={product.images[0]} alt={product.name} fill sizes="44px" />
                  </div>
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.brandName}</span>
                  </div>
                  <em>&#8377;{(product.salePrice || product.price).toLocaleString()}</em>
                </Link>
              ))}
            </div>
          ) : (
            <div className="search-trending">
              <div>
                <TrendingUp size={14} /> Trending searches
              </div>
              <div>
                {trending.map((item) => (
                  <button key={item} type="button" onClick={() => setQuery(item)}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        .search-shell {
          position: relative;
          max-width: 720px;
          margin: 0 auto;
          padding: 8px 0;
        }

        .search-input-wrap {
          position: relative;
        }

        .search-input-wrap > svg {
          position: absolute;
          top: 50%;
          left: 16px;
          z-index: 1;
          color: var(--text-muted);
          transform: translateY(-50%);
        }

        .search-input-wrap input {
          padding-left: 46px;
          padding-right: 44px;
          font-size: 15px;
        }

        .search-input-wrap button {
          position: absolute;
          top: 50%;
          right: 10px;
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          border: 0;
          border-radius: 999px;
          color: var(--text-muted);
          background: transparent;
          cursor: pointer;
          transform: translateY(-50%);
        }

        .search-input-wrap button:hover {
          color: var(--primary);
          background: var(--bg-surface-hover);
        }

        .search-results {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 50;
          overflow: hidden;
          margin-top: 10px;
          border: 1px solid var(--line);
          border-radius: 22px;
          background: var(--bg-surface);
          box-shadow: var(--shadow-soft);
        }

        .search-result-list {
          padding: 8px;
        }

        .search-result {
          display: grid;
          grid-template-columns: 44px minmax(0, 1fr) auto;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 15px;
          color: var(--text-primary);
          text-decoration: none;
          transition: background 0.2s var(--spring);
        }

        .search-result:hover {
          background: var(--bg-surface-hover);
        }

        .search-thumb {
          position: relative;
          width: 44px;
          height: 44px;
          overflow: hidden;
          border-radius: 12px;
          background: var(--bg-surface-hover);
        }

        .search-thumb img {
          object-fit: cover;
        }

        .search-result strong,
        .search-result span {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .search-result strong {
          font-size: 14px;
          font-weight: 800;
        }

        .search-result span {
          margin-top: 2px;
          color: var(--text-muted);
          font-size: 12px;
          font-weight: 700;
        }

        .search-result em {
          color: var(--primary);
          font-style: normal;
          font-weight: 900;
        }

        .search-trending {
          padding: 16px;
        }

        .search-trending > div:first-child {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
          color: var(--text-muted);
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .search-trending > div:last-child {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .search-trending button {
          min-height: 34px;
          padding: 7px 13px;
          border: 1px solid var(--line);
          border-radius: 999px;
          color: var(--text-secondary);
          background: var(--bg-surface-hover);
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
        }

        .search-trending button:hover {
          color: var(--primary);
          border-color: rgba(245, 31, 123, 0.26);
        }
      `}</style>
    </div>
  );
}
